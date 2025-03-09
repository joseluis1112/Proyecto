<!-- src/views/InicioAdmin.vue -->
<template>
  <LayoutAdmin 
    :nombreUsuario="nombreUsuario"
    :iconoSesion="iconoSesion"
    @cerrarSesion="cerrarSesion"
  >
    <div class="container d-flex justify-content-center align-items-center text-white contenido">
      <div class="info-card p-4">
        <h1 class="text-center fw-bold mb-4">Bienvenido al Panel de Administración</h1>
        <p class="text-center">Aquí puedes gestionar todos los aspectos del sistema de rutas turísticas.</p>

        <div class="sections">
          <div class="section">
            <h3>📌 Gestión de Usuarios</h3>
            <p>Administra los usuarios registrados en el sistema. Puedes cambiar sus roles o eliminarlos.</p>
          </div>

          <div class="section">
            <h3>🛤️ Creación de Ruta</h3>
            <p>Añade nuevas rutas turísticas con detalles como fecha, hora y ubicación en el mapa.</p>
          </div>

          <div class="section">
            <h3>📋 Gestión de Rutas</h3>
            <p>Modifica, cancela o asigna guías a las rutas existentes en el sistema.</p>
          </div>
        </div>
      </div>
    </div>
  </LayoutAdmin>
</template>

<script setup>
import { useRouter } from 'vue-router'; // Importación de Vue Router 
import LayoutAdmin from '@/components/LayoutAdmin.vue'; // Importación del layout de administrador

let router = useRouter(); // Instancia de Vue Router para gestionar rutas
let nombreUsuario = 'Administrador'; // Definición del nombre del usuario que accede a la vista
let iconoSesion = '/icono/icono.png'; // Ubicación del icono de sesión del usuario

// Eliminación de la sesión del usuario y redirección a la página de inicio de sesión
let cerrarSesion = () => {
  localStorage.removeItem('usuario'); // Eliminación de los datos del usuario en localStorage
  router.push('/iniciar-sesion'); // Redirección a la página de inicio de sesión
};
</script>



  
  <style scoped>
  @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');
  



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
    margin-top: -7%;
  }
  
  .sections {
    margin-top: 20px;
  }
  
  .section {
    margin-bottom: 15px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    transition: 0.3s ease-in-out;
  }
  
  .section:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }
  

  .contenido {
    padding-top: 100px;
  }
  </style>
  