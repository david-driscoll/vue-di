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
* Decorator: Directs the TypeScript transpiler to write-out type metadata for the decorated class.
*/
export function autoinject(potentialTarget?: any): any {
    let deco = function(target) {
      let previousInject = target.inject ? target.inject.slice() : null; //make a copy of target.inject to avoid changing parent inject
      let autoInject: any = metadata.getOwn(metadata.paramTypes, target) || _emptyParameters;
      if (!previousInject) {
        target.inject = autoInject;
      } else {
        for (let i = 0; i < autoInject.length; i++) {
          //check if previously injected.
          if (previousInject[i] && previousInject[i] !== autoInject[i]) {
            const prevIndex = previousInject.indexOf(autoInject[i]);
            if (prevIndex > -1) {
              previousInject.splice(prevIndex, 1);
            }
            previousInject.splice((prevIndex > -1 && prevIndex < i) ? i - 1 : i, 0, autoInject[i]);
          } else if (!previousInject[i]) {//else add
            previousInject[i] = autoInject[i];
          }
        }
        target.inject = previousInject;
      }
    };

    return potentialTarget ? deco(potentialTarget) : deco;
  }
