<?php
require_once __DIR__ . '/include/config.php';

// Veritabanından tüm mesajları al
$sql = "SELECT * FROM contact_messages ORDER BY id DESC";
$result = $conn->query($sql);
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <title>İletişim Mesajları</title>
    <!-- Bootstrap Icons -->
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
    />
    <!-- Bootstrap CSS -->
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />

    <!-- Harici CSS -->
    <link rel="stylesheet" href="css/style.css" />
</head>
<body class="panelBody">

    <!-- DİL DOSYASI -->
    <script src="lang/lang.js"></script>

    <!-- ÇEVİRİ JS -->
    <script src="js/translation.js"></script>

    <!-- NAVBAR BURAYA EKLENİR -->
    <nav class="navbar navbar-expand-lg navbar-dark panelNavBar fixed-top">
      <div class="overlay"></div>
      <div class="container-fluid">
        <a class="navbar-brand ps-2" href="index.html">
          <i class="bi bi-chat-left-fill me-3"></i>
          <span data-i18n="panel_navbar_baslik">Mesaj Yönetim Paneli</span>
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="mainNavbar">
          <ul class="navbar-nav ms-auto d-flex align-items-center">
            <li class="nav-item">
              <a class="nav-link" href="index.html" data-i18n="panelBar_geridon"
                >Geri Dön</a
              >
            </li>
            <li class="nav-item ms-3">
              <div class="form-check form-switch mb-0">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="langSwitch"
                />
                <label
                  class="form-check-label ms-2 text-light"
                  for="langSwitch"
                  id="switchLabel"
                  >TR</label
                >
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- İÇERİK BAŞLANGIÇ -->
    <div class="container my-5 pt-5">
        <h1 class="mb-4 text-center" data-i18n="panel_baslik_mesajlar">Gönderilen Mesajlar</h1>

        <?php if ($result && $result->num_rows > 0): ?>
            <div class="accordion" id="mesajAccordion">
                <?php $i = 0; while($row = $result->fetch_assoc()): $i++; ?>
                    <div class="accordion-item mb-2">
                        <h2 class="accordion-header" id="heading<?= $i ?>">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse<?= $i ?>" aria-expanded="false" aria-controls="collapse<?= $i ?>">
                                <?= htmlspecialchars($row['adsoyad']) ?> - <?= htmlspecialchars($row['konu']) ?>
                            </button>
                        </h2>
                        <div id="collapse<?= $i ?>" class="accordion-collapse collapse" aria-labelledby="heading<?= $i ?>" data-bs-parent="#mesajAccordion">
                            <div class="accordion-body">
                                <div class="table-responsive">
                                    <table class="table table-bordered table-sm">
                                        <tbody>
                                            <tr><th data-i18n="panel_baslik_ID">ID</th><td><?= htmlspecialchars($row['id']) ?></td></tr>
                                            <tr><th data-i18n="panel_baslik_adsoyad">Ad Soyad</th><td><?= htmlspecialchars($row['adsoyad']) ?></td></tr>
                                            <tr><th data-i18n="panel_baslik_mail">Email</th><td><?= htmlspecialchars($row['email']) ?></td></tr>
                                            <tr><th data-i18n="panel_baslik_tel">Telefon</th><td><?= htmlspecialchars($row['telefon']) ?></td></tr>
                                            <tr><th data-i18n="panel_baslik_konu">Konu</th><td><?= htmlspecialchars($row['konu']) ?></td></tr>
                                            <tr><th data-i18n="panel_baslik_txt">Mesaj</th><td><?= nl2br(htmlspecialchars($row['mesaj'])) ?></td></tr>
                                            <tr><th data-i18n="panel_baslik_txt_tip">Mesaj Türü</th><td><?= htmlspecialchars($row['mesaj_turu']) ?></td></tr>
                                            <tr><th data-i18n="panel_baslik_etiketler">Etiketler</th><td><?= htmlspecialchars($row['etiketler']) ?></td></tr>
                                            <tr><th data-i18n="panel_baslik_dosya">Dosya</th>
                                                <td>
                                                    <?php if ($row['dosya']): ?>
                                                        <a href="<?= htmlspecialchars($row['dosya']) ?>" target="_blank">İndir</a>
                                                    <?php else: ?>
                                                        Yok
                                                    <?php endif; ?>
                                                </td>
                                            </tr>
                                            <tr><th data-i18n="panel_baslik_cvp_tip">Cevap Türü</th><td><?= htmlspecialchars($row['cevap_turu']) ?></td></tr>
                                            <tr><th data-i18n="panel_baslik_github">GitHub Adresi</th><td><?= htmlspecialchars($row['githubAdres']) ?></td></tr>
                                            <tr><th data-i18n="panel_baslik_aciliyet">Aciliyet</th><td><?= htmlspecialchars($row['aciliyet']) ?></td></tr>
                                            <tr><th data-i18n="panel_baslik_beklenti">Beklenen Tarih</th><td><?= htmlspecialchars($row['beklenen_tarih']) ?></td></tr>
                                            <tr><th data-i18n="panel_baslik_saat">Saat</th><td><?= htmlspecialchars($row['saat']) ?></td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <form method="post" action="delete_message.php" onsubmit="return confirm('Mesajı silmek istediğinize emin misiniz?');">
    <input type="hidden" name="id" value="<?= $row['id'] ?>">
    <button type="submit" class="btn btn-danger btn-sm mt-2" data-i18n="panel_buton_mesaj_sil">Mesajı Sil</button>
</form>

                            </div>
                        </div>
                    </div>
                <?php endwhile; ?>
            </div>
        <?php else: ?>
            <p class="text-center" data-i18n="panel_mesaj_bulunmamakta">Henüz mesaj bulunmamaktadır.</p>
        <?php endif; ?>
    </div>

    <!-- Bootstrap 5 JS CDN -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
