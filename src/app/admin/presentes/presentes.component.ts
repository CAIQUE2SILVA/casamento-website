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
  templateUrl: './presentes.component.html',
  styleUrls: ['./presentes.component.scss'],
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
