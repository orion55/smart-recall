export const createDeferred = <T>(): {
  promise: Promise<T>;
  deferred: { resolve: (v: T) => void; reject: (e: Error) => void };
} => {
  let resolve!: (value: T) => void;
  let reject!: (err: Error) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, deferred: { resolve, reject } };
};

export const sanitizePhone = (input: unknown): string => {
  if (input === null || input === undefined) return '';
  const digits = String(input);
  return digits.length > 10 ? digits.slice(-10) : digits;
};

export const escapeForAgiValue = (value: unknown): string =>
  String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
