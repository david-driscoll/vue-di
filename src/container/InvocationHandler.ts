/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * Stores the information needed to invoke a function.
 */
export class InvocationHandler {
    /**
     * The function to be invoked by this handler.
     */
    fn: Function;

    /**
     * The invoker implementation that will be used to actually invoke the function.
     */
    invoker: Invoker;

    /**
     * The statically known dependencies of this function invocation.
     */
    dependencies: any[];

    /**
     * Instantiates an InvocationDescription.
     * @param fn The Function described by this description object.
     * @param invoker The strategy for invoking the function.
     * @param dependencies The static dependencies of the function call.
     */
    constructor(fn: Function, invoker: Invoker, dependencies: any[]) {
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
    invoke(container: Container, dynamicDependencies?: any[]): any {
        return dynamicDependencies !== undefined
            ? this.invoker.invokeWithDynamicDependencies(
                  container,
                  this.fn,
                  this.dependencies,
                  dynamicDependencies
              )
            : this.invoker.invoke(container, this.fn, this.dependencies);
    }
}
