import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime'
})

export class FormatTimePipe implements PipeTransform {

  public transform(value: any): string {
    const seconds = this.formatDigit(value % 60);
    const minutes = this.formatDigit(Math.floor((value / 60) % 60));
    const hours = this.formatDigit(Math.floor((value / 60 ) / 60));
    return `${hours}: ${minutes}: ${seconds}`;
  }

  public formatDigit(digit: number): number | string {
    return digit < 10 ? '0' + digit : digit;
  }

}
