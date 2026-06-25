import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private router = inject(Router);

  password = '';
  message = '';
  error = '';
  loading = signal(false);

  onSubmit() {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.error = 'Token inválido';
      return;
    }

    this.loading.set(true);
    this.error = '';
    this.message = '';

    this.auth.resetPassword(token, this.password).subscribe({
      next: (res) => {
        this.message = res.message;
        this.loading.set(false);

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (e) => {
        this.error = e.error?.message || 'Error al cambiar contraseña';
        this.loading.set(false);
      },
    });
  }
}