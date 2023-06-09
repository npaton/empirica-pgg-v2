import {
  useGame,
  usePlayer,
  usePlayers,
  useRound,
  useStage,
} from "@empirica/core/player/classic/react";
import React from "react";
import { AvatarDeduction } from "../components/AvatarComplications";
import { CoinResults } from "../components/CoinResults";
import { Button } from "../components/FunButton";
import { Label } from "../components/Label";
import { PlayerGrid } from "../components/PlayerGrid";
import { You } from "../components/You";
import { HeaderWithTimer } from "./Header";

export function Outcome() {
  const player = usePlayer();
  const players = usePlayers();
  const round = useRound();
  const stage = useStage();
  const game = useGame();

  const {
    multiplier,
    punishmentCost,
    punishmentExists,
    punishmentMagnitude,
    rewardCost,
    rewardExists,
    rewardMagnitude,
    punishmentFrequency,
    rewardFrequency,
    networkMatrix,
    networkInfoDisabled,
    networkRewardDisabled,
    networkPunishmentDisabled,
  } = game.get("treatment");

  const playerCount = players.length;
  const otherPlayers = players.filter((p) => p?.id !== player?.id);

  const totalContributions = game.get("totalContributions");
  const totalReturns = game.get("totalReturns");
  const payoff = game.get("payoff");

  const contribution = player.round.get("contribution");
  const cumulativePayoff = player.get("cumulativePayoff");
  const punishments = player.round.get("punished");
  const rewards = player.round.get("rewarded");
  const playerIndex = player.get("index");
  const currentPlayerNetwork = networkMatrix[playerIndex];
  const roundNum = round.get("index") + 1;

  const rewardsActive = roundNum % (rewardFrequency || 1);
  const punishmentsActive = roundNum % (punishmentFrequency || 1);

  let totalCost = 0;
  for (const key in punishments) {
    totalCost += parseFloat(punishments[key]) * punishmentCost;
  }

  for (const key in rewards) {
    totalCost += parseFloat(rewards[key]) * rewardCost;
  }

  function handleSubmit() {
    player.stage.set("submit", true);
  }

  return (
    <div className="h-full grid grid-rows-[min-content_1fr]">
      <HeaderWithTimer
        player={player}
        game={game}
        round={round}
        stage={stage}
      />
      <div className="h-full grid grid-cols-[280px_600px_1fr] grid-flow-row justify-center">
        <div className="h-full relative flex flex-col items-center justify-center">
          <div className="relative">
            <You
              submitted={player.stage.get("submit")}
              animal={player.get("avatar")}
            />

            <div className="px-4 pt-16">
              {rewardExists && (
                <Label color="yellow" size="md">
                  Rewards: It will cost you {rewardCost} coins to give a reward
                  of {rewardMagnitude} coins.
                </Label>
              )}

              {rewardExists && punishmentExists && <div className="mt-4" />}

              {punishmentExists && (
                <Label color="purple" size="md">
                  Deductions: It will cost you {punishmentCost} coins to impose
                  a deduction of {punishmentMagnitude} coins.
                </Label>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col h-full items-center justify-center">
          <CoinResults
            contributedYou={contribution}
            contributedOthers={totalContributions - contribution}
            contributedTotal={totalContributions}
            contributedMultiplied={totalReturns}
            multiplier={multiplier}
            received={payoff}
            playerCount={playerCount}
          />

          {player.stage.get("submit") ? (
            <Label color="gray">Waiting on the other players...</Label>
          ) : (
            <div className="w-full px-32">
              <Button onClick={() => handleSubmit()}>I'm done</Button>
            </div>
          )}
        </div>

        <div className="h-full grid grid-rows-1">
          <PlayerGrid>
            {otherPlayers.map((otherPlayer) => {
              const punished = punishments[otherPlayer.id] || 0;
              const added = rewards[otherPlayer.id] || 0;
              const isInNetwork =
                currentPlayerNetwork[otherPlayer.get("index")] == 1;

              if (networkInfoDisabled && !isInNetwork) {
                return null;
              }

              const canReward =
                rewardsActive && !(!isInNetwork && networkRewardDisabled);
              const canPunish =
                punishmentsActive &&
                !(!isInNetwork && networkPunishmentDisabled);

              const punish = (increase) => {
                if (increase) {
                  if (totalCost + punishmentCost > cumulativePayoff) {
                    alert(
                      "You don't have enough coins to make this deduction!"
                    );
                    return;
                  }

                  punishments[otherPlayer.id] = punished + 1;
                } else {
                  punishments[otherPlayer.id] = punished - 1;
                }
                player.round.set("punished", punishments);
              };

              const reward = (increase) => {
                if (increase) {
                  if (totalCost + rewardCost > cumulativePayoff) {
                    alert("You don't have enough coins to make this reward!");

                    return;
                  }
                  rewards[otherPlayer.id] = added + 1;
                } else {
                  rewards[otherPlayer.id] = added - 1;
                }

                player.round.set("rewarded", rewards);
              };

              const add = () => {
                if (!canReward) {
                  alert("This action can not be done in this round.");
                  return;
                }

                if (punished > 0) {
                  punish(false);
                } else {
                  reward(true);
                }
              };

              const deduct = () => {
                if (!canPunish) {
                  alert("This action can not be done in this round.");
                  return;
                }

                if (added > 0) {
                  reward(false);
                } else {
                  punish(true);
                }
              };

              return (
                <div
                  key={player.id}
                  className="flex justify-center items-center"
                >
                  <div dir="ltr" className="w-[6.5rem]">
                    <AvatarDeduction
                      animal={otherPlayer.get("avatar")}
                      submitted={otherPlayer.stage.get("submit")}
                      contributed={otherPlayer.round.get("contribution")}
                      disabled={player.stage.get("submit")}
                      punishmentExists={punishmentExists}
                      deducted={punished * punishmentMagnitude}
                      rewardExists={rewardExists}
                      added={added * rewardMagnitude}
                      onDeduct={deduct}
                      onAdd={add}
                      rewardDisabled={!canReward}
                      punishmentDisabled={!canPunish}
                    />
                  </div>
                </div>
              );
            })}
          </PlayerGrid>
        </div>
      </div>
    </div>
  );
}
