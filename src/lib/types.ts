import { v4 as uuidv4 } from 'uuid';

export type QuestionType =
  | 'mcq-single'
  | 'mcq-multiple'
  | 'true-false'
  | 'match-following'
  | 'fill-blanks'
  | 'one-sentence'
  | 'short-answer'
  | 'long-answer'
  | 'essay'
  | 'short-notes'
  | 'custom';

export type Difficulty = 'easy' | 'medium' | 'hard';

// All 22 Scheduled Languages of India + English
export type Language =
  | 'english'
  | 'hindi'
  | 'bengali'
  | 'telugu'
  | 'marathi'
  | 'tamil'
  | 'urdu'
  | 'gujarati'
  | 'kannada'
  | 'malayalam'
  | 'odia'
  | 'punjabi'
  | 'assamese'
  | 'maithili'
  | 'sanskrit'
  | 'santali'
  | 'kashmiri'
  | 'nepali'
  | 'sindhi'
  | 'konkani'
  | 'dogri'
  | 'manipuri'
  | 'bodo';

export interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface MatchPair {
  id: string;
  left: string;
  right: string;
}

export interface SubQuestion {
  id: string;
  text: string;
  marks?: number;
}

export interface QuestionBlock {
  id: string;
  type: QuestionType;
  questionText: string;
  marks: number;
  difficulty?: Difficulty;
  language: Language;
  isAIGenerated: boolean;
  options?: MCQOption[];
  matchPairs?: MatchPair[];
  subQuestions?: SubQuestion[];
  correctAnswer?: string | boolean;
  blanks?: string[];
  instructions?: string;
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  questions: QuestionBlock[];
  totalMarks: number;
  instructions?: string;
}

export interface PaperMetadata {
  institutionName: string;
  logoUrl?: string;
  examName: string;
  subject: string;
  classOrCourse: string;
  date: string;
  duration: string;
  paperCode?: string;
  totalMarks: number;
  instructions: string;
  language: Language; // Paper-level language setting
}

export interface QuestionPaper {
  id: string;
  metadata: PaperMetadata;
  sections: Section[];
  createdAt: string;
  updatedAt: string;
  isAIAssisted: boolean;
}

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  'mcq-single': 'MCQ (Single Correct)',
  'mcq-multiple': 'MCQ (Multiple Correct)',
  'true-false': 'True / False',
  'match-following': 'Match the Following',
  'fill-blanks': 'Fill in the Blanks',
  'one-sentence': 'Answer in One Sentence',
  'short-answer': 'Short Answer',
  'long-answer': 'Long Answer',
  'essay': 'Essay Type',
  'short-notes': 'Write Short Notes',
  'custom': 'Custom Question',
};

export const QUESTION_TYPE_CATEGORIES = {
  objective: ['mcq-single', 'mcq-multiple', 'true-false', 'match-following'] as QuestionType[],
  shortAnswer: ['fill-blanks', 'one-sentence', 'short-answer'] as QuestionType[],
  descriptive: ['long-answer', 'essay', 'short-notes'] as QuestionType[],
  flexible: ['custom'] as QuestionType[],
};

export const LANGUAGE_LABELS: Record<Language, string> = {
  english: 'English',
  hindi: 'हिन्दी (Hindi)',
  bengali: 'বাংলা (Bengali)',
  telugu: 'తెలుగు (Telugu)',
  marathi: 'मराठी (Marathi)',
  tamil: 'தமிழ் (Tamil)',
  urdu: 'اردو (Urdu)',
  gujarati: 'ગુજરાતી (Gujarati)',
  kannada: 'ಕನ್ನಡ (Kannada)',
  malayalam: 'മലയാളം (Malayalam)',
  odia: 'ଓଡ଼ିଆ (Odia)',
  punjabi: 'ਪੰਜਾਬੀ (Punjabi)',
  assamese: 'অসমীয়া (Assamese)',
  maithili: 'मैथिली (Maithili)',
  sanskrit: 'संस्कृतम् (Sanskrit)',
  santali: 'ᱥᱟᱱᱛᱟᱲᱤ (Santali)',
  kashmiri: 'कॉशुर (Kashmiri)',
  nepali: 'नेपाली (Nepali)',
  sindhi: 'سنڌي (Sindhi)',
  konkani: 'कोंकणी (Konkani)',
  dogri: 'डोगरी (Dogri)',
  manipuri: 'মৈতৈলোন্ (Manipuri)',
  bodo: 'बड़ो (Bodo)',
};

export function createDefaultQuestion(type: QuestionType): QuestionBlock {
  const base: QuestionBlock = {
    id: uuidv4(),
    type,
    questionText: '',
    marks: 1,
    language: 'english',
    isAIGenerated: false,
  };

  switch (type) {
    case 'mcq-single':
    case 'mcq-multiple':
      return {
        ...base,
        marks: 1,
        options: [
          { id: uuidv4(), text: '', isCorrect: false },
          { id: uuidv4(), text: '', isCorrect: false },
          { id: uuidv4(), text: '', isCorrect: false },
          { id: uuidv4(), text: '', isCorrect: false },
        ],
      };
    case 'true-false':
      return {
        ...base,
        marks: 1,
        correctAnswer: true,
      };
    case 'match-following':
      return {
        ...base,
        marks: 4,
        matchPairs: [
          { id: uuidv4(), left: '', right: '' },
          { id: uuidv4(), left: '', right: '' },
          { id: uuidv4(), left: '', right: '' },
          { id: uuidv4(), left: '', right: '' },
        ],
      };
    case 'fill-blanks':
      return {
        ...base,
        marks: 1,
        blanks: [''],
      };
    case 'one-sentence':
      return {
        ...base,
        marks: 1,
      };
    case 'short-answer':
      return {
        ...base,
        marks: 2,
      };
    case 'long-answer':
      return {
        ...base,
        marks: 5,
      };
    case 'essay':
      return {
        ...base,
        marks: 10,
      };
    case 'short-notes':
      return {
        ...base,
        marks: 3,
      };
    case 'custom':
      return {
        ...base,
        marks: 1,
      };
    default:
      return base;
  }
}

export function createDefaultSection(): Section {
  return {
    id: uuidv4(),
    title: 'Section A',
    description: '',
    questions: [],
    totalMarks: 0,
    instructions: '',
  };
}

export function createDefaultPaper(): QuestionPaper {
  return {
    id: uuidv4(),
    metadata: {
      institutionName: '',
      examName: '',
      subject: '',
      classOrCourse: '',
      date: new Date().toISOString().split('T')[0],
      duration: '3 Hours',
      totalMarks: 100,
      instructions: 'Attempt all questions.\nWrite neatly and legibly.\nMarks are indicated against each question.',
      language: 'english',
    },
    sections: [createDefaultSection()],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isAIAssisted: false,
  };
}

export function calculateSectionMarks(section: Section): number {
  return section.questions.reduce((sum, q) => sum + q.marks, 0);
}

export function calculateTotalMarks(paper: QuestionPaper): number {
  return paper.sections.reduce((sum, s) => sum + calculateSectionMarks(s), 0);
}
