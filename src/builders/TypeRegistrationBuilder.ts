import { Container } from '../container/Container';
import { Strategy, StrategyResolver } from '../resolvers/StrategyResolver';
import { RegistrationBuilderBase } from './RegistrationBuilderBase';

export class TypeRegistrationBuilder<T> extends RegistrationBuilderBase<T> {
    public constructor(container: Container, private readonly type: { new (...args: any[]): T }) {
        super(container);
        this.instancePerDependency();
    }

    public singleInstance() {
        this.resolver.strategy = new StrategyResolver(Strategy.Singleton, this.type);

        return this;
    }

    public instancePerScoped() {
        this.resolver.strategy = new StrategyResolver(Strategy.Scoped, this.type);

        return this;
    }

    public instancePerDependency() {
        this.resolver.strategy = new StrategyResolver(Strategy.Transient, this.type);

        return this;
    }

    public asSelf() {
        this.as(this.type);

        return this;
    }
}
