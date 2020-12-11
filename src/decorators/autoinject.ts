/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import { getInjectDependencies } from '../container/getInjectDependencies';
import { _emptyParameters } from '../container/validateParameters';

/**
 * Decorator: Directs the TypeScript transpiler to write-out type metadata for the decorated class.
 */
export function AutoInject(): ClassDecorator;
export function AutoInject(potentialTarget: any): void;
export function AutoInject(potentialTarget?: any): any {
    const deco = (target: any) => {
        getInjectDependencies(target);
    };

    return potentialTarget ? deco(potentialTarget) : deco;
}
