/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import { Container } from '../container/Container';

/**
 * A strategy for invoking a function, resulting in an object instance.
 */
export interface Invoker {
    /**
     * Invokes the function with the provided dependencies.
     * @param fn The constructor or factory function.
     * @param dependencies The dependencies of the function call.
     * @return The result of the function invocation.
     */
    invoke(container: Container, fn: { new (...args: any[]): any }, dependencies: any[]): any;

    /**
     * Invokes the function with the provided dependencies.
     * @param fn The constructor or factory function.
     * @param staticDependencies The static dependencies of the function.
     * @param dynamicDependencies Additional dependencies to use during invocation.
     * @return The result of the function invocation.
     */
    invokeWithDynamicDependencies(
        container: Container,
        fn: { new (...args: any[]): any },
        staticDependencies: any[],
        dynamicDependencies: any[]
    ): any;
}
