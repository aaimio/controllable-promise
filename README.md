# Controllable promise

Manually invoke JavaScript promises using proxies

## Getting started

```
npm i controllable-promise
```

In your code use the promise as you would normally:

```TS
const setupPromise = new ControllablePromise<void>();

setupPromise.then(() => {
    executeSomeAfterSetupLogic();
})

callSomeSetupLogic();

setupPromise.resolve();
```

Or with `await`:

```TS
const setupPromise = new ControllablePromise<void>();

callSomeSetupLogic();

setupPromise.resolve();

await setupPromise;

executeSomeAfterSetupLogic();
```