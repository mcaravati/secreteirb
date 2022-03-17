<template>
  <div class="search-wrapper">
    <img alt="search-icon" class="search-icon" src="../../assets/search.svg"/>
    <input id="search-bar" type="text">

    <div id="suggestion-wrapper">
      <div class="suggestion" v-bind:key="suggestion" v-for="suggestion in this.suggestions.slice(0, 5)" @click="onSuggestionClick(suggestion)">
        {{suggestion.name}} - {{suggestion.city}}
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {emitter} from "../../emitter";

export default {
  name: "Search",
  data() {
    return {
      suggestions: [],
      searchBar: undefined,
    }
  },
  mounted() {
    // Store the search bar HTML element for future use
    this.searchBar = document.getElementById("search-bar");
    this.searchBar.addEventListener("focus", async event => {
      this.onFocus();
      await this.search(event);
      });
    this.searchBar.addEventListener("blur", this.onBlur);

    // Wait for user to stop typing to send the search request
    this.searchBar.addEventListener("keyup", event => {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(async () => await this.search(event), 500);
    });
  },
  methods: {
    onSuggestionClick(value) {
      emitter.emit("stopSelected", value);
    },
    onBlur() {
      if (this.suggestions.length === 0) {
        this.suggestions = [];
        emitter.emit("searchStopped");
      }
    },
    onFocus() {
      emitter.emit("searchStarted");
    },
    async search(event) {
      const input = event.target.value;

      if (input.length <= 1) {
        this.suggestions = [];
      }

      // Send the search request
      const response = await axios.get(`https://ws.infotbm.com/ws/1.0/get-schedule/${input}?referer=www`, {headers: {}});
      this.suggestions = response.data.filter(e => e.city !== undefined && e.city !== null);
    }
  }
}
</script>

<style scoped>
.search-wrapper {
  position: relative;
  width: 90vw;
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
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
</style>