<template>
  <LayoutCliente 
    :nombreUsuario="nombreUsuario"
    :iconoSesion="iconoSesion"
    @cerrarSesion="cerrarSesion"
  >
    <!-- Contenedor principal que incluye la tabla de rutas completadas -->
    <div class="mt-5 pt-4">
      <div class="table-container p-5 text-white">
        <h1 class="text-center fw-bold mb-4">Mis Rutas</h1>

        <!-- Muestra mensaje si el usuario no ha completado rutas -->
        <div v-if="rutas.length === 0" class="text-center text-white">
          <p>No has completado ninguna ruta aún.</p>
        </div>

        <!-- Tabla con las rutas completadas -->
        <div class="tabla-responsive" v-else>
          <table class="table table-striped table-hover text-center align-middle">
            <thead class="table-dark">
              <tr>
                <th>Ruta</th>
                <th>Fecha</th>
                <th>Valoración</th>
                <th>Comentario</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <!-- Itera sobre las rutas para mostrarlas en la tabla -->
              <tr v-for="ruta in rutas" :key="ruta.id">
                <td>{{ ruta.ruta_titulo }}</td>
                <td>{{ ruta.ruta_fecha }}</td>
                <td>
                  <!-- Selector para que el usuario valore la ruta -->
                  <select v-model="ruta.estrellas" class="form-select w-50 mx-auto">
                    <option v-for="n in 5" :key="n" :value="n">{{ n }} ★</option>
                  </select>
                </td>
                <td>
                  <!-- Campo de texto para que el usuario agregue un comentario -->
                  <input type="text" v-model="ruta.comentario" placeholder="Escribe un comentario..." class="form-control text-center input-coment" />
                </td>
                <td>
                  <!-- Botón para enviar la valoración de la ruta -->
                  <button class="btn btn-orange btn-sm" @click="valorarRuta(ruta)">Enviar Valoración</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </LayoutCliente>
</template>

<script setup>
import { ref, onMounted } from 'vue'; // Importación de funciones de Vue 
import { useRouter } from 'vue-router'; // Importación de Vue Router que gestiona la navegación
import LayoutCliente from '@/components/LayoutCliente.vue'; // Importación del layout del cliente

let router = useRouter(); // Instancia de Vue Router que gestiona rutas
let rutas = ref([]); // Almacenamiento de la lista de rutas completadas por el usuario
let nombreUsuario = 'Cliente'; // Definición del nombre del usuario que accede a la vista
let iconoSesion = '/icono/icono.png'; // Ubicación del icono de sesión del usuario

// Obtención de rutas completadas del usuario desde la API
let cargarRutas = async () => {
  try {
    let usuario = JSON.parse(localStorage.getItem('usuario')); // Recuperación del usuario almacenado en localStorage

    // Verificación de usuario autenticado
    if (!usuario) {
      alert('Debes iniciar sesión.'); // Mensaje de advertencia para el usuario
      router.push('/iniciar-sesion'); // Redirección a la página de inicio de sesión
      return;
    }

    console.log("Buscando rutas completadas para el usuario con email:", usuario.email); // Impresión en consola del email del usuario

    // Solicitud a la API que obtiene las rutas completadas por el usuario
    let response = await fetch(`http://localhost:8080/api.php/reservas?email=${usuario.email}`, {
      method: 'GET'
    });

    let data = await response.json(); // Conversión de la respuesta en formato JSON
    console.log("Rutas recibidas:", data); // Impresión en consola de las rutas obtenidas

    // Verificación de que la API devolvió un array válido antes de asignarlo
    if (Array.isArray(data)) {
      rutas.value = data.map(ruta => ({
        id: ruta.reserva_id, // ID de la reserva
        ruta_id: ruta.ruta_id, // ID de la ruta
        ruta_titulo: ruta.ruta_titulo, // Título de la ruta
        ruta_fecha: ruta.ruta_fecha, // Fecha de la ruta
        estrellas: 0, // Valoración inicial (sin seleccionar)
        comentario: "" // Comentario inicial vacío
      }));
    } else {
      console.error("La API no devolvió un array:", data); // Mensaje de error en caso de respuesta incorrecta
      rutas.value = []; // Asignación de lista vacía si la API no devuelve datos válidos
    }
  } catch (error) {
    console.error('Error al cargar rutas:', error); // Mensaje de error en caso de fallo en la solicitud
    alert('Error al conectar con el servidor.'); // Mensaje para el usuario informando del error de conexión
  }
};

// Envío de valoración de una ruta a la API
let valorarRuta = async (ruta) => {
  // Verificación de que el usuario seleccionó una puntuación
  if (ruta.estrellas === 0) {
    alert("Debes seleccionar una puntuación."); // Mensaje de advertencia para el usuario
    return;
  }

  try {
    // Construcción del objeto con la valoración del usuario
    let valoracionData = {
      user_id: JSON.parse(localStorage.getItem('usuario')).id, // ID del usuario que valora la ruta
      ruta_id: ruta.ruta_id, // ID de la ruta valorada
      estrellas: ruta.estrellas, // Número de estrellas seleccionadas
      comentario: ruta.comentario // Comentario escrito por el usuario
    };

    // Envío de la valoración a la API mediante una solicitud POST
    let response = await fetch('http://localhost:8080/api.php/valoraciones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Especificación de que se envían datos en formato JSON
      },
      body: JSON.stringify(valoracionData) // Conversión del objeto de valoración a JSON
    });

    let data = await response.json(); // Conversión de la respuesta en JSON
    console.log("Respuesta al valorar ruta:", data); // Impresión de la respuesta en consola

    // Verificación de respuesta exitosa
    if (data.status === 'success') {
      alert("Valoración enviada correctamente."); // Mensaje de éxito para el usuario
    } else {
      alert("Error al enviar la valoración."); // Mensaje en caso de error en la API
    }
  } catch (error) {
    console.error("Error al valorar la ruta:", error); // Mensaje de error en consola
    alert("No se pudo enviar la valoración."); // Mensaje de error para el usuario
  }
};

// Eliminación de la sesión del usuario y redirección a la página de inicio de sesión
let cerrarSesion = () => {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    localStorage.removeItem('usuario'); // Eliminación de los datos del usuario en localStorage
    router.push('/iniciar-sesion'); // Redirección a la página de inicio de sesión
  }
};

// Llamada a la función al montar el componente para obtener las rutas completadas del usuario
onMounted(() => {
  cargarRutas(); // Ejecución de la función que obtiene las rutas completadas
});
</script>




<style scoped>




@import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');




.table-container {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 1400px;
  min-height: 300px; 
  max-height: 600px; 
  margin: auto;
  position: relative;
  z-index: 2;
  overflow-y: auto;
  margin-top: -7%; 
  overflow-y: auto;
  max-height: 500px;
  
}
.table {
  width: 100%;
  max-width: 100%;
  table-layout: fixed; 
}


.table-responsive {
  max-height: 500px; 
  overflow-y: auto; 
}


.table-container h1 {
  font-size: 40px;
  margin-bottom: 20px;
}

.table-dark {
  background: rgba(0, 0, 0, 0.8);
}

.btn-orange {
  background-color: #ff9800;
  color: white;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 5px;
}

.btn-orange:hover {
  background-color: #e68900;
}

.input-coment {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin: auto;
}

  </style>
  