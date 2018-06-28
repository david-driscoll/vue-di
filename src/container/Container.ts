/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import 'reflect-metadata';
import { AggregateError } from '../AggregateError';
import constants from '../constants';
import { Invoker } from '../invokers/Invoker';
import { containerResolver as resolverDeco } from '../protocol/resolver';
import { IRegistration } from '../registration/Registration';
import { Strategy, StrategyResolver } from '../resolvers/StrategyResolver';
import { IContainer, Key, RegistrationFactory, Resolver, TypedKey } from '../types';
import { IContainerConfiguration } from './ContainerConfiguration';
import { InvocationHandler } from './InvocationHandler';

export const _emptyParameters = Object.freeze<any>([]);

function validateKey(key: Key<any>) {
    if (key === null || key === undefined) {
        throw new Error(
            // tslint:disable-next-line:max-line-length
            "key/value cannot be null or undefined. Are you trying to inject/register something that doesn't exist with DI?"
        );
    }
}

function invokeWithDynamicDependencies(
    container: Container,
    fn: { new (...args: any[]): any },
    staticDependencies: any[],
    dynamicDependencies?: any[]
) {
    let i = staticDependencies.length;
    let args = new Array(i);
    let lookup;

    while (i--) {
        lookup = staticDependencies[i];

        if (lookup === null || lookup === undefined) {
            throw new Error(
                // tslint:disable-next-line:max-line-length
                `Constructor Parameter with index ${i} cannot be null or undefined. Are you trying to inject/register something that doesn't exist with DI?`
            );
        } else {
            args[i] = container.get(lookup);
        }
    }

    if (dynamicDependencies !== undefined) {
        args = args.concat(dynamicDependencies);
    }

    return Reflect.construct(fn, args);
}

type ClassInvokers<T> = ArrayLike<T> & { fallback: T };

// tslint:disable:no-magic-numbers
const classInvokers: ClassInvokers<Invoker> = {
    [0]: {
        invoke(container, type, deps) {
            return new type();
        },
        invokeWithDynamicDependencies,
    },
    [1]: {
        invoke(container, type, deps) {
            return new type(container.get(deps[0]));
        },
        invokeWithDynamicDependencies,
    },
    [2]: {
        invoke(container, type, deps) {
            return new type(container.get(deps[0]), container.get(deps[1]));
        },
        invokeWithDynamicDependencies,
    },
    [3]: {
        invoke(container, type, deps) {
            return new type(container.get(deps[0]), container.get(deps[1]), container.get(deps[2]));
        },
        invokeWithDynamicDependencies,
    },
    [4]: {
        invoke(container, type, deps) {
            return new type(
                container.get(deps[0]),
                container.get(deps[1]),
                container.get(deps[2]),
                container.get(deps[3])
            );
        },
        invokeWithDynamicDependencies,
    },
    [5]: {
        invoke(container, type, deps) {
            return new type(
                container.get(deps[0]),
                container.get(deps[1]),
                container.get(deps[2]),
                container.get(deps[3]),
                container.get(deps[4])
            );
        },
        invokeWithDynamicDependencies,
    },
    length: 6,
    fallback: {
        invoke: invokeWithDynamicDependencies,
        invokeWithDynamicDependencies,
    },
};
// tslint:enable:no-magic-numbers

function isInjectable(f: object): f is { inject: any[] | (() => any[]) } {
    return f.hasOwnProperty('inject');
}

function getDependencies(f: object) {
    if (!isInjectable(f)) {
        return [];
    }

    if (typeof f.inject === 'function') {
        return f.inject();
    }

    return f.inject;
}

/**
 * A lightweight, extensible dependency injection container.
 */
export class Container {
    /**
     * The global root Container instance. Available if makeGlobal() has been called.
     */
    public static readonly instance: Container;

    /**
     * The parent container in the DI hierarchy.
     */
    public readonly parent?: Container;

    /**
     * The root container in the DI hierarchy.
     */
    public readonly root: Container;

    private _configuration: IContainerConfiguration;
    private _onHandlerCreated?: (handler: InvocationHandler) => InvocationHandler;
    private _handlers: Map<any, any>;
    private _resolvers: Map<any, Resolver<any>>;

