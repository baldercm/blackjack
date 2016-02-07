'use strict'

const Deck      = require('./deck').Deck
const Shoe      = require('./shoe').Shoe
const Game      = require('./game').Game
const Player    = require('./player').Player

module.exports.createEmptyGame = function() {
  let shoe = new Shoe(new Deck())
  let players = []
  let dealer = module.exports.createPlayer('Dealer')

  return new Game({
    shoe,
    dealer,
    players,
    config: {},
  })
}

module.exports.createPlayer = function(name) {
  return new Player({
    name,
    hand: [],
  })
}
