import { Container } from './container/Container';

/**
 * Used to allow functions/classes to specify custom dependency resolution logic.
 */

export type ConstructorOf<C> = { new (...args: any[]): C };
export type TypedKey<T> = ConstructorOf<T> | Resolver<T>;
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

// tslint:disable-next-line:interface-name
export interface IWrappedResolver<T> {
    get(value: T, container: Container, key: Key<T>): T;
}

export interface IStrategyResolver<T> extends Resolver<T> {
    strategy: Strategy;
    clone(): IStrategyResolver<T>;
}

export function isStrategyResolver(value: any): value is IStrategyResolver<any> {
    return value && value.strategy && value.get;
}

export type FactoryMethod<T> = (container: Container, key?: Key<T>) => T;


export function isResolver(value: any): value is Resolver<any> {
    return value.get && typeof value.get === 'function';
}

export enum Strategy {
    Unset = -1,
    Instance = 0,
    Singleton = 1,
    Transient = 2,
    Function = 3,
    Array = 4,
    Alias = 5,
    Scoped = 6,
}
