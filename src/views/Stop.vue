<template>
  <div id="lines-wrapper">
    <div class="line" v-bind:key="line" v-for="line in this.lines" @click="this.onLineClick(line)">
      <img class="line-image" :src="line.image" :alt="line.transportCode" />
      <span>{{line.transportCode}} {{line.destination}}</span>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Stop",
  props: {
    stopProp: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      stop: JSON.parse(this.stopProp),
      lines: []
    }
  },
  mounted() {
    axios.get(this.stop.url, {headers: {}})
        .then(response => {
          response.data.stopPoints.forEach(stopPoint => stopPoint.routes.forEach(route => {
            this.getLineInformations(route.line.id)
            .then(json => {
              this.lines.push({
                routeId: route.id,
                destination: route.name,
                lineId: json.id,
                transportType: json.type,
                transportCode: json.code,
                image: json.picto,
                stopPointId: stopPoint.id
              });
            })
          }));
        })
        .catch(console.error);
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
      this.$router.push({
        name: "MyStop",
        params: {
          stopProp: JSON.stringify(line)
        }
      });
    }
  }
}
</script>

<style scoped>
.line-image {
  width: 7vw;
}

.line {
  display: flex;
  justify-content: space-between;
  width: 90%;
  margin: 1vh 0;
  padding: 2vh 2vw;
  background-color: #e5e5e5;
  border-radius: 7px;
  cursor: pointer;
}

.line:hover {
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