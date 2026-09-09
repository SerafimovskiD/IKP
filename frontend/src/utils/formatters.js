export const formatStatus = (status) => {
    if (!status) return '—';
    return status.replace(/_/g, ' ');
};

// Само за приказ - датумот од backend-от секогаш стигнува во формат YYYY-MM-DD.
// Оваа функција само го преформатира текстот за приказ (DD.MM.YYYY); филтрите
// продолжуваат да работат врз оригиналната YYYY-MM-DD вредност, не врз ова.
export const formatDate = (date) => {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    if (!year || !month || !day) return date;
    return `${day}.${month}.${year}`;
};