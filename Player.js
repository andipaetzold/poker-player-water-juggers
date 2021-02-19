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
    return "0.7";
  }

  static betRequest(gameState, bet) {
    const player = gameState.players[gameState.in_action];

    try {
      console.log("betRequest", JSON.stringify(gameState, undefined, 4));

      const pair = getPair(player.hole_cards);
      const probRow = pairProbability.find((p) => p.pair === pair);

      if (isPreFlop(gameState)) {
        console.log("Phase: pre-flop");
        if (probRow.wins > 20) {
          raise(bet, gameState, player, 5);
        } else {
          fold(bet);
        }
      } else if (isPreTurn(gameState)) {
        console.log("Phase: pre-turn");

        const ourRanks = player.hole_cards.map((c) => c.rank);
        const hasPair = gameState.community_cards.find((c) =>
          ourRanks.includes(c.rank)
        );

        if (hasPair) {
          raise(bet, gameState, player, 5);
        } else {
          call(bet, gameState, player);
        }
      } else {
        console.log("Phase: pre-river");
        call(bet, gameState, player);
      }
    } catch (e) {
      console.error(e);
      bet(player.stack);
    }

    const hand = Hand.solve([
      ...player.hole_cards.map((card) => `${getRank(card)}${card.suit[0]}`),
      ...gameState.community_cards.map(
        (card) => `${getRank(card)}${card.suit[0]}`
      ),
    ]);

    console.log(hand);
  }

  static showdown(gameState) {}
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
