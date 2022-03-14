import { createRouter, createWebHashHistory } from "vue-router";

import store from "./store.js";
import Home from "./views/Home.vue";
import Planning from "./views/Planning.vue";
import Login from "./views/Login.vue";
import Account from "./views/Account.vue";

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
    },
    {
        path: "/me",
        name: "Account",
        component: Account,
        beforeEnter: async (to, from) => {
            if (!await store.dispatch("isLoggedIn")) {
                return {
                    name: "Login"
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