import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Site } from '../../../../core/services/site';
import { SiteH } from '../../../../code/models/siteH.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-site-edit',
  templateUrl: './site-edit.html',
  imports: [FormsModule],
  styleUrls: ['./site-edit.css']
})
export class SiteEditComponent {
  name = '';
  location = '';
  editingId?: string;

  constructor(private siteService: Site, private router: Router, private route: ActivatedRoute) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editingId = id;
      this.siteService.getSite(id).subscribe(s => {
        this.name = s.nom;
        this.location = s.localisation;
      });
    }
  }

  save() {
    if (!this.name || !this.location) {
      alert('Fill all fields');
      return false;
    }

    const payload: Partial<SiteH> = {
      nom: this.name,
      localisation: this.location
    };

    if (this.editingId) {
      this.siteService.getSite(this.editingId).subscribe(original => {
        const updated: SiteH = { ...original, ...payload };
        this.siteService.updateSite(updated).subscribe(() => {
          alert('Site updated');
          this.router.navigate(['/admin/site-crud']);
        });
      });
    } else {
      const newSite: Partial<SiteH> = {
        ...payload,
        photo: 'assets/images/default.jpg',
        dateConstruction: new Date().toISOString(),
        estClasse: false,
        prixEntree: 0,
        description: '',
        categorie: 'Autre',
        horaires: [],
        visitesGuideesDisponibles: false,
        lieuxProches: [],
        latitude: 0,
        longitude: 0,
        comments: []
      };
      this.siteService.createSite(newSite).subscribe(() => {
        alert('Site created');
        this.router.navigate(['/admin/site-crud']);
      });
    }
    return true;
  }
}
