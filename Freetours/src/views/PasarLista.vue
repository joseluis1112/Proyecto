<template>
  <LayoutGuia
    :nombreUsuario="nombreUsuario"
    :iconoSesion="iconoSesion"
    @cerrarSesion="cerrarSesion"
  >
    <!-- Contenedor principal para la gestión de asistencia -->
    <div class="admin-container">
      <div class="table-container p-4">
        <h1 class="text-center fw-bold text-white mb-4">Pasar Lista - Ruta Asignada</h1>

        <!-- Mensaje si no hay reservas registradas -->
        <div v-if="reservas.length === 0" class="text-center text-white">
          <p>No hay personas inscritas en esta ruta.</p>
        </div>

        <!-- Tabla con la lista de reservas -->
        <div class="table-responsive" v-else>
          <table class="table table-striped table-hover text-center align-middle">
            <thead class="table-dark">
              <tr>
                <th>Cliente ID</th>
                <th>Número de Personas</th>
              </tr>
            </thead>
            <tbody>
              <!-- Se recorre la lista de reservas y se muestran sus datos -->
              <tr v-for="reserva in reservas" :key="reserva.id">
                <td>{{ reserva.cliente_id }}</td>
                <td>{{ reserva.num_personas }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </LayoutGuia>
</template>

<script setup>
import { ref, onMounted } from 'vue'; // Importación de funciones 
import { useRouter } from 'vue-router'; // Importación de Vue Router para gestionar la navegación
import LayoutGuia from '@/components/LayoutGuia.vue'; // Importación del layout del guía

let router = useRouter(); // Instancia de Vue Router que gestiona rutas
let reservas = ref([]); // Almacenamiento de la lista de reservas de la ruta asignada
let nombreUsuario = 'Guía'; // Definición del nombre del usuario que accede a la vista
let iconoSesion = '/icono/icono.png'; // Ubicación del icono de sesión del usuario

// Asignación de reservas de la ruta que tiene asignada el guía
let cargarReservas = async () => {
  try {
    let usuario = JSON.parse(localStorage.getItem('usuario')); // Recuperación del usuario almacenado en localStorage

    // Verificación de usuario válido y con rol de guía
    if (!usuario || usuario.rol !== 'guia') {
      alert('Acceso denegado'); // Mensaje de acceso restringido
      router.push('/iniciar-sesion'); // Redirección a la página de inicio de sesión
      return;
    }

    console.log("Buscando ruta asignada al guía con ID:", usuario.id); // Impresión del ID del guía en la consola

    // Solicitud de rutas asignadas al guía
    let rutaResponse = await fetch(`http://localhost:8080/api.php/asignaciones?guia_id=${usuario.id}`);
    let rutaData = await rutaResponse.json(); // Conversión de la respuesta en formato JSON

    // Verificación de rutas asignadas
    if (!Array.isArray(rutaData) || rutaData.length === 0) {
      alert("No tienes rutas asignadas."); // Mensaje en caso de no haber rutas asignadas
      return;
    }

    let rutaId = rutaData[0].ruta_id; // Obtención del ID de la primera ruta asignada
    console.log("Ruta asignada al guía:", rutaId); // Impresión en consola del ID de la ruta asignada

    // Solicitud de reservas para la ruta asignada
    let reservasResponse = await fetch(`http://localhost:8080/api.php/reservas?ruta_id=${rutaId}`);
    let reservasData = await reservasResponse.json(); // Conversión de la respuesta en formato JSON
    console.log("Reservas recibidas:", reservasData); // Impresión de las reservas obtenidas en consola

    // Verificación de que la API devolvió una lista válida de reservas
    if (Array.isArray(reservasData)) {
      reservas.value = reservasData; // Almacenamiento de reservas en la variable reactiva
    } else {
      console.error("La API no devolvió un array:", reservasData); // Mensaje de error en caso de respuesta incorrecta
      reservas.value = []; // Asignación de lista vacía si la API no devuelve datos válidos
    }
  } catch (error) {
    console.error('Error al cargar reservas:', error); // Mensaje de error en caso de fallo en la solicitud
    alert('Error al conectar con el servidor.'); // Mensaje para el usuario informando del error de conexión
  }
};

// Eliminación de la sesión del usuario y redirección a la página de inicio de sesión
let cerrarSesion = () => {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    localStorage.removeItem('usuario'); // Eliminación de los datos del usuario en localStorage
    router.push('/iniciar-sesion'); // Redirección a la página de inicio de sesión
  }
};

// Llamada a la función al montar el componente para obtener las reservas
onMounted(() => {
  cargarReservas(); // Ejecución de la función que obtiene las reservas
});
</script>



<style scoped>
@import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');

.admin-container {
  padding: 20px;
  padding-top: 5%;
  border-radius: 10px;
  color: white;
  width: 100%;
  min-height: 100vh;
  position: relative;
  margin-top:-6%;
}

.table-container {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
  width: 95%;
  max-width: 1200px;
  margin: auto;
  position: relative;
  z-index: 2;
  overflow: visible !important; 
}
.table {
    background: rgba(0, 0, 0, 0.9);
    border-radius: 10px;
    width: 100%;
    overflow: hidden;
    border-collapse: separate;
    border-spacing: 0;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.5);
  }

.table-responsive {
  overflow: visible !important; 
  max-height: none !important; 
}


th {
  color: #ffffff !important;
  background: #f8f9fa;
  padding: 15px;
  text-transform: uppercase;
  font-weight: bold;
}

td {
  color: #000 !important;
  padding: 12px;
  text-align: center;
}

tr:hover {
  background: rgba(255, 165, 0, 0.2);
  transform: scale(1.02);
  transition: 0.3s;
}


</style>
