"use client";

import { useState, useRef } from 'react';
import { usePaperStore } from '@/lib/store';
import { PaperMetadata, Language, LANGUAGE_LABELS } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Settings2, Upload, X } from 'lucide-react';

interface PaperMetadataEditorProps {
  isOpen?: boolean;
  onClose?: () => void;
  asSheet?: boolean;
}

export function PaperMetadataEditor({ isOpen, onClose, asSheet = false }: PaperMetadataEditorProps) {
  const { currentPaper, updateMetadata } = usePaperStore();
  const [logoPreview, setLogoPreview] = useState<string | null>(
    currentPaper?.metadata.logoUrl || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentPaper) return null;

  const metadata = currentPaper.metadata;

  const handleChange = (field: keyof PaperMetadata, value: string | number) => {
    updateMetadata({ [field]: value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setLogoPreview(base64);
        updateMetadata({ logoUrl: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
    updateMetadata({ logoUrl: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formContent = (
    <ScrollArea className="h-[calc(100vh-120px)] pr-4">
      <div className="space-y-8 pb-6">
        {/* Institution Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-4 w-4 bg-black rounded-sm" />
            <h3 className="text-sm font-black text-black uppercase tracking-widest">
              Institution Details
            </h3>
          </div>

          <div className="space-y-1">
            <Label className="font-bold uppercase tracking-widest text-[10px] text-slate-500">Institution / School Name</Label>
            <Input
              value={metadata.institutionName}
              onChange={(e) => handleChange('institutionName', e.target.value)}
              placeholder="E.G. DELHI PUBLIC SCHOOL"
              className="border-2 border-black rounded-none focus-visible:ring-0 font-bold placeholder:text-slate-300 h-10"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-bold uppercase tracking-widest text-[10px] text-slate-500">Institution Logo</Label>
            <div className="flex items-center gap-4 bg-slate-50 p-4 border-2 border-dashed border-black/10 hover:border-black transition-colors">
              {logoPreview ? (
                <div className="relative group">
                  <div className="h-20 w-20 border-2 border-black bg-white p-1 flex items-center justify-center">
                    <img
                      src={logoPreview}
                      alt="Logo"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <button
                    onClick={removeLogo}
                    className="absolute -top-3 -right-3 bg-black text-white h-6 w-6 flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-none border-2 border-black font-black uppercase tracking-widest text-[10px] hover:bg-black hover:text-white h-10"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Logo
                </Button>
              )}
              {!logoPreview && (
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-[150px] leading-tight">
                  Recommended: Square PNG format
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-slate-200" />

        {/* Exam Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-4 w-4 bg-black rounded-sm" />
            <h3 className="text-sm font-black text-black uppercase tracking-widest">
              Exam Information
            </h3>
          </div>

          <div className="space-y-1">
            <Label className="font-bold uppercase tracking-widest text-[10px] text-slate-500">Exam Name</Label>
            <Input
              value={metadata.examName}
              onChange={(e) => handleChange('examName', e.target.value)}
              placeholder="E.G. FINAL EXAMINATION 2024"
              className="border-2 border-black rounded-none focus-visible:ring-0 font-bold placeholder:text-slate-300 h-10"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="font-bold uppercase tracking-widest text-[10px] text-slate-500">Subject</Label>
              <Input
                value={metadata.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                placeholder="E.G. MATH"
                className="border-2 border-black rounded-none focus-visible:ring-0 font-bold placeholder:text-slate-300 h-10"
              />
            </div>
            <div className="space-y-1">
              <Label className="font-bold uppercase tracking-widest text-[10px] text-slate-500">Class / Course</Label>
              <Input
                value={metadata.classOrCourse}
                onChange={(e) => handleChange('classOrCourse', e.target.value)}
                placeholder="E.G. CLASS 10"
                className="border-2 border-black rounded-none focus-visible:ring-0 font-bold placeholder:text-slate-300 h-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="font-bold uppercase tracking-widest text-[10px] text-slate-500">Date</Label>
              <Input
                type="date"
                value={metadata.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="border-2 border-black rounded-none focus-visible:ring-0 font-bold h-10"
              />
            </div>
            <div className="space-y-1">
              <Label className="font-bold uppercase tracking-widest text-[10px] text-slate-500">Duration</Label>
              <Input
                value={metadata.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                placeholder="E.G. 3 HOURS"
                className="border-2 border-black rounded-none focus-visible:ring-0 font-bold placeholder:text-slate-300 h-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="font-bold uppercase tracking-widest text-[10px] text-slate-500">Paper Code</Label>
              <Input
                value={metadata.paperCode || ''}
                onChange={(e) => handleChange('paperCode', e.target.value)}
                placeholder="E.G. SET-A"
                className="border-2 border-black rounded-none focus-visible:ring-0 font-bold placeholder:text-slate-300 h-10"
              />
            </div>
            <div className="space-y-1">
              <Label className="font-bold uppercase tracking-widest text-[10px] text-slate-500">Total Marks</Label>
              <Input
                type="number"
                min={0}
                value={metadata.totalMarks}
                onChange={(e) => handleChange('totalMarks', parseInt(e.target.value) || 0)}
                className="border-2 border-black rounded-none focus-visible:ring-0 font-bold h-10"
              />
            </div>
          </div>

          {/* Language Selector */}
          <div className="space-y-1">
            <Label className="font-bold uppercase tracking-widest text-[10px] text-slate-500">Paper Language</Label>
            <select
              value={metadata.language || 'english'}
              onChange={(e) => handleChange('language', e.target.value)}
              className="w-full h-10 px-3 border-2 border-black rounded-none text-sm font-bold bg-white focus:outline-none"
            >
              {(Object.keys(LANGUAGE_LABELS) as Language[]).map((lang) => (
                <option key={lang} value={lang}>
                  {LANGUAGE_LABELS[lang]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full h-px bg-slate-200" />

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-4 w-4 bg-black rounded-sm" />
            <h3 className="text-sm font-black text-black uppercase tracking-widest">
              Instructions
            </h3>
          </div>
          <Textarea
            value={metadata.instructions}
            onChange={(e) => handleChange('instructions', e.target.value)}
            placeholder="ENTER EXAM INSTRUCTIONS HERE..."
            className="min-h-[150px] border-2 border-black rounded-none focus-visible:ring-0 font-medium placeholder:text-slate-300 resize-none p-4"
          />
        </div>
      </div>
    </ScrollArea>
  );

  if (asSheet) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-10 border-2 border-black rounded-none font-black uppercase tracking-widest text-[10px] items-center gap-2 hover:bg-black hover:text-white transition-all"
          >
            <Settings2 className="h-4 w-4 mr-2" />
            Paper Settings
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px] border-l-2 border-black p-0 bg-white">
          <SheetHeader className="p-6 border-b-2 border-black bg-white">
            <SheetTitle className="text-2xl font-black uppercase tracking-tighter text-black flex items-center gap-3">
              <Settings2 className="h-6 w-6" />
              Configuration
            </SheetTitle>
          </SheetHeader>
          <div className="p-6">{formContent}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
      <DialogContent className="max-w-lg border-2 border-black rounded-none shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-0 bg-white">
        <DialogHeader className="p-6 border-b-2 border-black bg-white">
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-black">Paper Settings</DialogTitle>
        </DialogHeader>
        <div className="p-6">{formContent}</div>
      </DialogContent>
    </Dialog>
  );
}
