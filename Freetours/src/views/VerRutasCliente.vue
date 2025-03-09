<template>
  <LayoutCliente
    :nombreUsuario="nombreUsuario"
    :iconoSesion="iconoSesion"
    @cerrarSesion="cerrarSesion"
  >
    <!-- Contenedor principal de la búsqueda de rutas -->
    <div class="container mt-3 pt-2">
      <div class="search-card p-2">
        <h1 class="text-center fw-bold mb-2">Ver Rutas Disponibles</h1>
        <div class="search-container d-flex flex-column align-items-center">
          <input type="text" v-model="localidad" placeholder="Introduce la localidad" class="form-control w-50" />
          <input type="date" v-model="fecha" class="form-control w-50 mt-1" />
          <button @click="buscarRutas" class="btn btn-brown mt-1">Buscar</button>
        </div>
      </div>

      <!-- Sección donde se muestran las rutas disponibles -->
      <div class="routes-container mt-2 d-flex flex-wrap justify-content-center">
        <p v-if="rutas.length === 0" class="text-white text-center w-100">No hay rutas disponibles para esta búsqueda.</p>
        
        <div v-for="ruta in rutasFiltradas" :key="ruta.id" class="route-card card p-1">
          <div class="card-body text-center">
            <h6 class="card-title">{{ ruta.titulo }}</h6>
            <p class="card-text small"><strong>Fecha:</strong> {{ ruta.fecha }}</p>
            <p class="card-text small"><strong>Hora:</strong> {{ ruta.hora }}</p>
            <button class="btn btn-orange btn-sm" @click="verDetalles(ruta)">Ver más</button>

            <div v-if="usuario" class="mt-1">
              <label class="etiqueta-num-asistentes text-center">Número de asistentes:</label>
              <select v-model="numPersonas[ruta.id]" class="form-control w-75 mx-auto form-control-sm">
                <option v-for="n in 8" :key="n" :value="n">{{ n }}</option>
              </select>
              <button class="btn btn-brown btn-sm mt-1 boton-reserva" @click="reservarRuta(ruta)">Reservar</button>
            </div>

            <p v-else class="text-warning small mt-1">Regístrate para poder reservar rutas.</p>
          </div>
        </div>
      </div>
    </div>

<!-- Modal de detalles de la ruta seleccionada -->
<div v-if="rutaSeleccionada" class="modal" @click.self="cerrarModal">
  <div class="modal-content">
    <h2>{{ rutaSeleccionada.titulo }}</h2>
    <p><strong>Fecha:</strong> {{ rutaSeleccionada.fecha }}</p>
    <p><strong>Hora:</strong> {{ rutaSeleccionada.hora }}</p>
    <p><strong>Descripción:</strong> {{ rutaSeleccionada.descripcion }}</p>

    <!-- Mostrar la imagen solo si existe -->
    <div class="modal-image-container" v-if="rutaSeleccionada.foto">
      <img :src="rutaSeleccionada.foto" 
           :key="rutaSeleccionada.foto"
           alt="Imagen de la ruta" 
           class="modal-image"/>
    </div>

    <button @click="cerrarModal" class="btn btn-secondary btn-sm mt-2">Cerrar</button>
  </div>
</div>



  </LayoutCliente>
</template>

<script setup>
import { ref, computed } from 'vue'; // Importamos las funciones de Vue para manejar el estado
import { useRouter } from 'vue-router'; // Importamos Vue Router para la navegación
import LayoutCliente from '@/components/LayoutCliente.vue'; // Importamos el layout del cliente

// Instanciamos Vue Router para manejar la navegación
let router = useRouter();

// Variables reactivas (estado) con ref()
let localidad = ref(''); // Almacena la localidad ingresada en el input
let fecha = ref(''); // Almacena la fecha seleccionada en el input
let rutas = ref([]); // Contiene la lista de rutas obtenidas desde la API
let rutaSeleccionada = ref(null); // Contiene la información de la ruta seleccionada para el modal
let usuario = ref(JSON.parse(localStorage.getItem('usuario'))); // Recupera el usuario de localStorage
let numPersonas = ref({}); // Objeto que almacena el número de personas que reservarán una ruta

// Información del usuario
let nombreUsuario = 'Cliente';
let iconoSesion = '/icono/icono.png'; // Icono de sesión del usuario

//  FUNCIÓN QUE OBTIENE LAS RUTAS DESDE LA API 
let buscarRutas = async () => {
  try {
    // Validación: si el usuario no introduce una localidad, muestra un mensaje
    if (!localidad.value.trim()) {
      alert('Introduce una localidad válida.');
      return;
    }

    // Construcción de la URL que obtiene obtener rutas según la localidad y fecha
    let url = `http://localhost:8080/api.php/rutas?localidad=${encodeURIComponent(localidad.value)}`;
    if (fecha.value) {
      url += `&fecha=${encodeURIComponent(fecha.value)}`;
    }

    // Realiza la solicitud GET a la API
    let response = await fetch(url);

    // Si la respuesta no es válida, lanza un error
    if (!response.ok) {
      throw new Error('Error al obtener rutas');
    }

    // Convierte la respuesta en JSON y la almacena en la variable `rutas`
    let data = await response.json();
    rutas.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error al obtener rutas:', error);
    rutas.value = []; // En caso de error, limpia la lista de rutas
  }
};

