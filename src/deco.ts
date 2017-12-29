import { autoinject } from 'aurelia-dependency-injection';

// tslint:disable:ban-types
export function lazy(keyValue: symbol | string | Function): ParameterDecorator {
    return (target: Object, propertyKey: string | symbol) => {};
}
export type lazy<T> = () => T;

@autoinject
class A {
    constructor(@lazy('abcd') a: lazy<Object>) {

    }
}
