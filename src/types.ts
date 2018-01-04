import { IContainer } from './container';

/**
 * Used to allow functions/classes to specify custom dependency resolution logic.
 */
export type Key<T> = string | symbol | { new(...args: any[]): T } | { get(container: IContainer, key: Key<T>): T };
// tslint:disable-next-line:interface-over-type-literal
export type Factory<T> = { (...args: any[]): T; new(...args: any[]): T };
export type Lazy<T> = () => T;

export function isResolver(value: any): value is Resolver<any> {
    return value.get && typeof value.get === 'function';
}

// tslint:disable-next-line:interface-over-type-literal
export type Resolver<T> = { get(container: IContainer, key: Key<T>): T };
