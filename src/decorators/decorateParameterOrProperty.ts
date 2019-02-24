import 'reflect-metadata';
import constants from '../constants';
import { Resolver, Key, ConstructorOf, isResolver } from '../types';
import { getDecoratorDependencies } from './getDecoratorDependencies';
import { createVueDecorator } from './shim-component-decorators';
import { StrategyResolver, Strategy } from '../resolvers';

export function decorateParameterOrProperty(
    keyProvider: (type: ConstructorOf<any>) => Key<any>,
    name: string
) {
    return (target: Object, propertyOrParameterName: string | symbol, index?: number) => {
        if (typeof index === 'number') {
            const params = getDecoratorDependencies(target, name);
            params[index] = keyProvider(params[index]);
        } else {
            const propertyType = Reflect.getOwnMetadata(
                constants.propertyType,
                target,
                propertyOrParameterName
            );
            let resolver: Resolver<any>;
            {
                const resolverOrKey = keyProvider(propertyType);
                if (isResolver(resolverOrKey)) {
                    resolver = resolverOrKey;
                } else if (typeof resolverOrKey === 'function') {
                    resolver = new StrategyResolver(Strategy.Singleton, resolverOrKey);
                } else {
                    resolver = new StrategyResolver(Strategy.Alias, resolverOrKey);
                }
            }

            Reflect.defineMetadata(constants.resolver, resolver, target, propertyOrParameterName);

            return createVueDecorator((options: any, propertyName: string | symbol) => {
                if (!options.inject) options.inject = {};
                if (Array.isArray(options.inject)) {
                    const currentInject = options.inject;
                    options.inject = {};
                    for (let item of currentInject) {
                        options.inject[item] = item;
                    }
                }
                options.inject[propertyName] = resolver;
            })(target, propertyOrParameterName);
        }
    };
}
