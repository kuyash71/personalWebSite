/* validation.js – iki faktörlü (JS + Vue) doğrulama                 */
/* -------------- KÜRESEL DURUM ----------------------------------- */
let jsValid = false;
let vueValid = false;

function updateSubmitState() {
  const btn = document.getElementById("submitBtn");
  if (btn) btn.disabled = !(jsValid && vueValid);
}

/* -------------- YUMUŞAK KAYDIRMA -------------------------------- */
function smoothScrollTo(targetY, duration = 300) {
  const startY = window.pageYOffset;
  const distance = targetY - startY;
  let startTime = null;
  function step(ts) {
    if (startTime === null) startTime = ts;
    const p = Math.min((ts - startTime) / duration, 1);
    const eased = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
    window.scrollTo(0, startY + distance * eased);
    if (p < 1) window.requestAnimationFrame(step);
  }
  window.requestAnimationFrame(step);
}

/* -------------- VUE ↔ JS KÖPRÜ FONKSİYONLARI -------------------- */
function resetVueErrors() {
  if (window.vueApp && typeof window.vueApp.resetVue === "function") {
    window.vueApp.resetVue();
  }
}
window.clearJSErrors = () => {}; // Vue tarafı dolduracak

/* -------------- KLASİK-JS DOĞRULAMA ----------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("iletisimID");
  const validateBtn = document.getElementById("js_validationBtn");
  const vueBtn = document.getElementById("vueValidateBtn");
  const resetBtn = document.getElementById("resetBtn");

  /* -- Alan kuralları -- */
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
      message: "Telefon 11 haneli olmalıdır.",
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
      isGroup: true,
      validate: (g) => !!g.querySelector('input[name="cevap_turu"]:checked'),
      message: "Cevap türünü seçiniz.",
    },

    {
      el: document.getElementById("githubAdress"),
      validate: (v) => {
        const t = v.trim();
        return (
          t === "" ||
          /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+(\/.*)?$/.test(t)
        );
      },
      message: "Geçerli GitHub URL'si giriniz (https://github.com/...).",
    },

    {
      el: document.getElementById("beklenentarih"),
      validate: (v) => {
        if (!v) return false;
        const sel = new Date(v);
        sel.setHours(0, 0, 0, 0);
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return sel > now;
      },
      message: "Tarih bugün veya geçmiş olamaz.",
    },

    {
      el: document.getElementById("saat"),
      validate: (v) => /^([01]\d|2[0-3]):[0-5]\d$/.test(v),
      message: "Saat HH:MM formatında olmalıdır.",
    },
  ];

  /* -- Hata temizleme -- */
  function clearErrors() {
    form.querySelectorAll(".error-message").forEach((e) => e.remove());
    form
      .querySelectorAll(".has-error")
      .forEach((e) => e.classList.remove("has-error"));
  }
  window.clearJSErrors = clearErrors; // Vue tarafı çağırabilsin

  /* -- Sadece bayrak & mesajları sıfırla (form verisine dokunma) -- */
  function resetFlags() {
    jsValid = false;
    vueValid = false;
    clearErrors();
    validateBtn.disabled = false;
    vueBtn.disabled = false;
    updateSubmitState();
  }

  /* -- Formu tamamen sıfırla (Temizle butonu) -- */
  function resetAll() {
    form.reset();
    resetVueErrors();
    resetFlags();
  }

  /* Olay bağlayıcıları */
  resetBtn.addEventListener("click", resetAll);
  form.addEventListener("input", resetFlags);
  form.addEventListener("change", resetFlags);

  /* -- Hata baloncuğu -- */
  function showError({ el, message }) {
    const cont = el.closest(".form-group") || el;
    cont.classList.add("has-error");
    const span = document.createElement("span");
    span.className = "error-message";
    span.textContent = message;
    cont.appendChild(span);
    return cont;
  }

  /* -- “JS ile Doğrula” -- */
  validateBtn.addEventListener("click", () => {
    resetVueErrors(); // Eski Vue hatalarını sil
    clearErrors(); // Eski JS hatalarını sil

    let ok = true,
      firstErr = null;
    fields.forEach((cfg) => {
      const valid = cfg.isGroup
        ? cfg.validate(cfg.el)
        : cfg.validate(cfg.el.value);
      if (!valid) {
        ok = false;
        const cnt = showError(cfg);
        if (!firstErr) firstErr = cnt;
      }
    });

    jsValid = ok;
    updateSubmitState();

    if (!ok && firstErr) {
      const y = firstErr.getBoundingClientRect().top + window.pageYOffset - 120;
      smoothScrollTo(y, 300);
      const f = firstErr.querySelector("input,select,textarea");
      f && f.focus({ preventScroll: true });
    }
  });
});

