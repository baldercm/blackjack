'use strict'

const _         = require('underscore')
const inquirer  = require('inquirer')
const Promise   = require('bluebird')
const database  = require('./database')
const factory   = require('./factory')

let port = process.env.MONGO_PORT || 27017
const mongoOptions = {
  uri:  'mongodb://localhost:' + port + '/baldercm-blackjack',
  user: '',
  pass: '',
}

function bootstrap() {
  return database.bootstrap(mongoOptions)
}

function createGame() {
  return factory.createEmptyGame()
}

function promptNumberOfPlayers(game) {
  const NUMBER_OF_PLAYERS_QUESTION = [
    {
      type: 'INPUT',
      name: 'numPlayers',
      message: 'Number of players?',
      validate: validateNumPlayers,
      filter: filterNumber
    },
  ]

  return new Promise((resolve) => {
    inquirer.prompt(NUMBER_OF_PLAYERS_QUESTION, (answers) => {
      game.answers = _.extend(game.config, answers)
      resolve(game)
    })
  })
}

function promptPlayerNames(game) {
  return new Promise((resolve) => {
    let numPlayers = game.config.numPlayers
    let playerNamesQuestion = []
    _.times(numPlayers, (idx) => {
      playerNamesQuestion.push({
        type: 'INPUT',
        name: 'playerName' + idx,
        message: 'Player #' + idx + ' name?',
      })
    })

    inquirer.prompt(playerNamesQuestion, (answers) => {
      let playerNames = _.values(answers)
      game.config.playerNames = playerNames
      _.each(playerNames, (playerName) => {
        game.players.push(factory.createPlayer(playerName))
      })
      resolve(game)
    })
  })
}

function shuffleDeck(game) {
  game.shuffleDeck()
  return Promise.resolve(game)
}

function promptPlayerBets(game) {
  return new Promise((resolve) => {
    let numPlayers = game.config.numPlayers
    let playerBetsQuestion = []
    _.times(numPlayers, (idx) => {
      playerBetsQuestion.push({
        type: 'INPUT',
        name: 'playerBet' + idx,
        message: 'Player #' + idx + ' bet?',
        validate: validatePlayerBet,
        filter: filterNumber
      })
    })

    inquirer.prompt(playerBetsQuestion, (answers) => {
      let playerBets = _.values(answers)
      game.config.playerBets = playerBets
      _.each(playerBets, (amount, idx) => {
        game.bet(game.players[idx], amount)
      })
      resolve(game)
    })
  })
}

function startingDeal(game) {
  game.startingDeal()
  return Promise.resolve(game)
}

function printHand(player) {
  let cards = []
  _.each(player.hand, (card) => cards.push(card))
  console.log('')
  console.log(player.name + ', your hand is:')
  console.log(cards.join(', '))
  console.log('Score: ' + player.score())
}

function printDealtCards(player, dealtCards) {
  console.log(player.name + ', you get:')
  console.log(dealtCards.join(', '))
}

function dealPlayers(game) {
  return new Promise((resolve) => {
    doDeal()

    function doDeal() {
      let player = game.currentPlayer()
      printHand(player)
      inquirer.prompt(playQuestions(player), function(answers) {
        if (answers.play === 'HIT') {
          let dealtCards = game.hit()
          printDealtCards(player, dealtCards)
        } else if (answers.play === 'STAND') {
          game.stand()
        }

        // jscs:disable requireEarlyReturn
        if (game.state === 'DEAL_PLAYERS') {
          doDeal()
        } else {
          resolve()
        }
        // jscs:enable requireEarlyReturn
      })
    }
  }).return(game)

  function playQuestions(player) {
    return {
      type: 'list',
      name: 'play',
      message: player.name  + ': what is your play?',
      choices: [ 'Hit', 'Stand'],
      filter: filterToUpperCase
    }
  }
}

function dealerStandsOn17(game) {
  game.dealerStandsOn17()
  return Promise.resolve(game)
}

function printResults(game) {
  game.checkResults()

  console.log('')
  console.log('GAME RESULTS:')

  printHand(game.dealer)
  console.log(game.dealer.handState)

  _.each(game.players, (player) => {
    printHand(player)
    console.log(player.state + ' - ' + player.handState)
    if (player.paid) {
      console.log('Gets ' + player.paid + ' coins back')
    }
  })

  return Promise.resolve(game)
}

function shutdown(exitCode) {
  database.shutdown()
    .then(() => process.exit(exitCode))
}

process.on('SIGTERM', shutdown) // docker stop
process.on('SIGINT' , shutdown) // ctrl-C
process.on('SIGUSR2', shutdown) // nodemon restart

module.exports = function runSimpleGame() {
  return bootstrap()
    .then(createGame)
    .then(promptNumberOfPlayers)
    .then(promptPlayerNames)
    .then(shuffleDeck)
    .then(promptPlayerBets)
    .then(startingDeal)
    .then(dealPlayers)
    .then(dealerStandsOn17)
    .then(printResults)
    .then((game) => {
      return game.saveAsync()
    })
    .then(() => {
      shutdown(0)
    })
    .catch((err) => {
      console.error(err)
      shutdown(1)
    })
}

function filterNumber(str) {
  return parseInt(str)
}

function filterToUpperCase(str) {
  return str.toUpperCase()
}

function validateNumPlayers(value) {
  var pass = value.match(/^[1-5]$/)
  if (!pass) {
    return 'Number of players must be between 1 and 5'
  }
  return true
}

function validatePlayerBet(value) {
  var pass = value.match(/^[1-9][0-9]{0,2}$/)
  if (!pass) {
    return 'Bet amount must be an integer between 1 and 999'
  }
  return true
}
