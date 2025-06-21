export class PasswordRequirements {
  minLength: number;
  maxLength: number;

  constructor() {
    this.minLength = 8;
    this.maxLength = 20;
  }
}

export const passwordRequirements = new PasswordRequirements();
