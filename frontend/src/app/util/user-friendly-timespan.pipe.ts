import { DatePipe } from '@angular/common'
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'userFriendlyTimespan' })
export class UserFriendlyTimespanPipe implements PipeTransform {
  transform(dateStart: Date, dateEnd: Date): string {
    if (dateStart == null || dateEnd == null) {
      return null;
    }

    const secondsAgo =
      Math.floor((new Date(dateEnd).getTime() - new Date(dateStart).getTime()) / 1000);

    if (secondsAgo < 60) {
      return `${secondsAgo} seconds`;
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
        return `${minutesAgo} minute ${secondsStr}`;
      }
      return `${minutesAgo} minutes ${secondsStr}`;
    }
    if (minutesAgo < 60) {
      return `${minutesAgo} minutes`;
    }

    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 12) {
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
        return `${hoursAgo} hours ${minutesStr}`;
      }
      return `${hoursAgo} hours ${minutesStr}`;
    }
    if (hoursAgo < 24) {
      return `${hoursAgo} hours`;
    }

    const daysAgo = Math.floor(hoursAgo / 24);
    if (daysAgo < 5) {
      let hoursStr = '';
      switch (hoursAgo % 24) {
        case 0:
          hoursStr = '';
          break;
        case 1:
          hoursStr = '1 hour';
          break;
        default:
          hoursStr = `${hoursAgo % 24} hours`;
          break;
      }
      if (daysAgo === 1) {
        return `${daysAgo} days ${hoursStr}`;
      }
      return `${daysAgo} days ${hoursStr}`;
    }

    return `${daysAgo} days`;
  }

  constructor(public datepipe: DatePipe) { }
}
