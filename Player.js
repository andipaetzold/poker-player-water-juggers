class Player {
  static get VERSION() {
    return "0.1";
  }

  static betRequest(gameState, bet) {
    try {
      console.log('betRequest', gameState);
      const player = gameState.players[gameState.in_action];
      bet(gameState.current_buy_in - player.bet);
    } catch (e) {
      console.error(e);
      bet(0);
    }
  }

  static showdown(gameState) {
    console.log('showdown', gameState);
  }
}

module.exports = Player;
