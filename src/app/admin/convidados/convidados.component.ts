import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ConvidadosService, EstatisticasConvidados } from '../../services/convidados.service';
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
          <a routerLink="/admin/dashboard" class="btn btn-outline-secondary">
            <i class="fas fa-arrow-left me-2"></i>Voltar
          </a>
        </div>
      </div>

      <!-- Cards de estatísticas -->
      <div class="row g-4 mb-4">
        <div class="col-md-4">
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
                <p class="mb-0">{{ estatisticas.total || 0 }} principais + {{ estatisticas.totalPessoas - estatisticas.total || 0 }} acompanhantes</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4">
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
                <p class="mb-0">{{ estatisticas.confirmados || 0 }} principais + {{ estatisticas.totalConfirmados - estatisticas.confirmados || 0 }} acompanhantes</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card bg-warning text-white h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="text-white-50">Presenças Pendentes</h6>
                  <h2 class="mb-0">{{ estatisticas.totalPessoas - estatisticas.totalConfirmados || 0 }}</h2>
                </div>
                <i class="fas fa-clock fa-3x text-white-50"></i>
              </div>
              <div class="mt-3">
                <p class="mb-0">{{ estatisticas.pendentes || 0 }} principais + {{ (estatisticas.totalPessoas - estatisticas.total) - (estatisticas.totalConfirmados - estatisticas.confirmados) || 0 }} acompanhantes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulário de convidado (exibido quando estiver editando) -->
      <div *ngIf="mostraFormulario" class="card mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="mb-0">{{ convidadoAtual?.id ? 'Editar' : 'Novo' }} Convidado</h5>
          <button (click)="cancelarEdicao()" class="btn btn-sm btn-outline-secondary">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="card-body">
          <form [formGroup]="convidadoForm" (ngSubmit)="salvarConvidado()">
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="nome" class="form-label">Nome Completo*</label>
                <input type="text" class="form-control" id="nome" formControlName="nome" placeholder="Nome completo do convidado">
                <div *ngIf="submitted && cf['nome'].errors" class="text-danger small mt-1">
                  <span *ngIf="cf['nome'].errors['required']">Nome é obrigatório</span>
                </div>
              </div>
              <div class="col-md-6">
                <label for="email" class="form-label">Email*</label>
                <input type="email" class="form-control" id="email" formControlName="email" placeholder="Email para enviar o convite">
                <div *ngIf="submitted && cf['email'].errors" class="text-danger small mt-1">
                  <span *ngIf="cf['email'].errors['required']">Email é obrigatório</span>
                  <span *ngIf="cf['email'].errors['email']">Email inválido</span>
                </div>
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-md-6">
                <label for="telefone" class="form-label">Telefone</label>
                <input type="tel" class="form-control" id="telefone" formControlName="telefone" placeholder="Telefone do convidado">
              </div>
              <div class="col-md-6">
                <label for="observacoes" class="form-label">Observações</label>
                <input type="text" class="form-control" id="observacoes" formControlName="observacoes" placeholder="Observações sobre o convidado">
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-md-6">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="confirmado" formControlName="confirmado">
                  <label class="form-check-label" for="confirmado">
                    Presença confirmada
                  </label>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="conviteEnviado" formControlName="conviteEnviado">
                  <label class="form-check-label" for="conviteEnviado">
                    Convite enviado
                  </label>
                </div>
              </div>
            </div>

            <h5 class="mt-4 mb-3">Acompanhantes</h5>

            <div formArrayName="acompanhantes">
              <div *ngFor="let acompanhante of acompanhantesArray.controls; let i = index" [formGroupName]="i" class="row mb-2">
                <div class="col-md-8">
                  <input type="text" class="form-control" formControlName="nome" placeholder="Nome do acompanhante">
                </div>
                <div class="col-md-3">
                  <div class="form-check mt-2">
                    <input class="form-check-input" type="checkbox" formControlName="confirmado">
                    <label class="form-check-label">
                      Confirmado
                    </label>
                  </div>
                </div>
                <div class="col-md-1">
                  <button type="button" class="btn btn-sm btn-outline-danger mt-1" (click)="removerAcompanhante(i)">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>

              <button type="button" class="btn btn-sm btn-outline-primary mt-2" (click)="adicionarAcompanhante()">
                <i class="fas fa-plus me-1"></i> Adicionar Acompanhante
              </button>
            </div>

            <div class="d-flex justify-content-end mt-4">
              <button type="button" class="btn btn-outline-secondary me-2" (click)="cancelarEdicao()">Cancelar</button>
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
              <input type="text" class="form-control form-control-sm" placeholder="Pesquisar convidados..." [(ngModel)]="termoBusca">
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
                    {{ convidado.nome }}
                    <span *ngIf="convidado.confirmado" class="badge bg-success ms-2">Confirmado</span>
                  </td>
                  <td>{{ convidado.email }}</td>
                  <td>
                    <span class="badge bg-primary">{{ convidado.acompanhantes.length }}</span>
                    <span *ngIf="convidado.acompanhantes.length > 0" class="badge bg-success ms-1">
                      {{ contarAcompanhantesConfirmados(convidado) }} confirmados
                    </span>
                  </td>
                  <td>
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" [checked]="convidado.confirmado"
                             (change)="alternarConfirmacao(convidado, $event)">
                      <label class="form-check-label">
                        {{ convidado.confirmado ? 'Confirmado' : 'Pendente' }}
                      </label>
                    </div>
                  </td>
                  <td>
                    <button
                      class="btn btn-sm"
                      [ngClass]="convidado.conviteEnviado ? 'btn-success' : 'btn-outline-primary'"
                      (click)="enviarConvite(convidado)"
                      [disabled]="enviandoConvite === convidado.id">
                      <i class="fas" [ngClass]="convidado.conviteEnviado ? 'fa-check' : 'fa-paper-plane'"></i>
                      {{ convidado.conviteEnviado ? 'Enviado' : 'Enviar' }}
                      <span *ngIf="enviandoConvite === convidado.id" class="spinner-border spinner-border-sm ms-1" role="status"></span>
                    </button>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-info me-1" (click)="editarConvidado(convidado)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" (click)="excluirConvidado(convidado)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr *ngIf="convidadosFiltrados.length === 0">
                  <td colspan="6" class="text-center py-3">
                    Nenhum convidado encontrado.
                    <button *ngIf="termoBusca" class="btn btn-sm btn-link" (click)="termoBusca = ''">Limpar busca</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .badge {
      font-weight: 500;
    }

    .bg-primary {
      background-color: #8B5CF6 !important;
    }

    .bg-primary.text-white .text-white-50 {
      color: rgba(255, 255, 255, 0.7) !important;
    }

    .btn-primary {
      background-color: #8B5CF6;
      border-color: #8B5CF6;
    }

    .btn-primary:hover, .btn-primary:focus {
      background-color: #7c4ff3;
      border-color: #7c4ff3;
    }

    .btn-outline-primary {
      color: #8B5CF6;
      border-color: #8B5CF6;
    }

    .btn-outline-primary:hover, .btn-outline-primary:focus {
      background-color: #8B5CF6;
      border-color: #8B5CF6;
    }

    .card-header .btn-sm {
      padding: 0.25rem 0.5rem;
    }
  `]
})
export class ConvidadosComponent implements OnInit {
  convidados: Convidado[] = [];
  convidadosFiltrados: Convidado[] = [];
  estatisticas: EstatisticasConvidados = {
    total: 0,
    confirmados: 0,
    pendentes: 0,
    convitesEnviados: 0,
    totalPessoas: 0,
    totalConfirmados: 0
  };

  termoBusca: string = '';
  mostraFormulario: boolean = false;
  convidadoAtual: Convidado | null = null;
  convidadoForm: FormGroup;
  submitted: boolean = false;
  enviandoConvite: string | null = null;

  constructor(
    private convidadosService: ConvidadosService,
    private fb: FormBuilder
  ) {
    this.convidadoForm = this.criarFormulario();
  }

  ngOnInit(): void {
    this.carregarConvidados();
    this.carregarEstatisticas();

    // Observa mudanças no termo de busca
    this.observarTermoBusca();
  }

  get cf() { return this.convidadoForm.controls; }

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
    setInterval(() => this.filtrarConvidados(), 300);
  }

  filtrarConvidados(): void {
    if (!this.termoBusca) {
      this.convidadosFiltrados = [...this.convidados];
      return;
    }

    const termo = this.termoBusca.toLowerCase();
    this.convidadosFiltrados = this.convidados.filter(convidado =>
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
      observacoes: [''],
      acompanhantes: this.fb.array([])
    });
  }

  criarAcompanhanteFormGroup(acompanhante?: Acompanhante): FormGroup {
    return this.fb.group({
      id: [acompanhante?.id || ''],
      nome: [acompanhante?.nome || '', Validators.required],
      confirmado: [acompanhante?.confirmado || false]
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
    convidado.acompanhantes.forEach(acompanhante => {
      this.acompanhantesArray.push(this.criarAcompanhanteFormGroup(acompanhante));
    });

    this.convidadoForm.patchValue({
      id: convidado.id,
      nome: convidado.nome,
      email: convidado.email,
      telefone: convidado.telefone,
      confirmado: convidado.confirmado,
      conviteEnviado: convidado.conviteEnviado,
      observacoes: convidado.observacoes
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
    try {
      if (convidadoData.id) {
        // Atualizar convidado existente
        await this.convidadosService.atualizarConvidado(convidadoData);
      } else {
        // Adicionar novo convidado
        await this.convidadosService.adicionarConvidado(convidadoData);
      }
      this.mostraFormulario = false;
      this.convidadoAtual = null;
      this.submitted = false;
      await this.carregarConvidados();
      await this.carregarEstatisticas();
    } catch (error) {
      console.error('Erro ao salvar convidado:', error);
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
    if (convidado.conviteEnviado) {
      return; // Convite já enviado
    }

    this.enviandoConvite = convidado.id!;

    // Simulação de envio de email
    setTimeout(async () => {
      try {
        await this.convidadosService.enviarConvite(convidado.id!);
        await this.carregarConvidados();
        await this.carregarEstatisticas();
      } catch (error) {
        console.error('Erro ao enviar convite:', error);
      } finally {
        this.enviandoConvite = null;
      }
    }, 1500);
  }

  async excluirConvidado(convidado: Convidado): Promise<void> {
    if (confirm(`Tem certeza que deseja excluir o convidado "${convidado.nome}"?`)) {
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
    return convidado.acompanhantes.filter(a => a.confirmado).length;
  }
}