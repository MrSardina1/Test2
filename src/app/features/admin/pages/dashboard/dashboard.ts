import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  stats = {
    totalSites: 12,
    totalComments: 85,
    totalVisits: 4000
  };
}
