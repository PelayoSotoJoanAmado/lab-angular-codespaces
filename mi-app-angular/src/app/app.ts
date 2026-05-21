import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto } from './models/producto';
import { ProductoService } from './services/producto.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {

  titulo = 'Gestión de Productos';

  productos: Producto[] = [];

  producto: Producto = {
    nombre: '',
    precio: 0,
    stock: 0
  };

  modoEdicion = false;

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.listarProductos();
  }

  listarProductos(): void {
    this.productoService.listarProductos().subscribe({
      next: (data) => {
        this.productos = data;
        // this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al listar productos:', error);
      }
    });
  }

  guardarProducto(): void {
    if (this.producto.nombre.trim() === '') {
      alert('Debe ingresar el nombre del producto');
      return;
    }

    if (this.producto.precio <= 0) {
      alert('El precio debe ser mayor que cero');
      return;
    }

    if (this.producto.stock < 0) {
      alert('El stock no puede ser negativo');
      return;
    }

    if (this.modoEdicion) {
      this.productoService.actualizarProducto(this.producto).subscribe({
        next: () => {
          alert('Producto actualizado correctamente');
          this.listarProductos();
this.limpiarFormulario();
        },
        error: (error) => {
          console.error('Error al actualizar producto:', error);
        }
      });
    } else {
      this.productoService.registrarProducto(this.producto).subscribe({
        next: () => {
          alert('Producto registrado correctamente');
          this.listarProductos();
          this.limpiarFormulario();
        },
        error: (error) => {
          console.error('Error al registrar producto:', error);
        }
      });
    }
  }

  editarProducto(productoSeleccionado: Producto): void {
    this.producto = { ...productoSeleccionado };
    this.modoEdicion = true;
  }

  eliminarProducto(id: number | undefined): void {
    if (id === undefined) {
      return;
    }

    const confirmar = confirm('¿Está seguro de eliminar este producto?');

    if (confirmar) {
      this.productoService.eliminarProducto(id).subscribe({
        next: () => {
          alert('Producto eliminado correctamente');
          this.listarProductos();
        },
        error: (error) => {
          console.error('Error al eliminar producto:', error);
        }
      });
    }
  }

  limpiarFormulario(): void {
    this.producto = {
      nombre: '',
      precio: 0,
      stock: 0
    };

    this.modoEdicion = false;
  }
}
