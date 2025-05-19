// login-popup.js

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get("welcome");
  const error = urlParams.get("error");

  if (username) {
    Swal.fire({
      title: "Hoşgeldiniz!",
      text: username,
      icon: "success",
      confirmButtonText: "Devam Et",
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then(() => {
      window.location.href = "mesaj_panel.php";
    });
  }

  if (error === "wrongpass") {
    Swal.fire({
      title: "Hatalı Şifre!",
      text: "Girdiğiniz şifre yanlış.",
      icon: "error",
      confirmButtonText: "Tekrar Dene",
    });
  }

  if (error === "notfound") {
    Swal.fire({
      title: "Kullanıcı Bulunamadı!",
      text: "Bu e-posta veya kullanıcı adına sahip bir hesap yok.",
      icon: "warning",
      confirmButtonText: "Tekrar Dene",
    });
  }
});
