"use client";

import { useRef, useState } from 'react';
import { QuestionPaper, calculateSectionMarks } from '@/lib/types';
import { loadFontForLanguage, getFontFamilyForLanguage, getGoogleFontsUrl } from '@/lib/fontLoader';
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

interface PaperPreviewProps {
  paper: QuestionPaper;
  isOpen: boolean;
  onClose: () => void;
}

export function PaperPreview({ paper, isOpen, onClose }: PaperPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      // Check Permissions via API - Simplified for DecapCMS migration
      let canExportClean = true;

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight(); // Needed for watermark
      const margin = 15;
      const contentWidth = pageWidth - 2 * margin;
      let yPos = margin;
      const lineHeight = 6;

      // ... font loading ...
      const paperLanguage = paper.metadata.language || 'english';
      const fontName = await loadFontForLanguage(pdf, paperLanguage);

      // Apply Watermark if needed (at the end or during? Metadata usually added at end)
      // We'll apply it at the end to cover all pages.

      // --- Header Section ---
      pdf.setFont(fontName, 'normal');

      // Institution Name (Centered, Uppercase)
      if (paper.metadata.institutionName) {
        pdf.setFontSize(14);
        pdf.text(paper.metadata.institutionName.toUpperCase(), pageWidth / 2, yPos, { align: 'center' });
        yPos += lineHeight + 1;
      }

      // Exam Name (Centered, Uppercase)
      if (paper.metadata.examName) {
        pdf.setFontSize(12);
        pdf.text(paper.metadata.examName.toUpperCase(), pageWidth / 2, yPos, { align: 'center' });
        yPos += lineHeight;
      }

      // Subject (Centered, Uppercase)
      if (paper.metadata.subject) {
        pdf.setFontSize(11);
        pdf.text(paper.metadata.subject.toUpperCase(), pageWidth / 2, yPos, { align: 'center' });
        yPos += lineHeight;
      }

      // Meta Row: STD (Left) -- TIME (Center) -- Marks (Right)
      yPos += 2;
      pdf.setFontSize(11);
      pdf.setFont(fontName, 'bold');

      const stdText = paper.metadata.classOrCourse ? `STD: ${paper.metadata.classOrCourse}` : '';
      const timeText = paper.metadata.duration ? `TIME: ${paper.metadata.duration}` : '';
      const marksText = `Marks: ${paper.metadata.totalMarks}`;

      // Left
      if (stdText) pdf.text(stdText, margin, yPos);

      // Center
      if (timeText) pdf.text(timeText, pageWidth / 2, yPos, { align: 'center' });

      // Right
      pdf.text(marksText, pageWidth - margin, yPos, { align: 'right' });

      yPos += lineHeight;

      // Optional: Paper Code or "Activity Set 1" if treated as subset of exam name
      if (paper.metadata.paperCode) {
        pdf.text(paper.metadata.paperCode, pageWidth / 2, yPos, { align: 'center' });
        yPos += lineHeight;
      }

      yPos += 2;

      // Instructions
      if (paper.metadata.instructions) {
        // Only show if strictly needed, or maybe just "General Instructions" title if space is tight? 
        // The sample image shows "Section I: Language Study" directly after header.
        // Let's keep instructions but ensure they don't look out of place.
        // For now, I'll render instructions if they exist, but maybe more compact?
        // Actually, the sample image doesn't show general instructions block like before.
        // I'll keep it but make it look integrated.
      }

      // --- content ---
      let globalQuestionNumber = 0;

      // Helper to check page break
      const checkPageBreak = (neededSpace: number = 20) => {
        if (yPos + neededSpace > 280) {
          pdf.addPage();
          yPos = margin;
        }
      };

      paper.sections.forEach((section) => {
        checkPageBreak();

        // Section Title: Left aligned, in brackets, e.g. (Section I: Language Study)
        pdf.setFont(fontName, 'bold');
        pdf.setFontSize(12);
        // Construct title text
        let sectionTitle = section.title;
        const sectionHeader = `(${sectionTitle})`;

        // Align left (margin) instead of centered
        pdf.text(sectionHeader, margin, yPos);
        yPos += lineHeight;

        if (section.instructions) {
          pdf.setFontSize(10);
          pdf.setFont(fontName, 'italic');
          // Align left as well for consistency, or keep centered? User said "Section names", typically instructions follow title.
          // Let's align left to match the section title request.
          pdf.text(`(${section.instructions})`, margin, yPos);
          yPos += lineHeight;
        }

        yPos += 2;

        section.questions.forEach((q) => {
          checkPageBreak();
          globalQuestionNumber++;

          pdf.setFont(fontName, 'bold'); // Question text usually bold in exam papers? Or just the Q number?
          // Image shows: Q.1 A1. Do as directed ... [4 Marks]
          // The structure is bit complex. Let's simplify: "Q{num}. {Text} .... [Marks]"

          pdf.setFontSize(11);
          const qPrefix = `Q.${globalQuestionNumber} `;
          const marksSuffix = `[${q.marks} Marks]`;

          const questionText = stripHtml(q.questionText).trim();

          // We need to print Marks at the right edge.
          // And Question text wrapping on the left.

          const marksWidth = pdf.getTextWidth(marksSuffix);
          const availableWidthForText = contentWidth - marksWidth - 5;

          // Print Marks first (Right aligned)
          pdf.setFont(fontName, 'bold');
          pdf.text(marksSuffix, pageWidth - margin, yPos, { align: 'right' });

          // Print Question Text
          // Let's decide if main question text is bold or normal. 
          // Sample: "Do as directed :(Any four)" is bold.
          // Subquestions "i. Write two..." is bold.
          // Let's stick to Bold for Main Question.

          const lines = pdf.splitTextToSize(qPrefix + questionText, availableWidthForText);

          // Check if lines need page break
          if (yPos + (lines.length * lineHeight) > 280) {
            pdf.addPage();
            yPos = margin;
            // Reprint marks if we moved? uncommon edge case.
            pdf.text(marksSuffix, pageWidth - margin, yPos, { align: 'right' });
          }

          lines.forEach((line: string) => {
            pdf.text(line, margin, yPos);
            yPos += lineHeight;
          });

          // Sub Questions / Options
          pdf.setFont(fontName, 'normal');

          // --- MCQs ---
          if (q.type === 'mcq-single' || q.type === 'mcq-multiple') {
            const optionLabels = ['i.', 'ii.', 'iii.', 'iv.'];
            // Sample image uses i. ii. iii. for subquestions. 
            // But for MCQs it usually uses A, B, C, D or (a) (b).
            // Let's use (A), (B)..
            const optLabels = ['(A)', '(B)', '(C)', '(D)'];
            q.options?.forEach((opt, i) => {
              const label = optLabels[i] || `(${i + 1})`;
              const textToPrint = `    ${label} ${opt.text || ''}`;
              const lines = pdf.splitTextToSize(textToPrint, contentWidth);

              if (yPos + (lines.length * lineHeight) > 280) {
                pdf.addPage();
                yPos = margin;
              }

              lines.forEach((line: string) => {
                pdf.text(line, margin, yPos);
                yPos += lineHeight;
              });
            });
          }

          // --- Match Follow ---
          if (q.type === 'match-following') {
            // ... match logic similar to before but with Times font ...
            const colA = q.matchPairs?.map((p, i) => `(${i + 1}) ${p.left}`) || [];
            const colB = q.matchPairs?.map((p, i) => `(${String.fromCharCode(97 + i)}) ${p.right}`) || []; // a, b, c

            const maxLen = Math.max(colA.length, colB.length);
            yPos += 2;

            // Headers
            pdf.setFont(fontName, 'bold');
            pdf.text("Column A", margin + 10, yPos);
            // Adjust Column B position if needed, or keep at midpoint
            pdf.text("Column B", pageWidth / 2 + 5, yPos);
            yPos += lineHeight;
            pdf.setFont(fontName, 'normal');

            for (let i = 0; i < maxLen; i++) {
              // We need to wrap text for both columns
              // Width for each column is roughly (contentWidth / 2) - padding
              const colWidth = (contentWidth / 2) - 10;

              const leftText = colA[i] || '';
              const rightText = colB[i] || '';

              const leftLines = pdf.splitTextToSize(leftText, colWidth);
              const rightLines = pdf.splitTextToSize(rightText, colWidth);

              const maxLines = Math.max(leftLines.length, rightLines.length);

              if (yPos + (maxLines * lineHeight) > 280) {
                pdf.addPage();
                yPos = margin;
                // Reprint headers? Maybe not necessary inside the table usually.
              }

              // Print lines
              for (let j = 0; j < maxLines; j++) {
                if (leftLines[j]) pdf.text(leftLines[j], margin + 10, yPos);
                if (rightLines[j]) pdf.text(rightLines[j], pageWidth / 2 + 5, yPos);
                yPos += lineHeight;
              }
              // Extra spacing between rows?
              yPos += 2;
            }
          }

          yPos += 2;
        });

        yPos += 4;
      });

      const fileName = `${paper.metadata.examName || 'Question_Paper'}.pdf`;

      // Apply Watermark
      if (!canExportClean) {
        const totalPages = pdf.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setTextColor(200, 200, 200);
          pdf.setFontSize(40);
          // Rotate text 45 degrees
          pdf.text("TRIAL VERSION", pageWidth / 2, pageHeight / 2, {
            align: 'center',
            angle: 45
          });
          pdf.text("UPGRADE TO REMOVE", pageWidth / 2, (pageHeight / 2) + 20, {
            align: 'center',
            angle: 45
          });
        }
      }

      pdf.save(fileName.replace(/\\s+/g, '_'));
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
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
            className="bg-white text-black p-[20mm] shadow-2xl break-words mx-auto"
            style={{
              width: '210mm',
              minHeight: '297mm',
              fontFamily: getFontFamilyForLanguage(paper.metadata.language || 'english'),
              wordWrap: 'break-word',
              overflowWrap: 'break-word'
            }}
          >
            {/* --- Header Section --- */}
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

            {/* --- Sections --- */}
            <div className="space-y-6">
              {paper.sections.map((section) => (
                <div key={section.id}>
                  {/* Section Header */}
                  <div className="text-left mb-4">
                    <h4 className="font-bold text-base">({section.title})</h4>
                    {section.instructions && (
                      <p className="italic text-sm mt-1">({section.instructions})</p>
                    )}
                  </div>

                  {/* Questions */}
                  <div className="space-y-4">
                    {section.questions.map((q) => {
                      globalQuestionNumber++;
                      return (
                        <div key={q.id} className="relative">
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
                          <div className="ml-8 mt-2 space-y-2 text-base font-normal">
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
