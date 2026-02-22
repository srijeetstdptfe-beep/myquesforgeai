"use client";

import { AICreator } from '@/components/AICreator';
import { Suspense } from 'react';

function AICreatorContent() {
  return <AICreator />;
}

export default function CreateWithAIPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AICreatorContent />
    </Suspense>
  );
}
