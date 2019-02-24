/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import { Container } from '../container/Container';
import { containerResolver } from '../protocol/resolver';
import { Key, Resolver, ConstructorOf, Strategy } from '../types';

/**
 * Used to inject a new instance of a dependency, without regard for existing
 * instances in the container. Instances can optionally be registered in the container
 * under a different key by supplying a key using the `as` method.
 */
@containerResolver
export class NewInstanceResolver<T = any> implements Resolver<T> {
    /**
     * Creates an NewInstance Resolver for the supplied key.
     * @param key The key to resolve/instantiate.
     * @param dynamicDependencies An optional list of dynamic dependencies.
     * @return Returns an instance of NewInstance for the key.
     */
    public static of<T>(key: Key<T>, ...dynamicDependencies: any[]) {
        return new NewInstanceResolver<T>(key, ...dynamicDependencies);
    }

    /** @internal */
    public _key: Key<T>;
    /** @internal */
    public _asKey: Key<any>;
    /** @internal */
    public _dynamicDependencies: any[];

    /**
     * Creates an instance of the NewInstance class.
     * @param key The key to resolve/instantiate.
     * @param dynamicDependencies An optional list of dynamic dependencies.
     */
    public constructor(key: Key<T>, ...dynamicDependencies: any[]) {
        this._key = key;
        this._asKey = key as any;
        this._dynamicDependencies = dynamicDependencies;
    }

    /**
     * Called by the container to instantiate the dependency and potentially register
     * as another key if the `as` method was used.
     * @param container The container to resolve the parent from.
     * @return Returns the matching instance from the parent container
     */
    public get(container: Container, key: Key<T>): T {
        const dynamicDependencies =
            this._dynamicDependencies.length > 0
                ? this._dynamicDependencies.map(dependency =>
                      dependency['protocol:aurelia:resolver']
                          ? dependency.get(container)
                          : container.get(dependency)
                  )
                : undefined;

        let _key = this._key;
        const resolver = container.getResolver(_key as any);
        if (resolver && (resolver as any).strategy === Strategy.Function) {
            _key = (resolver as any).state;
        }

        const instance = container.invoke<T>(_key as any, dynamicDependencies);
        container.registerInstance(this._asKey, instance);

        return instance;
    }

    /**
     * Instructs the NewInstance resolver to register the resolved instance using the supplied key.
     * @param key The key to register the instance with.
     * @return Returns the NewInstance resolver.
     */
    public as(key: Key<T>) {
        this._asKey = key;

        return this;
    }
}
