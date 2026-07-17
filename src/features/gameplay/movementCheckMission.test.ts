import {describe,expect,it} from "vitest";
import {supportedMovements,validateAdventureForWorkout} from "@/contracts";
import {createMovementCheckMission} from "./movementCheckMission";

describe("full movement check mission",()=>{it("creates one playable objective for every registered movement",()=>{const {workout,adventure}=createMovementCheckMission();expect(workout.exercises.map(exercise=>exercise.movement)).toEqual(supportedMovements);expect(workout.exercises.every(exercise=>exercise.target===1)).toBe(true);expect(validateAdventureForWorkout(adventure,workout).success).toBe(true)})});
