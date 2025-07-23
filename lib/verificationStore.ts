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
    for (const [key, data] of this.store.entries()) {
      if (now > data.expires) {
        this.store.delete(key);
      }
    }
  }
}

// Create a singleton instance
const verificationStore = new VerificationStore();

// Cleanup expired codes every 5 minutes
setInterval(() => {
  verificationStore.cleanup();
}, 5 * 60 * 1000);

export default verificationStore;