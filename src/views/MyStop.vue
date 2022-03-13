<template>
  <div class="stop-wrapper">
    <div v-if="this.stop" class="stop">
      <img :src="this.stop.image" alt="transport-image"/>
      <div class="stop-body">
        <h2>{{ this.stop.destination }}</h2>
        <h3>{{ this.arrivalTime }}</h3>
      </div>
    </div>
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
  async mounted() {
    this.stop = JSON.parse(await this.$store.dispatch("getSelectedWay"));
    console.log(this.stop);

    axios
        .get(`https://ws.infotbm.com/ws/1.0/stop-points-informations/${this.stop.routeId}/${this.stop.stopPointId}`)
        .then(response => this.externalCode = response.data.externalCode)
        .catch(console.error);

    this.refreshIntervalId = setInterval(this.refreshArrivalTime, 1000);
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
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
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
</style>