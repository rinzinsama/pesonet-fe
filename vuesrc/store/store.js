import Vue from "vue";
import Vuex from "vuex";
import modules from "./modules";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    appName: process.env.MIX_TITLE,
    loader: false,
    fullLoader: true,
    notFound: false,
    isLogged: false,
    session: {},
    apiBaseUrl: process.env.MIX_API_URL,
    baseUrl: process.env.MIX_BASE_URL,
  },
  mutations: {
    setFullLoader: (state, status) => {
      state.fullLoader = status;
    },
    setLoader: (state, status) => {
      state.loader = status;
    },
    setNotFound: (state, status) => {
      state.notFound = status;
    },
    setIsLogged: (state, status) => {
      state.isLogged = status;
    },
    setSession: (state, session) => {
      state.session = session;
    },
  },
  getters: {
    getFullLoader: (state) => state.fullLoader,
    getLoader: (state) => state.loader,
    getAppName: (state) => state.appName,
    getNotFound: (state) => state.notFound,
    getBaseUrl: (state) => state.baseUrl,
    getApiBaseUrl: (state) => state.apiBaseUrl,
    getIsLogged: (state) => state.isLogged,
    getSession: (state) => state.session,
  },
  modules,
});
