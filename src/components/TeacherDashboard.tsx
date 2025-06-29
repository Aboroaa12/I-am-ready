import React, { useState, useEffect } from 'react';
import { Users, BookOpen, TrendingUp, Clock, Award, AlertTriangle, Download, Plus, Search, Filter, BarChart3, Calendar, Target, Zap, Star, Eye, FileText, Settings, UserPlus, Upload, Key, User } from 'lucide-react';
import { Teacher, Student, ClassRoom, StudentActivity, TeacherDashboard as TeacherDashboardType, StudentReport } from '../types';
import StudentManagement from './StudentManagement';
import ClassRoomManagement from './ClassRoomManagement';
import StudentReports from './StudentReports';
import AccessCodeManagement from './AccessCodeManagement';
import TeacherProfile from './TeacherProfile';
import TeacherCodeGenerator from './TeacherCodeGenerator';
import { useTeacherData } from '../hooks/useTeacherData';
import { getGradeGradientColor } from '../utils/gradeColors';

interface TeacherDashboardProps {
  teacher: Teacher;
  onLogout: () => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ teacher, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'classes' | 'reports' | 'access-codes' | 'profile' | 'settings'>('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'term'>('week');
  const [showCodeGenerator, setShowCodeGenerator] = useState(false);
  
  const { 
    dashboardData, 
    students, 
    classRooms, 
    recentActivities,
    loading,
    refreshData,
    exportStudentData,
    importStudentData,
    updateTeacher
  } = useTeacherData(teacher.id);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}س ${minutes}د`;
    }
    return `${minutes}د`;
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const handleExportTemplate = () => {
    const csvContent = [
      ['اسم الطالب', 'رقم الطالب', 'الصف', 'بريد ولي الأمر', 'ملاحظات'].join(','),
      ['أحمد محمد', '2024001', '5', 'parent@email.com', 'طالب متميز'].join(','),
      ['فاطمة علي', '2024002', '5', 'parent2@email.com', ''].join(',')
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-blue-500">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">لوحة تحكم المعلم</h1>
                <p className="text-gray-600">مرحباً {teacher.name} - {teacher.schoolName || 'مدرسة'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={refreshData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                تحديث البيانات
              </button>
              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                خروج
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
              { id: 'students', label: 'إدارة الطلاب', icon: Users },
              { id: 'classes', label: 'الفصول', icon: BookOpen },
              { id: 'reports', label: 'التقارير', icon: FileText },
              { id: 'access-codes', label: 'رموز الدخول', icon: Key },
              { id: 'profile', label: 'الملف الشخصي', icon: User },
              { id: 'settings', label: 'الإعدادات', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-blue-600 hover:border-blue-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">إجمالي الطلاب</p>
                    <p className="text-3xl font-bold text-blue-600">{dashboardData?.totalStudents || 0}</p>
                  </div>
                  <Users className="w-12 h-12 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">الطلاب النشطون</p>
                    <p className="text-3xl font-bold text-green-600">{dashboardData?.activeStudents || 0}</p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">الفصول</p>
                    <p className="text-3xl font-bold text-purple-600">{dashboardData?.classRooms?.length || 0}</p>
                  </div>
                  <BookOpen className="w-12 h-12 text-purple-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">الأنشطة اليوم</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {recentActivities?.filter(a => 
                        new Date(a.startTime).toDateString() === new Date().toDateString()
                      ).length || 0}
                    </p>
                  </div>
                  <Zap className="w-12 h-12 text-orange-500" />
                </div>
              </div>
            </div>

            {/* Access Code Quick Action */}
            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-6 border border-purple-200 shadow-md">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-xl shadow-lg text-white">
                    <Key className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">رموز الدخول للطلاب</h3>
                    <p className="text-gray-600">أنشئ رموز دخول للطلاب للوصول إلى المحتوى التعليمي</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowCodeGenerator(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition-colors flex items-center gap-2 shadow-md"
                >
                  <Plus className="w-5 h-5" />
                  إنشاء رمز جديد
                </button>
              </div>
            </div>

            {/* Top Performers & Struggling Students */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Top Performers */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Award className="w-6 h-6 text-yellow-500" />
                  أفضل الطلاب أداءً
                </h3>
                <div className="space-y-4">
                  {dashboardData?.topPerformers?.slice(0, 5).map((student, index) => (
                    <div key={student.studentId} className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{student.studentName}</p>
                          <p className="text-sm text-gray-600">النقاط: {student.score}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${student.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {student.improvement >= 0 ? '+' : ''}{student.improvement}%
                        </p>
                        <p className="text-xs text-gray-500">التحسن</p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-8">لا توجد بيانات متاحة</p>
                  )}
                </div>
              </div>

              {/* Struggling Students */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  طلاب يحتاجون مساعدة
                </h3>
                <div className="space-y-4">
                  {dashboardData?.strugglingStudents?.slice(0, 5).map((student) => (
                    <div key={student.studentId} className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-800">{student.studentName}</p>
                        <p className="text-xs text-gray-500">
                          آخر نشاط: {new Date(student.lastActive).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {student.issueAreas.map((area, index) => (
                          <span key={index} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-8">جميع الطلاب يؤدون بشكل جيد! 🎉</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Clock className="w-6 h-6 text-blue-500" />
                الأنشطة الأخيرة
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">الطالب</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">النشاط</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">النتيجة</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">الوقت المستغرق</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivities?.slice(0, 10).map((activity) => {
                      const student = students.find(s => s.id === activity.studentId);
                      return (
                        <tr key={activity.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="font-semibold text-gray-800">{student?.name || 'غير معروف'}</div>
                            <div className="text-sm text-gray-600">الصف {activity.grade}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                              {activity.activityType}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getPerformanceColor(activity.score)}`}>
                              {activity.score}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {formatTime(activity.timeSpent)}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {new Date(activity.startTime).toLocaleDateString('ar-SA')}
                          </td>
                        </tr>
                      );
                    }) || (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-gray-500">
                          لا توجد أنشطة حديثة
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <StudentManagement 
            teacher={teacher}
            students={students}
            onRefresh={refreshData}
          />
        )}

        {activeTab === 'classes' && (
          <ClassRoomManagement 
            teacher={teacher}
            classRooms={classRooms}
            students={students}
            onRefresh={refreshData}
          />
        )}

        {activeTab === 'reports' && (
          <StudentReports 
            teacher={teacher}
            students={students}
            onExport={exportStudentData}
          />
        )}

        {activeTab === 'access-codes' && (
          <AccessCodeManagement 
            teacher={teacher}
            students={students}
            onRefresh={refreshData}
          />
        )}
        
        {activeTab === 'profile' && (
          <TeacherProfile 
            teacher={teacher}
            onUpdate={updateTeacher}
          />
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8">
            {/* Import/Export */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">استيراد وتصدير البيانات</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700">استيراد قائمة الطلاب</h4>
                  <p className="text-sm text-gray-600">
                    قم بتحميل ملف Excel أو CSV يحتوي على أسماء الطلاب ومعلوماتهم
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleExportTemplate}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      تحميل النموذج
                    </button>
                    <label className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      استيراد الملف
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            importStudentData(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700">تصدير بيانات الطلاب</h4>
                  <p className="text-sm text-gray-600">
                    قم بتصدير جميع بيانات الطلاب وتقدمهم في ملف Excel
                  </p>
                  <button
                    onClick={() => exportStudentData('all')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    تصدير جميع البيانات
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Code Generator Modal */}
      {showCodeGenerator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <button
                onClick={() => setShowCodeGenerator(false)}
                className="absolute top-4 left-4 bg-white/20 hover:bg-white/30 text-gray-700 p-2 rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
              
              <TeacherCodeGenerator 
                teacher={teacher}
                onSuccess={() => {
                  refreshData();
                  setTimeout(() => setShowCodeGenerator(false), 3000);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;