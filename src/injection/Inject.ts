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
* Decorator: Specifies the dependencies that should be injected by the DI Container into the decoratored class/function.
*/
export function inject(...rest: any[]): any {
    return function(target, key, descriptor) {
      // handle when used as a parameter
      if (typeof descriptor === 'number' && rest.length === 1) {
        let params = target.inject;
        if (typeof params === 'function') {
          throw new Error('Decorator inject cannot be used with "inject()".  Please use an array instead.');
        }
        if (!params) {
          params = metadata.getOwn(metadata.paramTypes, target).slice();
          target.inject = params;
        }
        params[descriptor] = rest[0];
        return;
      }
      // if it's true then we injecting rest into function and not Class constructor
      if (descriptor) {
        const fn = descriptor.value;
        fn.inject = rest;
      } else {
        target.inject = rest;
      }
    };
  }
