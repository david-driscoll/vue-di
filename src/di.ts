import Vue from 'vue';

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
import { Key } from './types';
import { Container } from './container';

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

export { Container, IContainerConfiguration } from './container';
export { Factory, Key } from './types';


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
            [key: string]: Key<any>;
        };
        createChildContainer?: boolean;
        registerServices?(container: Container): void;
    }
}
