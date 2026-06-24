import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify-pending',
  imports: [RouterLink],
  templateUrl: './verify-pending.html',
  styleUrl: './verify-pending.css',
})
export class VerifyPendingPage {
  private auth = inject(AuthService);

  message = signal('');
  error = signal('');
  loading = signal(false);

  async resendEmail(): Promise<void> {
    this.message.set('');
    this.error.set('');
    this.loading.set(true);

    try {
      const res = await firstValueFrom(this.auth.resendVerification()); // App plantas: pide al backend reenviar el email de verificación
      this.message.set(res.message || 'Email reenviado');
    } catch (err: any) {
      this.error.set(err.error?.message || 'Error al reenviar email');
    } finally {
      this.loading.set(false);
    }
  }
}