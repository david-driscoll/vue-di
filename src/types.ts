import { IResolver } from './resolvers';

export type Key<T> = string | symbol | { new (...args: any[]): T } | IResolver<T>;
