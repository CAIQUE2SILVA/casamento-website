import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

export interface ConviteEmailData {
  to_name: string;
  to_email: string;
  wedding_date: string;
  wedding_location: string;
  confirmation_link: string;
  couple_names: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmailjsService {
  // Configurações do EmailJS - substitua pelos seus valores
  private readonly PUBLIC_KEY = 'QYmCzXNdxafTeJz9k'; // Sua chave pública do EmailJS
  private readonly SERVICE_ID = 'service_5zzfkac'; // ID do seu serviço de email
  private readonly TEMPLATE_ID = 'template_sezf8rp'; // ID do template de convite

  constructor() {
    // Inicializar EmailJS com sua chave pública
    emailjs.init(this.PUBLIC_KEY);
  }

  /**
   * Envia convite de casamento por email
   */
  async enviarConviteCasamento(
    dadosConvite: ConviteEmailData
  ): Promise<boolean> {
    try {
      const templateParams = {
        to_name: dadosConvite.to_name,
        to_email: dadosConvite.to_email,
        wedding_date: dadosConvite.wedding_date,
        wedding_location: dadosConvite.wedding_location,
        confirmation_link: dadosConvite.confirmation_link,
        couple_names: dadosConvite.couple_names,
        // Dados adicionais para o template
        current_year: new Date().getFullYear(),
        sender_name: 'Kauã & Kimily',
      };

      const response = await emailjs.send(
        this.SERVICE_ID,
        this.TEMPLATE_ID,
        templateParams
      );

      console.log('Email enviado com sucesso:', response);
      return true;
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      throw new Error('Falha ao enviar convite por email');
    }
  }

  /**
   * Envia lembrete de confirmação
   */
  async enviarLembreteConfirmacao(
    dadosConvite: ConviteEmailData
  ): Promise<boolean> {
    try {
      const templateParams = {
        ...dadosConvite,
        subject: 'Lembrete: Confirme sua presença no nosso casamento',
        message_type: 'lembrete',
      };

      const response = await emailjs.send(
        this.SERVICE_ID,
        'template_lembrete', // Template específico para lembretes
        templateParams
      );

      console.log('Lembrete enviado com sucesso:', response);
      return true;
    } catch (error) {
      console.error('Erro ao enviar lembrete:', error);
      throw new Error('Falha ao enviar lembrete');
    }
  }

  /**
   * Valida se as configurações do EmailJS estão corretas
   */
  isConfigured(): boolean {
    return (
      this.PUBLIC_KEY !== 'QYmCzXNdxafTeJz9k' &&
      this.SERVICE_ID !== 'service_5zzfkac' &&
      this.TEMPLATE_ID !== 'template_sezf8rp'
    );
  }
}
