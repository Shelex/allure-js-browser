/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isPromise(obj: any): boolean {
    return (
        Boolean(obj) &&
        (typeof obj === 'object' || typeof obj === 'function') &&
        typeof obj.then === 'function'
    );
}
