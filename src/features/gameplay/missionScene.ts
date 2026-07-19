import type PhaserType from "phaser";
import { encounterStageTitle, type EncounterProgress, type SupportedMovement } from "@/contracts";
import type { MissionSnapshot } from "./missionController";
import {
  encounterByMovement,
  missionPresentationFeedback,
  type EncounterKind,
} from "./missionPresentation";

export const missionSceneUpdateEvent = "ai-fitness-escape:scene-update";

export type MissionSceneUpdate = {
  snapshot: MissionSnapshot;
  target: SupportedMovement;
  encounter?: EncounterProgress;
};

const movementNames: Record<SupportedMovement, string> = {
  jump: "Jump",
  squat: "Squat",
  lunge: "Lunge",
  "high-knees": "High knees",
  "jumping-jack": "Jumping jack",
  "punch-left": "Left punch",
  "punch-right": "Right punch",
  "side-reach-left": "Left side reach",
  "side-reach-right": "Right side reach",
  "push-up": "Push-up",
  plank: "Plank",
};

export function missionSceneView(update: MissionSceneUpdate) {
  const { snapshot, target } = update;
  const encounter = update.encounter ?? { index: 1, total: 1 };
  return {
    objective: encounter.total > 1 ? `${movementNames[target]} · Set ${encounter.index}/${encounter.total}` : movementNames[target],
    status:
      snapshot.status === "complete"
        ? "ESCAPED"
        : snapshot.status === "paused" || snapshot.status === "recovery"
          ? "MISSION PAUSED"
          : "ESCAPE IN PROGRESS",
    progressLabel: `${snapshot.missionProgress}% TO SAFETY`,
    progress: Math.min(1, Math.max(0, snapshot.missionProgress / 100)),
    playerX: 118 + Math.min(1, Math.max(0, snapshot.missionProgress / 100)) * 710,
  };
}

export function publishMissionSceneUpdate(target: EventTarget, update: MissionSceneUpdate) {
  target.dispatchEvent(new CustomEvent(missionSceneUpdateEvent, { detail: update }));
}

