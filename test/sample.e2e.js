'use strict'

const _         = require('underscore')
const chai      = require('chai')
const mongoose  = require('mongoose')
const Deck      = require('../lib/deck').Deck
const Shoe      = require('../lib/shoe').Shoe
const Game      = require('../lib/game').Game
const Player    = require('../lib/player').Player
chai.use(require('sinon-chai'))
require('bluebird').promisifyAll(mongoose)

describe('Sample E2E', () => {

  before((done) => {
    let port = process.env.MONGO_PORT || 27017
    let mongoUri  = 'mongodb://localhost:' + port + '/blackjack-e2e'
    let mongoOpts = {
      user: '',
      pass: '',
    }
    mongoose.connection.once('open', function() {
      Game.remove(done)
    })
    mongoose.connection.on('error', function(err) {
      console.error('Mongoose connection error: ' + err)
    })

    mongoose.connect(mongoUri, mongoOpts)
  })

  after((done) => {
    mongoose.connection.removeAllListeners()
    mongoose.connection.close(done)
  })

  describe('dummy game where players always stand on 18', () => {
    it('should work as expected', () => {
      let shoe = new Shoe(new Deck())

      let players = [
        new Player({
          name: 'Player 1',
          hand: [],
        }),
        new Player({
          name: 'Player 2',
          hand: [],
        }),
        new Player({
          name: 'Player 3',
          hand: [],
        }),
        new Player({
          name: 'Player 4',
          hand: [],
        })
      ]

      let dealer = new Player({
        name: 'Dealer',
        hand: [],
      })

      return Game.createAsync({
        shoe,
        dealer,
        players,
      }).then((game) => {
        game.shuffleDeck()
        game.startingDeal()
        _.each(game.players, standOn(18))
        game.dealerStandsOn17()
        game.checkResults()
        return game.saveAsync()

        function standOn(score) {
          return function(player) {
            while (player.score() < score) {
              game.hit()
            }
            if (!player.isBusting()) {
              game.stand()
            }
          }
        }
      }).catch((err) => {
        console.log(err)
        throw err
      })

      // function hitTwice(player) {
      //   dealer.deal(player)
      //   dealer.deal(player)
      // }
    })
  })

})
