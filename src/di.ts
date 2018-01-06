import Vue from 'vue';

import { Builder } from './builders';
import { Container, IContainerConfiguration } from './container';
import * as decorators from './decorators';
import { install } from './plugin';
import { IRegistration } from './registration/Registration';
import { IContainer, Key } from './types';

export * from './decorators';
export * from './protocol/protocol';
export * from './types';

export default {
    Builder,
    Container,
    install,
    ...decorators,
};

export { Builder, Container, IContainerConfiguration, IContainer, IRegistration, install };

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