export function createMissionScene(
  Phaser: typeof PhaserType,
  host: HTMLDivElement,
  initialUpdate: MissionSceneUpdate,
) {
  return class MissionScene extends Phaser.Scene {
    private frameSamples: number[] = [];
    private player!: PhaserType.GameObjects.Container;
    private objective!: PhaserType.GameObjects.Text;
    private status!: PhaserType.GameObjects.Text;
    private progressLabel!: PhaserType.GameObjects.Text;
    private progressFill!: PhaserType.GameObjects.Rectangle;
    private pauseVeil!: PhaserType.GameObjects.Container;
    private encounter?: PhaserType.GameObjects.Container;
    private comboText!: PhaserType.GameObjects.Text;
    private xpText!: PhaserType.GameObjects.Text;
    private completionLayer?: PhaserType.GameObjects.Container;
    private previousUpdate?: MissionSceneUpdate;
    private currentEncounter?: string;
    private updateListener?: EventListener;
    private reducedMotion = false;

    preload() {
      this.load.image("volcano-escape-background", "/game/volcano-escape-bg.png");
      this.load.image("fitness-runner", "/game/runner.png");
    }

    create() {
      this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      this.cameras.main.setBackgroundColor("#090b20");

      this.add.image(480, 270, "volcano-escape-background").setDisplaySize(960, 540).setFlipX(true);
      this.add.rectangle(480, 270, 960, 540, 0x020617, 0.18);
      this.add.rectangle(20, 18, 370, 154, 0x020617, 0.7).setOrigin(0).setStrokeStyle(1, 0x94a3b8, 0.18);
      this.add.rectangle(760, 20, 180, 70, 0x020617, 0.62).setOrigin(0).setStrokeStyle(1, 0x94a3b8, 0.14);
      this.add.rectangle(480, 501, 890, 38, 0x020617, 0.68);

      const path = this.add.graphics();
      path.lineStyle(8, 0x475569, 0.55);
      path.beginPath();
      path.moveTo(105, 399);
      path.lineTo(850, 350);
      path.strokePath();
      for (let index = 0; index < 8; index += 1) {
        this.add.rectangle(112 + index * 104, 402 - index * 7, 78, 19, 0x475569, 0.72).setStrokeStyle(2, 0xcbd5e1, 0.32);
      }

      this.add.text(38, 32, "VOLCANO ESCAPE", { fontFamily: "system-ui", fontSize: "17px", color: "#fbbf24", fontStyle: "bold" }).setLetterSpacing(3);
      this.status = this.add.text(38, 62, "", { fontFamily: "system-ui", fontSize: "31px", color: "#f8fafc", fontStyle: "bold" });
      this.add.text(38, 110, "CURRENT MOVE", { fontFamily: "system-ui", fontSize: "12px", color: "#94a3b8", fontStyle: "bold" }).setLetterSpacing(2);
      this.objective = this.add.text(38, 131, "", { fontFamily: "system-ui", fontSize: "25px", color: "#67e8f9", fontStyle: "bold" });

      this.comboText = this.add.text(920, 38, "COMBO ×0", { fontFamily: "system-ui", fontSize: "16px", color: "#fbbf24", fontStyle: "bold" }).setOrigin(1, 0).setLetterSpacing(1.5);
      this.xpText = this.add.text(920, 66, "0 XP", { fontFamily: "system-ui", fontSize: "13px", color: "#cbd5e1", fontStyle: "bold" }).setOrigin(1, 0).setLetterSpacing(1.2);

      this.player = this.createRunner();
      this.add.rectangle(480, 507, 850, 9, 0x1e293b, 1).setOrigin(0.5);
      this.progressFill = this.add.rectangle(55, 507, 0, 9, 0x22d3ee, 1).setOrigin(0, 0.5);
      this.progressLabel = this.add.text(480, 481, "", { fontFamily: "system-ui", fontSize: "12px", color: "#cbd5e1", fontStyle: "bold" }).setOrigin(0.5).setLetterSpacing(1.5);

      const veil = this.add.rectangle(480, 270, 960, 540, 0x020617, 0.72);
      const pauseTitle = this.add.text(480, 248, "MISSION PAUSED", { fontFamily: "system-ui", fontSize: "34px", color: "#f8fafc", fontStyle: "bold" }).setOrigin(0.5);
      const pauseCopy = this.add.text(480, 292, "Resume when you are ready to move.", { fontFamily: "system-ui", fontSize: "17px", color: "#cbd5e1" }).setOrigin(0.5);
      this.pauseVeil = this.add.container(0, 0, [veil, pauseTitle, pauseCopy]).setDepth(20).setVisible(false);

      this.updateListener = ((event: CustomEvent<MissionSceneUpdate>) => this.renderUpdate(event.detail)) as EventListener;
      window.addEventListener(missionSceneUpdateEvent, this.updateListener);
      this.events.once("shutdown", () => {
        if (this.updateListener) window.removeEventListener(missionSceneUpdateEvent, this.updateListener);
      });
      this.renderUpdate(initialUpdate);
    }

    private createRunner() {
      const shadow = this.add.ellipse(0, 31, 58, 14, 0x020617, 0.55);
      const glow = this.add.circle(0, 0, 42, 0x22d3ee, 0.13);
      const sprite = this.add.image(0, -12, "fitness-runner").setDisplaySize(116, 116);
      const runner = this.add.container(118, 365, [shadow, glow, sprite]).setDepth(10);
      if (!this.reducedMotion) this.tweens.add({ targets: runner, y: "-=7", yoyo: true, repeat: -1, duration: 520, ease: "Sine.easeInOut" });
      return runner;
    }

    private drawEncounter(kind: EncounterKind, color: number, accent: number) {
      const graphics = this.add.graphics();
      graphics.lineStyle(4, accent, 0.9);
      graphics.fillStyle(color, 0.95);

      if (kind === "boulder") {
        graphics.fillCircle(0, 15, 38);
        graphics.strokeCircle(0, 15, 38);
        graphics.lineBetween(-18, -6, 8, 34);
        graphics.lineBetween(5, -15, 24, 8);
      } else if (kind === "fire-gate") {
        graphics.fillRoundedRect(-55, -12, 110, 20, 8);
        for (let x = -42; x <= 42; x += 28) graphics.fillTriangle(x - 10, 8, x + 10, 8, x, 48);
      } else if (kind === "broken-bridge") {
        graphics.fillRoundedRect(-78, 16, 58, 18, 4);
        graphics.fillRoundedRect(20, 8, 58, 18, 4);
        graphics.lineBetween(-18, 22, 17, 14);
      } else if (kind === "lava-steps") {
        for (let index = 0; index < 4; index += 1) graphics.fillRoundedRect(-70 + index * 40, 34 - index * 18, 30, 12, 4);
      } else if (kind === "storm-gate") {
        graphics.strokeCircle(0, 12, 48);
        graphics.strokeCircle(0, 12, 31);
        graphics.fillCircle(0, 12, 12);
        graphics.lineBetween(-68, 12, 68, 12);
        graphics.lineBetween(0, -55, 0, 78);
      } else if (kind === "left-wall" || kind === "right-wall") {
        const direction = kind === "left-wall" ? -1 : 1;
        graphics.fillRoundedRect(-38, -35, 76, 92, 8);
        graphics.lineBetween(direction * 55, 12, direction * 5, 12);
        graphics.lineBetween(direction * 55, 12, direction * 35, -8);
        graphics.lineBetween(direction * 55, 12, direction * 35, 32);
      } else if (kind === "left-vines" || kind === "right-vines") {
        const direction = kind === "left-vines" ? -1 : 1;
        graphics.lineStyle(10, color, 0.95);
        graphics.beginPath();
        graphics.moveTo(direction * 65, -45);
        graphics.lineTo(direction * 26, -12);
        graphics.lineTo(direction * 62, 18);
        graphics.lineTo(direction * 18, 58);
        graphics.strokePath();
        graphics.fillStyle(accent, 1);
        graphics.fillCircle(direction * 26, -12, 8);
        graphics.fillCircle(direction * 18, 58, 8);
      } else if (kind === "low-tunnel") {
        graphics.fillRoundedRect(-78, -24, 156, 24, 8);
        graphics.fillRect(-78, 0, 22, 62);
        graphics.fillRect(56, 0, 22, 62);
        graphics.lineBetween(-48, 22, 48, 22);
      } else {
        graphics.strokeCircle(0, 12, 48);
        graphics.fillCircle(0, 12, 29);
        for (let index = 0; index < 8; index += 1) {
          const angle = (Math.PI * 2 * index) / 8;
          graphics.fillCircle(Math.cos(angle) * 72, 12 + Math.sin(angle) * 52, 7);
        }
      }
      return graphics;
    }

    private showEncounter(target: SupportedMovement, progress: EncounterProgress) {
      const encounterKey = `${target}:${progress.index}:${progress.total}`;
      if (this.currentEncounter === encounterKey) return;
      this.currentEncounter = encounterKey;
      this.encounter?.destroy(true);
      const presentation = encounterByMovement[target];
      host.dataset.encounter = presentation.kind;
      const title = this.add.text(0, -88, encounterStageTitle(target, progress).toUpperCase(), { fontFamily: "system-ui", fontSize: "15px", color: "#f8fafc", fontStyle: "bold" }).setOrigin(0.5).setLetterSpacing(1.4);
      const instruction = this.add.text(0, -64, presentation.instruction, { fontFamily: "system-ui", fontSize: "18px", color: `#${presentation.accent.toString(16).padStart(6, "0")}`, fontStyle: "bold" }).setOrigin(0.5);
      this.encounter = this.add.container(704, 340, [this.drawEncounter(presentation.kind, presentation.color, presentation.accent), title, instruction]).setDepth(8);
      if (!this.reducedMotion) {
        this.encounter.setScale(0.78).setAlpha(0);
        this.tweens.add({ targets: this.encounter, scale: 1, alpha: 1, duration: 260, ease: "Back.easeOut" });
      }
    }

    private showActionFeedback(xpGained: number, comboMilestone: boolean) {
      host.dataset.lastFeedback = comboMilestone ? "combo" : "success";
      const reward = this.add.text(this.player.x, 304, `+${xpGained} XP`, { fontFamily: "system-ui", fontSize: "22px", color: "#fde68a", fontStyle: "bold", stroke: "#451a03", strokeThickness: 5 }).setOrigin(0.5).setDepth(30);
      const ring = this.add.circle(this.player.x, 365, 34, 0x22d3ee, 0.12).setStrokeStyle(4, 0x67e8f9, 0.95).setDepth(29);
      if (this.reducedMotion) {
        this.time.delayedCall(360, () => { reward.destroy(); ring.destroy(); });
      } else {
        this.cameras.main.flash(90, 34, 211, 238, false);
        this.tweens.add({ targets: reward, y: "-=58", alpha: 0, duration: 650, ease: "Cubic.easeOut", onComplete: () => reward.destroy() });
        this.tweens.add({ targets: ring, scale: 2.1, alpha: 0, duration: 420, onComplete: () => ring.destroy() });
        for (let index = 0; index < 10; index += 1) {
          const spark = this.add.circle(this.player.x, 354, 4, index % 2 ? 0x67e8f9 : 0xfbbf24, 1).setDepth(28);
          const angle = (Math.PI * 2 * index) / 10;
          this.tweens.add({ targets: spark, x: `+=${Math.cos(angle) * 68}`, y: `+=${Math.sin(angle) * 48}`, alpha: 0, duration: 430, onComplete: () => spark.destroy() });
        }
      }
      if (comboMilestone) {
        const combo = this.add.text(480, 215, "COMBO SURGE!", { fontFamily: "system-ui", fontSize: "32px", color: "#fbbf24", fontStyle: "bold", stroke: "#451a03", strokeThickness: 6 }).setOrigin(0.5).setDepth(31);
        if (this.reducedMotion) this.time.delayedCall(500, () => combo.destroy());
        else this.tweens.add({ targets: combo, scale: { from: 0.72, to: 1.15 }, alpha: { from: 1, to: 0 }, duration: 760, ease: "Back.easeOut", onComplete: () => combo.destroy() });
      }
    }

    private showMissFeedback() {
      host.dataset.lastFeedback = "miss";
      const warning = this.add.text(480, 224, "KEEP MOVING", { fontFamily: "system-ui", fontSize: "28px", color: "#fca5a5", fontStyle: "bold", stroke: "#450a0a", strokeThickness: 6 }).setOrigin(0.5).setDepth(31);
      if (!this.reducedMotion) this.cameras.main.shake(140, 0.004);
      this.tweens.add({ targets: warning, alpha: 0, duration: this.reducedMotion ? 360 : 680, onComplete: () => warning.destroy() });
    }

    private showCompletion() {
      if (this.completionLayer) return;
      host.dataset.lastFeedback = "complete";
      this.encounter?.setVisible(false);
      const portal = this.add.circle(785, 335, 58, 0x22d3ee, 0.2).setStrokeStyle(8, 0x67e8f9, 0.95);
      const glow = this.add.circle(785, 335, 85, 0xfbbf24, 0.12);
      const title = this.add.text(480, 202, "VOLCANO ESCAPED!", { fontFamily: "system-ui", fontSize: "38px", color: "#fef3c7", fontStyle: "bold", stroke: "#451a03", strokeThickness: 7 }).setOrigin(0.5);
      const copy = this.add.text(480, 250, "Mission complete · Results ready", { fontFamily: "system-ui", fontSize: "17px", color: "#a7f3d0", fontStyle: "bold" }).setOrigin(0.5);
      this.completionLayer = this.add.container(0, 0, [glow, portal, title, copy]).setDepth(25);
      if (!this.reducedMotion) {
        this.tweens.add({ targets: glow, scale: 1.25, alpha: 0.04, yoyo: true, repeat: -1, duration: 780 });
        this.cameras.main.flash(220, 251, 191, 36, false);
      }
    }

    private renderUpdate(update: MissionSceneUpdate) {
      const view = missionSceneView(update);
      const feedback = this.previousUpdate ? missionPresentationFeedback(this.previousUpdate.snapshot, update.snapshot) : null;
      this.objective.setText(view.objective);
      this.status.setText(view.status);
      this.progressLabel.setText(view.progressLabel);
      this.progressFill.width = 850 * view.progress;
      this.comboText.setText(`COMBO ×${update.snapshot.combo}`);
      this.xpText.setText(`${update.snapshot.xpEarned} XP`);
      this.showEncounter(update.target, update.encounter ?? { index: 1, total: 1 });
      if (this.reducedMotion) this.player.x = view.playerX;
      else this.tweens.add({ targets: this.player, x: view.playerX, duration: 280, ease: "Cubic.easeOut" });
      this.pauseVeil.setVisible(update.snapshot.status === "paused" || update.snapshot.status === "recovery");
      if (feedback?.completed) this.showCompletion();
      else {
        if (feedback?.xpGained) this.showActionFeedback(feedback.xpGained, feedback.comboMilestone);
        if (feedback?.missAdded) this.showMissFeedback();
      }
      this.previousUpdate = update;
    }

    update(_time: number, delta: number) {
      if (this.frameSamples.length >= 120) return;
      this.frameSamples.push(delta);
      if (this.frameSamples.length === 120) {
        host.dataset.frameAverageMs = (
          this.frameSamples.reduce((sum, value) => sum + value, 0) / this.frameSamples.length
        ).toFixed(2);
      }
    }
  };
}
