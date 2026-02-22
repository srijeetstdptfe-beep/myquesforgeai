import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  QuestionPaper,
  QuestionBlock,
  Section,
  PaperMetadata,
  createDefaultPaper,
  createDefaultSection,
  createDefaultQuestion,
  QuestionType,
  calculateSectionMarks,
} from './types';
import { v4 as uuidv4 } from 'uuid';

interface PaperBuilderState {
  papers: QuestionPaper[];
  currentPaper: QuestionPaper | null;
  selectedSectionId: string | null;
  selectedQuestionId: string | null;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  createPaper: (isAIAssisted?: boolean) => string;
  loadPaper: (id: string) => void;
  savePaper: () => void;
  deletePaper: (id: string) => void;
  duplicatePaper: (id: string) => string;

  updateMetadata: (metadata: Partial<PaperMetadata>) => void;
  setSections: (sections: Section[]) => void;

  addSection: () => void;
  updateSection: (sectionId: string, updates: Partial<Section>) => void;
  deleteSection: (sectionId: string) => void;
  reorderSections: (newOrder: string[]) => void;

  addQuestion: (sectionId: string, type: QuestionType) => void;
  updateQuestion: (sectionId: string, questionId: string, updates: Partial<QuestionBlock>) => void;
  deleteQuestion: (sectionId: string, questionId: string) => void;
  duplicateQuestion: (sectionId: string, questionId: string) => void;
  moveQuestion: (fromSectionId: string, toSectionId: string, questionId: string, newIndex: number) => void;
  reorderQuestions: (sectionId: string, newOrder: string[]) => void;

  selectSection: (sectionId: string | null) => void;
  selectQuestion: (questionId: string | null) => void;

  clearCurrentPaper: () => void;
  clearAllPapers: () => void; // Clear all papers (for logout/account switch)
}

