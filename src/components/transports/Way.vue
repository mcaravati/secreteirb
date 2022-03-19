<template>
  <div class="stop-wrapper">
    <div v-if="this.wayProp" class="stop" @click="closeStopDisplay">
      <div class="stop-body">
        <h4>{{ this.wayProp.stopName }}</h4>
        <h3>{{ this.wayProp.destination }}</h3>

        <div class="arrival-wrapper">
          <h3 class="arrival" v-for="arrivalTime in arrivalTimes">{{ arrivalTime.text || "Chargement ..." }}</h3>
        </div>
      </div>
      <div class="save-button saved" v-if="saved" @click="unsave">
        Oublier
      </div>
      <div class="save-button" v-else @click="save">
        Sauvegarder
      </div>
    </div>
  </div>
</template>

<script>
import {emitter} from "../../emitter";
import axios from "axios";
import moment from "moment";

export default {
  name: "Way",
  props: ["wayProp"],
  data() {
    return {
      externalCode: null,
      arrivalTimes: [],
      refreshIntervalId: null,
      saved: false
    }
  },
  async mounted() {
    let response = await axios.get(`https://ws.infotbm.com/ws/1.0/stop-points-informations/${this.wayProp.routeId}/${this.wayProp.stopPointId}`);
    this.externalCode = response.data.externalCode;

    await this.refreshArrivalTime();
    this.refreshIntervalId = setInterval(this.refreshArrivalTime, 1000);
    this.saved = await this.$store.dispatch("isSaved", this.wayProp);
  },
  methods: {
    async refreshArrivalTime() {
      let arrivalTimes = [];

      // Get current transport's informations
      const response = await axios.get(`https://ws.infotbm.com/ws/1.0/get-realtime-pass/${this.externalCode}/${this.wayProp.transportCode}`, {headers:{}});
      const destinations = response.data.destinations;

      // Might be a TransGironde bus
      if (!destinations) {
        arrivalTimes.push("Pas de suivi en temps réel pour ce transporteur :(");
        clearInterval(this.refreshIntervalId);
        return;
      }

      Object.values(destinations).forEach(stopDestination => {
        if (stopDestination.length === 0) {
          arrivalTimes.push("Plus de transports :(");
          return;
        }

        stopDestination.forEach(x => arrivalTimes.push({
          text: x.waittime_text,
          moment: moment(x.waittime, "HH:mm:ss")
        }));
      });

      arrivalTimes.sort((a, b) => a.moment.diff(b.moment));
      this.arrivalTimes = arrivalTimes;
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
  background-color: white;
  border-radius: 15px 15px 0 0;
  height: 100%;
  width: 100%;
}

.save-button {
  width: 100%;
  padding: 2vh 1vw;
  background-color: #55efc4;
  cursor: pointer;
}

.arrival-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.arrival {
  background-color: #dcdde1;
  width: 80%;
  padding: 1vh 1vw;
  border-radius: 10px;
  margin-top: 0;
}

.saved {
  background-color: #ff7675;
}

.stop-body + h4 {
  margin-bottom: 2%;
}

.stop-body + h3 {
  margin-top: 0;
}
</style>