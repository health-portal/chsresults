import { nanoid } from 'nanoid';

export function generateAccountActivationToken() {
  return {
    tokenString: nanoid(32),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };
}

export function generateResetPasswordToken() {
  return {
    tokenString: nanoid(32),
    expiresAt: new Date(Date.now() + 15 * 60 * 60 * 1000),
  };
}
