<template>
  <div class="user-wrapper">
    <div v-if="user" class="user">
      <div class="user-body">
        <img src="../assets/id-card.png" alt="id-card" />
        <div class="table">
          <h2>{{this.user.name}}</h2>
          <p>{{this.user.email}}</p>
        </div>
      </div>

      <div class="logout" @click="logout">
        Déconnexion
      </div>
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
  cursor: pointer;
  width: 100%;
}

.logout:hover {
  filter: brightness(0.9);
}

.user {
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  height: 80%;
  width: 80%;
  padding: 0 5vw;
  border-radius: 15px;
  word-break: break-word;
  box-sizing: border-box;
  overflow: hidden;
}

.user-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.user-body {
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}
</style>