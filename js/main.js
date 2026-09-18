function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  if (window.scrollY > 40) {
    nav.style.background = 'rgba(5,5,10,0.98)';
  } else {
    nav.style.background = 'rgba(5,5,10,0.85)';
  }
});

// ===== Scroll reveal animations =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => {
  revealObserver.observe(el);
});

// ===== Lightbox for project mockups =====
function openLightbox(src, alt) {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = `<img src="${src}" alt="${alt}"><button class="lightbox-close" aria-label="Fermer">✕</button>`;
  overlay.addEventListener('click', () => overlay.remove());
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('open'));
}

document.querySelectorAll('[data-lightbox]').forEach((el) => {
  el.addEventListener('click', () => {
    const img = el.querySelector('img');
    openLightbox(img.src, img.alt);
  });
});

document.querySelectorAll('[data-lightbox-trigger]').forEach((el) => {
  el.addEventListener('click', () => {
    const img = el.closest('.work-case')?.querySelector('.work-preview img');
    if (img) openLightbox(img.src, img.alt);
  });
});

// ===== Fade the "scroll for more" hint once the user scrolls a preview =====
document.querySelectorAll('.work-preview').forEach((el) => {
  el.addEventListener('scroll', () => {
    if (el.scrollTop > 12) {
      el.classList.add('scrolled');
    } else {
      el.classList.remove('scrolled');
    }
  }, { passive: true });
});

function showError(text) {
  const err = document.getElementById('errorMsg');
  err.textContent = text;
  err.style.display = 'block';
  setTimeout(() => { err.style.display = 'none'; }, 6000);
}

async function submitContactForm(event) {
  event.preventDefault();

  const name = document.getElementById('cName').value.trim();
  const email = document.getElementById('cEmail').value.trim();
  const project = document.getElementById('cProject').value.trim();
  const message = document.getElementById('cMessage').value.trim();

  if (!name || !email || !message) {
    showError('Merci de remplir au moins ton nom, ton email et un message.');
    return;
  }

  const btn = document.querySelector('#contactForm .submit-btn');
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Envoi en cours…';

  try {
    const res = await fetch('https://formsubmit.co/ajax/sadibousow11@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _subject: 'Nouveau message depuis sadiloop.com',
        Nom: name,
        Email: email,
        'Type de projet': project || 'Non précisé',
        Message: message
      })
    });

    if (!res.ok) throw new Error('Request failed');

    document.getElementById('contactForm').reset();
    document.getElementById('successMsg').style.display = 'block';
    setTimeout(() => { document.getElementById('successMsg').style.display = 'none'; }, 8000);
  } catch (err) {
    console.error(err);
    showError("Quelque chose s'est mal passé. Écris-moi directement à sadibousow11@gmail.com.");
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
}
