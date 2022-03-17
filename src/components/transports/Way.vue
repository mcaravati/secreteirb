<template>
  <div class="stop-wrapper">
    <div v-if="this.wayProp" class="stop" @click="closeStopDisplay">
      <img :src="this.wayProp.image" alt="transport-image"/>
      <div class="stop-body">
        <h2>{{ this.wayProp.destination }}</h2>
        <h3>{{ this.arrivalTime || "Chargement ..."}}</h3>

        <div class="save-button saved" v-if="saved" @click="unsave">
          Oublier
        </div>

        <div class="save-button" v-if="!saved" @click="save">
          Sauvegarder
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {emitter} from "../../emitter";
import axios from "axios";

export default {
  name: "Way",
  props: ["wayProp"],
  data() {
    return {
      externalCode: null,
      arrivalTime: null,
      refreshIntervalId: null,
      saved: false
    }
  },
  async mounted() {
    let response = await axios.get(`https://ws.infotbm.com/ws/1.0/stop-points-informations/${this.wayProp.routeId}/${this.wayProp.stopPointId}`);
    this.externalCode = response.data.externalCode;

    this.refreshIntervalId = setInterval(this.refreshArrivalTime, 1000);
    this.saved = await this.$store.dispatch("isSaved", this.wayProp);
  },
  methods: {
    async refreshArrivalTime() {
      // Get current transport's informations
      const response = await axios.get(`https://ws.infotbm.com/ws/1.0/get-realtime-pass/${this.externalCode}/${this.wayProp.transportCode}`, {headers:{}});
      const destinations = response.data.destinations;

      // Might be a TransGironde bus
      if (!destinations) {
        this.arrivalTime = "Pas de suivi en temps réel pour ce transporteur :(";
        clearInterval(this.refreshIntervalId);
        return;
      }

      const stopDestination = destinations[Object.keys(destinations)[0]];

      if (stopDestination.length === 0) {
        this.arrivalTime = "Plus de transports :(";
        return;
      }

      this.arrivalTime = stopDestination[0].waittime_text;
    },
    closeStopDisplay() {
      clearInterval(this.refreshIntervalId);

      emitter.emit("stopSelected", null);
      emitter.emit("waySelected", null);
    },
    async save() {
      this.$store.commit("addSavedStop", this.wayProp);
      this.saved = true;
    },
    async unsave() {
      this.$store.commit("removeSavedStop", this.wayProp);
      this.saved = false;
    }
  },
  unmounted() {
    clearInterval(this.refreshIntervalId);
  }
}
</script>

<style scoped>
.stop-wrapper {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  width: 100%;
  flex-direction: column;
}

.stop-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.stop {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  border-radius: 15px;
  height: 90%;
  width: 80%;
  word-break: break-word;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

.stop-body {
  padding: 1vh 5vw;
  position: absolute;
  top: 20%;
  background-color: white;
  border-top: 1px solid lightgray;
  height: 50%;
  border-radius: 15px;
}

.stop > img {
  position: absolute;
  top: 0;
}

.save-button {
  width: 100%;
  border-radius: 10px;
  padding: 2vh 1vw;
  background-color: #55efc4;
}

.saved {
  background-color: #ff7675;
}
</style>