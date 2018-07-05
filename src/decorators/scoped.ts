/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import { ScopedRegistration } from '../registration/ScopedRegistration';
import { keyedDecorator } from './keyedDecorator';
import { Registration } from './registration';

/**
 * Decorator: Specifies to register the decorated item with a "Scoped" lifetime.
 *
 * @export
 */
export const Scoped = keyedDecorator(key => Registration(new ScopedRegistration(key)));
