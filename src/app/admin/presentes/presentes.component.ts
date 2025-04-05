import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
          <a routerLink="/admin/dashboard" class="btn btn-outline-secondary me-2">
            <i class="fas fa-arrow-left me-2"></i>Voltar
          </a>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <p>Interface de gerenciamento de presentes em construção...</p>
        </div>
      </div>
    </div>
  `
})
export class PresentesComponent implements OnInit {
  presenteForm: FormGroup;
  presentes: Presente[] = [];
  loading = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private presentesService: PresentesService
  ) {
    this.presenteForm = this.fb.group({
      nome: ['', Validators.required],
      preco: ['', [Validators.required, Validators.min(0)]],
      imagem: ['', Validators.required],
      link: ['']
    });
  }

  ngOnInit() {
    this.loadPresentes();
  }

  get nome() { return this.presenteForm.get('nome'); }
  get preco() { return this.presenteForm.get('preco'); }
  get imagem() { return this.presenteForm.get('imagem'); }

  async loadPresentes() {
    this.loading = true;
    try {
      this.presentes = await firstValueFrom(this.presentesService.getPresentes());
    } catch (error) {
      console.error('Erro ao carregar presentes:', error);
    } finally {
      this.loading = false;
    }
  }

  async onSubmit() {
    if (this.presenteForm.invalid) return;

    this.isLoading = true;

    try {
      await firstValueFrom(this.presentesService.addPresente({
        nome: this.nome?.value,
        preco: this.preco?.value,
        imagem: this.imagem?.value,
        link: this.presenteForm.get('link')?.value || ''
      }));

      this.presenteForm.reset();
      this.loadPresentes();
    } catch (error) {
      console.error('Erro ao adicionar presente:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async deletePresente(presente: Presente) {
    if (!presente.id) return;

    if (confirm(`Tem certeza que deseja excluir o presente "${presente.nome}"?`)) {
      try {
        await firstValueFrom(this.presentesService.deletePresente(presente.id));
        this.loadPresentes();
      } catch (error) {
        console.error('Erro ao excluir presente:', error);
      }
    }
  }
}