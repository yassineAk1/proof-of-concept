import express, { response } from 'express'
import { Liquid } from 'liquidjs';

const app = express()

app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))

const engine = new Liquid()
app.engine('liquid', engine.express())

app.set('views', './views')

app.get('/', async function (request, response) {
  const housesResponse = await fetch('https://fdnd-agency.directus.app/items/f_houses?fields=id,street,house_nr,nr_addition,postal_code,city,price,m2,m2_garden,rooms,agent,gallery.directus_files_id,poster_image.id')
  const housesJSON = await housesResponse.json()

  const houses = housesJSON.data.map(huis => {
    huis.priceFormatted = huis.price.toLocaleString('nl-NL')
    if (huis.gallery[0]) {
      huis.thumbnail = huis.gallery[0].directus_files_id
    } else if (huis.poster_image) {
      huis.thumbnail = huis.poster_image.id
    }
    return huis
  })

  response.render('overzicht.liquid', {houses})
})

app.get('/huis/:id', async function (request, response) {
  const id = request.params.id

  const houseResponse = await fetch(`https://fdnd-agency.directus.app/items/f_houses/${id}?fields=*.*`)
  const houseResponseJSON = await houseResponse.json()
  const house = houseResponseJSON.data

  let images = []
  if (house.gallery.length > 0) {
    images = house.gallery.map(galleryImages => galleryImages.directus_files_id)
  } else if (house.poster_image) {
    images = [house.poster_image.id]
  }

  const listResponse = await fetch('https://fdnd-agency.directus.app/items/f_list/26?fields=*.*')
  const listJSON = await listResponse.json()
  const isFavoriet = listJSON.data.houses.some(huis => huis.f_houses_id === Number(id))

  const priceFormatted = house.price.toLocaleString('nl-NL')
  const pricePerM2 = Math.round(house.price / house.m2).toLocaleString('nl-NL')
  const listedDate = new Date(house.listed_date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })

  response.render('index.liquid', {house, images, isFavoriet, priceFormatted, pricePerM2, listedDate})
})

app.post('/huis/:id', async function (request, response) {
  const id = Number(request.params.id)

  const listResponse = await fetch('https://fdnd-agency.directus.app/items/f_list/26?fields=*.*')
  const listJSON = await listResponse.json()
  const inLijst = listJSON.data.houses.find(h => h.f_houses_id === id)

  if (inLijst) {
    await fetch('https://fdnd-agency.directus.app/items/f_list/26', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ houses: { delete: [inLijst.id] } })
    })
  } else {
    await fetch('https://fdnd-agency.directus.app/items/f_list/26', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ houses: { create: [{ f_houses_id: id }] } })
    })
  }

  response.redirect(`/huis/${id}`)
})


app.get('/favorieten', async function (request, response) {
  const listResponse = await fetch('https://fdnd-agency.directus.app/items/f_list/26?fields=houses.f_houses_id.*,houses.f_houses_id.gallery.directus_files_id')
  const listJSON = await listResponse.json()

  const favorieten = listJSON.data.houses

  for (const favoriet of favorieten) {
    const huis = favoriet.f_houses_id

    huis.priceFormatted = huis.price.toLocaleString('nl-NL')
  }

  response.render('favorieten.liquid', {favorieten})
})


// Offline-fallback: de service worker precachet deze pagina en serveert 'm zonder netwerk.
app.get('/offline', function (request, response) {
  response.render('offline.liquid')
})


app.set('port', process.env.PORT || 8000)

// Start Express op, gebruik daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  console.log(`Project draait via http://localhost:${app.get('port')}`)
})