// ----------foto gallerij  ----

const galerij = document.getElementById('foto-galerij');
const teller = document.querySelector('.foto-teller');
const huidigSpan = document.getElementById('foto-huidig');
const thumbnail = document.getElementById('thumbnail');
const fullscreenKnop = document.getElementById('fullscreen-knop');

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
    favorietKnop.innerHTML = `<img src="/icons/heart@2x.svg" alt="" width="24" height="24">`;
  } else {
    favorietKnop.innerHTML = `<img src="/icons/heart-filled-red@2x.svg" alt="" width="24" height="24">`;
  }

  await fetch(favorietForm.action, { method: 'POST' });
  favorietKnop.disabled = false;
});

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
