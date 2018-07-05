/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import { Container } from '../container/Container';
import { containerResolver } from '../protocol/resolver';
import { Key, Resolver } from '../types';

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

@containerResolver
export class StrategyResolver<T> implements Resolver<T> {
    public strategy: StrategyResolver<T> | Strategy;
    public state: any;
    public originalState: any;
    private _resolved = false;

    /**
     * Creates an instance of the StrategyResolver class.
     * @param strategy The type of resolution strategy.
     * @param state The state associated with the resolution strategy.
     */
    public constructor(strategy: Strategy, state: any) {
        this.strategy = strategy;
        this.state = this.originalState = state;
    }

    /**
     * Called by the container to allow custom resolution of dependencies for a function/class.
     * @param container The container to resolve from.
     * @param key The key that the resolver was registered as.
     * @return Returns the resolved object.
     */
    public get(container: Container, key: Key<T>): any {
        switch (this.strategy) {
            case Strategy.Instance:
                return this.state;
            case Strategy.Singleton:
                if (this._resolved) return this.state;
                const singleton = container.invokeWithKey(this.state, key);
                this.state = singleton;
                this._resolved = true;

                return singleton;
            case Strategy.Scoped:
                if (this._resolved) return this.state;
                const scoped = container.invokeWithKey(this.state, key);
                this.state = scoped;
                this._resolved = true;

                return scoped;
            case Strategy.Transient:
                return container.invokeWithKey(this.state, key);
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
