import 'reflect-metadata';
import Vue, { ComponentOptions } from 'vue';
import constants from '../constants';
import { Resolver } from '../types';
import { getDecoratorDependencies } from './getDecoratorDependencies';
import { createVueDecorator } from './shim-component-decorators';

export function decorateParameterOrProperty(resolver: (type: any) => Resolver<any>, name: string) {
    return (target: Object, propertyOrParameterName: string | symbol, index?: number) => {
        if (typeof index === 'number') {
            const params = getDecoratorDependencies(target, name);
            params[index] = resolver(params[index]);
        } else {
            const propertyType = Reflect.getOwnMetadata(
                constants.propertyType,
                target,
                propertyOrParameterName
            );
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
