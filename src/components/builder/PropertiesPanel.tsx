"use client";

import { usePaperStore } from '@/lib/store';
import { QuestionBlock, Section, LANGUAGE_LABELS, Language, Difficulty } from '@/lib/types';
import { Edit3 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function PropertiesPanel() {
  const {
    currentPaper,
    selectedSectionId,
    selectedQuestionId,
    updateSection,
    updateQuestion,
  } = usePaperStore();

  const selectedSection = currentPaper?.sections.find(
    (s) => s.id === selectedSectionId
  );
  const selectedQuestion = selectedSection?.questions.find(
    (q) => q.id === selectedQuestionId
  );

  const handleQuestionChange = (updates: Partial<QuestionBlock>) => {
    if (selectedSectionId && selectedQuestionId) {
      updateQuestion(selectedSectionId, selectedQuestionId, updates);
    }
  };

  const handleSectionChange = (updates: Partial<Section>) => {
    if (selectedSectionId) {
      updateSection(selectedSectionId, updates);
    }
  };

  if (!currentPaper) {
    return (
      <div className="w-80 border-l-2 border-black bg-white flex items-center justify-center p-8">
        <p className="font-black uppercase tracking-widest text-slate-300 text-center text-[10px]">No session data available</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="w-80 border-l-2 border-black bg-white flex flex-col h-full min-h-0 overflow-hidden">
        <div className="p-4 border-b-2 border-black bg-slate-50 flex items-center justify-between">
          <h2 className="font-black text-xs uppercase tracking-[0.2em] text-black">Configuration</h2>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {selectedQuestion ? (
              <>
                <div className="space-y-4">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2 border-l-2 border-black mb-4">
                    Block Settings
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Weightage</Label>
                      <Input
                        type="number"
                        min={0}
                        value={selectedQuestion.marks}
                        onChange={(e) =>
                          handleQuestionChange({ marks: parseInt(e.target.value) || 0 })
                        }
                        className="h-8 border-2 border-black rounded-none font-bold text-sm focus-visible:ring-0"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Complexity</Label>
                      <Select
                        value={selectedQuestion.difficulty || 'medium'}
                        onValueChange={(value) =>
                          handleQuestionChange({ difficulty: value as Difficulty })
                        }
                      >
                        <SelectTrigger className="h-8 border-2 border-black rounded-none font-bold text-sm focus:ring-0 px-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-2 border-black">
                          <SelectItem value="easy" className="font-bold uppercase tracking-widest text-[11px]">Easy</SelectItem>
                          <SelectItem value="medium" className="font-bold uppercase tracking-widest text-[11px]">Medium</SelectItem>
                          <SelectItem value="hard" className="font-bold uppercase tracking-widest text-[11px]">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Linguistic Module</Label>
                    <Select
                      value={selectedQuestion.language}
                      onValueChange={(value) =>
                        handleQuestionChange({ language: value as Language })
                      }
                    >
                      <SelectTrigger className="h-8 border-2 border-black rounded-none font-bold text-sm focus:ring-0 px-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-none border-2 border-black">
                        {Object.entries(LANGUAGE_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key} className="font-bold uppercase tracking-widest text-[11px]">
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Instructions</Label>
                    <Textarea
                      value={selectedQuestion.instructions || ''}
                      onChange={(e) =>
                        handleQuestionChange({ instructions: e.target.value })
                      }
                      placeholder="e.g., Answer any 3"
                      className="min-h-[60px] border-2 border-black rounded-none font-bold text-sm focus-visible:ring-0 transition-all resize-none p-2"
                    />
                  </div>
                </div>
              </>
            ) : selectedSection ? (
              <>
                <div className="space-y-4">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2 border-l-2 border-black mb-4">
                    Division Logistics
                  </h3>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Division Title</Label>
                    <Input
                      value={selectedSection.title}
                      onChange={(e) =>
                        handleSectionChange({ title: e.target.value })
                      }
                      className="h-8 border-2 border-black rounded-none font-bold text-sm focus-visible:ring-0"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Public Guidance</Label>
                    <Textarea
                      value={selectedSection.instructions || ''}
                      onChange={(e) =>
                        handleSectionChange({ instructions: e.target.value })
                      }
                      placeholder="Answer all questions"
                      className="min-h-[80px] border-2 border-black rounded-none font-bold text-sm focus-visible:ring-0 resize-none p-2"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
                    <span>Metrics: {selectedSection.questions.length} Blocks • {selectedSection.questions.reduce((sum, q) => sum + q.marks, 0)} Marks</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 px-4">
                <Edit3 className="h-6 w-6 text-slate-100 mx-auto mb-4" />
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-300">
                  Select a component to configure properties
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}
