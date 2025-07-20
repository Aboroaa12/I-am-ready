import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Edit, Trash2, Plus, Save, X, Eye, EyeOff, RefreshCw, Download, Upload, AlertTriangle, Check, User, GraduationCap, UserCheck, Shield, Phone, Mail, Calendar, BookOpen } from 'lucide-react';
import { supabase, hasValidSupabaseCredentials } from '../lib/supabase';

interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  type: 'student' | 'teacher' | 'admin';
  grade?: number;
  isActive: boolean;
  createdAt: string;
  lastActive?: string;
  metadata?: any;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'student' | 'teacher' | 'admin'>('all');
  const [filterGrade, setFilterGrade] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadAllUsers();
  }, []);

  const loadAllUsers = async () => {
    setLoading(true);
    try {
      const allUsers: User[] = [];

      if (hasValidSupabaseCredentials()) {
        // Load students
        const { data: studentsData, error: studentsError } = await supabase
          .from('students')
          .select('*')
          .order('name');

        if (!studentsError && studentsData) {
          const students: User[] = studentsData.map(student => ({
            id: student.id,
            name: student.name,
            type: 'student' as const,
            grade: student.grade,
            isActive: student.is_active,
            createdAt: student.join_date || student.created_at,
            lastActive: student.last_active,
            metadata: {
              teacherId: student.teacher_id,
              parentEmail: student.parent_email,
              studentNumber: student.student_number,
              notes: student.notes,
              classRoomIds: student.class_room_ids,
              gender: student.gender
            }
          }));
          allUsers.push(...students);
        }

        // Load teachers
        const { data: teachersData, error: teachersError } = await supabase
          .from('teachers')
          .select('*')
          .order('name');

        if (!teachersError && teachersData) {
          const teachers: User[] = teachersData.map(teacher => ({
            id: teacher.id,
            name: teacher.name,
            email: teacher.email,
            phone: teacher.phone,
            type: 'teacher' as const,
            isActive: teacher.is_active,
            createdAt: teacher.join_date || teacher.created_at,
            metadata: {
              grades: teacher.grades,
              schoolName: teacher.school_name,
              subjects: teacher.subjects,
              codeLimit: teacher.code_limit
            }
          }));
          allUsers.push(...teachers);
        }

        // Add admin users (from settings or hardcoded)
        const adminUsers: User[] = [
          {
            id: 'admin-1',
            name: 'المدير العام',
            email: 'admin@school.edu',
            type: 'admin' as const,
            isActive: true,
            createdAt: new Date().toISOString(),
            metadata: {
              permissions: ['all']
            }
          }
        ];
        allUsers.push(...adminUsers);
      }

      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || user.type === filterType;
    const matchesGrade = filterGrade === null || user.grade === filterGrade;
    
    return matchesSearch && matchesType && matchesGrade;
  });

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowAddModal(true);
  };

  const handleDeleteUser = (userId: string) => {
    setShowDeleteConfirm(userId);
  };

  const confirmDelete = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      if (hasValidSupabaseCredentials()) {
        if (user.type === 'student') {
          // Delete student and related data
          await supabase.from('user_progress').delete().eq('student_id', userId);
          await supabase.from('achievements').delete().eq('student_id', userId);
          await supabase.from('student_activities').delete().eq('student_id', userId);
          await supabase.from('access_codes').delete().eq('student_id', userId);
          await supabase.from('students').delete().eq('id', userId);
        } else if (user.type === 'teacher') {
          // Delete teacher and related data
          await supabase.from('access_codes').delete().eq('teacher_id', userId);
          await supabase.from('class_rooms').delete().eq('teacher_id', userId);
          await supabase.from('teachers').delete().eq('id', userId);
        }
      }

      setUsers(users.filter(u => u.id !== userId));
      setShowDeleteConfirm(null);
      
      showNotification('تم حذف المستخدم بنجاح', 'success');
    } catch (error) {
      console.error('Error deleting user:', error);
      showNotification('حدث خطأ أثناء حذف المستخدم', 'error');
    }
  };

  const handleSaveUser = async (userData: Partial<User>) => {
    try {
      if (editingUser) {
        // Update existing user
        if (hasValidSupabaseCredentials()) {
          if (editingUser.type === 'student') {
            await supabase
              .from('students')
              .update({
                name: userData.name,
                grade: userData.grade,
                is_active: userData.isActive,
                parent_email: userData.metadata?.parentEmail,
                student_number: userData.metadata?.studentNumber,
                notes: userData.metadata?.notes,
                gender: userData.metadata?.gender,
                updated_at: new Date().toISOString()
              })
              .eq('id', editingUser.id);
          } else if (editingUser.type === 'teacher') {
            await supabase
              .from('teachers')
              .update({
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                is_active: userData.isActive,
                school_name: userData.metadata?.schoolName,
                subjects: userData.metadata?.subjects,
                grades: userData.metadata?.grades,
                code_limit: userData.metadata?.codeLimit,
                updated_at: new Date().toISOString()
              })
              .eq('id', editingUser.id);
          }
        }

        // Update local state
        setUsers(users.map(u => 
          u.id === editingUser.id 
            ? { ...u, ...userData }
            : u
        ));

        showNotification('تم تحديث بيانات المستخدم بنجاح', 'success');
      }

      setShowAddModal(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
      showNotification('حدث خطأ أثناء حفظ بيانات المستخدم', 'error');
    }
  };

  const exportUsers = () => {
    const csvContent = [
      ['الاسم', 'النوع', 'البريد الإلكتروني', 'الهاتف', 'الصف', 'الحالة', 'تاريخ الإنشاء', 'آخر نشاط'].join(','),
      ...filteredUsers.map(user => [
        user.name,
        user.type === 'student' ? 'طالب' : user.type === 'teacher' ? 'معلم' : 'مدير',
        user.email || '',
        user.phone || '',
        user.grade || '',
        user.isActive ? 'نشط' : 'غير نشط',
        new Date(user.createdAt).toLocaleDateString('ar-SA'),
        user.lastActive ? new Date(user.lastActive).toLocaleDateString('ar-SA') : ''
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `all_users_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    
    notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translate(-50%, -100%)';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case 'student': return <User className="w-5 h-5 text-blue-600" />;
      case 'teacher': return <GraduationCap className="w-5 h-5 text-green-600" />;
      case 'admin': return <Shield className="w-5 h-5 text-purple-600" />;
      default: return <User className="w-5 h-5 text-gray-600" />;
    }
  };

  const getUserTypeBadge = (type: string) => {
    const badges = {
      student: { text: 'طالب', color: 'bg-blue-100 text-blue-800', icon: '👨‍🎓' },
      teacher: { text: 'معلم', color: 'bg-green-100 text-green-800', icon: '👨‍🏫' },
      admin: { text: 'مدير', color: 'bg-purple-100 text-purple-800', icon: '👑' }
    };
    
    const badge = badges[type as keyof typeof badges] || badges.student;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <span>{badge.icon}</span>
        {badge.text}
      </span>
    );
  };

  const getUniqueGrades = () => {
    const grades = users
      .filter(u => u.grade)
      .map(u => u.grade!)
      .filter((grade, index, arr) => arr.indexOf(grade) === index)
      .sort((a, b) => a - b);
    return grades;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Users className="w-8 h-8 text-purple-600" />
            إدارة جميع المستخدمين
          </h2>
          <p className="text-gray-600">عرض وتعديل بيانات جميع المستخدمين في النظام (طلاب، معلمين، مديرين)</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadAllUsers}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            تحديث
          </button>
          <button
            onClick={exportUsers}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            تصدير البيانات
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-semibold">إجمالي الطلاب</p>
              <p className="text-3xl font-bold text-blue-700">
                {users.filter(u => u.type === 'student').length}
              </p>
            </div>
            <User className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-semibold">إجمالي المعلمين</p>
              <p className="text-3xl font-bold text-green-700">
                {users.filter(u => u.type === 'teacher').length}
              </p>
            </div>
            <GraduationCap className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-semibold">المديرين</p>
              <p className="text-3xl font-bold text-purple-700">
                {users.filter(u => u.type === 'admin').length}
              </p>
            </div>
            <Shield className="w-12 h-12 text-purple-500" />
          </div>
        </div>

        <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-semibold">المستخدمين النشطين</p>
              <p className="text-3xl font-bold text-orange-700">
                {users.filter(u => u.isActive).length}
              </p>
            </div>
            <UserCheck className="w-12 h-12 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">البحث</label>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث في المستخدمين..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">نوع المستخدم</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">جميع الأنواع</option>
              <option value="student">الطلاب</option>
              <option value="teacher">المعلمين</option>
              <option value="admin">المديرين</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">الصف</label>
            <select
              value={filterGrade || ''}
              onChange={(e) => setFilterGrade(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">جميع الصفوف</option>
              {getUniqueGrades().map(grade => (
                <option key={grade} value={grade}>الصف {grade}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterGrade(null);
              }}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              إعادة ضبط
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل بيانات المستخدمين...</p>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">المستخدم</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">النوع</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">معلومات الاتصال</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">الصف/التخصص</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">الحالة</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">آخر نشاط</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {getUserTypeIcon(user.type)}
                        <div>
                          <div className="font-semibold text-gray-800">{user.name}</div>
                          <div className="text-sm text-gray-600">
                            {user.metadata?.gender === 'female' ? '👩‍🎓' : '👨‍🎓'} {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {getUserTypeBadge(user.type)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        {user.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            {user.email}
                          </div>
                        )}
                        {user.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            {user.phone}
                          </div>
                        )}
                        {user.metadata?.parentEmail && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Mail className="w-3 h-3" />
                            ولي الأمر: {user.metadata.parentEmail}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {user.type === 'student' && user.grade && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                          الصف {user.grade}
                        </span>
                      )}
                      {user.type === 'teacher' && user.metadata?.grades && (
                        <div className="flex flex-wrap gap-1">
                          {user.metadata.grades.map((grade: number) => (
                            <span key={grade} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                              الصف {grade}
                            </span>
                          ))}
                        </div>
                      )}
                      {user.type === 'admin' && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
                          صلاحيات كاملة
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-600">
                        {user.lastActive ? (
                          <div>
                            <div>{new Date(user.lastActive).toLocaleDateString('ar-SA')}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(user.lastActive).toLocaleDateString('ar-SA-u-ca-islamic')}
                            </div>
                          </div>
                        ) : (
                          'لم يسجل دخول'
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition-colors"
                          title="تعديل المستخدم"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {user.type !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors"
                            title="حذف المستخدم"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">لا يوجد مستخدمين</h3>
            <p className="text-gray-500">
              {searchTerm || filterType !== 'all' || filterGrade 
                ? 'لم يتم العثور على مستخدمين يطابقون معايير البحث'
                : 'لا يوجد مستخدمين في النظام'
              }
            </p>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {showAddModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-xl">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <Edit className="w-6 h-6" />
                تعديل بيانات المستخدم
              </h3>
              <p className="opacity-90 text-sm">
                تعديل بيانات {editingUser.type === 'student' ? 'الطالب' : editingUser.type === 'teacher' ? 'المعلم' : 'المدير'}: {editingUser.name}
              </p>
            </div>
            
            <UserEditForm 
              user={editingUser}
              onClose={() => {
                setShowAddModal(false);
                setEditingUser(null);
              }}
              onSave={handleSaveUser}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="bg-red-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">تأكيد الحذف</h3>
              <p className="text-gray-600">
                هل أنت متأكد من حذف هذا المستخدم؟ سيتم حذف جميع البيانات المرتبطة به.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => confirmDelete(showDeleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                نعم، حذف المستخدم
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface UserEditFormProps {
  user: User;
  onClose: () => void;
  onSave: (userData: Partial<User>) => void;
}

const UserEditForm: React.FC<UserEditFormProps> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email || '',
    phone: user.phone || '',
    grade: user.grade || 1,
    isActive: user.isActive,
    // Student specific
    parentEmail: user.metadata?.parentEmail || '',
    studentNumber: user.metadata?.studentNumber || '',
    notes: user.metadata?.notes || '',
    gender: user.metadata?.gender || 'male',
    // Teacher specific
    schoolName: user.metadata?.schoolName || '',
    subjects: user.metadata?.subjects?.join(', ') || '',
    grades: user.metadata?.grades || [],
    codeLimit: user.metadata?.codeLimit || 20
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleGradeChange = (grade: number) => {
    if (user.type === 'teacher') {
      setFormData(prev => {
        const newGrades = prev.grades.includes(grade)
          ? prev.grades.filter((g: number) => g !== grade)
          : [...prev.grades, grade];
        return { ...prev, grades: newGrades };
      });
    } else {
      setFormData(prev => ({ ...prev, grade }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userData: Partial<User> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      isActive: formData.isActive,
      metadata: {
        ...user.metadata
      }
    };

    if (user.type === 'student') {
      userData.grade = formData.grade;
      userData.metadata = {
        ...userData.metadata,
        parentEmail: formData.parentEmail,
        studentNumber: formData.studentNumber,
        notes: formData.notes,
        gender: formData.gender
      };
    } else if (user.type === 'teacher') {
      userData.metadata = {
        ...userData.metadata,
        schoolName: formData.schoolName,
        subjects: formData.subjects.split(',').map(s => s.trim()).filter(s => s),
        grades: formData.grades,
        codeLimit: formData.codeLimit
      };
    }

    onSave(userData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            الاسم الكامل *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        
        {user.type !== 'student' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        )}
        
        {user.type === 'teacher' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              رقم الهاتف
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        )}
        
        <div className="flex items-center">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <span className="text-gray-700">المستخدم نشط</span>
          </label>
        </div>
      </div>

      {/* Student Specific Fields */}
      {user.type === 'student' && (
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
            بيانات الطالب
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الصف
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>الصف {i + 1}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الجنس
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="male">ذكر 👨‍🎓</option>
                <option value="female">أنثى 👩‍🎓</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                رقم الطالب
              </label>
              <input
                type="text"
                name="studentNumber"
                value={formData.studentNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                بريد ولي الأمر
              </label>
              <input
                type="email"
                name="parentEmail"
                value={formData.parentEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ملاحظات
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Teacher Specific Fields */}
      {user.type === 'teacher' && (
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
            بيانات المعلم
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                اسم المدرسة
              </label>
              <input
                type="text"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                حد رموز الدخول
              </label>
              <input
                type="number"
                name="codeLimit"
                value={formData.codeLimit}
                onChange={handleChange}
                min="1"
                max="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                المواد التي يدرسها
              </label>
              <input
                type="text"
                name="subjects"
                value={formData.subjects}
                onChange={handleChange}
                placeholder="مثال: اللغة الإنجليزية، الرياضيات (افصل بينها بفاصلة)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الصفوف التي يدرسها
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                  <label key={grade} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.grades.includes(grade)}
                      onChange={() => handleGradeChange(grade)}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm">الصف {grade}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          حفظ التغييرات
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
};

export default UserManagement;