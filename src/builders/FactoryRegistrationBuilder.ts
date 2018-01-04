import { Container } from '../container/Container';
import { IContainer } from '../container/IContainer';
import { IResolver } from '../resolvers/Resolver';
import { Strategy } from '../resolvers/StrategyResolver';
import { Key } from '../types';
import { RegistrationBuilderBase } from './RegistrationBuilderBase';

export type FactoryMethod<T> = (container: IContainer, key?: Key<T>) => T;

class RegistrationFactoryResolver implements IResolver<any> {
    public strategy = Strategy.Instance;
    private instance: any;
    public constructor(private readonly factory: FactoryMethod<any>) { }

    public get(container: Container, key: Key<any>): any {
        if (this.strategy === Strategy.Singleton) {
            if (!this.instance) {
                this.instance = this.factory(container, key);
            }

            return this.instance;
        }

        return this.factory(container, key);
    }
}

export class FactoryRegistrationBuilder<T> extends RegistrationBuilderBase<T, RegistrationFactoryResolver> {
    public constructor(
        container: Container,
        factory: FactoryMethod<T>
    ) {
        super(container, new RegistrationFactoryResolver(factory));
        this.instancePerDependency();
    }

    public singleInstance() {
        this.resolver.strategy = Strategy.Singleton;

        return this;
    }

    public instancePerDependency() {
        this.resolver.strategy = Strategy.Transient;

        return this;
    }
}
