import { Container } from '../container/Container';
import { Strategy, StrategyResolver } from '../resolvers/StrategyResolver';
import { RegistrationBuilderBase } from './RegistrationBuilderBase';

export class TypeRegistrationBuilder<T> extends RegistrationBuilderBase<T, StrategyResolver<T>> {
    public constructor(container: Container, private readonly type: { new (...args: any[]): T }) {
        super(container, new StrategyResolver<T>(Strategy.Transient, type));
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

    public asSelf() {
        this.as(this.type);

        return this;
    }
}
