import { ParentResolver } from '../resolvers/ParentResolver';
import { decorateParameterOrProperty } from './decorateParameterOrProperty';

/**
 * Decorator: Specifies the dependency to look at the parent container for resolution.
 *
 * @export
 */
export function Parent(): (
    target: Object,
    propertyOrParameterName: string | symbol,
    index?: number
) => void;
export function Parent(
    target: Object,
    propertyOrParameterName: string | symbol,
    index?: number
): void;
export function Parent(target?: Object, propertyOrParameterName?: string | symbol, index?: number) {
    const deco = () => {
        const resolver = (x: any) => ParentResolver.of(x);

        return decorateParameterOrProperty(resolver, 'parent');
    };
    if (target == null) {
        return deco();
    }

    // tslint:disable-next-line:no-non-null-assertion
    return deco()(target, propertyOrParameterName!, index);
}
