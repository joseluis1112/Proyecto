<template>
  <LayoutAdmin 
    :nombreUsuario="nombreUsuario"
    :iconoSesion="iconoSesion"
    @cerrarSesion="cerrarSesion"
  >
    <!-- Tarjeta de Gestión de Usuarios -->
    <div class="table-container">
      <h1 class="text-center fw-bold text-white mb-4">Gestión de Usuarios</h1>

      <div class="table-responsive">
        <table class="table table-striped table-hover text-center align-middle">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="usuario in usuarios" :key="usuario.id">
              <td>{{ usuario.id }}</td>
              <td>{{ usuario.nombre }}</td>
              <td>{{ usuario.email }}</td>
              <td>
                <select class="form-select" v-model="usuario.rol" @change="actualizarRol(usuario)">
                  <option value="admin">Admin</option>
                  <option value="guia">Guía</option>
                  <option value="cliente">Cliente</option>
                </select>
              </td>
              <td>
                <button class="btn btn-custom btn-sm" @click="eliminarUsuario(usuario.id)">
                  <i class="fas fa-trash-alt"></i> Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="mensaje" class="alert alert-success mt-3 text-center" role="alert">
        {{ mensaje }}
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
let usuarios = ref([]); // Almacenamiento de la lista de usuarios registrados
let mensaje = ref(''); // Almacenamiento de mensajes de estado (éxito o error)
let nombreUsuario = 'Administrador'; // Definición del nombre del usuario que accede a la vista
let iconoSesion = '/icono/icono.png'; // Ubicación del icono de sesión del usuario

// Obtención de la lista de usuarios desde la API
let cargarUsuarios = async () => {
  try {
    let respuesta = await axios.get('http://localhost:8080/api.php/usuarios'); // Solicitud GET a la API
    usuarios.value = respuesta.data; // Asignación de la respuesta de la API a la variable reactiva
  } catch (error) {
    console.error('Error al cargar usuarios:', error); // Mensaje de error en consola si la solicitud falla
  }
};

// Eliminación de la sesión del usuario y redirección a la página de inicio de sesión
let cerrarSesion = () => {
  localStorage.removeItem('usuario'); // Eliminación de los datos del usuario en localStorage
  router.push('/iniciar-sesion'); // Redirección a la página de inicio de sesión
};

// Actualización del rol de un usuario en la API
let actualizarRol = async (usuario) => {
  try {
    // Solicitud PUT para actualizar el rol del usuario seleccionado
    let respuesta = await axios.put(`http://localhost:8080/api.php/usuarios?id=${usuario.id}`, {
      rol: usuario.rol // Nuevo rol seleccionado por el administrador
    }, {
      headers: { 'Content-Type': 'application/json' } // Especificación de que se envían datos en formato JSON
    });

    // Verificación de respuesta exitosa
    if (respuesta.data.status === 'success') {
      mensaje.value = `Rol de ${usuario.nombre} actualizado a ${usuario.rol}`; // Mensaje de éxito
      setTimeout(() => mensaje.value = '', 3000); // Eliminación del mensaje después de 3 segundos
    } else {
      mensaje.value = 'Error al actualizar rol'; // Mensaje en caso de error en la API
    }
  } catch (error) {
    console.error('Error al actualizar rol:', error); // Mensaje de error en consola si la solicitud falla
  }
};

// Eliminación de un usuario en la API
let eliminarUsuario = async (id) => {
  // Confirmación del usuario antes de eliminar la cuenta
  if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

  try {
    let respuesta = await axios.delete(`http://localhost:8080/api.php/usuarios?id=${id}`); // Solicitud DELETE a la API

    // Verificación de respuesta exitosa
    if (respuesta.data.status === 'success') {
      usuarios.value = usuarios.value.filter(user => user.id !== id); // Eliminación del usuario de la lista local
      mensaje.value = 'Usuario eliminado correctamente'; // Mensaje de éxito
      setTimeout(() => mensaje.value = '', 3000); // Eliminación del mensaje después de 3 segundos
    } else {
      mensaje.value = 'Error al eliminar usuario'; // Mensaje en caso de error en la API
    }
  } catch (error) {
    console.error('Error al eliminar usuario:', error); // Mensaje de error en consola si la solicitud falla
  }
};

// Llamada a la función al montar el componente para obtener la lista de usuarios
onMounted(() => {
  cargarUsuarios(); // Ejecución de la función que obtiene la lista de usuarios
});
</script>


<style scoped>
@import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');





.table-container {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
  width: 85%;
  max-width: 1000px;
  position: relative;
  z-index: 2;
  max-height: 500px; 
  overflow-y: auto; 
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
