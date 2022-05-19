# Controllable Promise

Control when a JavaScript promise resolves or rejects.

## Getting started

```
npm i controllable-promise
```

Create the promise and manually invoke the `resolve` function:

```TS
const setupPromise = new ControllablePromise<void>()

setupPromise.then(() => {
    executeSomeAfterSetupLogic();
})

callSomeSetupLogic();

setupPromise.resolve();
```

Or use the promise as you would normally:

```TS
const setupPromise = new ControllablePromise<void>(resolve => {
    callSomeSetupLogic();

    // Below is optional, you can still manually invoke the `resolve`
    // later on using `setupPromise.resolve()`
    resolve(); 
})

await setupPromise;

executeSomeAfterSetupLogic();
```
