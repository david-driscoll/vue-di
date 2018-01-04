import { IResolver } from './resolvers';

export type Key<T> = string | symbol | { new (...args: any[]): T } | IResolver<T>;
export type Factory<T> = { (...args: any[]) : T; new (...args: any[]) : T; };
