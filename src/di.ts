import { Builder } from './builders';
import { Container } from './container';
import {
    All,
    AutoInject,
    Factory,
    Inject,
    Lazy,
    NewInstance,
    Optional,
    Parent,
    Resolve,
    Scoped,
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
    Inject,
    NewInstance,
    Optional,
    Parent,
    Resolve,
    Scoped,
    Singleton,
    Transient,
};

export { Builder, Container };
