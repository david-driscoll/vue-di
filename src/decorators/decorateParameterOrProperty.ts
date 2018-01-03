
export function decorateParameterOrProperty(resolver: (type: any) => Resolver, name: string) {
    return (target: Object, key: string | symbol, index?: number) => {
        if (typeof index === 'number') {
            const params = getDecoratorDependencies(target, name);
            params[index] = resolver(params[index]);
        } else {
            const propertyType = Reflect.getOwnMetadata(propertyTypeKey, target, key);
            const instance = resolver(propertyType);
            Reflect.defineMetadata(resolverKey, instance, target, key);

            return createVueDecorator((options: ComponentOptions<Vue>, key: string | symbol) => {
                if (!options.dependencies) {
                    options.dependencies = {};
                }
                options.dependencies[key] = instance;
            })(target, key);
        }
    };
}
