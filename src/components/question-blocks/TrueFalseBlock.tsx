"use client";

import { QuestionBlock } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface TrueFalseBlockProps {
  question: QuestionBlock;
  onChange: (updates: Partial<QuestionBlock>) => void;
}

export function TrueFalseBlock({ question, onChange }: TrueFalseBlockProps) {
  return (
    <div className="py-1">
      <p className="text-xs text-muted-foreground mb-2">Select correct answer:</p>
      <RadioGroup
        value={question.correctAnswer === true ? 'true' : 'false'}
        onValueChange={(value) => onChange({ correctAnswer: value === 'true' })}
        className="flex gap-6"
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem value="true" id="true" />
          <Label htmlFor="true" className="text-sm font-medium cursor-pointer">True</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="false" id="false" />
          <Label htmlFor="false" className="text-sm font-medium cursor-pointer">False</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
