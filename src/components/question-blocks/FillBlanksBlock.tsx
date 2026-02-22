"use client";

import { QuestionBlock } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface FillBlanksBlockProps {
  question: QuestionBlock;
  onChange: (updates: Partial<QuestionBlock>) => void;
}

export function FillBlanksBlock({ question, onChange }: FillBlanksBlockProps) {
  const blanks = question.blanks || [''];

  const updateBlank = (index: number, value: string) => {
    const newBlanks = [...blanks];
    newBlanks[index] = value;
    onChange({ blanks: newBlanks });
  };

  const addBlank = () => {
    onChange({ blanks: [...blanks, ''] });
  };

  const removeBlank = (index: number) => {
    if (blanks.length <= 1) return;
    onChange({ blanks: blanks.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        Enter answers for each blank (use _____ in question text to indicate blanks):
      </p>
      {blanks.map((blank, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="text-sm font-medium w-16">Blank {index + 1}:</span>
          <Input
            value={blank}
            onChange={(e) => updateBlank(index, e.target.value)}
            placeholder="Expected answer"
            className="flex-1 h-8 text-sm"
          />
          {blanks.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              onClick={() => removeBlank(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={addBlank}
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Blank
      </Button>
    </div>
  );
}
