/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import { InvocationHandler } from './InvocationHandler';

/**
 * Used to configure a Container instance.
 */
export interface IContainerConfiguration {
    handlers?: Map<any, any>;
    /**
     * An optional callback which will be called when any function needs an InvocationHandler
     *  created (called once per Function).
     */
    onHandlerCreated?(handler: InvocationHandler): InvocationHandler;
}
