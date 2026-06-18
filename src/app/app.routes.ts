import { Routes } from '@angular/router';

export const routes: Routes = [
  // ruta por defecto: redirige al formulario de transacciones
  { path: '', redirectTo: 'transactions/new', pathMatch: 'full' },

  // formulario para crear transacciones
  {
    path: 'transactions/new',
    loadComponent: () =>
      import('./feautures/transaction-form/transaction-form').then(
        (m) => m.TransactionFormComponent
      ),
  },

  // detalle de cuenta (usa parámetro id)
  {
    path: 'accounts/:id',
    loadComponent: () =>
      import('./feautures/account-detail/account-detail').then(
        (m) => m.AccountDetailComponent
      ),
  },

  // comodín -> al inicio
  { path: '**', redirectTo: '' },
];
