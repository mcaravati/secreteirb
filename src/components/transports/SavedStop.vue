<template>
 <div class="way">
   <img :src="this.stop.image" alt="transport-image"/>
   <h3>{{ this.stop.destination }} : {{ this.arrivalTime || "Chargement ..."}}</h3>
 </div>
</template>

<script>
import axios from "axios";

export default {
  name: "SavedStop",
  props: ["stop"],
  data() {
    return {
      refreshIntervalId: null,
      externalCode: null,
      arrivalTime: null
    }
  },
  async mounted() {
    let response = await axios.get(`https://ws.infotbm.com/ws/1.0/stop-points-informations/${this.stop.routeId}/${this.stop.stopPointId}`);
    this.externalCode = response.data.externalCode;

    this.refreshIntervalId = setInterval(this.refreshArrivalTime, 1000);
  },
  methods: {
    async refreshArrivalTime() {
      // Get current transport's informations
      const response = await axios.get(`https://ws.infotbm.com/ws/1.0/get-realtime-pass/${this.externalCode}/${this.stop.transportCode}`, {headers:{}});
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
    }
  },
  unmounted() {
    clearInterval(this.refreshIntervalId);
  }
}
</script>

<style scoped>
.way {
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 1vh 0;
  background-color: white;
  padding: 0 4vw 0 0;
  border-radius: 10px;
  height: 40px;
  overflow: hidden;
  align-items: center;
}

.way > img {
  height: 100%;
}

.way > h3 {
  font-size: smaller;
}
</style>