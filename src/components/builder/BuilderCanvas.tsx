"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { usePaperStore } from '@/lib/store';
import { QuestionBlockCard } from '@/components/question-blocks';
import { Section, calculateSectionMarks, QuestionBlock } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, ChevronDown, ChevronRight, GripHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SectionCardProps {
  section: Section;
  sectionIndex: number;
  isOverlay?: boolean;
}

export function SectionCard({ section, sectionIndex, isOverlay }: SectionCardProps) {
  const {
    selectedSectionId,
    selectedQuestionId,
    selectSection,
    selectQuestion,
    updateQuestion,
    deleteQuestion,
    duplicateQuestion,
    deleteSection,
  } = usePaperStore();

  const [isExpanded, setIsExpanded] = useState(true);
  const isSelected = selectedSectionId === section.id;
  const totalMarks = calculateSectionMarks(section);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: section.id,
    data: {
      type: 'section',
      section,
    },
    disabled: isOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'border-2 border-black bg-white overflow-hidden transition-all',
        isSelected ? 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -translate-x-1 -translate-y-1' : 'shadow-none',
        isDragging && 'opacity-50',
        isOverlay && 'shadow-2xl'
      )}
    >
      <div
        className={cn(
          'flex items-center gap-4 p-4 transition-colors border-b-2 border-black',
          isSelected ? 'bg-slate-50' : 'hover:bg-slate-50'
        )}
        onClick={() => {
          if (isOverlay) return;
          selectSection(section.id);
          selectQuestion(null);
        }}
      >
        <div
          {...attributes}
          {...listeners}
          className={cn(
            "text-black opacity-40 hover:opacity-100",
            isOverlay ? "cursor-grabbing" : "cursor-grab active:cursor-grabbing"
          )}
        >
          <GripHorizontal className="h-5 w-5" />
        </div>
        <button
          className="text-black opacity-40 hover:opacity-100 transition-transform"
          onClick={(e) => {
            e.stopPropagation();
            if (isOverlay) return;
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <span className="font-black text-sm uppercase tracking-tight">{section.title}</span>
            <div className="flex gap-2">
              <Badge className="bg-black text-white rounded-none font-bold uppercase tracking-widest text-[8px] h-4">
                {section.questions.length} Q
              </Badge>
              <Badge variant="outline" className="border-black text-black rounded-none font-bold uppercase tracking-widest text-[8px] h-4">
                {totalMarks} PK
              </Badge>
            </div>
          </div>
          {section.description && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1 truncate">
              {section.description}
            </p>
          )}
        </div>
        {!isOverlay && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-black opacity-40 hover:opacity-100 hover:text-red-600 hover:bg-transparent"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSection(section.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-black text-white rounded-none font-bold uppercase tracking-widest text-[9px]">
              Remove entire section and its questions
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      {isExpanded && !isOverlay && (
        <div className="bg-slate-50/50">
          {section.questions.length === 0 ? (
            <div className="p-12 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
              [ NO BLOCKS DETECTED ]
            </div>
          ) : (
            <SortableContext
              items={section.questions.map((q) => q.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="p-4 space-y-4">
                {section.questions.map((question, index) => (
                  <QuestionBlockCard
                    key={question.id}
                    question={question}
                    index={index}
                    sectionId={section.id}
                    isSelected={selectedQuestionId === question.id}
                    onSelect={() => {
                      selectSection(section.id);
                      selectQuestion(question.id);
                    }}
                    onChange={(updates) =>
                      updateQuestion(section.id, question.id, updates)
                    }
                    onDelete={() => deleteQuestion(section.id, question.id)}
                    onDuplicate={() => duplicateQuestion(section.id, question.id)}
                  />
                ))}
              </div>
            </SortableContext>
          )}
        </div>
      )}
    </div>
  );
}

interface BuilderCanvasProps {
  activeId: string | null;
  activeType: string | null;
}

export function BuilderCanvas({ activeId, activeType }: BuilderCanvasProps) {
  const { currentPaper, addSection } = usePaperStore();

  if (!currentPaper) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <p className="font-black uppercase tracking-widest text-slate-300">No session loaded</p>
      </div>
    );
  }

  const totalMarks = currentPaper.sections.reduce(
    (sum, s) => sum + calculateSectionMarks(s),
    0
  );

  const sectionIds = useMemo(() => currentPaper.sections.map((s) => s.id), [currentPaper.sections]);

  return (
    <TooltipProvider>
      <div className="flex-1 flex flex-col bg-slate-50/30 overflow-hidden min-h-0">
        <div className="border-b-2 border-black bg-white px-6 py-4 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-black uppercase tracking-widest">
              {currentPaper.sections.length} DIVISIONS
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              WEIGHTAGE: <span className="text-black">{totalMarks} / {currentPaper.metadata.totalMarks} PK</span>
            </span>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={addSection}
                className="h-10 border-2 border-black rounded-none font-black uppercase tracking-widest text-[10px] px-6 hover:bg-black hover:text-white transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Section
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-black text-white rounded-none font-bold uppercase tracking-widest text-[10px]">
              Add a new structural division to your paper
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-4 space-y-4 max-w-4xl mx-auto pb-32">
            <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
              {currentPaper.sections.map((section, index) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  sectionIndex={index}
                />
              ))}
            </SortableContext>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
