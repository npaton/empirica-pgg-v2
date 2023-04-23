import { Meteor } from "meteor/meteor";
import React, { Component } from "react";

export default class Sorry extends Component {
  static stepName = "Sorry";

  render() {
    const { player, game } = this.props;
    const basePay = game.treatment.basePay;
    let msg;
    switch (player.exitStatus) {
      case "gameFull":
        msg = `Unfortunately, all games are full. You are still eligible to participate in future sessions, and will be compensated for showing up on time.`;
        break;
      case "gameLobbyTimedOut":
        msg = `Unfortunately, not enough players joined to begin the game. You will be compensated for your time via partial payment.`;
        break;
      case "playerEndedLobbyWait":
        msg =
          "You decided to stop waiting, we are sorry it was too long a wait.";
        break;
      default:
        msg =
          "Unfortunately, the game is unable to launch. Please reach out to the requester with a description of what happened.";
        break;
    }
    if (player.exitReason === "failedQuestion") {
      msg =
        "Unfortunately, you did not meet the conditions required to play the game.";
    }
    if (player.exitReason === "idleTimedOut") {
      msg = "You were detected to be idle and have been removed from the game.";
    }
    if (player.exitReason === "lobbyIdleTimedOut") {
      msg = "You were detected to be idle and have been removed from the game.";
    }
    if (player.exitReason === "offlineTimedOut") {
      msg =
        "You were detected to be offline and have been removed from the game.";
    }
    if (player.exitReason === "otherPlayersLeft") {
      msg =
        "Unfortunately, all other players have either disconnected or been removed for being idle. You will be compensated based on your performance up until this point in the game.";
    }
    // Only for dev
    if (!game && Meteor.isDevelopment) {
      msg =
        "Unfortunately the Game was cancelled because of failed to init Game (only visible in development, check the logs).";
    }
    return (
      <div className="flex h-screen w-screen justify-center items-center">
        <div className="w-1/2 prose">
          <h4>Sorry!</h4>
          <p>Sorry, you were not able to play today! {msg}</p>
          <p>
            <strong>
              Please contact the researcher to see if there are more games
              available.
            </strong>
          </p>
        </div>
      </div>
    );
  }
}
