import express, { response } from 'express'
import { Liquid } from 'liquidjs';

const app = express()

app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))

const engine = new Liquid()
app.engine('liquid', engine.express())

app.set('views', './views')

app.get('/', async function (request, response) {
  const houseResponse = await fetch(`https://fdnd-agency.directus.app/items/f_houses/40?fields=*.*`)
  const houseResponseJSON = await houseResponse.json()
  const house = houseResponseJSON.data
    response.render('index.liquid', {house})
})

app.get('/favorieten', async function (request, response) {

    response.render('favorieten.liquid')
})


app.set('port', process.env.PORT || 8000)

// Start Express op, gebruik daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  console.log(`Project draait via http://localhost:${app.get('port')}`)
})