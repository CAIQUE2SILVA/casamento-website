import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent } from 'rxjs';
import { debounceTime, startWith } from 'rxjs/operators';

export interface ScreenSize {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
}

@Injectable({
  providedIn: 'root'
})
export class WindowService {
  private screenSize = new BehaviorSubject<ScreenSize>(this.getScreenSize());
  screenSize$ = this.screenSize.asObservable();

  constructor() {
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(100),
        startWith(null)
      )
      .subscribe(() => {
        this.screenSize.next(this.getScreenSize());
      });
  }

  private getScreenSize(): ScreenSize {
    const width = window.innerWidth;
    return {
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
      width
    };
  }

  get isMobile(): boolean {
    return window.innerWidth < 768;
  }

  get isTablet(): boolean {
    return window.innerWidth >= 768 && window.innerWidth < 1024;
  }

  get isDesktop(): boolean {
    return window.innerWidth >= 1024;
  }
}