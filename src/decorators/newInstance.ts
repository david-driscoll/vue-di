
/**
 * Decorator: Specifies the dependency as a new instance.
 *
 * @export
 */
export function newInstance(asKey?: string | symbol, ...dynamicDeps: any[]) {
    const resolver = (x: any) => {
        const value = NewInstanceResolver.of(x, ...dynamicDeps);

        if (!!asKey) {
            value.as(asKey);
        }

        return value;
    };

    return decorateParameterOrProperty(resolver, 'newInstance');
}
