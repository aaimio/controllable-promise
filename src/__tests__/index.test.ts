import ControllablePromise from "..";

describe("controllable promise tests", () => {
  test("allows for manually resolving promises", async () => {
    const promise = new ControllablePromise<string>(() => {});
    promise.resolve("hello");
    expect(await promise).toBe("hello");
  });

  test("allows for manually rejecting promises", async () => {
    const promise = new ControllablePromise<void>();

    try {
      promise.reject();
      await promise;
    } catch {
      expect(promise).rejects;
    }
  });

  test("allows for passing executor function", async () => {
    const promise = new ControllablePromise<string>((resolve) =>
      resolve("done")
    );
    const result = await promise;
    expect(result).toBe("done");
  });

  test('supports (chained) "then" operations', (done) => {
    const promise = new ControllablePromise<void>();

    promise.resolve("chain");
    promise
      .then()
      .then()
      .then()
      .then((result) => {
        expect(result).toBe("chain");
        done();
      });
  });

  test('supports "catch" operations', (done) => {
    const promise = new ControllablePromise<void>();

    promise.reject("oops");
    promise.catch((reason) => {
      expect(reason).toBe("oops");
      done();
    });
  });

  test('supports "finally" operations', (done) => {
    const promise1 = new ControllablePromise<void>();
    const promise2 = new ControllablePromise<void>();

    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();

    const promises = [
      promise1.finally(mockFn1).then(() => {}),
      promise2.finally(mockFn2).catch(() => {}),
    ];

    promise1.resolve("completed");
    promise2.reject("errored");

    Promise.all(promises).then(() => {
      expect(mockFn1).toBeCalled();
      expect(mockFn2).toBeCalled();
      done();
    });
  });

  test("supports regular promise functions", async () => {
    const promise1 = new ControllablePromise<number>();
    const promise2 = new ControllablePromise<number>();
    const promise3 = new ControllablePromise<number>();

    promise1.resolve(1);
    promise2.resolve(2);
    promise3.resolve(3);

    const results = await Promise.all([promise1, promise2, promise3]);

    expect(results).toEqual(expect.arrayContaining([1, 2, 3]));
  });
});
