import Vue from 'vue';
import {
    All,
    AutoInject,
    Builder,
    Container,
    Factory,
    Key,
    Lazy,
    NewInstance,
    Optional,
    Parent,
    Resolve,
    Singleton,
    Transient,
} from './di';

import { install } from './plugin';
export * from './di';

export default {
    Builder,
    Container,
    install,
    All,
    AutoInject,
    Factory,
    Lazy,
    NewInstance,
    Optional,
    Parent,
    Resolve,
    Singleton,
    Transient,
};

export { install };

// tslint:disable:interface-name
declare module 'vue/types/vue' {
    interface VueConstructor {
        container: Container;
    }

    // tslint:disable-next-line:no-shadowed-variable
    interface Vue {
        container: Container;
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
