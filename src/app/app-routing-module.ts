import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/admin/pages/login/login';
import { DashboardComponent } from './features/admin/pages/dashboard/dashboard';
import { SiteCrudComponent } from './features/admin/pages/site-crud/site-crud';
import { SiteEditComponent } from './features/admin/pages/site-edit/site-edit';
import { CommentsModerationComponent } from './features/admin/pages/comments-moderation/comments-moderation';
import { ChangePasswordComponent } from './features/admin/pages/change-password/change-password';
import { AdminLayout } from './features/admin/admin-layout/admin-layout';
import { AuthGuard } from './core/guards/auth-guard';
import { AdminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent, canActivate: [AdminGuard] },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'site-crud', component: SiteCrudComponent },
      { path: 'site-edit', component: SiteEditComponent },
      { path: 'site-edit/:id', component: SiteEditComponent },
      { path: 'comments-moderation', component: CommentsModerationComponent },
      { path: 'change-password', component: ChangePasswordComponent }
    ]
  },
  { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/admin/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
