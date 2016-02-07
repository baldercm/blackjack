'use strict'

const chai    = require('chai')
const expect  = chai.expect
const Card    = require('../lib/card').Card

describe('Card', () => {

  describe('toString()', () => {
    it('should return human friendly text', () => {
      let card = new Card({
        suit: 'spades',
        rank: 'ace',
        score: 11,
      })
      expect(card.toString()).to.equal('ace of spades')
    })
  })

})
