import Reflect from '../localReflect';
import { CompositeDisposable, isDisposable } from 'ts-disposables';
import Vue, { ComponentOptions } from 'vue';
import constants from '../constants';
import { ConstructorOf, Key } from '../types';
import { getDecoratorDependencies } from './getDecoratorDependencies';
import { createVueDecorator } from './shim-component-decorators';

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

            Reflect.defineMetadata(
                constants.resolver,
                resolverOrKey,
                target,
                propertyOrParameterName
            );

            return createVueDecorator(
                (options: ComponentOptions<Vue>, propertyName: string | symbol) => {
                    if (ensureInject(options)) {
                        options.inject[propertyName as any] = defaultInjectable(resolverOrKey);
                    }
                }
            )(target, propertyOrParameterName);
        }
    };
}

export function defaultInjectable(resolver: Key<any>) {
    return {
        default(this: Vue) {
            const disposable: CompositeDisposable = (this as any).__$disposable;
            const value = (this as any).$container.get(resolver);

            if (value && isDisposable(value)) {
                disposable.add(value);
            }

            return value;
        },
    };
}

function ensureInject(
    options: ComponentOptions<Vue>
): options is { inject: { [key: string]: { from?: string | symbol; default?: any } } } {
    if (!options.inject) options.inject = {};
    if (Array.isArray(options.inject)) {
        const currentInject = options.inject;
        options.inject = {};
        for (const item of currentInject) {
            options.inject[item] = item;
        }
    }

    return true;
}
