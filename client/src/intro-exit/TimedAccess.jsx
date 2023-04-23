import { NonIdealState } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import React from "react";
import Countdown from "react-countdown";
import { experimentDate } from "../../constants";

export default class TimedAccess extends React.Component {
  render() {
    // Not sure what icon works best:
    // - SMALL_CROSS
    // - BAN_CIRCLE
    // - ERROR
    // - DISABLE
    // - WARNING_SIGN
    return (
      <div style={{ marginTop: "5em" }}>
        <NonIdealState
          icon={IconNames.ISSUE}
          title="No experiments available"
          description={
            <div style={{ width: "100%" }}>
              <p>
                There are currently no available experiments. The next batch of
                experiments will be available in:
              </p>
              <h1>
                <Countdown date={experimentDate} />
              </h1>
            </div>
          }
        />
        <div
          style={{ marginLeft: "30%", marginRight: "30%", marginTop: "3em" }}
        >
          <h1>Please note the following:</h1>
          <p>
            1. Please do not share information about the experiment with anyone.
            Doing so compromises the integrity of the results;{" "}
            <strong>
              if this happens, we will be unable to offer the study on
              Mechanical Turk in the future.
            </strong>
          </p>
          <br />
          <p>
            2. You will play this game simultaneously with other participants,
            so please stay engaged throughout the entire process, including the
            lobby.{" "}
            <strong>
              Participants who are detected to be idle or offline will be
              removed, and will forfeit their bonuses.{" "}
            </strong>
          </p>
          <br />
          <p>3. The expected playtime ranges from 5-30 minutes.</p>
          <br />
          <p>
            4. Your earnings will be sent as a bonus using previous work you
            have done for this requester.
          </p>
          <br />
          <p>
            5. If all seats are filled (which may occur while you are completing
            the walkthrough), you will see a message that “All games are full”
            and will not be able to participate in this session. However, you
            will still be eligible to participate in future sessions, and will
            be compensated $0.20 for showing up on time.
          </p>
        </div>
      </div>
    );
  }
}
