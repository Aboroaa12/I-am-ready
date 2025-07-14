import React, { useState, useEffect } from 'react';
import { FileText, Plus, Edit, Trash2, Search, Filter, Save, X, AlertTriangle, Book, BookOpen, RefreshCw } from 'lucide-react';
import { ContentItem, Subject } from '../types';
import { supabase } from '../lib/supabase';

interface ContentManagementProps {
  subject?: Subject;
}

const ContentManagement: React.FC<ContentManagementProps> = ({ subject }) => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [units, setUnits] = useState<string[]>([]);
  const [grades, setGrades] = useState<number[]>([]);
  const [semesters, setSemesters] = useState<string[]>(['الفصل الأول', 'الفصل الثاني', 'الفصل الصيفي']);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(subject?.id || null);

  useEffect(() => {
    if (subject) {
      setSelectedSubject(subject.id);
    }
    loadContent();
    loadSubjects();
  }, [subject]);

  const loadSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        const formattedSubjects: Subject[] = data.map(subject => ({
          id: subject.id,
          name: subject.name,
          nameEn: subject.name_en,
          icon: subject.icon,
          color: subject.color,
          description: subject.description,
          isActive: subject.is_active,
          createdAt: subject.created_at,
          updatedAt: subject.updated_at
        }));
        
        setSubjects(formattedSubjects);
      }
    } catch (err) {
      console.error('Error loading subjects:', err);
    }
  };

  const loadContent = async () => {
    setLoading(true);
    try {
      let query = supabase.from('content_items').select('*');
      
      if (selectedSubject) {
        query = query.eq('subject', selectedSubject);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        const formattedContent: ContentItem[] = data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          content: item.content,
          contentType: item.content_type,
          subject: item.subject,
          unit: item.unit,
          grade: item.grade,
          order: item.order,
          isActive: item.is_active,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        }));
        
        setContentItems(formattedContent);
        
        // Extract unique units and grades
        const uniqueUnits = [...new Set(formattedContent.map(item => item.unit))];
        const uniqueGrades = [...new Set(formattedContent.map(item => item.grade))].sort((a, b) => a - b);
        
        setUnits(uniqueUnits);
        setGrades(uniqueGrades);
      } else {
        setContentItems([]);
        setUnits([]);
        setGrades([]);
      }
    } catch (err) {
      console.error('Error loading content:', err);
      setContentItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddContent = () => {
    setEditingContent(null);
    setShowAddModal(true);
  };

  const handleEditContent = (content: ContentItem) => {
    setEditingContent(content);
    setShowAddModal(true);
  };

  const handleDeleteContent = (contentId: string) => {
    setShowDeleteConfirm(contentId);
  };

  const confirmDelete = async (contentId: string) => {
    try {
      // Delete content from Supabase
      const { error } = await supabase
        .from('content_items')
        .delete()
        .eq('id', contentId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setContentItems(prev => prev.filter(item => item.id !== contentId));
      setShowDeleteConfirm(null);
      
      // Show success message
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
      notification.textContent = 'تم حذف المحتوى بنجاح';
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
    } catch (err) {
      console.error('Error deleting content:', err);
      
      // Show error message
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
      notification.textContent = 'حدث خطأ أثناء حذف المحتوى';
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
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedGrade(null);
    setSelectedUnit(null);
  };

  const filteredContent = contentItems.filter(item => {
    // Apply grade filter
    if (selectedGrade !== null && item.grade !== selectedGrade) {
      return false;
    }
    
    // Apply unit filter
    if (selectedUnit && item.unit !== selectedUnit) {
      return false;
    }
    
    // Apply semester filter
    if (selectedSemester && item.semester !== selectedSemester) {
      return false;
    }
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return item.title.toLowerCase().includes(term) || 
             item.description.toLowerCase().includes(term) ||
             item.content.toLowerCase().includes(term);
    }
    
    return true;
  });

  const getContentTypeIcon = (type: ContentItem['contentType']) => {
    switch (type) {
      case 'text': return <FileText className="w-5 h-5" />;
      case 'image': return <div className="text-lg">🖼️</div>;
      case 'video': return <div className="text-lg">🎬</div>;
      case 'audio': return <div className="text-lg">🔊</div>;
      case 'interactive': return <div className="text-lg">🎮</div>;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getContentTypeLabel = (type: ContentItem['contentType']) => {
    switch (type) {
      case 'text': return 'نص';
      case 'image': return 'صورة';
      case 'video': return 'فيديو';
      case 'audio': return 'صوت';
      case 'interactive': return 'تفاعلي';
      default: return 'نص';
    }
  };

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : subjectId;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            إدارة المحتوى {subject ? `- ${subject.name}` : ''}
          </h2>
          <p className="text-gray-600">إضافة وتعديل وحذف محتوى المواد الدراسية</p>
        </div>
        <button
          onClick={handleAddContent}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 font-semibold"
        >
          <Plus className="w-5 h-5" />
          إضافة محتوى جديد
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2">
              بحث
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث في المحتوى..."
                className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {!subject && (
            <div className="md:w-1/4">
              <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                المادة
              </label>
              <select
                id="subject"
                value={selectedSubject || ''}
                onChange={(e) => {
                  setSelectedSubject(e.target.value || null);
                  loadContent();
                }}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              >
                <option value="">جميع المواد</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="md:w-1/4">
            <label htmlFor="grade" className="block text-sm font-semibold text-gray-700 mb-2">
              الصف
            </label>
            <select
              id="grade"
              value={selectedGrade === null ? '' : selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            >
              <option value="">جميع الصفوف</option>
              {grades.map((grade) => (
                <option key={grade} value={grade}>
                  الصف {grade}
                </option>
              ))}
            </select>
          </div>

          <div className="md:w-1/4">
            <label htmlFor="unit" className="block text-sm font-semibold text-gray-700 mb-2">
              الوحدة
            </label>
            <select
              id="unit"
              value={selectedUnit || ''}
              onChange={(e) => setSelectedUnit(e.target.value || null)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            >
              <option value="">جميع الوحدات</option>
              {units.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
          
          <div className="md:w-1/4">
            <label htmlFor="semester" className="block text-sm font-semibold text-gray-700 mb-2">
              الفصل الدراسي
            </label>
            <select
              id="semester"
              value={selectedSemester || ''}
              onChange={(e) => setSelectedSemester(e.target.value || null)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            >
              <option value="">جميع الفصول</option>
              {semesters.map((semester) => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-gray-600">
            تم العثور على <span className="font-bold text-blue-600">{filteredContent.length}</span> محتوى
          </div>
          <div className="flex gap-2">
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              إعادة ضبط
            </button>
            <button
              onClick={loadContent}
              className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              تحديث
            </button>
          </div>
        </div>
      </div>

      {/* Content List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل المحتوى...</p>
          </div>
        ) : filteredContent.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">العنوان</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">النوع</th>
                  {!subject && (
                    <th className="text-right py-4 px-6 font-semibold text-gray-700">المادة</th>
                  )}
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">الصف</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">الفصل</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">الوحدة</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">الحالة</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredContent.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-800">{item.title}</div>
                      <div className="text-sm text-gray-600 line-clamp-1">{item.description}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {getContentTypeIcon(item.contentType)}
                        <span>{getContentTypeLabel(item.contentType)}</span>
                      </div>
                    </td>
                    {!subject && (
                      <td className="py-4 px-6">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-semibold">
                          {getSubjectName(item.subject)}
                        </span>
                      </td>
                    )}
                    <td className="py-4 px-6">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">
                        الصف {item.grade}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm font-semibold">
                        {item.semester || 'غير محدد'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm font-semibold">
                        {item.unit}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.isActive ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditContent(item)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                          title="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteContent(item.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد نتائج</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedGrade || selectedUnit || selectedSubject
                ? 'لم يتم العثور على محتوى يطابق معايير البحث'
                : 'لم يتم إضافة أي محتوى بعد'
              }
            </p>
            <button
              onClick={resetFilters}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <ContentForm
          content={editingContent}
          onClose={() => setShowAddModal(false)}
          onSave={async (contentData) => {
            try {
              if (editingContent) {
                // Update content
                const { error } = await supabase
                  .from('content_items')
                  .update({
                    title: contentData.title,
                    description: contentData.description,
                    content: contentData.content,
                    content_type: contentData.contentType,
                    subject: contentData.subject,
                    unit: contentData.unit,
                    grade: contentData.grade,
                    order: contentData.order,
                    is_active: contentData.isActive,
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', editingContent.id);
                
                if (error) throw error;
                
                // Update local state
                setContentItems(prev => prev.map(item => 
                  item.id === editingContent.id ? { ...item, ...contentData } : item
                ));
              } else {
                // Add new content
                const newContentId = crypto.randomUUID();
                const { error } = await supabase
                  .from('content_items')
                  .insert({
                    id: newContentId,
                    title: contentData.title,
                    description: contentData.description,
                    content: contentData.content,
                    content_type: contentData.contentType,
                    subject: contentData.subject,
                    unit: contentData.unit,
                    grade: contentData.grade,
                    order: contentData.order,
                    is_active: contentData.isActive,
                    created_at: new Date().toISOString()
                  });
                
                if (error) throw error;
                
                // Update local state
                const newContent: ContentItem = {
                  id: newContentId,
                  ...contentData,
                  createdAt: new Date().toISOString()
                };
                
                setContentItems(prev => [newContent, ...prev]);
                
                // Update units and grades if needed
                if (!units.includes(contentData.unit)) {
                  setUnits(prev => [...prev, contentData.unit]);
                }
                if (!grades.includes(contentData.grade)) {
                  setGrades(prev => [...prev, contentData.grade].sort((a, b) => a - b));
                }
              }
              
              setShowAddModal(false);
              
              // Show success message
              const notification = document.createElement('div');
              notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
              notification.textContent = editingContent ? 'تم تحديث المحتوى بنجاح' : 'تمت إضافة المحتوى بنجاح';
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
            } catch (err) {
              console.error('Error saving content:', err);
              
              // Show error message
              const notification = document.createElement('div');
              notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
              notification.textContent = 'حدث خطأ أثناء حفظ المحتوى';
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
            }
          }}
          subjects={subjects}
          defaultSubject={subject?.id || selectedSubject}
          semesters={semesters}
        />
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
                هل أنت متأكد من حذف هذا المحتوى؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => confirmDelete(showDeleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                نعم، حذف المحتوى
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

interface ContentFormProps {
  content: ContentItem | null;
  onClose: () => void;
  onSave: (contentData: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  subjects: Subject[];
  defaultSubject?: string | null;
  semesters: string[];
}

const ContentForm: React.FC<ContentFormProps> = ({ content, onClose, onSave, subjects, defaultSubject, semesters }) => {
  const [formData, setFormData] = useState<Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>>({
    title: content?.title || '',
    description: content?.description || '',
    content: content?.content || '',
    contentType: content?.contentType || 'text',
    subject: content?.subject || defaultSubject || (subjects[0]?.id || ''),
    unit: content?.unit || '',
    grade: content?.grade || 5,
    semester: content?.semester || '',
    order: content?.order || 0,
    isActive: content?.isActive ?? true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : name === 'grade' || name === 'order' 
          ? Number(value) 
          : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl">
          <h3 className="text-xl font-bold">
            {content ? 'تعديل المحتوى' : 'إضافة محتوى جديد'}
          </h3>
          <p className="opacity-90 text-sm">
            {content ? 'قم بتعديل بيانات المحتوى' : 'قم بإدخال بيانات المحتوى الجديد'}
          </p>
        </div>
        
        <form className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                عنوان المحتوى *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="أدخل عنوان المحتوى"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                نوع المحتوى *
              </label>
              <select
                name="contentType"
                value={formData.contentType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="text">نص</option>
                <option value="image">صورة</option>
                <option value="video">فيديو</option>
                <option value="audio">صوت</option>
                <option value="interactive">تفاعلي</option>
              </select>
            </div>
            
            {!defaultSubject && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  المادة *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الصف *
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                  <option key={grade} value={grade}>الصف {grade}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الفصل الدراسي
              </label>
              <select
                name="semester"
                value={formData.semester || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">اختر الفصل</option>
                {semesters.map(semester => (
                  <option key={semester} value={semester}>{semester}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الوحدة *
              </label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="أدخل اسم الوحدة"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الترتيب
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="ترتيب العرض"
                min="0"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                وصف المحتوى *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="أدخل وصفاً مختصراً للمحتوى"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                المحتوى *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={
                  formData.contentType === 'text' ? 'أدخل المحتوى النصي هنا...' :
                  formData.contentType === 'image' ? 'أدخل رابط الصورة هنا...' :
                  formData.contentType === 'video' ? 'أدخل رابط الفيديو هنا...' :
                  formData.contentType === 'audio' ? 'أدخل رابط الصوت هنا...' :
                  'أدخل المحتوى التفاعلي هنا...'
                }
              />
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">المحتوى نشط</span>
              </label>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => onSave(formData)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {content ? 'حفظ التغييرات' : 'إضافة المحتوى'}
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
      </div>
    </div>
  );
};

export default ContentManagement;