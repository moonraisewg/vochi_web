// Pure form-validation helpers for /reset-password — kept free of React so
// they're trivially unit-testable, matching the lib/apiBase.ts pattern.

export function passwordsMismatch(password: string, confirm: string): boolean {
  return confirm.length > 0 && password !== confirm;
}

export function canSubmitReset(password: string, confirm: string): boolean {
  return password.length >= 8 && password === confirm;
}
