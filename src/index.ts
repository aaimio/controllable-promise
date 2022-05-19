export default class ControllablePromise<T> extends Promise<T> {
  static noop = () => {};

  public resolve: (value?: T | PromiseLike<T>) => void = ControllablePromise.noop;
  public reject: (reason?: any) => void = ControllablePromise.noop;

  constructor(executor?: (resolve: typeof ControllablePromise.resolve, reject: typeof ControllablePromise.reject) => void) {
    super(ControllablePromise.noop);

    let manualResolveFn: typeof ControllablePromise.resolve = Promise.resolve;
    let manualRejectFn: typeof ControllablePromise.reject = Promise.reject;

    const promise = new Promise<T>((res, rej) => {
      manualResolveFn = res as any;
      manualRejectFn = rej as any;

      if (typeof executor === "function") {
        executor(manualResolveFn, manualRejectFn);
      }
    });

    return new Proxy(promise as typeof this, {
      get: (target, prop, receiver) => {
        if (prop === "resolve") {
          return manualResolveFn;
        }

        if (prop === "reject") {
          return manualRejectFn;
        }

        const originalProp = Reflect.get(target, prop, receiver);

        if (typeof originalProp === "function") {
          return originalProp.bind(target);
        }

        return originalProp;
      },
    });
  }
}
