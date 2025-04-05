import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  constructor(private http: HttpClient) {}

  // Método mockado para desenvolvimento
  enviarConvite(email: string, nome: string, link: string): Observable<boolean> {
    console.log(`Simulando envio de convite para ${nome} (${email}) com link: ${link}`);
    return of(true);
  }
}
