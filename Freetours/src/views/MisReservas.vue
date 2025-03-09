<template>
  <LayoutCliente
    :nombreUsuario="nombreUsuario"
    :iconoSesion="iconoSesion"
    @cerrarSesion="cerrarSesion"
  >
    <div class="container mt-5 pt-4">
      <!-- Tarjeta de título "Mis Reservas" -->
      <div class="search-card p-4 text-white">
        <h1 class="text-center fw-bold mb-4">Mis Reservas</h1>
      </div>

      <!-- Mensaje si no hay reservas activas -->
      <div v-if="reservas.length === 0" class="text-center text-white">
        <p>No tienes reservas activas.</p>
      </div>

      <!-- Tabla de reservas si existen -->
      <div class="table-container p-4" v-else>
        <div class="table-responsive">
          <table class="table table-striped table-hover text-center align-middle">
            <thead class="table-dark">
              <tr>
                <th>Ruta</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Número de Personas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="reserva in reservas" :key="reserva.id">
                <td>{{ reserva.ruta_titulo }}</td>
                <td>{{ reserva.ruta_fecha }}</td>
                <td>{{ reserva.ruta_hora }}</td>
                <td>
                  <!-- Input que modifica el número de personas -->
                  <input type="number" v-model="reserva.num_personas" min="1" max="8" class="form-control text-center num-input" />
                </td>
                <td>
                  <!-- Botón que guarda cambios -->
                  <button class="btn btn-orange btn-sm me-2" @click="modificarReserva(reserva)">Guardar</button>
                  <!-- Botón que cancela reserva -->
                  <button class="btn btn-brown btn-sm" @click="cancelarReserva(reserva.id)">Cancelar</button>
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
import { useRouter } from 'vue-router'; // Importación de Vue Router para gestionar la navegación
import LayoutCliente from '@/components/LayoutCliente.vue'; // Importación del layout del cliente

let router = useRouter(); // Instancia de Vue Router para gestionar rutas
let reservas = ref([]); // Almacenamiento de la lista de reservas activas del usuario
let nombreUsuario = 'Cliente'; // Definición del nombre del usuario que accede a la vista
let iconoSesion = '/icono/icono.png'; // Ubicación del icono de sesión del usuario

// Obtención de reservas activas del usuario desde la API
let cargarReservas = async () => {
  try {
    let usuario = JSON.parse(localStorage.getItem('usuario')); // Recuperación del usuario almacenado en localStorage

    // Verificación de usuario autenticado
    if (!usuario) {
      alert('Debes iniciar sesión.'); // Mensaje de advertencia para el usuario
      router.push('/iniciar-sesion'); // Redirección a la página de inicio de sesión
      return;
    }

    console.log("Buscando reservas para el usuario con email:", usuario.email); // Impresión en consola del email del usuario

    // Solicitud a la API para obtener las reservas activas del usuario
    let response = await fetch(`http://localhost:8080/api.php/reservas?email=${usuario.email}`);

    let data = await response.json(); // Conversión de la respuesta en formato JSON
    console.log("Reservas recibidas:", data); // Impresión en consola de las reservas obtenidas

    // Verificación de que la API devolvió un array válido antes de asignarlo
    if (Array.isArray(data)) {
      reservas.value = data.map(reserva => ({
        id: reserva.reserva_id, // ID de la reserva
        ruta_id: reserva.ruta_id, // ID de la ruta reservada
        ruta_titulo: reserva.ruta_titulo, // Título de la ruta
        ruta_fecha: reserva.ruta_fecha, // Fecha de la ruta
        ruta_hora: reserva.ruta_hora, // Hora de la ruta
        num_personas: reserva.num_personas // Número de personas en la reserva
      }));
    } else {
      console.error("La API no devolvió un array:", data); // Mensaje de error en caso de respuesta incorrecta
      reservas.value = []; // Asignación de lista vacía si la API no devuelve datos válidos
    }
  } catch (error) {
    console.error('Error al cargar reservas:', error); // Mensaje de error en caso de fallo en la solicitud
    alert('Error al conectar con el servidor.'); // Mensaje para el usuario informando del error de conexión
  }
};

