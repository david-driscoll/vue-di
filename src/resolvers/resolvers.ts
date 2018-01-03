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
* Decorator: Specifies the dependency should be lazy loaded
*/
export function lazy(keyValue: any) {
  return function(target, key, index) {
    let params = getDecoratorDependencies(target, 'lazy');
    params[index] = Lazy.of(keyValue);
  };
}

/**
* Decorator: Specifies the dependency should load all instances of the given key.
*/
export function all(keyValue: any) {
  return function(target, key, index) {
    let params = getDecoratorDependencies(target, 'all');
    params[index] = All.of(keyValue);
  };
}

/**
* Decorator: Specifies the dependency as optional
*/
export function optional(checkParentOrTarget: boolean = true) {
  let deco = function(checkParent: boolean) {
    return function(target, key, index) {
      let params = getDecoratorDependencies(target, 'optional');
      params[index] = Optional.of(params[index], checkParent);
    };
  };
  if (typeof checkParentOrTarget === 'boolean') {
    return deco(checkParentOrTarget);
  }
  return deco(true);
}

/**
* Decorator: Specifies the dependency to look at the parent container for resolution
*/
export function parent(target, key, index) {
  let params = getDecoratorDependencies(target, 'parent');
  params[index] = Parent.of(params[index]);
}

/**
* Decorator: Specifies the dependency to create a factory method, that can accept optional arguments
*/
export function factory(keyValue: any, asValue?: any) {
  return function(target, key, index) {
    let params = getDecoratorDependencies(target, 'factory');
    let factory = Factory.of(keyValue);
    params[index] = asValue ? factory.as(asValue) : factory;
  };
}

/**
* Decorator: Specifies the dependency as a new instance
*/
export function newInstance(asKeyOrTarget?: any, ...dynamicDependencies: any[]) {
  let deco = function(asKey?: any) {
    return function(target, key, index) {
      let params = getDecoratorDependencies(target, 'newInstance');
      params[index] = NewInstance.of(params[index], ...dynamicDependencies);
      if (!!asKey) {
        params[index].as(asKey);
      }
    };
  };
  if (arguments.length >= 1) {
    return deco(asKeyOrTarget);
  }
  return deco();
}
