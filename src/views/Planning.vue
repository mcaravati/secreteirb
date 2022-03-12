<template>
    <div class="planning-view">
      <section>
        <span class="button" @click="getPreviousDay"><img src="../assets/chevron-left-solid.svg" alt="chevron-left"></span>
        <h4>{{ this.planning_data.utc }}</h4>
        <span class="button" @click="getNextDay"><img src="../assets/chevron-right-solid.svg" alt="chevron-right"></span>
      </section>

      <div class="planning-wrapper">
          <div
              v-for="value in this.planning_data.events"
              class="event"
          >
            <span>{{ value.start }} - {{ value.end }}</span>
            <span>{{ value.summary }}</span>
            <span>{{ value.location }}</span>
          </div>
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
      user: null
    }
  },
  async mounted() {
    await this.loadUser();
    await this.getCurrentWeek();
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
    getLessonType(event) {
      return event.description.split("\n\n")[1].split("\n")[0];
    },
    getTeachers(event) {
      return event.description.trim().split("\n").filter(this.isName);
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
}

.planning-wrapper {
  max-width: 80vw;
}

.planning-view {
  width: 80vw;
}
</style>