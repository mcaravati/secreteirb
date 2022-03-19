<template>
  <KeepAlive>
    <Home v-if="!stop && !way" />
  </KeepAlive>
  <Stop :stopProp="stop" v-if="stop && !way" />

  <Way :wayProp="way" v-if="way" />
</template>

<script>
import {emitter} from "../emitter";
import Home from "../components/transports/Home.vue";
import Stop from "../components/transports/Stop.vue";
import Way from "../components/transports/Way.vue";

export default {
  name: "HomeView",
  components: {Way, Stop, Home},
  data() {
    return {
      stop: null,
      way: null
    }
  },
  mounted() {
    emitter.on("waySelected", way => this.way = way);
    emitter.on("stopSelected", stop => this.stop = stop);
  }
}
</script>

<style scoped>
</style>