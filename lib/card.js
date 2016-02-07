'use strict'

const util      = require('util')
const _         = require('underscore')
const mongoose  = require('mongoose')

const SUITS = {
  CLUBS:    'clubs',
  DIAMONDS: 'diamonds',
  HEARTS:   'hearts',
  SPADES:   'spades',
}
const SUITS_ENUM = _.values(SUITS)

const ACE = 'Ace'

const cardSchema = new mongoose.Schema({
  suit:   { type: String, required: true, enum: SUITS_ENUM },
  rank:   { type: String, required: true },
  score:  { type: Number, required: true },
  id:     false,
  _id:    false,
})

cardSchema.methods.toString = function() {
  return util.format('%s of %s', this.rank, this.suit)
}

const CARDS = [
  { suit: SUITS.CLUBS, rank: ACE, score: 11 },
  { suit: SUITS.CLUBS, rank: '2', score: 2 },
  { suit: SUITS.CLUBS, rank: '3', score: 3 },
  { suit: SUITS.CLUBS, rank: '4', score: 4 },
  { suit: SUITS.CLUBS, rank: '5', score: 5 },
  { suit: SUITS.CLUBS, rank: '6', score: 6 },
  { suit: SUITS.CLUBS, rank: '7', score: 7 },
  { suit: SUITS.CLUBS, rank: '8', score: 8 },
  { suit: SUITS.CLUBS, rank: '9', score: 9 },
  { suit: SUITS.CLUBS, rank: '10', score: 10 },
  { suit: SUITS.CLUBS, rank: 'Jack', score: 10 },
  { suit: SUITS.CLUBS, rank: 'Queen', score: 10 },
  { suit: SUITS.CLUBS, rank: 'King', score: 10 },

  { suit: SUITS.DIAMONDS, rank: ACE, score: 11 },
  { suit: SUITS.DIAMONDS, rank: '2', score: 2 },
  { suit: SUITS.DIAMONDS, rank: '3', score: 3 },
  { suit: SUITS.DIAMONDS, rank: '4', score: 4 },
  { suit: SUITS.DIAMONDS, rank: '5', score: 5 },
  { suit: SUITS.DIAMONDS, rank: '6', score: 6 },
  { suit: SUITS.DIAMONDS, rank: '7', score: 7 },
  { suit: SUITS.DIAMONDS, rank: '8', score: 8 },
  { suit: SUITS.DIAMONDS, rank: '9', score: 9 },
  { suit: SUITS.DIAMONDS, rank: '10', score: 10 },
  { suit: SUITS.DIAMONDS, rank: 'Jack', score: 10 },
  { suit: SUITS.DIAMONDS, rank: 'Queen', score: 10 },
  { suit: SUITS.DIAMONDS, rank: 'King', score: 10 },

  { suit: SUITS.HEARTS, rank: ACE, score: 11 },
  { suit: SUITS.HEARTS, rank: '2', score: 2 },
  { suit: SUITS.HEARTS, rank: '3', score: 3 },
  { suit: SUITS.HEARTS, rank: '4', score: 4 },
  { suit: SUITS.HEARTS, rank: '5', score: 5 },
  { suit: SUITS.HEARTS, rank: '6', score: 6 },
  { suit: SUITS.HEARTS, rank: '7', score: 7 },
  { suit: SUITS.HEARTS, rank: '8', score: 8 },
  { suit: SUITS.HEARTS, rank: '9', score: 9 },
  { suit: SUITS.HEARTS, rank: '10', score: 10 },
  { suit: SUITS.HEARTS, rank: 'Jack', score: 10 },
  { suit: SUITS.HEARTS, rank: 'Queen', score: 10 },
  { suit: SUITS.HEARTS, rank: 'King', score: 10 },

  { suit: SUITS.SPADES, rank: ACE, score: 11 },
  { suit: SUITS.SPADES, rank: '2', score: 2 },
  { suit: SUITS.SPADES, rank: '3', score: 3 },
  { suit: SUITS.SPADES, rank: '4', score: 4 },
  { suit: SUITS.SPADES, rank: '5', score: 5 },
  { suit: SUITS.SPADES, rank: '6', score: 6 },
  { suit: SUITS.SPADES, rank: '7', score: 7 },
  { suit: SUITS.SPADES, rank: '8', score: 8 },
  { suit: SUITS.SPADES, rank: '9', score: 9 },
  { suit: SUITS.SPADES, rank: '10', score: 10 },
  { suit: SUITS.SPADES, rank: 'Jack', score: 10 },
  { suit: SUITS.SPADES, rank: 'Queen', score: 10 },
  { suit: SUITS.SPADES, rank: 'King', score: 10 },
]

exports.cardSchema  = cardSchema
exports.Card        = mongoose.model('Card', cardSchema)
exports.CARDS       = _.clone(CARDS)
exports.ACE         = ACE
