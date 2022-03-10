<template>
  <h2>Please log in</h2>
  <a href="https://cas.bordeaux-inp.fr/login?service=http://mcaravati.vvv.enseirb-matmeca.fr/">Click here</a>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  mounted() {
    const ticket = this.$route.query.ticket;
    if (ticket) {
      axios.get(`https://cas-auth.mcaravati.workers.dev?ticket=${ticket}`)
      .then(response => {
        console.log(response);
      })
    }
  }
}
</script>

<style scoped>

</style>