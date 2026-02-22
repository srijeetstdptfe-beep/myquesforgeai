"use client";

import {
  QuestionType,
  QUESTION_TYPE_LABELS,
  QUESTION_TYPE_CATEGORIES,
} from '@/lib/types';
import { usePaperStore } from '@/lib/store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useDraggable } from '@dnd-kit/core';
import {
  CircleDot,
  CheckSquare,
  ToggleLeft,
  ArrowLeftRight,
  TextCursor,
  MessageSquare,
  FileText,
  BookOpen,
  PenTool,
  Edit3,
  Plus,
  GripVertical,
} from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const QUESTION_DESCRIPTIONS: Record<QuestionType, string> = {
  'mcq-single': 'Single choice objective question',
  'mcq-multiple': 'Multiple choice objective question',
  'true-false': 'Classic True/False statement',
  'match-following': 'Matrix match or matching pairs',
  'fill-blanks': 'Text with fillable blank spaces',
  'one-sentence': 'Very short direct answer',
  'short-answer': 'Standard context-based answer',
  'long-answer': 'Detailed explanatory response',
  'essay': 'Extended narrative or argument',
  'short-notes': 'Brief summary or point-wise notes',
  'custom': 'Fully custom block for special needs',
};

const QUESTION_ICONS: Record<QuestionType, React.ReactNode> = {
  'mcq-single': <CircleDot className="h-4 w-4" />,
  'mcq-multiple': <CheckSquare className="h-4 w-4" />,
  'true-false': <ToggleLeft className="h-4 w-4" />,
  'match-following': <ArrowLeftRight className="h-4 w-4" />,
  'fill-blanks': <TextCursor className="h-4 w-4" />,
  'one-sentence': <MessageSquare className="h-4 w-4" />,
  'short-answer': <FileText className="h-4 w-4" />,
  'long-answer': <BookOpen className="h-4 w-4" />,
  'essay': <PenTool className="h-4 w-4" />,
  'short-notes': <Edit3 className="h-4 w-4" />,
  'custom': <Plus className="h-4 w-4" />,
};

interface DraggableQuestionTypeProps {
  type: QuestionType;
  disabled: boolean;
  onClick: () => void;
}

function DraggableQuestionType({ type, disabled, onClick }: DraggableQuestionTypeProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `sidebar-${type}`,
    data: {
      type: 'new-question',
      questionType: type,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-none"
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-start h-10 px-3 text-[11px] font-black uppercase tracking-widest relative group border-2 border-transparent hover:border-black rounded-none transition-all hover:bg-black hover:text-white"
            disabled={disabled}
            onClick={onClick}
          >
            <span className="mr-3 opacity-60 group-hover:opacity-100">{QUESTION_ICONS[type]}</span>
            {QUESTION_TYPE_LABELS[type]}
            <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="h-3 w-3" />
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-black text-white rounded-none font-bold uppercase tracking-widest text-[9px] ml-2">
          {QUESTION_DESCRIPTIONS[type]}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export function QuestionLibrarySidebar() {
  const { selectedSectionId, addQuestion } = usePaperStore();

  const handleAddQuestion = (type: QuestionType) => {
    if (selectedSectionId) {
      addQuestion(selectedSectionId, type);
    }
  };

  const renderCategory = (title: string, types: QuestionType[]) => (
    <div className="mb-8">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4 px-3 border-l-2 border-slate-200">
        {title}
      </h3>
      <div className="space-y-2">
        {types.map((type) => (
          <DraggableQuestionType
            key={type}
            type={type}
            disabled={!selectedSectionId}
            onClick={() => handleAddQuestion(type)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="w-64 border-r-2 border-black bg-white flex flex-col h-full overflow-hidden">
        <div className="p-6 border-b-2 border-black bg-slate-50">
          <h2 className="font-black text-xs uppercase tracking-[0.2em] text-black">Component Blocks</h2>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2 leading-relaxed">
            Drag to canvas or click to insert into active section
          </p>
        </div>
        <ScrollArea className="flex-1 p-4">
          {renderCategory('Objective', QUESTION_TYPE_CATEGORIES.objective)}
          {renderCategory('Assessment', QUESTION_TYPE_CATEGORIES.shortAnswer)}
          {renderCategory('Composition', QUESTION_TYPE_CATEGORIES.descriptive)}
          {renderCategory('Utilities', QUESTION_TYPE_CATEGORIES.flexible)}
        </ScrollArea>
        {!selectedSectionId && (
          <div className="p-4 border-t-2 border-black bg-black text-white text-center">
            <p className="text-[9px] font-black uppercase tracking-[0.2em]">
              NO ACTIVE SECTION
            </p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