//  COMPUTED: FILTRAR RUTAS SEGÚN LA LOCALIDAD 
let rutasFiltradas = computed(() => {
  return rutas.value.filter(ruta => ruta.localidad.toLowerCase() === localidad.value.toLowerCase());
});

//  FUNCIÓN QUE MUESTRA LOS DETALLES DE UNA RUTA EN EL MODAL 
let verDetalles = (ruta) => {
  // Asigna los datos de la ruta seleccionada a la variable `rutaSeleccionada`
  rutaSeleccionada.value = {
    ...ruta,
    foto: ruta.foto && ruta.foto.trim() !== '' 
      ? `http://localhost:8080/rutas/${ruta.foto}` // Construye la URL de la imagen si existe
      : null // Si no hay imagen, asigna `null`
  };

  console.log("📌 Foto generada para el modal:", rutaSeleccionada.value.foto); // Depuración en consola
};

//  FUNCIÓN QUE CIERRA EL MODAL DE DETALLES 
let cerrarModal = () => {
  rutaSeleccionada.value = null; // Restablece la variable, cerrando el modal
};

// 🔹 FUNCIÓN QUE REALIZA REALIZAR UNA RESERVA 🔹
let reservarRuta = async (ruta) => {
  try {
    // Validación: Si el usuario no ha seleccionado un número de asistentes, muestra un mensaje
    if (!numPersonas.value[ruta.id]) {
      alert("Selecciona el número de asistentes.");
      return;
    }

    // Datos a enviar a la API
    let reservaData = {
      email: usuario.value.email, // Email del usuario
      ruta_id: ruta.id, // ID de la ruta seleccionada
      num_personas: numPersonas.value[ruta.id] // Número de personas seleccionadas
    };

    // Enviar la solicitud POST a la API para hacer la reserva
    let response = await fetch('http://localhost:8080/api.php/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // Indica que se envía JSON
      body: JSON.stringify(reservaData) // Convierte los datos en JSON
    });

    let data = await response.json(); // Convierte la respuesta en JSON

    // Manejo de respuesta: si la reserva fue exitosa, redirige a "Mis Reservas"
    if (data.status === 'success') {
      alert('Reserva realizada con éxito');
      router.push('/mis-reservas'); // Redirige a la página de reservas del usuario
    } else {
      alert('Error al realizar la reserva');
    }
  } catch (error) {
    console.error('Error al reservar ruta:', error);
    alert('No se pudo realizar la reserva.'); // Muestra un mensaje de error
  }
};

// 🔹 FUNCIÓN QUE CIERRA SESIÓN 🔹
let cerrarSesion = () => {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    localStorage.removeItem('usuario'); // Elimina los datos del usuario del almacenamiento local
    router.push('/iniciar-sesion'); // Redirige a la pantalla de inicio de sesión
  }
};
</script>






<style scoped>
@import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');




.search-container {
  margin-bottom: 5px; 
}
.route-card {
  margin: 1px; 
  padding: 2px; 
  width: 200px; 
  height: 300px; 
  font-size: 11px; 
  position: relative;
  background: rgba(0, 0, 0, 0.8); 
  border-radius: 8px;
  color: white;
}

.btn-brown {
  background-color: #8b5e3b;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 12px;
  border-radius: 5px;
  transition: 0.3s;
  margin-top: 3px;
}

.btn-brown:hover {
  background-color: #5e3b1f;
}

.routes-container{
  gap: 1px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-bottom: 100px;
  position: relative;
}

.search-card {
  background: rgba(0, 0, 0, 0.6);
  padding: 20px;
  border-radius: 8px;
  margin-top: -50px
}


.search-card h1 {
  font-size: 36px;
  margin-bottom: 50px; 
  text-align: center;
  color: white;
}

.search-container {
  margin-top: 20px; 
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px; 
}



.btn-orange {
  background-color: #ff9800;
  color: white;
  border: none;
  padding: 4px 8px; 
  font-size: 12px;
  border-radius: 5px;
  transition: 0.3s;
  margin-top: 3px;
}

.btn-orange:hover {
  background-color: #e68900;
}
.boton-reserva {
  position: relative;
  z-index: 10;
  margin-top: 10px; 
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7); 
}

.modal-content {
  background: #5e3b1f; 
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  max-width: 400px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  border: 2px solid #ff9800; 
}

.modal-content h2 {
  color: #ffcc80; 
  font-size: 22px;
  margin-bottom: 10px;
}


.modal-content .btn-secondary {
  background-color: #ff9800;
  color: white;
  border: none;
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 5px;
  transition: 0.3s;
  margin-top: 10px;
}

.modal-content .btn-secondary:hover {
  background-color: #e68900;
}

.modal-image-container img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  border: 2px solid #ff9800; 
  box-shadow: 0 2px 8px rgba(255, 152, 0, 0.5); 
  margin-top: 10px;
}

</style>
