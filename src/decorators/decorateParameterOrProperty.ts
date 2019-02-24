import 'reflect-metadata';
import constants from '../constants';
import { Resolver, Key, ConstructorOf, isResolver } from '../types';
import { getDecoratorDependencies } from './getDecoratorDependencies';
import { createVueDecorator } from './shim-component-decorators';
import { StrategyResolver, Strategy } from '../resolvers';
import { IRegistration } from '../registration/Registration';

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
                const resolverOrKey = keyProvider(propertyType);

            Reflect.defineMetadata(constants.resolver, resolverOrKey, target, propertyOrParameterName);

            return createVueDecorator((options: any, propertyName: string | symbol) => {
                if (!options.inject) options.inject = {};
                if (Array.isArray(options.inject)) {
                    const currentInject = options.inject;
                    options.inject = {};
                    for (let item of currentInject) {
                        options.inject[item] = item;
                    }
                }
                options.inject[propertyName] = { key: resolverOrKey };
            })(target, propertyOrParameterName);
        }
    };
}
