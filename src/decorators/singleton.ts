/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import { SingletonRegistration } from '../registration/SingletonRegistration';
import { keyedDecorator } from './keyedDecorator';
import { Registration } from './registration';

/**
 * Decorator: Specifies to register the decorated item with a "singleton" lifetime.
 *
 * @export
 */
export const Singleton = keyedDecorator(key => Registration(new SingletonRegistration(key)));
