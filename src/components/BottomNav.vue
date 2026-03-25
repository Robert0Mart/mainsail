<template>
  <nav class="bottom-navbar">
    <ul class="nav-list">
      <li><router-link to="/" class="nav-link">Início</router-link></li>
      <li><router-link to="/sobre" class="nav-link">Sobre</router-link></li>
      <li><router-link to="/contactos" class="nav-link">Contactos</router-link></li>
    </ul>
  </nav>
</template>

<script setup>
// Não precisa de lógica extra para este exemplo básico
// Pode adicionar emits ou props conforme necessário
</script>

<style scoped>
.bottom-navbar {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50px;
  padding: 12px 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 30px;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 16px;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* Responsivo para ecrãs pequenos */
@media (max-width: 768px) {
  .bottom-navbar {
    bottom: 15px;
    padding: 10px 20px;
  }
  
  .nav-list {
    gap: 20px;
  }
  
  .nav-link {
    font-size: 14px;
    padding: 6px 12px;
  }
}
</style>
