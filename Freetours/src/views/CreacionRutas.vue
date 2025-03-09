<template>
  <LayoutAdmin 
    :nombreUsuario="nombreUsuario"
    :iconoSesion="iconoSesion"
    @cerrarSesion="cerrarSesion"
  >
    <!-- Contenedor principal para la creación de rutas -->
    <div class="container-fluid d-flex justify-content-center align-items-center contenido">
      <div class="ruta-card p-4">
        <h1 class="text-center fw-bold text-white mb-4">Crear Nueva Ruta</h1>
        <form @submit.prevent="crearRuta">
          <!-- Campos del formulario -->
          <div class="mb-3">
            <label class="form-label">Título de la Ruta:</label>
            <input type="text" v-model="titulo" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Localidad:</label>
            <input type="text" v-model="localidad" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Descripción:</label>
            <textarea v-model="descripcion" class="form-control" required></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Foto de la Ruta:</label>
            <input type="file" @change="foto = $event.target.files[0]" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Fecha:</label>
            <input type="date" v-model="fecha" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Hora:</label>
            <input type="time" v-model="hora" class="form-control" required />
          </div>
          <!-- Mapa interactivo que selecciona la ubicación -->
          <div id="map" class="map-container"></div>
          <p v-if="mensaje" class="alert alert-info mt-3">{{ mensaje }}</p>
          <button type="submit" class="btn btn-custom mt-3">Crear Ruta</button>
        </form>
      </div>
    </div>
  </LayoutAdmin>
</template>

<script setup>
import { ref, onMounted } from 'vue'; // Importación de funciones de Vue para manejo del estado y ciclo de vida
import { useRouter } from 'vue-router'; // Importación de Vue Router para gestionar la navegación
import L from 'leaflet'; // Importación de Leaflet para manejar mapas interactivos
import 'leaflet/dist/leaflet.css'; // Importación de los estilos de Leaflet
import axios from 'axios'; // Importación de Axios para realizar peticiones HTTP
import LayoutAdmin from '@/components/LayoutAdmin.vue'; // Importación del layout de administrador

let router = useRouter(); // Instancia de Vue Router para gestionar rutas

// Variables reactivas para almacenar los datos del formulario de la nueva ruta
let titulo = ref('');
let localidad = ref('');
let descripcion = ref('');
let foto = ref(null);
let fecha = ref('');
let hora = ref('');
let latitud = ref(null); // Latitud seleccionada en el mapa
let longitud = ref(null); // Longitud seleccionada en el mapa
let mensaje = ref('');
let nombreUsuario = 'Administrador'; // Nombre del usuario que accede a la vista
let iconoSesion = '/icono/icono.png'; // Ubicación del icono de sesión del usuario

// Creación del mapa interactivo con Leaflet
let inicializarMapa = () => {
  // Creación del mapa y establecimiento de la vista inicial en Madrid, España
  let map = L.map('map').setView([40.4168, -3.7038], 12);

  // Carga de los tiles (capas del mapa) desde OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors' // Atribución de datos del mapa
  }).addTo(map);

  // Manejo del evento de clic en el mapa para obtener la ubicación seleccionada
  map.on('click', (e) => {
    latitud.value = e.latlng.lat.toFixed(6); // Almacena la latitud con 6 decimales
    longitud.value = e.latlng.lng.toFixed(6); // Almacena la longitud con 6 decimales
    console.log(`Ubicación seleccionada: ${latitud.value}, ${longitud.value}`);
  });
};

// Envío de los datos de la nueva ruta a la API
let crearRuta = async () => {
  let rutaData = {
    titulo: titulo.value, // Título de la ruta ingresado en el formulario
    localidad: localidad.value, // Localidad de la ruta
    descripcion: descripcion.value, // Descripción de la ruta
    foto: foto.value ? foto.value.name : '', // Nombre del archivo de imagen seleccionado
    fecha: fecha.value, // Fecha de la ruta seleccionada
    hora: hora.value, // Hora de la ruta seleccionada
    latitud: latitud.value, // Latitud seleccionada en el mapa
    longitud: longitud.value, // Longitud seleccionada en el mapa
  };

  try {
    // Solicitud POST a la API para registrar la nueva ruta
    let response = await axios.post('http://localhost:8080/api.php/rutas', rutaData, {
      headers: { 'Content-Type': 'application/json' } // Especificación de que se envían datos en formato JSON
    });

    // Verificación de respuesta exitosa
    if (response.data.status === 'success') {
      mensaje.value = 'Ruta creada con éxito'; // Mensaje de éxito en la interfaz
      console.log('Respuesta:', response.data);
    } else {
      mensaje.value = 'Error al crear la ruta'; // Mensaje en caso de error en la API
      console.error('Error:', response.data);
    }
  } catch (error) {
    mensaje.value = 'Error en la conexión con la API'; // Mensaje en caso de fallo en la conexión
    console.error('Error:', error);
  }
};

// Eliminación de la sesión del usuario y redirección a la página de inicio de sesión
let cerrarSesion = () => {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    localStorage.removeItem('usuario'); // Eliminación de los datos del usuario en localStorage
    router.push('/iniciar-sesion'); // Redirección a la página de inicio de sesión
  }
};

// Llamada a la función al montar el componente para inicializar el mapa interactivo
onMounted(() => {
  inicializarMapa(); // Creación del mapa cuando el componente se monta
});
</script>






<style scoped>
@import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');





.ruta-card {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  padding-top: 5%;
  border-radius: 15px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);
  width: 90%;
  max-width: 1000px;
  max-height: 85vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.3);
  text-align: center;
  color: white;
  margin-top: -35px;
}

.map-container {
  width: 100%;
  height: 400px;
  border-radius: 10px;
  border: 2px solid white;
}

.btn-custom {
  background-color: #8b5e3b;
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  transition: background 0.3s ease-in-out;
}

.btn-custom:hover {
  background-color: #5e3b1f;
}
</style>
