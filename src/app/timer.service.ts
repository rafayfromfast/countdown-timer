import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class TimerService {
  url = 'http://localhost:3000/secondsLeft';

  async getTimeValue(): Promise<number> {
    const data = await fetch(this.url);
    const val = await data.json();
    return val as number;
  }
}
