import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgIf, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {AccountService} from '../../core/services/account.service';
import {Account} from '../../model/account.model';


@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.html',
  imports: [NgIf, CurrencyPipe, FormsModule]
})
export class AccountDetailComponent implements OnInit {
  account: Account | null = null;
  loading = false;
  error: string | null = null;
  searchId: number | null = null;

  constructor(
    private accountService: AccountService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  onSearch() {
    if (!this.searchId || this.searchId <= 0) {
      this.error = null;
      this.account = null;
      return;
    }
    this.loadAccount(this.searchId);
  }

  private loadAccount(id: number) {
    this.loading = true;
    this.error = null;
    this.account = null;

    this.accountService.getAccount(id).subscribe({
      next: (acc) => {
        this.account = acc;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = err?.message ?? 'Error cargando cuenta';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
