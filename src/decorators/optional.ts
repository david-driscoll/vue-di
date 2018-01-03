
/**
 * Decorator: Specifies the dependency as optional.
 *
 * @export
 */
export function optional(checkParent: boolean = true) {
    const resolver = (x: any) => OptionalResolver.of(x, checkParent);

    return decorateParameterOrProperty(resolver, 'optional');
}
