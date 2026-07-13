import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ProveedorService, Proveedor } from '../../services/proveedor.services';
import { LogoutButton } from '../../shared/logout-button/logout-button';
import { SidebarFooterComponent } from '../../shared/sidebar-footer/sidebar-footer';

interface ItemCatalogoTransaccional {
  codigoBarra: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  precioCompra: number;
  precioVenta: number;
  stockMinimo: number;
  imagen: string;
  cantidad: number;
}

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    HttpClientModule,
    MatDividerModule,
    MatListModule, 
    RouterModule,
    MatToolbarModule,
    LogoutButton,
    SidebarFooterComponent
  ],
  templateUrl: './proveedores.html',
  styleUrls: ['./proveedores.css']
})
export class ProveedoresComponent implements OnInit {
  proveedores: Proveedor[] = [];
  nombreUsuario: string = 'Cargando...';
  nombreEmpresa: string = 'Cargando...';

  idProveedorExpandido: string | null = null;
  itemsParaCompra: ItemCatalogoTransaccional[] = [];

  private baseDeDatosProductosProveedores: { [key: string]: Omit<ItemCatalogoTransaccional, 'cantidad'>[] } = {
    'gloria': [
      { codigoBarra: '7750000000011', nombre: 'Leche Gloria 1L', descripcion: 'Leche evaporada entera', categoria: 'Lácteos', precioCompra: 3.2, precioVenta: 4.5, stockMinimo: 30, imagen: 'leche_gloria_1l.jpg' },
      { codigoBarra: '7750000000022', nombre: 'Yogurt Gloria 1Kg', descripcion: 'Yogurt sabor fresa de un kilo', categoria: 'Lácteos', precioCompra: 5.8, precioVenta: 7.9, stockMinimo: 15, imagen: 'yogurt_gloria_1k.jpg' }
    ],
    'coca cola': [
      { codigoBarra: '7750000000033', nombre: 'Coca Cola Original 3L', descripcion: 'Gaseosa sabor original familiar', categoria: 'Bebidas', precioCompra: 9.0, precioVenta: 12.5, stockMinimo: 40, imagen: 'cocacola_3l.jpg' },
      { codigoBarra: '7750000000044', nombre: 'Agua San Luis 1L', descripcion: 'Agua de mesa sin gas', categoria: 'Bebidas', precioCompra: 1.5, precioVenta: 2.5, stockMinimo: 50, imagen: 'san_luis_1l.jpg' }
    ],
    'nestle': [
      { codigoBarra: '7750000000055', nombre: 'Chocolate KitKat', descripcion: 'Oblea cubierta de chocolate con leche', categoria: 'Abarrotes', precioCompra: 2.2, precioVenta: 3.5, stockMinimo: 20, imagen: 'kitkat.jpg' }
    ],
    'default': [
      { codigoBarra: '7750000000999', nombre: 'Insumo General S.A.', descripcion: 'Mercadería genérica de distribución', categoria: 'Limpieza', precioCompra: 10.0, precioVenta: 15.0, stockMinimo: 10, imagen: 'generico.jpg' }
    ]
  };

  constructor(private proveedorService: ProveedorService) {}

  ngOnInit(): void {
    this.cargarDatosSesion();
    this.cargarListaProveedores();
  }

