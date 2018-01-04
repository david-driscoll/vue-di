import { IResolver } from './resolvers';

export type Key<T> = string | symbol | { new(...args: any[]): T } | IResolver<T>;
// tslint:disable-next-line:interface-over-type-literal
export type Factory<T> = { (...args: any[]): T; new(...args: any[]): T };
export type Lazy<T> = () => T;
