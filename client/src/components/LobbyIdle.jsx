import { TimeSync } from "meteor/mizzao:timesync";
import moment from "moment";
import React from "react";
import { Button } from "./FunButton";
import { lobbyWarningTime, lobbyIdleTimeDifferentTab } from "../../constants";

function playerLeft(player) {
  player.set("exited", true);
  player.exit("lobbyIdleTimedOut");
}

let lobbyIdleTimerID = null;

export default class LobbyIdle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      remainingTime: lobbyWarningTime,
      idle: false,
      delayStarted: false,
      delayID: "",
      clockID: "",
      lastActive: "",
    };
  }

  beginCountDown(stage) {
    const lastActivity = this.state.lastActive;
    if (typeof lastActivity !== "string") {
      return (
        <div className="z-40 h-screen w-screen fixed top-0 left-0 bg-white/80 p-20 flex justify-center">
          <div className="relative bg-white rounded-lg shadow-lg border-8 border-orange-200 p-12 h-auto overflow-auto">
            <div className="prose max-w-none prose-slate prose-p:text-gray-500 prose-p:font-['Inter'] prose-headings:text-orange-600">
              <p style={{ fontSize: "15px" }}>
                You are idle. Please indicate your presence by returning to this
                screen, clicking the button, and keeping this window open. You
                will be logged out in {this.state.remainingTime} seconds.
              </p>
              <br />
              <br />
              <center>
                <Button onClick={this.changeIdleFalse}>I'm Active</Button>
              </center>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  decrTime = () => {
    const { player } = this.props;
    if (!(this.state.remainingTime <= 0)) {
      this.setState({ remainingTime: this.state.remainingTime - 1 });
    } else {
      playerLeft(player);
    }
  };

  changeIdleTrueDelay = () => {
    const { player } = this.props;
    if (!this.state.delayStarted && !this.state.idle) {
      this.setState({
        delayStarted: true,
        delayID: setTimeout(() => {
          this.setState({
            idle: true,
            clockID: setInterval(this.decrTime, 1000),
          });
          this.stopDelay();
        }, lobbyIdleTimeDifferentTab * 1000),
        lastActive: new Date().getTime(),
      });
    }
  };

  stopDelay = () => {
    if (this.state.delayStarted) {
      clearTimeout(this.state.delayID);
      this.setState({
        delayStarted: false,
        delayID: "",
      });
    }
  };

  changeIdleFalse = () => {
    const { player } = this.props;
    clearTimeout(this.state.clockID);
    this.setState({
      idle: false,
      remainingTime: lobbyWarningTime,
      lastActive: new Date().getTime(),
    });
  };

  componentDidMount() {
    const { player, stage } = this.props;
    lobbyIdleTimerID = setInterval(() => {
      if (player !== undefined) {
        document.visibilityState == "hidden"
          ? this.changeIdleTrueDelay()
          : this.stopDelay();
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(lobbyIdleTimerID);
  }

  render() {
    const { stage } = this.props;

    return <div>{this.state.idle ? this.beginCountDown(stage) : null}</div>;
  }
}
