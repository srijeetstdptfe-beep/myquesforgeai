"use client";

import { PaperBuilder } from '@/components/PaperBuilder';
import { use } from 'react';

interface BuilderPageProps {
  params: Promise<{ id: string }>;
}

export default function BuilderPage({ params }: BuilderPageProps) {
  const resolvedParams = use(params);
  return <PaperBuilder paperId={resolvedParams.id} />;
}
