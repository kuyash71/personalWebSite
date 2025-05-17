// ────────── 1) Manuel Smooth Scroll Fonksiyonu ──────────
function smoothScrollTo(targetY, duration = 200) {
  const startY = window.pageYOffset;
  const distance = targetY - startY;
  let startTime = null;

  function step(timestamp) {
    if (startTime === null) startTime = timestamp;
    const time = timestamp - startTime;
    // easeInOutQuad
    const t = Math.min(time / duration, 1);
    const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    window.scrollTo(0, startY + distance * eased);

    if (time < duration) {
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);
}

// ────────── 2) DOM Hazır Olduğunda Çalış ──────────
document.addEventListener("DOMContentLoaded", function () {
  // Form ve buton referansları
  const form = document.getElementById("iletisimID");
  const validateBtn = document.getElementById("js_validationBtn");
  const submitBtn = document.getElementById("submitBtn");
  const resetBtn = document.getElementById("resetBtn");

  // Validasyon yapılacak alanlar ve kuralları
  const fields = [
    {
      el: document.getElementById("adsoyad"),
      validate: (v) => v.trim() !== "",
      message: "Ad Soyad boş bırakılamaz.",
    },
    {
      el: document.getElementById("email"),
      validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: "Geçerli bir e-posta giriniz.",
    },
    {
      el: document.getElementById("telefon"),
      validate: (v) => /^\d{11}$/.test(v.trim()),
      message:
        "Telefon numarası boş bırakılmış veya hatalı girilmiş. 11 Hane olacak.",
    },
    {
      el: document.getElementById("konu"),
      validate: (v) => v.trim() !== "",
      message: "Konu boş bırakılamaz.",
    },
    {
      el: document.getElementById("mesaj"),
      validate: (v) => v.trim() !== "",
      message: "Mesaj alanı boş bırakılamaz.",
    },
    {
      el: document.getElementById("mesaj_turu"),
      validate: (v) => v !== "",
      message: "Mesaj türünü seçiniz.",
    },
    {
      el: document.getElementById("cevap_group"),
      validate: (group) =>
        !!group.querySelector('input[name="cevap_turu"]:checked'),
      message: "Cevap türünü seçiniz.",
      isGroup: true,
    },
    {
      el: document.getElementById("githubAdress"),
      validate: (v) =>
        v === "" ||
        /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+(\/.*)?$/.test(
          v.trim()
        ),
      message: "Geçerli bir GitHub profili veya depo URL'si giriniz.",
    },
    {
      el: document.getElementById("beklenentarih"),
      validate: (v) => {
        if (!v) return false;
        const selected = new Date(v);
        const today = new Date();
        // saat/dakika farkını göz ardı etmek için yalnızca tarih kısmı
        selected.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        return selected > today;
      },
      message:
        "Beklenen tarih bugün veya geçmiş olamaz; lütfen ileri bir tarih seçin.",
    },
    {
      el: document.getElementById("saat"),
      validate: (v) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
      message: "Saat formatı HH:MM (00:00–23:59) şeklinde olmalı.",
    },
  ];

  // Eskiden kalma hata mesajlarını ve sınıfları temizler
  function clearErrors() {
    form.querySelectorAll(".error-message").forEach((el) => el.remove());
    form
      .querySelectorAll(".has-error")
      .forEach((el) => el.classList.remove("has-error"));
  }

  // Bir alana hata mesajı ekler, container'ı döner
  function showError(cfg) {
    const { el, message } = cfg;
    const container = el.closest(".form-group");

    // Eskisi varsa sil
    const prev = container.querySelector(".error-message");
    if (prev) prev.remove();

    // Yeni mesaj
    const span = document.createElement("span");
    span.className = "error-message";
    span.textContent = message;
    container.appendChild(span);
    container.classList.add("has-error");

    return container;
  }

  resetBtn.addEventListener("click", function () {
    form.reset();
    resetAllValidations();
    clearErrors();
  });

  // Validation butonuna tıklandığında
  validateBtn.addEventListener("click", function () {
    clearErrors();
    let isValid = true;
    let firstErrorContainer = null;

    fields.forEach((cfg) => {
      const ok = cfg.isGroup
        ? cfg.validate(cfg.el)
        : cfg.validate(cfg.el.value);

      if (!ok) {
        isValid = false;
        const errCnt = showError(cfg);
        if (!firstErrorContainer) firstErrorContainer = errCnt;
      }
    });

    if (isValid) {
      submitBtn.disabled = false;
    } else {
      submitBtn.disabled = true;

      // Hatalı alanın dikey pozisyonunu al
      const rect = firstErrorContainer.getBoundingClientRect();
      const targetY = rect.top + window.pageYOffset - 175; // 50px üst boşluk

      // Manuel smooth scroll
      smoothScrollTo(targetY, 1);

      // İsteğe bağlı: focus'u preventScroll ile yap
      const focusEl = firstErrorContainer.querySelector(
        "input, select, textarea"
      );
      if (focusEl) focusEl.focus({ preventScroll: true });
    }
  });

  // ────────── 9) Reset Mantığı ──────────
  function resetAllValidations() {
    // Yeniden JS ve Vue bayraklarını false yap
    jsValid = false;
    vueValid = false;
    // Tüm üç butonu enable et / disable et
    validateBtn.disabled = false;
    vueValidateBtn.disabled = false;
    submitBtn.disabled = true;
    // Sahada gösterilmiş eski hata mesajları varsa temizle
    clearErrors();
  }

  // 9.a) Sayfa yüklendiğinde reset et
  resetAllValidations();

  // 9.b) Formda herhangi bir değişiklik olduğunda reset et
  //      'input' ve 'change' olayları hem text hem seçim değişimlerini yakalar
  form.addEventListener("input", resetAllValidations);
  form.addEventListener("change", resetAllValidations);
});
