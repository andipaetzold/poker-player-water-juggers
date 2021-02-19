const { CardGroup, OddsCalculator } = require("poker-odds-calculator");

class Player {
  static get VERSION() {
    return "0.3";
  }

  static betRequest(gameState, bet) {
    const player = gameState.players[gameState.in_action];

    try {
      console.log("betRequest", gameState);
      const ourCards = player.hole_cards
        .map((card) => parseCard(card))
        .join("");

      const communityCards = (gameState.community_cards || [])
        .map((card) => parseCard(card))
        .join("");

      const result = OddsCalculator.calculate(
        [CardGroup.fromString(ourCards)],
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
