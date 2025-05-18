<?php
require_once __DIR__ . '/include/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = intval($_POST['id'] ?? 0);

    if ($id > 0) {
        // Mesajı veritabanından sil
        $stmt = $conn->prepare("DELETE FROM contact_messages WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
    }
}

// Silindikten sonra mesaj paneline geri dön
header("Location: mesaj_panel.php");
exit;
