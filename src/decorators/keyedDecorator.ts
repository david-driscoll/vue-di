import { Key } from '../types';

export function keyedDecorator<T>(factory: (key?: Key<T>) => ClassDecorator) {
    function Decorator<TFunction extends Function>(target: TFunction): TFunction | void {
        return factory()(target);
    }

    // tslint:disable-next-line:prefer-object-spread
    return Object.assign(Decorator, {
        key(key: Key<T>) {
            return factory(key);
        },
    });
}
