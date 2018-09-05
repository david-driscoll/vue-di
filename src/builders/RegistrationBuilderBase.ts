import { Container } from '../container/Container';
import { Key, Resolver, IStrategyResolver } from '../types';

export class RegistrationBuilderBase<T, TResolver extends IStrategyResolver<T> = IStrategyResolver<T>> {
    private registeredKey?: Key<T>;
    public constructor(
        protected readonly container: Container,
        protected readonly resolver: TResolver
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
