<template>
  <LayoutCliente 
    :nombreUsuario="nombreUsuario"
    :iconoSesion="iconoSesion"
    @cerrarSesion="cerrarSesion"
  >
    <!-- Contenido principal -->
    <div class="container d-flex justify-content-center align-items-center text-white contenido">
      <div class="info-card p-4">
        <!-- Título de bienvenida -->
        <h1 class="text-center fw-bold mb-4">Bienvenido al Panel del Cliente</h1>
        <p class="text-center">Aquí puedes buscar y reservar rutas, así como gestionar tus reservas y valoraciones.</p>
        
        <!-- Secciones informativas -->
        <div class="sections">
          <!-- Sección de ver rutas disponibles -->
          <div class="section">
            <h3>🌍 Ver Rutas Disponibles</h3>
            <p>Puedes buscar rutas por localidad y fecha, ver la información detallada y realizar una reserva.</p>
          </div>
          
          <!-- Sección de reservar una ruta -->
          <div class="section">
            <h3>📝 Reservar una Ruta</h3>
            <p>Selecciona una ruta, indica el número de asistentes (máximo 8) y confirma tu reserva.</p>
          </div>
          
          <!-- Sección de valorar una ruta -->
          <div class="section">
            <h3>⭐ Valorar una Ruta</h3>
            <p>Después de realizar una ruta, podrás valorarla de 1 a 5 estrellas y dejar un comentario.</p>
          </div>
          
          <!-- Sección de cancelar una reserva -->
          <div class="section">
            <h3>❌ Cancelar una Reserva</h3>
            <p>Desde "Mis Reservas" podrás modificar o cancelar tus reservas en cualquier momento.</p>
          </div>
        </div>
      </div>
    </div>
  </LayoutCliente>
</template>

<script setup>
import { useRouter } from 'vue-router'; // Importación de Vue Router 
import LayoutCliente from '@/components/LayoutCliente.vue'; // Importación del layout del cliente

let router = useRouter(); // Instancia de Vue Router para gestionar rutas
let nombreUsuario = 'Cliente'; // Definición del nombre del usuario que accede a la vista
let iconoSesion = '/icono/icono.png'; // Ubicación del icono de sesión del usuario

// Eliminación de la sesión del usuario y redirección a la página de inicio de sesión
let cerrarSesion = () => {
  // Confirmación del usuario antes de cerrar sesión
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    localStorage.removeItem('usuario'); // Eliminación de los datos del usuario en localStorage
    router.push('/iniciar-sesion'); // Redirección a la página de inicio de sesión
  }
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
    margin-top: -35px;
   margin-top: -140px;
  }
  
  .sections {
    margin-top: 20px;
  }
  
  .section {
    margin-bottom: 8px;
    padding: 8px;
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
  