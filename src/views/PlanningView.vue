<template>
  <Planning :planningManager="planningManager" v-if="planningManager && !lesson" />
  <Lesson :lesson="lesson" v-if="lesson" />
</template>

<script>
import {emitter} from "../emitter";
import Planning from "../components/planning/Planning.vue";
import Lesson from "../components/planning/Lesson.vue";
import PlanningManager from "../PlanningManager";

export default {
  name: "PlanningView",
  components: {Lesson, Planning},
  data() {
    return {
      lesson: null,
      planningManager: null
    }
  },
  async mounted() {
    emitter.on("lessonSelected", lesson => this.lesson = lesson);
    this.planningManager = new PlanningManager(JSON.parse(await this.$store.dispatch("getUser")));
    await this.planningManager.getCurrentWeek();
  }
}
</script>

<style scoped>
</style>