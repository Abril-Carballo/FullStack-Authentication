import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify-email',
  imports: [RouterLink],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmailPage {
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);

  loading = signal(true);
  success = signal(false);
  message = signal('Verificando email...');

  constructor() {
    this.verify();
  }

  private async verify(): Promise<void> {
    const token = this.route.snapshot.queryParamMap.get('token'); // App plantas: lee el token de la URL

    if (!token) {
      this.success.set(false);
      this.message.set('Token inválido o faltante');
      this.loading.set(false);
      return;
    }

    try {
      const res = await firstValueFrom(this.auth.verifyEmail(token)); // App plantas: llama al backend para verificar el email
      this.success.set(true);
      this.message.set(res.message || 'Email verificado correctamente');
    } catch (err: any) {
      this.success.set(false);
      this.message.set(err.error?.message || 'Token inválido o expirado');
    } finally {
      this.loading.set(false);
    }
  }
}