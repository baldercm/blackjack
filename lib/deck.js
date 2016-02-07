'use strict'

const _     = require('underscore')
const CARDS = require('./card').CARDS

const Deck = function() {
  this.cards = _.clone(CARDS)
}

exports.Deck = Deck
