<?php
/**
 * Mail Helper
 * Sends emails using SMTP (PHPMailer-free implementation)
 */

/**
 * Send email using SMTP
 * Uses fsockopen for basic SMTP without PHPMailer
 */
function sendMail($to, $subject, $body, $isHtml = true)
{
    // For development/testing, use PHP's mail() with proper headers
    // In production with PHPMailer unavailable, we'll use a socket-based approach

    $headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        'From: ' . MAIL_FROM_NAME . ' <' . MAIL_USERNAME . '>',
        'Reply-To: ' . MAIL_USERNAME,
        'X-Mailer: PHP/' . phpversion()
    ];

    // Try using PHP's mail() first (works on many servers)
    $mailSent = @mail($to, $subject, $body, implode("\r\n", $headers));

    if ($mailSent) {
        return true;
    }

    // If mail() fails, try SMTP directly
    return sendSmtpMail($to, $subject, $body);
}

/**
 * Send email via SMTP socket (works without PHPMailer)
 */
function sendSmtpMail($to, $subject, $body)
{
    $host = MAIL_HOST;
    $port = MAIL_PORT;
    $username = MAIL_USERNAME;
    $password = MAIL_PASSWORD;
    $from = MAIL_USERNAME;
    $fromName = MAIL_FROM_NAME;

    try {
        // Connect with SSL for port 465
        $socket = @fsockopen('ssl://' . $host, $port, $errno, $errstr, 30);

        if (!$socket) {
            error_log("SMTP Connection failed: $errstr ($errno)");
            return false;
        }

        // Read greeting
        $response = fgets($socket, 515);

        // EHLO
        fputs($socket, "EHLO localhost\r\n");
        $response = '';
        while ($line = fgets($socket, 515)) {
            $response .= $line;
            if (substr($line, 3, 1) == ' ')
                break;
        }

        // AUTH LOGIN
        fputs($socket, "AUTH LOGIN\r\n");
        fgets($socket, 515);

        // Username
        fputs($socket, base64_encode($username) . "\r\n");
        fgets($socket, 515);

        // Password
        fputs($socket, base64_encode($password) . "\r\n");
        $authResponse = fgets($socket, 515);

        if (substr($authResponse, 0, 3) != '235') {
            error_log("SMTP Auth failed: $authResponse");
            fclose($socket);
            return false;
        }

        // MAIL FROM
        fputs($socket, "MAIL FROM:<$from>\r\n");
        fgets($socket, 515);

        // RCPT TO
        fputs($socket, "RCPT TO:<$to>\r\n");
        fgets($socket, 515);

        // DATA
        fputs($socket, "DATA\r\n");
        fgets($socket, 515);

        // Headers and body
        $message = "From: $fromName <$from>\r\n";
        $message .= "To: $to\r\n";
        $message .= "Subject: $subject\r\n";
        $message .= "MIME-Version: 1.0\r\n";
        $message .= "Content-Type: text/html; charset=UTF-8\r\n";
        $message .= "\r\n";
        $message .= $body;
        $message .= "\r\n.\r\n";

        fputs($socket, $message);
        $dataResponse = fgets($socket, 515);

        // QUIT
        fputs($socket, "QUIT\r\n");
        fclose($socket);

        return substr($dataResponse, 0, 3) == '250';

    } catch (Exception $e) {
        error_log("SMTP Error: " . $e->getMessage());
        return false;
    }
}

/**
 * Send OTP email
 */
function sendOtpEmail($email, $otp)
{
    $subject = 'Your PaperCraft Login Code';

    $body = '
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 500px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #000; }
            .logo { font-size: 24px; font-weight: 900; text-transform: uppercase; }
            .content { padding: 30px 0; text-align: center; }
            .otp-code { font-size: 36px; font-weight: 900; letter-spacing: 8px; padding: 20px; background: #f5f5f5; margin: 20px 0; }
            .footer { font-size: 12px; color: #666; text-align: center; padding-top: 20px; border-top: 1px solid #eee; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">PaperCraft</div>
            </div>
            <div class="content">
                <h2>Your Login Code</h2>
                <p>Use the following code to complete your login:</p>
                <div class="otp-code">' . $otp . '</div>
                <p>This code expires in 10 minutes.</p>
                <p style="color: #666; font-size: 12px;">If you didn\'t request this code, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>&copy; ' . date('Y') . ' PaperCraft. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>';

    return sendMail($email, $subject, $body);
}
