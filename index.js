const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')
const app = express()
const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require('./handlers.js')

// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set('port', (process.env.PORT || 9001))

app.enable('verbose errors')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(poweredByHandler)

// --- SNAKE LOGIC GOES BELOW THIS LINE ---

// Handle POST request to '/start'
app.post('/start', (request, response) => {
  // NOTE: Do something here to start the game

  // Response data
  const data = {
    color: '#DFFF00',
    head_url: 'http://www.placecage.com/c/200/200', // optional, but encouraged!
    taunt: "Let's do thisss thang!", // optional, but encouraged!
  }

  return response.json(data)
})

// Handle POST request to '/move'
app.post('/move', (request, response) => {
  // NOTE: Do something here to generate your move
  console.log(request.body.you.body);
  var myhead_x= request.body.you.body.data[0].x;
  var myhead_y= request.body.you.body.data[0].y;
  var mylength= request.body.you.length;
  var myhealth= request.body.you.health-1;
  var food_x = request.body.food.data[0].x;
  var food_y = request.body.food.data[0].y;
  console.log("mylength is at : "+mylength);
  console.log("myhealth is at : "+myhealth);
  console.log("food is at : "+food_x+","+food_y);
  console.log("head is at : "+myhead_x+","+myhead_y); //if myhead_y = 0 or myhead_x = 0 snake dies 
  // need cases for when snake dies..
  
  
  // Response data
  const data = {
    move: 'up', // one of: ['up','down','left','right']
    taunt: 'Outta my way, snake!', // optional, but encouraged!
  }

  return response.json(data)
})

// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use('*', fallbackHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'))
})
