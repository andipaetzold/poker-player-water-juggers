const pairProbability = require("./winning4");

class Player {
  static get VERSION() {
    return "0.4";
  }

  static betRequest(gameState, bet) {
    const player = gameState.players[gameState.in_action];

    try {
      console.log("betRequest", JSON.stringify(gameState, undefined, 4));

      const pair = getPair(player.hole_cards);

      console.log(pairProbability.find((p) => p.pair === pair));

      bet(player.stack);
    } catch (e) {
      console.error(e);
      bet(player.stack);
    }
  }

  static showdown(gameState) {}
}

module.exports = Player;

function getPair(cards) {
  const sameSuit = cards[0].suit === cards[1].suit;
  return `${getRank(cards[0])}${getRank(cards[1])}${sameSuit ? "s" : ""}`;
}

function getRank(card) {
  if (card.rank === "10") {
    return "T";
  }
  return card.rank[0];
}
