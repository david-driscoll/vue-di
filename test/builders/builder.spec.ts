import { expect } from 'chai';
import { Builder } from '../../src/builders/Builder';
import { Container } from '../../src/container/Container';

describe('Builder', () => {
    class Service {}
    class Logger {}

    describe('register', () => {
        it('should register as a delegate', () => {
            const container = new Container();

            const builder = new Builder(container);
            const symbol = Symbol(Service.toString());

            builder.register((_) => new Service()).as(Service);

            container.get(Service).should.not.be.null;
        });

        it('should allow getting internal services', () => {
            const container = new Container();

            const builder = new Builder(container);
            const symbol = Symbol(Service.toString());

            builder.register((_) => _.get(Service)).as(symbol);

            container.get<Service>(symbol).should.not.be.null;
        });

        it('should fail is not aliased with a symbol', () => {
            const container = new Container();

            const builder = new Builder(container);
            const symbol = Symbol(Service.toString());

            builder.register((_) => _.get(Service)).as(Service);

            expect(() => container.get<Service>(symbol)).to.throw(
                'Cannot auto register a non method'
            );
        });

        it('should register aliases', () => {
            const container = new Container();

            const builder = new Builder(container);
            const symbol = Symbol(Service.toString());

            builder
                .register((_) => new Service())
                .as(Service)
                .as(symbol)
                .singleInstance();

            container.get(Service).should.be.equal(container.get(symbol));
        });
    });

    describe('registerType', () => {
        it('should register as a type', () => {
            const container = new Container();

            const builder = new Builder(container);
            const symbol = Symbol(Service.toString());

            builder.registerType(Service);

            container.get(Service).should.not.be.null;
        });

        it('should register aliases', () => {
            const container = new Container();

            const builder = new Builder(container);
            const symbol = Symbol(Service.toString());

            builder.registerType(Service).asSelf().as(symbol).singleInstance();

            container.get(Service).should.be.equal(container.get(symbol));
        });

        it('should fail is not aliased with a symbol', () => {
            const container = new Container();

            const builder = new Builder(container);
            const symbol = Symbol(Service.toString());

            builder.registerType(Service).as(Service);

            expect(() => container.get<Service>(symbol)).to.throw(
                'Cannot auto register a non method'
            );
        });

        it('should not register itself by default', () => {
            const container = new Container();

            const builder = new Builder(container);
            const symbol = Symbol(Service.toString());

            builder.registerType(Service).asSelf().as(symbol).singleInstance();

            container.get(Service).should.be.equal(container.get(symbol));
        });
    });

    describe('registerInstance', () => {
        it('should register as a delegate', () => {
            const container = new Container();

            const builder = new Builder(container);
            const symbol = Symbol(Service.toString());

            builder.registerInstance(new Service());

            container.get(Service).should.not.be.null;
        });

        it('should register aliases', () => {
            const container = new Container();

            const builder = new Builder(container);
            const symbol = Symbol(Service.toString());

            builder.registerInstance(new Service()).as(symbol).as(Service);

            container.get(Service).should.be.equal(container.get(symbol));
        });

        it('should fail is not aliased with a symbol', () => {
            const container = new Container();

            const builder = new Builder(container);
            const symbol = Symbol(Service.toString());

            builder.registerInstance(new Service()).as(Service);

            expect(() => container.get<Service>(symbol)).to.throw(
                'Cannot auto register a non method'
            );
        });

        it('should not register itself by default', () => {
            const container = new Container();

            const builder = new Builder(container);
            const symbol = Symbol(Service.toString());

            builder.registerInstance(new Service()).as(Service).as(symbol);

            container.get(Service).should.be.equal(container.get(symbol));
        });
    });
});
