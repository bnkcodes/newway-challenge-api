import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidationArguments,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsPasswordValid(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isPasswordValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;

          // Mínimo 8 caracteres
          if (value.length < 8) return false;

          // Pelo menos uma letra maiúscula
          if (!/[A-Z]/.test(value)) return false;

          // Pelo menos uma letra minúscula
          if (!/[a-z]/.test(value)) return false;

          // Pelo menos um número
          if (!/\d/.test(value)) return false;

          // Pelo menos um caractere especial
          if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return false;

          return true;
        },
        defaultMessage() {
          return 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character';
        },
      },
    });
  };
}

export function Match(property: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'Match' })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = args.object[relatedPropertyName];
    return value === relatedValue;
  }
}
