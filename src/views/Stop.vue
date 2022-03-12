<template>
  <div id="lines-wrapper">
    <div v-for="line in this.lines" v-bind:key="line" class="line" @click="this.onLineClick(line)">
      <img :alt="line.transportCode" :src="line.image" class="line-image"/>
      <span>{{ line.destination }}</span>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Stop",
  data() {
    return {
      stop: undefined,
      lines: []
    }
  },
  async mounted() {
    this.stop = JSON.parse(await this.$store.dispatch("getSelectedStop"));
    const response = await axios.get(this.stop.url, {headers: {}});

    response.data.stopPoints.forEach(stopPoint => stopPoint.routes.forEach(async route => {
      const json = await this.getLineInformations(route.line.id);
      this.lines.push({
        routeId: route.id,
        destination: route.name,
        lineId: json.id,
        transportType: json.type,
        transportCode: json.code,
        image: json.picto,
        stopPointId: stopPoint.id
      });
    }));
  },
  methods: {
    getLineInformations(lineId) {
      return new Promise((resolve, reject) => {
        axios.get(`https://ws.infotbm.com/ws/1.0/network/line-informations/${lineId}`, {headers: {}})
            .then(response => resolve(response.data))
            .catch(reject);
      });
    },
    onLineClick(line) {
      this.$store.dispatch("setSelectedWay", JSON.stringify(line));
      this.$store.dispatch("clearSelectedStop");

      this.$router.push("mystop");
    }
  }
}
</script>

<style scoped>
.line-image {
  height: 100%;
}

.line {
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  width: 90%;
  margin: 1vh 0;
  background-color: white;
  padding: 0 4vw 0 0;
  border-radius: 10px;
  cursor: pointer;
  height: 40px;
  overflow: hidden;
  align-items: center;
}

.line:active {
  background-color: #f7f7f7;
  filter: brightness(0.9);
}

#lines-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>