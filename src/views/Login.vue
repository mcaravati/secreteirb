<template>
  <div class="login-wrapper">
    <img class="illustration" src="../assets/authentication.svg" alt="auth-illustration" />
    <div>
      <h2>Connectez-vous</h2>
      <h5>pour accéder à votre planning</h5>
      <a href="https://cas.bordeaux-inp.fr/login?service=http://mcaravati.vvv.enseirb-matmeca.fr/">Authentification CAS</a>
    </div>
  </div>

</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      username: null,
      name: null,
      email: null
    }
  },
  async mounted() {
    await this.getUsername(this.$route.query.ticket);
  },
  methods: {
    async getUserData() {
      if (!this.username)
        return;

      const response = await axios.get(`https://cas-directory.mcaravati.workers.dev/?user=${this.username}`, {headers:{}});
      this.user = response.data;

      this.$store.dispatch("setUser", JSON.stringify(this.getUser()));
      await this.$router.push("/planning");
    },
    async getUsername(ticket) {
      if (!ticket)
        return undefined;

      const response = await axios.get(`https://cas-auth.mcaravati.workers.dev?ticket=${ticket}`, {headers:{}});
      const XMLdata = response.data;
      const parser = new DOMParser();

      const doc = parser.parseFromString(XMLdata, "application/xml");
      this.username = doc.getElementsByTagName("cas:user")[0].childNodes[0].nodeValue;
      await this.getUserData();
    },
    getUser() {
      return {
        username: this.username,
        name: this.user.name,
        email: this.user.email,
        id: this.user.id
      };
    }
  },
}
</script>

<style scoped>
.illustration {
  height: 30vh;
}

a {
  text-decoration: none;
  color: black;
  max-width: 70vw;
  padding: 2vh 5vw;
  background-color: lightblue;
  border-radius: 12px;
}

a:visited {
  color: black;
  text-decoration: none;
  outline: none;
}

h2 {
  margin-bottom: 0;
}

h5 {
  margin-top: 1vh;
}

.login-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80%;
}
</style>