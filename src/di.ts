import Vue from 'vue';

import { Builder } from './builders';
import { Container } from './container';
import {
    all,
    autoinject,
    factory,
    lazy,
    newInstance,
    optional,
    parent,
    registration,
    resolve,
    singleton,
    transient,
} from './decorators';
import { install } from './plugin';
import { IContainer, Key } from './types';

export * from './container';
export * from './decorators';
export * from './protocol/protocol';
export * from './types';

export default {
    Builder,
    Container,
    install,
    all,
    autoinject,
    factory,
    lazy,
    newInstance,
    optional,
    parent,
    resolve,
    singleton,
    transient,
};

export { Builder, Container, install };

// tslint:disable:interface-name
declare module 'vue/types/vue' {
    interface VueConstructor {
        container: Container;
    }

    // tslint:disable-next-line:no-shadowed-variable
    interface Vue {
        container?: Container;
    }
}

declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        dependencies?: {
            [key: string]: Key<any>;
        };
        createChildContainer?: boolean;
        registerServices?(container: Container): void;
    }
}
