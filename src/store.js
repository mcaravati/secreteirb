import {createStore} from "vuex";
import createPersistedState from "vuex-persistedstate";

const store = createStore({
    state () {
        return {
            preferredStop: null
        }
    },
    mutations: {

        setPreferredStop(state, preferredStop) {
            state.preferredStop = preferredStop;
        },
    },
    actions: {
        hasSetPreferredStop({ _, state }) {
            return new Promise((resolve, _) => {
                resolve(state.preferredStop !== null);
            });
        },
        getPreferredStop({ _, state }) {
            return new Promise((resolve, _) => {
                resolve(state.preferredStop);
            });
        },
        setPreferredStop({ commit, _ }, preferredStop ) {
            commit("setPreferredStop", preferredStop);
        }
    },
    plugins: [createPersistedState()]
});

export default store;