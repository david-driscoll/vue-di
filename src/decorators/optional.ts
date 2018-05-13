import { OptionalResolver } from '../resolvers/OptionalResolver';
import { decorateParameterOrProperty } from './decorateParameterOrProperty';

/**
 * Decorator: Specifies the dependency as optional.
 *
 * @export
 */
// export function optional(checkParent = true) {
//     const resolver = (x: any) => OptionalResolver.of(x, checkParent);

//     return decorateParameterOrProperty(resolver, 'optional');
// }
export function Optional(
    checkParent?: boolean
): (target: Object, propertyKey: string | symbol, parameterIndex?: number) => void;
export function Optional(
    target: Object,
    propertyKey: string | symbol,
    parameterIndex?: number
): void;
export function Optional(
    checkParentOrTarget?: boolean | Function | Object,
    propertyKey?: string | symbol,
    parameterIndex?: number
) {
    // tslint:disable:no-non-null-assertion
    const deco = (checkParent: boolean) => {
        const resolver = (x: any) => OptionalResolver.of(x, checkParent);

        return decorateParameterOrProperty(resolver, 'optional');
    };
    if (typeof checkParentOrTarget === 'boolean' || checkParentOrTarget == null) {
        return deco(checkParentOrTarget!);
    }

    return deco(false)(checkParentOrTarget!, propertyKey!, parameterIndex);
}
