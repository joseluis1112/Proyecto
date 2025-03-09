<template>
  <div class="background">
    <!-- Video de fondo -->
    <video autoplay muted loop class="video">
      <source src="/videos/12136807_3840_2160_30fps.mp4" type="video/mp4" />
      Tu navegador no soporta videos.
    </video>

    <!-- Tarjeta de registro -->
    <div class="card p-4">
      <h2 class="text-center mb-4">Registro</h2>
      <form @submit.prevent="emitirRegistro">
        <!-- Campo para el nombre del usuario -->
        <div class="mb-3">
          <label for="nombre" class="form-label">Nombre:</label>
          <input type="text" id="nombre" v-model="nombre" class="form-control" required />
        </div>

        <!-- Campo para el correo electrónico -->
        <div class="mb-3">
          <label for="email" class="form-label">Correo Electrónico:</label>
          <input type="email" id="email" v-model="email" class="form-control" required />
        </div>

        <!-- Campo para la contraseña -->
        <div class="mb-3">
          <label for="contrasena" class="form-label">Contraseña:</label>
          <input type="password" id="contrasena" v-model="contrasena" class="form-control" required />
        </div>

        <!-- Botón de registro -->
        <button type="submit" class="btn btn-success w-100">Registrarse</button>
      </form>

      <!-- Mensaje de éxito o error -->
      <p v-if="mensaje" :class="mensajeTipo" class="alert mt-3">{{ mensaje }}</p>

      <!-- Enlace para iniciar sesión -->
      <p class="register-text mt-3 text-center">
        ¿Ya tienes una cuenta?
        <router-link to="/iniciar-sesion" class="link-register">Inicia sesión aquí</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'; // Importamos funciones de Vue 
import { useRouter } from 'vue-router'; // Importamos Vue Router para la navegación
import axios from 'axios'; // Importamos Axios para realizar peticiones HTTP


let nombre = ref(''); // Almacena el nombre del usuario ingresado en el formulario
let email = ref(''); // Almacena el correo electrónico ingresado
let contrasena = ref(''); // Almacena la contraseña ingresada
let mensaje = ref(''); // Contendrá mensajes de éxito o error
let mensajeTipo = ref(''); // Define la clase CSS para mensajes (success o danger)
let router = useRouter(); // Instanciamos Vue Router para manejar la navegación

// Evento personalizado que puede ser emitido para informar sobre el registro
let emit = defineEmits(['registrar-usuario']);

//  FUNCIÓN QUE REGISTRA UN NUEVO USUARIO 
let emitirRegistro = async () => {
  // Construimos el objeto usuario con los datos ingresados
  let usuario = {
    nombre: nombre.value,
    email: email.value,
    contraseña: contrasena.value,
    rol: 'cliente' // Se asigna el rol de cliente por defecto
  };

  try {
    // Enviamos los datos a la API usando una solicitud POST
    let respuesta = await axios.post('http://localhost:8080/api.php/usuarios', usuario, {
      headers: { 'Content-Type': 'application/json' } // Especificamos que enviamos JSON
    });

    // Si la API responde con éxito, mostramos un mensaje y redirigimos al usuario
    if (respuesta.data.status === 'success') {
      mensaje.value = "Registro exitoso. Redirigiendo...";
      mensajeTipo.value = "alert-success";

      // Redirige al usuario después de 2 segundos
      setTimeout(() => {
        router.push('/iniciar-sesion'); // Redirige a la página de inicio de sesión
      }, 2000);
    } else {
      // Si hubo un error en la API, mostramos el mensaje de error
      mensaje.value = "Error en el registro: " + respuesta.data.message;
      mensajeTipo.value = "alert-danger";
    }
  } catch (error) {
    // Si hay un error en la conexión o la API falla, mostramos un mensaje de error
    mensaje.value = "Error al registrar usuario.";
    mensajeTipo.value = "alert-danger";
    console.error('Error:', error);
  }
};
</script>




<style scoped>

.background {
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

.video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}

.card {
  background: rgba(0, 0, 0, 0.5); 
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
  background: #8b5e3b; 
  color: white;
  border: none;
  border-radius: 5px;
}

button.btn.btn-success:hover {
  background: #218838; 
  transform: scale(1.05);
}

.alert.alert-info {
  text-align: center;
  font-weight: bold;
}

.register-text {
  font-size: 14px;
  color: #0b110a; 
  text-align: center;
  font-weight: bold;
}

.link-register {
  color: #28a746; 
  text-decoration: none;
  font-weight: bold;
}

.link-register:hover {
  text-decoration: underline;
}
</style>