    /**
     * Creates an instance of Container.
     * @param configuration Provides some configuration for the new Container instance.
     */
    public constructor(configuration?: IContainerConfiguration) {
        if (configuration === undefined) {
            // tslint:disable-next-line:no-parameter-reassignment
            configuration = {};
        }

        this._configuration = configuration;
        this._onHandlerCreated = configuration.onHandlerCreated;
        this._handlers = configuration.handlers || (configuration.handlers = new Map());
        this._resolvers = new Map();
        this.root = this;
        this.parent = undefined;
    }

    /**
     * Makes this container instance globally reachable through Container.instance.
     */
    public makeGlobal(): Container {
        (Container as any).instance = this;

        return this;
    }

    /**
     * Sets an invocation handler creation callback that will be called when new InvocationsHandlers
     *  are created (called once per Function).
     * @param onHandlerCreated The callback to be called when an InvocationsHandler is created.
     */
    public setHandlerCreatedCallback(
        onHandlerCreated: (handler: InvocationHandler) => InvocationHandler
    ) {
        this._onHandlerCreated = onHandlerCreated;
        this._configuration.onHandlerCreated = onHandlerCreated;
    }

    /**
     * Registers an existing object instance with the container.
     * @param key The key that identifies the dependency at resolution time; usually a constructor function.
     * @param instance The instance that will be resolved when the key is matched. This defaults to the key
     *                  value when instance is not supplied.
     * @return The resolver that was registered.
     */
    public registerInstance<T>(key: Key<T>, instance?: T): Resolver<T> {
        return this.registerResolver(
            key,
            new StrategyResolver(Strategy.Instance, instance === undefined ? key : instance)
        );
    }

    /**
     * Registers a type (constructor function) such that the container always returns the same instance for
     *  each request.
     * @param key The key that identifies the dependency at resolution time; usually a constructor function.
     * @param fn The constructor function to use when the dependency needs to be instantiated. This defaults
     *              to the key value when fn is not supplied.
     * @return The resolver that was registered.
     */
    public registerSingleton<T>(key: TypedKey<T>): Resolver<T>;
    public registerSingleton<T>(key: Key<T>, fn: RegistrationFactory<T>): Resolver<T>;
    public registerSingleton<T>(key: Key<T>, fn?: RegistrationFactory<T>): Resolver<T> {
        return this.registerResolver(
            key,
            new StrategyResolver(Strategy.Singleton, fn === undefined ? key : fn)
        );
    }

    /**
     * Registers a type (constructor function) such that the container always returns the same instance for
     *  each request.
     * @param key The key that identifies the dependency at resolution time; usually a constructor function.
     * @param fn The constructor function to use when the dependency needs to be instantiated. This defaults
     *              to the key value when fn is not supplied.
     * @return The resolver that was registered.
     */
    public registerScoped<T>(key: TypedKey<T>): Resolver<T>;
    public registerScoped<T>(key: Key<T>, fn: RegistrationFactory<T>): Resolver<T>;
    public registerScoped<T>(key: Key<T>, fn?: RegistrationFactory<T>): Resolver<T> {
        return this.registerResolver(
            key,
            new StrategyResolver(Strategy.Scoped, fn === undefined ? key : fn)
        );
    }

    /**
     * Registers a type (constructor function) such that the container returns a new instance for each request.
     * @param key The key that identifies the dependency at resolution time; usually a constructor function.
     * @param fn The constructor function to use when the dependency needs to be instantiated. This defaults to
     *              the key value when fn is not supplied.
     * @return The resolver that was registered.
     */
    public registerTransient<T>(key: TypedKey<T>): Resolver<T>;
    public registerTransient<T>(key: Key<T>, fn: RegistrationFactory<T>): Resolver<T>;
    public registerTransient<T>(key: Key<T>, fn?: RegistrationFactory<T>): Resolver<T>     {
        return this.registerResolver(
            key,
            new StrategyResolver(Strategy.Transient, fn === undefined ? key : fn)
        );
    }

    /**
     * Registers a custom resolution function such that the container calls this function for each request
     *      to obtain the instance.
     * @param key The key that identifies the dependency at resolution time; usually a constructor function.
     * @param handler The resolution function to use when the dependency is needed.
     * @return The resolver that was registered.
     */
    public registerHandler<T>(
        key: Key<T>,
        handler: (container?: Container, key?: any, resolver?: Resolver<T>) => any
    ): Resolver<T> {
        return this.registerResolver(key, new StrategyResolver(Strategy.Function, handler));
    }

