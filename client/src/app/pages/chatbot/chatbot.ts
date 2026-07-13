import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LogoutButton } from '../../shared/logout-button/logout-button';
import { ChatbotService } from '../../services/chatbot.services';
import { SidebarFooterComponent } from '../../shared/sidebar-footer/sidebar-footer';

interface Mensaje {
  texto: string;
  esBot: boolean;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    LogoutButton,
    SidebarFooterComponent
  ],
  templateUrl: './chatbot.html',
  styleUrls: ['./chatbot.css']
})
export class ChatbotComponent implements OnInit {
  @ViewChild('chatScroll') chatScrollContainer!: ElementRef;
  
  nombreEmpresa: string = 'Cargando...';
  preguntaUsuario: string = '';
  mensajes: Mensaje[] = [];
  cargandoRespuesta: boolean = false;

  constructor(private chatbotService: ChatbotService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarDatosSesion();
    this.mensajes.push({
      texto: `¡Hola! Soy Nexus-IA. He analizado la base de datos de ${this.nombreEmpresa}. ¿En qué te puedo ayudar hoy con tu inventario o ventas?`,
      esBot: true
    });
  }

  cargarDatosSesion(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          this.nombreEmpresa = payload.empresa || 'Empresa S.A.';
        } catch (error) {
          console.error('Error decodificando sesión:', error);
        }
      }
    }
  }

  enviarMensaje(): void {
    if (!this.preguntaUsuario.trim()) return;

    const textoPregunta = this.preguntaUsuario;

    // Agrega el mensaje del usuario
    this.mensajes.push({
      texto: textoPregunta,
      esBot: false
    });

    this.preguntaUsuario = '';
    this.cargandoRespuesta = true;
    this.hacerScrollAbajo();

    console.log("=== Antes del subscribe ===");

    this.chatbotService.enviarPregunta(textoPregunta).subscribe({
      next: (res) => {
        console.log("=== NEXT ===");

        this.mensajes.push({
          texto: res.respuesta,
          esBot: true
        });

        this.cargandoRespuesta = false;

        // Fuerza la actualización de la vista
        this.cdr.detectChanges();

        this.hacerScrollAbajo();
      },
      error: (err) => {
        console.log("=== ERROR ===");
        console.error(err);
        this.cargandoRespuesta = false;
      },
      complete: () => {
        // AQUÍ ESTABA EL ERROR: Se eliminó el comando de Docker pegado por accidente
        console.log("=== COMPLETE ===");
      }
    });
  }

  hacerScrollAbajo(): void {
    setTimeout(() => {
      try {
        this.chatScrollContainer.nativeElement.scrollTop = this.chatScrollContainer.nativeElement.scrollHeight;
      } catch(err) {}
    }, 100);
  }
}
