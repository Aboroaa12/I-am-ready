import React, { useState } from 'react';
import { Users, Download, Upload, Plus, Trash2, AlertTriangle, Check, RefreshCw, FileText, Key } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BulkStudentCodeGeneratorProps {
  onSuccess: (count: number) => void;
}

interface StudentData {
  id: string;
  name: string;
  gender: 'male' | 'female';
  grade: number;
  notes?: string;
}

const BulkStudentCodeGenerator: React.FC<BulkStudentCodeGeneratorProps> = ({ onSuccess }) => {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [bulkSettings, setBulkSettings] = useState({
    grade: 1,
    expiresAt: '2026-03-01',
    prefix: 'STU',
    addNotes: true
  });
  const [generatedCodes, setGeneratedCodes] = useState<{student: string, code: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'manual' | 'import'>('manual');

  const generateRandomCode = (grade: number): string => {
    const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
    const gradeStr = grade.toString().padStart(2, '0');
    return `${bulkSettings.prefix}${gradeStr}${randomPart}`;
  };

  const addStudent = () => {
    const newStudent: StudentData = {
      id: Date.now().toString(),
      name: '',
      gender: 'male',
      grade: bulkSettings.grade,
      notes: ''
    };
    setStudents([...students, newStudent]);
  };

  const updateStudent = (id: string, field: keyof StudentData, value: string | number) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, [field]: value } : student
    ));
  };

  const removeStudent = (id: string) => {
    setStudents(students.filter(student => student.id !== id));
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const lines = content.split('\n');
        const importedStudents: StudentData[] = [];
        
        // Skip header line if it exists
        const startIndex = lines[0].includes('اسم') || lines[0].includes('name') ? 1 : 0;
        
        for (let i = startIndex; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line) {
            const parts = line.split(',');
            if (parts.length >= 1 && parts[0].trim()) {
              importedStudents.push({
                id: Date.now().toString() + i,
                name: parts[0].trim(),
                gender: parts[1]?.toLowerCase() === 'female' || parts[1]?.toLowerCase() === 'أنثى' ? 'female' : 'male',
                grade: parts[1] ? parseInt(parts[1].trim()) || bulkSettings.grade : bulkSettings.grade,
                notes: parts[2]?.trim() || ''
              });
            }
          }
        }
        
        setStudents([...students, ...importedStudents]);
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    e.target.value = '';
  };

  const downloadTemplate = () => {
    const csvContent = [
      ['اسم الطالب', 'الجنس', 'الصف', 'ملاحظات'].join(','),
      ['أحمد محمد', 'ذكر', '5', 'طالب متميز'].join(','),
      ['فاطمة علي', 'أنثى', '5', ''].join(','),
      ['محمد سالم', 'ذكر', '6', 'يحتاج متابعة'].join(',')
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'students_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (students.length === 0) {
      alert('يرجى إضافة طلاب أولاً');
      return;
    }

    const validStudents = students.filter(s => s.name.trim());
    if (validStudents.length === 0) {
      alert('يرجى إدخال أسماء الطلاب');
      return;
    }

    setLoading(true);

    try {
      const createdCodes: {student: string, code: string}[] = [];
      
      for (const student of validStudents) {
        // Step 1: Create student record
        const studentData = {
          name: student.name.trim(),
          gender: student.gender,
          grade: student.grade,
          teacher_id: null,
          join_date: new Date().toISOString(),
          last_active: new Date().toISOString(),
          is_active: true,
          notes: student.notes || `طالب تم إنشاؤه من المولد المجمع للمدير`,
          parent_email: null,
          student_number: null,
          class_room_ids: []
        };
        
        const { data: studentRecord, error: studentError } = await supabase
          .from('students')
          .insert([studentData])
          .select()
          .single();
        
        if (studentError) {
          console.error(`فشل في إنشاء سجل الطالب ${student.name}:`, studentError);
          continue;
        }
        
        // Step 2: Generate access code
        const keyCode = generateRandomCode(student.grade);
        
        const accessCodeData = {
          code: keyCode,
          grade: student.grade,
          description: `مفتاح دخول للطالب: ${student.name.trim()} - الصف ${student.grade} (مولد مجمع)`,
          teacher_id: null,
          expires_at: bulkSettings.expiresAt ? new Date(bulkSettings.expiresAt).toISOString() : null,
          is_active: true,
          usage_count: 0,
          max_usage: null,
          student_id: studentRecord.id,
          teacher_name: null,
          teacher_phone: null,
          is_teacher: false,
          is_admin: false
        };
        
        const { error: accessCodeError } = await supabase
          .from('access_codes')
          .insert([accessCodeData]);
        
        if (accessCodeError) {
          console.error(`فشل في إنشاء مفتاح الدخول للطالب ${student.name}:`, accessCodeError);
          // Delete the student record if access code creation fails
          await supabase.from('students').delete().eq('id', studentRecord.id);
          continue;
        }
        
        // Step 3: Create student progress record
        const progressData = {
          student_id: studentRecord.id,
          total_score: 0,
          current_streak: 0,
          units_completed: [],
          words_learned: 0,
          last_study_date: new Date().toISOString(),
          word_progress: {},
          study_sessions: [],
          total_study_time: 0
        };
        
        await supabase.from('user_progress').insert([progressData]);
        
        createdCodes.push({
          student: student.name,
          code: keyCode
        });
      }
      
      setGeneratedCodes(createdCodes);
      onSuccess(createdCodes.length);
      
    } catch (error: any) {
      console.error('Error creating bulk student codes:', error);
      alert(`حدث خطأ: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const exportCodes = () => {
    const csvContent = [
      ['اسم الطالب', 'الجنس', 'رمز الدخول', 'الصف', 'تاريخ الإنشاء', 'تاريخ الانتهاء'].join(','),
      ...generatedCodes.map(item => [
        item.student,
        students.find(s => s.name === item.student)?.gender === 'female' ? 'أنثى' : 'ذكر',
        item.code,
        bulkSettings.grade,
        new Date().toLocaleDateString('ar-SA'),
        bulkSettings.expiresAt ? new Date(bulkSettings.expiresAt).toLocaleDateString('ar-SA') : 'غير محدد'
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `student_access_codes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTodayDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  };

  if (generatedCodes.length > 0) {
    return (
      <div className="p-6">
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-center gap-2 mb-4 text-green-600">
            <Check className="w-8 h-8" />
            <h4 className="text-xl font-bold">تم إنشاء رموز الطلاب بنجاح!</h4>
          </div>
          
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-green-700 mb-2">{generatedCodes.length}</div>
            <p className="text-gray-600">رمز دخول تم إنشاؤه للطلاب</p>
          </div>
          
          <div className="bg-white border border-green-200 rounded-lg max-h-64 overflow-y-auto mb-6">
            <table className="w-full">
              <thead className="bg-green-50">
                <tr>
                  <th className="text-right py-2 px-4 font-semibold text-green-800">اسم الطالب</th>
                  <th className="text-right py-2 px-4 font-semibold text-green-800">الجنس</th>
                  <th className="text-right py-2 px-4 font-semibold text-green-800">رمز الدخول</th>
                </tr>
              </thead>
              <tbody>
                {generatedCodes.map((item, index) => (
                  <tr key={index} className="border-t border-green-100">
                    <td className="py-2 px-4">{item.student}</td>
                    <td className="py-2 px-4">
                      {students.find(s => s.name === item.student)?.gender === 'female' ? '👩‍🎓 أنثى' : '👨‍🎓 ذكر'}
                    </td>
                    <td className="py-2 px-4 font-mono font-bold text-green-700">{item.code}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-center gap-3">
            <button
              onClick={exportCodes}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              تصدير الرموز
            </button>
            <button
              onClick={() => {
                setGeneratedCodes([]);
                setStudents([]);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              إنشاء مجموعة جديدة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-bold text-blue-800 mb-2">إنشاء رموز دخول لمجموعة طلاب</h4>
        <p className="text-blue-700 text-sm">
          أنشئ رموز دخول لعدة طلاب في نفس الوقت. يمكنك إدخال الأسماء يدوياً أو استيراد ملف CSV.
        </p>
      </div>

      {/* Bulk Settings */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h5 className="font-bold text-gray-800 mb-4">إعدادات المجموعة</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">الصف الافتراضي</label>
            <select
              value={bulkSettings.grade}
              onChange={(e) => setBulkSettings(prev => ({ ...prev, grade: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>الصف {i + 1}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">بادئة الرمز</label>
            <input
              type="text"
              value={bulkSettings.prefix}
              onChange={(e) => setBulkSettings(prev => ({ ...prev, prefix: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="STU"
              maxLength={5}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">تاريخ الانتهاء (اختياري)</label>
            <input
              type="date"
              value={bulkSettings.expiresAt}
              onChange={(e) => setBulkSettings(prev => ({ ...prev, expiresAt: e.target.value }))}
              min={getTodayDate()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={bulkSettings.addNotes}
                onChange={(e) => setBulkSettings(prev => ({ ...prev, addNotes: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-semibold text-gray-700">إضافة ملاحظات تلقائية</span>
            </label>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('manual')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'manual'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          إدخال يدوي
        </button>
        <button
          onClick={() => setActiveTab('import')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'import'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          استيراد ملف
        </button>
      </div>

      {/* Manual Entry Tab */}
      {activeTab === 'manual' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h5 className="font-bold text-gray-800">قائمة الطلاب ({students.length})</h5>
            <button
              onClick={addStudent}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              إضافة طالب
            </button>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {students.map((student, index) => (
              <div key={student.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">اسم الطالب</label>
                    <input
                      type="text"
                      value={student.name}
                      onChange={(e) => updateStudent(student.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      placeholder="أدخل اسم الطالب"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">الجنس</label>
                    <select
                      value={student.gender}
                      onChange={(e) => updateStudent(student.id, 'gender', e.target.value as 'male' | 'female')}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="male">ذكر 👨‍🎓</option>
                      <option value="female">أنثى 👩‍🎓</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">الصف</label>
                    <select
                      value={student.grade}
                      onChange={(e) => updateStudent(student.id, 'grade', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>الصف {i + 1}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">ملاحظات</label>
                    <input
                      type="text"
                      value={student.notes || ''}
                      onChange={(e) => updateStudent(student.id, 'notes', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      placeholder="ملاحظات اختيارية"
                    />
                  </div>
                  
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => removeStudent(student.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-100 p-2 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {students.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>لم يتم إضافة أي طلاب بعد</p>
              <button
                onClick={addStudent}
                className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                إضافة أول طالب
              </button>
            </div>
          )}
        </div>
      )}

      {/* Import Tab */}
      {activeTab === 'import' && (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h5 className="font-bold text-yellow-800 mb-2">استيراد من ملف CSV</h5>
            <p className="text-yellow-700 text-sm mb-3">
              قم بتحميل ملف CSV يحتوي على أسماء الطلاب. يجب أن يحتوي الملف على عمود واحد على الأقل للأسماء.
            </p>
            <div className="flex gap-3">
              <button
                onClick={downloadTemplate}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                تحميل نموذج
              </button>
              <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2">
                <Upload className="w-4 h-4" />
                استيراد ملف
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {students.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h5 className="font-bold text-gray-800 mb-3">الطلاب المستوردون ({students.length})</h5>
              <div className="max-h-48 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {students.map((student, index) => (
                    <div key={student.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">{student.name}</span>
                      <button
                        onClick={() => removeStudent(student.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Warning */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
        <div>
          <p className="text-orange-800 font-semibold">تنبيه هام</p>
          <p className="text-orange-700 text-sm">
            سيتم إنشاء سجلات طلاب جديدة في النظام مع رموز دخول خاصة بكل طالب. تأكد من صحة الأسماء قبل المتابعة.
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading || students.filter(s => s.name.trim()).length === 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              جاري إنشاء الرموز...
            </>
          ) : (
            <>
              <Key className="w-5 h-5" />
              إنشاء رموز الدخول ({students.filter(s => s.name.trim()).length})
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default BulkStudentCodeGenerator;