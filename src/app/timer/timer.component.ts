import { Component, OnDestroy, ViewChild, HostListener, AfterViewInit, ElementRef } from '@angular/core';
import { Subscription, fromEvent, interval, Observable } from 'rxjs';
import { takeUntil, debounceTime, buffer, map, filter } from 'rxjs/operators';
@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('stopBtn', { static: false }) stopBtn: ElementRef;
  @ViewChild('pauseBtn', { static: false }) pauseBtn: ElementRef;
  public timerSubscription = new Subscription();
  public subscriptions = new Subscription();
  public pauseClickEvent: Observable<number>;
  public doubleClick: Observable<number>;
  public isStopBtnClicked: boolean;
  public isTimerActive = false;
  public isWaiting = false;
  public pauseBtnText = 'Wait';
  public ticks = 0;

  ngAfterViewInit(): void {
    this.checkDoubleClick();
  }

  public checkDoubleClick(): void {
    this.pauseClickEvent = fromEvent(this.pauseBtn.nativeElement, 'click');

    this.doubleClick = this.pauseClickEvent.pipe(
      buffer(this.pauseClickEvent.pipe(debounceTime(300))),
      map((clicksWithin300ms: number[]) => clicksWithin300ms.length),
      filter(clicksWithin300ms => clicksWithin300ms === 2)
    );
    const sub = this.doubleClick.subscribe((val) => {
      this.isWaiting = !this.isWaiting;
      this.pauseBtnText = this.isWaiting ? 'Resume' : 'Wait';
      if (!this.isWaiting) {
        this.startTimer();
      } else {
        this.timerSubscription.unsubscribe();
      }
    });
    this.subscriptions.add(sub);
  }

  public startTimer(): void {
    const stop = fromEvent(this.stopBtn.nativeElement, 'click');
    const sub = stop
      .subscribe(() => this.isStopBtnClicked = true);
    this.isTimerActive = true;
    this.timerSubscription = interval(1000)
      .pipe(takeUntil(stop))
      .subscribe(() => this.ticks++);

    this.subscriptions.add(sub);
    this.subscriptions.add(this.timerSubscription);
  }

  public resetTimer(): void {
    this.isStopBtnClicked = false;
    this.isTimerActive = false;
    this.isWaiting = false;
    this.pauseBtnText = 'Wait';
    this.ticks = 0;
    this.timerSubscription.unsubscribe();
  }

  @HostListener('window:beforeonload')
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
