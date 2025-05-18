<?php
/**
 * Veritabanı bağlantı ayarları
 * --------------------------------
 * Aşağıdaki değerleri kendi Plesk veritabanı
 * kullanıcı adı / şifrenizle doldurun.
 */
define('DB_HOST', 'localhost');
define('DB_USER', 'XXXX');      // <-- Kendi DB kullanıcınız
define('DB_PASS', 'XXXX');  // <-- Kendi DB şifreniz
define('DB_NAME', 'XXXX');      // <-- Kendi veritabanı adınız

// Bağlantıyı oluştur
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
$conn->set_charset('utf8');

// Hata kontrolü
if ($conn->connect_errno) {
    error_log('Veritabanına bağlanılamadı: ' . $conn->connect_error);
    die('Sunucu hatası! Lütfen daha sonra tekrar deneyin.');
}
?>
