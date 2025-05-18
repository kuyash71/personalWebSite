<?php
require_once __DIR__ . '/include/config.php';

// Yardımcı fonksiyon
function field($key) {
    return isset($_POST[$key]) && $_POST[$key] !== '' ? trim($_POST[$key]) : null;
}

// Zorunlu alanlar
$adsoyad = field('adsoyad');
$email   = field('email');
$konu    = field('konu');
$mesaj   = field('mesaj');

if (!$adsoyad || !$email || !$konu || !$mesaj) {
    exit('Zorunlu alanlar boş olamaz.');
}

// İsteğe bağlı alanlar
$telefon        = field('telefon');
$mesaj_turu     = field('mesaj_turu');
$etiketler      = isset($_POST['etiketler']) ? implode(',', $_POST['etiketler']) : null;
$cevap_turu     = field('cevap_turu');
$githubAdres    = field('githubAdres');
$aciliyet       = field('aciliyet');
$beklenen_tarih = field('beklenen_tarih');
$saat           = field('saat');

// Dosya işlemleri
$dosya_path = null;
if (!empty($_FILES['dosya']['name'])) {
    if ($_FILES['dosya']['error'] === UPLOAD_ERR_OK) {
        $ext = strtolower(pathinfo($_FILES['dosya']['name'], PATHINFO_EXTENSION));
        if ($ext !== 'zip') {
            exit('Sadece .zip dosyası yükleyebilirsiniz.');
        }

        $uploadDir = __DIR__ . '/uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $filename = uniqid('msg_', true) . '.zip';
        $targetPath = $uploadDir . $filename;

        if (move_uploaded_file($_FILES['dosya']['tmp_name'], $targetPath)) {
            $dosya_path = 'uploads/' . $filename;
        } else {
            exit('Dosya yüklenemedi.');
        }
    } else {
        exit('Dosya yüklenirken hata oluştu.');
    }
}

// Veritabanına ekle (mysqli)
$stmt = $conn->prepare("INSERT INTO contact_messages
    (adsoyad, email, telefon, konu, mesaj, mesaj_turu, etiketler, dosya,
     cevap_turu, githubAdres, aciliyet, beklenen_tarih, saat)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

$stmt->bind_param(
    'ssssssssssiss',
    $adsoyad,
    $email,
    $telefon,
    $konu,
    $mesaj,
    $mesaj_turu,
    $etiketler,
    $dosya_path,
    $cevap_turu,
    $githubAdres,
    $aciliyet,
    $beklenen_tarih,
    $saat
);

if ($stmt->execute()) {
    header('Location: contact.html?success=1');
    exit;
} else {
    error_log("MySQL Hatası: " . $stmt->error);
    die("Bir hata oluştu. Lütfen tekrar deneyin.");
}
?>
