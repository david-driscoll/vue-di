

/**
 * Decorator: Specifies the dependency should load all instances of the given key.
 *
 * @export
 */
export function all(keyValue: string | symbol | Function) {
    const resolver = AllResolver.of(keyValue);

    return decorateParameterOrProperty(x => resolver, 'all');
}
