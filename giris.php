<?php
// Veritabanı bağlantısı
$host = 'localhost';
$veritabani = 'ismailfatihcolak_com__users';
$kullanici = 'ismailfatihcolak_com_users_ismai_admin';
$sifre = '1590iso7161A-Z'; // Burayı kendi şifrenle değiştir

$conn = new mysqli($host, $kullanici, $sifre, $veritabani);
$conn->set_charset("utf8");

if ($conn->connect_error) {
    die("Bağlantı hatası: " . $conn->connect_error);
}

// Form verilerini al
$email = $_POST['email'] ?? '';
$sifreGirilen = $_POST['sifre'] ?? '';

// SQL ile kullanıcıyı veritabanından çek
$sql = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $kullanici = $result->fetch_assoc();

    // 🔐 Güvenli şifre karşılaştırması
    if (password_verify($sifreGirilen, $kullanici['sifre'])) {
        echo "<h2 style='color:green;'>Giriş başarılı! Hoş geldiniz, {$kullanici['email']}.</h2>";
        // header("Location: panel.php");
    } else {
        echo "<h2 style='color:red;'>Hatalı şifre.</h2>";
    }
} else {
    echo "<h2 style='color:red;'>Kullanıcı bulunamadı.</h2>";
}

$conn->close();
?>
