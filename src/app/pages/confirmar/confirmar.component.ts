import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConvidadosService } from '../../services/convidados.service';

@Component({
  selector: 'app-confirmar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './confirmar.component.html',
  styleUrls: ['./confirmar.component.scss'],
})
export class ConfirmarComponent {
  confirmForm: FormGroup;
  isSubmitting = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private convidadosService: ConvidadosService
  ) {
    this.confirmForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      acompanhantes: ['0'],
      observacoes: [''],
    });
  }

  get nome() {
    return this.confirmForm.get('nome');
  }
  get email() {
    return this.confirmForm.get('email');
  }
  get telefone() {
    return this.confirmForm.get('telefone');
  }

  async onSubmit() {
    if (this.confirmForm.invalid) return;

    this.isSubmitting = true;

    try {
      await this.convidadosService.confirmarPresencaPublica(
        this.nome?.value,
        this.email?.value,
        this.telefone?.value,
        parseInt(this.confirmForm.get('acompanhantes')?.value || '0', 10),
        this.confirmForm.get('observacoes')?.value || ''
      );

      this.submitted = true;
    } catch (error) {
      console.error('Erro ao confirmar presença:', error);
      alert(
        'Ocorreu um erro ao confirmar sua presença. Por favor, tente novamente.'
      );
    } finally {
      this.isSubmitting = false;
    }
  }
}
