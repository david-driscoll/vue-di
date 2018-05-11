import { Container } from '../container/Container';
import { Key, Resolver } from '../types';

class RegistrationResolver implements Resolver<any> {
    public strategy!: Resolver<any>;
    public get(container: Container, key: Key<any>): any {
        return this.strategy.get(container, key);
    }
}

export class RegistrationBuilderBase<T> {
    private registeredKey?: Key<T>;
    public constructor(
        protected readonly container: Container,
        protected readonly resolver = new RegistrationResolver() as any
    ) {}

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
