// Utility for persisting onboarding state across Internet Identity login redirects

const ONBOARDING_EMAIL_KEY = 'shanju_onboarding_email';
const ONBOARDING_REDIRECT_KEY = 'shanju_onboarding_redirect';

export const onboardingStorage = {
  // Email persistence
  setEmail(email: string): void {
    try {
      sessionStorage.setItem(ONBOARDING_EMAIL_KEY, email);
    } catch (error) {
      console.warn('Failed to store onboarding email:', error);
    }
  },

  getEmail(): string | null {
    try {
      return sessionStorage.getItem(ONBOARDING_EMAIL_KEY);
    } catch (error) {
      console.warn('Failed to retrieve onboarding email:', error);
      return null;
    }
  },

  clearEmail(): void {
    try {
      sessionStorage.removeItem(ONBOARDING_EMAIL_KEY);
    } catch (error) {
      console.warn('Failed to clear onboarding email:', error);
    }
  },

  // Redirect target persistence
  setRedirectTarget(path: string): void {
    try {
      sessionStorage.setItem(ONBOARDING_REDIRECT_KEY, path);
    } catch (error) {
      console.warn('Failed to store redirect target:', error);
    }
  },

  getRedirectTarget(): string | null {
    try {
      return sessionStorage.getItem(ONBOARDING_REDIRECT_KEY);
    } catch (error) {
      console.warn('Failed to retrieve redirect target:', error);
      return null;
    }
  },

  clearRedirectTarget(): void {
    try {
      sessionStorage.removeItem(ONBOARDING_REDIRECT_KEY);
    } catch (error) {
      console.warn('Failed to clear redirect target:', error);
    }
  },

  // Atomically read and clear redirect target to avoid double-navigation
  consumeRedirectTarget(): string | null {
    const target = this.getRedirectTarget();
    if (target) {
      this.clearRedirectTarget();
    }
    return target;
  },

  // Clear all onboarding data
  clearAll(): void {
    this.clearEmail();
    this.clearRedirectTarget();
  }
};
