<template>
  <div class="home-wrapper">
    <Search />

    <div class="saved-stops-wrapper" v-if="!searching && (savedStops.length > 0)">
      <h2>Arrêts sauvegardés</h2>
      <SavedStop v-for="way in this.savedStops" key="way" :stop="way" />
    </div>
  </div>
</template>

<script>
import Search from "./Search.vue";
import {emitter} from "../../emitter";
import SavedStop from "./SavedStop.vue";

export default {
  name: "Home",
  components: {SavedStop, Search},
  data() {
    return {
      searching: false,
      savedStops: []
    }
  },
  async mounted() {
    emitter.on("searchStarted", () => this.searching = true);
    emitter.on("searchStopped", () => this.searching = false);

    this.savedStops = await this.$store.dispatch("getSavedStops");
  }
}
</script>

<style scoped>
.home-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.saved-stops-wrapper {
  width: 90vw;
}
</style>