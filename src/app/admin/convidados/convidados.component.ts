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
import { ConviteService } from '../../services/convite.service';
import { Convidado, Acompanhante } from '../../models/convidado.model';

@Component({
  selector: 'app-convidados',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './convidados.component.html',
  styleUrls: ['./convidados.component.scss'],
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
    private fb: FormBuilder,
    private conviteService: ConviteService
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
      convite_enviado: [false],
      enviarConviteAoSalvar: [false],
      observacoes: [''],
      acompanhante: [false],
      nome_acompanhante: [''],
    });
  }

  abrirFormulario(): void {
    this.convidadoAtual = null;
    this.convidadoForm = this.criarFormulario();
    this.submitted = false;
    this.mostraFormulario = true;
  }

  editarConvidado(convidado: Convidado): void {
    this.convidadoAtual = convidado;

    this.convidadoForm.patchValue({
      id: convidado.id,
      nome: convidado.nome,
      email: convidado.email,
      telefone: convidado.telefone,
      confirmado: convidado.confirmado,
      convite_enviado: convidado.convite_enviado,
      enviarConviteAoSalvar: false,
      observacoes: convidado.observacoes,
      acompanhante: convidado.acompanhante || false,
      nome_acompanhante: convidado.nome_acompanhante || '',
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
        !convidadoSalvo.convite_enviado
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
    if (convidado.convite_enviado || !this.emailjsConfigurado) {
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
      (c) => !c.convite_enviado
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
      wedding_date: '15 de Novembro de 2025',
      wedding_location:
        'Praça Comandante eduardo de Oliveira 96 Parque Edu Chaves',
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

  async enviarWhatsApp(convidado: Convidado): Promise<void> {
        // const token = this.conviteService.gerarTokenConvite();
    // Salvar o token no convidado se necessário
    // convidado.token = token;
    // await this.convidadosService.atualizarConvidado(convidado.id!, convidado);

    this.conviteService.abrirWhatsApp(
      convidado.telefone,
      convidado.nome,
    );
  }

  async copiarTextoInstagram(convidado: Convidado): Promise<void> {
    // const token = this.conviteService.gerarTokenConvite();
    const texto = this.conviteService.gerarTextoInstagram(
      convidado.nome,
    );

    const sucesso = await this.conviteService.copiarTexto(texto);
    if (sucesso) {
      alert('Texto do convite copiado! Cole no Instagram do convidado.');
    } else {
      // Fallback: mostrar o texto para copiar manualmente
      prompt('Copie o texto abaixo e envie via Instagram:', texto);
    }
  }

  async copiarLinkConvite(convidado: Convidado): Promise<void> {
    // const token = this.conviteService.gerarTokenConvite();
    const url = this.conviteService.gerarUrlConvite();

    const sucesso = await this.conviteService.copiarTexto(url);
    if (sucesso) {
      alert('Link do convite copiado! Você pode compartilhar onde quiser.');
    } else {
      // Fallback: mostrar o link para copiar manualmente
      prompt('Copie o link abaixo:', url);
    }
  }

  gerarConviteGenerico(): void {
    // const token = this.conviteService.gerarTokenConvite();
    const url = this.conviteService.gerarUrlConvite();
    const textoWhatsApp = this.conviteService.gerarTextoInstagram('');

    const modal = `
      <div style="max-width: 500px; margin: 20px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; background: white;">
        <h3 style="margin-bottom: 20px; color: #3498db;">🎉 Convite Gerado!</h3>

        <div style="margin-bottom: 15px;">
          <strong>Link do Convite:</strong><br>
          <input type="text" value="${url}" style="width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #ddd; border-radius: 4px;" readonly>
          <button onclick="navigator.clipboard.writeText('${url}').then(() => alert('Link copiado!'))" style="padding: 5px 10px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">Copiar Link</button>
        </div>

        <div style="margin-bottom: 15px;">
          <strong>Ações:</strong><br>
          <button onclick="window.open('${this.conviteService.gerarLinkWhatsApp(
            '',
            '',

          )}', '_blank')" style="padding: 8px 16px; margin: 5px; background: #25d366; color: white; border: none; border-radius: 4px; cursor: pointer;">
            📱 Enviar via WhatsApp
          </button>
          <button onclick="navigator.clipboard.writeText(\`${textoWhatsApp.replace(
            /`/g,
            '\\`'
          )}\`).then(() => alert('Texto copiado para Instagram!'))" style="padding: 8px 16px; margin: 5px; background: #e4405f; color: white; border: none; border-radius: 4px; cursor: pointer;">
            📷 Copiar para Instagram
          </button>
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <button onclick="this.parentElement.parentElement.remove()" style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Fechar</button>
        </div>
      </div>
    `;

    // Criar overlay
    const overlay = document.createElement('div');
    overlay.style.cssText =
      'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;';
    overlay.innerHTML = modal;

    // Fechar ao clicar no overlay
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    });

    document.body.appendChild(overlay);
  }
}
