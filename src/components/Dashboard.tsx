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
  Save,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      if (typeof window !== 'undefined' && (window as any).netlifyIdentity) {
        const currentUser = (window as any).netlifyIdentity.currentUser();
        if (!currentUser) {
          router.push("/login");
        } else {
          setUser(currentUser);
        }
        setIsInitializing(false);
      }
    };

    initAuth();

    if (typeof window !== 'undefined' && (window as any).netlifyIdentity) {
      (window as any).netlifyIdentity.on("logout", () => router.push("/login"));
    }
  }, [router]);

  const signOut = () => {
    if (typeof window !== 'undefined' && (window as any).netlifyIdentity) {
      (window as any).netlifyIdentity.logout();
    }
  };

  const { papers, createPaper, deletePaper, duplicatePaper, loadPaper } = usePaperStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [paperToDelete, setPaperToDelete] = useState<string | null>(null);
  const [workspacePapers, setWorkspacePapers] = useState<any[]>([]);
  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(false);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  const fetchWorkspacePapers = async () => {
    setIsLoadingWorkspace(true);
    try {
      const res = await fetch('/api/papers');
      if (!res.ok) throw new Error('Failed to fetch from workspace');
      const data = await res.json();
      setWorkspacePapers(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to sync workspace papers");
    } finally {
      setIsLoadingWorkspace(false);
    }
  };

  useEffect(() => {
    fetchWorkspacePapers();
  }, []);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-black">
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">
          Synchronizing Workspace...
        </div>
      </div>
    );
  }

  if (!user) return null;

  const handleLaunchWorkspacePaper = (paperRecord: any) => {
    const paperData = paperRecord.data as QuestionPaper;
    usePaperStore.setState((state) => ({
      papers: state.papers.find(p => p.id === paperData.id)
        ? state.papers
        : [...state.papers, paperData],
      currentPaper: paperData
    }));
    router.push(`/builder/${paperData.id}`);
  };

  const handleCreatePaper = (aiAssisted: boolean = false) => {
    const paperId = createPaper(aiAssisted);
    if (aiAssisted) {
      router.push(`/create-with-ai?paperId=${paperId}`);
    } else {
      router.push(`/builder/${paperId}`);
    }
  };

  const handleEditPaper = (paper: QuestionPaper) => {
    loadPaper(paper.id);
    router.push(`/builder/${paper.id}`);
  };

  const syncPaperToWorkspace = async (paper: QuestionPaper) => {
    setIsSyncing(paper.id);
    try {
      const response = await fetch('/api/papers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examName: paper.metadata.examName || 'Untitled Paper',
          subject: paper.metadata.subject || 'General',
          class: paper.metadata.classOrCourse || 'All Classes',
          data: paper
        })
      });

      if (!response.ok) throw new Error('Failed to sync');
      toast.success('Paper synced to Workspace!');
      fetchWorkspacePapers();
    } catch (err) {
      console.error(err);
      toast.error('Sync failed');
    } finally {
      setIsSyncing(null);
    }
  };

  const sortedDrafts = [...papers].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b-[3px] border-black bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 border-2 border-black bg-black flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-black tracking-tighter uppercase leading-none">PaperCraft</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Editorial Workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-slate-50 border-2 border-transparent hover:border-black rounded-none">
                  <div className="w-8 h-8 rounded-none border-2 border-black flex items-center justify-center text-black font-black text-xs">
                    {user?.user_metadata?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-black leading-none text-black">{user?.user_metadata?.full_name || user?.email}</p>
                    <p className="text-[8px] text-slate-400 uppercase tracking-widest mt-0.5">{user?.app_metadata?.plan || 'PRO'}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-none border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <DropdownMenuItem asChild>
                  <Link href="/pricing" className="font-black uppercase text-[10px] tracking-widest">Upgrade / Billing</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-black" />
                <DropdownMenuItem onClick={() => signOut()} className="text-destructive font-black uppercase text-[10px] tracking-widest">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b-2 border-black pb-12">
          <div>
            <h2 className="text-6xl font-black text-black mb-4 tracking-tighter uppercase leading-[0.8]">YOUR <br /> WORKSPACE.</h2>
            <p className="text-xl text-slate-500 font-medium">Create, draft, and publish educational assessments.</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => handleCreatePaper(true)} className="h-16 px-8 bg-black text-white hover:bg-slate-800 rounded-none border-2 border-black font-black uppercase tracking-widest text-sm flex items-center gap-3">
              <Sparkles className="h-5 w-5" /> AI Create
            </Button>
            <Button onClick={() => handleCreatePaper(false)} variant="outline" className="h-16 px-8 border-2 border-black rounded-none font-black uppercase tracking-widest text-sm hover:bg-black hover:text-white flex items-center gap-3">
              <Plus className="h-5 w-5" /> New Draft
            </Button>
          </div>
        </div>

        <Tabs defaultValue="workspace" className="w-full">
          <TabsList className="bg-transparent h-auto p-0 gap-8 mb-12 border-b-2 border-slate-100 w-full justify-start rounded-none">
            <TabsTrigger
              value="workspace"
              className="bg-transparent border-none p-0 pb-4 text-xs font-black uppercase tracking-widest text-slate-400 data-[state=active]:text-black data-[state=active]:shadow-none relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[3px] after:bg-black after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform rounded-none"
            >
              Saved Papers ({workspacePapers.length})
            </TabsTrigger>
            <TabsTrigger
              value="local"
              className="bg-transparent border-none p-0 pb-4 text-xs font-black uppercase tracking-widest text-slate-400 data-[state=active]:text-black data-[state=active]:shadow-none relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[3px] after:bg-black after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform rounded-none"
            >
              Session Drafts ({papers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workspace" className="mt-0">
            {isLoadingWorkspace ? (
              <div className="py-24 text-center border-2 border-dashed border-black/10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Reading Filesystem...</p>
              </div>
            ) : workspacePapers.length === 0 ? (
              <div className="py-24 text-center border-2 border-dashed border-black/10">
                <Library className="h-12 w-12 text-slate-200 mx-auto mb-6" />
                <h3 className="text-xl font-black text-black mb-2 uppercase tracking-tighter">No Saved Papers</h3>
                <p className="text-slate-400 font-medium mb-8 uppercase text-[10px] tracking-widest">Publish a draft to see it here.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {workspacePapers.map((paperRecord) => (
                  <div
                    key={paperRecord.slug || paperRecord.id}
                    className="relative group h-full flex"
                  >
                    <div className="absolute inset-0 bg-slate-100 border-2 border-black translate-x-1 translate-y-1 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform" />
                    <Card className="bg-white border-2 border-black rounded-none transition-all w-full flex flex-col relative z-10">
                      <CardContent className="p-8 flex-1 flex flex-col">
                        <div className="mb-6 flex-1">
                          <h3 className="text-2xl font-black text-black tracking-tighter uppercase mb-2 leading-tight">
                            {paperRecord.examName}
                          </h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <span className="text-black">{paperRecord.subject}</span>
                            <span>Class {paperRecord.class}</span>
                            <span>{paperRecord.year}</span>
                          </div>
                        </div>
                        <div className="pt-6 border-t border-black/5 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-300 uppercase">
                            {format(new Date(paperRecord.createdAt), 'MMM d, yyyy')}
                          </span>
                          <Button
                            onClick={() => handleLaunchWorkspacePaper(paperRecord)}
                            className="bg-black text-white hover:bg-slate-800 rounded-none h-10 px-4 font-black uppercase tracking-widest text-[10px] transition-all"
                          >
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="local" className="mt-0">
            {sortedDrafts.length === 0 ? (
              <div className="py-24 text-center border-2 border-dashed border-black/10">
                <BookOpen className="h-12 w-12 text-slate-200 mx-auto mb-6" />
                <h3 className="text-xl font-black text-black mb-2 uppercase tracking-tighter">Drafts Area Clean</h3>
                <p className="text-slate-400 font-medium mb-8 uppercase text-[10px] tracking-widest">Start a new creation to populate session drafts.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {sortedDrafts.map((paper) => (
                  <Card key={paper.id} className="bg-white border-2 border-black hover:bg-slate-50 transition-all rounded-none group">
                    <CardContent className="p-6 flex items-center justify-between gap-6">
                      <div className="flex-1 min-w-0" onClick={() => handleEditPaper(paper)} className="cursor-pointer">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-black text-black leading-none tracking-tighter uppercase">{paper.metadata.examName || 'Untitled'}</h3>
                          {paper.isAIAssisted && <Sparkles className="h-4 w-4 text-black" />}
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Last Updated {format(new Date(paper.updatedAt), 'HH:mm')} • {calculateTotalMarks(paper)} Marks
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isSyncing === paper.id}
                          onClick={() => syncPaperToWorkspace(paper)}
                          className="h-10 border-2 border-black rounded-none font-black uppercase text-[10px] tracking-widest hover:bg-black hover:text-white"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {isSyncing === paper.id ? 'Syncing...' : 'Publish'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setPaperToDelete(paper.id); setDeleteDialogOpen(true); }}
                          className="h-10 w-10 hover:bg-red-50 hover:text-red-600 rounded-none border-2 border-transparent hover:border-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
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
        <AlertDialogContent className="rounded-none border-2 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black tracking-tighter uppercase">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="font-medium text-slate-500">
              Remove this paper from session drafts? This will not affect copies saved to Workspace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none border-2 border-black/10 font-black uppercase tracking-widest text-[10px]">Back</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (paperToDelete) deletePaper(paperToDelete);
              setDeleteDialogOpen(false);
            }} className="bg-black text-white hover:bg-slate-900 rounded-none font-black uppercase tracking-widest text-[10px]">
              Erase Draft
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
