<?php
session_start();
require_once __DIR__ . '/include/config.php';

// Form POST edilmemişse giriş sayfasına geri dön
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: login.html');
    exit;
}

// Form verilerini al + basit doğrulama
$email         = trim($_POST['email']    ?? '');
$passwordInput =       $_POST['sifre']?? '';

if ($email === '' || $passwordInput === '') {
    echo '<h2 style="color:red;">E-posta ve şifre alanları boş bırakılamaz.</h2>';
    exit;
}

/**
 * Hazır sorgu (prepared statement) – mysqlnd gerekmez
 * Sütun adlarını kendi tablonuza göre güncelleyin (ör. -> sifre/email)
 */
$stmt = $conn->prepare(
    'SELECT id, sifre    /* şifre hash’i */ 
     FROM users          /* tablo adı    */
     WHERE email = ? 
     LIMIT 1'
);
$stmt->bind_param('s', $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 1) {
    $stmt->bind_result($userId, $passwordHash);
    $stmt->fetch();

    // Şifre doğrulama
    if (password_verify($passwordInput, $passwordHash)) {
        // Başarılı → oturum değişkenleri
        $_SESSION['user_id']    = $userId;
        $_SESSION['user_email'] = $email;

        header('Location: mesaj_panel.php');
        exit;
    } else {
        echo '<h2 style="color:red;">Hatalı şifre girdiniz.</h2>';
    }
} else {
    echo '<h2 style="color:red;">Bu e-posta adresiyle kullanıcı bulunamadı.</h2>';
}

$stmt->close();
$conn->close();
?>
