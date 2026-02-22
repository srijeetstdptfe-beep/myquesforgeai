"use client";

import { QuestionBlock, MatchPair } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X, MoveHorizontal } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface MatchFollowingBlockProps {
  question: QuestionBlock;
  onChange: (updates: Partial<QuestionBlock>) => void;
}

export function MatchFollowingBlock({ question, onChange }: MatchFollowingBlockProps) {
  const pairs = question.matchPairs || [];

  const updatePair = (pairId: string, updates: Partial<MatchPair>) => {
    const newPairs = pairs.map((pair) =>
      pair.id === pairId ? { ...pair, ...updates } : pair
    );
    onChange({ matchPairs: newPairs });
  };

  const addPair = () => {
    onChange({
      matchPairs: [...pairs, { id: uuidv4(), left: '', right: '' }],
    });
  };

  const removePair = (pairId: string) => {
    if (pairs.length <= 2) return;
    onChange({ matchPairs: pairs.filter((pair) => pair.id !== pairId) });
  };

  const columnLabels = ['1', '2', '3', '4', '5', '6', '7', '8'];
  const rightLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 text-xs font-medium text-muted-foreground">
        <div>Column A</div>
        <div></div>
        <div>Column B</div>
      </div>
      {pairs.map((pair, index) => (
        <div key={pair.id} className="grid grid-cols-[1fr_auto_1fr_auto] gap-2 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium w-4">{columnLabels[index]}.</span>
            <Input
              value={pair.left}
              onChange={(e) => updatePair(pair.id, { left: e.target.value })}
              placeholder="Left item"
              className="h-8 text-sm"
            />
          </div>
          <MoveHorizontal className="h-4 w-4 text-muted-foreground" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium w-4">{rightLabels[index]}.</span>
            <Input
              value={pair.right}
              onChange={(e) => updatePair(pair.id, { right: e.target.value })}
              placeholder="Right item"
              className="h-8 text-sm"
            />
          </div>
          {pairs.length > 2 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              onClick={() => removePair(pair.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      {pairs.length < 8 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={addPair}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Pair
        </Button>
      )}
    </div>
  );
}
