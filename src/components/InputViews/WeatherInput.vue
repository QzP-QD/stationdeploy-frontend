<template>
  <el-container>
    <el-container direction="horizontal">
      <el-main
        style="margin-right:20px;
                    width:400px; 
                    border:2px solid #D7D7D7;
                    background-color:#FFFFFF;"
      >
        <el-form
          ref="wform"
          :model="weatherForm"
          :rules="weatherForm.WeatherRules"
          label-width="80px"
        >
          <el-form-item label="天气" prop="weather">
            <el-select
              placeholder="请选择天气"
              style="width:400px"
              v-model="weatherForm.weather"
            >
              <el-option
                v-for="(item, index) of weatherForm.weatherlist"
                :key="index"
                :label="item"
                :value="index"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="温度" prop="temperature" style="font-size:large">
            <el-input
              placeholder="请输入当前温度"
              style="width:400px"
              v-model.number="weatherForm.temperature"
            ></el-input
            >摄氏度（℃）
          </el-form-item>

          <el-form-item label="风力" prop="wind">
            <el-select
              placeholder="请选择风力等级"
              style="width:400px"
              v-model="weatherForm.wind"
            >
              <el-option
                v-for="level of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]"
                :key="level"
                :label="level + 1"
                :value="level"
              ></el-option> </el-select
            >级
          </el-form-item>

          <el-form-item label="湿度" prop="humidity">
            <el-input
              placeholder="请输入当前湿度"
              style="width:400px"
              v-model.number="weatherForm.humidity"
            ></el-input
            >%
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="confirmWeather('wform')"
              >确认输入</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getWeather()"
              >根据位置生成</el-button
            >
          </el-form-item>
        </el-form>
      </el-main>
      <el-main
        style="border-radius: 50px; 
                            width:400px;"
        :style="{
          'background-color':
            weatherForm.weatherBackground[weatherForm.previewweather]
        }"
      >
        <div style="color:#FFFFFF;" v-show="weatherForm.previewweather === 1">
          <div
            style="border-radius: 20px; 
                                border:2px solid #FFFFFF;
                                height:200px;
                                width:200px;
                                text-align:center;
                                background-color:#1176A2;"
          >
            {{ weatherForm.temperature }}℃
          </div>
          <br />
          <div
            style="border-radius: 20px;
                                border:2px solid #FFFFFF;
                                width:20%;
                                text-align:center;
                                background-color:#1176A2;"
          >
            {{ weatherForm.weatherlist[weatherForm.weather] }}
          </div>
          <br />
          <div
            style="border-radius: 20px; 
                                border:2px solid #FFFFFF;
                                width:20%;
                                text-align:center;
                                background-color:#1176A2;"
          >
            风力{{ weatherForm.wind }}级
          </div>
          <br />
          <div
            style="border-radius: 20px; 
                                border:2px solid #FFFFFF;
                                width:200px;
                                font-size:25px;
                                text-align:center;
                                background-color:#1176A2;"
          >
            相对湿度：{{ weatherForm.humidity }} %
          </div>
        </div>
      </el-main>
    </el-container>
    <el-footer style="background-color:#FFFFFF;">
      <el-button
        style="
                    height:50px;
                    width:140px;
                    float:right;"
        type="primary"
        @click="NextStep()"
        >下一步</el-button
      >
    </el-footer>
  </el-container>
</template>

<script>
//引入bus作为数据传输总线
import bus from "./eventbus";

export default {
  name: "WeatherInput",
  data() {
    return {
      weatherForm: {
        weatherlist: [
          "晴",
          "多云",
          "阴",
          "小雨",
          "中雨",
          "大雨",
          "小雪",
          "中雪",
          "大雪",
          "雷",
          "霾"
        ],
        //气象，温度，风力，湿度
        weather: "",
        temperature: "",
        wind: "",
        humidity: "",
        previewweather: 0,
        weatherBackground: ["#FFFFFF", "#169BD5"],
        WeatherRules: {
          weather: [
            {
              required: true,
              message: "请选择天气",
              trigger: "blur"
            }
          ],
          temperature: [
            {
              required: true,
              message: "请输入温度",
              trigger: "blur"
            },
            {
              type: "number",
              message: "温度必须为数字值"
            }
          ],
          wind: [
            {
              required: true,
              message: "请选择风力等级",
              trigger: "blur"
            }
          ],
          humidity: [
            {
              required: true,
              message: "请输入湿度",
              trigger: "blur"
            },
            {
              type: "number",
              message: "湿度必须为数字值"
            }
          ]
        }
      }
    };
  },
  methods: {
    getWeather() {
      //1、通过地理位置获取气象信息
      let that = this;
      this.axios({
        method: "get",
        url: "http://localhost:8080/static/mock/weatherdata.json"
      }).then(function(response) {
        that.weatherForm.weather = response.data.weatherdata.weather;
        that.weatherForm.temperature = response.data.weatherdata.temperature;
        that.weatherForm.wind = response.data.weatherdata.wind;
        that.weatherForm.humidity = response.data.weatherdata.humidity;
      });
      //2、获取成功，显示天气
      this.weatherForm.previewweather = 1;
    },
    confirmWeather(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
          this.weatherForm.previewweather = 1;
        } else {
          alert("error submit!!");
          return false;
        }
      });
      this.weatherForm.previewweather = 1;
    },
    // 下一步按钮，点击后提示父组件移动到下一个步骤，然后将本页数据传到信息显示界面（兄弟组件）
    NextStep() {
      bus.$emit("sendWeatherinfo", this.weatherForm);
      this.$emit("Weatherfinished", 3);
    }
  }
};
</script>

<style scoped>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #999999;
}
.el-main {
  background-color: #ffffff;
  color: #333;
}
a {
  text-decoration: none;
}
</style>
