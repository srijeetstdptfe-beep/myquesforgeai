"use client";

import { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePaperStore } from '@/lib/store';
import {
  QuestionType,
  Language,
  Difficulty,
  LANGUAGE_LABELS,
  createDefaultQuestion,
} from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  FileText,
  Sparkles,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';

export function AICreator() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paperId = searchParams.get('paperId');
  const { currentPaper, updateMetadata, addQuestion, updateQuestion, savePaper, loadPaper, papers } = usePaperStore();

  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [contextText, setContextText] = useState('');
  const [contextFiles, setContextFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [settings, setSettings] = useState({
    subject: '',
    classOrCourse: '',
    language: 'english' as Language,
    difficulty: 'medium' as Difficulty,
    totalMarks: 100,
    questionCount: 10,
  });

  useState(() => {
    if (paperId) {
      const paper = papers.find((p) => p.id === paperId);
      if (paper) {
        loadPaper(paperId);
      }
    }
  });

  const handleContextFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setContextFiles(Array.from(files));
    }
  };

  // Import toast from sonner if not already imported, but I can't check imports easily here without re-viewing. 
  // I will assume global availability or just use alert for now if I am unsure, 
  // but package.json has sonner. I'll assume standard usage `import { toast } from 'sonner';` needs to be added or used.
  // Wait, I am replacing a function body. I'll use standard try-catch and maybe console.error/alert if sonner isn't imported.
  // Let's add the import to the top of the file in a separate edit or just use window.alert/console.
  // Actually, I can replace the whole file content or a large chunk to include imports, but `replace_file_content` is safer for chunks.
  // I'll stick to console/alert for failures to stay safe, or try to use a generic error state.

  const generateQuestions = async () => {
    setIsGenerating(true);

    try {
      updateMetadata({
        subject: settings.subject,
        classOrCourse: settings.classOrCourse,
        totalMarks: settings.totalMarks,
        examName: `${settings.subject} Examination`,
      });

      const formData = new FormData();
      formData.append('contextText', contextText);
      formData.append('subject', settings.subject);
      formData.append('classOrCourse', settings.classOrCourse);
      formData.append('difficulty', settings.difficulty);
      formData.append('questionCount', settings.questionCount.toString());
      formData.append('language', settings.language);

      contextFiles.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      const generatedQuestions = data.questions; // Array of QuestionBlock-like objects

      if (!generatedQuestions || !Array.isArray(generatedQuestions)) {
        throw new Error('Invalid response format');
      }

      // Add questions to the store
      if (currentPaper) {
        const sectionId = currentPaper.sections[0]?.id;

        if (sectionId) {
          const supportedTypes = ['mcq-single', 'mcq-multiple', 'true-false', 'fill-blanks', 'short-answer', 'long-answer', 'match-following'];
          const store = usePaperStore.getState();

          generatedQuestions.forEach((q: any) => {
            const qType = supportedTypes.includes(q.type) ? q.type : 'short-answer';
            store.addQuestion(sectionId, qType as QuestionType);

            // Get the new question
            const updatedPaper = usePaperStore.getState().currentPaper;
            const section = updatedPaper?.sections.find(s => s.id === sectionId);
            const newQuestion = section?.questions[section.questions.length - 1];

            if (newQuestion) {
              store.updateQuestion(sectionId, newQuestion.id, {
                questionText: q.questionText,
                marks: q.marks,
                language: settings.language,
                difficulty: settings.difficulty,
                isAIGenerated: true,
                options: q.options?.map((opt: any) => ({ ...opt, id: uuidv4() })),
                matchPairs: q.matchPairs?.map((p: any) => ({ ...p, id: uuidv4() })),
              });
            }
          });
        }
      }

      savePaper();
      if (paperId) {
        router.push(`/builder/${paperId}`);
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('Failed to generate questions: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50/30 to-pink-50/50">
      <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </Link>
            <div className="w-px h-6 bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-lg font-semibold">Create with AI</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Step {step} of 2
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Provide Context</h2>
              <p className="text-slate-600">
                Give AI the content to generate questions from. The more specific, the better.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Upload Context Files</CardTitle>
                <CardDescription>
                  Syllabus, textbook chapters, notes (PDF, DOCX, TXT)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center cursor-pointer hover:border-purple-300 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">Click to upload files</p>
                  {contextFiles.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {contextFiles.map((file, i) => (
                        <div key={i} className="flex items-center justify-center gap-2 text-sm text-purple-600">
                          <FileText className="h-4 w-4" />
                          {file.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={handleContextFileUpload}
                />
              </CardContent>
            </Card>

            <div className="text-center text-sm text-slate-500">OR</div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Paste Context Text</CardTitle>
                <CardDescription>
                  Copy and paste relevant content directly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={contextText}
                  onChange={(e) => setContextText(e.target.value)}
                  placeholder="Paste your syllabus, chapter content, or notes here..."
                  className="min-h-[200px]"
                />
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={() => setStep(2)}>
                Continue
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}


        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Generation Settings</h2>
              <p className="text-slate-600">
                Configure the paper settings before AI generates questions
              </p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input
                      value={settings.subject}
                      onChange={(e) => setSettings({ ...settings, subject: e.target.value })}
                      placeholder="e.g., Mathematics"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Class / Course</Label>
                    <Input
                      value={settings.classOrCourse}
                      onChange={(e) => setSettings({ ...settings, classOrCourse: e.target.value })}
                      placeholder="e.g., Class 10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select
                      value={settings.language}
                      onValueChange={(v) => setSettings({ ...settings, language: v as Language })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(LANGUAGE_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Difficulty</Label>
                    <Select
                      value={settings.difficulty}
                      onValueChange={(v) => setSettings({ ...settings, difficulty: v as Difficulty })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Total Marks</Label>
                    <Input
                      type="number"
                      value={settings.totalMarks}
                      onChange={(e) => setSettings({ ...settings, totalMarks: parseInt(e.target.value) || 100 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Number of Questions</Label>
                    <Input
                      type="number"
                      value={settings.questionCount}
                      onChange={(e) => setSettings({ ...settings, questionCount: parseInt(e.target.value) || 10 })}
                      min={1}
                      max={50}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800">AI will generate:</p>
                <ul className="text-blue-700 mt-1 space-y-1">
                  <li>• Questions strictly based on your provided context</li>
                  <li>• A mix of question types (MCQ, short answer, long answer, etc.)</li>
                  <li>• All content will be fully editable after generation</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <Button
                onClick={generateQuestions}
                disabled={isGenerating || !settings.subject}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Paper
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
