import { createRouter, createWebHashHistory } from "vue-router";

import store from "./store.js";
import Home from "./views/Home.vue";
import Stop from "./views/Stop.vue";
import MyStop from "./views/MyStop.vue";
import Planning from "./views/Planning.vue";
import Login from "./views/Login.vue";

const routes = [
    {
        path: "/",
        name: "Home",
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
        component: Stop,
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
        component: MyStop,
        beforeEnter: async (to, from) => {
            if (! await store.dispatch("hasSetSelectedWay")) {
                return {
                    name: "Home"
                };
            }
        }
    },
    {
        path: "/planning",
        name: "Planning",
        component: Planning,
        beforeEnter: async (to, from) => {
            if (! await store.dispatch("isLoggedIn")) {
                return {
                    name: "Login"
                };
            }
        }
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
        beforeEnter: async (to, from) => {
            if (await store.dispatch("isLoggedIn")) {
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