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
* An Invoker that is used to invoke a factory method.
*/
export class FactoryInvoker {
    /**
    * The singleton instance of the FactoryInvoker.
    */
    static instance: FactoryInvoker;

    /**
    * Invokes the function with the provided dependencies.
    * @param container The calling container.
    * @param fn The constructor or factory function.
    * @param dependencies The dependencies of the function call.
    * @return The result of the function invocation.
    */
    invoke(container: Container, fn: Function, dependencies: any[]): any {
      let i = dependencies.length;
      let args = new Array(i);

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
    invokeWithDynamicDependencies(container: Container, fn: Function, staticDependencies: any[], dynamicDependencies: any[]): any {
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

  FactoryInvoker.instance = new FactoryInvoker();
