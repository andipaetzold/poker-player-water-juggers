const pairProbability = require("./winning4");
const Hand = require("pokersolver").Hand;

const ranksOrdered = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
];

class Player {
  static get VERSION() {
    return "0.8";
  }

  static betRequest(gameState, bet) {
    const player = gameState.players[gameState.in_action];

    try {
      console.log("Community Cards", JSON.stringify(gameState.community_cards, undefined, 4));
      console.log("Hole Cards", JSON.stringify(player.hole_cards, undefined, 4));

      const pair = getPair(player.hole_cards);
      const probRow = pairProbability.find((p) => p.pair === pair);

      if (isPreFlop(gameState)) {
        console.log("Phase: pre-flop");
        if (probRow.wins > 20) {
          raise(bet, gameState, player, 5);
        } else {
          fold(bet);
        }
      } else {
        if (isPreTurn(gameState)) {
          console.log("Phase: pre-turn");
        } else if (isPreRiver(gameState)) {
          console.log("Phase: pre-river");
        } else {
          console.log("Phase: pre-showdown");
        }

        const hand = Hand.solve([
          ...player.hole_cards.map((card) => `${getRank(card)}${card.suit[0]}`),
          ...gameState.community_cards.map(
            (card) => `${getRank(card)}${card.suit[0]}`
          ),
        ]);

        console.log(`Rank: ${hand.rank}`)
        console.log(`Hand Name: ${hand.name}`)
        switch (hand.rank) {
          case 1: // Highest card
            fold(bet);
            break;
          case 2: // one pair
            call(bet, gameState, player);
            break;
          case 3: // two pair
            call(bet, gameState, player);
            break;
          case 4: // three of a kind
            call(bet, gameState, player);
            break;
          case 5: // straight
            call(bet, gameState, player);
            break;
          case 6: // flush
            raise(bet, gameState, player, 5);
            break;
          case 7: // full house
            raise(bet, gameState, player, 10);
            break;
          case 8: // Four of a kind
            raise(bet, gameState, player, 15);
            break;
          case 9: // Straight flush
            raise(bet, gameState, player, 50);
            break;
          case 10: // Royal flush
            allIn(bet, player);
            break;
          default:
            allIn(bet, player)
            break;
        }
      }
    } catch (e) {
      console.error(e);
      bet(player.stack);
    }
  }

  static showdown(gameState) {}
}

function allIn(bet, player) {
  console.log("Action: All in");
  bet(player.stack);
}

function call(bet, gameState, player) {
  console.log("Action: Call");
  bet(gameState.current_buy_in - player.bet);
}

function raise(bet, gameState, player, factor) {
  console.log("Action: Raise", factor);
  bet(gameState.current_buy_in - player.bet + factor * gameState.minimum_raise);
}

function fold(bet) {
  console.log("Action: Fold");
  bet(0);
}

module.exports = Player;

function isPreFlop(gameState) {
  return gameState.community_cards.length === 0;
}

function isPreTurn(gameState) {
  return gameState.community_cards.length === 3;
}
function isPreRiver(gameState) {
  return gameState.community_cards.length === 4;
}

function getPair(cards) {
  const ranks = [getRank(cards[0]), getRank(cards[1])].sort(
    (r1, r2) =>
      ranksOrdered.findIndex((v) => v === r2) -
      ranksOrdered.findIndex((v) => v === r1)
  );

  const sameSuit = cards[0].suit === cards[1].suit;
  return `${ranks.join("")}${sameSuit ? "s" : ""}`;
}

function getRank(card) {
  if (card.rank === "10") {
    return "T";
  }
  return card.rank[0];
}
