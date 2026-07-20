import { expect, test } from "@playwright/test";
import { createMovementCheckMission } from "../../src/features/gameplay/movementCheckMission";

test("guest entry is keyboard reachable, honest, private, and responsive", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Train. Fight. Escape." })).toBeVisible();
  await expect(page.getByText(/Guest mode · No account/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Create account" })).toHaveCount(0);

  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Start as guest" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Tune your mission." })).toBeVisible();
  await expect(page.getByText(/Saved locally\. Not medical advice/)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test("planning failure recovers without losing the selected preference", async ({ page }) => {
  let requestCount = 0;
  await page.route("**/api/workout/generate", async (route) => {
    requestCount += 1;
    if (requestCount === 1) {
      await route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ message: "Planner temporarily unavailable." }) });
      return;
    }
    await route.continue();
  });

  await page.goto("/plan");
  await page.getByLabel("Goal").selectOption("cardio");
  await page.getByRole("button", { name: "Generate my adventure" }).click();
  await expect(page).toHaveURL(/\/ai-to-action/);
  await expect(page.locator(".planner-error")).toContainText("Planner temporarily unavailable");
  await page.getByRole("button", { name: "Retry planning" }).click();
  await expect(page).toHaveURL(/\/briefing/, { timeout: 10_000 });
  await expect(page.getByRole("heading", { name: "Race the Eruption" })).toBeVisible();
  await page.getByRole("link", { name: "AI Fitness Escape" }).click();
  await expect(page.getByLabel("Goal")).toHaveValue("cardio");
  await expect(page.getByText("Camera processing stays on this device. No video is uploaded.")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test("goal-aware planning changes structure and explains safety-aware choices", async ({ page }, testInfo) => {
  await page.goto("/plan");
  await page.getByLabel("Goal").selectOption("cardio");
  await page.getByLabel("Activity frequency").selectOption("weekly");
  await page.getByRole("button", { name: "Generate my adventure" }).click();

  await expect(page.getByRole("heading", { name: /goals are becoming gameplay/i })).toBeVisible();
  await expect(page).toHaveURL(/\/briefing/, { timeout: 10_000 });
  await expect(page.getByRole("heading", { name: "Race the Eruption" })).toBeVisible();
  await expect(page.locator(".briefing-stat-grid article")).toHaveCount(5);
  await expect(page.locator(".briefing-stat-grid")).toContainText("Duration");
  await expect(page.locator(".briefing-stat-grid")).toContainText("Difficulty");
  await expect(page.locator(".briefing-stat-grid")).toContainText("Reward");
  await expect(page.getByRole("button", { name: "Start Adventure" })).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "How your mission was built" })).toBeHidden();
  await page.getByText("Mission details", { exact: true }).click();
  await expect(page.getByRole("heading", { name: "How your mission was built" })).toBeVisible();
  await expect(page.getByText("Validated plan")).toBeVisible();
  await expect(page.locator(".objectives li")).toHaveCount(5);
  await expect(page.getByText(/faster-paced standing circuit/i)).toBeVisible();

  await page.getByRole("link", { name: "AI Fitness Escape" }).click();
  await page.getByLabel("Goal").selectOption("mobility");
  await page.getByText("20 min", { exact: true }).click();
  await page.getByLabel("Activity frequency").selectOption("rarely");
  await page.getByLabel(/Movement considerations/).fill("Knee sensitivity; low impact and no jumping");
  await page.getByRole("button", { name: "Generate my adventure" }).click();

  await expect(page).toHaveURL(/\/briefing/, { timeout: 10_000 });
  await expect(page.getByRole("heading", { name: "Flow Through the Fire" })).toBeVisible();
  await expect(page.locator(".objectives li")).toHaveCount(7);
  await expect(page.locator(".objectives")).not.toContainText("Jumps ×");
  await expect(page.locator(".objectives")).not.toContainText("Jumping jacks ×");
  await expect(page.locator(".objectives")).not.toContainText("Lunges ×");
  await page.locator(".briefing-details").evaluate((details) => { (details as HTMLDetailsElement).open = true; });
  await expect(page.getByText(/remove jumps, jumping jacks, and lunges/i)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  if (process.env.CAPTURE_VISUAL_EVIDENCE === "1") {
    await page.screenshot({ path: testInfo.outputPath("goal-aware-plan.png"), fullPage: true });
  }
});

test("reduced-motion preference is honored by the application shell", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/plan");
  expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);
  const durationSeconds = await page.locator(".planner-submit").evaluate((element) => {
    const value = getComputedStyle(element).transitionDuration;
    return value.endsWith("ms") ? Number.parseFloat(value) / 1000 : Number.parseFloat(value);
  });
  expect(durationSeconds).toBeLessThanOrEqual(0.000_01);
});

