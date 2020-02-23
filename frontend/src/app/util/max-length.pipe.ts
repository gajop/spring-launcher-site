import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'maxLength' })
export class MaxLengthPipe implements PipeTransform {
  transform(str: string, maxLength: number): string {
    if (str.length < maxLength) {
      return str;
    }
    return str.substr(0, maxLength);
  }
}
