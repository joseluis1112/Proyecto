<template>
  <LayoutAdmin 
    :nombreUsuario="nombreUsuario"
    :iconoSesion="iconoSesion"
    @cerrarSesion="cerrarSesion"
  >
    <!-- Contenedor de la gestión de rutas SIN fondo adicional -->
    <div class="admin-container">
      <div class="table-container p-4">
        <h1 class="text-center fw-bold text-white mb-4">Gestión de Rutas</h1>

        <!-- Tabla de rutas -->
        <div class="table-responsive">
          <table class="table table-striped table-hover text-center align-middle">
            <thead class="table-dark">
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Localidad</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Guía Asignado</th>
                <th>Asistentes</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ruta in rutas" :key="ruta.id">
                <td>{{ ruta.id }}</td>
                <td>{{ ruta.titulo }}</td>
                <td>{{ ruta.localidad }}</td>
                <td>{{ ruta.fecha }}</td>
                <td>{{ ruta.hora }}</td>
                <td>
                  <select class="form-select" v-model="ruta.guia_id" @change="asignarGuia(ruta)">
                    <option v-for="guia in ruta.guiasDisponibles" :key="guia.id" :value="guia.id">
                      {{ guia.nombre }}
                    </option>
                  </select>
                </td>
                <td :class="{ 'text-warning': ruta.asistentes < 10 }">{{ ruta.asistentes }}</td>
                <td>
                  <button class="btn btn-warning btn-sm" @click="cancelarRuta(ruta.id)">
                    <i class="fas fa-exclamation-triangle"></i> Cancelar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </LayoutAdmin>
</template>
<script setup>
import { ref, onMounted } from 'vue'; // Importación de funciones de Vue 
import { useRouter } from 'vue-router'; // Importación de Vue Router para gestionar la navegación
import axios from 'axios'; // Importación de Axios para realizar peticiones HTTP
import LayoutAdmin from '@/components/LayoutAdmin.vue'; // Importación del layout de administrador

let router = useRouter(); // Instancia de Vue Router para gestionar rutas
let rutas = ref([]); // Almacenamiento de la lista de rutas disponibles
let nombreUsuario = 'Administrador'; // Definición del nombre del usuario que accede a la vista
let iconoSesion = '/icono/icono.png'; // Ubicación del icono de sesión del usuario

// Obtención de las rutas y los guías disponibles desde la API
let cargarRutas = async () => {
  try {
    let response = await axios.get('http://localhost:8080/api.php/rutas'); // Solicitud GET para obtener rutas
    rutas.value = response.data; // Asignación de los datos obtenidos a la variable reactiva

    // Iteración sobre cada ruta para obtener los guías disponibles en la fecha correspondiente
    for (let ruta of rutas.value) {
      let guiasResponse = await axios.get(`http://localhost:8080/api.php/asignaciones?fecha=${ruta.fecha}`);
      ruta.guiasDisponibles = guiasResponse.data; // Asignación de los guías disponibles a cada ruta
    }
  } catch (error) {
    console.error('Error al cargar rutas o guías:', error); // Mensaje de error en consola si la solicitud falla
  }
};

// Asignación de un guía a una ruta en la API
let asignarGuia = async (ruta) => {
  try {
    let asignacionData = {
      ruta_id: ruta.id, // ID de la ruta a la que se asignará el guía
      guia_id: ruta.guia_id // ID del guía seleccionado
    };

    // Envío de la asignación a la API mediante una solicitud POST
    let response = await axios.post('http://localhost:8080/api.php/asignaciones', asignacionData, {
      headers: { 'Content-Type': 'application/json' } // Especificación de que se envían datos en formato JSON
    });

    // Verificación de respuesta exitosa
    if (response.data.status === 'success') {
      console.log(`Guía asignado a la ruta ${ruta.id}`); // Confirmación en consola
    } else {
      console.error('Error al asignar guía:', response.data); // Mensaje de error en consola si la API falla
    }
  } catch (error) {
    console.error('Error al asignar guía:', error); // Mensaje de error en consola si la solicitud falla
  }
};

// Cancelación de una ruta en la API
let cancelarRuta = async (id) => {
  // Confirmación del usuario antes de cancelar la ruta
  if (!confirm('¿Estás seguro de cancelar esta ruta?')) return;

  try {
    let response = await axios.delete(`http://localhost:8080/api.php/rutas?id=${id}`); // Solicitud DELETE a la API

    // Verificación de respuesta exitosa
    if (response.data.status === 'success') {
      rutas.value = rutas.value.filter(ruta => ruta.id !== id); // Eliminación de la ruta de la lista local
      console.log(`Ruta ${id} eliminada correctamente.`); // Confirmación en consola
      alert('Ruta cancelada correctamente.'); // Mensaje de éxito para el usuario
    } else {
      console.error('Error en la API al eliminar la ruta:', response.data); // Mensaje de error en consola
      alert('Error al eliminar la ruta. Inténtalo de nuevo.'); // Mensaje de error para el usuario
    }
  } catch (error) {
    console.error('Error al cancelar la ruta:', error); // Mensaje de error en consola si la solicitud falla
    alert('Error al conectar con el servidor.'); // Mensaje de error para el usuario
  }
};

// Eliminación de la sesión del usuario y redirección a la página de inicio de sesión
let cerrarSesion = () => {
  // Confirmación del usuario antes de cerrar sesión
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    localStorage.removeItem('usuario'); // Eliminación de los datos del usuario en localStorage
    router.push('/iniciar-sesion'); // Redirección a la página de inicio de sesión
  }
};

// Llamada a la función al montar el componente para obtener la lista de rutas
onMounted(() => {
  cargarRutas(); // Ejecución de la función que obtiene las rutas y los guías disponibles
});
</script>



<style scoped>

.admin-container {
  padding-top: 3%;
  width: 100%;
  min-height: 100vh;
  position: relative;
  margin-top: -5%;
}

.table-container {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
  width: 95%;
  height: 88%;
  max-width: 1200px;
  margin: auto;
  position: relative;
  z-index: 2;
  overflow-y: auto;
  max-height: 500px;
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

th {
  color: #ffffff !important;
  background: #f8f9fa;
  padding: 15px;
  text-transform: uppercase;
  border-bottom: 3px solid #8b5e3b;
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

.btn-warning {
  background-color: #8b5e3b;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  transition: 0.3s;
}

.btn-warning:hover {
  background-color: #5e3b1f;
}
</style>
