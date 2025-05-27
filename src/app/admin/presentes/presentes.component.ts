import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PresentesService, Presente } from '../../services/presentes.service';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-presentes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Gerenciar Presentes</h1>
        <div>
          <a
            routerLink="/admin/dashboard"
            class="btn btn-outline-secondary me-2"
          >
            <i class="fas fa-arrow-left me-2"></i>Voltar
          </a>
        </div>
      </div>

      <!-- Formulário de Adição/Edição -->
      <div class="card mb-4">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0">
            <i class="fas fa-plus me-2"></i
            >{{ editingPresente ? 'Editar' : 'Adicionar' }} Presente
          </h5>
        </div>
        <div class="card-body">
          <form [formGroup]="presenteForm" (ngSubmit)="onSubmit()">
            <div class="row g-3">
              <div class="col-md-4">
                <label class="form-label">Nome*</label>
                <input
                  type="text"
                  class="form-control"
                  formControlName="nome"
                />
              </div>
              <div class="col-md-2">
                <label class="form-label">Preço (R$)*</label>
                <input
                  type="number"
                  class="form-control"
                  formControlName="preco"
                  step="0.01"
                />
              </div>
              <div class="col-md-4">
                <label class="form-label">URL da Imagem*</label>
                <input
                  type="text"
                  class="form-control"
                  formControlName="imagem"
                />
              </div>
              <div class="col-md-2">
                <label class="form-label">Link de Compra</label>
                <input
                  type="text"
                  class="form-control"
                  formControlName="link"
                />
              </div>
            </div>
            <div class="mt-3">
              <button
                type="submit"
                class="btn btn-primary me-2"
                [disabled]="presenteForm.invalid || isLoading"
              >
                <span *ngIf="!isLoading">
                  <i class="fas fa-save me-2"></i
                  >{{ editingPresente ? 'Atualizar' : 'Salvar' }}
                </span>
                <span *ngIf="isLoading">
                  <i class="fas fa-spinner fa-spin me-2"></i
                  >{{ editingPresente ? 'Atualizando...' : 'Salvando...' }}
                </span>
              </button>
              <button
                *ngIf="editingPresente"
                type="button"
                class="btn btn-outline-secondary"
                (click)="cancelEdit()"
              >
                <i class="fas fa-times me-2"></i>Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Lista de Presentes -->
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0">
            <i class="fas fa-gift me-2"></i>Lista de Presentes
          </h5>
        </div>
        <div class="card-body">
          <div *ngIf="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Carregando...</span>
            </div>
          </div>

          <div
            *ngIf="!loading && presentes.length === 0"
            class="text-center py-5"
          >
            <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
            <p>Nenhum presente cadastrado.</p>
          </div>

          <div
            *ngIf="!loading && presentes.length > 0"
            class="table-responsive"
          >
            <table class="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Imagem</th>
                  <th>Nome</th>
                  <th>Preço</th>
                  <th>Reservado</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  *ngFor="let presente of presentes"
                  [class.table-warning]="editingPresente?.id === presente.id"
                >
                  <td>
                    <img
                      [src]="
                        presente.imagem || 'assets/images/gift-placeholder.jpg'
                      "
                      width="60"
                      height="60"
                      style="object-fit: cover; border-radius: 4px;"
                      [alt]="presente.nome"
                    />
                  </td>
                  <td>{{ presente.nome }}</td>
                  <td>R$ {{ presente.preco | number : '1.2-2' }}</td>
                  <td>
                    <span
                      class="badge"
                      [class.bg-success]="!presente.reservado"
                      [class.bg-danger]="presente.reservado"
                    >
                      {{ presente.reservado ? 'Reservado' : 'Disponível' }}
                    </span>
                    <div
                      *ngIf="presente.reservado && presente.reservadoPor"
                      class="small text-muted"
                    >
                      por {{ presente.reservadoPor }}
                    </div>
                  </td>
                  <td>
                    <div class="btn-group" role="group">
                      <button
                        class="btn btn-sm btn-outline-primary"
                        (click)="editPresente(presente)"
                        [disabled]="isLoading"
                        title="Editar presente"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <button
                        class="btn btn-sm btn-outline-danger"
                        (click)="deletePresente(presente)"
                        [disabled]="isLoading"
                        title="Excluir presente"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
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
      .bg-primary {
        background-color: #2e86c1 !important;
      }

      .btn-primary {
        background-color: #2e86c1;
        border-color: #2e86c1;
      }

      .btn-primary:hover,
      .btn-primary:focus {
        background-color: #21629c;
        border-color: #21629c;
      }

      .table-warning {
        background-color: rgba(255, 193, 7, 0.1) !important;
      }

      .btn-group .btn {
        margin-right: 2px;
      }

      .btn-group .btn:last-child {
        margin-right: 0;
      }
    `,
  ],
})
export class PresentesComponent implements OnInit {
  presenteForm: FormGroup;
  presentes: (Presente & { imagem?: string })[] = [];
  loading = true;
  isLoading = false;
  editingPresente: Presente | null = null;

  constructor(
    private fb: FormBuilder,
    private presentesService: PresentesService
  ) {
    this.presenteForm = this.fb.group({
      nome: ['', Validators.required],
      preco: ['', [Validators.required, Validators.min(0)]],
      imagem: ['', Validators.required],
      link: [''],
    });
  }

  ngOnInit() {
    this.loadPresentes();
  }

  get nome() {
    return this.presenteForm.get('nome');
  }
  get preco() {
    return this.presenteForm.get('preco');
  }
  get imagem() {
    return this.presenteForm.get('imagem');
  }

  async loadPresentes() {
    this.loading = true;
    try {
      this.presentes = await firstValueFrom(
        this.presentesService.getPresentes()
      );
    } catch (error) {
      console.error('Erro ao carregar presentes:', error);
    } finally {
      this.loading = false;
    }
  }

  editPresente(presente: Presente) {
    this.editingPresente = presente;
    this.presenteForm.patchValue({
      nome: presente.nome,
      preco: presente.preco,
      imagem: presente.imagem,
      link: (presente as any).link || '',
    });

    // Scroll para o formulário
    document.querySelector('.card')?.scrollIntoView({ behavior: 'smooth' });
  }

  cancelEdit() {
    this.editingPresente = null;
    this.presenteForm.reset();
  }

  async onSubmit() {
    if (this.presenteForm.invalid) return;

    this.isLoading = true;

    try {
      const presenteData = {
        nome: this.nome?.value,
        preco: parseFloat(this.preco?.value),
        imagem: this.imagem?.value,
        link: this.presenteForm.get('link')?.value || '',
      };

      if (this.editingPresente) {
        // Atualizar presente existente
        await firstValueFrom(
          this.presentesService.updatePresente(
            this.editingPresente.id!,
            presenteData
          )
        );
        this.editingPresente = null;
      } else {
        // Adicionar novo presente
        await firstValueFrom(this.presentesService.addPresente(presenteData));
      }

      this.presenteForm.reset();
      this.loadPresentes();
    } catch (error) {
      console.error('Erro ao salvar presente:', error);
      alert('Erro ao salvar presente. Tente novamente.');
    } finally {
      this.isLoading = false;
    }
  }

  async deletePresente(presente: Presente) {
    if (!presente.id) return;

    if (
      confirm(`Tem certeza que deseja excluir o presente "${presente.nome}"?`)
    ) {
      try {
        await firstValueFrom(this.presentesService.deletePresente(presente.id));
        this.loadPresentes();
      } catch (error) {
        console.error('Erro ao excluir presente:', error);
        alert('Erro ao excluir presente. Tente novamente.');
      }
    }
  }
}
