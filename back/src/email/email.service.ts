import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendVerificationEmail(to: string, link: string): Promise<void> {
    await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject: 'Verificá tu email',
      html: `<p>Hacé click en el siguiente link para verificar tu cuenta:</p><p><a href="${link}">${link}</a></p>`,
    });
  }

  async sendResetPasswordEmail(to: string, link: string): Promise<void> {
    await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject: 'Recuperá tu contraseña',
      html: `<p>Hacé click en el siguiente link para restablecer tu contraseña:</p><p><a href="${link}">${link}</a></p>`,
    });
  }
}