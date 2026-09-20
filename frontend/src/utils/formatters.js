export const formatStatus = (status) => {
    if (!status) return '—';
    return status.replace(/_/g, ' ');
};

export const formatDate = (date) => {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    if (!year || !month || !day) return date;
    return `${day}.${month}.${year}`;
};