/* ───────── VUE DOĞRULAMA ───────── */
const { createApp, reactive, ref, computed, nextTick } = Vue;

const vueApp = createApp({
  setup() {
    /* ---- Reaktif Form ---- */
    const form = reactive({
      adsoyad: "",
      email: "",
      telefon: "",
      konu: "",
      mesaj: "",
      cevap_turu: "",
      beklenentarih: "",
      saat: "",
      github: "",
    });

    const tried = ref(false);
    const canSubmit = ref(false);

    /* ---- Kurallar ---- */

    const githubValid = computed(() => {
      const url = form.github.trim();
      return (
        url === "" ||
        /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+(\/.*)?$/.test(url)
      );
    });

    const adValid = computed(() => !!form.adsoyad.trim());
    const emailValid = computed(() =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    );
    const telValid = computed(() => /^\d{11}$/.test(form.telefon));
    const konuValid = computed(() => !!form.konu.trim());
    const mesajValid = computed(() => !!form.mesaj.trim());
    const cevapValid = computed(() => !!form.cevap_turu);
    const tarihValid = computed(() => {
      if (!form.beklenentarih) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const pick = new Date(form.beklenentarih);
      return pick > today;
    });
    const saatValid = computed(() => !!form.saat);

    const allValid = computed(
      () =>
        adValid.value &&
        emailValid.value &&
        telValid.value &&
        konuValid.value &&
        mesajValid.value &&
        cevapValid.value &&
        tarihValid.value &&
        saatValid.value &&
        githubValid.value
    );

    /* ---- JS’deki hataları sil ---- */
    function clearJsSide() {
      if (typeof window.clearJSErrors === "function") window.clearJSErrors();
    }

    /* ---- Vue Doğrula ---- */
    function runValidation() {
      clearJsSide();
      tried.value = true;
      vueValid = allValid.value;
      canSubmit.value = vueValid;
      updateSubmitState();

      nextTick(() => {
        // DOM güncellensin, sınıflar eklensin
        if (vueValid) return; // her şey tamamsa gerek yok

        const formEl = document.getElementById("iletisimID");
        const firstBad = formEl.querySelector(".is-invalid");
        if (!firstBad) return;

        const container = firstBad.closest(".form-group") || firstBad;
        const y =
          container.getBoundingClientRect().top + window.pageYOffset - 120; // üstte 120 px boşluk
        smoothScrollTo(y, 300); // JS fonksiyonunu kullan

        firstBad.focus({ preventScroll: true });
      });
    }

    /* ---- Vue Hatalarını sıfırla (JS çağırır) ---- */
    function resetVue() {
      tried.value = false;
      canSubmit.value = false;
    }

    /* ---- Form Submit ---- */
    function handleSubmit() {
      if (jsValid && vueValid && allValid.value) {
        console.log("Form verileri ⇒", { ...form });
        alert("Form başarıyla gönderildi 🚀");
      }
    }

    return {
      form,
      tried,
      canSubmit,
      adValid,
      emailValid,
      telValid,
      konuValid,
      mesajValid,
      cevapValid,
      tarihValid,
      saatValid,
      githubValid,
      runValidation,
      handleSubmit,
      resetVue,
    };
  },
}).mount("#app");
window.vueApp = vueApp; // JS tarafının erişebilmesi için
