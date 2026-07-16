import test from "node:test";
import assert from "node:assert/strict";
import { createGameState, registerMiss, updateGameState } from "./gameState.js";

test("one miss does not end the run and three misses do",()=>{const s=createGameState();registerMiss(s);assert.equal(s.phase,"running");registerMiss(s);registerMiss(s);assert.equal(s.phase,"game-over")});
test("jump action launches the player",()=>{const s=createGameState();updateGameState(s,.016,"jump",()=>0);assert.equal(s.player.grounded,false);assert.ok(s.player.y<410)});
test("obstacles spawn and score advances",()=>{const s=createGameState();s.spawnIn=0;updateGameState(s,.016,"none",()=>0);assert.equal(s.obstacles.length,1);assert.ok(s.score>0)});

test("holding jump triggers only one jump until input returns to neutral",()=>{const s=createGameState();updateGameState(s,.016,"jump",()=>0);for(let i=0;i<120;i++)updateGameState(s,.016,"jump",()=>0);assert.equal(s.player.grounded,true);assert.equal(s.player.velocityY,0);updateGameState(s,.016,"none",()=>0);updateGameState(s,.016,"jump",()=>0);assert.equal(s.player.grounded,false)});

test("holding squat produces one bounded slide",()=>{const s=createGameState();for(let i=0;i<60;i++)updateGameState(s,.016,"squat",()=>0);assert.equal(s.player.action,"none");updateGameState(s,.016,"none",()=>0);updateGameState(s,.016,"squat",()=>0);assert.equal(s.player.action,"squat")});
