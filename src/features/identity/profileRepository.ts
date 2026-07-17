import { fitnessProfileSchema, type FitnessProfile, type FitnessProfileInput } from "./profileSchema";

export const FITNESS_PROFILE_STORAGE_KEY = "ai-fitness-escape:fitness-profile:v1";

export type ProfileRepository = {
  load(): FitnessProfile | null;
  save(input: FitnessProfileInput, existingGuestId?: string): FitnessProfile;
  clear(): void;
};

function createGuestId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createLocalProfileRepository(storage: Pick<Storage, "getItem" | "setItem" | "removeItem">): ProfileRepository {
  return {
    load() {
      const stored = storage.getItem(FITNESS_PROFILE_STORAGE_KEY);
      if (!stored) return null;
      try {
        const parsed = fitnessProfileSchema.safeParse(JSON.parse(stored));
        return parsed.success ? parsed.data : null;
      } catch {
        return null;
      }
    },
    save(input, existingGuestId) {
      const profile = fitnessProfileSchema.parse({
        ...input,
        schemaVersion: 1,
        guestId: existingGuestId ?? createGuestId(),
        updatedAt: new Date().toISOString(),
      });
      storage.setItem(FITNESS_PROFILE_STORAGE_KEY, JSON.stringify(profile));
      return profile;
    },
    clear() {
      storage.removeItem(FITNESS_PROFILE_STORAGE_KEY);
    },
  };
}

export type AccountService = {
  availability: "unavailable" | "configured";
};

export const unavailableAccountService: AccountService = { availability: "unavailable" };
