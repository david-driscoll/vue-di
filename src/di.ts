import Vue from 'vue';

import { Container, IContainerConfiguration } from './container';
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
import { IResolver } from './resolvers';

export default {
    install,
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
};

export {
    Container,
    IContainerConfiguration,
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
};

declare module 'vue/types/vue' {
    interface VueConstructor {
        container: Container;
    }

    interface Vue {
        container?: Container;
    }
}

declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        dependencies?: {
            [key: string]: symbol | string | { new (...args: any[]): any } | IResolver;
        };
        createChildContainer?: boolean;
        registerServices?(container: Container): void;
    }
}
