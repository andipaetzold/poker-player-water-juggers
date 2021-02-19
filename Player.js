const NAME = "Water Juggers";

class Player {
  static get VERSION() {
    return "0.1";
  }

  static betRequest(gameState, bet) {
    try {
      console.log(gameState);
      const player = gameState.players.find((p) => p.name === NAME);
      bet(gameState.current_buy_in - player.bet);
    } catch (e) {
      console.error(e);
      bet(0);
    }
  }

  static showdown(gameState) {
    console.log(gameState);
  }
}

module.exports = Player;
