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
import { isStrategyResolver, Key, Resolver, TypedKey, ConstructorOf } from '../types';
import { IContainerConfiguration } from './ContainerConfiguration';
import { getInjectDependencies } from './getInjectDependencies';
import { InvocationHandler } from './InvocationHandler';
import { _emptyParameters, validateKey } from './validateParameters';

// tslint:disable:max-line-length
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

        switch (lookup) {
            case null:
            case undefined:
                throw new Error(
                    `Constructor ${
                        fn.name
                    } Parameter with index ${i} cannot be null or undefined. Are you trying to inject/register something that doesn't exist with DI?`
                );
                break;
            default:
                args[i] = container.get(lookup);
        }
    }

    if (dynamicDependencies !== undefined) {
        args = args.concat(dynamicDependencies);
    }

    return Reflect.construct(fn, args);
}
// tslint:enable:max-line-length

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

let containerNumber = 0;

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
    private _onHandlerCreated?: IContainerConfiguration['onHandlerCreated'];
    private _onRegisterResolver?: IContainerConfiguration['onRegisterResolver'];
    private _handlers: Map<any, InvocationHandler>;
    private _resolvers: Map<any, Resolver<any>>;

    public get name() {
        return this._configuration.name;
    }

    /**
     * Creates an instance of Container.
     * @param configuration Provides some configuration for the new Container instance.
     */
    public constructor(configuration?: IContainerConfiguration) {
        if (configuration === undefined) {
            // tslint:disable-next-line:no-parameter-reassignment
            configuration = { name: 'root' };
        }
        containerNumber++;

        this._configuration = configuration;
        this._onHandlerCreated = configuration.onHandlerCreated;
        this._onRegisterResolver = configuration.onRegisterResolver;
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
     * @param onRegisterResolver The callback to be called when a Resolver is created.
     */
    public setRegisterResolver(
        onRegisterResolver: (key: Key<any>, resolver: Resolver<any>) => Resolver<any>
    ) {
        this._onRegisterResolver = onRegisterResolver;
        this._configuration.onRegisterResolver = onRegisterResolver;
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
    public registerSingleton<T>(key: Key<T>, fn: TypedKey<T>): Resolver<T>;
    public registerSingleton<T>(key: Key<T>, fn?: TypedKey<T>): Resolver<T> {
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
    public registerScoped<T>(key: Key<T>, fn: TypedKey<T>): Resolver<T>;
    public registerScoped<T>(key: Key<T>, fn?: TypedKey<T>): Resolver<T> {
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
    public registerTransient<T>(key: Key<T>, fn: TypedKey<T>): Resolver<T>;
    public registerTransient<T>(key: Key<T>, fn?: TypedKey<T>): Resolver<T> {
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
        handler:
            | ((container: Container, key: any, resolver: Resolver<T>) => any)
            | ConstructorOf<any>
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
        resolver =
            this._onRegisterResolver != null ? this._onRegisterResolver(key, resolver) : resolver;

        const allResolvers = this._resolvers;
        const result = allResolvers.get(key);

        if (result === undefined) {
            allResolvers.set(key, resolver);
        } else if (result instanceof StrategyResolver && result.strategy === Strategy.Array) {
            result.state.unshift(resolver);
        } else {
            allResolvers.set(key, new StrategyResolver(Strategy.Array, [resolver, result]));
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

        throw new Error(`Cannot auto register a non method for key ${key.toString()}`);
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
            !!this.getResolver(key) ||
            (checkParent && this.parent != null && this.parent.hasHandler(key, checkParent))
        );
    }

    /**
     * Gets the resolver for the particular key, if it has been registered.
     * @param key The key that identifies the dependency at resolution time; usually a constructor function.
     * @return Returns the resolver, if registred, otherwise undefined.
     */
    public getResolver<T>(key: Key<T>, checkParent = false): Resolver<T> | undefined {
        return this._getResolver(key, checkParent ? this : undefined);
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

        const resolver = this.getResolver(key, true);

        if (resolver === undefined) {
            if (this.parent == null) {
                return this.autoRegister<T>(key as any).get(this, key);
            }

            if (typeof key !== 'symbol' && typeof key !== 'string') {
                const registration: IRegistration<T> = Reflect.getMetadata(
                    constants.registration,
                    key
                );

                if (registration) {
                    return registration.registerResolver(this, key, key as any).get(this, key);
                }
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

        const resolver = this.getResolver(key, true);

        if (resolver === undefined) {
            if (this.parent == null) {
                return _emptyParameters;
            }

            return this.parent.getAll(key);
        }

        let results: T[];
        if (resolver instanceof StrategyResolver && resolver.strategy === Strategy.Array) {
            const state = resolver.state;
            const len = state.length;
            let i = len;
            results = new Array(i);

            while (i--) {
                results[len - i - 1] = state[i].get(this, key);
            }
        } else {
            results = [(resolver as any).get(this, key)];
        }

        return this.parent ? this.parent.getAll(key).concat(results) : results;
    }

    /**
     * Creates a new dependency injection container whose parent is the current container.
     * @return Returns a new container instance parented to this.
     */
    public createChild(name?: string): Container {
        const child = new Container({
            ...this._configuration,
            name: `${name || 'child'}:${containerNumber}`,
        });
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
     * Invokes a function, recursively resolving its dependencies.
     * @param fn The function to invoke with the auto-resolved dependencies.
     * @param key The key being invoked.
     * @param dynamicDependencies Additional function dependencies to use during invocation.
     * @return Returns the instance resulting from calling the function.
     */
    public invokeWithKey<T>(
        fn: Function | { get(container: Container, key: Key<T>): T },
        key: Key<T>,
        dynamicDependencies?: any[]
    ) {
        if (typeof fn !== 'function') {
            return fn.get(this, key);
        }

        return this.invoke(fn, dynamicDependencies);
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

    private _getResolver<T>(key: Key<T>, relativeContainer?: Container): Resolver<T> | undefined {
        let resolver = this._resolvers.get(key);
        if (relativeContainer && !resolver && this.parent) {
            resolver = this.parent._getResolver(key, relativeContainer);
        }
        if (
            !this._resolvers.get(key) &&
            isStrategyResolver(resolver) &&
            resolver.strategy === Strategy.Scoped
        ) {
            resolver = resolver.clone();
            this.registerResolver(key, resolver);
        }

        return resolver;
    }

    private _get<T>(key: Key<T>, relativeContainer?: Container): T {
        const resolver = this.getResolver(key, true);

        if (resolver === undefined) {
            if (this.parent == null) {
                return (relativeContainer || this)
                    .autoRegister(key as any)
                    .get(relativeContainer || this, key) as T;
            }

            return this.parent._get(key, relativeContainer || this);
        }

        return resolver.get(relativeContainer || this, key);
    }

    private _createInvocationHandler(fn: Function): InvocationHandler {
        const dependencies = getInjectDependencies(fn);

        const invoker =
            Reflect.getOwnMetadata(constants.invoker, fn) ||
            classInvokers[dependencies.length] ||
            classInvokers.fallback;

        const handler = new InvocationHandler(fn, invoker, dependencies);

        return this._onHandlerCreated != null ? this._onHandlerCreated(handler) : handler;
    }
}
