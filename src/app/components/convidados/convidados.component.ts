import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ConvidadosService } from '../../services/convidados.service';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-convidados',
  standalone: true,
  imports: [
    CommonModule
  ],
  providers: [
    ConvidadosService,
    EmailService
  ],
  templateUrl: './convidados.component.html',
  styleUrls: ['./convidados.component.scss']
})
export class ConvidadosComponent {
  constructor(
    private convidadosService: ConvidadosService,
    private emailService: EmailService
  ) {}
  // ... resto do código
}

