<template>
  <div v-if="this.stop" class="stop-wrapper">
    <div class="stop-header">
      <img :src="this.stop.image" :alt="this.stop.transportCode">
      <span>{{ this.stop.transportCode }} {{ this.stop.destination }}</span>
    </div>
    <h2>{{ this.arrivalTime }}</h2>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MyStop",
  data() {
    return {
      stop: undefined,
      externalCode: undefined,
      arrivalTime: "Loading ...",
      refreshIntervalId: undefined
    }
  },
  mounted() {
    this.$store.dispatch("getSelectedWay").then(stop => {
      this.stop = JSON.parse(stop);

      axios
          .get(`https://ws.infotbm.com/ws/1.0/stop-points-informations/${this.stop.routeId}/${this.stop.stopPointId}`)
          .then(response => this.externalCode = response.data.externalCode)
          .catch(console.error);

      this.refreshIntervalId = setInterval(this.refreshArrivalTime, 1000);
    }).catch(console.error);
  },
  methods: {
    refreshArrivalTime() {
      if (this.externalCode === undefined)
        return;

      axios
          .get(`https://ws.infotbm.com/ws/1.0/get-realtime-pass/${this.externalCode}/${this.stop.transportCode}`)
          .then(response => {
            const destinations = response.data.destinations;

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
          })
          .catch(console.error);
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.stop-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.stop-header > img {
  width: 10vw;
}
</style>