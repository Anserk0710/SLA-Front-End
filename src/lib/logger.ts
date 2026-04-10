export function logError(...args: unknown[]) {
    if (!import.meta.env.DEV) {
        return;
    }

    console.error(...args);
}
