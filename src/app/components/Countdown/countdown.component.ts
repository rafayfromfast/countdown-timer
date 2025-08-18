import { Component, signal, inject, DestroyRef, computed } from '@angular/core';
import { TimerService } from '../../timer.service';
import {
  splitSeconds,
  primaryDisplay,
  formatBreakdown,
} from '../../utils/time-format';

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

  private timerId: number | null = null;
  private destroyRef = inject(DestroyRef);
  private timerService = inject(TimerService);

  constructor() {
    // Load once from API, then run countdown on client-side
    this.timerService
      .getTimeValue()
      .then((sec) =>
        this.startCountdown(Math.max(0, Math.floor(Number(sec) || 0)))
      )
      .catch(() => this.startCountdown(0));
  }

  private parts = computed(() => splitSeconds(this.time()));
  primaryValue = computed(() => primaryDisplay(this.parts()).value);
  primaryUnit = computed(() => primaryDisplay(this.parts()).unit);
  fullBreakdown = computed(() => formatBreakdown(this.parts()));

  private startCountdown(initial: number) {
    this.time.set(initial);

    if (this.timerId != null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }

    this.timerId = window.setInterval(() => {
      const next = this.time() - 1;
      this.time.set(next > 0 ? next : 0);
      if (next <= 0 && this.timerId != null) {
        clearInterval(this.timerId);
        this.timerId = null;
      }
    }, 1000);

    this.destroyRef.onDestroy(() => {
      if (this.timerId != null) clearInterval(this.timerId);
    });
  }
}
