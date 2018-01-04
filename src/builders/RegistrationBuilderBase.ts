import { Container } from '../container/Container';
import { IResolver } from '../resolvers/Resolver';
import { Key } from '../types';

class RegistrationResolver implements IResolver<any> {
    public strategy: IResolver<any>;
    public get(container: Container, key: Key<any>): any {
        return this.strategy.get(container, key);
    }
}

export class RegistrationBuilderBase<T, Resolver extends IResolver<any> = RegistrationResolver> {
    private registeredKey?: Key<T>;
    public constructor(
        protected readonly container: Container,
        protected readonly resolver: Resolver = new RegistrationResolver() as any) {
    }

    public as(...keys: Array<Key<T>>) {
        for (const key of keys) {
            if (!this.registeredKey) {
                this.registeredKey = key;
                this.container.registerResolver(this.registeredKey, this.resolver);
            } else {
                this.container.registerAlias(this.registeredKey, key);
            }
        }

        return this;
    }
}
