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
* Used to inject a new instance of a dependency, without regard for existing
* instances in the container. Instances can optionally be registered in the container
* under a different key by supplying a key using the `as` method.
*/
@resolver()
export class NewInstanceResolver {
  key;
  asKey;

  /**
  * Creates an instance of the NewInstance class.
  * @param key The key to resolve/instantiate.
  * @param dynamicDependencies An optional list of dynamic dependencies.
  */
  constructor(key, ...dynamicDependencies: any[]) {
    this.key = key;
    this.asKey = key;
    this.dynamicDependencies = dynamicDependencies;
  }

  /**
  * Called by the container to instantiate the dependency and potentially register
  * as another key if the `as` method was used.
  * @param container The container to resolve the parent from.
  * @return Returns the matching instance from the parent container
  */
  get(container) {
    let dynamicDependencies = this.dynamicDependencies.length > 0 ?
      this.dynamicDependencies.map(dependency => dependency['protocol:aurelia:resolver'] ?
        dependency.get(container) : container.get(dependency)) : undefined;
    const instance = container.invoke(this.key, dynamicDependencies);
    container.registerInstance(this.asKey, instance);
    return instance;
  }

  /**
  * Instructs the NewInstance resolver to register the resolved instance using the supplied key.
  * @param key The key to register the instance with.
  * @return Returns the NewInstance resolver.
  */
  as(key) {
    this.asKey = key;
    return this;
  }

  /**
  * Creates an NewInstance Resolver for the supplied key.
  * @param key The key to resolve/instantiate.
  * @param dynamicDependencies An optional list of dynamic dependencies.
  * @return Returns an instance of NewInstance for the key.
  */
  static of(key, ...dynamicDependencies: any[]) {
    return new NewInstanceResolver(key, ...dynamicDependencies);
  }
}
