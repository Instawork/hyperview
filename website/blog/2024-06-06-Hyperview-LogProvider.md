---
author: Hardin Gray
authorURL: https://github.com/hgray-instawork
title: Hyperview Log Provider
---

The 0.81.0 release of Hyperview adds support for providing an optional external log provider. In previous versions of Hyperview, any logging was performed explicitly via `console.log`, `console.warn`, or `console.error`.

With this new functionality, developers are able to pass an alternate provider to allow more control over the logging such as inhibiting logs below a certain severity threshold, saving logs to file, or using third party logging libraries. If no provider is passed into Hyperview, `console` will be used. Over time we plan to increase the informational logging which Hyperview provides to aid in debugging.

The provider interface is a simplification of the one provided by `console`:
```javascript
{
  error: (message?: any, ...optionalParams: any[]) => void;
  info: (message?: any, ...optionalParams: any[]) => void;
  log: (message?: any, ...optionalParams: any[]) => void;
  warn: (message?: any, ...optionalParams: any[]) => void;
}
```

## Example usage

The optional provider is passed through the `logger` property of the `<Hyperview>` component.

```javascript
  const exampleLogger = {
    error: (message: any, params: any[]) =>
      console.error(`[EXAMPLE - ERROR] ${message}`, params),
    info: (message: any, params: any[]) =>
      console.info(`[EXAMPLE - INFO] ${message}`, params),
    log: (message: any, params: any[]) =>
      console.log(`[EXAMPLE - LOG] ${message}`, params),
    warn: (message: any, params: any[]) =>
      console.warn(`[EXAMPLE - WARN] ${message}`, params),
  };

  return (
    <Hyperview
      ...
      logger={exampleLogger}
      ...
    />
  );
```
