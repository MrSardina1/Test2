import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserManagement } from '../../../../core/services/user-management.service';
import { UtilisateurAdmin } from '../../../../code/models/utilisateur-admin.model';
import { Utilisateur } from '../../../../code/models/utilisateur';
import { Auth } from '../../../../code/services/auth';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

type AllUsers = (UtilisateurAdmin | Utilisateur) & { userType: 'admin' | 'user' };

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.html',
  styleUrls: ['./user-management.css']
})
export class UserManagementComponent implements OnInit {
  allUsers: AllUsers[] = [];
  filteredUsers: AllUsers[] = [];
  showForm = false;
  editingId: string | null = null;
  editingType: 'admin' | 'user' | null = null;
  searchTerm = '';
  filterRole = '';
  filterStatus = '';
  filterType = ''; // Pour filtrer par type (admin/user)

  formData: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    role: 'super_admin' | 'moderator' | 'editor' | 'user';
    avatar: string;
    phone: string;
  } = {
    username: '',
    email: '',
    password: '',
    fullName: '',
    role: 'user',
    avatar: '',
    phone: ''
  };

  constructor(
    private userManagement: UserManagement,
    private auth: Auth,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAllUsers();
  }

  loadAllUsers() {
    // Charger les admins et les users en parallèle
    forkJoin({
      admins: this.http.get<UtilisateurAdmin[]>('http://localhost:3000/admins'),
      users: this.http.get<Utilisateur[]>('http://localhost:3000/users')
    }).subscribe({
      next: ({ admins, users }) => {
        // Marquer les admins
        const adminsWithType: AllUsers[] = admins.map(admin => ({
          ...admin,
          userType: 'admin' as const
        }));

        // Marquer les users (ajouter le champ role: 'user')
        const usersWithType: AllUsers[] = users.map(user => ({
          ...user,
          role: 'user' as any,
          userType: 'user' as const
        }));

        // Combiner les deux listes
        this.allUsers = [...adminsWithType, ...usersWithType];
        this.applyFilters();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs:', err);
      }
    });
  }

  applyFilters() {
    this.filteredUsers = this.allUsers.filter(user => {
      const matchSearch = !this.searchTerm ||
        user.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchRole = !this.filterRole || this.getUserRole(user) === this.filterRole;

      let matchStatus = true;
      if (this.filterStatus === 'active') {
        matchStatus = user.isActive === true;
      } else if (this.filterStatus === 'inactive') {
        matchStatus = user.isActive === false;
      }

      const matchType = !this.filterType || user.userType === this.filterType;

      return matchSearch && matchRole && matchStatus && matchType;
    });
  }

  getUserRole(user: AllUsers): string {
    if (user.userType === 'admin') {
      return (user as UtilisateurAdmin).role;
    }
    return 'user';
  }

  getTotalUsers(): number {
    return this.allUsers.length;
  }

  getActiveUsers(): number {
    return this.allUsers.filter(u => u.isActive).length;
  }

  getInactiveUsers(): number {
    return this.allUsers.filter(u => !u.isActive).length;
  }

  getAdminCount(): number {
    return this.allUsers.filter(u => u.userType === 'admin').length;
  }

  getUserCount(): number {
    return this.allUsers.filter(u => u.userType === 'user').length;
  }

  viewUserProfile(user: AllUsers) {
    // Rediriger vers la page de profil de l'utilisateur
    this.router.navigate(['/user', user.id]);
  }

  openAddForm() {
    this.editingId = null;
    this.editingType = null;
    this.resetForm();
    this.showForm = true;
  }

  openEditForm(user: AllUsers) {
    this.editingId = user.id;
    this.editingType = user.userType;
    this.formData = {
      username: user.username,
      email: user.email,
      password: '',
      fullName: user.fullName,
      role: this.getUserRole(user) as any,
      avatar: user.avatar || '',
      phone: user.phone || ''
    };
    this.showForm = true;
  }

  resetForm() {
    this.formData = {
      username: '',
      email: '',
      password: '',
      fullName: '',
      role: 'user',
      avatar: '',
      phone: ''
    };
  }

  saveUser() {
    if (!this.formData.username || !this.formData.email || !this.formData.fullName) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const isAdmin = this.formData.role !== 'user';
    const baseUrl = isAdmin ? 'http://localhost:3000/admins' : 'http://localhost:3000/users';

    if (this.editingId) {
      // Mode édition
      const url = this.editingType === 'admin'
        ? `http://localhost:3000/admins/${this.editingId}`
        : `http://localhost:3000/users/${this.editingId}`;

      this.http.get<any>(url).subscribe(original => {
        const updated: any = {
          ...original,
          username: this.formData.username,
          email: this.formData.email,
          fullName: this.formData.fullName,
          avatar: this.formData.avatar,
          phone: this.formData.phone
        };

        if (this.editingType === 'admin') {
          updated.role = this.formData.role;
        }

        if (this.formData.password) {
          updated.password = this.formData.password;
        }

        this.http.put(url, updated).subscribe(() => {
          alert('Utilisateur mis à jour avec succès');
          this.loadAllUsers();
          this.showForm = false;
        });
      });
    } else {
      // Mode création
      if (!this.formData.password) {
        alert('Le mot de passe est obligatoire pour un nouvel utilisateur');
        return;
      }

      const newUser: any = {
        username: this.formData.username,
        email: this.formData.email,
        password: this.formData.password,
        fullName: this.formData.fullName,
        avatar: this.formData.avatar || `https://i.pravatar.cc/150?u=${this.formData.username}`,
        phone: this.formData.phone,
        dateCreated: new Date().toISOString(),
        dernierLogin: null,
        isActive: true
      };

      if (isAdmin) {
        newUser.role = this.formData.role;
      } else {
        newUser.favorites = [];
      }

      this.http.post(baseUrl, newUser).subscribe(() => {
        alert('Utilisateur créé avec succès');
        this.loadAllUsers();
        this.showForm = false;
      });
    }
  }

  cancelForm() {
    this.showForm = false;
  }

  deleteUser(user: AllUsers) {
    const currentUser = this.auth.getUser();
    if (currentUser?.id === user.id) {
      alert('Vous ne pouvez pas supprimer votre propre compte');
      return;
    }

    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    const url = user.userType === 'admin'
      ? `http://localhost:3000/admins/${user.id}`
      : `http://localhost:3000/users/${user.id}`;

    this.http.delete(url).subscribe(() => {
      alert('Utilisateur supprimé avec succès');
      this.loadAllUsers();
    });
  }

  toggleStatus(user: AllUsers) {
    const currentUser = this.auth.getUser();
    if (currentUser?.id === user.id) {
      alert('Vous ne pouvez pas désactiver votre propre compte');
      return;
    }

    const url = user.userType === 'admin'
      ? `http://localhost:3000/admins/${user.id}`
      : `http://localhost:3000/users/${user.id}`;

    const updated = { ...user, isActive: !user.isActive };
    delete (updated as any).userType;

    this.http.put(url, updated).subscribe(() => {
      this.loadAllUsers();
    });
  }

  getRoleBadgeClass(user: AllUsers): string {
    const role = this.getUserRole(user);
    const classes: { [key: string]: string } = {
      'super_admin': 'role-super-admin',
      'moderator': 'role-moderator',
      'editor': 'role-editor',
      'user': 'role-user'
    };
    return classes[role] || 'role-user';
  }

  getRoleLabel(user: AllUsers): string {
    const role = this.getUserRole(user);
    const labels: { [key: string]: string } = {
      'super_admin': 'Super Admin',
      'moderator': 'Modérateur',
      'editor': 'Éditeur',
      'user': 'Utilisateur'
    };
    return labels[role] || role;
  }

  getTimeSinceLogin(date: string | null): string {
    if (!date) return 'Jamais connecté';

    const now = new Date();
    const loginDate = new Date(date);
    const diff = now.getTime() - loginDate.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    return 'Récemment';
  }

  getTypeBadge(user: AllUsers): string {
    return user.userType === 'admin' ? 'Admin' : 'User';
  }

  getTypeBadgeClass(user: AllUsers): string {
    return user.userType === 'admin' ? 'badge-admin' : 'badge-user';
  }
}
