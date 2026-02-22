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
        <div className="p-6 border-b-2 border-black bg-slate-50">
          <h2 className="font-black text-xs uppercase tracking-[0.2em] text-black">Configuration</h2>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-8">
            {selectedQuestion ? (
              <>
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-6 px-3 border-l-2 border-slate-200">
                    Question Settings
                  </h3>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Label className="text-[10px] font-black uppercase tracking-widest cursor-help">Weightage (Marks)</Label>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="bg-black text-white rounded-none font-bold uppercase tracking-widest text-[9px] mr-2">
                          Quantitative value assigned to this block
                        </TooltipContent>
                      </Tooltip>
                      <Input
                        type="number"
                        min={0}
                        value={selectedQuestion.marks}
                        onChange={(e) =>
                          handleQuestionChange({ marks: parseInt(e.target.value) || 0 })
                        }
                        className="h-10 border-2 border-black rounded-none font-bold text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-black transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Label className="text-[10px] font-black uppercase tracking-widest cursor-help">Complexity</Label>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="bg-black text-white rounded-none font-bold uppercase tracking-widest text-[9px] mr-2">
                          Cognitive difficulty level for assessment
                        </TooltipContent>
                      </Tooltip>
                      <Select
                        value={selectedQuestion.difficulty || 'medium'}
                        onValueChange={(value) =>
                          handleQuestionChange({ difficulty: value as Difficulty })
                        }
                      >
                        <SelectTrigger className="h-10 border-2 border-black rounded-none font-bold text-sm focus:ring-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-2 border-black">
                          <SelectItem value="easy" className="font-bold uppercase tracking-widest text-[10px]">Easy</SelectItem>
                          <SelectItem value="medium" className="font-bold uppercase tracking-widest text-[10px]">Medium</SelectItem>
                          <SelectItem value="hard" className="font-bold uppercase tracking-widest text-[10px]">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Label className="text-[10px] font-black uppercase tracking-widest cursor-help">Language Module</Label>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="bg-black text-white rounded-none font-bold uppercase tracking-widest text-[9px] mr-2">
                          Linguistic context for this specific question
                        </TooltipContent>
                      </Tooltip>
                      <Select
                        value={selectedQuestion.language}
                        onValueChange={(value) =>
                          handleQuestionChange({ language: value as Language })
                        }
                      >
                        <SelectTrigger className="h-10 border-2 border-black rounded-none font-bold text-sm focus:ring-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-2 border-black">
                          {Object.entries(LANGUAGE_LABELS).map(([key, label]) => (
                            <SelectItem key={key} value={key} className="font-bold uppercase tracking-widest text-[10px]">
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Label className="text-[10px] font-black uppercase tracking-widest cursor-help">Contextual Instructions</Label>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="bg-black text-white rounded-none font-bold uppercase tracking-widest text-[9px] mr-2">
                          Supplemental guidance displayed above the question
                        </TooltipContent>
                      </Tooltip>
                      <Textarea
                        value={selectedQuestion.instructions || ''}
                        onChange={(e) =>
                          handleQuestionChange({ instructions: e.target.value })
                        }
                        placeholder="e.g., Answer any 3 of the following"
                        className="min-h-[100px] border-2 border-black rounded-none font-bold text-sm focus-visible:ring-0 focus-visible:ring-offset-0 transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : selectedSection ? (
              <>
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-6 px-3 border-l-2 border-slate-200">
                    Section Logistics
                  </h3>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest">Division Title</Label>
                      <Input
                        value={selectedSection.title}
                        onChange={(e) =>
                          handleSectionChange({ title: e.target.value })
                        }
                        placeholder="Section A"
                        className="h-10 border-2 border-black rounded-none font-bold text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-black transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest">Internal Description</Label>
                      <Textarea
                        value={selectedSection.description || ''}
                        onChange={(e) =>
                          handleSectionChange({ description: e.target.value })
                        }
                        placeholder="Objective type questions"
                        className="min-h-[80px] border-2 border-black rounded-none font-bold text-sm focus-visible:ring-0 focus-visible:ring-offset-0 transition-all resize-none"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest">Public Instructions</Label>
                      <Textarea
                        value={selectedSection.instructions || ''}
                        onChange={(e) =>
                          handleSectionChange({ instructions: e.target.value })
                        }
                        placeholder="Answer all questions"
                        className="min-h-[100px] border-2 border-black rounded-none font-bold text-sm focus-visible:ring-0 focus-visible:ring-offset-0 transition-all resize-none"
                      />
                    </div>
                    <div className="pt-6 border-t-2 border-black space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Blocks</span>
                        <span className="font-black text-sm">{selectedSection.questions.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Section Weightage</span>
                        <span className="font-black text-sm">
                          {selectedSection.questions.reduce((sum, q) => sum + q.marks, 0)} PK
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 px-6">
                <div className="w-16 h-16 border-2 border-slate-100 flex items-center justify-center mx-auto mb-6">
                  <Edit3 className="h-6 w-6 text-slate-100" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 leading-relaxed">
                  Select a component from the canvas to modify its properties
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}
