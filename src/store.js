import {createStore} from "vuex";
import createPersistedState from "vuex-persistedstate";

const store = createStore({
    state () {
        return {
            preferredStop: null,
            selectedStop: null,
            selectedWay: null
        }
    },
    mutations: {
        setPreferredStop(state, preferredStop) {
            state.preferredStop = preferredStop;
        },
        setSelectedStop(state, selectedStop) {
            state.selectedStop = selectedStop;
        },
        setSelectedWay(state, selectedWay) {
            state.selectedWay = selectedWay;
        }
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
        },

        hasSetSelectedStop({ _, state }) {
            return new Promise((resolve, _) => {
                resolve(state.selectedStop !== null);
            });
        },
        getSelectedStop({ _, state }) {
            return new Promise((resolve, _) => {
                resolve(state.selectedStop);
            });
        },
        setSelectedStop({ commit, _ }, selectedStop ) {
            commit("setSelectedStop", selectedStop);
        },
        clearSelectedStop({_, dispatch}) {
            dispatch("setSelectedStop", null);
        },

        hasSetSelectedWay({ _, state }) {
            return new Promise((resolve, _) => {
                resolve(state.selectedWay !== null);
            });
        },
        getSelectedWay({ _, state }) {
            return new Promise((resolve, _) => {
                resolve(state.selectedWay);
            });
        },
        setSelectedWay({ commit, _ }, selectedWay ) {
            commit("setSelectedWay", selectedWay);
        },
    },
    plugins: [createPersistedState()]
});

export default store;