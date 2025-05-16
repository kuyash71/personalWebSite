<?php
// Ayarlar
$apiUrl = "https://api.football-data.org/v4/competitions/PL/standings";
$apiToken = "c4f4f1b3d1e5404a968857be394ffbb8"; // 🔐 Buraya kendi API anahtarını yaz

// cURL ile API'ye istek at
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "X-Auth-Token: $apiToken"
]);

$response = curl_exec($ch);
$httpStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Hata kontrolü
if ($httpStatus !== 200) {
    http_response_code($httpStatus);
    echo json_encode(["error" => "API bağlantısı başarısız"]);
    exit;
}

// İçeriği direkt olarak gönder (JSON formatında)
header("Content-Type: application/json");
echo $response;
