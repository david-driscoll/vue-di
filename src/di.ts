import Vue from 'vue';

import * as resolvers from './resolvers';
import { Builder } from './builders';
import { Container, IContainer, IContainerConfiguration } from './container';
import * as decorators from './decorators';
import { install } from './plugin';
import { IRegistration } from './registration/Registration';
import { Key } from './types';

export * from './decorators';
export * from './resolvers';
export * from './protocol/protocol';
export * from './types';

// export default {
//     Builder,
//     Container,
//     install,
//     ...decorators,
//     ...resolvers,
// };

export {
    Builder,
    Container,
    IContainerConfiguration,
    IContainer,
    IRegistration,
    install,
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
            [key: string]: Key<any>;
        };
        createChildContainer?: boolean;
        registerServices?(container: Container): void;
    }
}
