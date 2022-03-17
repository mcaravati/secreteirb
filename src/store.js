import {createStore} from "vuex";
import createPersistedState from "vuex-persistedstate";

function findObjectIndex(array, object) {
    return array.findIndex(x => Object.keys(x).map(k => object[k] === x[k]).reduce((p, c) => p && c, true))
}

const store = createStore({
    state () {
        return {
            user: null,
            savedStops: []
        }
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        addSavedStop(state, stop) {
            if (state.savedStops.indexOf(stop) === -1)
                state.savedStops.push(stop);
        },
        removeSavedStop(state, stop) {
            const index = findObjectIndex(state.savedStops, stop);
            if (index > -1) {
                state.savedStops.splice(index, 1);
            }
        }
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

        getSavedStops({ _, state }) {
            return new Promise((resolve, _) => {
                resolve(state.savedStops);
            });
        },
        isSaved({ _, state }, stop) {
            return new Promise((resolve, _) => {
                resolve(findObjectIndex(state.savedStops, stop) !== -1);
            });
        }
    },
    plugins: [createPersistedState()]
});

export default store;