function alwaysValid() {
    return true;
}
function noCompose() {}

export type ValidateMethod = ((target: any) => string | boolean);
export type ComposeMethod = (target: any) => void;

// tslint:disable:no-parameter-reassignment
function ensureProtocolOptions(
    initialOptions?: ValidateMethod | Partial<IProtocolOptions>
): IProtocolOptions {
    let options: any = initialOptions;
    if (options === undefined) {
        options = {};
    } else if (typeof options === 'function') {
        options = {
            validate: options,
        };
    }

    if (!options.validate) {
        options.validate = alwaysValid;
    }

    if (!options.compose) {
        options.compose = noCompose;
    }

    return options;
}

function createProtocolValidator(validate: ValidateMethod) {
    return (target: any) => {
        const result = validate(target);

        return result === true;
    };
}

function createProtocolAsserter(name: string, validate: ValidateMethod) {
    return (target: any) => {
        const result = validate(target);
        if (result !== true) {
            throw new Error(result || `${name} was not correctly implemented.`);
        }
    };
}

/**
 * Options used during protocol creation.
 */
export interface IProtocolOptions {
    /**
     * A function that will be run to validate the decorated class when the protocol is applied. It is also used to
     *      validate adhoc instances.
     * If the validation fails, a message should be returned which directs the developer in how to address the issue.
     */
    validate: ValidateMethod;
    /**
     * A function which has the opportunity to compose additional behavior into the decorated class when the protocol
     *      is applied.
     */
    compose: ComposeMethod;
}

export interface IProtocol {
    (target: any): void;
    validate(target: any): boolean;
    assert(target: any): void;
}

/**
 * Decorator: Creates a protocol.
 * @param name The name of the protocol.
 * @param options The validation function or options object used in configuring the protocol.
 */
export const protocol: {
    (name: string, initialOptions?: ValidateMethod | IProtocolOptions): IProtocol;
    create(name: string, initialOptions?: ValidateMethod | IProtocolOptions): ProtocolDecorator;
    // tslint:disable-next-line:no-shadowed-variable
} = function protocol(name: string, initialOptions?: ValidateMethod | IProtocolOptions): any {
    const options = ensureProtocolOptions(initialOptions);

    // tslint:disable-next-line:only-arrow-functions
    const result: IProtocol = function(target: any) {
        const resolvedTarget = typeof target === 'function' ? target.prototype : target;

        options.compose(resolvedTarget);
        result.assert(resolvedTarget);

        Object.defineProperty(resolvedTarget, 'protocol:' + name, {
            enumerable: false,
            configurable: false,
            writable: false,
            value: true,
        });
    } as any;

    result.validate = createProtocolValidator(options.validate);
    result.assert = createProtocolAsserter(name, options.validate);

    return result;
} as any;

export type ProtocolDecorator = ClassDecorator &
    (() => ClassDecorator) & {
        decorates(target: any): boolean;
        validate(target: any): boolean;
        assert(target: any): void;
    };

/**
 * Creates a protocol decorator.
 * @param name The name of the protocol.
 * @param options The validation function or options object used in configuring the protocol.
 * @return The protocol decorator;
 */
// tslint:disable-next-line:only-arrow-functions
protocol.create = function(
    name: string,
    initialOptions?: ValidateMethod | IProtocolOptions
): ProtocolDecorator {
    const options = ensureProtocolOptions(initialOptions);
    const hidden = 'protocol:' + name;
    // tslint:disable-next-line:only-arrow-functions
    const result: ProtocolDecorator = function(target: any) {
        const decorator = protocol(name, options);

        return target ? decorator(target) : decorator;
    } as any;

    result.decorates = ((obj: any) => obj[hidden] === true) as any;
    result.validate = createProtocolValidator(options.validate);
    result.assert = createProtocolAsserter(name, options.validate);

    return result;
};
