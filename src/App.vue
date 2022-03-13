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
    <router-link to="/">Transports</router-link>
    <router-link to="/planning">Planning</router-link>
    <router-link to="/me">Profil</router-link>
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

  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
}

html, body {
  margin: 0;
  background-color: #EBEFF5;
}

header {
  height: 65px;
  text-align: center;
  border-radius: 0 0 15px 15px;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

main {
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 90%;
}

footer {
  width: 100%;
  height: 65px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  background-color: white;
  border-radius: 15px 15px 0 0;
  overflow: hidden;
}

footer a {
  width: 100%;
  box-sizing: border-box;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  text-decoration: none;
}

.router-link-active {
  background-color: #E5E5E5;
}

h1 {
  margin: 0;
}
</style>
