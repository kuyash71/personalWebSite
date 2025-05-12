<!DOCTYPE html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ad Soyad - Kişisel Site</title>
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
  <body class="loginBody">
    <!-- ✅ NAVBAR BURAYA EKLENİR -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark loginNavBar fixed-top">
      <div class="overlay"></div>
      <div class="container-fluid">
        <a class="navbar-brand ps-2" href="index.html"
          ><i class="bi bi-box-arrow-in-right me-3 fs-5"></i>Giriş Sayfası</a
        >
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="mainNavbar">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" href="index.html">Hakkımda</a>
            </li>
            <li class="nav-item"><a class="nav-link" href="cv.html">CV</a></li>
            <li class="nav-item">
              <a class="nav-link" href="sehir.html">Şehrim</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="ilgi.html">İlgi Alanlarım</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="contact.php">İletişim</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="login.php">Giriş</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- ✅ NAVBAR SABİT OLDUĞU İÇİN ALTA BOŞLUK BIRAK -->
    <div class="container" style="padding-top: 70px">
      <!-- Buraya sayfa içeriğin gelecek -->
      <h1>Hoş Geldiniz!</h1>
      <p>Bu sayfa hakkında bilgiler burada olacak.</p>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
  </body>
</html>
