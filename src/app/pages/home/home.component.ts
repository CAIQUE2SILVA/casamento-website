import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  casados = false;

  countdown = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  private timer: any;
  private weddingDate = new Date('2025-11-15T19:00:00');

  ngOnInit() {
    this.updateCountdown();
    if (!this.casados) {
      this.timer = setInterval(() => this.updateCountdown(), 1000);
    }
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private updateCountdown() {
    const diff = this.weddingDate.getTime() - Date.now();

    if (diff <= 0) {
      this.casados = true;
      clearInterval(this.timer);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    this.countdown = { days, hours, minutes, seconds };
  }
}
