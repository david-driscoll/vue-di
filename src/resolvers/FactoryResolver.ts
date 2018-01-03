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
* Used to allow injecting dependencies but also passing data to the constructor.
*/
@resolver()
export class FactoryResolver {
  /** @internal */
  _key: any;

  /**
  * Creates an instance of the Factory class.
  * @param key The key to resolve from the parent container.
  */
  constructor(key: any) {
    this._key = key;
  }

  /**
  * Called by the container to pass the dependencies to the constructor.
  * @param container The container to invoke the constructor with dependencies and other parameters.
  * @return Returns a function that can be invoked to resolve dependencies later, and the rest of the parameters.
  */
  get(container: Container): any {
    return (...rest) => container.invoke(this._key, rest);
  }

  /**
  * Creates a Factory Resolver for the supplied key.
  * @param key The key to resolve.
  * @return Returns an instance of Factory for the key.
  */
  static of(key: any) {
    return new FactoryResolver(key);
  }
}
