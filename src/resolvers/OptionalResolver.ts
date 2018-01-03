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
* Used to allow functions/classes to specify an optional dependency, which will be resolved only if already registred with the container.
*/
@resolver()
export class OptionalResolver {
  /** @internal */
  _key: any;

  /** @internal */
  _checkParent: boolean;

  /**
  * Creates an instance of the Optional class.
  * @param key The key to optionally resolve for.
  * @param checkParent Indicates whether or not the parent container hierarchy should be checked.
  */
  constructor(key: any, checkParent: boolean = true) {
    this._key = key;
    this._checkParent = checkParent;
  }

  /**
  * Called by the container to provide optional resolution of the key.
  * @param container The container to resolve from.
  * @return Returns the instance if found; otherwise null.
  */
  get(container: Container): any {
    if (container.hasResolver(this._key, this._checkParent)) {
      return container.get(this._key);
    }

    return null;
  }

  /**
  * Creates an Optional Resolver for the supplied key.
  * @param key The key to optionally resolve for.
  * @param [checkParent=true] Indicates whether or not the parent container hierarchy should be checked.
  * @return Returns an instance of Optional for the key.
  */
  static of(key: any, checkParent: boolean = true) {
    return new OptionalResolver(key, checkParent);
  }
}
