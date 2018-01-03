/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import { protocol } from '../protocol/protocol';

/**
 * Decorator: Indicates that the decorated class/object is a custom resolver.
 */
// tslint:disable-next-line:only-arrow-functions
export const resolver = protocol.create('aurelia:resolver', function(target): string | boolean {
    if (!(typeof target.get === 'function')) {
        return 'Resolvers must implement: get(container: Container, key: Key): any';
    }

    return true;
});
