export class ControllablePromise<T> extends Promise<T> {
  static noop = () => {};

  public resolve: (value?: T | PromiseLike<T>) => void = ControllablePromise.noop;
  public reject: (reason?: any) => void = ControllablePromise.noop;

  constructor() {
    super(ControllablePromise.noop);

    let manualResolveFn: typeof this.resolve = ControllablePromise.noop;
    let manualRejectFn: typeof this.reject = ControllablePromise.noop;

    const promise = new Promise<T>((res, rej) => {
      manualResolveFn = res as ControllablePromise<T>["resolve"];
      manualRejectFn = rej as ControllablePromise<T>["reject"];
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
