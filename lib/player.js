'use strict'

const _           = require('underscore')
const mongoose    = require('mongoose')
const cardSchema  = require('./card').cardSchema
const ACE         = require('./card').ACE

const PLAYER_STATES = {
  WAIT_BET:     'WAIT_BET',
  WAIT_TURN:    'WAIT_TURN',
  PLAYING:      'PLAYING',
  END:  'END',
  LOSS:         'LOSS',
  WIN:          'WIN',
  PUSH:         'PUSH',
}
const PLAYER_STATES_ENUM = _.values(PLAYER_STATES)

const HAND_STATES = {
  BLACKJACK:  'BLACKJACK',
  BUSTING:    'BUSTING',
  STANDING:   'STANDING',
}
const HAND_STATES_ENUM = _.values(HAND_STATES)

const playerSchema = new mongoose.Schema({
  name:       String,
  hand:       { type: [cardSchema], default: [] },
  bet:        { type: Number, default: 0 },
  paid:       { type: Number, default: 0 },
  state:      { type: String, enum: PLAYER_STATES_ENUM },
  handState:  { type: String, enum: HAND_STATES_ENUM },
})

playerSchema.methods.score = function() {
  let aces    = _.where(this.hand, { rank: ACE })
  let numAces = aces.length

  let score = _.reduce(this.hand, (sum, card) => sum + card.score, 0)

  if (score > 21 && numAces) {
    let numAcesExcess = (numAces - 1) || 1
    score -= 10 * numAcesExcess
  }

  return score
}

playerSchema.methods.isBusting = function() {
  return this.handState === HAND_STATES.BUSTING
}

playerSchema.methods.isBlackjack = function() {
  return this.handState === HAND_STATES.BLACKJACK
}

playerSchema.methods.isStanding = function() {
  return this.handState === HAND_STATES.STANDING
}

module.exports.PLAYER_STATES  = _.clone(PLAYER_STATES)
module.exports.HAND_STATES    = _.clone(HAND_STATES)
module.exports.playerSchema   = playerSchema
module.exports.Player         = mongoose.model('Player', playerSchema)
