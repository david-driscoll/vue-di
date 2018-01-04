import { ParentResolver } from '../resolvers/ParentResolver';
import { decorateParameterOrProperty } from './decorateParameterOrProperty';


/**
 * Decorator: Specifies the dependency to look at the parent container for resolution.
 *
 * @export
 */
export function parent(): (target: Object, propertyOrParameterName: string | symbol, index?: number) => void;
export function parent(target: Object, propertyOrParameterName: string | symbol, index?: number): void;
export function parent(target?: Object, propertyOrParameterName?: string | symbol, index?: number) {
    const deco = function () {
        const resolver = (x: any) => ParentResolver.of(x);
        return decorateParameterOrProperty(resolver, 'parent');
    };
    if (target == null) {
        return deco();
    }

    return deco()(target, propertyOrParameterName!, index);
}
