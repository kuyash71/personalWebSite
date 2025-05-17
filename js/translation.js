document.addEventListener("DOMContentLoaded", () => {
  const sw = document.getElementById("langSwitch");
  const label = document.getElementById("switchLabel");
  // Daha önce seçilmiş dil varsa al, yoksa 'tr'
  let current = localStorage.getItem("siteLang") || "tr";

  // Switch ve label başlangıç ayarları
  sw.checked = current === "en";
  label.textContent = current.toUpperCase();
  // İlk yüklemede sayfayı çevir
  updateLanguage(current);

  // Toggling
  sw.addEventListener("change", () => {
    current = sw.checked ? "en" : "tr";
    label.textContent = current.toUpperCase();
    updateLanguage(current);
    // Sayfa yenilense bile dil tercihini koru
    localStorage.setItem("siteLang", current);
  });
});

function updateLanguage(lang) {
  // HTML etiketinin lang özniteliğini güncelle (SEO + erişilebilirlik için)
  document.documentElement.lang = lang;
  // translations global objesinden seçilen dili al
  const dict = window.translations[lang] || {};
  // sayfadaki tüm data-i18n'li elemanları dolaş
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    // eğer karşılığı varsa güncelle, yoksa olduğu gibi bırak
    if (dict[key]) el.textContent = dict[key];
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const sw = document.getElementById("langSwitch");
  const lbl = document.getElementById("switchLabel");

  sw.addEventListener("change", () => {
    if (sw.checked) {
      lbl.textContent = "EN";
      // Eğer i18n kullanıyorsanız:
      if (window.i18n) i18n.changeLanguage("en");
    } else {
      lbl.textContent = "TR";
      if (window.i18n) i18n.changeLanguage("tr");
    }
  });
});

// Cookie ayarlama fonksiyonu
function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie =
    name +
    "=" +
    encodeURIComponent(value) +
    "; expires=" +
    expires +
    "; path=/";
}

// Cookie okuma fonksiyonu
function getCookie(name) {
  return document.cookie.split("; ").reduce((r, kv) => {
    const [key, val] = kv.split("=");
    return key === name ? decodeURIComponent(val) : r;
  }, "");
}

// Dil değiştiğinde:
setCookie("siteLang", currentLang, 365);

// Sayfa yüklenirken:
let currentLang = getCookie("siteLang") || "tr";
