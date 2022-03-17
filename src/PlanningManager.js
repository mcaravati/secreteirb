import moment from "moment";
import {getWeek} from "./service/PlanningService";
import {emitter} from "./emitter";

class PlanningManager {
    constructor(user) {
        this.moment = moment();
        this.weekCache = [];
        this.user = user;
        this.dayIndex = -1;
    }

    get payload() {
        return {
            id: this.user.id,
            weekId: this.moment.format("W-YYYY")
        };
    }

    findTodayInWeek() {
        let todayDate = this.moment.format("DD/MM/YYYY");
        this.dayIndex = this.weekCache.findIndex(x => x.utc === todayDate);
    }

    async getPreviousDay() {
        this.dayIndex--;

        if (this.dayIndex < 0) {
            await this.getPreviousWeek();
        } else {
            this.update();
        }
    }

    async getNextDay() {
        this.dayIndex++;

        if (this.dayIndex >= this.weekCache.length) {
            await this.getNextWeek();
        } else {
            this.update();
        }
    }

    async getPreviousWeek() {
        this.moment.subtract(1, "weeks");

        this.weekCache = await getWeek(this.payload);
        this.dayIndex = this.weekCache.length - 1;

        this.update();
    }

    async getNextWeek() {
        this.moment.add(1, "weeks");

        this.weekCache = await getWeek(this.payload);
        this.dayIndex = 0;

        this.update();
    }

    async getCurrentWeek() {
        this.weekCache = await getWeek(this.payload);
        this.findTodayInWeek();

        if (this.dayIndex === -1) {
            await this.getNextWeek();
        } else {
            this.update();
        }
    }

    update() {
        if (this.weekCache.length !== 0) {
            emitter.emit("planningDataUpdate", this.weekCache[this.dayIndex]);
        } else {
            emitter.emit("planningDataUpdate", []);
        }
    }
}

export default PlanningManager;