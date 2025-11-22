import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilisateurAdmin } from '../models/utilisateur-admin.model';
import { Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private base = 'http://localhost:3000/users';
  user = signal<UtilisateurAdmin | null>(null);

  constructor(private http: HttpClient) {
    const raw = localStorage.getItem('auth_user');
    if (raw) {
      try {
        this.user.set(JSON.parse(raw));
      } catch {
        localStorage.removeItem('auth_user');
      }
    }
  }

  login(username: string, password: string): Observable<UtilisateurAdmin> {
  return this.http
    .get<UtilisateurAdmin[]>(`${this.base}?username=${encodeURIComponent(username)}`)
    .pipe(
      map((list: UtilisateurAdmin[]) => {
        if (!Array.isArray(list) || list.length === 0) {
          throw new Error('Utilisateur non trouvé');
        }

        const u = list[0];

        if (u.passwordHash !== password) {
          throw new Error('Mot de passe incorrect');
        }

        const updatedUser: UtilisateurAdmin = {
          ...u,
          dernierLogin: new Date().toISOString()
        };

        this.user.set(updatedUser);
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));

        this.http.put(`${this.base}/${u.id}`, updatedUser).subscribe({
          next: () => {},
          error: (err) => console.warn("Erreur update JSON-server", err)
        });

        return updatedUser;
      })
    );
  }

  logout(): void {
    this.user.set(null);
    localStorage.removeItem('auth_user');
  }

  isAuthenticated(): boolean {
    return !!this.user();
  }

  getUser(): UtilisateurAdmin | null {
    return this.user();
  }

  changePassword(userId: string, oldPassword: string, newPassword: string) : Observable<UtilisateurAdmin> {
    return this.http.get<UtilisateurAdmin>(`${this.base}/${userId}`).pipe(
      map(u => {
        if (!u) throw new Error('Utilisateur introuvable');
        if (u.passwordHash !== oldPassword) throw new Error('Ancien mot de passe incorrect');
        u.passwordHash = newPassword;
        u.dernierLogin = new Date().toISOString();
        return u;
      }),
      tap(u => {
        this.http.put(`${this.base}/${userId}`, u).subscribe({ next: () => {
          const current = this.user();
          if (current && current.id === u.id) {
            this.user.set(u);
            localStorage.setItem('auth_user', JSON.stringify(u));
          }
        }, error: () => {} });
      })
    );
  }
}
