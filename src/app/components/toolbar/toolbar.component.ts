import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WindowService } from '../../services/window.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent implements OnInit, OnDestroy {
  menuOpen = false;
  isMobile = false;
  private subscription: Subscription = new Subscription();

  constructor(private windowService: WindowService) {}

  ngOnInit() {
    this.subscription.add(
      this.windowService.screenSize$.subscribe(size => {
        this.isMobile = size.isMobile;
        if (!this.isMobile) {
          this.menuOpen = false;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    if (this.isMobile) {
      this.menuOpen = false;
    }
  }
}