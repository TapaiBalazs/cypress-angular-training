import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';

@Component({
  selector: 'cat-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private breakpointObserver: BreakpointObserver) {
  }

  get isDesktop(): boolean {
    return !this.breakpointObserver.isMatched(Breakpoints.Handset)
  }
}
