const pairProbability = require("./winning4");

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
    return "0.6";
  }

  static betRequest(gameState, bet) {
    const player = gameState.players[gameState.in_action];

    try {
      console.log("betRequest", JSON.stringify(gameState, undefined, 4));

      const pair = getPair(player.hole_cards);
      const probRow = pairProbability.find((p) => p.pair === pair);

      if (isPreFlop(gameState)) {
        if (probRow.wins > 20) {
          console.log("Action: All-In");
          bet(
            gameState.current_buy_in - player.bet + 5 * gameState.minimum_raise
          );
        } else {
          console.log("Action: Fold");
          bet(0);
        }
      } else {
        console.log("Action: Call");
        bet(gameState.current_buy_in - player.bet);
      }
    } catch (e) {
      console.error(e);
      bet(player.stack);
    }
  }

  static showdown(gameState) {}
}

module.exports = Player;

function isPreFlop(gameState) {
  return gameState.community_cards.length === 0;
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
