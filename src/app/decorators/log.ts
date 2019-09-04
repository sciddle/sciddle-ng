/**
 * Method decorator that logs method name
 */
export function Log(): MethodDecorator {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = (...args: any[]) => {
      console.log(`%c++ ${propertyKey}`, 'color: grey');
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
