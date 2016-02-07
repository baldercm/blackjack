'use strict'

const chai    = require('chai')
const expect  = chai.expect
const Card    = require('../lib/card').Card
const Player  = require('../lib/player').Player

describe('Player', () => {

  describe('score()', () => {
    it('should score hand with no aces', () => {
      let card1 = new Card({
        suit: 'spades',
        rank: 'Two',
        score: 2,
      })
      let card2 = new Card({
        suit: 'clubs',
        rank: 'Jack',
        score: 10,
      })
      let player = new Player({
        name: 'Player 1',
        hand: [card1, card2]
      })

      expect(player.score()).to.equal(12)
    })

    it('should score busting hand with no aces', () => {
      let card6 = new Card({
        suit: 'spades',
        rank: 'Six',
        score: 6,
      })
      let card8 = new Card({
        suit: 'spades',
        rank: 'Eight',
        score: 8,
      })
      let card10 = new Card({
        suit: 'clubs',
        rank: 'Jack',
        score: 10,
      })
      let player = new Player({
        name: 'Player 1',
        hand: [card6, card8, card10]
      })

      expect(player.score()).to.equal(24)
    })

    it('should score busting hand with one ace', () => {
      let ace1 = new Card({
        suit: 'spades',
        rank: 'Ace',
        score: 11,
      })
      let card6 = new Card({
        suit: 'spades',
        rank: 'Six',
        score: 6,
      })
      let card8 = new Card({
        suit: 'spades',
        rank: 'Eight',
        score: 8,
      })
      let player = new Player({
        name: 'Player 1',
        hand: [ace1, card6, card8]
      })

      expect(player.score()).to.equal(15)
    })

    it('should score busting hand with aces', () => {
      let ace1 = new Card({
        suit: 'spades',
        rank: 'Ace',
        score: 11,
      })
      let ace2 = new Card({
        suit: 'clubs',
        rank: 'Ace',
        score: 11,
      })
      let card10 = new Card({
        suit: 'clubs',
        rank: 'Jack',
        score: 10,
      })
      let player = new Player({
        name: 'Player 1',
        hand: [ace1, ace2, card10]
      })

      expect(player.score()).to.equal(22)
    })

    it('should score one ace as 11', () => {
      let ace = new Card({
        suit: 'spades',
        rank: 'Ace',
        score: 11,
      })
      let player = new Player({
        name: 'Player 1',
        hand: [ace]
      })

      expect(player.score()).to.equal(11)
    })

    it('should score first ace as 11 and score others as 1', () => {
      let ace1 = new Card({
        suit: 'spades',
        rank: 'Ace',
        score: 11,
      })
      let ace2 = new Card({
        suit: 'clubs',
        rank: 'Ace',
        score: 11,
      })
      let player = new Player({
        name: 'Player 1',
        hand: [ace1, ace2]
      })

      expect(player.score()).to.equal(12)
    })
  })

})
