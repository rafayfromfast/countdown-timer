import { Component, signal, inject, DestroyRef, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TimerService } from '../../timer.service';
import {
  splitSeconds,
  primaryDisplay,
  formatBreakdown,
} from '../../utils/time-format';
import { interval } from 'rxjs';
import { map, startWith, takeWhile, finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'countdown-component',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="cd-wrapper" [attr.aria-busy]="isLoading()">
      <div class="cd-card" aria-live="polite">
        <!-- Loader -->
        <div
          *ngIf="isLoading()"
          class="cd-loader"
          role="status"
          aria-label="Loading"
        >
          <span class="spinner"></span>
          <span class="sr-only">Loading…</span>
        </div>

        <!-- Countdown -->
        <ng-container *ngIf="!isLoading()">
          <p class="cd-label">
            {{ time() === 0 ? 'Deadline Reached' : 'Time to Deadline' }}
          </p>

          <div class="cd-primary">
            <span class="cd-value">{{ primaryValue() }}</span>
            <span class="cd-unit">{{ primaryUnit() }}</span>
          </div>

          <p class="cd-breakdown">{{ fullBreakdown() }}</p>
        </ng-container>
      </div>
    </section>
  `,
  styleUrls: ['./countdown.component.scss'],
})
export class CountdownComponent {
  time = signal(0);
  isLoading = signal(true);

  private destroyRef = inject(DestroyRef);
  private timerService = inject(TimerService);

  constructor() {
    // show loader while fetching initial seconds
    this.isLoading.set(true);

    this.timerService
      .getTimeValue()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((sec) => this.startCountdown(sec));
  }

  private parts = computed(() => splitSeconds(this.time()));
  primaryValue = computed(() => primaryDisplay(this.parts()).value);
  primaryUnit = computed(() => primaryDisplay(this.parts()).unit);
  fullBreakdown = computed(() => formatBreakdown(this.parts()));

  private startCountdown(initialSeconds: number) {
    // if server returns null/NaN/negative, clamp to 0
    const initial = Math.max(0, Math.floor(Number(initialSeconds) || 0));
    this.time.set(initial);

    this.isLoading.set(false);

    const deadline = Date.now() + initial * 1000;

    interval(1000)
      .pipe(
        startWith(0),
        map(() => Math.floor(Math.max(0, deadline - Date.now()) / 1000)),
        takeWhile((remaining) => remaining >= 0, true),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((remaining) => {
        this.time.set(remaining);
      });
  }
}
