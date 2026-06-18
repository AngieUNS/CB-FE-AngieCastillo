import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TransactionRequest, TransactionResponse } from '../../model/transaction.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly baseApi = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createTransaction(body: TransactionRequest): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(`${this.baseApi}/transactions`, body);
  }
}
