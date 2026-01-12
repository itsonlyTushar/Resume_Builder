export const detectRefresh = (enable = true) => {
    const handler = (e) => {
        if (!enable) return;
        e.preventDefault();
        // required for most browsers to show native confirm
        e.returnValue = '';
        return '';
    };

    window.addEventListener('beforeunload', handler);

    // return cleanup to remove handler
    return () => window.removeEventListener('beforeunload', handler);
};