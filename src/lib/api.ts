/**
 * PURPOSE: Typed API client for Django backend
 * USED BY: All pages and components that fetch data
 * DEPENDS ON: Django API at NEXT_PUBLIC_API_URL
 *
 * Every response from the Django API for list endpoints is paginated:
 *   { count, next, previous, results: T[] }
 *
 * Usage:
 *   const subjects = await api.getSubjects();
 *   const question = await api.getQuestion(42);
 *   const result = await api.checkAnswer(42, "A");
 */

/* ── Base URL ── */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

/* ── Types matching Django serializers ── */

export interface Subject {
  id: number;
  name: string;
  name_hi: string;
  code: string;
  slug: string;
  question_count: number;
  chapter_count: number;
}

export interface Chapter {
  id: number;
  name: string;
  name_hi: string;
  code: string;
  slug: string;
  subject_name: string;
  unit_name: string;
  question_count: number;
}

export interface Topic {
  id: number;
  name: string;
  name_hi: string;
  slug: string;
  sort_order: number;
}

export interface Appearance {
  exam_source: string;
  exam_name: string;
  year: number;
  is_primary: boolean;
}

export interface QuestionListItem {
  id: number;
  question_id: string;
  stem: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  difficulty: string;
  year: number;
  exam_source: string;
  subject_name: string;
}

export interface QuestionDetail extends QuestionListItem {
  stem_hi: string;
  correct_answer: string;
  explanation: string;
  explanation_hi: string;
  teaching_note: string;
  mnemonic: string;
  common_mistake: string;
  exam_tip: string;
  tags: string;
  blooms_level: number;
  repeat_count: number;
  appearances: Appearance[];
}

export interface CheckAnswerResult {
  is_correct: boolean;
  marks: number;
  your_answer: string;
  correct_answer: string;
  question: QuestionDetail;
}

export interface PlatformStats {
  chapters: number;
  topics: number;
  facts: number;
  sites: number;
  timeline_events: number;
  glossary_terms: number;
  visuals: number;
  exercises: number;
  prelims_pyqs: number;
  prelims_complete: number;
}

/** Aliases used by practice page */
export type Question = QuestionListItem;
export type AnswerResult = CheckAnswerResult;

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/* ── Fetch helper with error handling ── */

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  /** Fetch from Django API with JSON parsing and error handling. */
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${url}`);
  }

  return response.json() as Promise<T>;
}

/* ── API methods ── */

export const api = {
  /** Fetch platform-wide statistics. */
  getStats(): Promise<PlatformStats> {
    return apiFetch<PlatformStats>("/stats/");
  },

  /** Fetch all subjects (paginated). */
  getSubjects(): Promise<PaginatedResponse<Subject>> {
    return apiFetch<PaginatedResponse<Subject>>("/subjects/");
  },

  /** Fetch chapters, optionally filtered by subject ID. */
  getChapters(subjectId?: number): Promise<PaginatedResponse<Chapter>> {
    const query = subjectId ? `?unit__subject=${subjectId}` : "";
    return apiFetch<PaginatedResponse<Chapter>>(`/chapters/${query}`);
  },

  /** Fetch topics for a specific chapter. */
  getChapterTopics(chapterId: number): Promise<Topic[]> {
    return apiFetch<Topic[]>(`/chapters/${chapterId}/topics/`);
  },

  /** Fetch paginated question list (no correct_answer). */
  getQuestions(
    params: Record<string, string> = {}
  ): Promise<PaginatedResponse<QuestionListItem>> {
    const query = new URLSearchParams(params).toString();
    const path = query ? `/questions/?${query}` : "/questions/";
    return apiFetch<PaginatedResponse<QuestionListItem>>(path);
  },

  /** Fetch a single question with full detail (includes correct_answer). */
  getQuestion(questionId: number): Promise<QuestionDetail> {
    return apiFetch<QuestionDetail>(`/questions/${questionId}/`);
  },

  /** Submit an answer and get marks. */
  checkAnswer(questionId: number, answer: string): Promise<CheckAnswerResult> {
    return apiFetch<CheckAnswerResult>(
      `/questions/${questionId}/check_answer/`,
      {
        method: "POST",
        body: JSON.stringify({ answer }),
      }
    );
  },

  /** Fetch a random set of questions, optionally filtered by subject. */
  getRandomSet(count: number = 10, subjectId?: number): Promise<QuestionListItem[]> {
    let path = `/questions/random_set/?count=${count}`;
    if (subjectId) path += `&subject=${subjectId}`;
    return apiFetch<QuestionListItem[]>(path);
  },

  /** Fetch questions filtered by chapter code. */
  getQuestionsByChapter(
    code: string
  ): Promise<PaginatedResponse<QuestionListItem>> {
    return apiFetch<PaginatedResponse<QuestionListItem>>(
      `/questions/by_chapter/?code=${code}`
    );
  },
};
