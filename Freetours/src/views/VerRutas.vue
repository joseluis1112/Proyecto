<template>
  <LayoutGuia 
    :nombreUsuario="nombreUsuario"
    :iconoSesion="iconoSesion"
    @cerrarSesion="cerrarSesion"
  >
    <!-- Contenedor principal para la administración de rutas -->
    <div class="admin-container">
      <div class="table-container p-4">
        <h1 class="text-center fw-bold text-white mb-4">Rutas Asignadas</h1>

        <!-- Mensaje si no hay rutas asignadas -->
        <div v-if="rutas.length === 0" class="text-center text-white">
          <p>No tienes rutas asignadas.</p>
        </div>

        <!-- Tabla que muestra las rutas asignadas -->
        <div class="table-responsive" v-else>
          <table class="table table-striped table-hover text-center align-middle">
            <thead class="table-dark">
              <tr>
                <th>ID Ruta</th>
                <th>Nombre</th>
                <th>Localidad</th>
                <th>Fecha</th>
                <th>Hora</th>
              </tr>
            </thead>
            <tbody>
              <!-- Se recorre la lista de rutas y se muestran sus datos -->
              <tr v-for="ruta in rutas" :key="ruta.ruta_id">
                <td>{{ ruta.ruta_id }}</td>
                <td>{{ ruta.ruta_titulo || 'No disponible' }}</td>
                <td>{{ ruta.ruta_localidad || 'No disponible' }}</td>
                <td>{{ ruta.ruta_fecha || 'No disponible' }}</td>
                <td>{{ ruta.ruta_hora || 'No disponible' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </LayoutGuia>
</template>

<script setup>
import { ref, onMounted } from 'vue'; // Importamos funciones de Vue que manejan el estado y monta el componente
import { useRouter } from 'vue-router'; // Importamos Vue Router que maneja la navegación
import axios from 'axios'; // Importamos Axios que realiza peticiones HTTP
import LayoutGuia from '@/components/LayoutGuia.vue'; // Importamos el layout del guía

// Instanciamos Vue Router que maneja la navegación
let router = useRouter();


let rutas = ref([]); // Almacena la lista de rutas asignadas al guía
let nombreUsuario = 'Guía'; // Nombre del usuario que verá la vista
let iconoSesion = '/icono/icono.png'; // Icono de usuario para la sesión

// FUNCIÓN QUE CARGA LAS RUTAS ASIGNADAS AL GUÍA 
let cargarRutas = async () => {
  try {
    // Recuperamos el usuario desde localStorage
    let usuario = JSON.parse(localStorage.getItem('usuario'));

    // Validación: si no hay usuario o no es un guía, redirige a la página de inicio de sesión
    if (!usuario || usuario.rol !== 'guia') {
      alert('Acceso denegado');
      router.push('/iniciar-sesion');
      return;
    }

    console.log("Buscando rutas para el guía con ID:", usuario.id);

    // Hacemos una petición GET a la API que obtiene las rutas asignadas al guía
    let response = await axios.get(`http://localhost:8080/api.php/asignaciones?guia_id=${usuario.id}`);
    console.log("Rutas asignadas recibidas:", response.data);

    // Validamos que la respuesta de la API sea un array antes de continuar
    if (Array.isArray(response.data)) {
      let rutasFiltradas = {};

      // Filtramos rutas duplicadas agrupándolas por fecha (para evitar datos repetidos)
      for (let ruta of response.data) {
        let clave = `${ruta.ruta_fecha}`;
        if (!rutasFiltradas[clave]) {
          rutasFiltradas[clave] = ruta;
        }
      }

      // Convertimos el objeto en array y ordenamos las rutas por fecha
      rutas.value = Object.values(rutasFiltradas).sort(
        (a, b) => new Date(a.ruta_fecha) - new Date(b.ruta_fecha)
      );

      // Llamamos a la función que obtiene el número de asistentes por ruta
      await cargarAsistentes();
    } else {
      console.error("La API no devolvió un array:", response.data);
      rutas.value = []; // Si hay un error, limpiamos la lista de rutas
    }
  } catch (error) {
    console.error('Error al cargar rutas:', error);
    alert('Error al conectar con el servidor.'); // Mostramos un mensaje de error al usuario
  }
};

//  FUNCIÓN QUE CARGA EL NÚMERO DE ASISTENTES POR RUTA 
let cargarAsistentes = async () => {
  try {
    // Hacemos una petición GET a la API que obtiene todas las reservas
    let response = await axios.get('http://localhost:8080/api.php/reservas');
    let reservas = response.data;

    // Validamos que la respuesta de la API sea un array antes de continuar
    if (!Array.isArray(reservas)) {
      console.error("La API de reservas no devolvió un array:", reservas);
      return;
    }

    // Para cada ruta asignada, contamos el número total de asistentes
    rutas.value.forEach((ruta) => {
      let asistentes = reservas.filter(reserva => reserva.ruta_id === ruta.ruta_id)
                                 .reduce((total, reserva) => total + reserva.num_personas, 0);

      ruta.ruta_asistentes = asistentes; // Agregamos el número de asistentes a cada ruta
    });

    console.log("Número de asistentes por ruta actualizado:", rutas.value);
  } catch (error) {
    console.error("Error al obtener asistentes:", error);
  }
};

//  FUNCIÓN PARA CERRAR SESIÓN
let cerrarSesion = () => {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    localStorage.removeItem('usuario'); // Eliminamos la información del usuario de localStorage
    router.push('/iniciar-sesion'); // Redirigimos al usuario a la página de inicio de sesión
  }
};

//  FUNCIÓN QUE SE EJECUTA CUANDO SE MONTA EL COMPONENTE 
// Llamamos a `cargarRutas()` que obtiene las rutas asignadas cuando la página se carga
onMounted(() => {
  cargarRutas();
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
  margin-top: -60px
}

.table-container {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
  width: 95%;
  max-width: 1200px;
  margin: auto;
  position: relative;
  z-index: 2;
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

.btn-custom {
  background-color: #8b5e3b;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  transition: 0.3s;
}

.btn-custom:hover {
  background-color: #5e3b1f;
  transform: scale(1.1);
}
</style>
