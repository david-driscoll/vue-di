import 'reflect-metadata';
import Vue, { ComponentOptions } from 'vue';
import { IResolver } from '../resolvers/Resolver';
import { getDecoratorDependencies } from './getDecoratorDependencies';
import { createVueDecorator } from './shim-component-decorators';
import constants from '../constants';

export function decorateParameterOrProperty(resolver: (type: any) => IResolver<any>, name: string) {
    return (target: Object, propertyOrParameterName: string | symbol, index?: number) => {
        if (typeof index === 'number') {
            const params = getDecoratorDependencies(target, name);
            params[index] = resolver(params[index]);
        } else {
            const propertyType = Reflect.getOwnMetadata(constants.propertyType, target, propertyOrParameterName);
            const instance = resolver(propertyType);
            Reflect.defineMetadata(constants.resolver, instance, target, propertyOrParameterName);

            return createVueDecorator((options: ComponentOptions<Vue>, key: string | symbol) => {
                if (!options.dependencies) {
                    options.dependencies = {};
                }
                options.dependencies[key] = instance;
            })(target, propertyOrParameterName);
        }
    };
}
