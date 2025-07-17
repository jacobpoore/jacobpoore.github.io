<?php
// contact.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    $name = htmlspecialchars($data["name"]);
    $email = htmlspecialchars($data["email"]);
    $subject = htmlspecialchars($data["subject"]);
    $message = htmlspecialchars($data["message"]);

    // Simple validation (optional)
    if (!$name || !$email || !$subject || !$message) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "All fields are required."]);
        exit;
    }

    $to = "jpoore@wesleyan.edu";
    $headers = "From: $name <$email>\r\n";
    $body = "Subject: $subject\n\nMessage:\n$message\n\nFrom: $name <$email>";

    if (mail($to, "New Contact Form Message: $subject", $body, $headers)) {
        echo json_encode(["status" => "success"]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to send email."]);
    }
}
