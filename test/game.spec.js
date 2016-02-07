'use strict'

const chai    = require('chai')
const expect  = chai.expect
const Deck    = require('../lib/deck').Deck
const Shoe    = require('../lib/shoe').Shoe
const Player  = require('../lib/player').Player
const Game    = require('../lib/game').Game

describe('Game', () => {

  describe('constructor', () => {
    it('should set state to START', () => {
      let game = new Game()

      expect(game.state).to.equal('START')
    })
  })

  describe('shuffleDeck()', () => {
    it('should set state to BET', () => {
      let game = new Game({
        shoe: new Shoe(new Deck())
      })

      game.shuffleDeck()

      expect(game.state).to.equal('BET')
    })

    it('should throw if state is not START', () => {
      let game = new Game({
        shoe: new Shoe(new Deck())
      })

      game.state = 'NOT_START'

      expect(() => game.shuffleDeck()).to.throw(Error, /invalid state/i)
    })
  })

  describe('bet()', () => {
    it('should set player.bet amount', () => {
      let player1 = new Player({
        name: 'Player 1',
      })

      let game = new Game({
        shoe: new Shoe(new Deck()),
        players: [player1],
      })

      game.bet(player1, 100)

      expect(player1.bet).to.equal(100)
    })
  })

  describe('startingDeal()', () => {
    it('should set state to DEAL_PLAYERS and turn to 0', () => {
      let player1 = new Player({
        name: 'Player 1',
      })
      let dealer = new Player({
        name: 'Dealer',
      })

      let game = new Game({
        shoe: new Shoe(new Deck()),
        players: [player1],
        dealer: dealer,
      })

      game.state = 'BET'
      game.startingDeal()

      expect(game.state).to.equal('DEAL_PLAYERS')
      expect(game.turn).to.equal(0)
    })

    it('should deal 2 cards to all players and dealer', () => {
      let player1 = new Player({
        name: 'Player 1',
      })
      let dealer = new Player({
        name: 'Dealer',
      })

      let game = new Game({
        shoe: new Shoe(new Deck()),
        players: [player1],
        dealer: dealer,
      })

      game.state = 'BET'
      game.startingDeal()

      expect(game.shoe.cards).to.have.length(48)
      expect(game.players[0].hand).to.have.length(2)
      expect(game.dealer.hand).to.have.length(2)
    })

    it('should throw if state is not BET', () => {
      let game = new Game({
        shoe: new Shoe(new Deck())
      })

      game.state = 'NOT_BET'

      expect(() => game.startingDeal()).to.throw(Error, /invalid state/i)
    })
  })

  describe('currentPlayer()', () => {
    it('should return player based on state and turn', () => {
      let player1 = new Player({
        name: 'Player 1',
      })

      let game = new Game({
        shoe: new Shoe(new Deck()),
        players: [player1],
      })

      game.state = 'DEAL_PLAYERS'
      game.turn = 0

      let currentPlayer = game.currentPlayer()

      expect(currentPlayer.id).to.equal(player1.id)
    })

    it('should return dealer based on state', () => {
      let dealer = new Player({
        name: 'Dealer',
      })

      let game = new Game({
        shoe: new Shoe(new Deck()),
        dealer: dealer,
      })

      game.state = 'DEAL_DEALER'
      game.turn = 'any_value'

      let currentPlayer = game.currentPlayer()

      expect(currentPlayer.id).to.equal(dealer.id)
    })

    it('should throw on turn out of bounds', () => {
      let player1 = new Player({
        name: 'Player 1',
      })

      let game = new Game({
        shoe: new Shoe(new Deck()),
        players: [player1],
      })

      game.state = 'DEAL_PLAYERS'
      game.turn = 99999

      expect(() => game.currentPlayer()).to.throw(Error, /invalid turn index/i)
    })

    it('should throw if state is not DEAL_PLAYERS or DEAL_DEALER', () => {
      let player1 = new Player({
        name: 'Player 1',
      })

      let game = new Game({
        shoe: new Shoe(new Deck()),
        players: [player1],
      })

      game.state = 'OTHER_STATE'

      expect(() => game.currentPlayer()).to.throw(Error, /invalid state/i)
    })
  })

  it('deal()')
  it('dealerStandsOn17()')
  it('hit()')
  it('stand()')
  it('checkResult()')
  it('isBlackjack()')
  it('isBusting()')
  it('nextTurn()')
  it('checkResults()')

})
