//Third Party Imports
import moment from 'moment';
//Component or Local Imports
import { Message } from '@types';

export const groupMessagesByDate = (messages: Message[]) => {
  if (!messages || messages.length === 0) return [];

  const groups = messages.reduce((groups: Record<string, Message[]>, message) => {
    const date = moment(message.timestamp).format('DD MMM YYYY');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return Object.keys(groups).map((date) => {
    return {
      date,
      data: groups[date],
    };
  });
};

export const getTimeFromDb = (timestamp: number) => {
  if (!timestamp) return '';
  return moment(timestamp).format('hh:mm A');
};

export const formatTime = (timestamp: number) => {
  if (!timestamp) return '';
  const now = moment();
  const date = moment(timestamp);

  if (now.isSame(date, 'day')) {
    return date.format('hh:mm A');
  }
  return date.format('DD/MM/YY');
};
