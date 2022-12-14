import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    followedUsers: [],
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // All freets created in the app
    isRecommendedEnabled: true,
    recommendedFreets: [],
    username: null, // Username of the logged in user
    sessionStartTime: null, // Time that current session started
    timeLimit: null,
    milestone: null,
    alerts: {} // global success/error messages encountered during submissions to non-visible forms
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    setSessionStartTime(state, sessionStartTime) {
      /**
       * Update the stored start time of the current sesison to
       * the specified one.
       * @param sessionStartTime - new start time to set
       */
      state.sessionStartTime = sessionStartTime;
    },
    setTimeLimit(state, timeLimit) {
      state.timeLimit = timeLimit;
    },
    setMilestone(state, milestone) {
      state.milestone = milestone;
    },
    setFollowedUsers(state, followedUsers) {
      state.followedUsers = followedUsers;
    },
    setFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    setRecommendedFreets(state, recommendedFreets) {
      state.recommendedFreets = recommendedFreets;
    },
    setIsRecommendedEnabled(state, isRecommendedEnabled) {
      state.isRecommendedEnabled = isRecommendedEnabled;
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
