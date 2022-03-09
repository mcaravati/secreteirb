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
    <router-link class="to-planning" to="/home">Planning</router-link>
  </footer>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  display: grid;
  grid-template-areas:
    "header"
    "main"
    "footer";
  grid-template-rows: 63px auto 63px;
  grid-auto-flow: dense;

  height: 100vh;
}

html, body {
  margin: 0;
}

header {
  /*background-color: red;*/
  grid-area: header;
}

main {
  /*background-color: blue;*/
  grid-area: main;
  padding: 1%;

  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;

  overflow-y: auto;
  min-height: 0;  /* NEW */
  min-width: 0;   /* NEW; needed for Firefox */
}

footer {
  /*background-color: green;*/
  grid-area: footer;

  border-top: #2c3e50 solid 2px;
  min-height: 0;
  min-width: 0;

  display: grid;
  grid-template-areas: "to-transports to-planning";
  grid-template-columns: 1fr 1fr;
}

.to-planning {
  grid-area: to-planning;
}

.to-transports {
  grid-area: to-transports;
}
</style>
