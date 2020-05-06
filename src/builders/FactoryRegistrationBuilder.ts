import { Container } from '../container/Container';
import { Strategy } from '../resolvers/StrategyResolver';
import { FactoryMethod, Key, Resolver, IStrategyResolver } from '../types';
import { RegistrationBuilderBase } from './RegistrationBuilderBase';

class RegistrationFactoryResolver<T> implements IStrategyResolver<T> {
    private instance!: T;
    public constructor(
        private readonly factory: FactoryMethod<T>,
        public strategy = Strategy.Instance
    ) {}

    public get(container: Container, key: Key<T>): T {
        if (this.strategy === Strategy.Singleton || this.strategy === Strategy.Scoped) {
            if (!this.instance) {
                this.instance = this.factory(container, key);
            }

            return this.instance;
        }

        return this.factory(container, key);
    }

    public clone() {
        return new RegistrationFactoryResolver<T>(this.factory, this.strategy);
    }
}

export class FactoryRegistrationBuilder<T> extends RegistrationBuilderBase<T> {
    public constructor(container: Container, factory: FactoryMethod<T>) {
        super(container, new RegistrationFactoryResolver(factory));
        this.instancePerDependency();
    }

    public singleInstance() {
        this.resolver.strategy = Strategy.Singleton;

        return this;
    }

    public instancePerScope() {
        this.resolver.strategy = Strategy.Scoped;

        return this;
    }

    public instancePerDependency() {
        this.resolver.strategy = Strategy.Transient;

        return this;
    }
}
