export default async function consumablePromise<T>(fn: unknown): Promise<T>{
    if (fn instanceof Promise) {
        // If it's already a Promise, return it directly.
        return fn;
    } else if (typeof fn === "function") {
        // If it's a function, call it and wrap the result in a Promise.
        return new Promise((resolve) => resolve(fn()));
    } else {
        throw new Error(`fn should be of type function or Promise, received ${typeof fn}`);
    }
}
