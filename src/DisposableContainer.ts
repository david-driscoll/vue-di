import { Container } from 'aurelia-dependency-injection';
import { IDisposable } from 'ts-disposables';

declare module 'aurelia-dependency-injection' {
    // tslint:disable-next-line:interface-name no-shadowed-variable
    interface Container {
        dispose(): void;
    }
}

Container.prototype.dispose = function dispose() {
    const resolvers = (this as any)._resolvers as Map<any, any>;
    for (const item of resolvers) {
        console.log(item);
    }
    (this as any)._resolvers.clear();
    (this as any)._resolvers = null;
    (this as any)._configuration = null;
    (this as any).parent = null;
    (this as any).root = null;
};
