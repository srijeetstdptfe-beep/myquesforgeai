declare module 'jspdf' {
    export class jsPDF {
        constructor(orientation?: string, unit?: string, format?: string | number[], compressPdf?: boolean);
        internal: {
            pageSize: {
                getWidth: () => number;
                getHeight: () => number;
            };
        };
        addFileToVFS(filename: string, filecontent: string): jsPDF;
        addFont(postScriptName: string, id: string, fontStyle: string, encoding: string): jsPDF;
        setFont(fontName: string, fontStyle?: string): jsPDF;
        setFontSize(size: number): jsPDF;
        text(text: string | string[], x: number, y: number, options?: any): jsPDF;
        save(filename: string, options?: any): jsPDF;
        addImage(imageData: string | HTMLCanvasElement | HTMLImageElement | Uint8Array, format: string, x: number, y: number, w: number, h: number, alias?: string, compression?: string, rotation?: number): jsPDF;
        addPage(format?: string | number[], orientation?: 'p' | 'l'): jsPDF;
        getTextWidth(text: string): number;
        splitTextToSize(text: string, maxlen: number, options?: any): any;
        getNumberOfPages(): number;
        setPage(pageNumber: number): jsPDF;
        setTextColor(r: number, g: number, b: number): jsPDF;
    }
}
