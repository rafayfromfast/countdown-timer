import { Component, signal, inject, DestroyRef, computed } from '@angular/core';
import { TimerService } from '../../timer.service';
import {
  splitSeconds,
  primaryDisplay,
  formatBreakdown,
} from '../../utils/time-format';
import { interval, Subscription, take } from 'rxjs';

@Component({
  selector: 'countdown-component',
  standalone: true,
  template: `
    <section class="cd-wrapper">
      <div class="cd-card" aria-live="polite">
        <p class="cd-label">Time to Deadline</p>

        <div class="cd-primary">
          <span class="cd-value">{{ primaryValue() }}</span>
          <span class="cd-unit">{{ primaryUnit() }}</span>
        </div>

        <p class="cd-breakdown">{{ fullBreakdown() }}</p>
      </div>
    </section>
  `,
  styleUrls: ['./countdown.component.scss'],
})
export class CountdownComponent {
  time = signal(0);

  private timerSub: Subscription | null = null;
  private destroyRef = inject(DestroyRef);
  private timerService = inject(TimerService);

  constructor() {
    this.timerService
      .getTimeValue()
      .pipe(take(1))
      .subscribe((sec) => this.startCountdown(sec));
  }

  private parts = computed(() => splitSeconds(this.time()));
  primaryValue = computed(() => primaryDisplay(this.parts()).value);
  primaryUnit = computed(() => primaryDisplay(this.parts()).unit);
  fullBreakdown = computed(() => formatBreakdown(this.parts()));

  private startCountdown(initial: number) {
    this.time.set(initial);

    this.timerSub?.unsubscribe();

    this.timerSub = interval(1000).subscribe((i) => {
      const next = initial - (i + 1);
      this.time.set(next > 0 ? next : 0);
      if (next <= 0) {
        this.timerSub?.unsubscribe();
      }
    });

    this.destroyRef.onDestroy(() => {
      this.timerSub?.unsubscribe();
    });
  }
}
