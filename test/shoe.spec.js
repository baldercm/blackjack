'use strict'

const chai    = require('chai')
const sinon   = require('sinon')
chai.use(require('sinon-chai'))
const expect  = chai.expect
const _       = require('underscore')
const Shoe    = require('../lib/shoe').Shoe
const Deck    = require('../lib/deck').Deck

describe('Shoe', () => {

  describe('shuffle()', () => {
    it('should delegate to _.shuffle()', () => {
      let shoe = new Shoe(new Deck())
      let orderedCards = shoe.cards
      sinon.spy(_, 'shuffle')

      shoe.shuffle()

      expect(_.shuffle).to.have.been.calledWith(orderedCards)

      _.shuffle.restore()
    })
  })

  describe('deal()', () => {
    it('should return one dealt card by default', () => {
      let shoe = new Shoe(new Deck())

      let dealtCards = shoe.deal()

      expect(dealtCards).to.have.length(1)
      expect(shoe.cards).not.to.contain(dealtCards[0])
    })

    it('should return dealt cards', () => {
      let shoe = new Shoe(new Deck())

      let dealtCards = shoe.deal(2)

      expect(dealtCards).to.have.length(2)
      expect(shoe.cards).not.to.contain(dealtCards[0])
      expect(shoe.cards).not.to.contain(dealtCards[1])
    })

  })

})
