import { Container } from '../container/Container';
import { Strategy, StrategyResolver } from '../resolvers/StrategyResolver';
import { RegistrationBuilderBase } from './RegistrationBuilderBase';

export class InstanceRegistrationBuilder<T> extends RegistrationBuilderBase<T> {
    public constructor(container: Container, instance: T) {
        super(container, new StrategyResolver(Strategy.Instance, instance));
    }
}
