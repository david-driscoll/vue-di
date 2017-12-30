import { Container, Resolver } from 'aurelia-dependency-injection';
import Vue from 'vue';

import {
    All,
    AutoInject,
    Inject,
    Lazy,
    NewInstance,
    Optional,
    Parent,
    Registration,
    Resolve,
    Singleton,
    Transient,
} from './decorators';
import { install } from './plugin';

export default {
    install,
    All,
    AutoInject,
    Inject,
    Lazy,
    NewInstance,
    Optional,
    Parent,
    Registration,
    Resolve,
    Singleton,
    Transient,
};

export {
    All,
    AutoInject,
    Lazy,
    Inject,
    NewInstance,
    Optional,
    Parent,
    Registration,
    Resolve,
    Singleton,
    Transient,
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
            [key: string]: symbol | string | { new (...args: any[]): any } | Resolver;
        };
        createChildContainer?: boolean;
        registerServices?(container: Container): void;
    }
}
