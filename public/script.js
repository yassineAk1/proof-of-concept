const paginaUrl = encodeURIComponent(window.location.href);

document.getElementById('share-whatsapp').href  = 'https://wa.me/?text=' + paginaUrl;
document.getElementById('share-facebook').href  = 'https://www.facebook.com/sharer/sharer.php?u=' + paginaUrl;
document.getElementById('share-x').href         = 'https://twitter.com/intent/tweet?url=' + paginaUrl;
document.getElementById('share-pinterest').href = 'https://pinterest.com/pin/create/button/?url=' + paginaUrl;

const kopierenKnop = document.querySelector('.share-copy');
const kopierenIcoon = kopierenKnop.querySelector('img');

kopierenKnop.addEventListener('click', function() {
  navigator.clipboard.writeText(window.location.href);
  kopierenIcoon.src = '/icons/check-bold@2x.svg';
});
