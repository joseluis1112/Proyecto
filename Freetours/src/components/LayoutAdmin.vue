<template>
  <div class="background-container">
    <div class="background-image"></div> 

    <!-- Barra de navegación -->
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top shadow">
      <div class="container-fluid">
        <div class="collapse navbar-collapse justify-content-between" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link to="/inicio-admin" class="nav-link px-3">Inicio</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/gestion-usuarios" class="nav-link px-3">Gestión de Usuarios</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/crear-ruta" class="nav-link px-3">Creación de Ruta</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/gestion-rutas" class="nav-link px-3">Gestión de Rutas</router-link>
            </li>
          </ul>

          <div class="d-flex align-items-center">
            <span class="text-white me-2">{{ nombreUsuario }}</span>
            <img 
              :src="iconoSesion" 
              alt="Cerrar sesión" 
              class="logout-icon ms-3" 
              @click="emitirCerrarSesion"
            />
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenido dinámico -->
    <div class="contenido">
      <slot></slot>
    </div>

    <!-- Footer -->
    <footer class="bg-dark text-white text-center py-3 fixed-bottom">
      <p>&copy; 2024 Sistema de Rutas Turísticas - Todos los derechos reservados.</p>
    </footer>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// Definición de las propiedades que el componente recibirá desde su componente padre
let props = defineProps({
nombreUsuario: {
  type: String, // Tipo de dato esperado: String
  required: false, // No es obligatorio recibir este valor
  default: 'Administrador', // Valor por defecto si no se proporciona uno
},
iconoSesion: {
  type: String, // Tipo de dato esperado: String
  required: false, // No es obligatorio recibir este valor
  default: '/icono/icono.png', // Ruta por defecto del icono de sesión
}
});

// Definición de los eventos que el componente puede emitir
let emits = defineEmits(['cerrarSesion']); // Se define el evento 'cerrarSesion'

// Emisión del evento para cerrar sesión
let emitirCerrarSesion = () => {
// Confirmación del usuario antes de cerrar sesión
if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
  emits('cerrarSesion'); // Emisión del evento para que el componente padre maneje el cierre de sesión
}
};
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');

.background-container {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
}

.background-image {
  background: url('/img/img.jpg') no-repeat center center fixed;
  background-size: cover;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1; 
}

/* Estilos de la Navbar */
.navbar {
  background: #1a1a2e;
  padding: 2px 14px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.navbar-brand img {
  width: 45px;
  height: 45px;
}

.navbar-nav .nav-link {
  font-size: 16px;
  font-weight: bold;
  color: white !important;
  transition: all 0.3s ease-in-out;
  padding: 10px 15px;
  border-radius: 5px;
}

.navbar-nav .nav-link:hover {
  color: #ffdd57 !important;
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

/* Estilo del Icono de Cerrar Sesión */
.logout-icon {
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
}

.logout-icon:hover {
  transform: scale(1.2);
}

/* Contenedor principal */
.contenido {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 80vh;
  position: relative;
  z-index: 1;
  padding-top: 100px;
}

/* Tarjetas de contenido */
.info-card {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);
  width: 90%;
  max-width: 800px;
  text-align: center;
  color: white;
}


</style>
