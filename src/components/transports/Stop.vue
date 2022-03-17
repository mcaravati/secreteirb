<template>
  <div id="lines-wrapper">
    <div v-for="line in this.lines" v-bind:key="line" class="line" @click="onLineClick(line)">
      <img :alt="line.transportCode" :src="line.image" class="line-image"/>
      <span>{{ line.destination }}</span>
    </div>
  </div>
</template>

<script>
import {emitter} from "../../emitter";
import axios from "axios";

export default {
  name: "Stop",
  props: ["stopProp"],
  data() {
    return {
      lines: [],
    }
  },
  async mounted() {
    const stopResponse = await axios.get(this.stopProp.url, {headers: {}});

    // Retrieve lines that use this stop
    stopResponse.data.stopPoints.forEach(stopPoint => stopPoint.routes.forEach(async route => {
      const lineResponse = await axios.get(`https://ws.infotbm.com/ws/1.0/network/line-informations/${route.line.id}`, {headers: {}});
      const json = lineResponse.data;

      // I don't know why, but it works differently for tramways
      let code = json.externalCode;
      if (json.type === "Tramway")
        code = json.code;

      this.lines.push({
        routeId: route.id,
        destination: route.name,
        lineId: json.id,
        transportType: json.type,
        transportCode: code,
        image: json.picto,
        stopPointId: stopPoint.id
      });
    }));
  },
  methods: {
    onLineClick(value) {
      emitter.emit("waySelected", value);
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
  margin-top: 15px;
}
</style>