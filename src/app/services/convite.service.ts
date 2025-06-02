import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConviteService {
  private baseUrl = window.location.origin;

  constructor() {}

  /**
   * Gera um  único para o convite
   */
  gerarConvite(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  /**
   * Gera URL do convite
   */
  gerarUrlConvite(): string {
    // if () {
    //   return `${this.baseUrl}/convite/`;
    // }
    return `${this.baseUrl}/convite`;
  }

  /**
   * Gera mensagem para WhatsApp
   */
  gerarMensagemWhatsApp(nomeConvidado?: string, ): string {
    const url = this.gerarUrlConvite();
    const nomeFormatado = nomeConvidado ? ` ${nomeConvidado}` : '';

    const mensagem = `💍 *Convite de Casamento* 💍

Olá${nomeFormatado}!

Kauã & Kimily têm a honra de convidá-lo(a) para celebrar o dia mais especial de suas vidas! 💕

📅 *Data:* 15 de Novembro de 2025
🕐 *Horário:* 19:00
📍 *Local:* Praça Comandante Eduardo de Oliveira 96 Parque Edu Chaves

Para confirmar sua presença, acesse o link abaixo: ${url}

Com amor e carinho,
Kauã & Kimily ❤️`;

    return encodeURIComponent(mensagem);
  }

  /**
   * Gera link do WhatsApp para envio direto
   */
  gerarLinkWhatsApp(
    telefone?: string,
    nomeConvidado?: string,

  ): string {
    const mensagem = this.gerarMensagemWhatsApp(nomeConvidado);

    if (telefone) {
      // Remove caracteres especiais do telefone
      const telefoneFormatado = telefone.replace(/\D/g, '');
      return `https://wa.me/${telefoneFormatado}?text=${mensagem}`;
    }

    // Link genérico do WhatsApp (abre o app para escolher contato)
    return `https://wa.me/?text=${mensagem}`;
  }

  /**
   * Gera texto para Instagram (DM manual)
   */
  gerarTextoInstagram(nomeConvidado?: string, ): string {
    const url = this.gerarUrlConvite();
    const nomeFormatado = nomeConvidado ? ` ${nomeConvidado}` : '';

    return `💍 Convite de Casamento 💍

Olá${nomeFormatado}!

Kauã & Kimily têm a honra de convidá-lo(a) para celebrar o dia mais especial de suas vidas! 💕

📅 Data: 15 de Novembro de 2025
🕐 Horário: 19:00
📍 Local: Praça Comandante Eduardo de Oliveira 96 Parque Edu Chaves

Para confirmar sua presença, acesse: ${url}

Com amor e carinho,
Kauã & Kimily ❤️`;
  }

  /**
   * Copia texto para área de transferência
   */
  async copiarTexto(texto: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(texto);
      return true;
    } catch (error) {
      console.error('Erro ao copiar texto:', error);
      return false;
    }
  }

  /**
   * Abre WhatsApp com mensagem
   */
  abrirWhatsApp(
    telefone?: string,
    nomeConvidado?: string,
  ): void {
    const link = this.gerarLinkWhatsApp(telefone, nomeConvidado,);
    window.open(link, '_blank');
  }

  /**
   * Gera URL do Instagram (perfil dos noivos)
   */
  gerarLinkInstagram(): string {
    // Substitua pelos handles reais do Instagram dos noivos
    return 'https://instagram.com/kaua_kimily_casamento';
  }

  /**
   * Compartilha via Web Share API (se disponível)
   */
  async compartilharNativo(
    nomeConvidado?: string,
  ): Promise<boolean> {
    if (!navigator.share) {
      return false;
    }

    try {
      const url = this.gerarUrlConvite();
      const texto = this.gerarTextoInstagram(nomeConvidado);

      await navigator.share({
        title: 'Convite de Casamento - Kauã & Kimily',
        text: texto,
        url: url,
      });

      return true;
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      return false;
    }
  }
}
