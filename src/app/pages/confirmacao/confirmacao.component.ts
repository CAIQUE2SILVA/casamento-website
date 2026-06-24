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
  selector: 'app-confirmacao',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './confirmacao.component.html',
  styleUrls: ['./confirmacao.component.scss'],
})
export class ConfirmacaoComponent implements OnInit {
  confirmacaoForm: FormGroup;
  carregando = true;
  erro = false;
  mensagemErro = '';
  confirmacaoSucesso = false;
  enviando = false;
  nomeConvidado = '';
  convidadoId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private convidadosService: ConvidadosService
  ) {
    this.confirmacaoForm = this.fb.group({
      confirmado: [null, Validators.required],
      acompanhantes: [0],
      telefone: [''],
      observacoes: [''],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.convidadoId = params['id'];
      if (this.convidadoId) {
        this.carregarConvidado();
      } else {
        this.erro = true;
        this.mensagemErro =
          'Link de confirmação inválido. Verifique o link recebido por email.';
        this.carregando = false;
      }
    });
  }

  async carregarConvidado(): Promise<void> {
    try {
      // Simular carregamento dos dados do convidado
      // Em um cenário real, você buscaria os dados do Supabase
      await new Promise((resolve) => setTimeout(resolve, 1000));

      this.nomeConvidado = 'Convidado'; // Substituir pela busca real
      this.carregando = false;
    } catch (error) {
      this.erro = true;
      this.mensagemErro =
        'Erro ao carregar informações do convidado. Tente novamente mais tarde.';
      this.carregando = false;
    }
  }

  async confirmarPresenca(): Promise<void> {
    if (this.confirmacaoForm.invalid) {
      return;
    }

    this.enviando = true;

    try {
      const formData = this.confirmacaoForm.value;

      // Simular envio da confirmação
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Aqui você implementaria a lógica real de confirmação
      // await this.convidadosService.confirmarPresencaPublica(...)

      this.confirmacaoSucesso = true;
    } catch (error) {
      alert('Erro ao confirmar presença. Tente novamente.');
      console.error('Erro:', error);
    } finally {
      this.enviando = false;
    }
  }
}
