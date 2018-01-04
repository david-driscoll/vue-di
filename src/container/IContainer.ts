import { Key } from '../types';
import { Container } from './Container';

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
