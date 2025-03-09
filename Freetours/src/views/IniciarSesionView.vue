<template>
  <div class="contenedor">
    <!-- Video de fondo -->
    <video autoplay muted loop class="video-fondo">
      <source src="/videos/12136807_3840_2160_30fps.mp4" type="video/mp4">
      Tu navegador no soporta videos en HTML5.
    </video>

    <!-- Tarjeta de inicio de sesión -->
    <div class="tarjeta p-4">
      <h2 class="text-center mb-4">Iniciar Sesión</h2>
      <form @submit.prevent="emitirInicioSesion">
        <!-- Campo de correo electrónico -->
        <div class="mb-3">
          <label for="email" class="form-label">Correo Electrónico:</label>
          <input type="email" id="email" v-model="correo" class="form-control" required />
        </div>

        <!-- Campo de contraseña -->
        <div class="mb-3">
          <label for="contrasena" class="form-label">Contraseña:</label>
          <input type="password" id="contrasena" v-model="contrasena" class="form-control" required />
        </div>

        <!-- Botón para enviar el formulario -->
        <button type="submit" class="btn btn-success w-100">Ingresar</button>
      </form>

      <!-- Mensaje de error si las credenciales son incorrectas -->
      <p v-if="error" class="alert alert-danger mt-3">{{ error }}</p>

      <!-- Enlace para registrarse -->
      <p class="registro-texto mt-3 text-center">
        ¿No tienes una cuenta?
        <router-link to="/registro" class="enlace-registro">Regístrate aquí</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'; // Importación de funciones de Vue 
import { useRouter } from 'vue-router'; // Importación de Vue Router para gestionar la navegación
import axios from 'axios'; // Importación de Axios para realizar peticiones HTTP

// Almacenamiento de datos ingresados por el usuario
let correo = ref(''); // Almacena el email ingresado en el formulario
let contrasena = ref(''); // Almacena la contraseña ingresada en el formulario
let error = ref(''); // Almacena mensajes de error si el inicio de sesión falla

let router = useRouter(); // Instancia de Vue Router que gestiona rutas
let emit = defineEmits(['iniciar-sesion']); // Definición de evento personalizado para el inicio de sesión

// Envío de los datos ingresados a la API para validar el inicio de sesión
let emitirInicioSesion = async () => {
  try {
    // Solicitud a la API para validar credenciales
    let respuesta = await axios.post('http://localhost:8080/api.php/usuarios?login', {
      email: correo.value, // Email ingresado por el usuario
      contraseña: contrasena.value // Contraseña ingresada por el usuario
    }, {
      headers: { 'Content-Type': 'application/json' } // Especificación de que se envían datos en formato JSON
    });

    // Verificación de respuesta exitosa
    if (respuesta.data.status === 'success') {
      let usuario = respuesta.data.user; // Almacenamiento del usuario autenticado
      localStorage.setItem('usuario', JSON.stringify(usuario)); // Almacenamiento de datos del usuario en localStorage

      // Redirección según el rol del usuario autenticado
      if (usuario.rol === 'admin') {
        router.push('/inicio-admin'); // Redirección a la vista de administrador
      } else if (usuario.rol === 'guia') {
        router.push('/inicio-guia'); // Redirección a la vista del guía
      } else if (usuario.rol === 'cliente') {
        router.push('/inicio-cliente'); // Redirección a la vista del cliente
      }
    } else {
      error.value = 'Credenciales incorrectas. Verifica tu email y contraseña.'; // Mensaje de error en caso de credenciales incorrectas
    }
  } catch (err) {
    console.error('Error en el servidor:', err); // Impresión de error en consola si la solicitud falla
    error.value = 'Error en el servidor. Inténtalo más tarde.'; // Mensaje de error para el usuario en caso de fallo en el servidor
  }
};
</script>


<style scoped>

.contenedor {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
}

.video-fondo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}

.tarjeta {
  background: rgba(0, 0, 0, 0.5); /* Transparencia igual que el footer */
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;
}

h2 {
  margin-bottom: 20px;
  color: #ffffff !important; 
  font-weight: bold;
  text-align: center;
  font-size: 28px;
  text-shadow: 3px 3px 10px rgba(0, 0, 0, 1), 
               -3px -3px 10px rgba(0, 0, 0, 1); 
}

label {
  display: block;
  text-align: left;
  margin: 10px 0 5px;
  color: #ffffff;
}

input.form-control {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  color: #000;
}

button.btn.btn-success {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  transition: 0.3s;
  background: #8b5e3b; /* Verde de Bootstrap */
  color: white;
  border: none;
  border-radius: 5px;
}

button.btn.btn-success:hover {
  background: #218838; /* Verde oscuro de Bootstrap */
  transform: scale(1.05);
}

.alert.alert-info {
  text-align: center;
  font-weight: bold;
}

.registro-texto {
  font-size: 14px;
  color: #0b110a; /* Marrón oscuro basado en la imagen */
  text-align: center;
  font-weight: bold;
}

.enlace-registro {
  color: #28a746; /* Verde oscuro basado en la imagen */
  text-decoration: none;
  font-weight: bold;
}

.enlace-registro:hover {
  text-decoration: underline;
}
</style>
