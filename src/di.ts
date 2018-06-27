import { Builder } from './builders';
import { Container } from './container';
import {
    All,
    AutoInject,
    Factory,
    Lazy,
    NewInstance,
    Optional,
    Parent,
    Inject,
    Registration,
    Resolve,
    Singleton,
    Transient,
} from './decorators';

export * from './container';
export * from './decorators';
export * from './protocol/protocol';
export * from './types';

export default {
    Builder,
    Container,
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

export { Builder, Container };
