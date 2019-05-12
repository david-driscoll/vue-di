import Vue from 'vue';
import { Container } from './src/container';
import { install } from './src/plugin';
import { Key } from './src/types';
export { install };
export default { install };

// tslint:disable:interface-name
declare module 'vue/types/vue' {
    interface VueConstructor {
        container: Container;
    }

    // tslint:disable-next-line:no-shadowed-variable
    interface Vue {
        $container: Container;
    }
}

declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        dependencies?: { [key: string]: Key<any> };
        createChildContainer?: boolean;
        registerServices?(container: Container): void;
    }
}
