<?php
/**
 * Translate Paper API
 * Translates paper content to different languages using AI
 */

require_once __DIR__ . '/../../includes/functions.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

if (!Session::isLoggedIn()) {
    jsonResponse(['error' => 'Unauthorized'], 401);
}

$input = getJsonInput();
$text = $input['text'] ?? '';
$targetLang = sanitize($input['targetLanguage'] ?? 'hi');
$paperId = sanitize($input['paperId'] ?? '');

if (empty($text)) {
    jsonResponse(['error' => 'Text to translate is required'], 400);
}

$languageNames = [
    'hi' => 'Hindi',
    'mr' => 'Marathi',
    'gu' => 'Gujarati',
    'bn' => 'Bengali',
    'ta' => 'Tamil',
    'te' => 'Telugu',
    'kn' => 'Kannada',
    'ml' => 'Malayalam',
    'pa' => 'Punjabi',
    'or' => 'Odia',
    'as' => 'Assamese',
    'ur' => 'Urdu',
    'sa' => 'Sanskrit',
    'ne' => 'Nepali',
    'en' => 'English'
];

$targetLangName = $languageNames[$targetLang] ?? 'Hindi';

$prompt = <<<PROMPT
Translate the following text to $targetLangName. Keep the formatting and structure intact. Only translate the text, do not add explanations.

Text to translate:
$text

Translated text:
PROMPT;

try {
    $apiKey = GROQ_API_KEY;

    if (empty($apiKey) || $apiKey === 'your_groq_api_key_here') {
        // Mock response
        jsonResponse([
            'success' => true,
            'translatedText' => "[Translated to $targetLangName] $text"
        ]);
        exit;
    }

    $headers = [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json'
    ];

    $payload = [
        'model' => 'llama-3.3-70b-versatile',
        'messages' => [
            ['role' => 'system', 'content' => "You are a professional translator. Translate text accurately to $targetLangName."],
            ['role' => 'user', 'content' => $prompt]
        ],
        'temperature' => 0.3,
        'max_tokens' => 2000
    ];

    $response = httpRequest('https://api.groq.com/openai/v1/chat/completions', 'POST', $headers, $payload);

    if (!$response) {
        throw new Exception('Translation API error: No response');
    }

    // Log for debugging
    error_log("Groq Translate Raw Response: " . substr($response, 0, 500));

    $data = json_decode($response, true);
    if (!isset($data['choices'][0])) {
        error_log("Groq Translate API Error: $response");
        throw new Exception('Translation API error: Invalid response structure');
    }

    $translatedText = $data['choices'][0]['message']['content'] ?? $text;

    jsonResponse([
        'success' => true,
        'translatedText' => trim($translatedText)
    ]);

} catch (Exception $e) {
    error_log("Translation error: " . $e->getMessage());
    jsonResponse(['error' => 'Translation failed'], 500);
}
