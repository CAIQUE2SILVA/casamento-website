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
  templateUrl: './fotos.component.html',
  styleUrls: ['./fotos.component.scss'],
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
