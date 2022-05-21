[![codecov](https://codecov.io/gh/aaimio/controllable-promise/branch/master/graph/badge.svg?token=3ACCR1SWXX)](https://codecov.io/gh/aaimio/controllable-promise)

# Controllable Promise

Control when a JavaScript promise resolves or rejects.

## Getting started

```
npm i controllable-promise
```

Create the promise and manually invoke the `resolve` function:

```TS
import ControllablePromise from 'controllable-promise';

const setupPromise = new ControllablePromise()

setupPromise.then(() => {
    executeSomeAfterSetupLogic();
})

callSomeSetupLogic();

setupPromise.resolve();
```

Or use the promise as you would normally:

```TS
import ControllablePromise from 'controllable-promise';

const setupPromise = new ControllablePromise(resolve => {
    callSomeSetupLogic();

    // Below is optional, you can still manually invoke the `resolve`
    // later using `setupPromise.resolve()`
    resolve();
})

await setupPromise;

executeSomeAfterSetupLogic();
```
