const { CardGroup, OddsCalculator } = require("poker-odds-calculator");

class Player {
  static get VERSION() {
    return "0.3";
  }

  static betRequest(gameState, bet) {
    const player = gameState.players[gameState.in_action];

    try {
      console.log("betRequest", JSON.stringify(gameState, undefined, 4));

      const playerCards = gameState.players
        .map((p) => {
          return (p.hole_cards || []).map((card) => parseCard(card)).join("");
        })
        .map((cards) => CardGroup.fromString(cards));

      const communityCards = (gameState.community_cards || [])
        .map((card) => parseCard(card))
        .join("");

      const result = OddsCalculator.calculate(
        playerCards,
        CardGroup.fromString(communityCards)
      );
      console.log("result", JSON.stringify(result));
      bet(player.stack);
    } catch (e) {
      console.error(e);
      bet(player.stack);
    }
  }

  static showdown(gameState) {}
}

module.exports = Player;

function parseCard(card) {
  if (card.rank === "10") {
    return `T${card.suit[0]}`;
  }

  return `${card.rank}${card.suit[0]}`;
}
