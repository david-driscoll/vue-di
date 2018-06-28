import { ScopedRegistration } from '../registration/ScopedRegistration';
import { Key } from '../types';
import { Registration } from './registration';

/**
 * Decorator: Specifies to register the decorated item with a "scoped" lifetime.
 *
 * @export
 */
export function Scoped<T extends Function>(ctor: T): void;
export function Scoped(): ClassDecorator;
export function Scoped(key: Key<any>): ClassDecorator;
export function Scoped(key?: Key<any>): any {
    if (key) {
        return Registration(new ScopedRegistration())(key);
    } else {
        return Registration(new ScopedRegistration());
    }
}