export const usePaperStore = create<PaperBuilderState>()(
  persist(
    (set, get) => ({
      papers: [],
      currentPaper: null,
      selectedSectionId: null,
      selectedQuestionId: null,
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),

      createPaper: (isAIAssisted = false) => {
        const newPaper = createDefaultPaper();
        newPaper.isAIAssisted = isAIAssisted;
        set((state) => ({
          papers: [...state.papers, newPaper],
          currentPaper: newPaper,
          selectedSectionId: newPaper.sections[0]?.id || null,
          selectedQuestionId: null,
        }));
        return newPaper.id;
      },

      loadPaper: (id: string) => {
        const paper = get().papers.find((p) => p.id === id);
        if (paper) {
          set({
            currentPaper: JSON.parse(JSON.stringify(paper)),
            selectedSectionId: paper.sections[0]?.id || null,
            selectedQuestionId: null,
          });
        }
      },

      savePaper: () => {
        const { currentPaper, papers } = get();
        if (!currentPaper) return;

        currentPaper.updatedAt = new Date().toISOString();
        currentPaper.sections = currentPaper.sections.map((s) => ({
          ...s,
          totalMarks: calculateSectionMarks(s),
        }));

        const index = papers.findIndex((p) => p.id === currentPaper.id);
        if (index >= 0) {
          const newPapers = [...papers];
          newPapers[index] = JSON.parse(JSON.stringify(currentPaper));
          set({ papers: newPapers });
        }
      },

      deletePaper: (id: string) => {
        set((state) => ({
          papers: state.papers.filter((p) => p.id !== id),
          currentPaper: state.currentPaper?.id === id ? null : state.currentPaper,
        }));
      },

      duplicatePaper: (id: string) => {
        const paper = get().papers.find((p) => p.id === id);
        if (!paper) return '';

        const duplicated: QuestionPaper = JSON.parse(JSON.stringify(paper));
        duplicated.id = uuidv4();
        duplicated.metadata.examName = `${paper.metadata.examName} (Copy)`;
        duplicated.createdAt = new Date().toISOString();
        duplicated.updatedAt = new Date().toISOString();

        duplicated.sections = duplicated.sections.map((s) => ({
          ...s,
          id: uuidv4(),
          questions: s.questions.map((q) => ({ ...q, id: uuidv4() })),
        }));

        set((state) => ({ papers: [...state.papers, duplicated] }));
        return duplicated.id;
      },

      updateMetadata: (metadata: Partial<PaperMetadata>) => {
        set((state) => {
          if (!state.currentPaper) return state;
          const updatedPaper = {
            ...state.currentPaper,
            metadata: { ...state.currentPaper.metadata, ...metadata },
            updatedAt: new Date().toISOString(),
          };
          return {
            currentPaper: updatedPaper,
            papers: state.papers.map((p) => (p.id === updatedPaper.id ? updatedPaper : p)),
          };
        });
      },

      setSections: (sections: Section[]) => {
        set((state) => {
          if (!state.currentPaper) return state;
          const updatedPaper = {
            ...state.currentPaper,
            sections: sections,
            updatedAt: new Date().toISOString(),
          };
          return {
            currentPaper: updatedPaper,
            papers: state.papers.map((p) => (p.id === updatedPaper.id ? updatedPaper : p)),
          };
        });
      },

      addSection: () => {
        set((state) => {
          if (!state.currentPaper) return state;
          const newSection = createDefaultSection();
          const sectionCount = state.currentPaper.sections.length;
          const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
          newSection.title = `Section ${letters[sectionCount] || sectionCount + 1}`;

          const updatedPaper = {
            ...state.currentPaper,
            sections: [...state.currentPaper.sections, newSection],
            updatedAt: new Date().toISOString(),
          };

          return {
            currentPaper: updatedPaper,
            papers: state.papers.map((p) => (p.id === updatedPaper.id ? updatedPaper : p)),
            selectedSectionId: newSection.id,
          };
        });
      },

      updateSection: (sectionId: string, updates: Partial<Section>) => {
        set((state) => {
          if (!state.currentPaper) return state;
          const updatedPaper = {
            ...state.currentPaper,
            sections: state.currentPaper.sections.map((s) =>
              s.id === sectionId ? { ...s, ...updates } : s
            ),
            updatedAt: new Date().toISOString(),
          };
          return {
            currentPaper: updatedPaper,
            papers: state.papers.map((p) => (p.id === updatedPaper.id ? updatedPaper : p)),
          };
        });
      },

      deleteSection: (sectionId: string) => {
        set((state) => {
          if (!state.currentPaper || state.currentPaper.sections.length <= 1) return state;
          const newSections = state.currentPaper.sections.filter((s) => s.id !== sectionId);
          const updatedPaper = {
            ...state.currentPaper,
            sections: newSections,
            updatedAt: new Date().toISOString(),
          };
          return {
            currentPaper: updatedPaper,
            papers: state.papers.map((p) => (p.id === updatedPaper.id ? updatedPaper : p)),
            selectedSectionId: newSections[0]?.id || null,
            selectedQuestionId: null,
          };
        });
      },

      reorderSections: (newOrder: string[]) => {
        set((state) => {
          if (!state.currentPaper) return state;
          const sectionMap = new Map(state.currentPaper.sections.map((s) => [s.id, s]));
          const reorderedSections = newOrder
            .map((id) => sectionMap.get(id))
            .filter((s): s is Section => s !== undefined);

          const updatedPaper = {
            ...state.currentPaper,
            sections: reorderedSections,
            updatedAt: new Date().toISOString(),
          };
          return {
            currentPaper: updatedPaper,
            papers: state.papers.map((p) => (p.id === updatedPaper.id ? updatedPaper : p)),
          };
        });
      },

      addQuestion: (sectionId: string, type: QuestionType) => {
        set((state) => {
          if (!state.currentPaper) return state;
          const newQuestion = createDefaultQuestion(type);
          const updatedPaper = {
            ...state.currentPaper,
            sections: state.currentPaper.sections.map((s) =>
              s.id === sectionId
                ? { ...s, totalMarks: s.totalMarks + newQuestion.marks, questions: [...s.questions, newQuestion] }
                : s
            ),
            updatedAt: new Date().toISOString(),
          };
          return {
            currentPaper: updatedPaper,
            papers: state.papers.map((p) => (p.id === updatedPaper.id ? updatedPaper : p)),
            selectedQuestionId: newQuestion.id,
          };
        });
      },

      updateQuestion: (sectionId: string, questionId: string, updates: Partial<QuestionBlock>) => {
        set((state) => {
          if (!state.currentPaper) return state;
          const updatedPaper = {
            ...state.currentPaper,
            sections: state.currentPaper.sections.map((s) => {
              if (s.id === sectionId) {
                const newQuestions = s.questions.map((q) =>
                  q.id === questionId ? { ...q, ...updates, isAIGenerated: updates.questionText !== undefined ? false : q.isAIGenerated } : q
                );
                return {
                  ...s,
                  // We can recalculate marks here for the section
                  totalMarks: newQuestions.reduce((sum, q) => sum + q.marks, 0),
                  questions: newQuestions
                }
              }
              return s;
            }),
            updatedAt: new Date().toISOString(),
          };
          return {
            currentPaper: updatedPaper,
            papers: state.papers.map((p) => (p.id === updatedPaper.id ? updatedPaper : p)),
          };
        });
      },

      deleteQuestion: (sectionId: string, questionId: string) => {
        set((state) => {
          if (!state.currentPaper) return state;
          const updatedPaper = {
            ...state.currentPaper,
            sections: state.currentPaper.sections.map((s) => {
              if (s.id === sectionId) {
                const newQuestions = s.questions.filter((q) => q.id !== questionId);
                return {
                  ...s,
                  totalMarks: newQuestions.reduce((sum, q) => sum + q.marks, 0),
                  questions: newQuestions
                }
              }
              return s;
            }),
            updatedAt: new Date().toISOString(),
          };
          return {
            currentPaper: updatedPaper,
            papers: state.papers.map((p) => (p.id === updatedPaper.id ? updatedPaper : p)),
            selectedQuestionId: state.selectedQuestionId === questionId ? null : state.selectedQuestionId,
          };
        });
      },

      duplicateQuestion: (sectionId: string, questionId: string) => {
        set((state) => {
          if (!state.currentPaper) return state;
          const section = state.currentPaper.sections.find((s) => s.id === sectionId);
          const question = section?.questions.find((q) => q.id === questionId);
          if (!question) return state;

          const duplicated: QuestionBlock = JSON.parse(JSON.stringify(question));
          duplicated.id = uuidv4();

          const updatedPaper = {
            ...state.currentPaper,
            sections: state.currentPaper.sections.map((s) => {
              if (s.id === sectionId) {
                const newQuestions = [...s.questions, duplicated];
                return {
                  ...s,
                  totalMarks: newQuestions.reduce((sum, q) => sum + q.marks, 0),
                  questions: newQuestions
                }
              }
              return s;
            }),
            updatedAt: new Date().toISOString(),
          };

          return {
            currentPaper: updatedPaper,
            papers: state.papers.map((p) => (p.id === updatedPaper.id ? updatedPaper : p)),
            selectedQuestionId: duplicated.id,
          };
        });
      },

      moveQuestion: (fromSectionId: string, toSectionId: string, questionId: string, newIndex: number) => {
        set((state) => {
          if (!state.currentPaper) return state;

          const fromSection = state.currentPaper.sections.find((s) => s.id === fromSectionId);
          const question = fromSection?.questions.find((q) => q.id === questionId);
          if (!question) return state;

          let newSections = state.currentPaper.sections.map((s) => {
            if (s.id === fromSectionId) {
              const newQuestions = s.questions.filter((q) => q.id !== questionId);
              return {
                ...s,
                totalMarks: newQuestions.reduce((sum, q) => sum + q.marks, 0),
                questions: newQuestions
              };
            }
            return s;
          });

          newSections = newSections.map((s) => {
            if (s.id === toSectionId) {
              const newQuestions = [...s.questions];
              newQuestions.splice(newIndex, 0, question);
              return {
                ...s,
                totalMarks: newQuestions.reduce((sum, q) => sum + q.marks, 0),
                questions: newQuestions
              };
            }
            return s;
          });

          const updatedPaper = {
            ...state.currentPaper,
            sections: newSections,
            updatedAt: new Date().toISOString(),
          };

          return {
            currentPaper: updatedPaper,
            papers: state.papers.map((p) => (p.id === updatedPaper.id ? updatedPaper : p)),
          };
        });
      },

      reorderQuestions: (sectionId: string, newOrder: string[]) => {
        set((state) => {
          if (!state.currentPaper) return state;
          const updatedPaper = {
            ...state.currentPaper,
            sections: state.currentPaper.sections.map((s) => {
              if (s.id !== sectionId) return s;
              const questionMap = new Map(s.questions.map((q) => [q.id, q]));
              const reordered = newOrder
                .map((id) => questionMap.get(id))
                .filter((q): q is QuestionBlock => q !== undefined);
              return { ...s, questions: reordered };
            }),
            updatedAt: new Date().toISOString(),
          };
          return {
            currentPaper: updatedPaper,
            papers: state.papers.map((p) => (p.id === updatedPaper.id ? updatedPaper : p)),
          };
        });
      },

      selectSection: (sectionId: string | null) => {
        set({ selectedSectionId: sectionId, selectedQuestionId: null });
      },

      selectQuestion: (questionId: string | null) => {
        set({ selectedQuestionId: questionId });
      },

      clearCurrentPaper: () => {
        set({ currentPaper: null, selectedSectionId: null, selectedQuestionId: null });
      },

      clearAllPapers: () => {
        set({ papers: [], currentPaper: null, selectedSectionId: null, selectedQuestionId: null });
      },
    }),
    {
      name: 'paper-builder-storage',
      partialize: (state) => ({ papers: state.papers }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
