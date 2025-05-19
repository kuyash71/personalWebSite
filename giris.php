<?php
session_start();
require_once __DIR__ . '/include/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: login.html');
    exit;
}

$giris         = trim($_POST['email'] ?? '');
$passwordInput = $_POST['sifre']     ?? '';

if ($giris === '' || $passwordInput === '') {
    echo '<h2 style="color:red;">E-posta / kullanıcı adı ve şifre boş bırakılamaz.</h2>';
    exit;
}

$stmt = $conn->prepare(
    'SELECT id, email, kullaniciadi, sifre 
     FROM users 
     WHERE email = ? OR kullaniciadi = ?
     LIMIT 1'
);
$stmt->bind_param('ss', $giris, $giris);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 1) {
    $stmt->bind_result($userId, $userEmail, $username, $passwordHash);
    $stmt->fetch();

    if (password_verify($passwordInput, $passwordHash)) {
        $_SESSION['user_id']    = $userId;
        $_SESSION['user_email'] = $userEmail;
        $_SESSION['username']   = $username;

        // login.html sayfasına yönlendirme + hoş geldin mesajı için GET parametresi
        header("Location: login.html?welcome=" . urlencode($username));
        exit;
    } else {
        header("Location: login.html?error=wrongpass");
        exit;
    }
} else {
    header("Location: login.html?error=notfound");
    exit;
}

$stmt->close();
$conn->close();
?>
