import { decorateParameterOrProperty } from './decorateParameterOrProperty';

/**
 * Decorator: Specifies the dependency to be resolved.
 *
 * @export
 */
export function resolve(key: string | symbol | Function) {
    return decorateParameterOrProperty(x => key || x, 'resolve');
}
