"use client";

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { QuestionBlock, QUESTION_TYPE_LABELS } from '@/lib/types';
import { RichTextEditor } from '@/components/RichTextEditor';
import { MCQBlock } from './MCQBlock';
import { TrueFalseBlock } from './TrueFalseBlock';
import { MatchFollowingBlock } from './MatchFollowingBlock';
import { FillBlanksBlock } from './FillBlanksBlock';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { GripVertical, Trash2, Copy, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionBlockCardProps {
  question: QuestionBlock;
  index: number;
  sectionId: string;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (updates: Partial<QuestionBlock>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  isOverlay?: boolean;
}

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function QuestionBlockCard({
  question,
  index,
  sectionId,
  isSelected,
  onSelect,
  onChange,
  onDelete,
  onDuplicate,
  isOverlay,
}: QuestionBlockCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: question.id,
    data: {
      type: 'question',
      question,
      sectionId,
    },
    disabled: isOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderQuestionContent = () => {
    if (isOverlay) return null;
    switch (question.type) {
      case 'mcq-single':
        return <MCQBlock question={question} onChange={onChange} isMultiple={false} />;
      case 'mcq-multiple':
        return <MCQBlock question={question} onChange={onChange} isMultiple={true} />;
      case 'true-false':
        return <TrueFalseBlock question={question} onChange={onChange} />;
      case 'match-following':
        return <MatchFollowingBlock question={question} onChange={onChange} />;
      case 'fill-blanks':
        return <FillBlanksBlock question={question} onChange={onChange} />;
      default:
        return null;
    }
  };

  return (
    <TooltipProvider>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          'bg-white border-2 border-black transition-all rounded-none',
          isDragging && 'opacity-50',
          isSelected ? 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-0.5 -translate-y-0.5' : 'shadow-none',
          isOverlay && 'shadow-2xl'
        )}
        onClick={onSelect}
      >
        <div className="flex items-center gap-4 p-4 border-b-2 border-black bg-slate-50">
          <div
            className={cn(
              "text-black opacity-30 hover:opacity-100 transition-opacity",
              isOverlay ? "cursor-grabbing" : "cursor-grab active:cursor-grabbing"
            )}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-black text-sm uppercase">Q{index + 1}</span>
              <Badge className="bg-black text-white border-none rounded-none font-bold uppercase tracking-widest text-[8px] h-4">
                {QUESTION_TYPE_LABELS[question.type]}
              </Badge>
              {question.isAIGenerated && (
                <Badge variant="outline" className="border-black text-black rounded-none font-bold uppercase tracking-widest text-[8px] h-4 gap-1">
                  <Sparkles className="h-2 w-2" />
                  AI ASSISTED
                </Badge>
              )}
              {!isOverlay && (
                <div className="flex items-center gap-2 ml-auto">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        type="number"
                        min={0}
                        value={question.marks}
                        onChange={(e) => onChange({ marks: parseInt(e.target.value) || 0 })}
                        className="h-8 w-14 border-2 border-black rounded-none font-black text-xs text-center focus-visible:ring-0 focus-visible:border-black"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TooltipTrigger>
                    <TooltipContent className="bg-black text-white rounded-none font-bold uppercase tracking-widest text-[9px]">
                      Adjust Marks
                    </TooltipContent>
                  </Tooltip>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Marks</span>
                </div>
              )}
            </div>
          </div>
          {!isOverlay && (
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-black opacity-30 hover:opacity-100 hover:bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicate();
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white rounded-none font-bold uppercase tracking-widest text-[9px]">
                  Clone this question block
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-black opacity-30 hover:opacity-100 hover:text-red-600 hover:bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white rounded-none font-bold uppercase tracking-widest text-[9px]">
                  Remove this question block
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
        <div className="p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
          {!isOverlay ? (
            <RichTextEditor
              content={question.questionText}
              onChange={(content) => onChange({ questionText: content })}
              placeholder="ENTER QUESTION CONTENT..."
            />
          ) : (
            <div className="text-sm">
              {question.questionText ? (
                <div dangerouslySetInnerHTML={{ __html: question.questionText }} />
              ) : (
                <p className="text-slate-300 font-black uppercase tracking-widest italic text-[10px]">[ NO CONTENT ]</p>
              )}
            </div>
          )}
          <div className="pt-2">
            {renderQuestionContent()}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