    /**
     * Registers an additional key that serves as an alias to the original DI key.
     * @param originalKey The key that originally identified the dependency; usually a constructor function.
     * @param aliasKey An alternate key which can also be used to resolve the same dependency  as the original.
     * @return The resolver that was registered.
     */
    public registerAlias<T>(originalKey: Key<T>, aliasKey: Key<T>): Resolver<T> {
        return this.registerResolver(aliasKey, new StrategyResolver(Strategy.Alias, originalKey));
    }

    /**
     * Registers a custom resolution function such that the container calls this function for each request
     *              to obtain the instance.
     * @param key The key that identifies the dependency at resolution time; usually a constructor function.
     * @param resolver The resolver to use when the dependency is needed.
     * @return The resolver that was registered.
     */
    public registerResolver<T>(key: Key<T>, resolver: Resolver<T>): Resolver<T> {
        validateKey(key);

        const allResolvers = this._resolvers;
        const result = allResolvers.get(key);

        if (result === undefined) {
            allResolvers.set(key, resolver);
        } else if (result instanceof StrategyResolver && result.strategy === Strategy.Array) {
            result.state.push(resolver);
        } else {
            allResolvers.set(key, new StrategyResolver(Strategy.Array, [result, resolver]));
        }

        return resolver;
    }

    /**
     * Registers a type (constructor function) by inspecting its registration annotations. If none are found,
     *      then the default singleton registration is used.
     * @param key The key that identifies the dependency at resolution time; usually a constructor function.
     * @param fn The constructor function to use when the dependency needs to be instantiated.
     *      This defaults to the key value when fn is not supplied.
     */
    public autoRegister<T>(key: TypedKey<T>): Resolver<T>;
    // tslint:disable-next-line:unified-signatures
    public autoRegister<T>(key: Key<T>, fn: () => T): Resolver<T>;
    public autoRegister<T>(key: Key<T>, fn?: any): Resolver<T> {
        // tslint:disable-next-line:no-parameter-reassignment
        fn = fn === undefined ? key : fn;

        if (typeof fn === 'function') {
            const registration = Reflect.getMetadata(constants.registration, fn);

            if (registration === undefined) {
                return this.registerResolver(key, new StrategyResolver(Strategy.Singleton, fn));
            }

            return registration.registerResolver(this, key, fn);
        }

        throw new Error('Cannot auto register a non method');
    }

    /**
     * Registers an array of types (constructor functions) by inspecting their registration annotations.
     *      If none are found, then the default singleton registration is used.
     * @param fns The constructor function to use when the dependency needs to be instantiated.
     */
    public autoRegisterAll(fns: any[]): void {
        let i = fns.length;
        while (i--) {
            this.autoRegister(fns[i]);
        }
    }

    /**
     * Unregisters based on key.
     * @param key The key that identifies the dependency at resolution time; usually a constructor function.
     */
    public unregister(key: Key<any>): void {
        this._resolvers.delete(key);
    }

    /**
     * Inspects the container to determine if a particular key has been registred.
     * @param key The key that identifies the dependency at resolution time; usually a constructor function.
     * @param checkParent Indicates whether or not to check the parent container hierarchy.
     * @return Returns true if the key has been registred; false otherwise.
     */
    public hasHandler<T>(key: Key<T>, checkParent = false): boolean {
        validateKey(key);

        return (
            this._resolvers.has(key) ||
            (checkParent && this.parent != null && this.parent.hasHandler(key, checkParent))
        );
    }

    /**
     * Gets the resolver for the particular key, if it has been registered.
     * @param key The key that identifies the dependency at resolution time; usually a constructor function.
     * @return Returns the resolver, if registred, otherwise undefined.
     */
    public getResolver<T>(key: Key<T>) {
        return this._resolvers.get(key) as Resolver<T>;
    }

