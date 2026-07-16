import test from "node:test";
import assert from "node:assert/strict";
import { createGameState, registerMiss, updateGameState } from "./gameState.js";

test("one miss does not end the run and three misses do",()=>{const s=createGameState();registerMiss(s);assert.equal(s.phase,"running");registerMiss(s);registerMiss(s);assert.equal(s.phase,"game-over")});
test("jump action launches the player",()=>{const s=createGameState();updateGameState(s,.016,"jump",()=>0);assert.equal(s.player.grounded,false);assert.ok(s.player.y<410)});
test("obstacles spawn and score advances",()=>{const s=createGameState();s.spawnIn=0;updateGameState(s,.016,"none",()=>0);assert.equal(s.obstacles.length,1);assert.ok(s.score>0)});
