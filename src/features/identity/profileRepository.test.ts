import { describe, expect, it } from "vitest";
import { createLocalProfileRepository, FITNESS_PROFILE_STORAGE_KEY } from "./profileRepository";
import { defaultFitnessProfileInput } from "./profileSchema";

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
    values,
  };
}

describe("local profile repository", () => {
  it("saves, validates, reloads, and edits a versioned guest profile", () => {
    const storage = memoryStorage();
    const repository = createLocalProfileRepository(storage);
    const first = repository.save(defaultFitnessProfileInput);
    expect(repository.load()).toEqual(first);
    const edited = repository.save({ ...defaultFitnessProfileInput, heightCm: 181 }, first.guestId);
    expect(edited.guestId).toBe(first.guestId);
    expect(repository.load()?.heightCm).toBe(181);
  });

  it("rejects invalid input and ignores corrupt stored data", () => {
    const storage = memoryStorage();
    const repository = createLocalProfileRepository(storage);
    expect(() => repository.save({ ...defaultFitnessProfileInput, weightKg: 10 })).toThrow();
    storage.setItem(FITNESS_PROFILE_STORAGE_KEY, "not-json");
    expect(repository.load()).toBeNull();
  });
});
