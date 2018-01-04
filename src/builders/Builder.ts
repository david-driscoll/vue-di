import { Container } from '../container/Container';
import { IResolver } from '../resolvers/Resolver';
import { Strategy, StrategyResolver } from '../resolvers/StrategyResolver';
import { Key } from '../types';
import { FactoryMethod, FactoryRegistrationBuilder } from './FactoryRegistrationBuilder';
import { InstanceRegistrationBuilder } from './InstanceRegistrationBuilder';
import { TypeRegistrationBuilder } from './TypeRegistrationBuilder';

export class Builder {
    public constructor(private readonly container: Container) { }

    public registerType<T>(key: { new(...args: any[]): T }) {
        return new TypeRegistrationBuilder(this.container, key);
    }

    public registerInstance<T>(key: T) {
        return new InstanceRegistrationBuilder<T>(this.container, key);
    }

    public register<T>(factory: FactoryMethod<T>) {
        return new FactoryRegistrationBuilder<T>(this.container, factory);
    }
}
