<template>
  <div class="lesson-wrapper">
    <div class="lesson" @click="hideLesson">
      <h6>{{ lesson.type || "Inconnu" }}</h6>
      <h4>{{ lesson.start }} - {{ lesson.end }}</h4>
      <h2>{{ lesson.summary }}</h2>

      <article class="teachers">
        <h6 v-for="teacher in lesson.teachers">
          {{ teacher }}
        </h6>
      </article>

      <article class="rooms">
        <h6 v-for="room in lesson.location">
          {{ room }}
        </h6>
      </article>
    </div>
  </div>
</template>

<script>
import {emitter} from "../../emitter";

export default {
  name: "Lesson",
  props: ["lesson"],
  methods: {
    hideLesson() {
      emitter.emit("lessonSelected", null);
    }
  }
}
</script>

<style scoped>
.lesson {
  background-color: white;
  border-radius: 15px;
  height: 90%;
  width: 80%;
  padding: 1vh 5vw;
  word-break: break-word;
  text-align: start;
  box-sizing: border-box;
}

.lesson h6 {
  background-color: #FEEAEA;
  width: fit-content;
  padding: 1% 5%;
  border-radius: 30px;
  color: #FC3D3E;
}

.lesson h4 {
  margin-bottom: 0;
}

.teachers {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  max-height: 27%;
}

.teachers > h6 {
  margin: 1% 0;
  color: #56B377;
  background-color: #EAF6EE;
}

.rooms {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  max-height: 27%;
}

.rooms > h6 {
  margin: 1% 0;
  color: #FE904A;
  background-color: #FFF2E5;
}

article > h6 {
  font-size: 0.6em;
}

article {
  margin-bottom: 5%;
}

.lesson-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}
</style>