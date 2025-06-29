import React, { useState } from 'react';
import { X, User, BarChart3, Clock, Award, TrendingUp, Calendar, Target, Zap, BookOpen, Edit, Save } from 'lucide-react';
import { Student } from '../types';

interface StudentDetailModalProps {
  student: Student;
  onClose: () => void;
  onUpdate: () => void;
}

const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ student, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'activities' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: student.name,
    studentNumber: student.studentNumber || '',
    parentEmail: student.parentEmail || '',
    notes: student.notes || ''
  });

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}س ${minutes}د`;
    }
    return `${minutes}د`;
  };

  const getPerformanceLevel = (score: number) => {
    if (score >= 80) return { level: 'ممتاز', color: 'text-green-600 bg-green-100', icon: '🏆' };
    if (score >= 60) return { level: 'جيد', color: 'text-yellow-600 bg-yellow-100', icon: '⭐' };
    return { level: 'يحتاج تحسين', color: 'text-red-600 bg-red-100', icon: '📚' };
  };

  const performance = getPerformanceLevel(student.progress.totalScore);

  const handleSave = () => {
    // TODO: Implement update student
    console.log('Update student:', editData);
    setIsEditing(false);
    onUpdate();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{student.name}</h2>
                <p className="opacity-90">الصف {student.grade} • #{student.studentNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex">
            {[
              { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
              { id: 'progress', label: 'التقدم', icon: TrendingUp },
              { id: 'activities', label: 'الأنشطة', icon: Zap },
              { id: 'settings', label: 'الإعدادات', icon: Edit }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-semibold">النقاط الإجمالية</p>
                      <p className="text-2xl font-bold text-blue-700">{student.progress.totalScore}</p>
                    </div>
                    <Target className="w-8 h-8 text-blue-500" />
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-semibold">الكلمات المتعلمة</p>
                      <p className="text-2xl font-bold text-green-700">{student.progress.wordsLearned}</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-green-500" />
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 text-sm font-semibold">السلسلة الحالية</p>
                      <p className="text-2xl font-bold text-purple-700">{student.progress.currentStreak}</p>
                    </div>
                    <Zap className="w-8 h-8 text-purple-500" />
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-600 text-sm font-semibold">وقت الدراسة</p>
                      <p className="text-2xl font-bold text-orange-700">{formatTime(student.progress.totalStudyTime)}</p>
                    </div>
                    <Clock className="w-8 h-8 text-orange-500" />
                  </div>
                </div>
              </div>

              {/* Performance Level */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">مستوى الأداء</h3>
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{performance.icon}</div>
                  <div>
                    <span className={`px-4 py-2 rounded-full text-lg font-bold ${performance.color}`}>
                      {performance.level}
                    </span>
                    <p className="text-gray-600 mt-2">
                      بناءً على النقاط الإجمالية والأنشطة المكتملة
                    </p>
                  </div>
                </div>
              </div>

              {/* Units Completed */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">الوحدات المكتملة</h3>
                {student.progress.unitsCompleted.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {student.progress.unitsCompleted.map((unit, index) => (
                      <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {unit}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">لم يتم إكمال أي وحدة بعد</p>
                )}
              </div>

              {/* Student Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">معلومات الطالب</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">تاريخ الانضمام</p>
                    <p className="font-semibold">{new Date(student.joinDate).toLocaleDateString('ar-SA')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">آخر نشاط</p>
                    <p className="font-semibold">{new Date(student.lastActive).toLocaleDateString('ar-SA')}</p>
                  </div>
                  {student.parentEmail && (
                    <div>
                      <p className="text-sm text-gray-600">بريد ولي الأمر</p>
                      <p className="font-semibold">{student.parentEmail}</p>
                    </div>
                  )}
                  {student.notes && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">ملاحظات</p>
                      <p className="font-semibold">{student.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">تقرير التقدم التفصيلي</h3>
                <p className="text-gray-600">تحليل شامل لأداء الطالب وتقدمه في التعلم</p>
              </div>

              {/* Progress Chart Placeholder */}
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">رسم بياني لتقدم الطالب</p>
                <p className="text-sm text-gray-500 mt-2">سيتم إضافة الرسوم البيانية التفاعلية قريباً</p>
              </div>

              {/* Detailed Progress */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-bold text-gray-800 mb-4">الإنجازات</h4>
                  {student.achievements.length > 0 ? (
                    <div className="space-y-2">
                      {student.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                          <span className="text-2xl">{achievement.icon}</span>
                          <div>
                            <p className="font-semibold">{achievement.title}</p>
                            <p className="text-sm text-gray-600">{achievement.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">لم يحقق أي إنجازات بعد</p>
                  )}
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-bold text-gray-800 mb-4">جلسات الدراسة</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>إجمالي الجلسات</span>
                      <span className="font-bold">{student.progress.studySessions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>إجمالي وقت الدراسة</span>
                      <span className="font-bold">{formatTime(student.progress.totalStudyTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>متوسط وقت الجلسة</span>
                      <span className="font-bold">
                        {student.progress.studySessions.length > 0 
                          ? formatTime(student.progress.totalStudyTime / student.progress.studySessions.length)
                          : '0د'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">سجل الأنشطة</h3>
                <p className="text-gray-600">جميع الأنشطة التي قام بها الطالب</p>
              </div>

              {/* Activities will be loaded from the activities data */}
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">سجل الأنشطة التفصيلي</p>
                <p className="text-sm text-gray-500 mt-2">سيتم عرض جميع الأنشطة والنتائج هنا</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">إعدادات الطالب</h3>
                <p className="text-gray-600">تحديث معلومات الطالب</p>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">اسم الطالب</label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">رقم الطالب</label>
                    <input
                      type="text"
                      value={editData.studentNumber}
                      onChange={(e) => setEditData(prev => ({ ...prev, studentNumber: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">بريد ولي الأمر</label>
                    <input
                      type="email"
                      value={editData.parentEmail}
                      onChange={(e) => setEditData(prev => ({ ...prev, parentEmail: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">ملاحظات</label>
                    <textarea
                      value={editData.notes}
                      onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      حفظ التغييرات
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">اسم الطالب</p>
                      <p className="font-semibold">{student.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">رقم الطالب</p>
                      <p className="font-semibold">{student.studentNumber || 'غير محدد'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">الصف</p>
                      <p className="font-semibold">الصف {student.grade}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">بريد ولي الأمر</p>
                      <p className="font-semibold">{student.parentEmail || 'غير محدد'}</p>
                    </div>
                    {student.notes && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600">ملاحظات</p>
                        <p className="font-semibold">{student.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;