// Modificación del número de asistentes en una reserva
let modificarReserva = async (reserva) => {
  try {
    // Construcción del objeto con la actualización de la reserva
    let reservaData = {
      email: JSON.parse(localStorage.getItem('usuario')).email, // Email del usuario que modifica la reserva
      ruta_id: reserva.ruta_id, // ID de la ruta reservada
      num_personas: reserva.num_personas // Nuevo número de personas en la reserva
    };

    // Envío de la modificación a la API mediante una solicitud POST
    let response = await fetch('http://localhost:8080/api.php/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // Especificación de que se envían datos en formato JSON
      body: JSON.stringify(reservaData) // Conversión del objeto de actualización a JSON
    });

    let data = await response.json(); // Conversión de la respuesta en JSON
    console.log("Respuesta al modificar reserva:", data); // Impresión de la respuesta en consola

    // Verificación de respuesta exitosa
    if (data.status === 'success') {
      alert("Reserva actualizada correctamente."); // Mensaje de éxito para el usuario
    } else {
      alert("Error al actualizar la reserva."); // Mensaje en caso de error en la API
    }
  } catch (error) {
    console.error("Error al modificar la reserva:", error); // Mensaje de error en consola
    alert("No se pudo actualizar la reserva."); // Mensaje de error para el usuario
  }
};

// Cancelación de una reserva mediante solicitud DELETE
let cancelarReserva = async (id) => {
  // Verificación de ID válido antes de proceder
  if (!id || isNaN(id)) {
    alert("Error: ID de reserva inválido."); // Mensaje de error si el ID no es válido
    return;
  }

  // Confirmación del usuario antes de cancelar la reserva
  if (!confirm("¿Seguro que quieres cancelar esta reserva?")) return;

  try {
    console.log(`Intentando cancelar la reserva con ID: ${id}`); // Impresión del ID de la reserva en consola

    // Envío de la solicitud DELETE a la API para cancelar la reserva
    let response = await fetch(`http://localhost:8080/api.php/reservas?id=${id}`, {
      method: 'DELETE'
    });

    let data = await response.json(); // Conversión de la respuesta en JSON
    console.log("Respuesta al cancelar reserva:", data); // Impresión de la respuesta en consola

    // Verificación de respuesta exitosa
    if (data.status === 'success') {
      alert("Reserva cancelada correctamente."); // Mensaje de éxito para el usuario
      reservas.value = reservas.value.filter(reserva => reserva.id !== id); // Eliminación de la reserva de la lista
    } else {
      alert("Error al cancelar la reserva."); // Mensaje en caso de error en la API
    }
  } catch (error) {
    console.error("Error al cancelar la reserva:", error); // Mensaje de error en consola
    alert("No se pudo cancelar la reserva."); // Mensaje de error para el usuario
  }
};

// Eliminación de la sesión del usuario y redirección a la página de inicio de sesión
let cerrarSesion = () => {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    localStorage.removeItem('usuario'); // Eliminación de los datos del usuario en localStorage
    router.push('/iniciar-sesion'); // Redirección a la página de inicio de sesión
  }
};

// Llamada a la función al montar el componente para obtener las reservas activas del usuario
onMounted(() => {
  cargarReservas(); // Ejecución de la función que obtiene las reservas activas
});
</script>



<style scoped>
@import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');


.search-card {
  background: rgba(0, 0, 0, 0.6);
  padding: 20px;
  border-radius: 8px;
  margin-top: -90px;
}

.table-container {
  background: rgba(0, 0, 0, 0.6);
  padding: 20px;
  border-radius: 8px;
  overflow-y: auto;
  max-height: 500px;

}

.table-responsive::-webkit-scrollbar {
  width: 6px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 3px;
}

.table-responsive::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.8);
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

.btn-brown {
  background-color: #8b5e3b;
  color: white;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 5px;
}

.btn-brown:hover {
  background-color: #5e3b1f;
}

.num-input {
  width: 60px;
  font-size: 12px;
  text-align: center;
  margin: auto;
}
</style>