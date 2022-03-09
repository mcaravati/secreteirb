<template>
  <div id="lines-wrapper">
    <div v-for="line in this.lines" v-bind:key="line" class="line" @click="this.onLineClick(line)">
      <img :alt="line.transportCode" :src="line.image" class="line-image"/>
      <span>{{ line.transportCode }} {{ line.destination }}</span>
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
  mounted() {
    this.$store.dispatch("getSelectedStop")
        .then(stop => {
          this.stop = JSON.parse(stop);
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
              });
        }).catch(console.error);


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