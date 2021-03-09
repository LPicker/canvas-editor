import { createStore } from "vuex";

// Create a new store instance.
const store = createStore({
  state() {
    return {
      selectedBasicGraphics: "line",
    };
  },
  mutations: {
    setSelected(state, value) {
      state.selectedBasicGraphics = value;
    },
  },
});

export default store;
