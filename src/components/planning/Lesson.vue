<template>
  <div class="lesson-wrapper">
    <div class="lesson" @click="hideLesson">
      <h6>{{ getLessonType() || "Inconnu" }}</h6>
      <h4>{{ lesson.start }} - {{ lesson.end }}</h4>
      <h2>{{ lesson.summary }}</h2>

      <article class="teachers">
        <h6 v-for="teacher in getTeachers()">
          {{ teacher }}
        </h6>
      </article>

      <article class="rooms">
        <h6 v-for="room in getRooms()">
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
    getLessonType() {
      return this.lesson.description.split("\n\n")[1].split("\n")[0];
    },
    getTeachers() {
      return this.lesson.description.trim().split("\n").filter(this.isName);
    },
    isName(string) {
      let isName = true;
      const tokens = string.split(" ");
      const containsNumber = string => /\d/.test(string);

      for(let i = 0; i < tokens.length - 2; i++) {
        if ((! isName))
          return false;

        isName = (tokens[i]).toUpperCase() === tokens[i];
      }

      const lastToken = tokens[tokens.length - 1];
      const isFirstLetterUppercase = lastToken.charAt(0) === lastToken.charAt(0).toUpperCase();
      const isSecondLetterLowercase = lastToken.charAt(1) === lastToken.charAt(1).toLowerCase();

      return isName
          && isFirstLetterUppercase
          && isSecondLetterLowercase
          && tokens.length >= 2
          && (!containsNumber(string));
    },
    getRooms() {
      return this.lesson.location.replaceAll("\\", "").split(",");
    },
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