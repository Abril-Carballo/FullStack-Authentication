import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-profile',
  imports: [DatePipe, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfilePage {
  auth = inject(AuthService);
  users = inject(UsersService);
  toast = inject(ToastService);

  // 1.6 Formulario cambiar contraseña
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  // Formulario cambiar email
  newEmail = '';
  emailPassword = '';

  // 1.6 Cambia la contraseña del usuario autenticado
  changePassword(): void {
    // Validar que la nueva contraseña y la confirmación coincidan
    if (this.newPassword !== this.confirmPassword) {
      this.toast.error('Las contraseñas no coinciden');
      return;
    }
    // Validar longitud mínima
    if (this.newPassword.length < 8) {
      this.toast.error('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }

    this.users.updatePassword(this.currentPassword, this.newPassword).subscribe({
      next: () => {
        this.toast.success('Contraseña actualizada correctamente');
        // Limpiar campos del formulario
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: () => {
        this.toast.error('Error al cambiar la contraseña. Verificá que la contraseña actual sea correcta');
      },
    });
  }

  // 1.6 Cambia el email del usuario autenticado
  changeEmail(): void {
    this.users.updateEmail(this.newEmail, this.emailPassword).subscribe({
      next: () => {
        this.toast.success('Email actualizado correctamente');
        // 1.6 Recargar los datos del usuario para reflejar el nuevo email
        this.auth.me().subscribe();
        // 1.6 Limpiar campos del formulario
        this.newEmail = '';
        this.emailPassword = '';
      },
      error: () => {
        this.toast.error('Error al cambiar el email. Verificá que la contraseña sea correcta');
      },
    });
  }
}