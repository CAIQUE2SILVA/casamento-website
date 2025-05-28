import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import {
  ConvidadosService,
  EstatisticasConvidados,
} from '../../services/convidados.service';
import {
  EmailjsService,
  ConviteEmailData,
} from '../../services/emailjs.service';
import { Convidado, Acompanhante } from '../../models/convidado.model';

@Component({
  selector: 'app-convidados',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container py-4">
      <!-- Cabeçalho -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Gerenciar Convidados</h1>
        <div>
          <button (click)="abrirFormulario()" class="btn btn-primary me-2">
            <i class="fas fa-plus me-2"></i>Novo Convidado
          </button>
          <button
            (click)="enviarTodosConvites()"
            class="btn btn-success me-2"
            [disabled]="enviandoTodosConvites"
          >
            <i class="fas fa-envelope me-2" *ngIf="!enviandoTodosConvites"></i>
            <i
              class="fas fa-spinner fa-spin me-2"
              *ngIf="enviandoTodosConvites"
            ></i>
            {{
              enviandoTodosConvites ? 'Enviando...' : 'Enviar Todos os Convites'
            }}
          </button>
          <a routerLink="/admin/dashboard" class="btn btn-outline-secondary">
            <i class="fas fa-arrow-left me-2"></i>Voltar
          </a>
        </div>
      </div>

      <!-- Alerta de configuração do EmailJS -->
      <div *ngIf="!emailjsConfigurado" class="alert alert-warning mb-4">
        <i class="fas fa-exclamation-triangle me-2"></i>
        <strong>Atenção:</strong> O EmailJS não está configurado. Configure as
        chaves no arquivo <code>src/app/services/emailjs.service.ts</code> para
        enviar convites por email.
      </div>

      <!-- Cards de estatísticas -->
      <div class="row g-4 mb-4">
        <div class="col-md-3">
          <div class="card bg-primary text-white h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="text-white-50">Total de Convidados</h6>
                  <h2 class="mb-0">{{ estatisticas.totalPessoas || 0 }}</h2>
                </div>
                <i class="fas fa-users fa-3x text-white-50"></i>
              </div>
              <div class="mt-3">
                <p class="mb-0">
                  {{ estatisticas.total || 0 }} principais +
                  {{ estatisticas.totalPessoas - estatisticas.total || 0 }}
                  acompanhantes
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card bg-success text-white h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="text-white-50">Presenças Confirmadas</h6>
                  <h2 class="mb-0">{{ estatisticas.totalConfirmados || 0 }}</h2>
                </div>
                <i class="fas fa-check-circle fa-3x text-white-50"></i>
              </div>
              <div class="mt-3">
                <p class="mb-0">
                  {{ estatisticas.confirmados || 0 }} principais +
                  {{
                    estatisticas.totalConfirmados - estatisticas.confirmados ||
                      0
                  }}
                  acompanhantes
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card bg-warning text-white h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="text-white-50">Presenças Pendentes</h6>
                  <h2 class="mb-0">
                    {{
                      estatisticas.totalPessoas -
                        estatisticas.totalConfirmados || 0
                    }}
                  </h2>
                </div>
                <i class="fas fa-clock fa-3x text-white-50"></i>
              </div>
              <div class="mt-3">
                <p class="mb-0">
                  {{ estatisticas.pendentes || 0 }} principais +
                  {{
                    estatisticas.totalPessoas -
                      estatisticas.total -
                      (estatisticas.totalConfirmados -
                        estatisticas.confirmados) || 0
                  }}
                  acompanhantes
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card bg-info text-white h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="text-white-50">Convites Enviados</h6>
                  <h2 class="mb-0">{{ estatisticas.convitesEnviados || 0 }}</h2>
                </div>
                <i class="fas fa-envelope fa-3x text-white-50"></i>
              </div>
              <div class="mt-3">
                <p class="mb-0">
                  {{
                    (
                      ((estatisticas.convitesEnviados || 0) /
                        (estatisticas.total || 1)) *
                      100
                    ).toFixed(0)
                  }}% dos convidados
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulário de convidado (exibido quando estiver editando) -->
      <div *ngIf="mostraFormulario" class="card mb-4">
        <div
          class="card-header d-flex justify-content-between align-items-center"
        >
          <h5 class="mb-0">
            {{ convidadoAtual?.id ? 'Editar' : 'Novo' }} Convidado
          </h5>
          <button
            (click)="cancelarEdicao()"
            class="btn btn-sm btn-outline-secondary"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="card-body">
          <form [formGroup]="convidadoForm" (ngSubmit)="salvarConvidado()">
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="nome" class="form-label">Nome Completo*</label>
                <input
                  type="text"
                  class="form-control"
                  id="nome"
                  formControlName="nome"
                  placeholder="Nome completo do convidado"
                />
                <div
                  *ngIf="submitted && cf['nome'].errors"
                  class="text-danger small mt-1"
                >
                  <span *ngIf="cf['nome'].errors['required']"
                    >Nome é obrigatório</span
                  >
                </div>
              </div>
              <div class="col-md-6">
                <label for="email" class="form-label">Email*</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  formControlName="email"
                  placeholder="Email para enviar o convite"
                />
                <div
                  *ngIf="submitted && cf['email'].errors"
                  class="text-danger small mt-1"
                >
                  <span *ngIf="cf['email'].errors['required']"
                    >Email é obrigatório</span
                  >
                  <span *ngIf="cf['email'].errors['email']"
                    >Email inválido</span
                  >
                </div>
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-md-6">
                <label for="telefone" class="form-label">Telefone</label>
                <input
                  type="tel"
                  class="form-control"
                  id="telefone"
                  formControlName="telefone"
                  placeholder="Telefone do convidado"
                />
              </div>
              <div class="col-md-6">
                <label for="observacoes" class="form-label">Observações</label>
                <input
                  type="text"
                  class="form-control"
                  id="observacoes"
                  formControlName="observacoes"
                  placeholder="Observações sobre o convidado"
                />
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-md-4">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="confirmado"
                    formControlName="confirmado"
                  />
                  <label class="form-check-label" for="confirmado">
                    Presença confirmada
                  </label>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="conviteEnviado"
                    formControlName="conviteEnviado"
                  />
                  <label class="form-check-label" for="conviteEnviado">
                    Convite enviado
                  </label>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="enviarConviteAoSalvar"
                    formControlName="enviarConviteAoSalvar"
                  />
                  <label class="form-check-label" for="enviarConviteAoSalvar">
                    Enviar convite ao salvar
                  </label>
                </div>
              </div>
            </div>

            <h5 class="mt-4 mb-3">Acompanhantes</h5>

            <div formArrayName="acompanhantes">
              <div
                *ngFor="
                  let acompanhante of acompanhantesArray.controls;
                  let i = index
                "
                [formGroupName]="i"
                class="row mb-2"
              >
                <div class="col-md-8">
                  <input
                    type="text"
                    class="form-control"
                    formControlName="nome"
                    placeholder="Nome do acompanhante"
                  />
                </div>
                <div class="col-md-3">
                  <div class="form-check mt-2">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      formControlName="confirmado"
                    />
                    <label class="form-check-label"> Confirmado </label>
                  </div>
                </div>
                <div class="col-md-1">
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-danger mt-1"
                    (click)="removerAcompanhante(i)"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>

              <button
                type="button"
                class="btn btn-sm btn-outline-primary mt-2"
                (click)="adicionarAcompanhante()"
              >
                <i class="fas fa-plus me-1"></i> Adicionar Acompanhante
              </button>
            </div>

            <div class="d-flex justify-content-end mt-4">
              <button
                type="button"
                class="btn btn-outline-secondary me-2"
                (click)="cancelarEdicao()"
              >
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary">Salvar</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Lista de convidados -->
      <div class="card">
        <div class="card-header bg-white">
          <div class="row align-items-center">
            <div class="col">
              <h5 class="mb-0">Lista de Convidados</h5>
            </div>
            <div class="col-auto">
              <input
                type="text"
                class="form-control form-control-sm"
                placeholder="Pesquisar convidados..."
                [(ngModel)]="termoBusca"
              />
            </div>
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Acompanhantes</th>
                  <th>Status</th>
                  <th>Convite</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let convidado of convidadosFiltrados">
                  <td>
                    <div class="fw-bold">{{ convidado.nome }}</div>
                    <small class="text-muted" *ngIf="convidado.telefone">{{
                      convidado.telefone
                    }}</small>
                  </td>
                  <td>
                    <div>{{ convidado.email }}</div>
                    <small class="text-muted" *ngIf="convidado.observacoes">{{
                      convidado.observacoes
                    }}</small>
                  </td>
                  <td>
                    <span class="badge bg-secondary">
                      {{ convidado.acompanhantes.length }} total
                    </span>
                    <span
                      class="badge bg-success ms-1"
                      *ngIf="contarAcompanhantesConfirmados(convidado) > 0"
                    >
                      {{ contarAcompanhantesConfirmados(convidado) }}
                      confirmados
                    </span>
                  </td>
                  <td>
                    <div class="form-check form-switch">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        [checked]="convidado.confirmado"
                        (change)="alternarConfirmacao(convidado, $event)"
                        [id]="'confirmado-' + convidado.id"
                      />
                      <label
                        class="form-check-label"
                        [for]="'confirmado-' + convidado.id"
                      >
                        {{ convidado.confirmado ? 'Confirmado' : 'Pendente' }}
                      </label>
                    </div>
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <span
                        class="badge me-2"
                        [class.bg-success]="convidado.conviteEnviado"
                        [class.bg-warning]="!convidado.conviteEnviado"
                      >
                        {{ convidado.conviteEnviado ? 'Enviado' : 'Pendente' }}
                      </span>
                      <button
                        class="btn btn-sm btn-outline-primary"
                        [disabled]="
                          convidado.conviteEnviado ||
                          enviandoConvite === convidado.id ||
                          !emailjsConfigurado
                        "
                        (click)="enviarConvite(convidado)"
                        [title]="
                          !emailjsConfigurado
                            ? 'Configure o EmailJS primeiro'
                            : convidado.conviteEnviado
                            ? 'Convite já enviado'
                            : 'Enviar convite'
                        "
                      >
                        <i
                          class="fas fa-envelope"
                          *ngIf="enviandoConvite !== convidado.id"
                        ></i>
                        <i
                          class="fas fa-spinner fa-spin"
                          *ngIf="enviandoConvite === convidado.id"
                        ></i>
                      </button>
                    </div>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button
                        class="btn btn-outline-primary"
                        (click)="editarConvidado(convidado)"
                        title="Editar"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <button
                        class="btn btn-outline-danger"
                        (click)="excluirConvidado(convidado)"
                        title="Excluir"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="convidadosFiltrados.length === 0">
                  <td colspan="6" class="text-center py-4 text-muted">
                    <i class="fas fa-users fa-3x mb-3 d-block"></i>
                    {{
                      termoBusca
                        ? 'Nenhum convidado encontrado com o termo pesquisado.'
                        : 'Nenhum convidado cadastrado ainda.'
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .form-check-input:checked {
        background-color: #28a745;
        border-color: #28a745;
      }

      .badge {
        font-size: 0.75em;
      }

      .btn-group-sm > .btn {
        padding: 0.25rem 0.5rem;
        font-size: 0.875rem;
      }

      .table td {
        vertical-align: middle;
      }

      .alert {
        border-left: 4px solid #ffc107;
      }
    `,
  ],
})
export class ConvidadosComponent implements OnInit {
  convidados: Convidado[] = [];
  convidadosFiltrados: Convidado[] = [];
  estatisticas: EstatisticasConvidados = {
    total: 0,
    confirmados: 0,
    pendentes: 0,
    totalPessoas: 0,
    totalConfirmados: 0,
    convitesEnviados: 0,
  };
  termoBusca: string = '';
  mostraFormulario: boolean = false;
  convidadoAtual: Convidado | null = null;
  convidadoForm: FormGroup;
  submitted: boolean = false;
  enviandoConvite: string | null = null;
  enviandoTodosConvites: boolean = false;
  emailjsConfigurado: boolean = false;

  constructor(
    private convidadosService: ConvidadosService,
    private emailjsService: EmailjsService,
    private fb: FormBuilder
  ) {
    this.convidadoForm = this.criarFormulario();
  }

  ngOnInit(): void {
    this.carregarConvidados();
    this.carregarEstatisticas();
    this.verificarConfiguracaoEmailJS();

    // Observa mudanças no termo de busca
    this.observarTermoBusca();
  }

  verificarConfiguracaoEmailJS(): void {
    this.emailjsConfigurado = this.emailjsService.isConfigured();
  }

  get cf() {
    return this.convidadoForm.controls;
  }

  get acompanhantesArray(): FormArray {
    return this.convidadoForm.get('acompanhantes') as FormArray;
  }

  async carregarConvidados(): Promise<void> {
    try {
      this.convidados = await this.convidadosService.getConvidados();
      this.filtrarConvidados();
    } catch (error) {
      console.error('Erro ao carregar convidados:', error);
    }
  }

  async carregarEstatisticas(): Promise<void> {
    try {
      this.estatisticas = await this.convidadosService.getEstatisticas();
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  }

  observarTermoBusca(): void {
    // Em um cenário real, usaríamos debounce com RxJS
    setInterval(() => this.filtrarConvidados(), 60000);
  }

  filtrarConvidados(): void {
    if (!this.termoBusca) {
      this.convidadosFiltrados = [...this.convidados];
      return;
    }

    const termo = this.termoBusca.toLowerCase();
    this.convidadosFiltrados = this.convidados.filter(
      (convidado) =>
        convidado.nome.toLowerCase().includes(termo) ||
        convidado.email.toLowerCase().includes(termo) ||
        convidado.telefone?.toLowerCase().includes(termo) ||
        convidado.observacoes?.toLowerCase().includes(termo)
    );
  }

  criarFormulario(): FormGroup {
    return this.fb.group({
      id: [''],
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],
      confirmado: [false],
      conviteEnviado: [false],
      enviarConviteAoSalvar: [false],
      observacoes: [''],
      acompanhantes: this.fb.array([]),
    });
  }

  criarAcompanhanteFormGroup(acompanhante?: Acompanhante): FormGroup {
    return this.fb.group({
      id: [acompanhante?.id || ''],
      nome: [acompanhante?.nome || '', Validators.required],
      confirmado: [acompanhante?.confirmado || false],
    });
  }

  adicionarAcompanhante(): void {
    this.acompanhantesArray.push(this.criarAcompanhanteFormGroup());
  }

  removerAcompanhante(index: number): void {
    this.acompanhantesArray.removeAt(index);
  }

  abrirFormulario(): void {
    this.convidadoAtual = null;
    this.convidadoForm = this.criarFormulario();
    this.submitted = false;
    this.mostraFormulario = true;
  }

  editarConvidado(convidado: Convidado): void {
    this.convidadoAtual = convidado;

    // Limpar acompanhantes atuais
    while (this.acompanhantesArray.length) {
      this.acompanhantesArray.removeAt(0);
    }

    // Adicionar acompanhantes do convidado
    convidado.acompanhantes.forEach((acompanhante) => {
      this.acompanhantesArray.push(
        this.criarAcompanhanteFormGroup(acompanhante)
      );
    });

    this.convidadoForm.patchValue({
      id: convidado.id,
      nome: convidado.nome,
      email: convidado.email,
      telefone: convidado.telefone,
      confirmado: convidado.confirmado,
      conviteEnviado: convidado.conviteEnviado,
      enviarConviteAoSalvar: false,
      observacoes: convidado.observacoes,
    });

    this.submitted = false;
    this.mostraFormulario = true;
  }

  cancelarEdicao(): void {
    this.mostraFormulario = false;
    this.convidadoAtual = null;
    this.submitted = false;
  }

  async salvarConvidado(): Promise<void> {
    this.submitted = true;

    if (this.convidadoForm.invalid) {
      return;
    }

    const convidadoData = this.convidadoForm.value as Convidado;
    const enviarConvite = this.convidadoForm.get(
      'enviarConviteAoSalvar'
    )?.value;

    try {
      let convidadoSalvo: Convidado;

      if (convidadoData.id) {
        // Atualizar convidado existente
        convidadoSalvo = await this.convidadosService.atualizarConvidado(
          convidadoData
        );
      } else {
        // Adicionar novo convidado
        convidadoSalvo = await this.convidadosService.adicionarConvidado(
          convidadoData
        );
      }

      // Enviar convite se solicitado
      if (
        enviarConvite &&
        this.emailjsConfigurado &&
        !convidadoSalvo.conviteEnviado
      ) {
        await this.enviarConviteEmail(convidadoSalvo);
      }

      this.mostraFormulario = false;
      this.convidadoAtual = null;
      this.submitted = false;
      await this.carregarConvidados();
      await this.carregarEstatisticas();
    } catch (error) {
      console.error('Erro ao salvar convidado:', error);
      alert('Erro ao salvar convidado. Tente novamente.');
    }
  }

  async alternarConfirmacao(convidado: Convidado, event: Event): Promise<void> {
    const confirmado = (event.target as HTMLInputElement).checked;
    try {
      await this.convidadosService.confirmarPresenca(convidado.id!, confirmado);
      await this.carregarEstatisticas();
    } catch (error) {
      console.error('Erro ao confirmar presença:', error);
    }
  }

  async enviarConvite(convidado: Convidado): Promise<void> {
    if (convidado.conviteEnviado || !this.emailjsConfigurado) {
      return;
    }

    this.enviandoConvite = convidado.id!;

    try {
      await this.enviarConviteEmail(convidado);
      await this.carregarConvidados();
      await this.carregarEstatisticas();
    } catch (error) {
      console.error('Erro ao enviar convite:', error);
      alert('Erro ao enviar convite. Verifique a configuração do EmailJS.');
    } finally {
      this.enviandoConvite = null;
    }
  }

  async enviarTodosConvites(): Promise<void> {
    if (!this.emailjsConfigurado) {
      alert('Configure o EmailJS primeiro para enviar convites.');
      return;
    }

    const convidadosPendentes = this.convidados.filter(
      (c) => !c.conviteEnviado
    );

    if (convidadosPendentes.length === 0) {
      alert('Todos os convites já foram enviados!');
      return;
    }

    if (
      !confirm(
        `Deseja enviar convites para ${convidadosPendentes.length} convidados?`
      )
    ) {
      return;
    }

    this.enviandoTodosConvites = true;

    try {
      for (const convidado of convidadosPendentes) {
        await this.enviarConviteEmail(convidado);
        // Pequeno delay entre envios para não sobrecarregar o EmailJS
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      await this.carregarConvidados();
      await this.carregarEstatisticas();
      alert('Todos os convites foram enviados com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar convites em lote:', error);
      alert(
        'Erro ao enviar alguns convites. Verifique o console para mais detalhes.'
      );
    } finally {
      this.enviandoTodosConvites = false;
    }
  }

  private async enviarConviteEmail(convidado: Convidado): Promise<void> {
    const dadosConvite: ConviteEmailData = {
      to_name: convidado.nome,
      to_email: convidado.email,
      wedding_date: '19 de Novembro de 2024',
      wedding_location: 'Local da Cerimônia - Endereço Completo',
      confirmation_link: `${window.location.origin}/confirmacao?id=${convidado.id}`,
      couple_names: 'Kauã & Kimily',
    };

    await this.emailjsService.enviarConviteCasamento(dadosConvite);
    await this.convidadosService.marcarConviteEnviado(convidado.id!);
  }

  async excluirConvidado(convidado: Convidado): Promise<void> {
    if (
      confirm(`Tem certeza que deseja excluir o convidado "${convidado.nome}"?`)
    ) {
      try {
        await this.convidadosService.excluirConvidado(convidado.id!);
        await this.carregarConvidados();
        await this.carregarEstatisticas();
      } catch (error) {
        console.error('Erro ao excluir convidado:', error);
      }
    }
  }

  contarAcompanhantesConfirmados(convidado: Convidado): number {
    return convidado.acompanhantes.filter((a) => a.confirmado).length;
  }
}
