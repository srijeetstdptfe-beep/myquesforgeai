"use client";

import { jsPDF } from 'jspdf';
import { Language } from './types';

// Font URLs from Fontsource CDN (jsdelivr)
// These are the regular weight Noto Sans fonts for each script family
const FONT_URLS: Record<string, string> = {
    // Devanagari (Hindi, Marathi, Sanskrit, Nepali, Konkani, Dogri, Maithili, Bodo, Kashmiri, Sindhi)
    devanagari: 'https://raw.githubusercontent.com/googlefonts/noto-fonts/master/hinted/ttf/NotoSansDevanagari/NotoSansDevanagari-Regular.ttf',
    // Tamil
    tamil: 'https://raw.githubusercontent.com/googlefonts/noto-fonts/master/hinted/ttf/NotoSansTamil/NotoSansTamil-Regular.ttf',
    // Telugu  
    telugu: 'https://raw.githubusercontent.com/googlefonts/noto-fonts/master/hinted/ttf/NotoSansTelugu/NotoSansTelugu-Regular.ttf',
    // Bengali (Bengali, Assamese, Manipuri)
    bengali: 'https://raw.githubusercontent.com/googlefonts/noto-fonts/master/hinted/ttf/NotoSansBengali/NotoSansBengali-Regular.ttf',
    // Gujarati
    gujarati: 'https://raw.githubusercontent.com/googlefonts/noto-fonts/master/hinted/ttf/NotoSansGujarati/NotoSansGujarati-Regular.ttf',
    // Kannada
    kannada: 'https://raw.githubusercontent.com/googlefonts/noto-fonts/master/hinted/ttf/NotoSansKannada/NotoSansKannada-Regular.ttf',
    // Malayalam
    malayalam: 'https://raw.githubusercontent.com/googlefonts/noto-fonts/master/hinted/ttf/NotoSansMalayalam/NotoSansMalayalam-Regular.ttf',
    // Odia
    odia: 'https://raw.githubusercontent.com/googlefonts/noto-fonts/master/hinted/ttf/NotoSansOriya/NotoSansOriya-Regular.ttf',
    // Punjabi (Gurmukhi)
    punjabi: 'https://raw.githubusercontent.com/googlefonts/noto-fonts/master/hinted/ttf/NotoSansGurmukhi/NotoSansGurmukhi-Regular.ttf',
    // Urdu/Sindhi (Arabic script)
    arabic: 'https://raw.githubusercontent.com/googlefonts/noto-fonts/master/hinted/ttf/NotoSansArabic/NotoSansArabic-Regular.ttf',
    // Santali (Ol Chiki)
    santali: 'https://raw.githubusercontent.com/googlefonts/noto-fonts/master/hinted/ttf/NotoSansOlChiki/NotoSansOlChiki-Regular.ttf',
};

// Map languages to their script family
const LANGUAGE_TO_SCRIPT: Record<Language, string> = {
    english: 'latin',
    hindi: 'devanagari',
    bengali: 'bengali',
    telugu: 'telugu',
    marathi: 'devanagari',
    tamil: 'tamil',
    urdu: 'arabic',
    gujarati: 'gujarati',
    kannada: 'kannada',
    malayalam: 'malayalam',
    odia: 'odia',
    punjabi: 'punjabi',
    assamese: 'bengali',
    maithili: 'devanagari',
    sanskrit: 'devanagari',
    santali: 'santali',
    kashmiri: 'devanagari',
    nepali: 'devanagari',
    sindhi: 'arabic',
    konkani: 'devanagari',
    dogri: 'devanagari',
    manipuri: 'bengali',
    bodo: 'devanagari',
};

// Cache for loaded fonts
const fontCache: Record<string, string> = {};

/**
 * Fetches a font from CDN and returns it as base64 string
 */
async function fetchFontAsBase64(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            // Remove the data URL prefix to get just the base64 data
            const base64Data = base64.split(',')[1];
            resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

/**
 * Loads and registers the appropriate font for the given language in jsPDF
 * Returns the font name to use, or 'times' if no special font is needed
 */
export async function loadFontForLanguage(pdf: jsPDF, language: Language): Promise<string> {
    // English uses the default Times Roman
    if (language === 'english') {
        return 'times';
    }

    const script = LANGUAGE_TO_SCRIPT[language];

    // If we don't have a font URL for this script, fall back to times
    if (!script || script === 'latin' || !FONT_URLS[script]) {
        console.warn(`No font found for language: ${language}, using default`);
        return 'times';
    }

    const fontUrl = FONT_URLS[script];
    const fontName = `NotoSans-${script}`;

    try {
        // Check cache first
        if (!fontCache[script]) {
            console.log(`Loading font for script: ${script}`);
            fontCache[script] = await fetchFontAsBase64(fontUrl);
        }

        // Register font with jsPDF
        pdf.addFileToVFS(`${fontName}.ttf`, fontCache[script]);
        pdf.addFont(`${fontName}.ttf`, fontName, 'normal', 'Identity-H');

        return fontName;
    } catch (error) {
        console.error(`Failed to load font for ${language}:`, error);
        return 'times';
    }
}

/**
 * Returns CSS font-family string for HTML preview
 */
export function getFontFamilyForLanguage(language: Language): string {
    const script = LANGUAGE_TO_SCRIPT[language];

    switch (script) {
        case 'devanagari':
            return "'Noto Sans Devanagari', 'Mangal', sans-serif";
        case 'tamil':
            return "'Noto Sans Tamil', 'Latha', sans-serif";
        case 'telugu':
            return "'Noto Sans Telugu', 'Gautami', sans-serif";
        case 'bengali':
            return "'Noto Sans Bengali', 'Vrinda', sans-serif";
        case 'gujarati':
            return "'Noto Sans Gujarati', 'Shruti', sans-serif";
        case 'kannada':
            return "'Noto Sans Kannada', 'Tunga', sans-serif";
        case 'malayalam':
            return "'Noto Sans Malayalam', 'Kartika', sans-serif";
        case 'odia':
            return "'Noto Sans Oriya', 'Kalinga', sans-serif";
        case 'punjabi':
            return "'Noto Sans Gurmukhi', 'Raavi', sans-serif";
        case 'arabic':
            return "'Noto Sans Arabic', 'Traditional Arabic', sans-serif";
        case 'santali':
            return "'Noto Sans Ol Chiki', sans-serif";
        default:
            return "'Times New Roman', Times, serif";
    }
}

/**
 * Returns Google Fonts CSS import URL for the paper language
 */
export function getGoogleFontsUrl(language: Language): string | null {
    const script = LANGUAGE_TO_SCRIPT[language];

    const fontMap: Record<string, string> = {
        devanagari: 'Noto+Sans+Devanagari:wght@400;700',
        tamil: 'Noto+Sans+Tamil:wght@400;700',
        telugu: 'Noto+Sans+Telugu:wght@400;700',
        bengali: 'Noto+Sans+Bengali:wght@400;700',
        gujarati: 'Noto+Sans+Gujarati:wght@400;700',
        kannada: 'Noto+Sans+Kannada:wght@400;700',
        malayalam: 'Noto+Sans+Malayalam:wght@400;700',
        odia: 'Noto+Sans+Oriya:wght@400;700',
        punjabi: 'Noto+Sans+Gurmukhi:wght@400;700',
        arabic: 'Noto+Sans+Arabic:wght@400;700',
    };

    if (script && fontMap[script]) {
        return `https://fonts.googleapis.com/css2?family=${fontMap[script]}&display=swap`;
    }

    return null;
}
