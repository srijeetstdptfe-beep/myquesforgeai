"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePaperStore } from '@/lib/store';
import { QuestionPaper, calculateTotalMarks } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Plus,
  Sparkles,
  FileText,
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  Clock,
  BookOpen,
  Library,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { LimitReachedModal } from '@/components/dashboard/LimitReachedModal';

export function Dashboard() {
  const router = useRouter();
  // Mock session and signOut for Netlify Identity flow
  const session = { user: { name: 'User', plan: 'FREE' } } as any;
  const signOut = () => {
    if (typeof window !== 'undefined' && (window as any).netlifyIdentity) {
      (window as any).netlifyIdentity.logout();
    }
  };
  const { papers, createPaper, deletePaper, duplicatePaper, loadPaper } = usePaperStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [paperToDelete, setPaperToDelete] = useState<string | null>(null);

  // Database papers state
  const [dbPapers, setDbPapers] = useState<any[]>([]);
  const [isLoadingDb, setIsLoadingDb] = useState(false);
  const [activeTab, setActiveTab] = useState('local');
  const [isPurchasingExtra, setIsPurchasingExtra] = useState(false);

  const handleLaunchDbPaper = (paperRecord: any) => {
    const paperData = paperRecord.data as QuestionPaper;
    usePaperStore.setState((state) => ({
      papers: state.papers.find(p => p.id === paperData.id)
        ? state.papers
        : [...state.papers, paperData],
      currentPaper: paperData
    }));
    router.push(`/builder/${paperData.id}`);
  };

  const fetchDbPapers = async () => {
    setIsLoadingDb(true);
    try {
      const res = await fetch('/api/papers');
      if (!res.ok) throw new Error('Failed to fetch from bank');
      const data = await res.json();
      setDbPapers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingDb(false);
    }
  };

  const handleCreatePaper = (aiAssisted: boolean = false) => {
    // Limits are now removed or managed via DecapCMS
    const paperId = createPaper(aiAssisted);
    if (aiAssisted) {
      router.push(`/create-with-ai?paperId=${paperId}`);
    } else {
      router.push(`/builder/${paperId}`);
    }
  };

  // User session sync is now handled by Netlify Identity directly

  useEffect(() => {
    fetchDbPapers();
  }, []);

  const handleEditPaper = (paper: QuestionPaper) => {
    loadPaper(paper.id);
    router.push(`/builder/${paper.id}`);
  };

  const handleDuplicatePaper = (paperId: string) => {
    const user = session?.user as any;
    const userPlan = user?.plan || 'FREE';
    const totalPapers = papers.length + dbPapers.length;

    // Check limit before duplicating
    if ((userPlan === 'FREE' || userPlan === 'UNSET') && totalPapers >= 3 && (user?.extraPapersAvailable || 0) <= 0) {
      toast.error("Free plan limit reached (3 papers). Upgrade to create more.");
      setIsPurchasingExtra(true);
      return;
    }

    const newId = duplicatePaper(paperId);
    if (newId) {
      loadPaper(newId);
      router.push(`/builder/${newId}`);
    }
  };

  const handleDeletePaper = (paperId: string) => {
    setPaperToDelete(paperId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (paperToDelete) {
      deletePaper(paperToDelete);
      setPaperToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const sortedPapers = [...papers].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="min-h-screen bg-white">
      <LimitReachedModal
        isOpen={isPurchasingExtra}
        onClose={() => setIsPurchasingExtra(false)}
      />
      <header className="border-b border-black/5 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-black tracking-tighter uppercase leading-none">PaperCraft</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-xs font-black text-slate-400 hover:text-black transition-colors hidden sm:block uppercase tracking-widest">
              Pricing
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-black text-xs">
                    {session?.user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold leading-none text-black">{session?.user?.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">{(session?.user as any)?.plan || 'FREE'}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-lg border-black/5">
                <DropdownMenuItem asChild>
                  <Link href="/pricing" className="font-bold">Upgrade Plan</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="text-destructive font-bold">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-4xl font-black text-black mb-4 tracking-tighter uppercase">Dashboard</h2>
          <p className="text-slate-500 font-medium">Manage your educational assessments with editorial precision.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <Card
            className="group cursor-pointer border-2 border-slate-100 hover:border-black hover:bg-black hover:text-white transition-all duration-300 rounded-none overflow-hidden relative"
            onClick={() => handleCreatePaper(false)}
          >
            <CardContent className="p-8 flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 rounded-lg bg-black flex items-center justify-center group-hover:bg-white transition-colors duration-300">
                <Plus className="h-8 w-8 text-white group-hover:text-black" />
              </div>
              <div>
                <h3 className="font-black text-2xl tracking-tighter uppercase">New Paper</h3>
                <p className="text-sm font-medium opacity-60">Manual design with full control</p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="group cursor-pointer border-2 border-slate-100 hover:border-black hover:bg-black hover:text-white transition-all duration-300 rounded-none overflow-hidden relative"
            onClick={() => handleCreatePaper(true)}
          >
            <CardContent className="p-8 flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 rounded-lg bg-black flex items-center justify-center group-hover:bg-white transition-colors duration-300">
                <Sparkles className="h-8 w-8 text-white group-hover:text-black" />
              </div>
              <div>
                <h3 className="font-black text-2xl tracking-tighter uppercase">AI Assist</h3>
                <p className="text-sm font-medium opacity-60">Generate papers instantly</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="local" className="w-full" onValueChange={setActiveTab}>
          <div className="mb-8 flex items-center justify-between border-b border-black/5 pb-4">
            <TabsList className="bg-transparent h-auto p-0 gap-8">
              <TabsTrigger
                value="local"
                className="bg-transparent border-none p-0 text-sm font-black uppercase tracking-widest text-slate-400 data-[state=active]:text-black data-[state=active]:shadow-none relative after:absolute after:bottom-[-17px] after:left-0 after:w-full after:h-0.5 after:bg-black after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform"
              >
                Local Drafts ({papers.length})
              </TabsTrigger>
              <TabsTrigger
                value="bank"
                className="bg-transparent border-none p-0 text-sm font-black uppercase tracking-widest text-slate-400 data-[state=active]:text-black data-[state=active]:shadow-none relative after:absolute after:bottom-[-17px] after:left-0 after:w-full after:h-0.5 after:bg-black after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform"
              >
                Question Bank ({dbPapers.length})
              </TabsTrigger>
            </TabsList>
            {activeTab === 'bank' && (
              <Button variant="outline" size="sm" onClick={fetchDbPapers} disabled={isLoadingDb} className="rounded-none border-black font-black text-[10px] uppercase tracking-widest">
                Sync Bank
              </Button>
            )}
          </div>

          <TabsContent value="local" className="mt-0">
            {sortedPapers.length === 0 ? (
              <div className="py-24 text-center border-2 border-dashed border-slate-100">
                <div className="w-16 h-16 rounded-lg bg-slate-50 flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-black text-black mb-2 uppercase tracking-tighter">No papers yet</h3>
                <p className="text-slate-400 font-medium mb-8">Start your first transformation from the sections above.</p>
                <Button onClick={() => handleCreatePaper(false)} className="bg-black text-white hover:bg-slate-900 px-8 h-12 rounded-none font-bold uppercase tracking-widest">
                  Create Paper
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {sortedPapers.map((paper) => {
                  const totalMarks = calculateTotalMarks(paper);
                  const questionCount = paper.sections.reduce((sum, s) => sum + s.questions.length, 0);
                  return (
                    <Card
                      key={paper.id}
                      className="bg-white border-slate-100 hover:border-black transition-all rounded-none cursor-pointer group"
                      onClick={() => handleEditPaper(paper)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-black text-black truncate tracking-tighter uppercase">
                                {paper.metadata.examName || 'Untitled Paper'}
                              </h3>
                              {paper.isAIAssisted && (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-black/10 text-black text-[10px] font-black uppercase tracking-widest bg-slate-50">
                                  <Sparkles className="h-3 w-3" />
                                  AI
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                              {paper.metadata.subject && (
                                <span className="text-black/60">{paper.metadata.subject}</span>
                              )}
                              {paper.metadata.classOrCourse && (
                                <span>{paper.metadata.classOrCourse}</span>
                              )}
                              <span className="flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                {format(new Date(paper.updatedAt), 'MMM d, yyyy')}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-8">
                            <div className="hidden md:flex items-center gap-8 text-right">
                              <div>
                                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Sections</div>
                                <div className="text-lg font-black text-black">{paper.sections.length}</div>
                              </div>
                              <div>
                                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Marks</div>
                                <div className="text-lg font-black text-black">{totalMarks}</div>
                              </div>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-slate-50 transition-colors">
                                  <MoreVertical className="h-5 w-5 text-slate-400" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 rounded-lg border-black/5">
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditPaper(paper); }} className="font-bold">
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDuplicatePaper(paper.id); }} className="font-bold">
                                  <Copy className="h-4 w-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive font-bold"
                                  onClick={(e) => { e.stopPropagation(); handleDeletePaper(paper.id); }}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bank" className="mt-0">
            {isLoadingDb ? (
              <div className="py-24 text-center border-2 border-dashed border-slate-100 animate-pulse">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Synchronizing Bank...</p>
              </div>
            ) : dbPapers.length === 0 ? (
              <div className="py-24 text-center border-2 border-dashed border-slate-100">
                <div className="w-16 h-16 rounded-lg bg-slate-50 flex items-center justify-center mx-auto mb-6">
                  <Library className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-black text-black mb-2 uppercase tracking-tighter">Bank is empty</h3>
                <p className="text-slate-400 font-medium mb-8">Papers saved to the cloud during design will appear here.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {dbPapers.map((paperRecord) => (
                  <Card
                    key={paperRecord.id}
                    className="bg-white border-slate-100 hover:border-black transition-all rounded-none cursor-default group"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-black text-black truncate tracking-tighter uppercase mb-2">
                            {paperRecord.examName}
                          </h3>
                          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                            <span className="text-black/60">{paperRecord.subject}</span>
                            <span>{paperRecord.class}</span>
                            <span>{paperRecord.year}</span>
                            <span className="flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              Saved {format(new Date(paperRecord.createdAt), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                        <Button
                          className="bg-black text-white hover:bg-slate-900 rounded-none h-12 px-6 font-bold uppercase tracking-widest text-xs transition-all"
                          onClick={() => handleLaunchDbPaper(paperRecord)}
                        >
                          Launch Builder
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-none border-2 border-black">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black tracking-tighter uppercase">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="font-medium text-slate-500">
              This will permanently remove the paper from your local drafts. This action is irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none border-black/10 font-bold uppercase tracking-wider text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-black text-white hover:bg-slate-900 rounded-none font-bold uppercase tracking-wider text-xs">
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
