import express, { response } from 'express'
import { Liquid } from 'liquidjs';

const app = express()

app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))

const engine = new Liquid()
app.engine('liquid', engine.express())

app.set('views', './views')

app.get('/', function (request, response) {
  response.redirect('/huis/40')
})

app.get('/huis/:id', async function (request, response) {
  const id = request.params.id

  const houseResponse = await fetch(`https://fdnd-agency.directus.app/items/f_houses/${id}?fields=*.*`)
  const houseResponseJSON = await houseResponse.json()
  const house = houseResponseJSON.data

  const listResponse = await fetch('https://fdnd-agency.directus.app/items/f_list/1?fields=*.*')
  const listJSON = await listResponse.json()
  const isFavoriet = listJSON.data.houses.some(huis => huis.f_houses_id === Number(id))

  const priceFormatted = house.price.toLocaleString('nl-NL')
  const pricePerM2 = Math.round(house.price / house.m2).toLocaleString('nl-NL')
  const listedDate = new Date(house.listed_date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })

  response.render('index.liquid', {house, isFavoriet, priceFormatted, pricePerM2, listedDate})
})

app.post('/', async function (request, response) {

  const listResponse = await fetch('https://fdnd-agency.directus.app/items/f_list/1?fields=*.*')
  const listJSON = await listResponse.json()
  const inLijst = listJSON.data.houses.find(h => h.f_houses_id === 40)

  if (inLijst) {
    await fetch('https://fdnd-agency.directus.app/items/f_list/1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ houses: { delete: [inLijst.id] } })
    })
  } else {
    await fetch('https://fdnd-agency.directus.app/items/f_list/1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ houses: { create: [{ f_houses_id: 40 }] } })
    })
  }

  response.redirect('/')
})


app.get('/favorieten', async function (request, response) {
  const listResponse = await fetch('https://fdnd-agency.directus.app/items/f_list/6?fields=houses.f_houses_id.*,houses.f_houses_id.gallery.directus_files_id')
  const listJSON = await listResponse.json()

  const favorieten = listJSON.data.houses

  for (const favoriet of favorieten) {
    const huis = favoriet.f_houses_id

    huis.priceFormatted = huis.price.toLocaleString('nl-NL')
  }

  response.render('favorieten.liquid', {favorieten})
})


app.set('port', process.env.PORT || 8000)

// Start Express op, gebruik daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  console.log(`Project draait via http://localhost:${app.get('port')}`)
})