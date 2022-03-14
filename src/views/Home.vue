<template>
  <div class="search-wrapper" v-if="!stop && !way">
    <img alt="search-icon" class="search-icon" src="../assets/search.svg"/>
    <input id="search-bar" type="text">
    <div id="suggestion-wrapper">
      <div class="suggestion" v-bind:key="suggestion" v-for="suggestion in this.suggestions.slice(0, 5)" @click="onSuggestionClick(suggestion)">
        {{suggestion.name}} - {{suggestion.city}}
      </div>
    </div>
  </div>

  <div id="lines-wrapper" v-if="stop && !way">
    <div v-for="line in this.lines" v-bind:key="line" class="line" @click="onLineClick(line)">
      <img :alt="line.transportCode" :src="line.image" class="line-image"/>
      <span>{{ line.destination }}</span>
    </div>
  </div>

  <div class="stop-wrapper" v-if="stop && way">
    <div v-if="this.way" class="stop" @click="closeStopDisplay">
      <img :src="this.way.image" alt="transport-image"/>
      <div class="stop-body">
        <h2>{{ this.way.destination }}</h2>
        <h3>{{ this.arrivalTime }}</h3>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      suggestions: [],
      searchBar: undefined,

      stop: undefined,
      lines: [],

      way: undefined,
      externalCode: undefined,
      arrivalTime: "Loading ...",
      refreshIntervalId: undefined
    }
  },
  mounted() {
    this.setupSearchBar();

  },
  methods: {
    setupSearchBar() {
      this.searchBar = document.getElementById("search-bar");

      // Wait for user to stop typing to send the search request
      this.searchBar.addEventListener("keyup", event => {
        clearTimeout(this.timeout);

        this.timeout = setTimeout(() => {
          const input = event.target.value;

          if (input.length <= 1) {
            this.suggestions = [];
          }

          // Send the search request
          axios
              .get(`https://ws.infotbm.com/ws/1.0/get-schedule/${input}?referer=www`, {headers:{}})
              .then(response => {
                this.suggestions = response.data.filter(e => e.city !== undefined && e.city !== null);
              }).catch(console.error);
        }, 500);
      });
    },
    async onSuggestionClick(value) {
      this.stop = value;
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
    async onLineClick(value) {
      this.way = value;
      axios
          .get(`https://ws.infotbm.com/ws/1.0/stop-points-informations/${this.way.routeId}/${this.way.stopPointId}`)
          .then(response => this.externalCode = response.data.externalCode)
          .catch(console.error);

      this.refreshIntervalId = setInterval(this.refreshArrivalTime, 1000);
    },
    getLineInformations(lineId) {
      return new Promise((resolve, reject) => {
        axios.get(`https://ws.infotbm.com/ws/1.0/network/line-informations/${lineId}`, {headers: {}})
            .then(response => resolve(response.data))
            .catch(reject);
      });
    },
    refreshArrivalTime() {
      if (this.externalCode === undefined)
        return;

      axios
          .get(`https://ws.infotbm.com/ws/1.0/get-realtime-pass/${this.externalCode}/${this.way.transportCode}`)
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
    },
    closeStopDisplay() {
      this.stop = undefined;
      this.way = undefined;

      this.stopRefresh();
    },
    stopRefresh() {
      if (this.refreshIntervalId)
        clearInterval(this.refreshIntervalId);
    }
  },
  unmounted() {
    this.stopRefresh();
  }
}
</script>

<style scoped>
.search-wrapper {
  position: relative;
  width: 90vw;
  margin-top: 15px;
}

.suggestion:hover {
  filter: brightness(0.9);
}

#suggestion-wrapper {
  position: absolute;
  width: 100%;
  display: flex;
  flex-grow: revert;
  flex-direction: column;
}

#search-bar {
  border-radius: 15px;
  font-size: 17px;
  padding: 0 0 0 50px;
  display: block;
  user-select: text;
  outline: none;
  height: 50px;
  border: 0px solid #e5e5e5;
  background-color: white;
  position: relative;
  box-sizing: border-box;
  width: 100%;
}

.suggestion {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  height: 40px;
  border-radius: 15px;
  margin: 1vh 0 0;
  padding: .5vh 0;
  cursor: pointer;
  font-weight: bold;
}

.suggestion:active {
  background-color: #f7f7f7;
  filter: brightness(0.9);
}

a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}

.search-icon {
  left: 7px;
  top: 7px;
  position: absolute;
  width: 40px;
  z-index: 1;
}

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