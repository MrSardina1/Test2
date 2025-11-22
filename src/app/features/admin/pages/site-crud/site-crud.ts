import { Component, OnInit } from '@angular/core';
import { Site } from '../../../../core/services/site';
import { Router } from '@angular/router';
import { SiteH } from '../../../../code/models/siteH.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-site-crud',
  templateUrl: './site-crud.html',
  imports: [RouterLink],
  styleUrls: ['./site-crud.css']
})
export class SiteCrudComponent implements OnInit {
  sites: SiteH[] = [];

  constructor(private siteService: Site, private router: Router) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.siteService.getSites().subscribe(s => this.sites = s);
  }

  delete(i: number) {
    const id = this.sites[i].id;
    if (!confirm('Supprimer ce site ?')) return;
    this.siteService.deleteSite(id).subscribe(() => this.load());
  }
}
