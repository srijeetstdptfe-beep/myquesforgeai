"use client";

import { QuestionBlock, MCQOption } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface MCQBlockProps {
  question: QuestionBlock;
  onChange: (updates: Partial<QuestionBlock>) => void;
  isMultiple: boolean;
}

export function MCQBlock({ question, onChange, isMultiple }: MCQBlockProps) {
  const options = question.options || [];

  const updateOption = (optionId: string, updates: Partial<MCQOption>) => {
    const newOptions = options.map((opt) =>
      opt.id === optionId ? { ...opt, ...updates } : opt
    );
    onChange({ options: newOptions });
  };

  const addOption = () => {
    onChange({
      options: [...options, { id: uuidv4(), text: '', isCorrect: false }],
    });
  };

  const removeOption = (optionId: string) => {
    if (options.length <= 2) return;
    onChange({ options: options.filter((opt) => opt.id !== optionId) });
  };

  const handleCorrectChange = (optionId: string, checked: boolean) => {
    if (isMultiple) {
      updateOption(optionId, { isCorrect: checked });
    } else {
      const newOptions = options.map((opt) => ({
        ...opt,
        isCorrect: opt.id === optionId ? checked : false,
      }));
      onChange({ options: newOptions });
    }
  };

  const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  return (
    <div className="space-y-2">
      {isMultiple ? (
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={option.id} className="flex items-center gap-2">
              <Checkbox
                checked={option.isCorrect}
                onCheckedChange={(checked) =>
                  handleCorrectChange(option.id, checked as boolean)
                }
              />
              <span className="text-sm font-medium w-5">{optionLabels[index]}.</span>
              <Input
                value={option.text}
                onChange={(e) => updateOption(option.id, { text: e.target.value })}
                placeholder={`Option ${optionLabels[index]}`}
                className="flex-1 h-8 text-sm"
              />
              {options.length > 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  onClick={() => removeOption(option.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <RadioGroup
          value={options.find((o) => o.isCorrect)?.id || ''}
          onValueChange={(value) => handleCorrectChange(value, true)}
        >
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={option.id} className="flex items-center gap-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <span className="text-sm font-medium w-5">{optionLabels[index]}.</span>
                <Input
                  value={option.text}
                  onChange={(e) => updateOption(option.id, { text: e.target.value })}
                  placeholder={`Option ${optionLabels[index]}`}
                  className="flex-1 h-8 text-sm"
                />
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeOption(option.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </RadioGroup>
      )}
      {options.length < 8 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={addOption}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Option
        </Button>
      )}
    </div>
  );
}
