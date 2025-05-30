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
  template: `
    <div
      class="min-vh-100 d-flex align-items-center"
      style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"
    >
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-6">
            <div class="card shadow-lg border-0" style="border-radius: 20px;">
              <!-- Cabeçalho -->
              <div
                class="card-header text-center py-4"
                style="background: linear-gradient(45deg, #2e86c1, #3498db); border-radius: 20px 20px 0 0;"
              >
                <div class="mb-3">
                  <span style="font-size: 3rem;">💍</span>
                </div>
                <h2
                  class="text-white mb-0"
                  style="font-family: 'Playfair Display', serif;"
                >
                  Confirmação de Presença
                </h2>
                <p class="text-white-50 mb-0">Casamento Kauã & Kimily</p>
              </div>

              <div class="card-body p-5">
                <!-- Loading -->
                <div *ngIf="carregando" class="text-center py-4">
                  <div class="spinner-border text-primary mb-3" role="status">
                    <span class="visually-hidden">Carregando...</span>
                  </div>
                  <p class="text-muted">Carregando informações...</p>
                </div>

                <!-- Erro -->
                <div *ngIf="erro && !carregando" class="text-center py-4">
                  <i
                    class="fas fa-exclamation-triangle text-warning fa-3x mb-3"
                  ></i>
                  <h4 class="text-danger">Ops! Algo deu errado</h4>
                  <p class="text-muted">{{ mensagemErro }}</p>
                  <a routerLink="/" class="btn btn-primary">
                    <i class="fas fa-home me-2"></i>Voltar ao Site
                  </a>
                </div>

                <!-- Sucesso -->
                <div
                  *ngIf="confirmacaoSucesso && !carregando"
                  class="text-center py-4"
                >
                  <i class="fas fa-check-circle text-success fa-3x mb-3"></i>
                  <h4 class="text-success">Presença Confirmada!</h4>
                  <p class="text-muted mb-4">
                    Obrigado por confirmar sua presença! Estamos ansiosos para
                    celebrar este momento especial com você.
                  </p>
                  <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    <strong>Data:</strong> 15 de Novembro de 2025<br />
                    <strong>Local:</strong> Local da Cerimônia
                  </div>
                  <a routerLink="/" class="btn btn-primary">
                    <i class="fas fa-home me-2"></i>Voltar ao Site
                  </a>
                </div>

                <!-- Formulário de Confirmação -->
                <div *ngIf="!carregando && !erro && !confirmacaoSucesso">
                  <div class="text-center mb-4">
                    <h4>Olá, {{ nomeConvidado }}!</h4>
                    <p class="text-muted">
                      Confirme sua presença no nosso casamento preenchendo as
                      informações abaixo:
                    </p>
                  </div>

                  <form
                    [formGroup]="confirmacaoForm"
                    (ngSubmit)="confirmarPresenca()"
                  >
                    <div class="mb-3">
                      <label for="confirmado" class="form-label">
                        <strong>Você confirma sua presença?</strong>
                      </label>
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="radio"
                          formControlName="confirmado"
                          [value]="true"
                          id="sim"
                        />
                        <label class="form-check-label" for="sim">
                          <i class="fas fa-check text-success me-2"></i>Sim,
                          estarei presente!
                        </label>
                      </div>
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="radio"
                          formControlName="confirmado"
                          [value]="false"
                          id="nao"
                        />
                        <label class="form-check-label" for="nao">
                          <i class="fas fa-times text-danger me-2"></i
                          >Infelizmente não poderei comparecer
                        </label>
                      </div>
                    </div>

                    <div
                      class="mb-3"
                      *ngIf="confirmacaoForm.get('confirmado')?.value === true"
                    >
                      <label for="acompanhantes" class="form-label"
                        >Número de Acompanhantes</label
                      >
                      <select
                        class="form-select"
                        formControlName="acompanhantes"
                      >
                        <option value="0">Apenas eu</option>
                        <option value="1">Eu + 1 acompanhante</option>
                        <option value="2">Eu + 2 acompanhantes</option>
                        <option value="3">Eu + 3 acompanhantes</option>
                        <option value="4">Eu + 4 acompanhantes</option>
                      </select>
                    </div>

                    <div class="mb-3">
                      <label for="telefone" class="form-label"
                        >Telefone para Contato</label
                      >
                      <input
                        type="tel"
                        class="form-control"
                        formControlName="telefone"
                        placeholder="(11) 99999-9999"
                      />
                    </div>

                    <div class="mb-4">
                      <label for="observacoes" class="form-label"
                        >Observações (opcional)</label
                      >
                      <textarea
                        class="form-control"
                        formControlName="observacoes"
                        rows="3"
                        placeholder="Alguma observação especial, restrição alimentar, etc."
                      ></textarea>
                    </div>

                    <div class="d-grid">
                      <button
                        type="submit"
                        class="btn btn-primary btn-lg"
                        [disabled]="confirmacaoForm.invalid || enviando"
                      >
                        <i class="fas fa-heart me-2" *ngIf="!enviando"></i>
                        <i
                          class="fas fa-spinner fa-spin me-2"
                          *ngIf="enviando"
                        ></i>
                        {{ enviando ? 'Confirmando...' : 'Confirmar Presença' }}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <!-- Rodapé -->
              <div
                class="card-footer text-center py-3"
                style="background-color: #f8f9fa; border-radius: 0 0 20px 20px;"
              >
                <small class="text-muted">
                  <i class="fas fa-heart text-danger me-1"></i>
                  Com amor, Kauã & Kimily
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .card {
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
      }

      .form-check-input:checked {
        background-color: #2e86c1;
        border-color: #2e86c1;
      }

      .btn-primary {
        background: linear-gradient(45deg, #2e86c1, #3498db);
        border: none;
        border-radius: 25px;
        padding: 12px 30px;
        font-weight: 600;
      }

      .btn-primary:hover {
        background: linear-gradient(45deg, #2574a9, #2e86c1);
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(46, 134, 193, 0.3);
      }

      .form-control,
      .form-select {
        border-radius: 10px;
        border: 2px solid #e9ecef;
        padding: 12px 15px;
      }

      .form-control:focus,
      .form-select:focus {
        border-color: #2e86c1;
        box-shadow: 0 0 0 0.2rem rgba(46, 134, 193, 0.25);
      }

      .form-check-label {
        font-weight: 500;
        cursor: pointer;
      }

      .alert {
        border-radius: 10px;
        border: none;
      }
    `,
  ],
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
