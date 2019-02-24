import { Builder } from './builders';
import { Container } from './container';
import {
    All,
    AutoInject,
    Dependencies,
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
import { Key } from './types';

export * from './container';
export * from './decorators';
export * from './protocol/protocol';
export * from './types';
export { Builder, Container };

export default {
    Builder,
    Container,
    All,
    AutoInject,
    Dependencies,
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
