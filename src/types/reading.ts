// Reading Coach types

export type PassageType = 'fiction' | 'nonfiction';
export type SkillCategory = 'A' | 'B' | 'C' | 'D';
export type QuestionType = 'mcq_main_idea' | 'mcq_detail' | 'short_answer' | 'mcq_vocab';
export type ReadingLevel = 'grade3';

export interface EvidenceSpan {
  start: number;
  end: number;
}

export interface Question {
  id?: string;
  session_id?: string;
  order_index: number;
  question_type: QuestionType;
  prompt: string;
  choices: string[] | null;
  correct_answer: string;
  explanation: string;
  hint: string | null;
  evidence_spans: EvidenceSpan[];
}

export interface Session {
  id?: string;
  user_id?: string;
  created_at?: string;
  passage_type: PassageType;
  primary_skill_category: SkillCategory;
  passage_title: string;
  passage_text: string;
  reading_level: ReadingLevel;
  estimated_minutes: number;
  total_questions: number;
  correct_count: number;
  completed_at?: string;
  is_seeded: boolean;
  questions?: Question[];
}

export interface Attempt {
  id?: string;
  session_id: string;
  question_id: string;
  child_answer: string;
  is_correct: boolean;
  is_partial?: boolean; // For short answers with partial credit
  seconds_spent: number;
  created_at?: string;
}

export interface Settings {
  id?: string;
  user_id?: string;
  child_name: string;
  grade_level: number;
  created_at?: string;
  updated_at?: string;
}

export interface DailyStats {
  id?: string;
  user_id?: string;
  date: string;
  sessions_completed: number;
  correct_count: number;
  total_count: number;
  minutes_spent: number;
  streak: number;
}

export interface WordDetectiveItem {
  sentence: string;
  prompt: string;
  target_word: string;
  word_type: 'noun' | 'verb' | 'adjective' | 'conjunction';
  feedback: string;
}

export interface GeneratedSession {
  passage_title: string;
  passage_text: string;
  passage_type: PassageType;
  primary_skill_category: SkillCategory;
  reading_level: ReadingLevel;
  questions: Omit<Question, 'id' | 'session_id'>[];
  word_detective?: WordDetectiveItem[];
}

export const SKILL_CATEGORIES: Record<SkillCategory, { name: string; description: string; icon: string }> = {
  A: { name: 'Fiction & Nonfiction', description: 'Different types of stories', icon: '📚' },
  B: { name: 'Main Idea & Structure', description: 'Understanding the big picture', icon: '🎯' },
  C: { name: 'Key Ideas & Details', description: 'Finding important information', icon: '🔍' },
  D: { name: 'Knowledge & Ideas', description: 'Connecting what you learn', icon: '💡' },
};
