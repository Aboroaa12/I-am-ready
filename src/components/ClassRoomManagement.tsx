import React, { useState } from 'react';
import { BookOpen, Users, Plus, Edit, Trash2, Search, Filter, Calendar, Clock, Target, Award } from 'lucide-react';
import { Teacher, Student, ClassRoom } from '../types';

interface ClassRoomManagementProps {
  teacher: Teacher;
  classRooms: ClassRoom[];
  students: Student[];
  onRefresh: () => void;
}

const ClassRoomManagement: React.FC<ClassRoomManagementProps> = ({ 
  teacher, 
  classRooms, 
  students, 
  onRefresh 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);

  const filteredClasses = classRooms.filter(classRoom => {
    const matchesSearch = classRoom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classRoom.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || classRoom.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  const getClassStudents = (classId: string) => {
    return students.filter(student => student.classRoomIds?.includes(classId));
  };

  const handleAddClass = () => {
    setShowAddModal(true);
  };

  const handleEditClass = (classRoom: ClassRoom) => {
    setEditingClass(classRoom);
    setShowAddModal(true);
  };

  const handleDeleteClass = (classId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الفصل؟')) {
      // Handle delete logic here
      console.log('Deleting class:', classId);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">إدارة الفصول</h2>
          <p className="text-gray-600">إدارة فصولك الدراسية والطلاب المسجلين</p>
        </div>
        <button
          onClick={handleAddClass}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 font-semibold"
        >
          <Plus className="w-5 h-5" />
          إضافة فصل جديد
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث في الفصول..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="md:w-48">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">جميع الصفوف</option>
              {teacher.grades.map(grade => (
                <option key={grade} value={grade}>الصف {grade}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((classRoom) => {
          const classStudents = getClassStudents(classRoom.id);
          return (
            <div key={classRoom.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{classRoom.name}</h3>
                    <p className="text-sm text-gray-600">{classRoom.subject}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClass(classRoom)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClass(classRoom.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">الصف:</span>
                  <span className="font-semibold text-gray-800">{classRoom.grade}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">عدد الطلاب:</span>
                  <span className="font-semibold text-gray-800">{classStudents.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">تاريخ الإنشاء:</span>
                  <span className="font-semibold text-gray-800">
                    {new Date(classRoom.createdAt).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              </div>

              {classRoom.description && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{classRoom.description}</p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>آخر نشاط: {new Date(classRoom.lastActivity || classRoom.createdAt).toLocaleDateString('ar-SA')}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredClasses.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد فصول</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || selectedGrade !== 'all' 
              ? 'لم يتم العثور على فصول تطابق معايير البحث'
              : 'لم تقم بإنشاء أي فصول بعد'
            }
          </p>
          {!searchTerm && selectedGrade === 'all' && (
            <button
              onClick={handleAddClass}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              إضافة فصل جديد
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                {editingClass ? 'تعديل الفصل' : 'إضافة فصل جديد'}
              </h3>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">اسم الفصل</label>
                  <input
                    type="text"
                    defaultValue={editingClass?.name || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="مثال: فصل الرياضيات المتقدم"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">المادة</label>
                  <input
                    type="text"
                    defaultValue={editingClass?.subject || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="مثال: الرياضيات"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">الصف</label>
                  <select
                    defaultValue={editingClass?.grade || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">اختر الصف</option>
                    {teacher.grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">الوصف (اختياري)</label>
                  <textarea
                    defaultValue={editingClass?.description || ''}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="وصف مختصر للفصل..."
                  />
                </div>
              </form>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingClass(null);
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => {
                    // Handle save logic here
                    console.log('Saving class...');
                    setShowAddModal(false);
                    setEditingClass(null);
                    onRefresh();
                  }}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {editingClass ? 'حفظ التغييرات' : 'إضافة الفصل'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassRoomManagement;