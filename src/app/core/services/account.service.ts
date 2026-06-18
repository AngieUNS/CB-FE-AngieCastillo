import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../../model/account.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly baseApi = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAccount(id: number): Observable<Account> {
    return this.http.get<Account>(`${this.baseApi}/accounts/${id}`);
  }
}
