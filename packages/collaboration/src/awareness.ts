import { Awareness } from "y-protocols/awareness";
import type * as Y from "yjs";
import type { Participant } from "@tessera/shared-types";

export function createAwareness(ydoc: Y.Doc): Awareness {
  return new Awareness(ydoc);
}

export function setLocalParticipant(
  awareness: Awareness,
  participant: Participant,
): void {
  awareness.setLocalStateField("participant", {
    id: participant.id,
    displayName: participant.displayName,
    isAI: participant.isAI,
    cursorColor: participant.cursorColor,
  });
}

export interface PeerState {
  readonly clientId: number;
  readonly participant: Participant | null;
}

export function getRemotePeers(awareness: Awareness): readonly PeerState[] {
  const localId = awareness.clientID;
  const states: PeerState[] = [];

  awareness.getStates().forEach((state, clientId) => {
    if (clientId === localId) return;
    const participant = (state as Record<string, unknown>)["participant"] as
      | Participant
      | undefined;
    states.push({ clientId, participant: participant ?? null });
  });

  return states;
}

export type AwarenessChangeCallback = (peers: readonly PeerState[]) => void;

export function onPeersChanged(
  awareness: Awareness,
  callback: AwarenessChangeCallback,
): () => void {
  const handler = () => {
    callback(getRemotePeers(awareness));
  };
  awareness.on("change", handler);
  return () => awareness.off("change", handler);
}
