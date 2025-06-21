import { validateSync } from 'class-validator';

export abstract class ClassValidatorFields<PropsValidated> {
  errors: string[] = null;
  validatedData: PropsValidated = null;

  validate(data: any): boolean {
    const errors = validateSync(data);

    if (errors.length) {
      this.errors = errors.map((error) => {
        return Object.values(error.constraints).join(', ');
      });
    } else {
      this.validatedData = data as PropsValidated;
    }

    return !errors.length;
  }

  static validate(data: any): string[] | null {
    const errors = validateSync(data);

    if (errors.length) {
      return errors.map((error) => {
        return Object.values(error.constraints).join(', ');
      });
    }

    return null;
  }
}
