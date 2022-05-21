type ControllablePromiseResolve<T> = (value?: T | PromiseLike<T>) => void;
type ControllablePromiseReject = (reason?: any) => void;

class ControllablePromise<T> implements Promise<T> {
  constructor(
    executor?: (
      resolve: ControllablePromiseResolve<T>,
      reject: ControllablePromiseReject
    ) => void
  ) {
    /* istanbul ignore next */
    let resolveFn: ControllablePromiseResolve<T> = () => {};

    /* istanbul ignore next */
    let rejectFn: ControllablePromiseReject = () => {};

    const promise = new Promise<T>((res, rej) => {
      resolveFn = res as any;
      rejectFn = rej as any;

      if (typeof executor === "function") {
        executor(resolveFn, rejectFn);
      }
    });

    return new Proxy(promise as typeof this, {
      get: (target, prop, receiver) => {
        if (prop === "resolve") return resolveFn;
        if (prop === "reject") return rejectFn;

        const targetProp = Reflect.get(target, prop, receiver);

        if (typeof targetProp === "function") {
          return targetProp.bind(target);
        }

        // All props are functions so below is never executed, ignore for tests.
        /* istanbul ignore next */ return targetProp;
      },
    });
  }

  // Methods below are to satisfy TS, calls to these methods are proxied to
  // internal promise.

  /* istanbul ignore next */ public resolve<T>(
    _value?: T | PromiseLike<T>
  ): void {}

  /* istanbul ignore next */ public reject(_reason?: any) {
    return undefined as any;
  }

  /* istanbul ignore next */ public then<TResult1 = T, TResult2 = never>(
    _onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    _onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return undefined as any;
  }

  /* istanbul ignore next */ public catch<TResult = never>(
    _onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null
  ): Promise<T | TResult> {
    return undefined as any;
  }

  /* istanbul ignore next */ public finally(
    _onfinally?: (() => void) | null
  ): Promise<T> {
    return undefined as any;
  }

  [Symbol.toStringTag]: string;
}

export default ControllablePromise;
