<template>

</template>

<script>
import axios from "axios";

export default {
  name: "HelloWorld",
  data() {
    return {
      message: "",
      suggestions: [],
      timeout: null,
      searchBar: undefined
    }
  },
  mounted() {
    this.searchBar = document.getElementById("search-bar");

    this.searchBar.addEventListener("keyup", event => {
      clearTimeout(this.timeout);

      this.timeout = setTimeout(() => {
        const input = event.target.value;

        axios
            .get(`https://ws.infotbm.com/ws/1.0/get-schedule/${input}?referer=www`, {headers:{}})
            .then(response => {
              this.suggestions = response.data;
              console.log(response.data);
            }).catch(console.error);
      }, 500);
    });
  },
  methods: {
    onSuggestionClick(suggestion) {
      this.$router.replace({
        name: "Stop",
        params: {
          stop: suggestion
        }
      });

      // axios.get(suggestion.url, {headers: {}})
      //     .then(response => {
      //       response.data.stopPoints.forEach(stopPoint => stopPoint.routes.forEach(route => this.getLineInformations(route.line.id)));
      //     })
      //     .catch(console.error);
    },
    getLineInformations(lineId) {
      axios.get(`https://ws.infotbm.com/ws/1.0/network/line-informations/${lineId}`, {headers: {}})
      .then(response => console.log(response.data.picto))
      .catch(console.error);
    }
  }
}
</script>

<style scoped>

</style>
