import { Container } from '../container/Container';
import { Strategy } from '../resolvers/StrategyResolver';
import { FactoryMethod, Key, Resolver } from '../types';
import { RegistrationBuilderBase } from './RegistrationBuilderBase';

class RegistrationFactoryResolver implements Resolver<any> {
    public strategy = Strategy.Instance;
    private instance: any;
    public constructor(private readonly factory: FactoryMethod<any>) {}

    public get(container: Container, key: Key<any>): any {
        if (this.strategy === Strategy.Singleton || this.strategy === Strategy.Scoped) {
            if (!this.instance) {
                this.instance = this.factory(container, key);
            }

            return this.instance;
        }

        return this.factory(container, key);
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

    public instancePerScoped() {
        this.resolver.strategy = Strategy.Scoped;

        return this;
    }

    public instancePerDependency() {
        this.resolver.strategy = Strategy.Transient;

        return this;
    }
}
