/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */
import { TransientRegistration } from '../registration/TransientRegistration';
import { keyedDecorator } from './keyedDecorator';
import { Registration } from './registration';

/**
 * Decorator: Specifies to register the decorated item with a "Transient" lifetime.
 *
 * @export
 */
export const Transient = keyedDecorator(key => Registration(new TransientRegistration(key)));
