import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ConvidadosService } from '../../services/convidados.service';

@Component({
  selector: 'app-convite',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './convite.component.html',
  styleUrls: ['./convite.component.scss'],
})
export class ConviteComponent implements OnInit {
  conviteForm: FormGroup;
  enviando = false;
  confirmacaoSucesso = false;
  nomeConvidado = '';
  convidadoToken = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private convidadosService: ConvidadosService
  ) {
    this.conviteForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required]],
      confirmado: [null, [Validators.required]],
      temAcompanhante: [false],
      nomeAcompanhante: [''],
      observacoes: [''],
    });

    // Adicionar validação condicional para nome do acompanhante
    this.conviteForm
      .get('temAcompanhante')
      ?.valueChanges.subscribe((temAcompanhante) => {
        const nomeAcompanhanteControl =
          this.conviteForm.get('nomeAcompanhante');
        if (temAcompanhante) {
          nomeAcompanhanteControl?.setValidators([
            Validators.required,
            Validators.minLength(2),
          ]);
        } else {
          nomeAcompanhanteControl?.clearValidators();
        }
        nomeAcompanhanteControl?.updateValueAndValidity();
      });
  }

  ngOnInit(): void {
    // Pegar o token da URL
    this.route.params.subscribe((params) => {
      this.convidadoToken = params['token'];
      if (this.convidadoToken) {
        this.carregarDadosConvidado();
      }
    });
  }

  private async carregarDadosConvidado(): Promise<void> {
    try {
      // Aqui você pode carregar dados pre-existentes se necessário
      // Por agora, vamos deixar o formulário limpo para o convidado preencher
    } catch (error) {
      console.error('Erro ao carregar dados do convidado:', error);
    }
  }

  async confirmarPresenca(): Promise<void> {
    if (this.conviteForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.enviando = true;

    try {
      const formData = this.conviteForm.value;

      // Dados do convidado com os novos campos de acompanhante
      const convidado = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone || null,
        confirmado: formData.confirmado,
        convite_enviado: false,
        observacoes: formData.observacoes || null,
        acompanhante: formData.temAcompanhante || false,
        nome_acompanhante:
          formData.temAcompanhante && formData.nomeAcompanhante
            ? formData.nomeAcompanhante
            : null,
      };

      console.log('🔍 Dados que serão enviados:', convidado);

      const convidadoSalvo = await this.convidadosService.adicionarConvidado(
        convidado
      );
      this.confirmacaoSucesso = true;
    } catch (error) {
      console.error('Erro ao confirmar presença:', error);
      alert('Erro ao confirmar presença. Tente novamente.');
    } finally {
      this.enviando = false;
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.conviteForm.controls).forEach((key) => {
      const control = this.conviteForm.get(key);
      control?.markAsTouched();
    });
  }
}
