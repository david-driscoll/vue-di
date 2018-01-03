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
* Used to allow functions/classes to indicate that they should be registered as transients with the container.
*/
export class TransientRegistration {
    /** @internal */
    _key: any;

    /**
    * Creates an instance of TransientRegistration.
    * @param key The key to register as.
    */
    constructor(key?: any) {
      this._key = key;
    }

    /**
    * Called by the container to register the resolver.
    * @param container The container the resolver is being registered with.
    * @param key The key the resolver should be registered as.
    * @param fn The function to create the resolver for.
    * @return The resolver that was registered.
    */
    registerResolver(container: Container, key: any, fn: Function): Resolver {
      let existingResolver = container.getResolver(this._key || key);
      return existingResolver === undefined ? container.registerTransient(this._key || key, fn) : existingResolver;
    }
  }