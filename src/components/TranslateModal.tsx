
"use client";

import { useState } from 'react';
import { usePaperStore } from '@/lib/store';
import { Language, LANGUAGE_LABELS } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Languages, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface TranslateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TranslateModal({ isOpen, onClose }: TranslateModalProps) {
    const { currentPaper, setSections, updateMetadata } = usePaperStore();
    const [targetLanguage, setTargetLanguage] = useState<Language>('hindi');
    const [isTranslating, setIsTranslating] = useState(false);

    if (!currentPaper) return null;

    const handleTranslate = async () => {
        setIsTranslating(true);
        try {
            const response = await fetch('/api/translate-paper', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sections: currentPaper.sections,
                    targetLanguage: LANGUAGE_LABELS[targetLanguage],
                }),
            });

            if (!response.ok) {
                throw new Error('Translation failed');
            }

            const data = await response.json();

            if (data.sections) {
                setSections(data.sections);
                updateMetadata({ language: targetLanguage });
                toast.success(`Paper translated to ${LANGUAGE_LABELS[targetLanguage]} successfully!`);
                onClose();
            }
        } catch (error) {
            console.error('Translation error:', error);
            toast.error('Failed to translate paper. Please try again.');
        } finally {
            setIsTranslating(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px] border-2 border-black rounded-none shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-0 bg-white">
                <DialogHeader className="p-6 border-b-2 border-black bg-white">
                    <DialogTitle className="flex items-center gap-2 text-xl font-black uppercase tracking-tighter text-black">
                        <Languages className="h-5 w-5" />
                        AI Paper Translator
                    </DialogTitle>
                    <DialogDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">
                        Translate paper while preserving structure.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 p-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Select Target Language</label>
                        <select
                            value={targetLanguage}
                            onChange={(e) => setTargetLanguage(e.target.value as Language)}
                            className="w-full h-10 px-3 border-2 border-black rounded-none text-sm font-bold bg-white focus:outline-none focus:ring-0"
                            disabled={isTranslating}
                        >
                            {(Object.keys(LANGUAGE_LABELS) as Language[]).map((lang) => (
                                <option key={lang} value={lang}>
                                    {LANGUAGE_LABELS[lang]}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="bg-yellow-300 border-2 border-black p-4 text-xs font-bold text-black flex gap-3 items-start">
                        <Sparkles className="h-4 w-4 shrink-0 mt-0.5" />
                        <p>
                            AI will translate question text, options, and instructions.
                        </p>
                    </div>
                </div>

                <DialogFooter className="p-6 pt-0 sm:justify-between gap-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isTranslating}
                        className="flex-1 h-12 border-2 border-black rounded-none font-black uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleTranslate}
                        disabled={isTranslating}
                        className="flex-1 h-12 bg-black text-white border-2 border-black rounded-none font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                    >
                        {isTranslating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                TRANSLATING...
                            </>
                        ) : (
                            'TRANSLATE PAPER'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
