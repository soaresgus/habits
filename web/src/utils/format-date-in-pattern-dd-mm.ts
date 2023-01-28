import dayjs from 'dayjs';

export function formatDateInPatternDdMm(date: string): string {
  const dateElements = date.split('/');
  const dateFormatted = dateElements.reverse().join('-');

  return dateElements.length < 3
    ? `${dayjs(new Date()).startOf('day').get('year')}-${dateFormatted}`
    : dateFormatted;
}
