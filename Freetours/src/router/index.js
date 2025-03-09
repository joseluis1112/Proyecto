import { createRouter, createWebHistory } from 'vue-router';
import RegistroView from '../views/RegistroView.vue';
import IniciarSesionView from '../views/IniciarSesionView.vue';
import GestionUsuarios from '../views/GestionUsuarios.vue';
import CreacionRutas from '../views/CreacionRutas.vue';
import GestionRutas from '../views/GestionRutas.vue'; 
import InicioAdmin from '../views/InicioAdmin.vue';
import InicioGuia from '../views/InicioGuia.vue'; 
import VerRutas from '../views/VerRutas.vue'; 
import PasarLista from '../views/PasarLista.vue';
import InicioCliente from '../views/InicioCliente.vue'; 
import VerRutasCliente from '../views/VerRutasCliente.vue';
import MisReservas from '../views/MisReservas.vue'; 
import MisRutas from '../views/MisRutas.vue';

const routes = [
  {
    path: '/',
    redirect: '/iniciar-sesion' 
  },
  {
    path: '/inicio-admin',
    name: 'InicioAdmin',
    component: InicioAdmin,
    meta: { requiresAuth: true }
  },
  {
    path: '/inicio-guia',
    name: 'InicioGuia',
    component: InicioGuia,
    meta: { requiresAuth: true }
  },
  {
    path: '/inicio-cliente',
    name: 'InicioCliente',
    component: InicioCliente,
    meta: { requiresAuth: true }
  },
  {
    path: '/ver-rutas',
    name: 'VerRutas',
    component: VerRutas,
    meta: { requiresAuth: true }
  },
  {
    path: '/ver-rutas-cliente',
    name: 'VerRutasCliente',
    component: VerRutasCliente,
    meta: { requiresAuth: true }
  },
  {
    path: '/mis-reservas',
    name: 'MisReservas',
    component: MisReservas,
    meta: { requiresAuth: true }
  },
  {
    path: '/mis-rutas',
    name: 'MisRutas',
    component: MisRutas,
    meta: { requiresAuth: true }
  },
  {
    path: '/pasar-lista',
    name: 'PasarLista',
    component: PasarLista,
    meta: { requiresAuth: true }
  },
  {
    path: '/registro',
    name: 'Registro',
    component: RegistroView
  },
  {
    path: '/iniciar-sesion',
    name: 'IniciarSesion',
    component: IniciarSesionView
  },
  {
    path: '/gestion-usuarios',
    name: 'GestionUsuarios',
    component: GestionUsuarios,
    meta: { requiresAuth: true }
  },
  {
    path: '/crear-ruta',
    name: 'CreacionRutas',
    component: CreacionRutas,
    meta: { requiresAuth: true }
  },
  {
    path: '/gestion-rutas',
    name: 'GestionRutas',
    component: GestionRutas,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 🔒 Protección de rutas y redirección según autenticación y rol
router.beforeEach((to, from, next) => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!usuario && to.path !== '/iniciar-sesion' && to.path !== '/registro') {
    next('/iniciar-sesion'); // 🔄 Redirige a iniciar sesión si el usuario no está autenticado
  } else if (usuario) {
    if (usuario.rol === 'admin' && to.path.startsWith('/inicio-guia')) {
      next('/inicio-admin');
    } else if (usuario.rol === 'guia' && to.path.startsWith('/inicio-admin')) {
      next('/inicio-guia');
    } else if (usuario.rol === 'cliente' && to.path.startsWith('/inicio-admin')) {
      next('/inicio-cliente');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
