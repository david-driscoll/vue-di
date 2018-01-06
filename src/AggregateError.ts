/**
 * The MIT License (MIT)
 * https://github.com/aurelia/dependency-injection
 *
 * Copyright (c) 2010 - 2018 Blue Spire Inc.
 */

function isAggregateError(error: any): error is AggregateErrorType {
    return !!error.innerError;
}
type AggregateErrorType = Error & { innerError?: Error };

/**
 * Creates an instance of Error that aggregates and preserves an innerError.
 * @param message The error message.
 * @param innerError The inner error message to aggregate.
 * @param skipIfAlreadyAggregate Indicates to not wrap the inner error if it itself already has an innerError.
 * @return The Error instance.
 */
export function AggregateError(
    message: string,
    innerError?: Error,
    skipIfAlreadyAggregate?: boolean
): Error {
    // tslint:disable:no-parameter-reassignment
    if (innerError) {
        if (isAggregateError(innerError) && skipIfAlreadyAggregate) {
            return innerError;
        }

        const separator = '\n------------------------------------------------\n';

        message += `${separator}Inner Error:\n`;

        if (typeof innerError === 'string') {
            message += `Message: ${innerError}`;
        } else {
            if (innerError.message) {
                message += `Message: ${innerError.message}`;
            } else {
                message += `Unknown Inner Error Type. Displaying Inner Error as JSON:\n ${JSON.stringify(
                    innerError,
                    null,
                    '  '
                )}`;
            }

            if (innerError.stack) {
                message += `\nInner Error Stack:\n${innerError.stack}`;
                message += '\nEnd Inner Error Stack';
            }
        }

        message += separator;
    }

    const e = new Error(message);
    if (innerError) {
        (e as any).innerError = innerError;
    }

    return e;
}