  cargarDatosSesion(): void {
    // Solo ejecutamos si estamos en el navegador
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const payloadBase64 = token.split('.')[1];
          const payloadDecodificado = JSON.parse(atob(payloadBase64));
          
          this.nombreUsuario = payloadDecodificado.nombre || 'Administrador';
          this.nombreEmpresa = payloadDecodificado.empresa || 'Empresa S.A.';
        } catch (error) {
          console.error('🔴 Error decodificando el token de sesión:', error);
          this.nombreUsuario = 'Usuario';
          this.nombreEmpresa = 'Empresa Desconocida';
        }
      }
    }
  }

  cargarListaProveedores(): void {
    // Evitamos hacer la petición HTTP desde el servidor SSR sin token
    if (typeof window !== 'undefined') {
      this.proveedorService.getProveedores().subscribe({
        next: (data) => {
          this.proveedores = data.map(prov => ({
            ...prov,
            estado: prov.estado || 'Activo'
          }));
        },
        error: (err) => {
          console.error('🔴 Error al cargar proveedores:', err);
        }
      });
    }
  }

  // ACCIÓN DE INTERRUPTOR PARA DESPLEGAR/OCULTAR LA BARRA DEBAJO DE LA TARJETA
  alternarCatalogo(proveedorId: string): void {
    if (this.idProveedorExpandido === proveedorId) {
      this.idProveedorExpandido = null;
      this.itemsParaCompra = [];
    } else {
      this.idProveedorExpandido = proveedorId;
      const provSeleccionado = this.proveedores.find(p => p._id === proveedorId);
      const nombreLimpio = provSeleccionado ? provSeleccionado.empresa.toLowerCase().trim() : 'default';
      
      const plantillaBuscada = this.baseDeDatosProductosProveedores[nombreLimpio] || this.baseDeDatosProductosProveedores['default'];
      
      // Mapeamos los elementos agregando la propiedad de control 'cantidad' inicializada en 0
      this.itemsParaCompra = plantillaBuscada.map(prod => ({ ...prod, cantidad: 0 }));
    }
  }

  aumentarCantidad(index: number): void {
    this.itemsParaCompra[index].cantidad++;
  }

  disminuirCantidad(index: number): void {
    if (this.itemsParaCompra[index].cantidad > 0) {
      this.itemsParaCompra[index].cantidad--;
    }
  }

  obtenerImporteTotal(): number {
    return this.itemsParaCompra.reduce((acumulado, item) => acumulado + (item.precioCompra * item.cantidad), 0);
  }

  obtenerEmoji(categoria: string): string {
    const diccionario: { [key: string]: string } = {
      'Lácteos': '🥛', 'Bebidas': '🥤', 'Abarrotes': '🛒', 'Carnes': '🥩',
      'Verduras': '🥦', 'Frutas': '🍎', 'Panaderia': '🍞', 'Limpieza': '🧴',
      'Higiene Personal': '🧼', 'Mascotas': '🐶'
    };
    return diccionario[categoria] || '📦';
  }

  // LÓGICA DE PROCESAMIENTO: PREPARA EL MODELO EXACTO REQUERIDO POR MONGO Y SE CONECTA AL BACKEND
  procesarPagoYRegistro(proveedor: Proveedor): void {
    const itemsSeleccionados = this.itemsParaCompra.filter(item => item.cantidad > 0);
    
    if (itemsSeleccionados.length === 0) {
      alert('Por favor, seleccione al menos un producto con cantidad mayor a 0.');
      return;
    }
    
    const productosAInsertar = itemsSeleccionados.map(item => ({
      // 1. SOLUCIÓN: Generamos un ID único en formato String para cumplir con el esquema de Mongoose
      _id: `PROD-${item.codigoBarra}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      codigoBarra: item.codigoBarra,
      nombre: item.nombre,
      descripcion: item.descripcion,
      empresaId: this.nombreEmpresa, 
      categoria: item.categoria,
      proveedor: proveedor.empresa,
      precioCompra: item.precioCompra,
      precioVenta: item.precioVenta,
      stock: item.cantidad, // Se envía como 'stock' para que coincida con el operador $inc del backend
      stockMinimo: item.stockMinimo,
      fechaVencimiento: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
      imagen: item.imagen,
      estado: true,
      fechaRegistro: new Date().toISOString()
    }));

    // 2. SOLUCIÓN: Un solo bloque de suscripción para evitar duplicidad de peticiones y conflictos de UI
    this.proveedorService.comprarYRegistrarProductos(productosAInsertar).subscribe({
      next: (respuesta) => {
        alert(`¡Operación Exitosa! Se incorporaron ${productosAInsertar.length} productos al inventario de ${this.nombreEmpresa}.`);
        this.alternarCatalogo(proveedor._id!); // Cierra el panel de forma segura y limpia el estado
      },
      error: (error) => {
        console.error('🔴 Error registrando compra en lote:', error);
        alert('Ocurrió un inconveniente al procesar la inserción de los productos en el inventario.');
      }
    });
  }

  enviarWhatsApp(proveedor: Proveedor): void {
    const textoMensaje = `Hola ${proveedor.empresa}, me comunico desde el área de logística de Nexus-Inventory.`;
    const urlDestino = `https://wa.me/51${proveedor.telefono}?text=${encodeURIComponent(textoMensaje)}`;
    window.open(urlDestino, '_blank');
  }
}