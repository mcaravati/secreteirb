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
    <router-link to="/">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M17 20H7v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-1H3v-8H2V8h1V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3h1v4h-1v8h-1v1a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1zM5 5v9h14V5H5zm0 11v2h4v-2H5zm10 0v2h4v-2h-4z"/></svg>
    </router-link>
    <router-link to="/planning">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M17 3h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4V1h2v2h6V1h2v2zM4 9v10h16V9H4zm2 2h2v2H6v-2zm0 4h2v2H6v-2zm4-4h8v2h-8v-2zm0 4h5v2h-5v-2z"/></svg>
    </router-link>
    <router-link to="/me">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M2 3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H2.992A.993.993 0 0 1 2 20.007V3.993zM4 5v14h16V5H4zm2 2h6v6H6V7zm2 2v2h2V9H8zm-2 6h12v2H6v-2zm8-8h4v2h-4V7zm0 4h4v2h-4v-2z"/></svg>
    </router-link>
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
  text-transform: uppercase;
}

.router-link-active {
  background-color: #E5E5E5;
}

h1 {
  margin: 0;
  text-transform: uppercase;
  font-family: OstrichSans,sans-serif;
  text-decoration: underline overline;
  font-size: 40px;
}

@font-face {
  font-family: OstrichSans;
  src: url("./assets/OstrichSans-Heavy.otf") format("opentype");
}

</style>
