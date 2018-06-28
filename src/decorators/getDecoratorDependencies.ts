/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import 'reflect-metadata';
import constants from '../constants';

/**
 * Used to inject a new instance of a dependency, without regard for existing
 * instances in the container. Instances can optionally be registered in the container
 * under a different key by supplying a key using the `as` method.
 */
export function getDecoratorDependencies(target: any, name: string) {
    let dependencies = target.inject;
    if (typeof dependencies === 'function') {
        throw new Error(
            `Decorator ${name} cannot be used with "inject()".  Please use an array instead.`
        );
    }
    if (!dependencies) {
        dependencies = (Reflect.getOwnMetadata(constants.paramTypes, target) || []).slice();
        target.inject = dependencies;
    }

    return dependencies;
}