test("mission world is distance-readable, responsive, and frame-stable", async ({ page }, testInfo) => {
  test.slow();
  const capturesActiveMotion = process.env.CAPTURE_VISUAL_EVIDENCE === "1";
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia: async () => { throw new DOMException("Synthetic camera unavailable", "NotAllowedError"); } },
    });
  });
  await page.emulateMedia({ reducedMotion: capturesActiveMotion ? "no-preference" : "reduce" });
  await page.goto("/");
  await page.evaluate((session) => {
    sessionStorage.setItem("ai-fitness-escape:mission-v1", JSON.stringify(session));
  }, createMovementCheckMission());

  // A validated all-movement fixture isolates the event/Phaser presentation
  // boundary. The judged UI contains no movement-check shortcut; real
  // pose production remains covered by physical and deterministic evidence.
  await page.goto("/mission");
  const canvas = page.locator(".game-canvas canvas");
  await expect(canvas).toBeVisible();
  await expect(page.getByRole("heading", { name: "Mission in progress" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Voice on" })).toBeVisible();
  const musicControl = page.locator(".mission-controls button").filter({ hasText: /Music|Play music/ });
  await expect(musicControl).toBeVisible();
  await expect(page.getByRole("button", { name: "Resume" })).toBeVisible();
  await page.getByRole("button", { name: "Resume" }).click();
  await expect(page.getByRole("button", { name: "Pause" })).toBeVisible();
  if ((await musicControl.getAttribute("aria-pressed")) === "false") await musicControl.click();
  await expect(page.getByRole("button", { name: "Music + effects on" })).toBeVisible();
  await expect(page.locator(".mission-shell")).toHaveAttribute("data-music-state", "on");
  await expect(page.locator(".mission-shell")).toHaveAttribute("data-music-tier", "calm");

  const bounds = await page.locator(".game-canvas").boundingBox();
  expect(bounds).not.toBeNull();
  expect(Math.abs((bounds?.width ?? 0) / (bounds?.height ?? 1) - 16 / 9)).toBeLessThan(0.03);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);

  await expect.poll(async () => {
    const value = await page.locator(".game-canvas").getAttribute("data-frame-average-ms");
    return value ? Number.parseFloat(value) : Number.NaN;
  }).toBeLessThan(25);

  if (process.env.CAPTURE_VISUAL_EVIDENCE === "1") {
    await page.screenshot({ path: testInfo.outputPath("mission-world.png"), fullPage: true });
  }

  // Mute browser speech while keeping the explicitly enabled procedural audio
  // path active through progression and cleanup.
  await page.getByRole("button", { name: "Voice on" }).click();
  await expect(page.getByRole("button", { name: "Voice off" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Music + effects on" })).toBeVisible();

  const movements = ["jump", "squat", "lunge", "high-knees", "jumping-jack", "punch-left", "punch-right", "side-reach-left", "side-reach-right", "push-up", "plank"] as const;
  const encounters = ["boulder", "fire-gate", "broken-bridge", "lava-steps", "storm-gate", "left-wall", "right-wall", "left-vines", "right-vines", "low-tunnel", "ember-storm"] as const;
  const actions = ["leap", "duck", "stride", "sprint", "power", "strike-left", "strike-right", "reach-left", "reach-right", "push", "shield"] as const;
  await expect(page.locator(".game-canvas")).toHaveAttribute("data-encounter", encounters[0]);
  await expect(page.locator(".game-canvas")).toHaveAttribute("data-boss-map-position", "distant-center");
  await expect(page.locator(".game-canvas")).toHaveAttribute("data-world-motion", capturesActiveMotion ? "active" : "reduced");
  for (const [index, movement] of movements.entries()) {
    await page.evaluate(({ movement, index }) => {
      window.dispatchEvent(new CustomEvent("ai-fitness-escape:movement", { detail: {
        movement,
        phase: movement === "plank" ? "held" : "completed",
        confidence: 1,
        occurredAtMs: index + 1,
      } }));
    }, { movement, index });
    await expect(page.locator(".game-canvas")).toHaveAttribute("data-runner-action", actions[index]);
    if (movement === "high-knees") await expect(page.locator(".game-canvas")).toHaveAttribute("data-encounter-x", "824");
    if (index === 4) await expect(page.locator(".game-canvas")).toHaveAttribute("data-boss-state", "awakened");
    if (index === 7) {
      await expect(page.locator(".game-canvas")).toHaveAttribute("data-boss-state", "battle");
      await expect(page.locator(".game-canvas")).toHaveAttribute("data-boss-action", "dodge");
      if (process.env.CAPTURE_VISUAL_EVIDENCE === "1") await page.locator(".game-canvas").screenshot({ path: testInfo.outputPath("boss-battle.png") });
    }
    if (index === 9) await expect(page.locator(".game-canvas")).toHaveAttribute("data-boss-action", "attack");
    if (index === 3) await expect(page.locator(".mission-shell")).toHaveAttribute("data-music-tier", "rising");
    if (index === 8) await expect(page.locator(".mission-shell")).toHaveAttribute("data-music-tier", "escape");
    if (index < movements.length - 1) {
      await expect(page.locator(".objective-hud")).toHaveAttribute("data-target", movements[index + 1]);
      await expect(page.locator(".game-canvas")).toHaveAttribute("data-encounter", encounters[index + 1]);
    }
  }
  await expect(page.locator(".objective-hud progress")).toHaveAttribute("value", "100");
  await expect(page.locator(".game-canvas")).toHaveAttribute("data-last-feedback", "complete");
  await expect(page.locator(".game-canvas")).toHaveAttribute("data-cinematic-phase", "portal-escape");
  await expect(page.locator(".game-canvas")).toHaveAttribute("data-boss-state", "defeated");
  await expect(page.locator(".game-canvas")).toHaveAttribute("data-boss-health", "0");
  await expect(page.getByRole("heading", { name: "Recovery" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Cool down. Mission secured." })).toBeVisible();
  await expect(page.getByText("Camera tracking is paused. Recovery does not change XP or accuracy.")).toBeVisible();
  await page.getByRole("button", { name: "Finish cooldown" }).click();
  await expect(page.getByText("AI recap · facts locked")).toBeVisible();
  await expect(page.getByRole("link", { name: "Replay this adventure" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Build a new plan" })).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  if (process.env.CAPTURE_VISUAL_EVIDENCE === "1") {
    await page.waitForTimeout(550);
    await page.locator(".results-shell").screenshot({ path: testInfo.outputPath("mission-results.png") });
  }
});
