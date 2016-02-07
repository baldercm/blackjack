# TOC
   - [Card](#card)
     - [toString()](#card-tostring)
   - [Deck](#deck)
     - [constructor](#deck-constructor)
   - [Game](#game)
     - [constructor](#game-constructor)
     - [shuffleDeck()](#game-shuffledeck)
     - [bet()](#game-bet)
     - [startingDeal()](#game-startingdeal)
     - [currentPlayer()](#game-currentplayer)
   - [Player](#player)
     - [score()](#player-score)
   - [Sample E2E](#sample-e2e)
     - [dummy game where players always stand on 18](#sample-e2e-dummy-game-where-players-always-stand-on-18)
   - [Shoe](#shoe)
     - [shuffle()](#shoe-shuffle)
     - [deal()](#shoe-deal)
<a name=""></a>
 
<a name="card"></a>
# Card
<a name="card-tostring"></a>
## toString()
should return human friendly text.

```js
let card = new Card({
  suit: 'spades',
  rank: 'ace',
  score: 11,
})
expect(card.toString()).to.equal('ace of spades')
```

<a name="deck"></a>
# Deck
<a name="deck-constructor"></a>
## constructor
should return an ordered deck that contains exactly one copy of each card.

```js
let deck = new Deck()
expect(deck.cards).to.have.length(52)
_.each(CARDS, (card, idx) => {
  expect(deck.cards[idx]).to.equal(card)
})
```

<a name="game"></a>
# Game
<a name="game-constructor"></a>
## constructor
should set state to START.

```js
let game = new Game()
expect(game.state).to.equal('START')
```

<a name="game-shuffledeck"></a>
## shuffleDeck()
should set state to BET.

```js
let game = new Game({
  shoe: new Shoe(new Deck())
})
game.shuffleDeck()
expect(game.state).to.equal('BET')
```

should throw if state is not START.

```js
let game = new Game({
  shoe: new Shoe(new Deck())
})
game.state = 'NOT_START'
expect(() => game.shuffleDeck()).to.throw(Error, /invalid state/i)
```

<a name="game-bet"></a>
## bet()
should set player.bet amount.

```js
let player1 = new Player({
  name: 'Player 1',
})
let game = new Game({
  shoe: new Shoe(new Deck()),
  players: [player1],
})
game.bet(player1, 100)
expect(player1.bet).to.equal(100)
```

<a name="game-startingdeal"></a>
## startingDeal()
should set state to DEAL_PLAYERS and turn to 0.

```js
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
```

should deal 2 cards to all players and dealer.

```js
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
```

should throw if state is not BET.

```js
let game = new Game({
  shoe: new Shoe(new Deck())
})
game.state = 'NOT_BET'
expect(() => game.startingDeal()).to.throw(Error, /invalid state/i)
```

<a name="game-currentplayer"></a>
## currentPlayer()
should return player based on state and turn.

```js
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
```

should return dealer based on state.

```js
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
```

should throw on turn out of bounds.

```js
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
```

should throw if state is not DEAL_PLAYERS or DEAL_DEALER.

```js
let player1 = new Player({
  name: 'Player 1',
})
let game = new Game({
  shoe: new Shoe(new Deck()),
  players: [player1],
})
game.state = 'OTHER_STATE'
expect(() => game.currentPlayer()).to.throw(Error, /invalid state/i)
```

<a name="player"></a>
# Player
<a name="player-score"></a>
## score()
should score hand with no aces.

```js
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
```

should score busting hand with no aces.

```js
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
```

should score busting hand with one ace.

```js
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
```

should score busting hand with aces.

```js
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
```

should score one ace as 11.

```js
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
```

should score first ace as 11 and score others as 1.

```js
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
```

<a name="sample-e2e"></a>
# Sample E2E
<a name="sample-e2e-dummy-game-where-players-always-stand-on-18"></a>
## dummy game where players always stand on 18
should work as expected.

```js
let shoe = new Shoe(new Deck())
let players = [
  new Player({
    name: 'Player 1',
    hand: [],
  }),
  new Player({
    name: 'Player 2',
    hand: [],
  }),
  new Player({
    name: 'Player 3',
    hand: [],
  }),
  new Player({
    name: 'Player 4',
    hand: [],
  })
]
let dealer = new Player({
  name: 'Dealer',
  hand: [],
})
return Game.createAsync({
  shoe,
  dealer,
  players,
}).then((game) => {
  game.shuffleDeck()
  game.startingDeal()
  _.each(game.players, standOn(18))
  game.dealerStandsOn17()
  game.checkResults()
  return game.saveAsync()
  function standOn(score) {
    return function(player) {
      while (player.score() < score) {
        game.hit()
      }
      if (!player.isBusting()) {
        game.stand()
      }
    }
  }
}).catch((err) => {
  console.log(err)
  throw err
})
// function hitTwice(player) {
//   dealer.deal(player)
//   dealer.deal(player)
// }
```

<a name="shoe"></a>
# Shoe
<a name="shoe-shuffle"></a>
## shuffle()
should delegate to _.shuffle().

```js
let shoe = new Shoe(new Deck())
let orderedCards = shoe.cards
sinon.spy(_, 'shuffle')
shoe.shuffle()
expect(_.shuffle).to.have.been.calledWith(orderedCards)
_.shuffle.restore()
```

<a name="shoe-deal"></a>
## deal()
should return one dealt card by default.

```js
let shoe = new Shoe(new Deck())
let dealtCards = shoe.deal()
expect(dealtCards).to.have.length(1)
expect(shoe.cards).not.to.contain(dealtCards[0])
```

should return dealt cards.

```js
let shoe = new Shoe(new Deck())
let dealtCards = shoe.deal(2)
expect(dealtCards).to.have.length(2)
expect(shoe.cards).not.to.contain(dealtCards[0])
expect(shoe.cards).not.to.contain(dealtCards[1])
```

