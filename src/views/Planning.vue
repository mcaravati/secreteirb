<template>
    <div class="planning-view">
      <section>
        <span class="button" @click="getPreviousDay"><img src="../assets/chevron-left-solid.svg" alt="chevron-left"></span>
        <h4 v-if="planning_data">{{ this.planning_data.utc }}</h4>
        <span class="button" @click="getNextDay"><img src="../assets/chevron-right-solid.svg" alt="chevron-right"></span>
      </section>

      <div class="planning-wrapper" v-if="planning_data">
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
      this.$store.dispatch("setSelectedLesson", value);
      this.$router.push("lesson");
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

h6 {
  margin-bottom: 0;
  margin-top: 0.5em;
}

h4 {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
</style>