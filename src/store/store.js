import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    apiBase: "https://api.openweathermap.org/data/2.5/",
    apiKey: "1f89da47fe4d0be6bbbf376af70bdb58",   // Create Api Key from https://openweathermap.org
    defaultSearch: "Rio de Janeiro",
    search: "",
    isError: false,
    weatherData: {},
    hourWeatherData: {},
    dayWeatherData: {},
  },
  getters: {
    getWeatherMain(state) {
      const { temp, feelsLike, description, icon, info, coord } = state.weatherData;
      return {
        temp,
        feelsLike,
        description,
        info,
        icon,
        coord
      };
    },
    getHourWeatherMain(state) {
      const { list } = state.hourWeatherData;
      return list;
    },
    getDayWeatherMain(state) {
      return state.dayWeatherData;
    },
    getWeatherInfo(state) {
      const { wind, clouds, humidity } = state.weatherData;
      return {
        wind,
        clouds,
        humidity,
      };
    },
    getWeatherCountry(state) {
      return state.weatherData.country;
    },
    isSearched(state) {
      return state.search !== "";
    },
    getError(state) {
      return state.isError;
    },
  },
  mutations: {
    ["SET_SEARCH"](state, search) {
      state.search = search.toLowerCase();
    },
    ["SET_WEATHER_DATA"](state, data) {
      state.weatherData = data;
    },
    ["SET_HOUR_WEATHER_DATA"](state, data) {
      state.hourWeatherData = data;
    },
    ["SET_DAY_WEATHER_DATA"](state, data) {
      state.dayWeatherData = data;
    },
    ["SET_ERROR"](state, value) {
      state.isError = value;
    },
  },
  actions: {
    async fetchHourData({ commit, state }, coords) {
      try {
        const response = await axios.get(
          `${state.apiBase}forecast?units=metric&lat=${coords.lat}&lon=${coords.lon}&appid=${state.apiKey}&cnt=5`
        );
        commit("SET_HOUR_WEATHER_DATA", response.data);
        commit("SET_ERROR", false);
      } catch (error) {
        console.log(error);
        commit("SET_ERROR", true);
        commit("SET_HOUR_WEATHER_DATA", {});
      }
    },
    async fetchDayData({ commit, state }, coords) {
      try {
        const response = await axios.get(
          `${state.apiBase}forecast?units=metric&lat=${coords.lat}&lon=${coords.lon}&appid=${state.apiKey}`
        );
        const data = response.data.list;
        const items = {};
        let countAdded = 0;

        for (const item of data) {
          const dayStr = item.dt_txt.split(" ")[0];
          if (!items[dayStr] && countAdded < 5) {
            items[dayStr] = item;
            countAdded++;
          }
        }

        console.log('DAY DATA', items);
        commit("SET_DAY_WEATHER_DATA", items);
        commit("SET_ERROR", false);
      } catch (error) {
        console.log(error);
        commit("SET_ERROR", true);
        commit("SET_DAY_WEATHER_DATA", {});
      }
    },
    async fetchWeatherData({ commit, state }, search) {
      try {
        commit("SET_SEARCH", search);
        const response = await axios.get(
          `${state.apiBase}weather?q=${search}&units=metric&APPID=${state.apiKey}`
        );
        const newWeatherData = {
          name: response.data.name,
          temp: response.data.main.temp,
          tempMin: response.data.main.temp_min,
          tempMax: response.data.main.temp_max,
          feelsLike: response.data.main.feels_like,
          description: response.data.weather[0].description,
          icon: response.data.weather[0].icon.substring(0, 2),
          info: response.data.weather[0].main,
          wind: response.data.wind.speed,
          humidity: response.data.main.humidity,
          clouds: response.data.clouds.all,
          country: response.data.sys.country,
          coord: response.data.coord,
        };
        commit("SET_WEATHER_DATA", newWeatherData);
        commit("SET_ERROR", false);
      } catch (error) {
        console.log(error);
        commit("SET_ERROR", true);
        commit("SET_WEATHER_DATA", {});
      }
    },
  },
});

export default store;
