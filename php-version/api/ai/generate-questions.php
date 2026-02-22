<?php
/**
 * Generate Questions API
 * Generates individual questions using AI
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
$subject = sanitize($input['subject'] ?? '');
$topic = sanitize($input['topic'] ?? '');
$questionType = sanitize($input['questionType'] ?? 'MCQ');
$difficulty = sanitize($input['difficulty'] ?? 'medium');
$count = min(10, max(1, intval($input['count'] ?? 5)));
$language = sanitize($input['language'] ?? 'en');

if (empty($subject)) {
    jsonResponse(['error' => 'Subject is required'], 400);
}

// Build prompt
$typeInstructions = [
    'MCQ' => 'multiple choice questions with 4 options (A, B, C, D) and correct answer',
    'TRUE_FALSE' => 'true/false statements with the correct answer',
    'FILL_BLANK' => 'fill in the blank questions with the answer',
    'SHORT_ANSWER' => 'short answer questions (2-3 sentences expected)',
    'LONG_ANSWER' => 'long answer/essay questions (paragraph expected)',
    'MATCH' => 'match the following questions with left and right columns'
];

$typeInstruction = $typeInstructions[$questionType] ?? $typeInstructions['MCQ'];

$prompt = <<<PROMPT
Generate $count $typeInstruction for:
Subject: $subject
Topic: $topic
Difficulty: $difficulty
Language: $language

Output as JSON array:
[
    {
        "type": "$questionType",
        "text": "Question text",
        "marks": 1,
        "options": ["A", "B", "C", "D"],  // for MCQ only
        "correctAnswer": "A"  // or "true"/"false" for TRUE_FALSE
    }
]

Rules:
1. Make questions clear and educational
2. Vary the difficulty appropriately
3. Return ONLY valid JSON array
PROMPT;

try {
    $apiKey = GROQ_API_KEY;

    if (empty($apiKey) || $apiKey === 'your_groq_api_key_here') {
        // Mock response for testing
        $questions = [];
        for ($i = 0; $i < $count; $i++) {
            $q = [
                'id' => 'q_' . generateUUID(),
                'type' => $questionType,
                'text' => "<p>Sample $questionType question " . ($i + 1) . " about $subject</p>",
                'marks' => $questionType === 'LONG_ANSWER' ? 5 : ($questionType === 'SHORT_ANSWER' ? 3 : 1)
            ];

            if ($questionType === 'MCQ') {
                $q['options'] = ['Option A', 'Option B', 'Option C', 'Option D'];
                $q['correctAnswer'] = 'A';
            } elseif ($questionType === 'TRUE_FALSE') {
                $q['correctAnswer'] = 'true';
            }

            $questions[] = $q;
        }
    } else {
        // Call Groq API
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => 'https://api.groq.com/openai/v1/chat/completions',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $apiKey,
                'Content-Type: application/json'
            ],
            CURLOPT_POSTFIELDS => json_encode([
                'model' => 'llama-3.3-70b-versatile',
                'messages' => [
                    ['role' => 'system', 'content' => 'You generate educational questions in JSON format only.'],
                    ['role' => 'user', 'content' => $prompt]
                ],
                'temperature' => 0.7,
                'max_tokens' => 2000
            ]),
            CURLOPT_TIMEOUT => 60
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            throw new Exception('AI API error');
        }

        $data = json_decode($response, true);
        $content = $data['choices'][0]['message']['content'] ?? '[]';

        // Parse JSON from response
        if (preg_match('/```json\s*(.*?)\s*```/s', $content, $matches)) {
            $content = $matches[1];
        }

        $parsed = json_decode($content, true);
        $questions = [];

        foreach ($parsed as $q) {
            $questions[] = [
                'id' => 'q_' . generateUUID(),
                'type' => $q['type'] ?? $questionType,
                'text' => '<p>' . ($q['text'] ?? 'Question') . '</p>',
                'marks' => $q['marks'] ?? 1,
                'options' => $q['options'] ?? [],
                'correctAnswer' => $q['correctAnswer'] ?? ''
            ];
        }
    }

    // Update AI usage
    db()->query(
        "UPDATE users SET ai_question_count = ai_question_count + ? WHERE id = ?",
        [$count, Session::getUserId()]
    );

    jsonResponse([
        'success' => true,
        'questions' => $questions
    ]);

} catch (Exception $e) {
    error_log("Generate questions error: " . $e->getMessage());
    jsonResponse(['error' => 'Failed to generate questions'], 500);
}