    /**
     * Resolves a single instance based on the provided key.
     * @param key The key that identifies the object to resolve.
     * @return Returns the resolved instance.
     */
    public get<T>(key: Key<T>): T {
        validateKey(key);

        if ((key as any) === Container) {
            return this as any;
        }

        if (resolverDeco.decorates(key)) {
            return (key as any).get(this, key);
        }

        const resolver = this._resolvers.get(key);

        if (resolver === undefined) {
            if (this.parent == null) {
                return this.autoRegister<T>(key as any).get(this, key);
            }

            const registration: IRegistration<T> = Reflect.getMetadata(constants.registration, key);

            if (registration) {
                return registration.registerResolver(this, key, key as any).get(this, key);
            }

            return this.parent._get(key, this);
        }

        return resolver.get(this, key);
    }

    /**
     * Resolves all instance registered under the provided key.
     * @param key The key that identifies the objects to resolve.
     * @return Returns an array of the resolved instances.
     */
    public getAll<T>(key: Key<T>): ReadonlyArray<T> {
        validateKey(key);

        const resolver = this._resolvers.get(key);

        if (resolver === undefined) {
            if (this.parent == null) {
                return _emptyParameters;
            }

            return this.parent.getAll(key);
        }

        if (resolver instanceof StrategyResolver && resolver.strategy === Strategy.Array) {
            const state = resolver.state;
            let i = state.length;
            const results = new Array(i);

            while (i--) {
                results[i] = state[i].get(this, key);
            }

            return results;
        }

        return [resolver.get(this, key)];
    }

    /**
     * Creates a new dependency injection container whose parent is the current container.
     * @return Returns a new container instance parented to this.
     */
    public createChild(): Container {
        const child = new Container(this._configuration);
        (child as any).root = this.root;
        (child as any).parent = this;

        return child;
    }

    /**
     * Configure the container with a given delegate method
     */
    public configure(func: (container: Container) => void) {
        func(this);

        return this;
    }

    /**
     * Invokes a function, recursively resolving its dependencies.
     * @param fn The function to invoke with the auto-resolved dependencies.
     * @param dynamicDependencies Additional function dependencies to use during invocation.
     * @return Returns the instance resulting from calling the function.
     */
    public invoke<T>(fn: Function, dynamicDependencies?: any[]): T {
        try {
            let handler = this._handlers.get(fn);

            if (handler === undefined) {
                handler = this._createInvocationHandler(fn);
                this._handlers.set(fn, handler);
            }

            return handler.invoke(this, dynamicDependencies);
        } catch (e) {
            throw AggregateError(
                `Error invoking ${fn.name}. Check the inner error for details.`,
                e,
                true
            );
        }
    }

    /**
     * Disposes of this container
     */
    public dispose() {
        const resolvers = (this as any)._resolvers as Map<any, any>;
        (this as any)._resolvers.clear();
        (this as any)._resolvers = null;
        (this as any)._configuration = null;
        (this as any).parent = null;
        (this as any).root = null;
    }

    private _get<T>(key: Key<T>, child?: Container): T {
        const resolver = this._resolvers.get(key);

        if (resolver === undefined) {
            if (this.parent == null) {
                return (child || this).autoRegister(key as any).get((child || this), key) as T;
            }

            return this.parent._get(key, child || this);
        }

        if (child && resolver instanceof StrategyResolver && resolver.strategy === Strategy.Scoped) {
            const childResolver = new StrategyResolver(resolver.strategy, resolver.originalState);
            child.registerResolver(key, childResolver);

            return child.get(key);
        }

        return resolver.get(child || this, key);
    }

    private _createInvocationHandler(fn: Function & { inject?: any }): InvocationHandler {
        let dependencies;
        Reflect.getOwnMetadata(constants.paramTypes, fn);
        if (fn.inject === undefined) {
            dependencies = Reflect.getOwnMetadata(constants.paramTypes, fn) || _emptyParameters;
        } else {
            dependencies = [];
            let ctor = fn;
            while (typeof ctor === 'function') {
                dependencies.push(...getDependencies(ctor));
                ctor = Object.getPrototypeOf(ctor);
            }
        }

        const invoker =
            Reflect.getOwnMetadata(constants.invoker, fn) ||
            classInvokers[dependencies.length] ||
            classInvokers.fallback;

        const handler = new InvocationHandler(fn, invoker, dependencies);

        return this._onHandlerCreated != null ? this._onHandlerCreated(handler) : handler;
    }
}
