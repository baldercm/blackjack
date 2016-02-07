'use strict'

const _           = require('underscore')
const mongoose    = require('mongoose')
const cardSchema  = require('./card').cardSchema

const shoeSchema = new mongoose.Schema({
  cards: [cardSchema],
})

shoeSchema.methods.shuffle = function() {
  this.cards = _.shuffle(this.cards)
}

shoeSchema.methods.deal = function(numCards) {
  numCards = numCards || 1
  let dealtCards = []
  for (let i = 0; i < numCards; i++) {
    dealtCards.push(this.cards.shift())
  }
  return dealtCards
}

module.exports.shoeSchema = shoeSchema
module.exports.Shoe       = mongoose.model('Shoe', shoeSchema)
