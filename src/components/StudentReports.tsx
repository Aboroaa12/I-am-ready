import React, { useState } from 'react';
import { FileText, Download, Calendar, TrendingUp, Award, Clock, BarChart3, Filter, Search, Eye, Users } from 'lucide-react';
import { Teacher, Student } from '../types';

interface StudentReportsProps {
  teacher: Teacher;
  students: Student[];
  onExport: (type: string, studentId?: string) => void;
}

const StudentReports: React.FC<StudentReportsProps> = ({ teacher, students, onExport }) => {
  const [selectedStudent, setSelectedStudent] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'term'>('month');
  const [reportType, setReportType] = useState<'summary' | 'detailed' | 'progress'>('summary');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateReport = () => {
    if (selectedStudent === 'all') {
      onExport('all-students', undefined);
    } else {
      onExport('single-student', selectedStudent);
    }
  };

  const getStudentStats = (student: Student) => {
    // Mock data - in real app, this would come from actual student activities
    return {
      totalActivities: Math.floor(Math.random() * 50) + 10,
      averageScore: Math.floor(Math.random() * 40) + 60,
      timeSpent: Math.floor(Math.random() * 120) + 30, // minutes
      improvement: Math.floor(Math.random() * 20) - 10, // -10 to +10
      lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    };
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}س ${mins}د`;
    }
    return `${mins}د`;
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">تقارير الطلاب</h2>
          <p className="text-gray-600">عرض وتصدير تقارير مفصلة عن أداء الطلاب</p>
        </div>
        <button
          onClick={generateReport}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 font-semibold"
        >
          <Download className="w-5 h-5" />
          تصدير التقرير
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">الطالب</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">جميع الطلاب</option>
              {filteredStudents.map(student => (
                <option key={student.id} value={student.id}>{student.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">الفترة الزمنية</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="week">الأسبوع الماضي</option>
              <option value="month">الشهر الماضي</option>
              <option value="term">الفصل الدراسي</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">نوع التقرير</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="summary">ملخص</option>
              <option value="detailed">مفصل</option>
              <option value="progress">التقدم</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">البحث</label>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث في الطلاب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">إجمالي الطلاب</p>
              <p className="text-3xl font-bold text-blue-600">{students.length}</p>
            </div>
            <Users className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">متوسط الدرجات</p>
              <p className="text-3xl font-bold text-green-600">
                {Math.round(students.reduce((acc, student) => acc + getStudentStats(student).averageScore, 0) / students.length || 0)}%
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">إجمالي الأنشطة</p>
              <p className="text-3xl font-bold text-purple-600">
                {students.reduce((acc, student) => acc + getStudentStats(student).totalActivities, 0)}
              </p>
            </div>
            <BarChart3 className="w-12 h-12 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">الوقت الإجمالي</p>
              <p className="text-3xl font-bold text-orange-600">
                {formatTime(students.reduce((acc, student) => acc + getStudentStats(student).timeSpent, 0))}
              </p>
            </div>
            <Clock className="w-12 h-12 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Students Performance Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <FileText className="w-6 h-6 text-blue-500" />
          تفاصيل أداء الطلاب
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 font-semibold text-gray-700">الطالب</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">الصف</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">عدد الأنشطة</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">متوسط الدرجات</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">الوقت المستغرق</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">التحسن</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">آخر نشاط</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => {
                const stats = getStudentStats(student);
                return (
                  <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-800">{student.name}</div>
                      <div className="text-sm text-gray-600">{student.studentId}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{student.grade}</td>
                    <td className="py-3 px-4 text-gray-600">{stats.totalActivities}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getPerformanceColor(stats.averageScore)}`}>
                        {stats.averageScore}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{formatTime(stats.timeSpent)}</td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-semibold ${stats.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stats.improvement >= 0 ? '+' : ''}{stats.improvement}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {stats.lastActive.toLocaleDateString('ar-SA')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onExport('single-student', student.id)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="عرض التفاصيل"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onExport('single-student', student.id)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="تصدير التقرير"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد بيانات</h3>
            <p className="text-gray-500">
              {searchTerm ? 'لم يتم العثور على طلاب يطابقون البحث' : 'لا توجد بيانات طلاب متاحة'}
            </p>
          </div>
        )}
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">خيارات التصدير</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onExport('summary')}
            className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
          >
            <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-800">تقرير ملخص</h4>
            <p className="text-sm text-gray-600">نظرة عامة على أداء جميع الطلاب</p>
          </button>

          <button
            onClick={() => onExport('detailed')}
            className="p-4 border-2 border-green-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center"
          >
            <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-800">تقرير مفصل</h4>
            <p className="text-sm text-gray-600">تفاصيل شاملة لكل طالب</p>
          </button>

          <button
            onClick={() => onExport('progress')}
            className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center"
          >
            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-semibold text-gray-800">تقرير التقدم</h4>
            <p className="text-sm text-gray-600">تتبع تطور الطلاب عبر الزمن</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentReports;