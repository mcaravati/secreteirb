import {createStore} from "vuex";
import createPersistedState from "vuex-persistedstate";

const store = createStore({
    state () {
        return {
            user: null,
        }
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
    },
    actions: {
        isLoggedIn({ _, state }) {
            return new Promise((resolve, _) => {
                resolve(state.user !== null);
            });
        },
        getUser({ _, state }) {
            return new Promise((resolve, _) => {
                resolve(state.user);
            });
        },
        setUser({ commit, _ }, user ) {
            commit("setUser", user);
        },
        clearUser({ _, dispatch }) {
            dispatch("setUser", null);
        },
    },
    plugins: [createPersistedState()]
});

export default store;