import { useState, useEffect } from 'react';
import { Teacher, Student, ClassRoom, StudentActivity, TeacherDashboard, StudentReport } from '../types';
import { supabase } from '../lib/supabase';

const TEACHER_STORAGE_KEY = 'teacher-data';
const STUDENTS_STORAGE_KEY = 'students-data';
const ACTIVITIES_STORAGE_KEY = 'activities-data';

export const useTeacherData = (teacherId: string) => {
  const [dashboardData, setDashboardData] = useState<TeacherDashboard | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [classRooms, setClassRooms] = useState<ClassRoom[]>([]);
  const [recentActivities, setRecentActivities] = useState<StudentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTeacherData();
  }, [teacherId]);

  const loadTeacherData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load teacher data from Supabase
      const { data: teacherData, error: teacherError } = await supabase
        .from('teachers')
        .select('*')
        .eq('id', teacherId)
        .single();
      
      if (teacherError) {
        // إذا لم يتم العثور على المعلم في Supabase، نحاول تحميله من التخزين المحلي
        const savedTeacher = localStorage.getItem(`${TEACHER_STORAGE_KEY}-${teacherId}`);
        let teacherInfo: Teacher;
        
        if (savedTeacher) {
          teacherInfo = JSON.parse(savedTeacher);
        } else {
          // الحصول على بيانات المعلم من البيانات الثابتة
          const defaultTeacher = {
            id: teacherId,
            name: 'المعلم',
            email: 'teacher@example.com',
            grades: [5],
            students: [],
            joinDate: new Date().toISOString(),
            isActive: true
          };
          teacherInfo = defaultTeacher;
          
          // حفظ بيانات المعلم في التخزين المحلي
          localStorage.setItem(`${TEACHER_STORAGE_KEY}-${teacherId}`, JSON.stringify(teacherInfo));
          
          // محاولة إضافة المعلم إلى Supabase
          await supabase.from('teachers').insert({
            id: teacherInfo.id,
            name: teacherInfo.name,
            email: teacherInfo.email,
            grades: teacherInfo.grades,
            students: teacherInfo.students,
            join_date: teacherInfo.joinDate,
            is_active: teacherInfo.isActive,
            code_limit: 20
          });
        }
        
        setTeacher(teacherInfo);
      } else {
        // تحويل بيانات المعلم من Supabase إلى التنسيق المطلوب
        const formattedTeacher: Teacher = {
          id: teacherData.id,
          name: teacherData.name,
          email: teacherData.email,
          phone: teacherData.phone,
          grades: teacherData.grades,
          students: teacherData.students,
          joinDate: teacherData.join_date,
          isActive: teacherData.is_active,
          schoolName: teacherData.school_name,
          subjects: teacherData.subjects
        };
        
        setTeacher(formattedTeacher);
        
        // تحديث التخزين المحلي بالبيانات الجديدة
        localStorage.setItem(`${TEACHER_STORAGE_KEY}-${teacherId}`, JSON.stringify(formattedTeacher));
      }
      
      // Load students from Supabase
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .eq('teacher_id', teacherId);
      
      if (studentsError) {
        // إذا لم يتم العثور على الطلاب في Supabase، نحاول تحميلهم من التخزين المحلي
        const savedStudents = localStorage.getItem(`${STUDENTS_STORAGE_KEY}-${teacherId}`);
        const studentsInfo = savedStudents ? JSON.parse(savedStudents) : generateSampleStudents(teacherId);
        setStudents(studentsInfo);
        
        // محاولة إضافة الطلاب إلى Supabase
        for (const student of studentsInfo) {
          await supabase.from('students').insert({
            id: student.id,
            name: student.name,
            grade: student.grade,
            teacher_id: student.teacherId,
            join_date: student.joinDate,
            last_active: student.lastActive,
            is_active: student.isActive,
            notes: student.notes,
            parent_email: student.parentEmail,
            student_number: student.studentNumber,
            class_room_ids: student.classRoomIds
          });
        }
      } else {
        // تحويل بيانات الطلاب من Supabase إلى التنسيق المطلوب
        const formattedStudents: Student[] = studentsData.map(student => ({
          id: student.id,
          name: student.name,
          grade: student.grade,
          teacherId: student.teacher_id,
          joinDate: student.join_date,
          lastActive: student.last_active,
          isActive: student.is_active,
          notes: student.notes,
          parentEmail: student.parent_email,
          studentNumber: student.student_number,
          classRoomIds: student.class_room_ids,
          progress: {
            totalScore: 0,
            currentStreak: 0,
            unitsCompleted: [],
            wordsLearned: 0,
            lastStudyDate: new Date().toISOString(),
            wordProgress: {},
            studySessions: [],
            totalStudyTime: 0,
            studentId: student.id
          },
          achievements: []
        }));
        
        setStudents(formattedStudents);
        
        // تحديث التخزين المحلي بالبيانات الجديدة
        localStorage.setItem(`${STUDENTS_STORAGE_KEY}-${teacherId}`, JSON.stringify(formattedStudents));
      }
      
      // Load student activities from Supabase
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('student_activities')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('start_time', { ascending: false })
        .limit(50);
      
      if (activitiesError) {
        // إذا لم يتم العثور على الأنشطة في Supabase، نحاول تحميلها من التخزين المحلي
        const savedActivities = localStorage.getItem(`${ACTIVITIES_STORAGE_KEY}-${teacherId}`);
        const activitiesInfo = savedActivities ? JSON.parse(savedActivities) : generateSampleActivities(students);
        setRecentActivities(activitiesInfo);
      } else {
        // تحويل بيانات الأنشطة من Supabase إلى التنسيق المطلوب
        const formattedActivities: StudentActivity[] = activitiesData.map(activity => ({
          id: activity.id,
          studentId: activity.student_id,
          activityType: activity.activity_type,
          startTime: activity.start_time,
          endTime: activity.end_time,
          score: activity.score,
          wordsStudied: activity.words_studied,
          correctAnswers: activity.correct_answers,
          totalQuestions: activity.total_questions,
          timeSpent: activity.time_spent,
          unit: activity.unit,
          grade: activity.grade
        }));
        
        setRecentActivities(formattedActivities);
        
        // تحديث التخزين المحلي بالبيانات الجديدة
        localStorage.setItem(`${ACTIVITIES_STORAGE_KEY}-${teacherId}`, JSON.stringify(formattedActivities));
      }
      
      // Load classrooms from Supabase
      const { data: classRoomsData, error: classRoomsError } = await supabase
        .from('class_rooms')
        .select('*')
        .eq('teacher_id', teacherId);
      
      if (classRoomsError) {
        // إذا لم يتم العثور على الفصول في Supabase، نقوم بإنشاء فصول نموذجية
        const classRoomsInfo = generateSampleClassRooms(teacherId, students);
        setClassRooms(classRoomsInfo);
        
        // محاولة إضافة الفصول إلى Supabase
        for (const classRoom of classRoomsInfo) {
          await supabase.from('class_rooms').insert({
            id: classRoom.id,
            name: classRoom.name,
            grade: classRoom.grade,
            teacher_id: classRoom.teacherId,
            created_at: classRoom.createdAt,
            is_active: classRoom.isActive,
            description: classRoom.description,
            last_activity: classRoom.lastActivity,
            subject: classRoom.subject
          });
        }
      } else {
        // تحويل بيانات الفصول من Supabase إلى التنسيق المطلوب
        const formattedClassRooms: ClassRoom[] = classRoomsData.map(classRoom => ({
          id: classRoom.id,
          name: classRoom.name,
          grade: classRoom.grade,
          teacherId: classRoom.teacher_id,
          students: [], // سيتم تحديثها لاحقاً
          createdAt: classRoom.created_at,
          isActive: classRoom.is_active,
          description: classRoom.description,
          lastActivity: classRoom.last_activity,
          subject: classRoom.subject
        }));
        
        setClassRooms(formattedClassRooms);
      }
      
      // Generate dashboard data
      const dashboard = generateDashboardData(teacherId, students, recentActivities, classRooms);
      setDashboardData(dashboard);
    } catch (err: any) {
      console.error('Error loading teacher data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadTeacherData();
  };

  const updateTeacher = async (updates: Partial<Teacher>) => {
    if (!teacher) return;
    
    try {
      // تحديث بيانات المعلم في Supabase
      const { error } = await supabase
        .from('teachers')
        .update({
          name: updates.name,
          email: updates.email,
          phone: updates.phone,
          school_name: updates.schoolName,
          subjects: updates.subjects,
          grades: updates.grades,
          is_active: updates.isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', teacher.id);
      
      if (error) {
        throw error;
      }
      
      // تحديث الحالة المحلية
      const updatedTeacher = { ...teacher, ...updates };
      setTeacher(updatedTeacher);
      
      // تحديث التخزين المحلي (للنسخ الاحتياطي)
      localStorage.setItem(`${TEACHER_STORAGE_KEY}-${teacherId}`, JSON.stringify(updatedTeacher));
      
      // إظهار رسالة نجاح
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
      notification.textContent = 'تم تحديث بيانات المعلم بنجاح';
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
    } catch (err: any) {
      console.error('Error updating teacher:', err);
      setError(err.message);
      
      // في حالة الفشل، نحاول التحديث محلياً
      const updatedTeacher = { ...teacher, ...updates };
      setTeacher(updatedTeacher);
      localStorage.setItem(`${TEACHER_STORAGE_KEY}-${teacherId}`, JSON.stringify(updatedTeacher));
      
      // إظهار رسالة خطأ
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
      notification.textContent = 'حدث خطأ أثناء تحديث بيانات المعلم في قاعدة البيانات. تم الحفظ محلياً فقط.';
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

  const addStudent = async (studentData: Omit<Student, 'id' | 'joinDate' | 'lastActive'>) => {
    try {
      const newStudentId = crypto.randomUUID();
      const newStudent: Student = {
        ...studentData,
        id: newStudentId,
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        isActive: true,
        progress: {
          totalScore: 0,
          currentStreak: 0,
          unitsCompleted: [],
          wordsLearned: 0,
          lastStudyDate: new Date().toISOString(),
          wordProgress: {},
          studySessions: [],
          totalStudyTime: 0,
          studentId: newStudentId
        },
        achievements: []
      };

      // إضافة الطالب إلى Supabase
      const { error } = await supabase.from('students').insert({
        id: newStudent.id,
        name: newStudent.name,
        grade: newStudent.grade,
        teacher_id: newStudent.teacherId,
        join_date: newStudent.joinDate,
        last_active: newStudent.lastActive,
        is_active: newStudent.isActive,
        notes: newStudent.notes,
        parent_email: newStudent.parentEmail,
        student_number: newStudent.studentNumber,
        class_room_ids: newStudent.classRoomIds
      });
      
      if (error) {
        throw error;
      }
      
      // إضافة تقدم الطالب إلى Supabase
      await supabase.from('user_progress').insert({
        id: crypto.randomUUID(),
        student_id: newStudent.id,
        total_score: 0,
        current_streak: 0,
        units_completed: [],
        words_learned: 0,
        last_study_date: new Date().toISOString(),
        word_progress: {},
        study_sessions: [],
        total_study_time: 0
      });

      // تحديث الحالة المحلية
      const updatedStudents = [...students, newStudent];
      setStudents(updatedStudents);
      
      // تحديث التخزين المحلي (للنسخ الاحتياطي)
      localStorage.setItem(`${STUDENTS_STORAGE_KEY}-${teacherId}`, JSON.stringify(updatedStudents));
      
      // إظهار رسالة نجاح
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
      notification.textContent = 'تمت إضافة الطالب بنجاح';
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
      
      return newStudent;
    } catch (err: any) {
      console.error('Error adding student:', err);
      setError(err.message);
      
      // في حالة الفشل، نحاول الإضافة محلياً
      const newStudent: Student = {
        ...studentData,
        id: crypto.randomUUID(),
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        isActive: true,
        progress: {
          totalScore: 0,
          currentStreak: 0,
          unitsCompleted: [],
          wordsLearned: 0,
          lastStudyDate: new Date().toISOString(),
          wordProgress: {},
          studySessions: [],
          totalStudyTime: 0,
          studentId: crypto.randomUUID()
        },
        achievements: []
      };
      
      const updatedStudents = [...students, newStudent];
      setStudents(updatedStudents);
      localStorage.setItem(`${STUDENTS_STORAGE_KEY}-${teacherId}`, JSON.stringify(updatedStudents));
      
      // إظهار رسالة خطأ
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
      notification.textContent = 'حدث خطأ أثناء إضافة الطالب في قاعدة البيانات. تم الحفظ محلياً فقط.';
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
      
      return newStudent;
    }
  };

  const updateStudent = async (studentId: string, updates: Partial<Student>) => {
    try {
      // تحديث بيانات الطالب في Supabase
      const supabaseUpdates: any = {};
      
      if (updates.name) supabaseUpdates.name = updates.name;
      if (updates.grade) supabaseUpdates.grade = updates.grade;
      if (updates.isActive !== undefined) supabaseUpdates.is_active = updates.isActive;
      if (updates.notes !== undefined) supabaseUpdates.notes = updates.notes;
      if (updates.parentEmail !== undefined) supabaseUpdates.parent_email = updates.parentEmail;
      if (updates.studentNumber !== undefined) supabaseUpdates.student_number = updates.studentNumber;
      if (updates.classRoomIds) supabaseUpdates.class_room_ids = updates.classRoomIds;
      
      supabaseUpdates.updated_at = new Date().toISOString();
      
      const { error } = await supabase
        .from('students')
        .update(supabaseUpdates)
        .eq('id', studentId);
      
      if (error) {
        throw error;
      }
      
      // تحديث تقدم الطالب إذا كان متاحاً
      if (updates.progress) {
        const progressUpdates = {
          total_score: updates.progress.totalScore,
          current_streak: updates.progress.currentStreak,
          units_completed: updates.progress.unitsCompleted,
          words_learned: updates.progress.wordsLearned,
          last_study_date: updates.progress.lastStudyDate,
          word_progress: updates.progress.wordProgress,
          study_sessions: updates.progress.studySessions,
          total_study_time: updates.progress.totalStudyTime,
          updated_at: new Date().toISOString()
        };
        
        await supabase
          .from('user_progress')
          .update(progressUpdates)
          .eq('student_id', studentId);
      }
      
      // تحديث الحالة المحلية
      const updatedStudents = students.map(student =>
        student.id === studentId ? { ...student, ...updates } : student
      );
      setStudents(updatedStudents);
      
      // تحديث التخزين المحلي (للنسخ الاحتياطي)
      localStorage.setItem(`${STUDENTS_STORAGE_KEY}-${teacherId}`, JSON.stringify(updatedStudents));
      
      // إظهار رسالة نجاح
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
      notification.textContent = 'تم تحديث بيانات الطالب بنجاح';
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
    } catch (err: any) {
      console.error('Error updating student:', err);
      setError(err.message);
      
      // في حالة الفشل، نحاول التحديث محلياً
      const updatedStudents = students.map(student =>
        student.id === studentId ? { ...student, ...updates } : student
      );
      setStudents(updatedStudents);
      localStorage.setItem(`${STUDENTS_STORAGE_KEY}-${teacherId}`, JSON.stringify(updatedStudents));
      
      // إظهار رسالة خطأ
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
      notification.textContent = 'حدث خطأ أثناء تحديث بيانات الطالب في قاعدة البيانات. تم الحفظ محلياً فقط.';
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

  const deleteStudent = async (studentId: string) => {
    try {
      // حذف الطالب من Supabase
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId);
      
      if (error) {
        throw error;
      }
      
      // حذف تقدم الطالب
      await supabase
        .from('user_progress')
        .delete()
        .eq('student_id', studentId);
      
      // حذف إنجازات الطالب
      await supabase
        .from('achievements')
        .delete()
        .eq('student_id', studentId);
      
      // تحديث الحالة المحلية
      const updatedStudents = students.filter(student => student.id !== studentId);
      setStudents(updatedStudents);
      
      // تحديث التخزين المحلي (للنسخ الاحتياطي)
      localStorage.setItem(`${STUDENTS_STORAGE_KEY}-${teacherId}`, JSON.stringify(updatedStudents));
      
      // إظهار رسالة نجاح
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
      notification.textContent = 'تم حذف الطالب بنجاح';
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
    } catch (err: any) {
      console.error('Error deleting student:', err);
      setError(err.message);
      
      // في حالة الفشل، نحاول الحذف محلياً
      const updatedStudents = students.filter(student => student.id !== studentId);
      setStudents(updatedStudents);
      localStorage.setItem(`${STUDENTS_STORAGE_KEY}-${teacherId}`, JSON.stringify(updatedStudents));
      
      // إظهار رسالة خطأ
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
      notification.textContent = 'حدث خطأ أثناء حذف الطالب من قاعدة البيانات. تم الحذف محلياً فقط.';
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

  const exportStudentData = (format: 'csv' | 'excel' | 'all') => {
    const csvContent = [
      ['الاسم', 'رقم الطالب', 'الصف', 'النقاط الإجمالية', 'الكلمات المتعلمة', 'الوحدات المكتملة', 'آخر نشاط', 'وقت الدراسة الإجمالي'].join(','),
      ...students.map(student => [
        student.name,
        student.studentNumber || '',
        student.grade,
        student.progress.totalScore,
        student.progress.wordsLearned,
        student.progress.unitsCompleted.length,
        new Date(student.lastActive).toLocaleDateString('ar-SA'),
        Math.round(student.progress.totalStudyTime / 60) + ' دقيقة'
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `students_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importStudentData = async (file: File) => {
    try {
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',');
      
      const newStudents: Student[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length >= 3 && values[0].trim()) {
          const student: Student = {
            id: crypto.randomUUID(),
            name: values[0].trim(),
            studentNumber: values[1]?.trim() || undefined,
            grade: parseInt(values[2]) || 5,
            teacherId,
            joinDate: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            isActive: true,
            progress: {
              totalScore: 0,
              currentStreak: 0,
              unitsCompleted: [],
              wordsLearned: 0,
              lastStudyDate: new Date().toISOString(),
              wordProgress: {},
              studySessions: [],
              totalStudyTime: 0,
              studentId: crypto.randomUUID()
            },
            achievements: [],
            parentEmail: values[3]?.trim() || undefined,
            notes: values[4]?.trim() || undefined
          };
          
          // إضافة الطالب إلى Supabase
          const { error } = await supabase.from('students').insert({
            id: student.id,
            name: student.name,
            grade: student.grade,
            teacher_id: student.teacherId,
            join_date: student.joinDate,
            last_active: student.lastActive,
            is_active: student.isActive,
            notes: student.notes,
            parent_email: student.parentEmail,
            student_number: student.studentNumber
          });
          
          if (error) {
            console.error('Error adding imported student to Supabase:', error);
          } else {
            // إضافة تقدم الطالب إلى Supabase
            await supabase.from('user_progress').insert({
              id: crypto.randomUUID(),
              student_id: student.id,
              total_score: 0,
              current_streak: 0,
              units_completed: [],
              words_learned: 0,
              last_study_date: new Date().toISOString(),
              word_progress: {},
              study_sessions: [],
              total_study_time: 0
            });
          }
          
          newStudents.push(student);
        }
      }
      
      // تحديث الحالة المحلية
      const updatedStudents = [...students, ...newStudents];
      setStudents(updatedStudents);
      
      // تحديث التخزين المحلي (للنسخ الاحتياطي)
      localStorage.setItem(`${STUDENTS_STORAGE_KEY}-${teacherId}`, JSON.stringify(updatedStudents));
      
      // إظهار رسالة نجاح
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
      notification.textContent = `تمت إضافة ${newStudents.length} طالب بنجاح`;
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
      
      return newStudents.length;
    } catch (err: any) {
      console.error('Error importing student data:', err);
      setError(err.message);
      
      // إظهار رسالة خطأ
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
      notification.textContent = 'حدث خطأ أثناء استيراد بيانات الطلاب';
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
      
      throw err;
    }
  };

  return {
    dashboardData,
    students,
    classRooms,
    recentActivities,
    loading,
    teacher,
    error,
    refreshData,
    updateTeacher,
    addStudent,
    updateStudent,
    deleteStudent,
    exportStudentData,
    importStudentData
  };
};

// Helper functions to generate sample data
const generateSampleStudents = (teacherId: string): Student[] => {
  const sampleNames = [
    'أحمد محمد علي', 'فاطمة أحمد', 'محمد عبدالله', 'عائشة سالم', 'علي حسن',
    'مريم خالد', 'يوسف إبراهيم', 'زينب عمر', 'حسن محمود', 'نور الدين',
    'رؤى أحمد', 'أروى سالم', 'البتول محمد'
  ];

  const studentGenders = [
    'male', 'female', 'male', 'female', 'male',
    'female', 'male', 'female', 'male', 'female',
    'female', 'female', 'female'
  ];
  return sampleNames.map((name, index) => ({
    id: `student-${index + 1}`,
    name,
    gender: studentGenders[index] as 'male' | 'female',
    grade: 5,
    teacherId,
    joinDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: Math.random() > 0.2,
    studentNumber: `2024${(index + 1).toString().padStart(3, '0')}`,
    progress: {
      totalScore: Math.floor(Math.random() * 500) + 50,
      currentStreak: Math.floor(Math.random() * 20),
      unitsCompleted: ['Welcome Back', 'Talent Show'].slice(0, Math.floor(Math.random() * 3)),
      wordsLearned: Math.floor(Math.random() * 100) + 20,
      lastStudyDate: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
      wordProgress: {},
      studySessions: [],
      totalStudyTime: Math.floor(Math.random() * 3600) + 600,
      studentId: `student-${index + 1}`
    },
    achievements: []
  }));
};

const generateSampleActivities = (students: Student[]): StudentActivity[] => {
  const activities: StudentActivity[] = [];
  const activityTypes: any[] = ['flashcards', 'quiz', 'memory', 'pronunciation', 'grammar'];
  
  students.forEach(student => {
    for (let i = 0; i < Math.floor(Math.random() * 10) + 5; i++) {
      activities.push({
        id: `activity-${student.id}-${i}`,
        studentId: student.id,
        activityType: activityTypes[Math.floor(Math.random() * activityTypes.length)],
        startTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        score: Math.floor(Math.random() * 100),
        wordsStudied: ['hello', 'goodbye', 'thank you'],
        correctAnswers: Math.floor(Math.random() * 10) + 5,
        totalQuestions: 10,
        timeSpent: Math.floor(Math.random() * 600) + 120,
        unit: 'Welcome Back',
        grade: student.grade
      });
    }
  });
  
  return activities.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
};

const generateSampleClassRooms = (teacherId: string, students: Student[]): ClassRoom[] => {
  return [
    {
      id: 'class-5a',
      name: 'الصف الخامس أ',
      grade: 5,
      teacherId,
      students: students.slice(0, 5).map(s => s.id),
      createdAt: new Date().toISOString(),
      isActive: true,
      description: 'فصل الصف الخامس الأساسي - المجموعة الأولى',
      subject: 'اللغة الإنجليزية'
    },
    {
      id: 'class-5b',
      name: 'الصف الخامس ب',
      grade: 5,
      teacherId,
      students: students.slice(5).map(s => s.id),
      createdAt: new Date().toISOString(),
      isActive: true,
      description: 'فصل الصف الخامس الأساسي - المجموعة الثانية',
      subject: 'اللغة الإنجليزية'
    }
  ];
};

const generateDashboardData = (
  teacherId: string,
  students: Student[],
  activities: StudentActivity[],
  classRooms: ClassRoom[]
): TeacherDashboard => {
  const activeStudents = students.filter(s => {
    const daysSinceActive = Math.floor((Date.now() - new Date(s.lastActive).getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceActive <= 7;
  }).length;

  const topPerformers = students
    .sort((a, b) => b.progress.totalScore - a.progress.totalScore)
    .slice(0, 5)
    .map(student => ({
      studentId: student.id,
      studentName: student.name,
      score: student.progress.totalScore,
      improvement: Math.floor(Math.random() * 20) - 5 // Random improvement percentage
    }));

  const strugglingStudents = students
    .filter(s => s.progress.totalScore < 100)
    .slice(0, 5)
    .map(student => ({
      studentId: student.id,
      studentName: student.name,
      issueAreas: ['النطق', 'التهجئة'].slice(0, Math.floor(Math.random() * 2) + 1),
      lastActive: student.lastActive
    }));

  return {
    teacherId,
    totalStudents: students.length,
    activeStudents,
    classRooms,
    recentActivities: activities.slice(0, 20),
    topPerformers,
    strugglingStudents,
    weeklyStats: [
      {
        week: 'هذا الأسبوع',
        totalActivities: activities.filter(a => {
          const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
          return new Date(a.startTime).getTime() > weekAgo;
        }).length,
        averageScore: Math.floor(Math.random() * 30) + 70,
        activeStudents
      }
    ]
  };
};