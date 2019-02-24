import { Invoker } from '../invokers/Invoker';
import { Container } from './Container';

/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */

/**
 * Stores the information needed to invoke a function.
 */
export class InvocationHandler {
    /**
     * The function to be invoked by this handler.
     */
    public fn: Function;

    /**
     * The invoker implementation that will be used to actually invoke the function.
     */
    public invoker: Invoker;

    /**
     * The statically known dependencies of this function invocation.
     */
    public dependencies: any[];

    /**
     * Instantiates an InvocationDescription.
     * @param fn The Function described by this description object.
     * @param invoker The strategy for invoking the function.
     * @param dependencies The static dependencies of the function call.
     */
    public constructor(fn: Function, invoker: Invoker, dependencies: any[]) {
        this.fn = fn;
        this.invoker = invoker;
        this.dependencies = dependencies;
    }

    /**
     * Invokes the function.
     * @param container The calling container.
     * @param dynamicDependencies Additional dependencies to use during invocation.
     * @return The result of the function invocation.
     */
    public invoke(container: Container, dynamicDependencies?: any[]): any {
        if (dynamicDependencies !== undefined) {
            this.invoker //?
            return this.invoker.invokeWithDynamicDependencies(
                container,
                this.fn as any,
                this.dependencies,
                dynamicDependencies
            );
        }
        return this.invoker.invoke(container, this.fn as any, this.dependencies);
    }
}
