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
    return "0.11";
  }

  static betRequest(gameState, bet) {
    const player = gameState.players[gameState.in_action];

    // try {
    //   console.log(
    //     "Community Cards",
    //     JSON.stringify(gameState.community_cards, undefined, 2)
    //   );
    //   console.log("Players", JSON.stringify(gameState.players, undefined, 2));
    //   console.log(
    //     "Hole Cards",
    //     JSON.stringify(player.hole_cards, undefined, 2)
    //   );

    //   const isSomeoneAllIn = gameState.players
    //     .filter((_, index) => index !== gameState.in_action)
    //     .some((p) => p.stack === 0 && p.status === "active");
    //   if (isSomeoneAllIn) {
    //     console.log("Someone is all in");
    //   }

    //   const numberOfOpponents = gameState.players
    //     .filter((_, index) => index !== gameState.in_action)
    //     .filter((p) => p.state === "active").length;

    //   const pair = getPair(player.hole_cards);
    //   const probRow = pairProbability.find((p) => p.pair === pair);

    //   const hand = Hand.solve([
    //     ...player.hole_cards.map((card) => `${getRank(card)}${card.suit[0]}`),
    //     ...gameState.community_cards.map(
    //       (card) => `${getRank(card)}${card.suit[0]}`
    //     ),
    //   ]);
    //   console.log(`Rank: ${hand.rank}`);
    //   console.log(`Hand Name: ${hand.name}`);

    //   if (isPreFlop(gameState)) {
    //     console.log("Phase: pre-flop");
    //     console.log(`Win Prob: ${probRow.wins}`);
    //     if (probRow.wins > 20) {
    //       raise(bet, gameState, player, 5);
    //     } else if (probRow.wins > 16) {
    //       call(bet, gameState, player);
    //     } else {
    //       fold(bet);
    //     }
    //   } else if (isPreTurn(gameState)) {
    //     switch (hand.rank) {
    //       case 1: // highest card
    //         fold(bet);
    //         break;
    //       case 2: // one pair
    //         raise(bet, gameState, player, 1);
    //         break;
    //       case 3: // two pair
    //         raise(bet, gameState, player, 5);
    //         break;
    //       case 4: // three of a kind
    //         raise(bet, gameState, player, 10);
    //         break;
    //       case 5: // straight
    //         raise(bet, gameState, player, 15);
    //         break;
    //       case 6: // flush
    //         raise(bet, gameState, player, 25);
    //         break;
    //       case 7: // full house
    //       case 8: // Four of a kind
    //       case 9: // Straight flush
    //       case 10: // Royal flush
    //         allIn(bet, player);
    //         break;
    //       default:
    //         allIn(bet, player);
    //         break;
    //     }
    //   } else if (isPreRiver(gameState)) {
    //     switch (hand.rank) {
    //       case 1: // highest card
    //         fold(bet);
    //         break;
    //       case 2: // one pair
    //         call(bet, gameState, player);
    //         break;
    //       case 3: // two pair
    //         if (isSomeoneAllIn) {
    //           call(bet, gameState, player);
    //         } else {
    //           raise(bet, gameState, player, 5);
    //         }
    //         break;
    //       case 4: // three of a kind
    //         raise(bet, gameState, player, 10);
    //         break;
    //       case 5: // straight
    //         raise(bet, gameState, player, 15);
    //         break;
    //       case 6: // flush
    //         raise(bet, gameState, player, 25);
    //         break;
    //       case 7: // full house
    //       case 8: // Four of a kind
    //       case 9: // Straight flush
    //       case 10: // Royal flush
    //         allIn(bet, player);
    //         break;
    //       default:
    //         allIn(bet, player);
    //         break;
    //     }
    //   } else {
    //     call(bet, gameState, player);
    //   }
    // } catch (e) {
    //   console.error(e);
    bet(player.stack);
    // }
  }

  static showdown(gameState) {
    console.log("Showdown", JSON.stringify(gameState, undefined, 2));
  }
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
  bet(
    gameState.current_buy_in - player.bet + gameState.minimum_raise + 5 * factor
  );
}

function fold(bet) {
  console.log("Action: Fold");
  bet(0);
}

module.exports = Player;

function isPreFlop(gameState) {
  return getPhase(gameState) === "pre-flop";
}

function isPreTurn(gameState) {
  return getPhase(gameState) === "pre-turn";
}
function isPreRiver(gameState) {
  return getPhase(gameState) === "pre-river";
}

function getPhase(gameState) {
  switch (gameState.community_cards.length) {
    case 0:
      return "pre-flop";
    case 3:
      return "pre-turn";
    case 4:
      return "pre-river";
    case 5:
    default:
      return "pre-showdown";
  }
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
