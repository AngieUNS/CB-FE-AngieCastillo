import { Component, ChangeDetectorRef, NgZone, ApplicationRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AccountService} from '../../core/services/account.service';
import {TransactionService} from '../../core/services/transaction.service';
import {TransactionType} from '../../model/transaction.model';
import {AsyncPipe, DecimalPipe, JsonPipe, NgIf} from '@angular/common';


@Component({
  standalone: true,
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.html',
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    DecimalPipe,
    NgIf,
    AsyncPipe
  ],
  styleUrls: ['./transaction-form.css']
})
export class TransactionFormComponent {
  form: FormGroup;
  TransactionType = TransactionType; // para usar en template
  result: any = null;
  loading = false;
  error: string | null = null;

  // Observables para forzar actualización reactiva en la plantilla
  result$ = new BehaviorSubject<any | null>(null);
  loading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private txService: TransactionService,
    private accountService: AccountService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private appRef: ApplicationRef
  ) {
    this.form = this.fb.group({
      accountId: [null, [Validators.required, Validators.min(1)]],
      type: [TransactionType.DEPOSIT, Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]]
    });
  }

  closeResult() {
    this.zone.run(() => {
      this.result = null;
      try { this.result$.next(null); } catch (e) { console.debug('result$ error', e); }
      try { this.cdr.detectChanges(); } catch (e) { console.debug('cdr detect error', e); }
    });
  }

  closeError() {
    this.zone.run(() => {
      this.error = null;
      try { this.error$.next(null); } catch (e) { console.debug('error$ error', e); }
      try { this.cdr.detectChanges(); } catch (e) { console.debug('cdr detect error', e); }
    });
  }

  submit() {
    console.debug('[TransactionForm] submit() llamado', {
      rawValue: this.form.value,
      valid: this.form.valid,
      status: this.form.status
    });

    if (this.form.invalid) {
      console.warn('[TransactionForm] formulario inválido, no se envía', this.form.errors);
      this.form.markAllAsTouched();
      return;
    }
    // Establecer estado dentro de la zona para asegurar que Angular detecte cambios
    this.zone.run(() => {
      this.loading = true;
      this.error = null;
      this.result = null;
      this.loading$.next(true);
      this.error$.next(null);
      this.result$.next(null);
    });

    // Hacer scroll y focus al bloque de "Enviando" tras el siguiente repaint para que sea visible
    setTimeout(() => {
      requestAnimationFrame(() => {
        try {
          const el = document.getElementById('tx-loading');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            (el as HTMLElement).focus();
          }
        } catch (e) {
          console.debug('[TransactionForm] no se pudo desplazar al bloque de carga', e);
        }
      });
    }, 0);

    const payload = {
      accountId: Number(this.form.value.accountId),
      type: this.form.value.type,
      amount: Number(this.form.value.amount)
    };

    console.debug('[TransactionForm] payload preparado', payload);


    this.txService.createTransaction(payload).subscribe({
      next: (res) => {
        console.info('[TransactionForm] transacción creada correctamente', res);

        // Emitir resultado y quitar estado de carga inmediatamente dentro de la zona
        this.zone.run(() => {
          this.result = res;
          this.loading = false;
          try { this.result$.next(res); } catch (e) { console.debug('result$ error', e); }
          try { this.loading$.next(false); } catch (e) { console.debug('loading$ error', e); }
          try { this.cdr.detectChanges(); } catch (e) { console.debug('cdr detect error', e); }
          try { this.appRef.tick(); } catch (e) { console.debug('appRef tick error', e); }
        });

        // Después de pintar, desplazar y enfocar el resultado
        requestAnimationFrame(() => {
          try {
            const el = document.getElementById('tx-result');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              (el as HTMLElement).focus();
            }
          } catch (e) {
            console.debug('[TransactionForm] no se pudo desplazar al resultado', e);
          }
        });

        // Opcional: recargar la cuenta en segundo plano (no bloquear la UI)
        // Disparamos la recarga en un microtask para asegurarnos que Angular pinte primero
        setTimeout(() => {
          this.accountService.getAccount(res.account.id).subscribe({
            next: (account) => { console.debug('[TransactionForm] cuenta recargada', account); try { this.zone.run(() => this.cdr.detectChanges()); } catch (e) {} },
            error: (accountErr) => { console.error('[TransactionForm] error recargando cuenta', accountErr); try { this.zone.run(() => this.cdr.detectChanges()); } catch (e) {} }
          });
        }, 0);
      },
      error: (err) => {
        console.error('[TransactionForm] error creando transacción', err);
        this.zone.run(() => {
          this.error = err?.message ?? 'Error creando transacción';
          this.loading = false;
          try { this.error$.next(this.error); } catch (e) { console.debug('error$ error', e); }
          try { this.loading$.next(false); } catch (e) { console.debug('loading$ error', e); }
          try { this.cdr.detectChanges(); } catch (e) { console.debug('cdr detect error', e); }
          try { this.appRef.tick(); } catch (e) { console.debug('appRef tick error', e); }
        });
      }
    });
  }
}
