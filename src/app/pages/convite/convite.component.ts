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
  template: `
    <div class="convite-container">
      <!-- Imagem da Carta -->
      <div class="carta-envelope">
        <div class="carta-content">
          <!-- Cabeçalho da Carta -->
          <div class="carta-header">
            <div class="ornament">✨</div>
            <h1 class="nomes">Kauã & Kimily</h1>
            <div class="ornament">✨</div>
            <p class="data-casamento">19 de Novembro de 2024</p>
          </div>

          <!-- Convite -->
          <div class="convite-text">
            <p class="saudacao">
              Querido(a)
              <span class="nome-convidado">{{
                nomeConvidado || 'Convidado'
              }}</span
              >,
            </p>

            <p class="mensagem">
              Com imenso carinho e alegria, convidamos você para ser parte do
              dia mais especial de nossas vidas.
            </p>

            <p class="mensagem">
              Será uma honra tê-lo(a) conosco para celebrar nosso amor e o
              início de uma nova jornada juntos.
            </p>

            <div class="detalhes-evento">
              <div class="detalhe">
                <i class="fas fa-calendar-alt"></i>
                <span>19 de Novembro de 2024</span>
              </div>
              <div class="detalhe">
                <i class="fas fa-clock"></i>
                <span>17:00</span>
              </div>
              <div class="detalhe">
                <i class="fas fa-map-marker-alt"></i>
                <span>Local da Cerimônia</span>
              </div>
            </div>
          </div>

          <!-- Formulário de Confirmação -->
          <div class="confirmacao-section" *ngIf="!confirmacaoSucesso">
            <h3 class="confirmacao-titulo">Confirme sua Presença</h3>

            <form [formGroup]="conviteForm" (ngSubmit)="confirmarPresenca()">
              <div class="form-group">
                <label>Nome Completo *</label>
                <input
                  type="text"
                  formControlName="nome"
                  class="form-control"
                  placeholder="Seu nome completo"
                />
                <div
                  class="error-message"
                  *ngIf="conviteForm.get('nome')?.errors?.['required'] && conviteForm.get('nome')?.touched"
                >
                  Nome é obrigatório
                </div>
              </div>

              <div class="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  formControlName="email"
                  class="form-control"
                  placeholder="seu@email.com"
                />
                <div
                  class="error-message"
                  *ngIf="conviteForm.get('email')?.errors?.['required'] && conviteForm.get('email')?.touched"
                >
                  Email é obrigatório
                </div>
                <div
                  class="error-message"
                  *ngIf="conviteForm.get('email')?.errors?.['email'] && conviteForm.get('email')?.touched"
                >
                  Email inválido
                </div>
              </div>

              <div class="form-group">
                <label>Telefone *</label>
                <input
                  type="tel"
                  formControlName="telefone"
                  class="form-control"
                  placeholder="(11) 99999-9999"
                />
                <div
                  class="error-message"
                  *ngIf="conviteForm.get('telefone')?.errors?.['required'] && conviteForm.get('telefone')?.touched"
                >
                  Telefone é obrigatório
                </div>
              </div>

              <div class="form-group">
                <label>Você confirma sua presença? *</label>
                <div class="radio-group">
                  <div class="radio-item">
                    <input
                      type="radio"
                      formControlName="confirmado"
                      [value]="true"
                      id="sim"
                    />
                    <label for="sim">
                      <i class="fas fa-heart"></i>
                      Sim, estarei presente!
                    </label>
                  </div>
                  <div class="radio-item">
                    <input
                      type="radio"
                      formControlName="confirmado"
                      [value]="false"
                      id="nao"
                    />
                    <label for="nao">
                      <i class="fas fa-heart-broken"></i>
                      Infelizmente não poderei comparecer
                    </label>
                  </div>
                </div>
              </div>

              <div
                class="form-group"
                *ngIf="conviteForm.get('confirmado')?.value === true"
              >
                <label>Vai levar acompanhante?</label>
                <div class="radio-group">
                  <div class="radio-item">
                    <input
                      type="radio"
                      formControlName="temAcompanhante"
                      [value]="false"
                      id="sozinho"
                    />
                    <label for="sozinho">Apenas eu</label>
                  </div>
                  <div class="radio-item">
                    <input
                      type="radio"
                      formControlName="temAcompanhante"
                      [value]="true"
                      id="acompanhante"
                    />
                    <label for="acompanhante"
                      >Sim, vou levar acompanhante</label
                    >
                  </div>
                </div>
              </div>

              <div
                class="form-group"
                *ngIf="conviteForm.get('temAcompanhante')?.value === true"
              >
                <label>Nome do Acompanhante *</label>
                <input
                  type="text"
                  formControlName="nomeAcompanhante"
                  class="form-control"
                  placeholder="Nome completo do acompanhante"
                />
                <div
                  class="error-message"
                  *ngIf="conviteForm.get('nomeAcompanhante')?.errors?.['required'] && conviteForm.get('nomeAcompanhante')?.touched"
                >
                  Nome do acompanhante é obrigatório
                </div>
              </div>

              <div class="form-group">
                <label>Observações</label>
                <textarea
                  formControlName="observacoes"
                  class="form-control"
                  placeholder="Restrições alimentares, observações especiais..."
                  rows="3"
                ></textarea>
              </div>

              <button
                type="submit"
                class="btn-confirmar"
                [disabled]="conviteForm.invalid || enviando"
              >
                <i class="fas fa-heart" *ngIf="!enviando"></i>
                <i class="fas fa-spinner fa-spin" *ngIf="enviando"></i>
                {{ enviando ? 'Confirmando...' : 'Confirmar Presença' }}
              </button>
            </form>
          </div>

          <!-- Sucesso -->
          <div class="sucesso-section" *ngIf="confirmacaoSucesso">
            <div class="sucesso-content">
              <i class="fas fa-check-circle"></i>
              <h3>Presença Confirmada!</h3>
              <p>
                Obrigado por confirmar! Estamos ansiosos para celebrar este
                momento especial com você.
              </p>
              <div class="detalhes-confirmacao">
                <p><strong>Data:</strong> 19 de Novembro de 2024</p>
                <p><strong>Horário:</strong> 17:00</p>
              </div>
            </div>
          </div>

          <!-- Rodapé da Carta -->
          <div class="carta-footer">
            <p class="despedida">Com amor e carinho,</p>
            <p class="assinatura">Kauã & Kimily</p>
            <div class="ornament-footer">💕</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .convite-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .carta-envelope {
        max-width: 600px;
        width: 100%;
        background: #fff;
        border-radius: 15px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        position: relative;
      }

      .carta-envelope::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 5px;
        background: linear-gradient(90deg, #3498db, #2e86c1, #3498db);
      }

      .carta-content {
        padding: 40px;
        font-family: 'Georgia', serif;
        line-height: 1.6;
      }

      .carta-header {
        text-align: center;
        margin-bottom: 30px;
        border-bottom: 2px solid #f0f0f0;
        padding-bottom: 20px;
      }

      .ornament {
        font-size: 24px;
        margin: 10px 0;
      }

      .nomes {
        font-size: 2.5rem;
        color: #3498db;
        margin: 15px 0;
        font-family: 'Playfair Display', serif;
      }

      .data-casamento {
        font-size: 1.2rem;
        color: #666;
        font-style: italic;
      }

      .convite-text {
        margin-bottom: 30px;
      }

      .saudacao {
        font-size: 1.2rem;
        margin-bottom: 20px;
      }

      .nome-convidado {
        color: #3498db;
        font-weight: bold;
      }

      .mensagem {
        margin-bottom: 15px;
        color: #444;
      }

      .detalhes-evento {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 10px;
        margin: 20px 0;
      }

      .detalhe {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        color: #3498db;
      }

      .detalhe i {
        width: 20px;
        margin-right: 10px;
      }

      .confirmacao-section {
        border-top: 2px solid #f0f0f0;
        padding-top: 30px;
      }

      .confirmacao-titulo {
        text-align: center;
        color: #3498db;
        margin-bottom: 25px;
        font-family: 'Playfair Display', serif;
      }

      .form-group {
        margin-bottom: 20px;
      }

      .form-group label {
        display: block;
        margin-bottom: 8px;
        color: #333;
        font-weight: 500;
      }

      .form-control {
        width: 100%;
        padding: 12px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        font-size: 16px;
        transition: border-color 0.3s;
      }

      .form-control:focus {
        outline: none;
        border-color: #3498db;
      }

      .radio-group {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .radio-item {
        display: flex;
        align-items: center;
      }

      .radio-item input[type='radio'] {
        margin-right: 10px;
      }

      .radio-item label {
        display: flex;
        align-items: center;
        cursor: pointer;
        margin-bottom: 0;
      }

      .radio-item label i {
        margin-right: 8px;
        color: #3498db;
      }

      .btn-confirmar {
        width: 100%;
        padding: 15px;
        background: linear-gradient(45deg, #3498db, #2e86c1);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 18px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
      }

      .btn-confirmar:hover:not(:disabled) {
        transform: translateY(-2px);
      }

      .btn-confirmar:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .error-message {
        color: #e74c3c;
        font-size: 14px;
        margin-top: 5px;
      }

      .sucesso-section {
        text-align: center;
        border-top: 2px solid #f0f0f0;
        padding-top: 30px;
      }

      .sucesso-content i {
        font-size: 3rem;
        color: #27ae60;
        margin-bottom: 20px;
      }

      .sucesso-content h3 {
        color: #27ae60;
        margin-bottom: 15px;
      }

      .detalhes-confirmacao {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        margin-top: 20px;
      }

      .carta-footer {
        text-align: center;
        margin-top: 30px;
        border-top: 2px solid #f0f0f0;
        padding-top: 20px;
      }

      .despedida {
        font-style: italic;
        color: #666;
      }

      .assinatura {
        font-size: 1.3rem;
        color: #3498db;
        font-weight: bold;
        margin: 10px 0;
      }

      .ornament-footer {
        font-size: 24px;
      }

      @media (max-width: 768px) {
        .convite-container {
          padding: 10px;
        }

        .carta-content {
          padding: 20px;
        }

        .nomes {
          font-size: 2rem;
        }

        .radio-group {
          gap: 15px;
        }
      }
    `,
  ],
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

      const convidado = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        confirmado: formData.confirmado,
        conviteEnviado: true,
        dataConfirmacao: new Date(),
        observacoes: formData.observacoes || '',
        acompanhantes:
          formData.temAcompanhante && formData.nomeAcompanhante
            ? [
                {
                  nome: formData.nomeAcompanhante,
                  confirmado: formData.confirmado,
                },
              ]
            : [],
      };

      await this.convidadosService.adicionarConvidado(convidado);
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
