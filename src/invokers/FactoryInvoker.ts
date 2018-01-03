/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import { Container } from '../container/Container';

/**
 * An Invoker that is used to invoke a factory method.
 */
export class FactoryInvoker {
    /**
     * The singleton instance of the FactoryInvoker.
     */
    public static readonly instance = new FactoryInvoker();

    /**
     * Invokes the function with the provided dependencies.
     * @param container The calling container.
     * @param fn The constructor or factory function.
     * @param dependencies The dependencies of the function call.
     * @return The result of the function invocation.
     */
    public invoke(container: Container, fn: Function, dependencies: any[]): any {
        let i = dependencies.length;
        const args = new Array(i);

        while (i--) {
            args[i] = container.get(dependencies[i]);
        }

        return fn.apply(undefined, args);
    }

    /**
     * Invokes the function with the provided dependencies.
     * @param container The calling container.
     * @param fn The constructor or factory function.
     * @param staticDependencies The static dependencies of the function.
     * @param dynamicDependencies Additional dependencies to use during invocation.
     * @return The result of the function invocation.
     */
    public invokeWithDynamicDependencies(
        container: Container,
        fn: Function,
        staticDependencies: any[],
        dynamicDependencies: any[]
    ): any {
        let i = staticDependencies.length;
        let args = new Array(i);

        while (i--) {
            args[i] = container.get(staticDependencies[i]);
        }

        if (dynamicDependencies !== undefined) {
            args = args.concat(dynamicDependencies);
        }

        return fn.apply(undefined, args);
    }
}
