<?php
/**
 * AI Paper Generation API
 * Uses Groq API to generate question papers
 */

require_once __DIR__ . '/../../includes/functions.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

if (!Session::isLoggedIn()) {
    jsonResponse(['error' => 'Unauthorized'], 401);
}

$userId = Session::getUserId();
$input = getJsonInput();

// Validate input
if (empty($input['subject']) || empty($input['classLevel'])) {
    jsonResponse(['error' => 'Subject and class level are required'], 400);
}

$subject = sanitize($input['subject']);
$classLevel = sanitize($input['classLevel']);
$questionCount = min(50, max(5, intval($input['questionCount'] ?? 20)));
$topics = sanitize($input['topics'] ?? '');
$types = $input['types'] ?? ['MCQ', 'SHORT_ANSWER'];
$difficulty = sanitize($input['difficulty'] ?? 'medium');

// Build prompt
$prompt = buildPrompt($subject, $classLevel, $questionCount, $topics, $types, $difficulty);

// Call Groq API
try {
    $generatedContent = callGroqAPI($prompt);

    if (!$generatedContent) {
        jsonResponse(['error' => 'AI generation failed. Please try again.'], 500);
    }

    // Parse the response and create paper
    $paperData = parseAIResponse($generatedContent, $subject, $classLevel, $types);

    // Save paper to database
    $paperId = generateUUID();

    db()->insert('papers', [
        'id' => $paperId,
        'user_id' => $userId,
        'exam_name' => "$subject Examination",
        'subject' => $subject,
        'class' => $classLevel,
        'data' => json_encode($paperData)
    ]);

    // Update AI usage count
    db()->query("UPDATE users SET ai_paper_count = ai_paper_count + 1 WHERE id = ?", [$userId]);

    jsonResponse([
        'success' => true,
        'paperId' => $paperId,
        'message' => 'Paper generated successfully'
    ]);

} catch (Exception $e) {
    error_log("AI Generation error: " . $e->getMessage());
    jsonResponse(['error' => 'Failed to generate paper: ' . $e->getMessage()], 500);
}

function buildPrompt($subject, $classLevel, $questionCount, $topics, $types, $difficulty)
{
    $typesStr = implode(', ', $types);
    $difficultyDesc = [
        'easy' => 'basic conceptual understanding, direct questions',
        'medium' => 'standard examination level, mix of direct and application-based',
        'hard' => 'competitive exam level, analytical and application-based'
    ][$difficulty] ?? 'standard examination level';

    $topicsLine = $topics ? "Focus specifically on these topics: $topics" : "Cover the syllabus comprehensively.";

    return <<<PROMPT
Generate a question paper for:
Subject: $subject
Class/Level: $classLevel
Total Questions: $questionCount
Question Types: $typesStr
Difficulty: $difficulty ($difficultyDesc)

$topicsLine

Output a valid JSON object with this exact structure:
{
    "sections": [
        {
            "title": "Section A",
            "questions": [
                {
                    "type": "MCQ",
                    "text": "Question text here",
                    "marks": 1,
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correctAnswer": "A"
                },
                {
                    "type": "TRUE_FALSE",
                    "text": "Statement to evaluate",
                    "marks": 1,
                    "correctAnswer": "true"
                },
                {
                    "type": "SHORT_ANSWER",
                    "text": "Question requiring short answer",
                    "marks": 2
                },
                {
                    "type": "LONG_ANSWER",
                    "text": "Question requiring detailed answer",
                    "marks": 5
                }
            ]
        }
    ]
}

Rules:
1. Create 2-3 sections based on question types
2. Distribute questions evenly across sections
3. Use the requested question types only
4. Make questions clear, educational, and accurate
5. Return ONLY valid JSON, no explanation text
PROMPT;
}

