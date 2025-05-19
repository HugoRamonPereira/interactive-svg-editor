import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterOutlet, NavigationEnd, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(
    private titleService: Title,
    private router: Router,
    private ActivatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        let route = this.ActivatedRoute;
        while (route.firstChild) {
          route = route.firstChild
        }

        const title = route.snapshot.data['title'] || 'Home';
        this.titleService.setTitle(`SVGenius | ${title}`);
      }
    })
  }
}
