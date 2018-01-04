/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import { Container } from '../container/Container';
import { resolver } from '../decorators/resolver';
import { Key } from '../types';
import { IResolver } from './Resolver';

export enum Strategy {
    Unset = -1,
    Instance = 0,
    Singleton = 1,
    Transient = 2,
    Function = 3,
    Array = 4,
    Alias = 5,
}

@resolver
export class StrategyResolver<T = any> implements IResolver<T> {
    public strategy: StrategyResolver<T> | Strategy;
    public state: any;

    /**
     * Creates an instance of the StrategyResolver class.
     * @param strategy The type of resolution strategy.
     * @param state The state associated with the resolution strategy.
     */
    public constructor(strategy: Strategy, state: any) {
        this.strategy = strategy;
        this.state = state;
    }

    /**
     * Called by the container to allow custom resolution of dependencies for a function/class.
     * @param container The container to resolve from.
     * @param key The key that the resolver was registered as.
     * @return Returns the resolved object.
     */
    public get(container: Container, key?: Key<T>): any {
        switch (this.strategy) {
            case Strategy.Instance:
                return this.state;
            case Strategy.Singleton:
                const singleton = container.invoke(this.state);
                this.state = singleton;
                this.strategy = Strategy.Instance;

                return singleton;
            case Strategy.Transient:
                return container.invoke(this.state);
            case Strategy.Function:
                return this.state(container, key, this);
            case Strategy.Array:
                return this.state[0].get(container, key);
            case Strategy.Alias:
                return container.get(this.state);
            default:
                throw new Error('Invalid strategy: ' + this.strategy);
        }
    }
}
