import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {AccountService} from '../../core/services/account.service';
import {Account} from '../../model/account.model';


@Component({
  standalone: true,
  selector: 'app-account-detail',
  templateUrl: './account-detail.html',
  imports: [CommonModule, FormsModule]
})
export class AccountDetailComponent implements OnInit {
  account: Account | null = null;
  loading = false;
  error: string | null = null;
  searchId: number | null = null;

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    // No sincronizamos ni cargamos automáticamente desde la ruta.
    // La carga solo ocurrirá cuando el usuario pulse "Buscar".
  }

  onSearch() {
    if (!this.searchId || this.searchId <= 0) {
      this.error = null;
      this.account = null;
      return;
    }
    // Ejecutar la carga explícita (el usuario pidió buscar)
    console.debug('[AccountDetail] buscando cuenta con ID:', this.searchId);
    this.loadAccount(this.searchId);
  }

  private loadAccount(id: number) {
    this.loading = true;
    this.error = null;
    this.account = null;

    this.accountService.getAccount(id).subscribe({
      next: (acc) => { this.account = acc; this.loading = false; },
      error: (err) => { this.error = err?.message ?? 'Error cargando cuenta'; this.loading = false; }
    });
  }
}
