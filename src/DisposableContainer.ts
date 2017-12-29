import { Container } from 'aurelia-dependency-injection';
import { IDisposable } from 'ts-disposables';

export class DisposableContainer extends Container implements IDisposable {
    public static wrap(container: Container): DisposableContainer {
        (container as any).dispose = DisposableContainer.prototype.dispose;

        return container as any;
    }

    public dispose() {
        const resolvers = (this as any)._resolvers as Map<any, any>;
        for (const item of resolvers) {
            console.log(item);
        }
        (this as any)._resolvers.clear();
        (this as any)._resolvers = null;
        (this as any)._configuration = null;
        (this as any).parent = null;
        (this as any).root = null;
    }
}
