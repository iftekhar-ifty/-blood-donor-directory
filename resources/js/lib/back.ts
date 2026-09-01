import { router } from '@inertiajs/react';

// Whether the user has navigated within the app during this session.
// Recorded on the first Inertia navigation; a hard reload resets it, in
// which case the back button falls back to a safe in-app route instead
// of leaving the app via the browser's tab history.
let hasNavigatedInApp = false;

router.on('navigate', () => {
    hasNavigatedInApp = true;
});

export function hasInAppHistory(): boolean {
    return hasNavigatedInApp;
}

export function goBack(fallback = '/donors'): void {
    if (hasNavigatedInApp) {
        window.history.back();
    } else {
        router.get(fallback);
    }
}
