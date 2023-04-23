import React from "react";

import { Alert, Intent, NonIdealState } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import LobbyIdle from "../components/LobbyIdle.jsx";
import { CoreWrapper } from "meteor/empirica:core/ui/components/Helpers.jsx";

import {
  endPlayerTimeoutWait,
  extendPlayerTimeoutWait,
} from "meteor/empirica:core/api/players/methods.js";

let timerID = null;

export default class CustomGameLobby extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps);
  }

  handleWaitLonger = () => {
    extendPlayerTimeoutWait.call({ playerId: this.props.player._id });
  };

  handleExitNow = () => {
    endPlayerTimeoutWait.call({ playerId: this.props.player._id });
  };

  render() {
    const { gameLobby, treatment, timedOut, lobbyConfig, player } = this.props;

    const total = treatment.factor("playerCount").value;
    const exisiting = gameLobby.playerIds.length;

    if (exisiting >= total) {
      return (
        <CoreWrapper>
          <div className="game-lobby">
            <NonIdealState
              icon={IconNames.PLAY}
              title="Game loading..."
              description="Your game will be starting shortly, get ready!"
            />
          </div>
        </CoreWrapper>
      );
    }

    const showExtensionAlert =
      timedOut &&
      lobbyConfig.timeoutType === "individual" &&
      lobbyConfig.extendCount >= player.timeoutWaitCount;

    return (
      <CoreWrapper>
        <div className="game-lobby">
          {<LobbyIdle {...this.props} />}
          <NonIdealState
            icon={IconNames.TIME}
            title="Lobby"
            description={
              <>
                <p>
                  The game will begin soon.{" "}
                  <strong>
                    Please do not navigate away from the page while other
                    players join.
                  </strong>
                </p>
                <br />
                <p>
                  {exisiting} / {total} players ready.
                </p>
              </>
            }
          />
        </div>
        <Alert
          intent={Intent.PRIMARY}
          isOpen={showExtensionAlert}
          confirmButtonText="Wait Longer"
          cancelButtonText="Exit Now"
          onConfirm={this.handleWaitLonger}
          onCancel={this.handleExitNow}
        >
          <p>
            Sorry you have been waiting for a while. Do you wish to wait longer
            or exit now?
          </p>
        </Alert>
      </CoreWrapper>
    );
  }
}
