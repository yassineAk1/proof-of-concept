# Funda – Proof of Concept

Dit is mijn proof of concept voor sprint 12: een nagebouwde woningdetailpagina van Funda. Op de pagina bekijk je een woning, blader je door de foto's, lees je de kenmerken en bewaar je een huis als favoriet zodat je het later terugvindt.

Alle woningen komen uit de [Directus-database van FDND](https://fdnd-agency.directus.app/items/f_houses). Daar haal ik per woning de gegevens en foto's uit, en de favorietenknop schrijft terug naar een lijst in diezelfde database.

Mijn focus lag bij het bouwen op progressive enhancement. Ik ben begonnen met een pagina die volledig werkt op alleen HTML met server-side rendering, en heb daar pas daarna CSS en JavaScript als extra lagen overheen gelegd. Zo blijft alles bruikbaar, ook wanneer JavaScript wegvalt of een browser iets niet aankan. Daarnaast lette ik op responsiveness, toegankelijkheid en snelheid, wat ik met tests heb onderbouwd (zie [Toegankelijkheid](#toegankelijkheid)). Technisch draait het op NodeJS met Express, Liquid voor de templates en JSON als data, plus een service worker die de site tot een installeerbare webapp maakt.

#### Over Funda
Funda kent bijna iedereen die weleens een huis heeft gezocht: het is in Nederland hét platform voor koop- en huurwoningen. Elke woning heeft er een eigen pagina met foto's, kenmerken en de makelaar erbij. Juist die detailpagina vond ik interessant om na te maken, omdat er veel interactie in zit.

## Inhoudsopgave

  * [Beschrijving](#beschrijving)
  * [Gebruik](#gebruik)
  * [Toegankelijkheid](#toegankelijkheid)
  * [Kenmerken](#kenmerken)
  * [Installatie](#installatie)
  * [Bronnen](#bronnen)
  * [Licentie](#licentie)

## Beschrijving

Mijn uitgangspunt was de detailpagina van één woning. Voordat ik ging bouwen heb ik eerst een [sitemap met de routes en endpoints](https://github.com/yassineAk1/proof-of-concept/issues/2) en [wireframes](https://github.com/yassineAk1/proof-of-concept/issues/3) gemaakt, en de pagina opgezet als één lange kolom in HTML. Daarna kwam de huisstijl erbij, en als laatste de interactie.

De site heeft inmiddels vier pagina's:
- het overzicht met alle woningen
- de detailpagina van een woning
- de favorietenpagina
- een offline-pagina, voor als er geen verbinding is

<img width="2505" height="2116" alt="mobile-mockup" src="https://github.com/user-attachments/assets/a8616232-f217-4d1c-ac86-0092115b16a0" />


>_De detailpagina op mobiel_

<br>
<img width="2209" height="2253" alt="ipad-mockup" src="https://github.com/user-attachments/assets/2886a9f6-ace3-49de-a8f7-ff246e19692f" />


>_Dezelfde pagina op tablet_

Bekijk de live versie: _[https://proof-of-concept-r0dm.onrender.com]_

## Gebruik

**User story:** Als woningzoeker wil ik een woning kunnen bekijken, door de foto's bladeren en de woning bewaren als favoriet, zodat ik 'm later makkelijk terugvind.

Ik licht er drie interacties uit.

### Een woning bewaren
Bewaren loopt via een gewoon formulier dat een POST naar de server stuurt; die werkt de favorietenlijst bij. Daardoor werkt het ook zonder JavaScript. Staat JavaScript aan, dan vang ik de actie af en handel ik 'm zonder herladen af met `fetch`, met een melding ("Je huis is bewaard") en een animatie op het hartje als bevestiging.





https://github.com/user-attachments/assets/83ae8b66-e1fc-46c2-a2d1-f83e9578ce56





### Foto's bekijken en vergroten
De foto's staan in een carrousel waar je doorheen swipet. Vergroten gebeurt waar het kan met de Fullscreen API. Op iOS werkt die API niet voor afbeeldingen, dus daar heb ik een terugvaloptie gebouwd met het native `<dialog>`-element: een schermvullende weergave waarin je net zo goed door de foto's kunt blijven swipen.



https://github.com/user-attachments/assets/8aba55ee-68be-4226-817d-61204b67ea6c




### Een woning delen
Voor delen heb ik een popover gemaakt met opties voor WhatsApp, Facebook, X en Pinterest, plus een knop om de link te kopiëren. Die knop verandert na het kopiëren in een vinkje, zodat je ziet dat het gelukt is.



https://github.com/user-attachments/assets/8fd4d2ab-d95b-487b-b36b-d4b98e66befa


## Toegankelijkheid

Ik heb mijn werk op meerdere manieren getest en wat eruit kwam ook echt aangepast. Alles staat uitgewerkt in issues:

- In de [user test](https://github.com/yassineAk1/proof-of-concept/issues/43) liet ik een medestudent de pagina op mobiel gebruiken aan de hand van een scenario.
- Het [test-issue](https://github.com/yassineAk1/proof-of-concept/issues/46) bundelt de HTML-validatie, een Lighthouse-controle op toegankelijkheid en performance, en tests op echte toestellen en browsers (iPhone, iPad, een Galaxy in Firefox en een Pixel in Edge).
- Wat ik tegenkwam heb ik verwerkt: na de performance-test foto's verkleind en `preconnect` toegevoegd, en na de toegankelijkheidscheck het contrast verbeterd en verborgen labels voor screenreaders toegevoegd.

## Kenmerken
<!-- Bij Kenmerken staat welke technieken zijn gebruikt en hoe. -->

Hieronder per techniek wat ik heb gebruikt en waarvoor.

### HTML
De pagina is opgebouwd met betekenisvolle HTML, zodat de structuur ook zonder CSS of JavaScript klopt. Bewaren gaat via een echt formulier (`<form method="post">`), waardoor de belangrijkste functie blijft werken als JavaScript uitstaat. Voor het vergroten van foto's leun ik op het `<dialog>`-element en voor het deelmenu op de Popover API, allebei ingebouwde browserfeatures.

### CSS
De styling is mobile-first: ik begin smal en breid met media queries uit naar tablet en desktop. De fotostrook is een carrousel met scroll-snap die op grotere schermen een grid wordt. Verder gebruik ik custom properties voor kleuren, een duidelijke `:focus-visible`-rand voor wie met het toetsenbord navigeert, en houd ik rekening met voorkeuren via `prefers-reduced-motion` en `hover: hover`.

### JavaScript
Alle JavaScript zit bovenop een al werkende basis. Het bewaren handel ik zonder herladen af met `fetch` en een melding, en met feature detection toon ik enhancements alleen als de browser ze ondersteunt: ontbreekt de Fullscreen API (zoals op iOS), dan val ik terug op de `<dialog>`-lightbox. Ook het delen en het kopiëren van de link lopen via JavaScript.

### NodeJS en Express
De pagina's render ik server-side met Express en Liquid. In [`server.js`](https://github.com/yassineAk1/proof-of-concept/blob/main/server.js) haal ik de woningen op uit de Directus REST API en stuur ik kant-en-klare HTML terug. Een favoriet bewaren gaat met een POST naar mijn server, die de lijst bij Directus aanpast met een PATCH en daarna terugstuurt naar de pagina, zodat een refresh niet per ongeluk dubbel post.

### Service worker (PWA)
Met een manifest en een [service worker](https://github.com/yassineAk1/proof-of-concept/blob/main/public/sw.js) is de site te installeren als app. De service worker zet de app-shell vast in de cache en kiest per verzoek een aanpak: pagina's eerst van het netwerk, en afbeeldingen, fonts, CSS en JS eerst uit de cache. Zonder verbinding kom je op een offline-pagina terecht.

## Installatie

Wil je lokaal aan dit project werken, dan kan dat zo:

1. Installeer [NodeJS](https://nodejs.org/en/download) (de LTS-versie).
2. Fork en clone deze repository en open de map in je editor.
3. Draai `npm install` om de dependencies (Express en LiquidJS) binnen te halen.
4. Start met `npm start` en ga naar `http://localhost:8000`. Tijdens het ontwikkelen herstart `npm run dev` automatisch bij elke wijziging.

## Bronnen
- [Directus-database van FDND](https://fdnd-agency.directus.app/items/f_houses)
- [Liquid Markup - @Modyo Docs](https://docs.modyo.com/en/platform/channels/liquid-markup.html)
- [`<dialog>` element - @MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog)
- [Building a lightbox with the Dialog element - @Polypane](https://polypane.app/blog/building-a-lightbox-with-the-dialog-element/)
- [Fullscreen API - @MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API)
- [CSS scroll snap - @MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap)
- [Popover API - @MDN](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)
- [Web Share API - @MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API)
- [Learn PWA - @web.dev](https://web.dev/learn/pwa/)
- [prefers-reduced-motion - @MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

## Licentie

This project is licensed under the terms of the [MIT license](./LICENSE).
