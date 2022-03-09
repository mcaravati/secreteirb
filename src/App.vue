<script setup>
</script>

<template>
  <header>
    <h1>Secrét'eirb</h1>
  </header>

  <main>
    <router-view></router-view>
  </main>

  <footer>
    <router-link class="to-transports" to="/">Transports</router-link>
    <router-link class="to-planning" to="/planning">Planning</router-link>
  </footer>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  display: flex;
  flex-direction: column;

  height: 100vh;
}

html, body {
  margin: 0;
}

header {
  height: 65px;
  text-align: center;
}

main {
  overflow-y: auto;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
}

footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 65px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
}
</style>
