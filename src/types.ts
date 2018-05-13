/**
 * Used to allow functions/classes to specify custom dependency resolution logic.
 */
export type TypedKey<T> = { new (...args: any[]): T }
| { get(container: IContainer, key: Key<T>): T };
export type RegistrationFactory<T> = { new (...args: any[]): T } | (() => T);
export type Key<T> =
    | string
    | symbol
    | TypedKey<T>;
// tslint:disable-next-line:interface-name
export type Factory<T> = {
    (...args: any[]): T;
    new (...args: any[]): T;
}
export type Lazy<T> = () => T;

// tslint:disable-next-line:interface-name
export interface Resolver<T> {
    get(container: IContainer, key: Key<T>): T;
}

export type FactoryMethod<T> = (container: IContainer, key?: Key<T>) => T;

export interface IContainer {
    /**
     * Resolves a single instance based on the provided key.
     * @param key The key that identifies the object to resolve.
     * @return Returns the resolved instance.
     */
    get<T>(key: Key<T>): T;

    /**
     * Resolves all instance registered under the provided key.
     * @param key The key that identifies the objects to resolve.
     * @return Returns an array of the resolved instances.
     */
    getAll<T>(key: Key<T>): ReadonlyArray<T>;
    /**
     * Invokes a function, recursively resolving its dependencies.
     * @param fn The function to invoke with the auto-resolved dependencies.
     * @param dynamicDependencies Additional function dependencies to use during invocation.
     * @return Returns the instance resulting from calling the function.
     */
    invoke<T>(fn: Function, dynamicDependencies?: any[]): T;
}

export function isResolver(value: any): value is Resolver<any> {
    return value.get && typeof value.get === 'function';
}
