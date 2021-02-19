class Player {
  static get VERSION() {
    return "0.1";
  }

  static betRequest(gameState, bet) {
    console.log(gameState);
    bet(0);
  }

  static showdown(gameState) {
    console.log(gameState);
  }
}

module.exports = Player;