function callGroqAPI($prompt)
{
    $apiKey = GROQ_API_KEY;

    if (empty($apiKey) || $apiKey === 'your_groq_api_key_here') {
        return getMockResponse();
    }

    $headers = [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json'
    ];

    $data = [
        'model' => 'llama-3.3-70b-versatile',
        'messages' => [
            ['role' => 'system', 'content' => 'You are an expert educational content creator. Generate question papers in valid JSON format only.'],
            ['role' => 'user', 'content' => $prompt]
        ],
        'temperature' => 0.7,
        'max_tokens' => 4000
    ];

    $response = httpRequest('https://api.groq.com/openai/v1/chat/completions', 'POST', $headers, $data);

    if (!$response) {
        error_log("Groq API error: No response from endpoint (Check network or allow_url_fopen)");
        return null;
    }

    // Log raw response for debugging
    error_log("Groq API Raw Response: " . substr($response, 0, 500));

    $dataArr = json_decode($response, true);
    if (!isset($dataArr['choices'][0])) {
        error_log("Groq API returned error structure: $response");
        return null;
    }

    return $dataArr['choices'][0]['message']['content'] ?? null;
}

function parseAIResponse($content, $subject, $classLevel, $types)
{
    // Try to extract JSON from the response
    $content = trim($content);

    // Remove markdown code blocks if present
    if (preg_match('/```json\s*(.*?)\s*```/s', $content, $matches)) {
        $content = $matches[1];
    } elseif (preg_match('/```\s*(.*?)\s*```/s', $content, $matches)) {
        $content = $matches[1];
    }

    $parsed = json_decode($content, true);

    if (!$parsed || !isset($parsed['sections'])) {
        // If parsing fails, create a basic structure
        $parsed = ['sections' => []];
    }

    // Add IDs and build final paper structure
    $paperId = generateUUID();

    return [
        'id' => $paperId,
        'metadata' => [
            'examName' => "$subject Examination",
            'subject' => $subject,
            'classOrCourse' => $classLevel,
            'institutionName' => '',
            'duration' => '3 Hours',
            'totalMarks' => 100,
            'date' => date('Y-m-d')
        ],
        'sections' => array_map(function ($section, $index) {
            return [
                'id' => 'section_' . time() . '_' . $index,
                'title' => $section['title'] ?? 'Section ' . chr(65 + $index),
                'instructions' => $section['instructions'] ?? '',
                'questions' => array_map(function ($q, $qIndex) use ($index) {
                    return [
                        'id' => 'q_' . time() . '_' . $index . '_' . $qIndex,
                        'type' => $q['type'] ?? 'SHORT_ANSWER',
                        'text' => '<p>' . ($q['text'] ?? 'Question text') . '</p>',
                        'marks' => $q['marks'] ?? 1,
                        'options' => $q['options'] ?? [],
                        'correctAnswer' => $q['correctAnswer'] ?? '',
                        'blanks' => [],
                        'matchOptions' => null
                    ];
                }, $section['questions'] ?? [], array_keys($section['questions'] ?? []))
            ];
        }, $parsed['sections'], array_keys($parsed['sections'])),
        'isAIAssisted' => true
    ];
}

function getMockResponse()
{
    return json_encode([
        'sections' => [
            [
                'title' => 'Section A - Multiple Choice',
                'questions' => [
                    [
                        'type' => 'MCQ',
                        'text' => 'What is the main topic of this subject?',
                        'marks' => 1,
                        'options' => ['Option A', 'Option B', 'Option C', 'Option D'],
                        'correctAnswer' => 'A'
                    ],
                    [
                        'type' => 'MCQ',
                        'text' => 'Which of the following is correct?',
                        'marks' => 1,
                        'options' => ['First choice', 'Second choice', 'Third choice', 'Fourth choice'],
                        'correctAnswer' => 'B'
                    ]
                ]
            ],
            [
                'title' => 'Section B - Short Answer',
                'questions' => [
                    [
                        'type' => 'SHORT_ANSWER',
                        'text' => 'Explain the key concepts in brief.',
                        'marks' => 3
                    ],
                    [
                        'type' => 'SHORT_ANSWER',
                        'text' => 'Define the main terminology used in this subject.',
                        'marks' => 2
                    ]
                ]
            ]
        ]
    ]);
}
