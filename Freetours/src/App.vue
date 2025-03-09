<template>
  <div class="app">
    <main class="contenido">
      <router-view /> 
    </main>

    <footer class="footer">
      <p>© 2025 Free Tours. Todos los derechos reservados.</p>
    </footer>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.contenido {
  flex-grow: 1; 
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.footer {
  background: rgba(50, 50, 50, 0.6); 
  backdrop-filter: blur(10px); 
  color: #e0e0e0; 
  text-align: center;
  padding: 15px 0;
  font-size: 14px;
  width: 100vw;
  position: fixed;
  bottom: 0;
  left: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.2); 
}
</style>
