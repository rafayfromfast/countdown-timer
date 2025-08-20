import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TimerService {
  private http = inject(HttpClient);
  private url = 'http://localhost:3000/secondsLeft';

  getTimeValue(): Observable<number> {
    return this.http.get<number>(this.url).pipe(
      // wait 5 seconds before returning the value
      delay(5000),
      map((n) => Math.max(0, Math.floor(Number(n) || 0))),
      catchError(() => of(0))
    );
  }
}
