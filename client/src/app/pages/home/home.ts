import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 🔥 Se agregó ChangeDetectorRef
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // 🔥 Se agregó RouterModule
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { HomeService } from '../../services/home.services';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports : [
    ReactiveFormsModule,
    FormsModule, 
    RouterModule, // 🔥 IMPORTANTE para que el botón Iniciar Sesión (routerLink) funcione
    HttpClientModule,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class HomeComponent implements OnInit {

  mostrarModal: boolean = false;
  pasoActual: 'pago' | 'registro' = 'pago';

  planSeleccionado: string = '';
  precioPlan: number = 0;
  metodoPago: string = '';

  datosPago = { numeroYape: '', numeroTarjeta: '', vencimiento: '', cvv: '' };
  procesandoPago: boolean = false;

  registroForm!: FormGroup;
  enProceso: boolean = false;

  constructor(
    private fb: FormBuilder,
    private homeService: HomeService,
    private router: Router,
    private cdr: ChangeDetectorRef // 🔥 Necesario para actualizar la vista luego del setTimeout
  ) {}

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      empresa: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  irAPlanes() {
    const planes = document.getElementById('planes');
    if (planes) {
      planes.scrollIntoView({ behavior: 'smooth' });
    }
  }

  seleccionarPlan(plan: string, precio: number) {
    if (this.enProceso || this.procesandoPago) return;

    this.planSeleccionado = plan;
    this.precioPlan = precio;
    this.metodoPago = '';
    
    this.datosPago = { numeroYape: '', numeroTarjeta: '', vencimiento: '', cvv: '' }; 

    this.pasoActual = 'pago';
    this.mostrarModal = true;
  }

  cerrarModal() {
    if (this.enProceso || this.procesandoPago) return;

    this.mostrarModal = false;
    this.pasoActual = 'pago';
    this.registroForm.reset();
    this.metodoPago = '';
  }

  esPagoValido(): boolean {
    if (this.metodoPago === 'YAPE') {
      return this.datosPago.numeroYape.length >= 9;
    }
    if (this.metodoPago === 'TARJETA') {
      return this.datosPago.numeroTarjeta.length >= 15 && 
             this.datosPago.vencimiento.length >= 4 && 
             this.datosPago.cvv.length >= 3;
    }
    return false;
  }

  procesarPagoSimulado() {
    if (!this.metodoPago || this.enProceso || !this.esPagoValido()) return;
    
    this.procesandoPago = true;
    
    // Retraso exacto de 5 segundos
    setTimeout(() => {
      this.procesandoPago = false;
      this.pasoActual = 'registro'; 
      this.cdr.detectChanges(); // 🔥 Esto le avisa a Angular que deje de cargar y cambie la pantalla
    }, 5000);
  }

  enviarRegistroYPago() {
    if (this.registroForm.invalid || this.enProceso) return;

    this.enProceso = true;
    const datos = this.registroForm.value;

    const payloadUsuario = {
      ...datos,
      rol: 'admin'
    };

    const subtotal = this.precioPlan / 1.18;
    const igv = this.precioPlan - subtotal;

    const payloadVenta = {
      numeroVenta: 'V-' + new Date().getFullYear() + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
      ventaEmpresa: datos.empresa,
      plan: this.planSeleccionado.toUpperCase(),
      periodo: 'MENSUAL',
      subtotal: Number(subtotal.toFixed(2)),
      igv: Number(igv.toFixed(2)),
      total: Number(this.precioPlan),
      metodoPago: this.metodoPago,
      estado: 'PAGADO'
    };

    this.homeService.registrarUsuario(payloadUsuario).subscribe({
      next: () => {
        this.homeService.registrarVenta(payloadVenta).subscribe({
          next: () => {
            this.enProceso = false;
            alert('¡Cuenta creada y pago registrado en la base de datos con éxito!');
            this.cerrarModal();
            this.router.navigate(['/login']);
          },
          error: (err) => {
            this.enProceso = false;
            alert('Usuario creado, pero falló el registro de la venta (Revisa la consola)');
            console.error(err);
          }
        });
      },
      error: (err) => {
        this.enProceso = false;
        alert(err?.error?.mensaje || 'Error al registrar usuario');
        console.error(err);
      }
    });
  }
}