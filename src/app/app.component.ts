import { Component } from '@angular/core';
import { CountdownComponent } from './components/Countdown/countdown.component';

@Component({
  selector: 'app-root',
  imports: [CountdownComponent],
  template: `
    <main style="padding:1rem">
      <countdown-component></countdown-component>
    </main>
  `,
})
export class AppComponent {
  title = 'countdown-timer-v1';
}
