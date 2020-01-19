import {DatePipe} from '@angular/common'
import {Pipe, PipeTransform} from '@angular/core';


const intervals = [['minute', 60], ['hour', 3600], ['day', 86400]];

@Pipe({name: 'userFriendlyDate'})
export class UserFriendlyDatePipe implements PipeTransform {
  transform(date: Date): string {
    const secondsAgo =
        Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

    if (secondsAgo < 10) {
      return 'Just now';
    }

    if (secondsAgo < 60) {
      return `${secondsAgo} seconds ago`;
    }

    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 5) {
      let secondsStr = '';
      switch (secondsAgo % 60) {
        case 0:
          secondsStr = '';
          break;
        case 1:
          secondsStr = '1 second';
          break;
        default:
          secondsStr = `${secondsAgo % 60} seconds`;
          break;
      }
      if (minutesAgo === 1) {
        return `${minutesAgo} minute ${secondsStr} ago`;
      }
      return `${minutesAgo} minutes ${secondsStr} ago`;
    }
    if (minutesAgo < 60) {
      return `${minutesAgo} minutes ago`;
    }

    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 5) {
      let minutesStr = '';
      switch (minutesAgo % 60) {
        case 0:
          minutesStr = '';
          break;
        case 1:
          minutesStr = '1 minute';
          break;
        default:
          minutesStr = `${minutesAgo % 60} minutes`;
          break;
      }
      if (hoursAgo === 1) {
        return `${hoursAgo} hours ${minutesStr} ago`;
      }
      return `${hoursAgo} hours ${minutesStr} ago`;
    }

    const daysAgo = Math.floor(hoursAgo / 24);
    if (daysAgo < 5) {
      let hoursStr = '';
      switch (hoursAgo % 60) {
        case 0:
          hoursStr = '';
          break;
        case 1:
          hoursStr = '1 hour';
          break;
        default:
          hoursStr = `${hoursAgo % 60} hours`;
          break;
      }
      if (daysAgo === 1) {
        return `${daysAgo} days ${hoursStr} ago`;
      }
      return `${daysAgo} days ${hoursStr} ago`;
    }

    if (daysAgo < 30) {
      return `${daysAgo} days ago`;
    }

    return this.datepipe.transform(date);
  }

  constructor(public datepipe: DatePipe) {}
}
