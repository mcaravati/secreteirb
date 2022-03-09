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
        component: Home
    },
    {
        path: "/stop",
        name: "Stop",
        meta: {
            isHomePage: false
        },
        component: Stop,
        props: true
    },
    {
        path: "/mystop",
        name: "MyStop",
        meta: {
            isHomePage: false
        },
        component: MyStop,
        props: true
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.isHomePage)) {
        store.dispatch("getPreferredStop")
            .then(value => {
                const stop_object = JSON.parse(value);

                if(stop_object) {
                    next({
                        path: "/planning",
                        params: {
                            nextUrl: to.fullPath
                        }
                    });
                }
                next();
            })
            .catch(reason => console.error(`Error on Routes : ${reason}`));
    } else {
        next();
    }
});

export default router;