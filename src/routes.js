import { createRouter, createWebHashHistory } from "vue-router";

import store from "./store.js";
import Home from "./views/Home.vue";
import Stop from "./views/Stop.vue";
import MyStop from "./views/MyStop.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        meta: {
            isHomePage: true
        },
        component: Home,
        beforeEnter: async (to, from, next) => {
            if (await store.dispatch("hasSetPreferredStop")) {
                next("/mystop");
                return false;
            }

            next();
        }
    },
    {
        path: "/stop",
        name: "Stop",
        meta: {
            isHomePage: false
        },
        component: Stop,
        props: true,
        beforeEnter: async (to, from) => {
            if (! await store.dispatch("hasSetSelectedStop")) {
                return {
                    name: "Home"
                };
            }
        }
    },
    {
        path: "/mystop",
        name: "MyStop",
        meta: {
            isHomePage: false
        },
        component: MyStop,
        props: true,
        beforeEnter: async (to, from) => {
            if (! await store.dispatch("hasSetSelectedWay")) {
                return {
                    name: "Home"
                };
            }
        }
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;