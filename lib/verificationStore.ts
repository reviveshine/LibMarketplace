// Shared verification store for development
// In production, this should be replaced with a database or Redis

interface VerificationData {
  code: string;
  expires: number;
  attempts: number;
}

class VerificationStore {
  private store = new Map<string, VerificationData>();

  set(key: string, data: VerificationData): void {
    this.store.set(key, data);
  }

  get(key: string): VerificationData | undefined {
    return this.store.get(key);
  }

  delete(key: string): boolean {
    return this.store.delete(key);
  }

  cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.store.entries());
    for (const [key, data] of entries) {
      if (now > data.expires) {
        this.store.delete(key);
      }
    }
  }
}

// Create a singleton instance that survives Hot Module Replacement in development
declare global {
  var __verificationStore__: VerificationStore | undefined;
  var __cleanupInterval__: NodeJS.Timeout | undefined;
}

const verificationStore = global.__verificationStore__ || new VerificationStore();

if (process.env.NODE_ENV === 'development') {
  global.__verificationStore__ = verificationStore;
}

// Cleanup expired codes every 5 minutes
if (!global.__cleanupInterval__) {
  global.__cleanupInterval__ = setInterval(() => {
    verificationStore.cleanup();
  }, 5 * 60 * 1000);
}

export default verificationStore;