// ---------- service worker registreren ----
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('Service worker registratie mislukt:', error);
    });
  });
}

// ----------foto gallerij  ----

const galerij = document.getElementById('foto-galerij');
const teller = document.querySelector('.foto-teller');
const huidigSpan = document.getElementById('foto-huidig');
const thumbnail = document.getElementById('thumbnail');
const fullscreenKnop = document.getElementById('fullscreen-knop');

if (galerij) {

teller.removeAttribute('hidden');

// Teller bijwerken bij elke scroll
galerij.addEventListener('scroll', () => {
  huidigSpan.textContent = Math.round(galerij.scrollLeft / galerij.offsetWidth) + 1;
});

// Fullscreen knop alleen zichtbaar als de browser het ondersteunt
if (document.fullscreenEnabled) {
  fullscreenKnop.removeAttribute('hidden');

  fullscreenKnop.addEventListener('click', () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      thumbnail.requestFullscreen();
    }
  });}
   else if (typeof HTMLDialogElement === 'function') {
  // bij geen Fullscreen API tik op een foto om die te vergroten in een dialog
  const fotoDialog = document.getElementById('foto-dialog');
  const fotoDialogGalerij = document.getElementById('foto-dialog-galerij');

  galerij.querySelectorAll('img').forEach((foto, index) => {
    foto.addEventListener('click', () => {
      fotoDialog.showModal();
      // opent de aangeklikte foto daarna kun je swipen
      fotoDialogGalerij.scrollLeft;
    });
  });
}

// ----------favoriet patch ----

const favorietForm = document.querySelector('.action-buttons form');
const favorietKnop = favorietForm.querySelector('button');

favorietForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  favorietKnop.disabled = true;

  const isFavoriet = favorietKnop.querySelector('img').src.includes('heart-filled-red');

  if (isFavoriet) {
    favorietKnop.innerHTML = `<img src="/icons/heart@2x.svg" alt="" width="24" height="24"><span class="visually-hidden">Voeg toe aan favorieten</span>`;
  } else {
    favorietKnop.innerHTML = `<img src="/icons/heart-filled-red@2x.svg" alt="" width="24" height="24"><span class="visually-hidden">Verwijder uit favorieten</span>`;
  }

  favorietKnop.querySelector('img').classList.add('hart-animatie');

  toonLikeMelding(!isFavoriet);

  await fetch(favorietForm.action, { method: 'POST' });
  favorietKnop.disabled = false;
});

// ----------favoriet melding ----

const likeMelding = document.getElementById('like-melding');
const likeMeldingTitel = document.getElementById('like-melding-titel');
const likeMeldingTekst = document.getElementById('like-melding-tekst');
const likeMeldingSluiten = document.getElementById('like-melding-sluiten');
let likeMeldingTimer;

function toonLikeMelding(bewaard) {
  if (bewaard) {
    likeMeldingTitel.textContent = 'Je huis is bewaard';
    likeMeldingTekst.innerHTML = `Je vindt 'm onder <a href="/favorieten">Favorieten</a> in je account`;
  } else {
    likeMeldingTitel.textContent = 'Je huis is verwijderd';
    likeMeldingTekst.textContent = 'Je hebt dit huis uit je favorieten gehaald';
  }

  likeMelding.classList.toggle('is-verwijderd', !bewaard);

  likeMelding.classList.remove('like-melding-verbergen');
  likeMelding.hidden = false;

  clearTimeout(likeMeldingTimer);
  likeMeldingTimer = setTimeout(verbergLikeMelding, 2000);
}

function verbergLikeMelding() {
  likeMelding.classList.add('like-melding-verbergen');
  likeMelding.addEventListener('animationend', () => {
    likeMelding.hidden = true;
    likeMelding.classList.remove('like-melding-verbergen');
  }, { once: true });
}

likeMeldingSluiten.addEventListener('click', verbergLikeMelding);

// ------------share popover ----
const paginaUrl = encodeURIComponent(window.location.href);

document.getElementById('share-whatsapp').href  = 'https://wa.me/?text=' + paginaUrl;
document.getElementById('share-facebook').href  = 'https://www.facebook.com/sharer/sharer.php?u=' + paginaUrl;
document.getElementById('share-x').href         = 'https://twitter.com/intent/tweet?url=' + paginaUrl;
document.getElementById('share-pinterest').href = 'https://pinterest.com/pin/create/button/?url=' + paginaUrl;

const kopierenKnop = document.querySelector('.share-copy');

kopierenKnop.addEventListener('click', () => {
  navigator.clipboard.writeText(window.location.href);
  kopierenKnop.querySelector('img').src = '/icons/check-bold@2x.svg';
});

}
