"use client";

import { useRef, useState } from 'react';
import { QuestionPaper, calculateSectionMarks } from '@/lib/types';
import { getFontFamilyForLanguage } from '@/lib/fontLoader';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Download, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface PaperPreviewProps {
  paper: QuestionPaper;
  isOpen: boolean;
  onClose: () => void;
}

export function PaperPreview({ paper, isOpen, onClose }: PaperPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);

    try {
      // Store coordinates calculated from the cloned document
      const blockPositions: { top: number; bottom: number }[] = [];
      // Use html2canvas for "Pixel-Perfect" export.
      // This is the only way to reliably handle complex Hindi ligatures 
      // which jsPDF struggles to shape correctly with standard fonts.
      const canvas = await html2canvas(previewRef.current, {
        scale: 2, // Higher scale for better print quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc) => {
          // html2canvas fails on modern CSS color functions like oklch() or lab().
          // Strategy: Inject a high-priority style block that resets ALL elements to standard colors.
          const style = clonedDoc.createElement('style');
          style.innerHTML = `
            :root {
              --background: #ffffff !important;
              --foreground: #000000 !important;
              --primary: #000000 !important;
              --primary-foreground: #ffffff !important;
              --secondary: #f3f4f6 !important;
              --secondary-foreground: #000000 !important;
              --muted: #f3f4f6 !important;
              --muted-foreground: #6b7280 !important;
              --accent: #f3f4f6 !important;
              --accent-foreground: #000000 !important;
              --border: #e5e7eb !important;
              --input: #e5e7eb !important;
              --ring: #9ca3af !important;
            }

            * {
              color: #000000 !important;
              border-color: #000000 !important;
              box-shadow: none !important;
            }

            body, html {
              background-color: #ffffff !important;
              color: #000000 !important;
            }
          `;
          clonedDoc.head.appendChild(style);

          // Deep Sanitization: Iterate through all elements and strip inline styles using oklch/lab
          const elements = clonedDoc.getElementsByTagName('*');
          for (let i = 0; i < elements.length; i++) {
            const el = elements[i] as HTMLElement;
            if (el.style) {
              const bg = el.style.backgroundColor;
              const color = el.style.color;
              const border = el.style.borderColor;

              if (bg && (bg.includes('oklch') || bg.includes('lab'))) el.style.backgroundColor = 'transparent';
              if (color && (color.includes('oklch') || color.includes('lab'))) el.style.color = '#000000';
              if (border && (border.includes('oklch') || border.includes('lab'))) el.style.borderColor = '#000000';
            }
          }
          // 3. CAPTURE COORDINATES from the cloned layout for perfect slicing
          const clonedRoot = clonedDoc.querySelector('[data-paper-root]') as HTMLElement;
          if (clonedRoot) {
            const clonedBlocks = Array.from(clonedRoot.querySelectorAll('.pdf-print-block')) as HTMLElement[];
            const rootRect = clonedRoot.getBoundingClientRect();

            clonedBlocks.forEach(b => {
              const rect = b.getBoundingClientRect();
              blockPositions.push({
                top: rect.top - rootRect.top,
                bottom: rect.bottom - rootRect.top
              });
            });
          }
        }
      });

      const root = previewRef.current!;
      const fileName = `${paper.metadata.examName || 'Question_Paper'}.pdf`;
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pageWidthMM = 210;
      const pageHeightMM = 297;

      const mmToPx = root.offsetWidth / pageWidthMM;
      const pxToMm = pageWidthMM / root.offsetWidth;
      const pageHeightPx = pageHeightMM * mmToPx;

      const canvasWidthPx = canvas.width / 2;
      const canvasHeightPx = canvas.height / 2;

      let yOffsetPx = 0;
      let pageNumber = 1;

      while (yOffsetPx < canvasHeightPx) {
        if (pageNumber > 1) pdf.addPage();

        let endY = yOffsetPx + pageHeightPx;

        if (endY < canvasHeightPx) {
          // Use our PRE-CALCULATED coordinates from the clone pass
          // Find the block that is currently being cut
          const overlappingBlock = blockPositions.find(b => {
            return b.top < endY && b.bottom > endY;
          });

          if (overlappingBlock) {
            // Slice exactly at the start of the unit that was being cut
            endY = overlappingBlock.top - 2; // tiny safety gap
          }
        }

        // Clamp to end of content
        if (endY > canvasHeightPx) endY = canvasHeightPx;
        if (endY <= yOffsetPx) {
          // Safety: if a single block is taller than a whole page, we must split it anyway
          endY = yOffsetPx + pageHeightPx;
        }

        const sliceHeightPx = endY - yOffsetPx;
        const sliceHeightMM = sliceHeightPx * pxToMm;

        // Source canvas is scale 2
        const sX = 0;
        const sY = Math.floor(yOffsetPx * 2);
        const sWidth = canvas.width;
        const sHeight = Math.floor(sliceHeightPx * 2);

        // Create a temporary canvas for this specific slice
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = sWidth;
        tempCanvas.height = sHeight;
        const ctx = tempCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(canvas, sX, sY, sWidth, sHeight, 0, 0, sWidth, sHeight);
          const pageData = tempCanvas.toDataURL('image/jpeg', 1.0);
          pdf.addImage(pageData, 'JPEG', 0, 0, pageWidthMM, sliceHeightMM, undefined, 'FAST');
        }

        yOffsetPx = endY;
        pageNumber++;
      }

      pdf.save(fileName.replace(/\s+/g, '_'));

    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsExporting(false);
    }
  };

  const stripHtml = (html: string) => {
    if (typeof window === 'undefined') return ''; // Safety for SSR
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  let globalQuestionNumber = 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-[95vw] h-[95vh] flex flex-col p-0 gap-0 bg-gray-100 border-2 border-black rounded-none shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
        <DialogHeader className="p-4 bg-white border-b-2 border-black flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 font-black uppercase tracking-tighter text-black text-xl">
              <FileText className="h-6 w-6" />
              Paper Preview
            </DialogTitle>
            <p className="sr-only" id="paper-preview-description">
              Preview of the generated question paper.
            </p>
            <Button
              onClick={exportToPDF}
              size="sm"
              disabled={isExporting}
              className="h-9 border-2 border-black bg-black text-white hover:bg-white hover:text-black rounded-none font-black uppercase tracking-widest text-[10px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none translate-x-[2px] translate-y-[2px] hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'EXPORTING...' : 'EXPORT PDF'}
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-4 md:p-8 bg-gray-200/50">
          <div
            ref={previewRef}
            data-paper-root
            className="bg-white text-black p-[20mm] shadow-2xl break-words mx-auto relative"
            style={{
              width: '210mm',
              minHeight: '297mm',
              fontFamily: getFontFamilyForLanguage(paper.metadata.language || 'english'),
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              position: 'relative'
            }}
          >
            {/* --- Header Section --- */}
            <div className="pdf-print-block">
              <div className="flex flex-col items-center mb-6">
                {/* Institution Name */}
                {paper.metadata.institutionName && (
                  <h1 className="text-xl font-bold uppercase text-center tracking-wide mb-1">
                    {paper.metadata.institutionName}
                  </h1>
                )}
                {/* Exam Name */}
                {paper.metadata.examName && (
                  <h2 className="text-lg font-bold uppercase text-center mb-1">
                    {paper.metadata.examName}
                  </h2>
                )}
                {/* Subject */}
                {paper.metadata.subject && (
                  <h3 className="text-base font-bold uppercase text-center mb-4">
                    {paper.metadata.subject}
                  </h3>
                )}

                {/* Meta Row: STD - TIME - MARKS */}
                <div className="w-full flex justify-between items-center text-sm font-bold border-b-2 border-transparent pb-2 mb-2">
                  <span className="flex-1 text-left">
                    {paper.metadata.classOrCourse ? `STD: ${paper.metadata.classOrCourse}` : ''}
                  </span>
                  <span className="flex-1 text-center">
                    {paper.metadata.duration ? `TIME: ${paper.metadata.duration}` : ''}
                  </span>
                  <span className="flex-1 text-right">
                    Marks: {paper.metadata.totalMarks}
                  </span>
                </div>
              </div>
            </div>

            {/* --- Sections --- */}
            <div className="space-y-12">
              {paper.sections.map((section) => (
                <div key={section.id}>
                  {/* Section Header */}
                  <div className="text-left mb-4 pdf-print-block">
                    <h4 className="font-bold text-base">({section.title})</h4>
                    {section.instructions && (
                      <p className="italic text-sm mt-2">({section.instructions})</p>
                    )}
                  </div>

                  {/* Questions */}
                  <div className="space-y-8">
                    {section.questions.map((q) => {
                      globalQuestionNumber++;
                      return (
                        <div key={q.id} className="relative pdf-print-block">
                          <div className="flex justify-between items-start gap-4">
                            {/* Question Text */}
                            <div className="flex-1 font-bold text-base leading-snug">
                              <span className="mr-2">Q.{globalQuestionNumber}</span>
                              <span>{stripHtml(q.questionText)}</span>
                            </div>
                            {/* Marks */}
                            <div className="font-bold whitespace-nowrap text-base">
                              [{q.marks} Marks]
                            </div>
                          </div>

                          {/* Render Options/Contents based on type */}
                          <div className="ml-8 mt-3 space-y-3 text-base font-normal">
                            {/* MCQs */}
                            {(q.type === 'mcq-single' || q.type === 'mcq-multiple') && q.options && (
                              <div className="grid grid-cols-1 gap-y-2">
                                {q.options.map((opt, i) => (
                                  <div key={opt.id}>
                                    {['(A)', '(B)', '(C)', '(D)'][i]} {opt.text}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* True/False */}
                            {q.type === 'true-false' && (
                              <div className="flex gap-8">
                                <span>(A) True</span>
                                <span>(B) False</span>
                              </div>
                            )}

                            {/* Match The Following */}
                            {q.type === 'match-following' && q.matchPairs && (
                              <div className="grid grid-cols-2 gap-8 mt-2">
                                <div>
                                  <div className="font-bold mb-2 underline">Column A</div>
                                  {q.matchPairs.map((p, i) => (
                                    <div key={p.id} className="mb-1">
                                      ({i + 1}) {p.left}
                                    </div>
                                  ))}
                                </div>
                                <div>
                                  <div className="font-bold mb-2 underline">Column B</div>
                                  {q.matchPairs.map((p, i) => (
                                    <div key={p.id} className="mb-1">
                                      ({String.fromCharCode(97 + i)}) {p.right}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Fill Blanks */}
                            {q.type === 'fill-blanks' && (
                              <div className="text-sm italic text-gray-500 mt-1">
                                (Fill in the blank spaces)
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
