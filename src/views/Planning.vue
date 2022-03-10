<template>
      <section>
        <h2>{{ studentName }}</h2>
        <nav>
          <span class="button" @click="onPreviousClick"><img src="../assets/chevron-left-solid.svg" alt="chevron-left"></span>
          <span class="button" @click="onNextClick"><img src="../assets/chevron-right-solid.svg" alt="chevron-right"></span>
        </nav>
      </section>

      <div id="planning-wrapper">
        <div
            v-for="(values, _) in this.planning_data"
            class="day"
        >
          <h3>{{ values.utc }}</h3>
          <div
              v-for="value in values.events"
              class="button"
          >
            <span>{{ value.start }} - {{ value.end }}</span>
            <span>{{ value.description }}</span>
            <span>{{ value.location }}</span>
          </div>
        </div>
      </div>
</template>

<script>
import {getWeek} from "../service/PlanningService";
import moment from 'moment';

export default {
  name: "Planning",
  data() {
    return {
      currentPlanningName: "",
      planning_data: [],
      studentName: "",
      cache: [],
      currentObjectIndex: 0,
      moment: moment(),
      dayIndex: -1,
      weekIndex: -1
    }
  },
  mounted() {
    this.$store.dispatch("getCurrentSuggestion")
        .then(suggestion => {
          const payload = JSON.parse(suggestion);
          this.weekIndex = this.moment.isoWeek();
          payload.weekId = this.weekIndex;
          getWeek(payload).then(([name, data]) => {
            this.cache = data;
            this.findTodayInWeek();
            this.planning_data = [this.cache[this.dayIndex]];
            this.studentName = name;
          });
        })
        .catch(reason => console.error(`Error on Planning : ${reason}`));
  },
  methods: {
    findTodayInWeek() {
      let todayDate = this.moment.format("DD/MM/YYYY");
      this.dayIndex = this.cache.findIndex(x => x.utc === todayDate);
    },
    onPreviousClick() {
      this.getPreviousDay();
    },
    onNextClick() {
      this.getNextDay();
    },
    getPreviousDay() {
      if (this.dayIndex === 0) {
        this.getPreviousWeek();
        return;
      }
      this.dayIndex -= 1;
      this.planning_data = [this.cache[this.dayIndex]];
    },
    getNextDay() {
      if (this.dayIndex === this.cache.length - 1) {
        this.getNextWeek();
        return;
      }
      this.dayIndex += 1;
      this.planning_data = [this.cache[this.dayIndex]];
    },
    getPreviousWeek() {
      this.$store.dispatch("getCurrentSuggestion")
          .then(suggestion => {
            const payload = JSON.parse(suggestion);
            this.weekIndex -= 1;
            payload.weekId = this.weekIndex;
            getWeek(payload).then(([name, data]) => {
              if (data.length === 0) {
                this.cache = [[]];
              } else {
                this.cache = data;
              }
              this.dayIndex = this.cache.length - 1;
              this.planning_data = [this.cache[this.dayIndex]];

              this.studentName = name;
            });
          })
          .catch(reason => console.error(`Error on Planning : ${reason}`));
    },
    getNextWeek() {
      this.$store.dispatch("getCurrentSuggestion")
          .then(suggestion => {
            const payload = JSON.parse(suggestion);
            this.weekIndex += 1;
            payload.weekId = this.weekIndex;
            getWeek(payload).then(([name, data]) => {
              if (data.length === 0) {
                this.cache = [[]];
              } else {
                this.cache = data;
              }
              this.dayIndex = 0;
              this.planning_data = [this.cache[this.dayIndex]];
              this.studentName = name;
            });
          })
          .catch(reason => console.error(`Error on Planning : ${reason}`));
    }
  }
}
</script>

<style scoped>
.button {
  background: rgb(120, 200, 0) none repeat scroll 0% 0%;
  border-color: rgb(88, 167, 0);
  color: rgb(255, 255, 253);
  border-width: 0 0 4px;
  padding: 0.1vh 0.5vw;
  text-transform: uppercase;
  line-height: normal;
  border-radius: 15px;
  border-style: solid;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: .8px;
  text-align: center;
  vertical-align: middle;
  outline: none;
  margin: 15px 0 15px 0;
  display: flex;
  flex-direction: column;
  min-width: 18vw;
}
.button:hover {
  filter: brightness(1.1);
}

.day {
  padding: 0.5vw;
  width: 80vw;
}

nav span.button {
  width: 2vw;
  min-width: unset;
  padding: 2vh 4vw;
}
</style>