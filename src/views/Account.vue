<template>
  <div v-if="user">
    <img src="../assets/id-card.png" alt="id-card" />
    <div class="table">
      <p>{{this.user.name}}</p>
      <p>{{this.user.email}}</p>
      <p>{{this.user.id}}</p>
      <p class="logout" @click="logout">Déconnexion</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Account",
  data() {
    return {
      user: undefined
    }
  },
  async mounted() {
    this.user = JSON.parse(await this.$store.dispatch("getUser"));
  },
  methods: {
    logout() {
      this.$store.dispatch("clearUser");
      this.$router.push("/login");
    }
  }
}
</script>

<style scoped>
img {
  height: 20vh;
}

.logout {
  padding: 2vh 5vw;
  background-color: #ff7675;
  border-radius: 15px;
  cursor: pointer;
}

.logout:hover {
  filter: brightness(0.9);
}
</style>