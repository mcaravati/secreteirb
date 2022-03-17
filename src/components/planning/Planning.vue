<template>
  <div class="planning-view" v-if="planningData">
    <section>
      <span class="button" @click="this.planningManager.getPreviousDay"><img src="../../assets/chevron-left-solid.svg" alt="chevron-left"></span>
      <h4>{{ this.planningData.utc }}</h4>
      <span class="button" @click="this.planningManager.getNextDay"><img src="../../assets/chevron-right-solid.svg" alt="chevron-right"></span>
    </section>

    <div class="planning-view">
      <div
          v-for="value in this.planningData.events"
          class="event"
          @click="displayLesson(value)"
      >
        <h6>{{ value.start }} - {{ value.end }}</h6>
        <h4>{{ value.summary }}</h4>
      </div>
    </div>
  </div>
</template>

<script>
import {emitter} from "../../emitter";

export default {
  name: "Planning",
  props: ["planningManager"],
  data() {
    return {
      planningData: null
    }
  },
  mounted() {
    emitter.on("planningDataUpdate", planningData => this.planningData = planningData);
    this.planningManager.update();
  },
  methods: {
    displayLesson(value) {
      emitter.emit("lessonSelected", value);
    }
  }
}
</script>

<style scoped>
.event {
  display: flex;
  flex-direction: column;
  background-color: white;
  margin: 2vh 0;
  padding: 2vh 5vw;
  border-radius: 10px;
  align-items: flex-start;
  text-align: start;
}
.event:hover {
  filter: brightness(1.1);
}

.event > span:first-child {
  margin-bottom: 1vh;
  margin-top: 0;
}

.event > span {
  margin-top: 1vh;
  margin-bottom: 0;
}

.event > span:last-child {
  font-size: smaller;
}

.event:active {
  background-color: #f7f7f7;
  filter: brightness(0.9);
}

section > span.button {
  width: 2vw;
  min-width: unset;
  padding: 1vh 4vw;
  background-color: white;
  border-radius: 10px;
}

section {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 5%;
}

.planning-wrapper {
  max-width: 80vw;
}

.planning-view {
  width: 80vw;
}

.planning-view h6 {
  margin-bottom: 0;
  margin-top: 0.5em;
}

.planning-view h4 {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
</style>