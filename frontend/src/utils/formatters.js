export const formatStatus = (status) => {
    if (!status) return '—';
    return status.replace(/_/g, ' ');
};