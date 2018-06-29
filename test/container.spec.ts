import { expect } from 'chai';
import { __decorate } from 'tslib';
import { Container } from '../src/container/Container';
import {
    All,
    AutoInject,
    Factory,
    Lazy,
    NewInstance,
    Optional,
    Parent,
    Scoped,
    Singleton,
    Transient,
} from '../src/decorators';
import { Inject } from '../src/decorators/inject';
import { AllResolver } from '../src/resolvers/AllResolver';
import { FactoryResolver } from '../src/resolvers/FactoryResolver';
import { LazyResolver } from '../src/resolvers/LazyResolver';
import { NewInstanceResolver } from '../src/resolvers/NewInstanceResolver';
import { OptionalResolver } from '../src/resolvers/OptionalResolver';
import { ParentResolver } from '../src/resolvers/ParentResolver';
import { IFactory } from '../src/types';

describe('container', () => {
    describe('injection', () => {
        it('instantiates class without injected services', () => {
            class App {}

            const container = new Container();
            const app = container.get(App);

            expect(app).to.be.instanceOf(App);
        });

        it('uses static inject method (ES6)', () => {
            class Logger {}

            class App {
                public static inject() {
                    return [Logger];
                }
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            const container = new Container();
            const app = container.get(App);
            expect(app.logger).to.be.instanceOf(Logger);
        });

        it('uses static inject property (TypeScript,CoffeeScript,ES5)', () => {
            class Logger {}

            class App {
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            (App as any).inject = [Logger];

            const container = new Container();
            const app = container.get(App);

            expect(app.logger).to.be.instanceOf(Logger);
        });

        describe('fails to inject for missing dependency', () => {
            it('fails with function dependency (auto injected)', () => {
                @AutoInject
                class App {
                    constructor(public arg: () => void) {}
                }


                const container = new Container();
                expect(() =>  container.get(App)).to.throw(/Invalid key found on App looking for type Function/);
            });

            it('fails with function dependency', () => {
                @Singleton
                class App {
                    constructor(public arg: () => void) {}
                }


                const container = new Container();
                expect(() =>  container.get(App)).to.throw(/Invalid key found on App looking for type Function/);
            });

            it('fails with string dependency', () => {
                @Singleton
                class App {
                    constructor(public arg: string) {}
                }


                const container = new Container();
                expect(() =>  container.get(App)).to.throw(/Invalid key found on App looking for type String/);
            });

            it('fails with number dependency', () => {
                @Singleton
                class App {
                    constructor(public arg: number) {}
                }


                const container = new Container();
                expect(() =>  container.get(App)).to.throw(/Invalid key found on App looking for type Number/);
            });

            it('fails with boolean dependency', () => {
                @Singleton
                class App {
                    constructor(public arg: boolean) {}
                }


                const container = new Container();
                expect(() =>  container.get(App)).to.throw(/Invalid key found on App looking for type Boolean/);
            });

            it('fails with object dependency', () => {
                @Singleton
                class App {
                    constructor(public arg: { hello: string; }) {}
                }


                const container = new Container();
                expect(() =>  container.get(App)).to.throw(/Invalid key found on App looking for type Object/);
            });

            it('fails with regexp dependency', () => {
                @Singleton
                class App {
                    constructor(public arg: RegExp) {}
                }


                const container = new Container();
                expect(() =>  container.get(App)).to.throw(/Invalid key found on App looking for type RegExp/);
            });

            it('fails with array dependency', () => {
                @Singleton
                class App {
                    constructor(public arg: string[]) {}
                }


                const container = new Container();
                expect(() =>  container.get(App)).to.throw(/Invalid key found on App looking for type Array/);
            });

            it('fails with promise dependency', () => {
                @Singleton
                class App {
                    constructor(public arg: Promise<any>) {}
                }


                const container = new Container();
                expect(() =>  container.get(App)).to.throw(/Invalid key found on App looking for type Promise/);
            });
        });
    });

    describe('inheritence', () => {
        class Service {}
        class Logger {}

        it('loads dependencies for the parent class', () => {
            class ParentApp {
                public static inject() {
                    return [Logger];
                }
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            class ChildApp extends ParentApp {
                public constructor(logger: Logger) {
                    super(logger);
                }
            }

            const container = new Container();
            const app = container.get(ChildApp);
            expect(app.logger).to.be.instanceOf(Logger);
        });

        it('loads dependencies for the child class', () => {
            class ParentApp {
                public constructor(rest: any[]) {}
            }

            class ChildApp extends ParentApp {
                public static inject() {
                    return [Service];
                }
                public constructor(public service: Service, ...rest: any[]) {
                    super(rest);
                    this.service = service;
                }
            }

            const container = new Container();
            const app = container.get(ChildApp);
            expect(app.service).to.be.instanceOf(Service);
        });

        it('loads dependencies for both classes', () => {
            class ParentApp {
                public static inject() {
                    return [Logger];
                }
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            class ChildApp extends ParentApp {
                public static inject() {
                    return [Service];
                }
                public constructor(public service: Service, ...rest: any[]) {
                    super(rest[0]);
                    this.service = service;
                }
            }

            const container = new Container();
            const app = container.get(ChildApp);
            expect(app.service).to.be.instanceOf(Service);
            expect(app.logger).to.be.instanceOf(Logger);
        });
    });

    describe('autoinject', () => {
        class Logger {}
        class Service {}
        class SubService1 {}
        class SubService2 {}

        it('loads dependencies in tree classes', () => {
            @AutoInject
            class ParentApp {
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            @AutoInject
            class ChildApp extends ParentApp {
                public constructor(public service: Service, logger: Logger) {
                    super(logger);
                    this.service = service;
                }
            }

            @AutoInject
            class SubChildApp1 extends ChildApp {
                public constructor(
                    public subService1: SubService1,
                    service: Service,
                    logger: Logger
                ) {
                    super(service, logger);
                    this.subService1 = subService1;
                }
            }

            @AutoInject
            class SubChildApp2 extends ChildApp {
                public constructor(
                    public subService2: SubService2,
                    service: Service,
                    logger: Logger
                ) {
                    super(service, logger);
                    this.subService2 = subService2;
                }
            }

            class SubChildApp3 extends ChildApp {}

            @AutoInject
            class SubChildApp4 extends ChildApp {
                public constructor(
                    public logger: Logger,
                    public subService1: SubService1,
                    public service: Service
                ) {
                    super(service, logger);
                    this.subService1 = subService1;
                }
            }

            const container = new Container();

            const app1 = container.get(SubChildApp1);
            expect(app1.subService1).to.be.instanceOf(SubService1);
            expect(app1.service).to.be.instanceOf(Service);
            expect(app1.logger).to.be.instanceOf(Logger);

            const app2 = container.get(SubChildApp2);
            expect(app2.subService2).to.be.instanceOf(SubService2);
            expect(app2.service).to.be.instanceOf(Service);
            expect(app2.logger).to.be.instanceOf(Logger);

            const app3 = container.get(SubChildApp3);
            expect(app3.service).to.be.instanceOf(Service);
            expect(app3.logger).to.be.instanceOf(Logger);

            const app4 = container.get(SubChildApp4);
            expect(app4.subService1).to.be.instanceOf(SubService1);
            expect(app4.service).to.be.instanceOf(Service);
            expect(app4.logger).to.be.instanceOf(Logger);
        });
    });

    describe('registration', () => {
        it('asserts keys are defined', () => {
            const container = new Container();

            expect(() => container.get(null as any)).to.throw();
            expect(() => container.get(undefined as any)).to.throw();

            expect(() => container.registerInstance(null as any, {})).to.throw();
            expect(() => container.registerInstance(undefined as any, {})).to.throw();

            expect(() => container.registerSingleton(null as any)).to.throw();
            expect(() => container.registerSingleton(undefined as any)).to.throw();

            expect(() => container.registerScoped(null as any)).to.throw();
            expect(() => container.registerScoped(undefined as any)).to.throw();

            expect(() => container.registerTransient(null as any)).to.throw();
            expect(() => container.registerTransient(undefined as any)).to.throw();

            expect(() => container.autoRegister(null as any)).to.throw();
            expect(() => container.autoRegister(undefined as any)).to.throw();

            expect(() => container.autoRegisterAll([null])).to.throw();
            expect(() => container.autoRegisterAll([undefined])).to.throw();

            expect(() => container.registerHandler(null as any, null as any)).to.throw();
            expect(() => container.registerHandler(undefined as any, undefined as any)).to.throw();

            expect(() => container.hasHandler(null as any)).to.throw();
            expect(() => container.hasHandler(undefined as any)).to.throw();
        });

        it('automatically configures as singleton', () => {
            class Logger {}

            class App1 {
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            Inject(Logger)(App1);

            class App2 {
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            Inject(Logger)(App2);

            const container = new Container();
            const app1 = container.get(App1);
            const app2 = container.get(App2);

            expect(app1.logger).to.be.equal(app2.logger);
        });

        it('configures singleton via api', () => {
            class Logger {}

            class App1 {
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            Inject(Logger)(App1);

            class App2 {
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            Inject(Logger)(App2);

            const container = new Container();
            container.registerSingleton(Logger, Logger);

            const app1 = container.get(App1);
            const app2 = container.get(App2);

            expect(app1.logger).to.equal(app2.logger);
        });

        it('configures singleton via decorators helper (ES5/6)', () => {
            @Singleton
            class Logger {}

            class App1 {
                public static inject() {
                    return [Logger];
                }
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            class App2 {
                public static inject() {
                    return [Logger];
                }
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            const container = new Container();
            const childContainer = container.createChild();
            const app1 = container.get(App1);
            const app2 = childContainer.get(App2);

            expect(app1.logger).to.equal(app2.logger);
        });

        it('configures scoped via api [singleton]', () => {
            class Logger {
                private static value = 0;
                public value = Logger.value++;
            }

            class App1 {
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            Inject(Logger)(App1);

            class App2 {
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            Inject(Logger)(App2);

            const container = new Container();
            const containerChild = container.createChild();
            container.registerScoped(Logger);
            container.registerTransient(App1);
            container.registerTransient(App2);

            const app1 = containerChild.get(App1);
            const app2 = containerChild.get(App2);

            expect(app1.logger).to.equal(app2.logger);
        });

        it('configures scoped via decorators helper (ES5/6) [singleton]', () => {
            @Scoped
            class Logger {
                private static value = 0;
                public value = Logger.value++;
            }

            @Transient
            class App1 {
                public static inject() {
                    return [Logger];
                }
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            @Transient
            class App2 {
                public static inject() {
                    return [Logger];
                }
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            const container = new Container();
            const containerChild = container.createChild();
            const app1 = containerChild.get(App1);
            const app2 = containerChild.get(App2);

            expect(app1.logger).to.equal(app2.logger);
        });

        it('configures scoped via api [transient]', () => {
            class Logger {
                private static value = 0;
                public value = Logger.value++;
            }

            class App1 {
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            Inject(Logger)(App1);

            class App2 {
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            Inject(Logger)(App2);

            const container = new Container();
            container.registerScoped(Logger);
            const containerChild = container.createChild();
            container.registerScoped(App1);
            containerChild.registerScoped(App2);

            const app1 = container.get(App1);
            const app2 = containerChild.get(App2);

            expect(app1.logger).not.to.equal(app2.logger);
        });

        it('configures scoped via decorators helper (ES5/6) [transient]', () => {
            @Scoped
            class Logger {
                private static value = 0;
                public value = Logger.value++;
            }

            class App1 {
                public static inject() {
                    return [Logger];
                }
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            class App2 {
                public static inject() {
                    return [Logger];
                }
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            const container = new Container();
            const containerChild = container.createChild();
            const app1 = container.get(App1);
            const app2 = containerChild.get(App2);

            expect(app1.logger).not.to.equal(app2.logger);
        });

        it('configures transient (non singleton) via api', () => {
            class Logger {}

            class App1 {
                public static inject() {
                    return [Logger];
                }
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            class App2 {
                public static inject() {
                    return [Logger];
                }
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            const container = new Container();
            container.registerTransient(Logger, Logger);

            const app1 = container.get(App1);
            const app2 = container.get(App2);

            expect(app1.logger).not.to.equal(app2.logger);
        });

        it('configures transient (non singleton) via metadata method (ES5/6)', () => {
            @Transient
            class Logger {}

            class App1 {
                public static inject() {
                    return [Logger];
                }
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            class App2 {
                public static inject() {
                    return [Logger];
                }
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            const container = new Container();
            const app1 = container.get(App1);
            const app2 = container.get(App2);

            expect(app1.logger).not.to.equal(app2.logger);
        });

        it('configures instance via api', () => {
            class Logger {}

            class App1 {
                public static inject() {
                    return [Logger];
                }
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            class App2 {
                public static inject() {
                    return [Logger];
                }
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            const container = new Container();
            const instance = new Logger();
            container.registerInstance(Logger, instance);

            const app1 = container.get(App1);
            const app2 = container.get(App2);

            expect(app1.logger).to.equal(instance);
            expect(app2.logger).to.equal(instance);
        });

        it('configures custom via api', () => {
            class Logger {}

            class App1 {
                public static inject() {
                    return [Logger];
                }
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            class App2 {
                public static inject() {
                    return [Logger];
                }
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            const container = new Container();
            container.registerHandler(Logger, c => 'something strange');

            const app1 = container.get(App1);
            const app2 = container.get(App2);

            expect(app1.logger).to.equal('something strange');
            expect(app2.logger).to.equal('something strange');
        });

        it('uses base metadata method (ES5/6) when derived does not specify', () => {
            @Transient
            class LoggerBase {}

            class Logger extends LoggerBase {}

            class App1 {
                public static inject() {
                    return [Logger];
                }
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            class App2 {
                public static inject() {
                    return [Logger];
                }
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            const container = new Container();
            const app1 = container.get(App1);
            const app2 = container.get(App2);

            expect(app1.logger).not.to.be.equal(app2.logger);
        });

        it('overrides base metadata method (ES5/6) with derived configuration', () => {
            @Singleton
            class LoggerBase {}
            @Transient
            class Logger extends LoggerBase {}

            class App1 {
                public static inject() {
                    return [Logger];
                }
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            class App2 {
                public static inject() {
                    return [Logger];
                }
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            const container = new Container();
            const app1 = container.get(App1);
            const app2 = container.get(App2);

            expect(app1.logger).not.to.equal(app2.logger);
        });

        it('configures key as service when transient api only provided with key', () => {
            class Logger {}

            const container = new Container();
            container.registerTransient(Logger);

            const logger1 = container.get(Logger);
            const logger2 = container.get(Logger);

            expect(logger1).to.be.instanceOf(Logger);
            expect(logger2).to.be.instanceOf(Logger);
            expect(logger2).not.to.equal(logger1);
        });

        it('configures key as service when scoped api only provided with key', () => {
            class Logger {}

            const container = new Container();
            container.registerScoped(Logger);
            const containerChild = container.createChild();

            const logger1 = container.get(Logger);
            const logger2 = containerChild.get(Logger);

            expect(logger1).to.be.instanceOf(Logger);
            expect(logger2).to.be.instanceOf(Logger);
            expect(logger2).not.to.equal(logger1);
        });

        it('configures key as service when singleton api only provided with key', () => {
            class Logger {}

            const container = new Container();
            container.registerSingleton(Logger);

            const logger1 = container.get(Logger);
            const logger2 = container.get(Logger);

            expect(logger1).to.be.instanceOf(Logger);
            expect(logger2).to.be.instanceOf(Logger);
            expect(logger2).to.equal(logger1);
        });

        it('configures concrete singleton via api for abstract dependency', () => {
            class LoggerBase {}
            class Logger extends LoggerBase {}

            class App {
                public static inject() {
                    return [LoggerBase];
                }
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            const container = new Container();
            container.registerSingleton(LoggerBase, Logger);

            const app = container.get(App);

            expect(app.logger).to.be.instanceOf(Logger);
        });

        it('configures concrete scoped via api for abstract dependency', () => {
            class LoggerBase {}
            class Logger extends LoggerBase {}

            class App {
                public static inject() {
                    return [LoggerBase];
                }
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            const container = new Container();
            container.registerScoped(LoggerBase, Logger);
            const childContainer = container.createChild();

            const app = childContainer.get(App);

            expect(app.logger).to.be.instanceOf(Logger);
        });

        it('configures concrete transient via api for abstract dependency', () => {
            class LoggerBase {}
            class Logger extends LoggerBase {}

            class App {
                public static inject() {
                    return [LoggerBase];
                }
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            const container = new Container();
            container.registerTransient(LoggerBase, Logger);

            const app = container.get(App);

            expect(app.logger).to.be.instanceOf(Logger);
        });

        it(`doesn't get hidden when a super class adds metadata which doesn't include the base registration type`, () => {
            @Transient
            class LoggerBase {}

            class Logger extends LoggerBase {}

            Reflect.defineMetadata('something', 'test', Logger);

            class App1 {
                public static inject() {
                    return [Logger];
                }
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            class App2 {
                public static inject() {
                    return [Logger];
                }
                public constructor(public logger: Logger) {
                    this.logger = logger;
                }
            }

            const container = new Container();
            const app1 = container.get(App1);
            const app2 = container.get(App2);

            expect(app1.logger).not.to.equal(app2.logger);
        });

        describe('Custom resolvers', () => {
            describe('Lazy', () => {
                it('provides a function which, when called, will return the instance', () => {
                    class Logger {}

                    class App1 {
                        public static inject() {
                            return [LazyResolver.of(Logger)];
                        }
                        public constructor(public getLogger: () => Logger) {
                            this.getLogger = getLogger;
                        }
                    }

                    const container = new Container();
                    const app1 = container.get(App1);

                    const logger = app1.getLogger;

                    expect(logger()).to.be.instanceOf(Logger);
                });

                it('provides a function which, when called, will return the instance using decorator', () => {
                    class Logger {}

                    class App1 {
                        public static inject = [Logger];
                        public constructor(public getLogger: () => Logger) {
                            this.getLogger = getLogger;
                        }
                    }

                    Lazy(Logger)(App1, 'getLogger', 0);

                    const container = new Container();
                    const app1 = container.get(App1);

                    const logger = app1.getLogger;

                    expect(logger()).to.be.instanceOf(Logger);
                });
            });

            describe('All', () => {
                it('resolves last matching dependency when getting single', () => {
                    class LoggerBase {}

                    class VerboseLogger extends LoggerBase {}

                    class Logger extends LoggerBase {}

                    class App {
                        public static inject() {
                            return [LoggerBase];
                        }
                        public constructor(public logger: LoggerBase) {
                            this.logger = logger;
                        }
                    }

                    const container = new Container();
                    container.registerTransient(LoggerBase, Logger);
                    container.registerSingleton(LoggerBase, VerboseLogger);
                    const app = container.get(App);

                    expect(app.logger).to.be.instanceOf(VerboseLogger);
                });

                it('resolves all matching dependencies as an array of instances', () => {
                    class LoggerBase {}

                    class VerboseLogger extends LoggerBase {}

                    class Logger extends LoggerBase {}

                    class App {
                        public static inject() {
                            return [AllResolver.of(LoggerBase)];
                        }
                        public constructor(public loggers: LoggerBase[]) {
                            this.loggers = loggers;
                        }
                    }

                    const container = new Container();
                    container.registerSingleton(LoggerBase, VerboseLogger);
                    container.registerTransient(LoggerBase, Logger);
                    const app = container.get(App);

                    expect(app.loggers).to.be.instanceOf(Array);
                    expect(app.loggers.length).to.equal(2);
                    expect(app.loggers[0]).to.be.instanceOf(VerboseLogger);
                    expect(app.loggers[1]).to.be.instanceOf(Logger);
                });

                it('resolves all matching dependencies as an array of instances using decorator', () => {
                    class LoggerBase {}

                    class VerboseLogger extends LoggerBase {}

                    class Logger extends LoggerBase {}

                    class App {
                        public static inject = [LoggerBase];
                        public constructor(public loggers: LoggerBase[]) {
                            this.loggers = loggers;
                        }
                    }

                    All(LoggerBase)(App, 'loggers', 0);

                    const container = new Container();
                    container.registerSingleton(LoggerBase, VerboseLogger);
                    container.registerTransient(LoggerBase, Logger);
                    const app = container.get(App);

                    expect(app.loggers).to.be.instanceOf(Array);
                    expect(app.loggers.length).to.equal(2);
                    expect(app.loggers[0]).to.be.instanceOf(VerboseLogger);
                    expect(app.loggers[1]).to.be.instanceOf(Logger);
                });

                it('resolves last matching dependency when getting single [children]', () => {
                    class LoggerBase {}

                    class VerboseLogger extends LoggerBase {}

                    class Logger extends LoggerBase {}

                    class App {
                        public static inject() {
                            return [LoggerBase];
                        }
                        public constructor(public logger: LoggerBase) {
                            this.logger = logger;
                        }
                    }

                    const container = new Container();
                    const childContainer = container.createChild();
                    childContainer.registerTransient(LoggerBase, Logger);
                    container.registerSingleton(LoggerBase, VerboseLogger);
                    const app = childContainer.get(App);

                    expect(app.logger).to.be.instanceOf(Logger);
                });

                it('resolves all matching dependencies as an array of instances [children]', () => {
                    class LoggerBase {}

                    class VerboseLogger extends LoggerBase {}

                    class Logger extends LoggerBase {}

                    class App {
                        public static inject() {
                            return [AllResolver.of(LoggerBase)];
                        }
                        public constructor(public loggers: LoggerBase[]) {
                            this.loggers = loggers;
                        }
                    }

                    const container = new Container();
                    const childContainer = container.createChild();
                    container.registerSingleton(LoggerBase, VerboseLogger);
                    childContainer.registerTransient(LoggerBase, Logger);
                    const app = childContainer.get(App);

                    expect(app.loggers).to.be.instanceOf(Array);
                    expect(app.loggers.length).to.equal(2);
                    expect(app.loggers[0]).to.be.instanceOf(VerboseLogger);
                    expect(app.loggers[1]).to.be.instanceOf(Logger);
                });

                it('resolves all matching dependencies as an array of instances using decorator [children]', () => {
                    class LoggerBase {}

                    class VerboseLogger extends LoggerBase {}

                    class Logger extends LoggerBase {}

                    class App {
                        public static inject = [LoggerBase];
                        public constructor(public loggers: LoggerBase[]) {
                            this.loggers = loggers;
                        }
                    }

                    All(LoggerBase)(App, 'loggers', 0);

                    const container = new Container();
                    const childContainer = container.createChild();
                    container.registerSingleton(LoggerBase, VerboseLogger);
                    childContainer.registerTransient(LoggerBase, Logger);
                    const app = childContainer.get(App);

                    expect(app.loggers).to.be.instanceOf(Array);
                    expect(app.loggers.length).to.equal(2);
                    expect(app.loggers[0]).to.be.instanceOf(VerboseLogger);
                    expect(app.loggers[1]).to.be.instanceOf(Logger);
                });
            });

            describe('inject as param decorator', () => {
                it('resolves a matching dependency using the inject decorator', () => {
                    class Logger {}

                    class App1 {
                        public static inject = [Logger];
                        public constructor(public logger: Logger) {
                            this.logger = logger;
                        }
                    }

                    Inject(Logger)(App1, null, 0);

                    const container = new Container();
                    const app1 = container.get(App1);

                    const logger = app1.logger;

                    expect(logger).to.be.instanceOf(Logger);
                });
            });

            describe('Optional', () => {
                it('injects the instance if its registered in the container', () => {
                    class Logger {}

                    class App {
                        public static inject() {
                            return [OptionalResolver.of(Logger)];
                        }
                        public constructor(public logger: Logger) {
                            this.logger = logger;
                        }
                    }

                    const container = new Container();
                    container.registerSingleton(Logger, Logger);
                    const app = container.get(App);

                    expect(app.logger).to.be.instanceOf(Logger);
                });

                it('injects the instance if its registered in the container using decorator', () => {
                    class Logger {}

                    @AutoInject
                    class App {
                        public static inject = [Logger];
                        public constructor(public logger: Logger) {
                            this.logger = logger;
                        }
                    }

                    Optional()(App, 'logger', 0);

                    const container = new Container();
                    container.registerSingleton(Logger, Logger);
                    const app = container.get(App);

                    expect(app.logger).to.be.instanceOf(Logger);
                });

                it('injects null if key is not registered in the container', () => {
                    class VerboseLogger {}
                    class Logger {}

                    class App {
                        public static inject() {
                            return [OptionalResolver.of(Logger)];
                        }
                        public constructor(public logger: Logger) {
                            this.logger = logger;
                        }
                    }

                    const container = new Container();
                    container.registerSingleton(VerboseLogger, Logger);
                    const app = container.get(App);

                    expect(app.logger).to.equal(null);
                });

                it('injects null if key is not registered in the container using decorator', () => {
                    class VerboseLogger {}
                    class Logger {}

                    @AutoInject
                    class App {
                        public static inject = [Logger];
                        public constructor(public logger: Logger) {
                            this.logger = logger;
                        }
                    }

                    Optional()(App, 'logger', 0);

                    const container = new Container();
                    container.registerSingleton(VerboseLogger, Logger);
                    const app = container.get(App);

                    expect(app.logger).to.equal(null);
                });

                it('injects null if key nor function is registered in the container', () => {
                    class VerboseLogger {}
                    class Logger {}

                    class App {
                        public static inject() {
                            return [OptionalResolver.of(Logger)];
                        }
                        public constructor(public logger: Logger) {
                            this.logger = logger;
                        }
                    }

                    const container = new Container();
                    const app = container.get(App);

                    expect(app.logger).to.equal(null);
                });

                it("doesn't check the parent container hierarchy when checkParent is false", () => {
                    class Logger {}

                    class App {
                        public static inject() {
                            return [OptionalResolver.of(Logger, false)];
                        }
                        public constructor(public logger: Logger) {
                            this.logger = logger;
                        }
                    }

                    const parentContainer = new Container();
                    parentContainer.registerSingleton(Logger, Logger);

                    const childContainer = parentContainer.createChild();
                    childContainer.registerSingleton(App, App);

                    const app = childContainer.get(App);

                    expect(app.logger).to.equal(null);
                });

                it('checks the parent container hierarchy when checkParent is true or default', () => {
                    class Logger {}

                    class App {
                        public static inject() {
                            return [OptionalResolver.of(Logger)];
                        }
                        public constructor(public logger: Logger) {
                            this.logger = logger;
                        }
                    }

                    const parentContainer = new Container();
                    parentContainer.registerSingleton(Logger, Logger);

                    const childContainer = parentContainer.createChild();
                    childContainer.registerSingleton(App, App);

                    const app = childContainer.get(App);

                    expect(app.logger).to.be.instanceOf(Logger);
                });

                it('checks the parent container hierarchy when checkParent is true or default (scoped)', () => {
                    class Logger {}

                    class App {
                        public static inject() {
                            return [OptionalResolver.of(Logger)];
                        }
                        public constructor(public logger: Logger) {
                            this.logger = logger;
                        }
                    }

                    const parentContainer = new Container();
                    parentContainer.registerScoped(Logger, Logger);

                    const childContainer = parentContainer.createChild();
                    childContainer.registerSingleton(App, App);

                    const app = childContainer.get(App);

                    expect(app.logger).to.be.instanceOf(Logger);
                    expect(parentContainer.get(Logger)).not.to.be.eq(app.logger);
                });
            });

            describe('Parent', () => {
                it('bypasses the current container and injects instance from parent container', () => {
                    class Logger {}

                    class App {
                        public static inject() {
                            return [ParentResolver.of(Logger)];
                        }
                        public constructor(public logger: Logger) {
                            this.logger = logger;
                        }
                    }

                    const parentContainer = new Container();
                    const parentInstance = new Logger();
                    parentContainer.registerInstance(Logger, parentInstance);

                    const childContainer = parentContainer.createChild();
                    const childInstance = new Logger();
                    childContainer.registerInstance(Logger, childInstance);
                    childContainer.registerSingleton(App, App);

                    const app = childContainer.get(App);

                    expect(app.logger).to.equal(parentInstance);
                });

                it('bypasses the current container and injects instance from parent container using decorator', () => {
                    class Logger {}

                    class App {
                        public static inject = [Logger];
                        public constructor(public logger: Logger) {
                            this.logger = logger;
                        }
                    }

                    Parent()(App, 'logger', 0);

                    const parentContainer = new Container();
                    const parentInstance = new Logger();
                    parentContainer.registerInstance(Logger, parentInstance);

                    const childContainer = parentContainer.createChild();
                    const childInstance = new Logger();
                    childContainer.registerInstance(Logger, childInstance);
                    childContainer.registerSingleton(App, App);

                    const app = childContainer.get(App);

                    expect(app.logger).to.equal(parentInstance);
                });

                it('returns null when no parent container exists', () => {
                    class Logger {}

                    class App {
                        public static inject() {
                            return [ParentResolver.of(Logger)];
                        }
                        public constructor(public logger: Logger) {
                            this.logger = logger;
                        }
                    }

                    const container = new Container();
                    const instance = new Logger();
                    container.registerInstance(Logger, instance);

                    const app = container.get(App);

                    expect(app.logger).to.equal(null);
                });

                it('returns null when no parent container exists using decorator', () => {
                    class Logger {}

                    class App {
                        public static inject = [Logger];
                        public constructor(public logger: Logger) {
                            this.logger = logger;
                        }
                    }

                    Parent(App, 'logger', 0);

                    const container = new Container();
                    const instance = new Logger();
                    container.registerInstance(Logger, instance);

                    const app = container.get(App);

                    expect(app.logger).to.equal(null);
                });
            });

            describe('Factory', () => {
                let container: Container;
                let app: App;
                let service: any;
                const data = 'test';

                class Logger {}

                class Service {
                    public static inject() {
                        return [FactoryResolver.of(Logger)];
                    }
                    public constructor(public getLogger: IFactory<Logger>, public data: any) {
                        this.getLogger = getLogger;
                        this.data = data;
                    }
                }

                class App {
                    public static inject() {
                        return [FactoryResolver.of(Service)];
                    }
                    public service: any;
                    public constructor(public getService: IFactory<Service>) {
                        this.getService = getService;
                        this.service = new getService(data);
                    }
                }

                beforeEach(() => {
                    container = new Container();
                });

                it('provides a function which, when called, will return the instance', () => {
                    app = container.get(App);
                    service = app.getService;
                    expect(service()).to.be.instanceOf(Service);
                });

                it('passes data in to the constructor as the second argument', () => {
                    app = container.get(App);
                    expect(app.service.data).to.equal(data);
                });
            });

            describe('Factory decorator', () => {
                let container: Container;
                let app: App;
                let service: any;
                const data = 'test';

                class Logger {}

                class Service {
                    public static inject = [Logger];
                    public constructor(public getLogger: IFactory<Logger>, public data: any) {
                        this.getLogger = getLogger;
                        this.data = data;
                    }
                }

                Factory(Logger)(Service, 'getLogger', 0);

                class App {
                    public static inject = [Service];
                    public service: Service;
                    public constructor(public getService: IFactory<Service>) {
                        this.getService = getService;
                        this.service = new getService(data);
                    }
                }

                Factory(Service)(App, 'getLogger', 0);

                beforeEach(() => {
                    container = new Container();
                });

                it('provides a function which, when called, will return the instance', () => {
                    app = container.get(App);
                    service = app.getService;
                    expect(service()).to.be.instanceOf(Service);
                });

                it('passes data in to the constructor as the second argument', () => {
                    app = container.get(App);
                    expect(app.service.data).to.equal(data);
                });
            });

            describe('NewInstance', () => {
                class Logger {
                    public constructor(public dep?: any) {
                        this.dep = dep;
                    }
                }

                class Dependency {}

                it('inject a new instance of a dependency, without regard for existing instances in the container', () => {
                    class App1 {
                        public static inject() {
                            return [NewInstanceResolver.of(Logger)];
                        }
                        public constructor(public logger: Logger) {
                            this.logger = logger;
                        }
                    }

                    const container = new Container();
                    const logger = container.get(Logger);
                    const app1 = container.get(App1);

                    expect(app1.logger).to.be.instanceOf(Logger);
                    expect(app1.logger).not.to.equal(logger);
                });

                it('decorate to inject a new instance of a dependency', () => {
                    class App1 {
                        public static inject = [Logger];
                        public constructor(public logger: Logger) {
                            this.logger = logger;
                        }
                    }

                    NewInstance(App1, 'logger', 0);

                    const container = new Container();
                    const logger = container.get(Logger);
                    const app1 = container.get(App1);

                    expect(app1.logger).to.be.instanceOf(Logger);
                    expect(app1.logger).not.to.equal(logger);
                });

                it('inject a new instance of a dependency, with instance dynamic dependency', () => {
                    class App1 {
                        public static inject() {
                            return [NewInstanceResolver.of(Logger, Dependency)];
                        }
                        public constructor(public logger: Logger) {
                            this.logger = logger;
                        }
                    }

                    const container = new Container();
                    const logger = container.get(Logger);
                    const app1 = container.get(App1);

                    expect(app1.logger).to.be.instanceOf(Logger);
                    expect(app1.logger).not.to.equal(logger);
                    expect(app1.logger.dep).to.be.instanceOf(Dependency);
                });

                it('decorate to inject a new instance of a dependency, with instance dynamic dependency', () => {
                    class App1 {
                        public static inject = [Logger];
                        public constructor(public logger: Logger) {
                            this.logger = logger;
                        }
                    }

                    NewInstance(Logger, Dependency)(App1, 'logger', 0);

                    const container = new Container();
                    const logger = container.get(Logger);
                    const app1 = container.get(App1);

                    expect(app1.logger).to.be.instanceOf(Logger);
                    expect(app1.logger).not.to.equal(logger);
                    expect(app1.logger.dep).to.be.instanceOf(Dependency);
                });

                it('inject a new instance of a dependency, with resolver dynamic dependency', () => {
                    class App1 {
                        public static inject() {
                            return [NewInstanceResolver.of(Logger, LazyResolver.of(Dependency))];
                        }
                        public constructor(public logger: Logger) {
                            this.logger = logger;
                        }
                    }

                    const container = new Container();
                    const logger = container.get(Logger);
                    const app1 = container.get(App1);

                    expect(app1.logger).to.be.instanceOf(Logger);
                    expect(app1.logger).not.to.equal(logger);
                    expect(app1.logger.dep()).to.be.instanceOf(Dependency);
                });

                it('decorate to inject a new instance of a dependency, with resolver dynamic dependency', () => {
                    class App1 {
                        public static inject = [Logger];
                        public constructor(public logger: Logger) {
                            this.logger = logger;
                        }
                    }

                    NewInstance(Logger, LazyResolver.of(Dependency))(App1, 'logger', 0);

                    const container = new Container();
                    const logger = container.get(Logger);
                    const app1 = container.get(App1);

                    expect(app1.logger).to.be.instanceOf(Logger);
                    expect(app1.logger).not.to.equal(logger);
                    expect(app1.logger.dep()).to.be.instanceOf(Dependency);
                });
            });
        });
    });
});
