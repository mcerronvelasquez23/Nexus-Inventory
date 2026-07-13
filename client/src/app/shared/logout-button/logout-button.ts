import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'logout-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './logout-button.html',
  styleUrls: ['./logout-button.css']
})
export class LogoutButton {

  // Permite personalizar el texto del botón
  @Input() label: string = 'Cerrar Sesión';
  
  // Permite elegir el tipo de botón: 'full' (con texto) o 'icon' (solo ícono)
  @Input() variant: 'full' | 'icon' = 'full';
  
  // Permite elegir el color
  @Input() color: 'warn' | 'primary' | 'accent' = 'warn';
  
  // Ruta a la que redirige tras cerrar sesión
  @Input() redirectTo: string = '/login';
  
  // Mensaje de confirmación (vacío = sin confirmación)
  @Input() confirmMessage: string = '¿Estás seguro que deseas cerrar sesión?';
  
  // Evento que se emite al hacer clic
  @Output() logout = new EventEmitter<void>();

  constructor(private router: Router) {}

  onLogout(): void {
    // Si hay mensaje de confirmación, lo muestra
    if (!this.confirmMessage || confirm(this.confirmMessage)) {
      // Limpia datos de sesión (ajusta según tu lógica)
      localStorage.clear();
      sessionStorage.clear();
      
      // Emite el evento por si el padre necesita hacer algo extra
      this.logout.emit();
      
      // Redirige
      this.router.navigate([this.redirectTo]);
    }
  }
}
