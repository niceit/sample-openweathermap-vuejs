<template>
  <div class="weather-main">
    <div class="weather-feelsLike">
      Next Hours
    </div>
    <div class="weather-temp">
      <div class="weather-temp-item" v-for="(hourTemp, index) in getHourWeatherMain" :key="index">
        <span>{{hourTemp.main.temp | round}}</span>
        <sup>&deg;</sup>
        <div
          class="weather-icon"
          :style="[hourTemp.weather[0].icon ? {'background-image': 'url(http://openweathermap.org/img/wn/'+hourTemp.weather[0].icon+'@2x.png)'}: {}]"
        ></div>
        {{moment(hourTemp.dt_txt).format('hh:mm A')}}
      </div>
    </div>

    <div class="weather-feelsLike next-5-days">
      Next 5 Days
    </div>
    <div class="weather-temp" style="height: 250px; flex-direction: column; overflow: scroll">
      <div class="weather-temp-item next-5-days" v-for="(dayTemp, index) in getDayWeatherMain" :key="index">
        <div
          class="weather-icon"
          :style="[dayTemp.weather[0].icon ? {'background-image': 'url(http://openweathermap.org/img/wn/'+dayTemp.weather[0].icon+'@2x.png)'}: {}]"
        ></div>
        <div class="weather-day">
          {{ moment(dayTemp.dt_txt).format('ddd, MMM D') }}
          <br/>
          {{dayTemp.weather[0].description}}
        </div>
        <div class="weather-temp-right">
          <span>{{dayTemp.main.temp | round}}</span>
          <sup>&deg;</sup>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";

export default {
  data() {
    return {
      moment: moment,
    };
  },
  computed: {
    ...mapGetters(["getWeatherMain", "getHourWeatherMain", "getDayWeatherMain"])
  }
};
</script>

<style lang="less" scoped>
.weather {
  &-main {
    display: flex;
    flex-direction: column;
    align-items: 'flex-start';
    text-align: left;
    margin-top: 40px;
    margin-bottom: 40px;
    .weather {
      &-temp {
        position: relative;
        width: 100% !important;
        height: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 20px 0;
        span {
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -2px;
          position: relative;
        }
        sup {
          position: absolute;
          top: -2px;
          font-size: 30px;
          right: 20px;
        }

        &-item {
          align-items: center;
          display: flex;
          flex-direction: column;
          width: 25%;
          position: relative;
          &.next-5-days {
            flex-direction: row;
            width: 100%;
            justify-content: space-between;

            .weather-day {
              font-size: 20px;
              font-weight: 600;
            }

            .weather-temp-right {
              width: 50px;
              position: relative;
              span {
                font-size: 20px;
                font-weight: 800;
              }
              sup {
                right: 10px;
              }
            }
          }
        }
      }
      &-icon {
        width: 80px;
        height: 80px;
        background-repeat: no-repeat;
        background-size: 100%;
        filter: drop-shadow(1px 1px 0 fade(black, 3))
          drop-shadow(-5px -5px 0 fade(black, 8));
      }
      &-feelsLike,
      &-description {
        font-size: 18px;
        color: var(--darkColor);
        text-transform: capitalize;
        sup {
          position: relative;
          top: 5px;
          left: -2px;
          font-size: 18px;
        }
        &.next-5-days {
          border-top: 2px solid fade(black, 10);
          padding-top: 20px;
          margin-top: 40px;
        }
      }
    }
  }
}

@media (max-height: 767px) {
  .weather-main {
    margin-top: 30px;
    margin-bottom: 30px;
    .weather-temp {
      width: 125px;
      height: 125px;
      margin: 30px 0;
    }
  }
}
</style>
