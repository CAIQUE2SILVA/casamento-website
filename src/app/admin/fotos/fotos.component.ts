import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FotosService, Foto } from '../../services/fotos.service';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-fotos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Gerenciar Fotos</h1>
        <div>
          <a
            routerLink="/admin/dashboard"
            class="btn btn-outline-secondary me-2"
          >
            <i class="fas fa-arrow-left me-2"></i>Voltar
          </a>
        </div>
      </div>

      <!-- Área de upload -->
      <div class="card mb-4">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0">
            <i class="fas fa-upload me-2"></i>Adicionar Nova Foto
          </h5>
        </div>
        <div class="card-body">
          <form [formGroup]="fotoForm" (ngSubmit)="onSubmit()">
            <div class="row">
              <div class="col-md-6">
                <!-- Área de arrastar e soltar -->
                <div
                  class="drop-zone mb-3"
                  [class.active]="isDragOver"
                  [class.has-file]="!!selectedFile"
                  (dragover)="onDragOver($event)"
                  (dragleave)="onDragLeave($event)"
                  (drop)="onDrop($event)"
                  (click)="fileInput.click()"
                >
                  <input
                    type="file"
                    #fileInput
                    class="d-none"
                    accept="image/*"
                    (change)="onFileSelected($event)"
                  />
                  <div *ngIf="!selectedFile" class="drop-content">
                    <i class="fas fa-cloud-upload-alt fa-3x mb-2"></i>
                    <p class="mb-0">
                      Arraste e solte uma imagem aqui ou clique para selecionar
                    </p>
                  </div>
                  <div
                    *ngIf="selectedFile && previewUrl"
                    class="preview-container"
                  >
                    <img [src]="previewUrl" alt="Preview" class="img-preview" />
                    <div class="overlay">
                      <span class="file-name">{{ selectedFile.name }}</span>
                      <button
                        type="button"
                        class="btn btn-sm btn-danger"
                        (click)="removeFile($event)"
                      >
                        <i class="fas fa-times"></i> Remover
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="titulo" class="form-label">Título*</label>
                  <input
                    type="text"
                    class="form-control"
                    id="titulo"
                    formControlName="titulo"
                  />
                  <div
                    *ngIf="
                      fotoForm.get('titulo')?.invalid &&
                      fotoForm.get('titulo')?.touched
                    "
                    class="text-danger"
                  >
                    Título é obrigatório
                  </div>
                </div>
                <div class="mb-3">
                  <label for="descricao" class="form-label">Descrição</label>
                  <textarea
                    class="form-control"
                    id="descricao"
                    rows="3"
                    formControlName="descricao"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  class="btn btn-primary"
                  [disabled]="fotoForm.invalid || !selectedFile || isUploading"
                >
                  <span *ngIf="!isUploading">
                    <i class="fas fa-save me-2"></i>Salvar Foto
                  </span>
                  <span *ngIf="isUploading">
                    <i class="fas fa-spinner fa-spin me-2"></i>Enviando...
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Lista de fotos -->
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0">
            <i class="fas fa-images me-2"></i>Galeria de Fotos
          </h5>
        </div>
        <div class="card-body">
          <div *ngIf="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Carregando...</span>
            </div>
          </div>

          <div *ngIf="!loading && fotos.length === 0" class="text-center py-5">
            <i class="fas fa-image fa-3x text-muted mb-3"></i>
            <p>Nenhuma foto encontrada. Adicione sua primeira foto acima.</p>
          </div>

          <div
            *ngIf="!loading && fotos.length > 0"
            class="row row-cols-1 row-cols-md-3 g-4"
          >
            <div *ngFor="let foto of fotos" class="col">
              <div class="card h-100 foto-card">
                <div class="foto-container">
                  <img
                    [src]="foto.url"
                    class="card-img-top"
                    [alt]="foto.titulo"
                  />
                  <div class="foto-overlay">
                    <button
                      class="btn btn-sm btn-danger"
                      (click)="deleteFoto(foto)"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
                <div class="card-body">
                  <h5 class="card-title">{{ foto.titulo }}</h5>
                  <p class="card-text text-muted small">{{ foto.data }}</p>
                  <p class="card-text" *ngIf="foto.descricao">
                    {{ foto.descricao }}
                  </p>
                </div>
              </div>
            </div>
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

      .drop-zone {
        border: 2px dashed #ccc;
        border-radius: 5px;
        padding: 20px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
        height: 220px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
      }

      .drop-zone.active {
        border-color: #2e86c1;
        background-color: rgba(46, 134, 193, 0.05);
      }

      .drop-zone.has-file {
        border-style: solid;
        border-color: #2e86c1;
      }

      .preview-container {
        width: 100%;
        height: 100%;
        position: relative;
      }

      .img-preview {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }

      .overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .file-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 70%;
      }

      .foto-container {
        position: relative;
        height: 200px;
        overflow: hidden;
      }

      .foto-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .foto-overlay {
        position: absolute;
        top: 0;
        right: 0;
        padding: 10px;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .foto-card:hover .foto-overlay {
        opacity: 1;
      }
    `,
  ],
})
export class FotosComponent implements OnInit {
  fotoForm: FormGroup;
  fotos: Foto[] = [];
  loading = true;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isUploading = false;
  isDragOver = false;

  constructor(private fb: FormBuilder, private fotosService: FotosService) {
    this.fotoForm = this.fb.group({
      titulo: ['', Validators.required],
      descricao: [''],
    });
  }

  ngOnInit() {
    this.loadFotos();
  }

  async loadFotos() {
    this.loading = true;
    try {
      this.fotos = await this.fotosService.getFotos();
    } catch (error) {
      console.error('Erro ao carregar fotos:', error);
    } finally {
      this.loading = false;
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (this.validateFile(file)) {
        this.selectedFile = file;
        this.createPreview();
      }
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (this.validateFile(file)) {
        this.selectedFile = file;
        this.createPreview();
      }
    }
  }

  validateFile(file: File): boolean {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      alert('O tamanho máximo permitido é 5MB.');
      return false;
    }
    return true;
  }

  createPreview() {
    if (!this.selectedFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  removeFile(event: Event) {
    event.stopPropagation();
    this.selectedFile = null;
    this.previewUrl = null;
  }

  async onSubmit() {
    if (this.fotoForm.invalid || !this.selectedFile) return;

    this.isUploading = true;
    try {
      await this.fotosService.uploadFoto(
        this.selectedFile,
        this.fotoForm.get('titulo')?.value,
        this.fotoForm.get('descricao')?.value
      );

      this.fotoForm.reset();
      this.selectedFile = null;
      this.previewUrl = null;
      await this.loadFotos();
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
    } finally {
      this.isUploading = false;
    }
  }

  async deleteFoto(foto: Foto) {
    if (confirm(`Tem certeza que deseja excluir a foto "${foto.titulo}"?`)) {
      try {
        await this.fotosService.deleteFoto(foto);
        await this.loadFotos();
      } catch (error) {
        console.error('Erro ao excluir foto:', error);
      }
    }
  }
}
