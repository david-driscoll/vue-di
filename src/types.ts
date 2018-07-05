import { Container } from './container/Container';

/**
 * Used to allow functions/classes to specify custom dependency resolution logic.
 */
export type TypedKey<T> = { new (...args: any[]): T } | Resolver<T>;
export type Key<T> = string | symbol | TypedKey<T>;
// tslint:disable-next-line:interface-name
export interface IFactory<T> {
    (...args: any[]): T;
    new (...args: any[]): T;
}
export type ILazy<T> = () => T;

// tslint:disable-next-line:interface-name
export interface Resolver<T> {
    get(container: Container, key: Key<T>): T;
}

export type FactoryMethod<T> = (container: Container, key?: Key<T>) => T;


export function isResolver(value: any): value is Resolver<any> {
    return value.get && typeof value.get === 'function';
}
