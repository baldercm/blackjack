'use strict'

const _             = require('underscore')
const mongoose      = require('mongoose')
const playerSchema  = require('./player').playerSchema
const shoeSchema    = require('./shoe').shoeSchema
const PLAYER_STATES = require('./player').PLAYER_STATES
const HAND_STATES   = require('./player').HAND_STATES
const ACE           = require('./card').ACE

const STATES = {
  START:        'START',
  BET:          'BET',
  DEAL_PLAYERS: 'DEAL_PLAYERS',
  DEAL_DEALER:  'DEAL_DEALER',
  END:          'END',
}
const STATES_ENUM = _.values(STATES)

const PAY_RATIOS = {
  PUSH:       1,
  WIN:        1 + (1 / 1),
  BLACKJACK:  1 + (3 / 2),
}

const gameSchema = new mongoose.Schema({
  shoe:     shoeSchema,
  dealer:   playerSchema,
  players:  [playerSchema],
  state:    { type: String, enum: STATES_ENUM, default: STATES.START },
  config:   { type: {}, default: {} },
})

gameSchema.methods.shuffleDeck = function() {
  if (this.state !== 'START') {
    throw new Error('Invalid state while invoking shuffleDeck() ' + this.state)
  }

  this.shoe.shuffle()
  this.state = STATES.BET
}

gameSchema.methods.bet = function(player, amount) {
  player.bet = amount
}

gameSchema.methods.startingDeal = function() {
  if (this.state !== 'BET') {
    throw new Error('Invalid state while invoking startingDeal() ' + this.state)
  }

  _.each(this.players, (player) => {
    this.deal(player, 2)
  })
  this.deal(this.dealer, 2)

  this.state = STATES.DEAL_PLAYERS
  this.turn = 0
}

gameSchema.methods.currentPlayer = function() {
  if (this.state === STATES.DEAL_DEALER) {
    return this.dealer
  }
  if (this.state === STATES.DEAL_PLAYERS) {
    if (this.turn > this.players.length) {
      throw new Error('Invalid turn index ' + this.turn)
    }
    return this.players[this.turn]
  }

  throw new Error('Invalid state while invoking currentPlayer() ' + this.state)
}

gameSchema.methods.deal = function(player, numCards) {
  let dealtCards = this.shoe.deal(numCards)
  player.hand = _.union(player.hand, dealtCards)
  return dealtCards
}

gameSchema.methods.dealerStandsOn17 = function() {
  let dealer = this.dealer
  if (dealer.isBlackjack()) {
    this.stand()
    return
  }

  while (dealer.score() < 17) {
    this.hit()
  }
  if (!dealer.isBusting()) {
    this.stand()
  }
}

gameSchema.methods.hit = function() {
  let player = this.currentPlayer()
  let dealtCards = this.deal(player)
  this.checkResult(player)
  return dealtCards
}

gameSchema.methods.stand = function() {
  let player = this.currentPlayer()

  player.state = PLAYER_STATES.END
  player.handState = HAND_STATES.STANDING
  this.checkResult(player)
  this.nextTurn()
}

gameSchema.methods.checkResult = function(player) {
  if (this.isBlackjack(player)) {
    player.handState = HAND_STATES.BLACKJACK
    return
  }

  if (this.isBusting(player)) {
    player.handState = HAND_STATES.BUSTING
    this.nextTurn()
    return
  }
}

gameSchema.methods.isBlackjack = function(player) {
  let hand = player.hand

  if (hand.length !== 2) {
    return false
  }

  let ace       = _.findWhere(hand, { rank: ACE })
  let faceOrTen = _.findWhere(hand, { score: 10 })

  return ace && faceOrTen
}

gameSchema.methods.isBusting = function(player) {
  return player.score() > 21
}

gameSchema.methods.nextTurn = function() {
  if (this.state === STATES.DEAL_PLAYERS) {
    this.turn++
    if (this.turn >= this.players.length) {
      this.state = STATES.DEAL_DEALER
    }
    return
  }

  if (this.state === STATES.DEAL_DEALER) {
    this.state = STATES.END
    return
  }
}

gameSchema.methods.checkResults = function() {
  let dealerScore = this.dealer.score()
  let dealer = this.dealer

  /* jshint maxcomplexity: 9 */
  _.each(this.players, (player) => {
    if (dealer.isBlackjack()) {
      player.state = PLAYER_STATES.LOSS
      player.paid = 0

    } else if (player.isBlackjack()) {
      player.state = PLAYER_STATES.WIN
      player.paid = player.bet * PAY_RATIOS.BLACKJACK

    } else if (player.isBusting() && dealer.isBusting()) {
      player.state = PLAYER_STATES.PUSH
      player.paid = player.bet * PAY_RATIOS.PUSH

    } else if (player.isBusting()) {
      player.state = PLAYER_STATES.LOSS
      player.paid = 0

    } else if (dealer.isBusting()) {
      player.state = PLAYER_STATES.WIN
      player.paid = player.bet * PAY_RATIOS.WIN

    } else if (player.isStanding() && dealer.isStanding()) {
      if (player.score() > dealerScore) {
        player.state = PLAYER_STATES.WIN
        player.paid = player.bet * PAY_RATIOS.WIN

      } else if (player.score() < dealerScore) {
        player.state = PLAYER_STATES.LOSS
        player.paid = 0

      } else {
        player.state = PLAYER_STATES.PUSH
        player.paid = player.bet * PAY_RATIOS.PUSH

      }
    }
  })
  /* jshint maxcomplexity: 7 */
}

module.exports.Game = mongoose.model('Game', gameSchema)
