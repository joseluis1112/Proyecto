<template>
  <LayoutGuia 
    :nombreUsuario="nombreUsuario"
    :iconoSesion="iconoSesion"
    @cerrarSesion="cerrarSesion"
  >
    <!-- Contenido principal -->
    <div class="container d-flex justify-content-center align-items-center text-white contenido">
      <div class="info-card p-4">
        <!-- Título de bienvenida -->
        <h1 class="text-center fw-bold mb-4">Bienvenido al Panel del Guía</h1>
        <p class="text-center">Aquí puedes gestionar tus rutas asignadas y pasar lista a los asistentes.</p>

        <!-- Secciones de información -->
        <div class="sections">
          <!-- Sección de rutas asignadas -->
          <div class="section">
            <h3>📅 Ver Rutas Asignadas</h3>
            <p>Podrás ver un listado con todas las rutas que te han sido asignadas.  
              Las rutas estarán ordenadas por fecha, mostrando primero la más próxima.</p>
          </div>

          <!-- Sección de pasar lista -->
          <div class="section">
            <h3>✅ Pasar Lista en una Ruta</h3>
            <p>Cuando se te asigne una ruta, podrás ver la lista de personas inscritas.  
              Desde esta opción podrás marcar la asistencia de cada usuario.</p>
          </div>

          <!-- Sección de restricción de asignación -->
          <div class="section">
            <h3>🚫 Restricción de Asignación</h3>
            <p>Un guía no puede ser asignado a dos rutas en la misma fecha.  
              El sistema llevará el control para evitar duplicaciones.</p>
          </div>
        </div>
      </div>
    </div>
  </LayoutGuia>
</template>

<script setup>
import { useRouter } from 'vue-router'; // Importación de Vue Router 
import LayoutGuia from '@/components/LayoutGuia.vue'; // Importación del layout del guía

let router = useRouter(); // Instancia de Vue Router para gestionar rutas
let nombreUsuario = 'Guía'; // Definición del nombre del usuario que accede a la vista
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
  margin-top: -30px; 
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
  


  </style>
  