<template>
    <div class="planning-view" v-if="!displayingLesson">
      <section>
        <span class="button" @click="getPreviousDay"><img src="../assets/chevron-left-solid.svg" alt="chevron-left"></span>
        <h4 v-if="planning_data">{{ this.planning_data.utc }}</h4>
        <span class="button" @click="getNextDay"><img src="../assets/chevron-right-solid.svg" alt="chevron-right"></span>
      </section>

      <div class="planning-view" v-if="planning_data">
          <div
              v-for="value in this.planning_data.events"
              class="event"
              @click="displayLesson(value)"
          >
            <h6>{{ value.start }} - {{ value.end }}</h6>
            <h4>{{ value.summary }}</h4>
          </div>
      </div>
    </div>

    <div class="lesson-wrapper" v-if="displayingLesson">
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
import {getWeek} from "../service/PlanningService";
import moment from 'moment';
import axios from "axios";

export default {
  name: "Planning",
  data() {
    return {
      currentPlanningName: "",
      planning_data: [],
      cache: [],
      currentObjectIndex: 0,
      moment: moment(),
      dayIndex: -1,

      user: null,

      displayingLesson: false,
      lesson: null
    }
  },
  async mounted() {
    await this.loadUser();
    await this.getCurrentWeek();

    if (this.dayIndex === -1) {
      this.getNextWeek();
    }
  },
  methods: {
    findTodayInWeek() {
      let todayDate = this.moment.format("DD/MM/YYYY");
      this.dayIndex = this.cache.findIndex(x => x.utc === todayDate);
    },
    getPreviousDay() {
      if (this.dayIndex <= 0) {
        this.getPreviousWeek();
        return;
      }

      this.dayIndex -= 1;
      this.planning_data = this.cache[this.dayIndex];
    },
    getNextDay() {
      if (this.dayIndex === this.cache.length - 1) {
        this.getNextWeek();
        return;
      }

      this.dayIndex += 1;
      this.planning_data = this.cache[this.dayIndex];
    },
    getPreviousWeek() {
      this.moment.subtract(1, "weeks");

      const payload = {
        id: this.user.id,
        weekId: this.moment.format("W-YYYY")
      };

      getWeek(payload).then(data => {
        if (data.length === 0) {
          this.cache = [[]];
        } else {
          this.cache = data;
        }
        this.dayIndex = this.cache.length - 1;
        this.planning_data = this.cache[this.dayIndex];
      });
    },
    getNextWeek() {
      this.moment.add(1, "weeks");

      const payload = {
        id: this.user.id,
        weekId: this.moment.format("W-YYYY")
      };

      getWeek(payload).then(data => {
        if (data.length === 0) {
          this.cache = [[]];
        } else {
          this.cache = data;
        }
        this.dayIndex = 0;
        this.planning_data = this.cache[this.dayIndex];
      });
    },
    async loadUser() {
      const user = await this.$store.dispatch("getUser");
      this.user = JSON.parse(user);
    },
    async getCurrentWeek() {
      let payload = {
        weekId: this.moment.format("W-YYYY"),
        id: this.user.id
      };

      this.cache = await getWeek(payload);
      this.findTodayInWeek();
      this.planning_data = this.cache[this.dayIndex];
    },
    displayLesson(value) {
      this.lesson = value;
      this.displayingLesson = true;
    },
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
      this.lesson = null;
      this.displayingLesson = false;
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