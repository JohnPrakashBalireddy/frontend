import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { Role } from './core/models/role.model';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: 'customer',
    canActivate: [authGuard, roleGuard],
    data: { roles: [Role.Customer] },
    loadChildren: () => import('./features/customer/customer.module').then((m) => m.CustomerModule)
  },
  {
    path: 'vendor',
    canActivate: [authGuard, roleGuard],
    data: { roles: [Role.Vendor] },
    loadChildren: () => import('./features/vendor/vendor.module').then((m) => m.VendorModule)
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: [Role.Admin] },
    loadChildren: () => import('./features/admin/admin.module').then((m) => m.AdminModule)
  },
  { path: '', pathMatch: 'full', redirectTo: 'auth' },
  { path: '**', redirectTo: 'auth' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
