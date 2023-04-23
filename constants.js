import { dev } from "./dev.js";

// Idle detection params
export const warningTime = dev ? 50000 : 30;
export const idleTriggerTime = 50;
// export const idleTimeDifferentTab = dev ? 50000 : 10;

// Lobby idle detection params
export const lobbyWarningTime = dev ? 50000 : 45;
export const lobbyIdleTimeDifferentTab = dev ? 50000 : 45;

// Offline detection params
export const numStagesRemoveOffline = 3;

// Experiment date
export const experimentDate = 1682010000000;
