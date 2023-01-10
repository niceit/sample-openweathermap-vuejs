<template>
  <div class="weather-search">
    <vue-tabs @tab-change="setSelectedCity">
      <v-tab v-for="city in cities" :title="city" :key="city">
        <WeatherMain />
      </v-tab>
    </vue-tabs>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import WeatherMain from "@/components/WeatherMain.vue";
export default {
  data() {
    return {
      cities: [
        'Rio de Janeiro', 'Beijing', 'Los Angeles'
      ],
      search: this.$store.state.search
    };
  },
  components: { WeatherMain },
  computed: {
    ...mapGetters(["isSearched", "getWeatherCountry", "getError", "getWeatherMain"])
  },
  watch: {
    getWeatherMain: function (val) {
      const { coord } = val;
      if (typeof coord !== "undefined") {
        this.fetchHourData(coord);
        this.fetchDayData(coord);
      }
    }
  },
  methods: {
    setSelectedCity(tabIndex) {
      if (typeof this.cities[tabIndex] !== 'undefined') {
        this.search = this.cities[tabIndex];
        this.getData();
      }
    },
    ...mapActions(["fetchWeatherData", "fetchHourData", "fetchDayData"]),
    getData() {
      this.fetchWeatherData(this.search);
    }
  }
};
</script>

<style lang="less" scoped>
.weather-search {
  position: relative;
  .search-control {
    width: 100%;
    height: 50px;
    border: 2px solid fade(black, 10);
    border-radius: 100px;
    outline: none;
    background-color: transparent;
    font-size: 16px;
    padding-left: 25px;
    padding-right: 25px;
    transition: all 0.4s;
    &::placeholder {
      color: fade(black, 60);
    }
    &:focus {
      background-color: #fff;
      box-shadow: 0 8px 16px fade(black, 25);
      border-color: fade(black, 5);
      font-weight: 600;
      &::placeholder {
        font-weight: 400;
      }
    }
  }
  .error {
    position: absolute;
    color: red;
    text-align: center;
    bottom: -35px;
    left: 0;
    right: 0;
    margin: auto;
    font-size: 14px;
  }
  .country {
    position: absolute;
    top: 50%;
    right: 30px;
    transform: translateY(-50%);
    color: var(--grayColor);
  }
}
</style>
