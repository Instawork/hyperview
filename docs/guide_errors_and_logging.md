---
id: guide_errors_and_logging
title: Errors & Logging
sidebar_label: Errors & Logging
---

Hyperview includes the ability for developers to provide their own logging functionality through an injected `logger`. Starting with Hyperview version `0.105.0`, we have improved the errors which Hyperview sends through the logger. These new errors provide better context and clarify the source and details around the error.

## Logging

Hyperview provides a basic logging system which supports the same signature as standard console logging including levels `log`, `info`, `warn`, `error`.

```es6
log = (m?: unknown, ...p: unknown[]): void;
info = (m?: unknown, ...p: unknown[]): void;
warn = (m?: unknown, ...p: unknown[]): void;
error = (m?: unknown, ...p: unknown[]): void;
```

An example `logging` implementation is included in the Hyperview demo associated with this repo. The logger is passed into the Hyperview component.

```es6
<Hyperview
  entrypointUrl={endpoint}
  fetch={fetchWrapper}
  formatDate={formatDate}
  logger={logger}
  ...
/>
```

## Base Errors

Hyperview now provides several base errors which are used to provide specific data to the logger.

### HvBaseError

The base Hyperview error includes an `extraContext` object which can be used to pass serialized values through error messages. Data is passed into the error using `setExtraContext` and retrieved by `getExtraContext`. Data is automatically serialized when it is set.

`HvBaseError` cannot be directly instantiated and must be extended by a custom error.

```es6
import { HvBaseError } from 'Hyperview';

export class ExampleError extends HvBaseError {
  name = 'ExampleError';

  constructor(message: string, errorCode: number) {
    super(message);
    this.setExtraContext('errorCode', errorCode);
  }
}
```

### HvParserError

`HvParserError` is an extension of `HvBaseError` which includes additional context related to XML parsing errors. The error includes:

- `content` the entire response content which was passed to the parser
- `error` the error message provided by the parser
- `status` the HTTP status returned by the request
- `contentType` the content type reported by the response headers
- `url` the URL used to make the request

Hyperview will include an `HvParserError` when a response fails to parse correctly.

### HvElementError/HvDocError

The `element` and `doc` errors will contain the complete non-serialized DOM `element` or `document` related to the error. No serialization is performed, allowing developers to inspect the node associated with the error.

## Named errors

Hyperview now includes custom named errors to better reflect the specific error condition as well as to better encapsulate the associated data. This also allows us to remove dynamic data from error messages and store them into the errors.

As an example, when a `copy-to-clipboard` behavior element is missing the required `copy-to-clipboard-value` attribute, the `BehaviorCopyToClipboardError` is logged which includes both the name of the missing attribute and the `element` associated with the behavior.

## Dynamic error messages

To simplify error tracking, dynamic data has been removed from the error messages and passed in to `extraContext`. Parsing errors will no longer pass the error location as part of the message. Instead they will include an `error` key in the `extraContext`.

Developers desiring dynamic data in their messages can reconstitute their errors to concatenate their `message` and any required `extraContext` data.

## DeferredToString

There are certain operations which may be useful for debugging but would be too expensive to perform in a production environment. For this reason, Hyperview includes a `deferredToString` helper. This utility returns a function which is only called when `toString` is called on the object. It is up to the logger to stringify the content it receives. If the logger does not call `toString`, the function will not be called and the operation is not performed.

In the following example, Hyperview logs information about an element. Since we do not want to serialize the element in production, it is wrapped in a `deferredToString` function. If the logger accepts `info` level events and stringifies the received content, the element is serialized and included in the message.

```es6
Logging.info(
  Logging.deferredToString(() => {
    const listenerElement: Element = behaviorElement.cloneNode(
      false,
    ) as Element;
    listenerElement.textContent = '';
    return `[on-event] trigger [${behaviorElement.getAttribute(
      'event-name',
    )}] caught by: ${new XMLSerializer().serializeToString(
      listenerElement,
    )}`;
  }),
);
```
