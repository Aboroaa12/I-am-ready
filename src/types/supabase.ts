export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      access_codes: {
        Row: {
          id: string
          code: string
          grade: number
          description: string
          teacher_id: string
          created_at: string
          expires_at: string | null
          is_active: boolean
          usage_count: number | null
          max_usage: number | null
          student_id: string | null
          class_room_id: string | null
          teacher_name: string | null
          teacher_phone: string | null
        }
        Insert: {
          id?: string
          code: string
          grade: number
          description: string
          teacher_id: string
          created_at?: string
          expires_at?: string | null
          is_active?: boolean
          usage_count?: number | null
          max_usage?: number | null
          student_id?: string | null
          class_room_id?: string | null
          teacher_name?: string | null
          teacher_phone?: string | null
        }
        Update: {
          id?: string
          code?: string
          grade?: number
          description?: string
          teacher_id?: string
          created_at?: string
          expires_at?: string | null
          is_active?: boolean
          usage_count?: number | null
          max_usage?: number | null
          student_id?: string | null
          class_room_id?: string | null
          teacher_name?: string | null
          teacher_phone?: string | null
        }
      }
      achievements: {
        Row: {
          id: string
          student_id: string
          achievement_id: string
          title: string
          description: string
          icon: string
          achieved: boolean
          achieved_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          achievement_id: string
          title: string
          description: string
          icon: string
          achieved?: boolean
          achieved_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          achievement_id?: string
          title?: string
          description?: string
          icon?: string
          achieved?: boolean
          achieved_date?: string | null
          created_at?: string
        }
      }
      class_rooms: {
        Row: {
          id: string
          name: string
          grade: number
          teacher_id: string
          created_at: string
          is_active: boolean
          description: string | null
          last_activity: string | null
          subject: string | null
        }
        Insert: {
          id?: string
          name: string
          grade: number
          teacher_id: string
          created_at?: string
          is_active?: boolean
          description?: string | null
          last_activity?: string | null
          subject?: string | null
        }
        Update: {
          id?: string
          name?: string
          grade?: number
          teacher_id?: string
          created_at?: string
          is_active?: boolean
          description?: string | null
          last_activity?: string | null
          subject?: string | null
        }
      }
      grammar_rules: {
        Row: {
          id: string
          title: string
          explanation: string
          examples: string[]
          unit: string
          grade: number
          created_at: string
          updated_at: string | null
          created_by: string | null
        }
        Insert: {
          id?: string
          title: string
          explanation: string
          examples: string[]
          unit: string
          grade: number
          created_at?: string
          updated_at?: string | null
          created_by?: string | null
        }
        Update: {
          id?: string
          title?: string
          explanation?: string
          examples?: string[]
          unit?: string
          grade?: number
          created_at?: string
          updated_at?: string | null
          created_by?: string | null
        }
      }
      health_check: {
        Row: {
          id: number
          status: string
          created_at: string
        }
        Insert: {
          id?: number
          status: string
          created_at?: string
        }
        Update: {
          id?: number
          status?: string
          created_at?: string
        }
      }
      quiz_questions: {
        Row: {
          id: string
          question: string
          options: string[]
          correct: number
          explanation: string
          unit: string
          grade: number
          created_at: string
          updated_at: string | null
          created_by: string | null
        }
        Insert: {
          id?: string
          question: string
          options: string[]
          correct: number
          explanation: string
          unit: string
          grade: number
          created_at?: string
          updated_at?: string | null
          created_by?: string | null
        }
        Update: {
          id?: string
          question?: string
          options?: string[]
          correct?: number
          explanation?: string
          unit?: string
          grade?: number
          created_at?: string
          updated_at?: string | null
          created_by?: string | null
        }
      }
      settings: {
        Row: {
          id: string
          key: string
          value: Json
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          key: string
          value: Json
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          created_at?: string
          updated_at?: string | null
        }
      }
      student_activities: {
        Row: {
          id: string
          student_id: string
          activity_type: string
          start_time: string
          end_time: string | null
          score: number
          words_studied: string[]
          correct_answers: number
          total_questions: number
          time_spent: number
          unit: string
          grade: number
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          activity_type: string
          start_time: string
          end_time?: string | null
          score: number
          words_studied: string[]
          correct_answers: number
          total_questions: number
          time_spent: number
          unit: string
          grade: number
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          activity_type?: string
          start_time?: string
          end_time?: string | null
          score?: number
          words_studied?: string[]
          correct_answers?: number
          total_questions?: number
          time_spent?: number
          unit?: string
          grade?: number
          created_at?: string
        }
      }
      students: {
        Row: {
          id: string
          name: string
          grade: number
          teacher_id: string
          join_date: string
          last_active: string
          is_active: boolean
          notes: string | null
          parent_email: string | null
          student_number: string | null
          class_room_ids: string[] | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          grade: number
          teacher_id: string
          join_date?: string
          last_active?: string
          is_active?: boolean
          notes?: string | null
          parent_email?: string | null
          student_number?: string | null
          class_room_ids?: string[] | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          grade?: number
          teacher_id?: string
          join_date?: string
          last_active?: string
          is_active?: boolean
          notes?: string | null
          parent_email?: string | null
          student_number?: string | null
          class_room_ids?: string[] | null
          created_at?: string
          updated_at?: string | null
        }
      }
      teachers: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          grades: number[]
          students: string[]
          join_date: string
          is_active: boolean
          school_name: string | null
          subjects: string[] | null
          created_at: string
          updated_at: string | null
          code_limit: number
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          grades: number[]
          students?: string[]
          join_date?: string
          is_active?: boolean
          school_name?: string | null
          subjects?: string[] | null
          created_at?: string
          updated_at?: string | null
          code_limit?: number
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          grades?: number[]
          students?: string[]
          join_date?: string
          is_active?: boolean
          school_name?: string | null
          subjects?: string[] | null
          created_at?: string
          updated_at?: string | null
          code_limit?: number
        }
      }
      user_progress: {
        Row: {
          id: string
          student_id: string
          total_score: number
          current_streak: number
          units_completed: string[]
          words_learned: number
          last_study_date: string
          word_progress: Json
          study_sessions: Json[]
          total_study_time: number
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          student_id: string
          total_score?: number
          current_streak?: number
          units_completed?: string[]
          words_learned?: number
          last_study_date?: string
          word_progress?: Json
          study_sessions?: Json[]
          total_study_time?: number
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string
          total_score?: number
          current_streak?: number
          units_completed?: string[]
          words_learned?: number
          last_study_date?: string
          word_progress?: Json
          study_sessions?: Json[]
          total_study_time?: number
          created_at?: string
          updated_at?: string | null
        }
      }
      vocabulary_words: {
        Row: {
          id: string
          english: string
          arabic: string
          unit: string
          pronunciation: string | null
          grade: number
          part_of_speech: string | null
          example_sentence: string | null
          difficulty: string | null
          created_at: string
          updated_at: string | null
          created_by: string | null
        }
        Insert: {
          id?: string
          english: string
          arabic: string
          unit: string
          pronunciation?: string | null
          grade: number
          part_of_speech?: string | null
          example_sentence?: string | null
          difficulty?: string | null
          created_at?: string
          updated_at?: string | null
          created_by?: string | null
        }
        Update: {
          id?: string
          english?: string
          arabic?: string
          unit?: string
          pronunciation?: string | null
          grade?: number
          part_of_speech?: string | null
          example_sentence?: string | null
          difficulty?: string | null
          created_at?: string
          updated_at?: string | null
          created_by?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}