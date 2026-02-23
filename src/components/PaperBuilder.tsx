"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { usePaperStore } from '@/lib/store';
import {
  QuestionLibrarySidebar,
  BuilderCanvas,
  PropertiesPanel,
  PaperMetadataEditor,
} from '@/components/builder';
import { PaperPreview } from '@/components/preview/PaperPreview';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, Save, FileText, Languages } from 'lucide-react';
import Link from 'next/link';
import { TranslateModal } from './TranslateModal';
import {
  DndContext, // Restored
  closestCenter, // Restored (though we might not use it, good to keep if needed or remove if unused, but avoiding lints first)
  KeyboardSensor, // Restored
  PointerSensor, // Restored
  useSensor, // Restored
  useSensors, // Restored
  DragEndEvent, // Restored
  DragOverEvent, // Restored
  DragStartEvent, // Restored
  DragOverlay,
  defaultDropAnimationSideEffects,
  pointerWithin,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
  arrayMove,
} from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { QuestionBlockCard } from '@/components/question-blocks/QuestionBlockCard';
import { SectionCard } from '@/components/builder/BuilderCanvas';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from 'lucide-react';

interface PaperBuilderProps {
  paperId: string;
}

export function PaperBuilder({ paperId }: PaperBuilderProps) {
  const router = useRouter();
  const {
    currentPaper,
    loadPaper,
    savePaper,
    papers,
    _hasHydrated,
    reorderSections,
    reorderQuestions,
    moveQuestion,
    addQuestion,
  } = usePaperStore();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [activeData, setActiveData] = useState<any>(null);

  /* New State for Question Bank */
  const [pyqModalOpen, setPyqModalOpen] = useState(false);
  const [translateModalOpen, setTranslateModalOpen] = useState(false);
  const [pyqList, setPyqList] = useState<any[]>([]);
  const [isSavingToBank, setIsSavingToBank] = useState(false);
  const [isLoadingPyqs, setIsLoadingPyqs] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!_hasHydrated || hasAttemptedLoad) return;

    const paper = papers.find((p) => p.id === paperId);
    if (paper) {
      loadPaper(paperId);
    } else {
      router.push('/');
    }
    setHasAttemptedLoad(true);
  }, [_hasHydrated, paperId, papers, loadPaper, router, hasAttemptedLoad]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setActiveType(active.data.current?.type || null);
    setActiveData(active.data.current || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Optional: add visual feedback during drag over
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveType(null);
    setActiveData(null);

    if (!over || !currentPaper) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (!activeData) return;

    // Handle new question from sidebar
    if (activeData.type === 'new-question') {
      let targetSectionId = '';
      if (overData?.type === 'section') {
        targetSectionId = over.id as string;
      } else if (overData?.type === 'question') {
        targetSectionId = overData.sectionId;
      }

      if (targetSectionId) {
        addQuestion(targetSectionId, activeData.questionType);
      }
      return;
    }

    if (activeData.type === 'section') {
      if (active.id !== over.id) {
        const oldIndex = currentPaper.sections.findIndex((s) => s.id === active.id);
        const newIndex = currentPaper.sections.findIndex((s) => s.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          const newOrder = currentPaper.sections.map(s => s.id);
          const movedOrder = arrayMove(newOrder, oldIndex, newIndex);
          reorderSections(movedOrder);
        }
      }
    } else if (activeData.type === 'question') {
      const activeSectionId = activeData.sectionId;
      let overSectionId = overData?.sectionId;

      if (overData?.type === 'section') {
        overSectionId = over.id as string;
      }

      if (!overSectionId) return;

      if (activeSectionId === overSectionId) {
        if (active.id !== over.id) {
          const section = currentPaper.sections.find((s) => s.id === activeSectionId);
          if (!section) return;
          const oldIndex = section.questions.findIndex((q) => q.id === active.id);
          const newIndex = section.questions.findIndex((q) => q.id === over.id);
          if (oldIndex !== -1 && newIndex !== -1) {
            const newOrder = section.questions.map(q => q.id);
            const movedOrder = arrayMove(newOrder, oldIndex, newIndex);
            reorderQuestions(activeSectionId, movedOrder);
          }
        }
      } else {
        const overSection = currentPaper.sections.find((s) => s.id === overSectionId);
        if (!overSection) return;

        let newIndex = overSection.questions.findIndex((q) => q.id === over.id);
        if (newIndex === -1) newIndex = overSection.questions.length;

        moveQuestion(activeSectionId, overSectionId, active.id as string, newIndex);
      }
    }
  };

  const handleSave = async () => {
    if (!currentPaper) return;
    setIsSavingToBank(true);
    try {
      // 1. Save to local storage (Zustand)
      savePaper();

      // 2. Sync to Workspace (JSON Files)
      const response = await fetch('/api/papers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examName: currentPaper.metadata.examName || 'Untitled Paper',
          subject: currentPaper.metadata.subject || 'General',
          class: currentPaper.metadata.classOrCourse || 'All Classes',
          data: currentPaper
        })
      });

      if (!response.ok) throw new Error('Failed to sync with workspace');
      toast.success('Paper saved to Workspace successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Saved locally, but failed to sync with workspace');
    } finally {
      setIsSavingToBank(false);
    }
  };

  // Removed saveToBank in favor of integrated handleSave

  const fetchPyqs = async () => {
    setIsLoadingPyqs(true);
    try {
      const subject = currentPaper?.metadata.subject || '';
      const className = currentPaper?.metadata.classOrCourse || '';
      const query = new URLSearchParams();
      if (subject) query.append('subject', subject);
      if (className) query.append('class', className);

      const res = await fetch(`/api/papers?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setPyqList(data);
    } catch (e) {
      console.error(e);
      alert('Failed to fetch PYQs');
    } finally {
      setIsLoadingPyqs(false);
    }
  };

  const handleOpenPyq = () => {
    setPyqModalOpen(true);
    fetchPyqs();
  };

  const loadPyq = (paperData: any) => {
    if (confirm('This will replace your current paper. Are you sure?')) {
      usePaperStore.setState({ currentPaper: paperData as any });
      setPyqModalOpen(false);
    }
  };

  if (!_hasHydrated || !currentPaper) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <p className="text-muted-foreground">Loading paper...</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col bg-white text-black selection:bg-black selection:text-white">
        <header className="border-b-[3px] border-black bg-white px-6 py-4 flex items-center justify-between flex-shrink-0 z-50">
          <div className="flex items-center gap-6">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="h-10 w-10 p-0 border-2 border-transparent hover:border-black rounded-none">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-black text-white rounded-none font-bold uppercase tracking-widest text-[10px]">
                Return to Workspace Dashboard
              </TooltipContent>
            </Tooltip>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 border-2 border-black flex items-center justify-center bg-black text-white">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-black leading-none uppercase tracking-tighter">
                  {currentPaper.metadata.examName || 'Untitled Paper'}
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">
                  {currentPaper.metadata.subject || 'GENERAL'} • {currentPaper.metadata.classOrCourse || 'ALL CLASSES'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenPyq}
                  className="hidden md:flex h-10 border-2 border-black rounded-none font-black uppercase tracking-widest text-[10px] items-center gap-2 hover:bg-black hover:text-white transition-all"
                >
                  <span className="text-sm">↺</span> Workspace
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-black text-white rounded-none font-bold uppercase tracking-widest text-[10px]">
                Load Papers from Workspace
              </TooltipContent>
            </Tooltip>

            <PaperMetadataEditor asSheet />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTranslateModalOpen(true)}
                  className="flex h-10 border-2 border-black rounded-none font-black uppercase tracking-widest text-[10px] items-center gap-2 hover:bg-black hover:text-white transition-all"
                >
                  <Languages className="h-4 w-4" />
                  Translate
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-black text-white rounded-none font-bold uppercase tracking-widest text-[10px]">
                Translate Paper using AI
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewOpen(true)}
                  className="h-10 border-2 border-black rounded-none font-black uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all px-4"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-black text-white rounded-none font-bold uppercase tracking-widest text-[10px]">
                Preview Final Document
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="h-10 aspect-square p-0 bg-black text-white rounded-none border-2 border-black hover:bg-white hover:text-black transition-all"
                >
                  <Save className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-black text-white rounded-none font-bold uppercase tracking-widest text-[10px]">
                Save Changes to Cloud
              </TooltipContent>
            </Tooltip>

            {/* Legacy bank button removed */}
          </div>
        </header>

        <DndContext
          sensors={sensors}
          collisionDetection={pointerWithin}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex-1 flex overflow-hidden">
            <QuestionLibrarySidebar />
            <BuilderCanvas activeId={activeId} activeType={activeType} />
            <PropertiesPanel />
          </div>

          {typeof document !== 'undefined' && createPortal(
            <DragOverlay dropAnimation={{
              sideEffects: defaultDropAnimationSideEffects({
                styles: {
                  active: {
                    opacity: '0.5',
                  },
                },
              }),
            }}>
              {activeId && activeType === 'section' && activeData?.section && (
                <SectionCard section={activeData.section} sectionIndex={0} isOverlay />
              )}
              {activeId && activeType === 'question' && activeData?.question && (
                <QuestionBlockCard
                  question={activeData.question}
                  index={0}
                  sectionId={activeData.sectionId}
                  isSelected={false}
                  onSelect={() => { }}
                  onChange={() => { }}
                  onDelete={() => { }}
                  onDuplicate={() => { }}
                  isOverlay
                />
              )}
              {activeId && activeType === 'new-question' && (
                <div className="bg-primary/10 border-2 border-primary border-dashed rounded-lg p-4 w-64 shadow-xl">
                  <p className="text-sm font-medium text-primary flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Adding {activeData.questionType}
                  </p>
                </div>
              )}
            </DragOverlay>,
            document.body
          )}
        </DndContext>

        {/* Floating Help Button */}
        <div className="fixed bottom-6 right-6 z-[60]">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-14 w-14 rounded-full bg-black text-white border-2 border-black hover:bg-white hover:text-black shadow-2xl transition-all"
                onClick={() => window.location.href = 'mailto:support@papercraft.com'}
              >
                <HelpCircle className="h-7 w-7" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-black text-white rounded-none font-bold uppercase tracking-widest text-[10px] mr-2">
              Need Help? Contact Support
            </TooltipContent>
          </Tooltip>
        </div>

        {/* PYQ Modal */}
        {pyqModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-none border-2 border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between p-6 border-b-2 border-black">
                <h2 className="text-xl font-black uppercase tracking-tighter">Workspace Papers</h2>
                <Button variant="ghost" size="sm" onClick={() => setPyqModalOpen(false)} className="hover:bg-black hover:text-white rounded-none">✕</Button>
              </div>
              <div className="p-4 bg-slate-50 border-b-2 border-black">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Workspace: <span className="text-black">{currentPaper.metadata.subject || 'ALL'}</span> • <span className="text-black">{currentPaper.metadata.classOrCourse || 'ALL'}</span>
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {isLoadingPyqs ? (
                  <div className="text-center py-8 font-black uppercase tracking-widest animate-pulse">Synchronizing...</div>
                ) : pyqList.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 font-bold uppercase tracking-widest">No papers found in Workspace.</div>
                ) : (
                  pyqList.map((paper) => (
                    <div key={paper.id} className="bg-white border-2 border-black p-5 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                      <div>
                        <h3 className="font-black uppercase tracking-tight text-lg">{paper.examName}</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">{paper.subject} • {paper.class} • {paper.year}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => loadPyq(paper.data)}
                        className="border-2 border-black rounded-none font-black uppercase tracking-widest text-[10px] hover:bg-black hover:text-white"
                      >
                        Load Paper
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {currentPaper && (
          <PaperPreview
            paper={currentPaper}
            isOpen={previewOpen}
            onClose={() => setPreviewOpen(false)}
          />
        )}

        <TranslateModal
          isOpen={translateModalOpen}
          onClose={() => setTranslateModalOpen(false)}
        />
      </div>
    </TooltipProvider>
  );
}
