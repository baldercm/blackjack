'use strict'

const chai    = require('chai')
const expect  = chai.expect
const _       = require('underscore')
const Deck    = require('../lib/deck').Deck
const CARDS   = require('../lib/card').CARDS

describe('Deck', () => {

  describe('constructor', () => {
    it('should return an ordered deck that contains exactly one copy of each card', () => {
      let deck = new Deck()
      expect(deck.cards).to.have.length(52)

      _.each(CARDS, (card, idx) => {
        expect(deck.cards[idx]).to.equal(card)
      })
    })
  })

})
