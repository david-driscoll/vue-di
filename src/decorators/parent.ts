
/**
 * Decorator: Specifies the dependency to look at the parent container for resolution.
 *
 * @export
 */
export function Parent() {
    const resolver = (x: any) => ParentResolver.of(x);

    return decorateParameterOrProperty(resolver, 'parent');
}
