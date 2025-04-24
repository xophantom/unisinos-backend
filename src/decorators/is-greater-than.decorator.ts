import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsGreaterOrEqualThan(property: string, validationOptions?: ValidationOptions) {
  return function createIsGreaterOrEqualThanDecorator(object: object, propertyName: string) {
    registerDecorator({
      name: 'IsGreaterOrEqualThan',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = args.object[relatedPropertyName];
          return value >= relatedValue;
        },
      },
    });
  };
}
