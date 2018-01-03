/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import { Container } from '../container/Container';
import { resolver } from '../decorators/resolver';
import { Key } from '../types';

/**
 * Used to inject a new instance of a dependency, without regard for existing
 * instances in the container. Instances can optionally be registered in the container
 * under a different key by supplying a key using the `as` method.
 */
@resolver
export class NewInstanceResolver {
    /**
     * Creates an NewInstance Resolver for the supplied key.
     * @param key The key to resolve/instantiate.
     * @param dynamicDependencies An optional list of dynamic dependencies.
     * @return Returns an instance of NewInstance for the key.
     */
    public static of(key: Function, ...dynamicDependencies: any[]) {
        return new NewInstanceResolver(key, ...dynamicDependencies);
    }

    /** @internal */
    public _key: Function;
    /** @internal */
    public _asKey: Key;
    /** @internal */
    public _dynamicDependencies: any[];

    /**
     * Creates an instance of the NewInstance class.
     * @param key The key to resolve/instantiate.
     * @param dynamicDependencies An optional list of dynamic dependencies.
     */
    public constructor(key: Function, ...dynamicDependencies: any[]) {
        this._key = key;
        this._asKey = key;
        this._dynamicDependencies = dynamicDependencies;
    }

    /**
     * Called by the container to instantiate the dependency and potentially register
     * as another key if the `as` method was used.
     * @param container The container to resolve the parent from.
     * @return Returns the matching instance from the parent container
     */
    public get(container: Container) {
        const dynamicDependencies =
            this._dynamicDependencies.length > 0
                ? this._dynamicDependencies.map(
                      dependency =>
                          dependency['protocol:aurelia:resolver']
                              ? dependency.get(container)
                              : container.get(dependency)
                  )
                : undefined;
        const instance = container.invoke(this._key, dynamicDependencies);
        container.registerInstance(this._asKey, instance);

        return instance;
    }

    /**
     * Instructs the NewInstance resolver to register the resolved instance using the supplied key.
     * @param key The key to register the instance with.
     * @return Returns the NewInstance resolver.
     */
    public as(key: Key) {
        this._asKey = key;

        return this;
    }
}
