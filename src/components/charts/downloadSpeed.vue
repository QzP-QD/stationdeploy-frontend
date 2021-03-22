<template>
  <div><span>下行速率</span>
    <div id="downloadSpeed">

    </div>
  </div>
</template>

<script>
  export default {
    name:"downloadSpeed",

    mounted() {
      this.drawLine();
    },
    methods: {
      drawLine() {
        var chartDom = document.getElementById('downloadSpeed');
        var myChart = this.$echarts.init(document.getElementById("downloadSpeed"));
        //myChart.showLoading();
        var option;

        function randomData() {

          now = new Date(+now + 1000);

          value = value + Math.random() * 200 - 100;
          var value2=value + Math.random() * 200 - 100;
          var value3=value + Math.random() * 200 - 100;


          return [{

            name: now.toString(),

            value: [

              now,

              Math.round(value)

            ]

          },{

            name: now.toString(),

            value: [

              now,

              Math.round(value2)

            ]

          },
          {

            name: now.toString(),

            value: [

              now,

              Math.round(value3)

            ]

          },

          ]

        }
        var data = [];
        var data2 = [];
        var data3 = [];
        var now = new Date();
        var value = parseInt(Math.random() * (1000 - 500 + 1) + 500, 10);

        //var value2 = Math.random() * 20;



        option = {

          title: {

              text: '设备下行速率'

          },


          tooltip: {

            trigger: 'axis',
             // axisPointer: {
             //            type: 'cross',
             //            label: {
             //                backgroundColor: '#6a7985'
             //            }
             //        },

            // formatter: function(params) {

            //   //params = params[0];

            //   var date = new Date(params[0].name);
            //   var result=params[0].seriesName +' : ' + params[0].value[1]+'kb/s';

            //   return result;

            // },

            // axisPointer: {

            //   animation: false

            // }

          },

          xAxis: {

            type: 'time',
            splitNumber: 10,

            splitLine: {

              show: false

            }

          },

          yAxis: {

            type: 'value',
            name: 'kb/s',

            boundaryGap: [0, '100%'],

            splitLine: {

              show: false

            }

          },

          series: [{

              name: '设备1',

              type: 'line',
              lineStyle:{
                normal:{
                  width:1
                }
              },


              showSymbol: false,

              // hoverAnimation: false,

              data: data

            },
            {

              name: '设备2',

              type: 'line',
              lineStyle:{
                normal:{
                  width:1
                }
              },


              showSymbol: false,

              // hoverAnimation: false,

              data: data2

            },
            {

              name: '设备3',

              type: 'line',
              lineStyle:{
                normal:{
                  width:1
                }
              },


              showSymbol: false,

              // hoverAnimation: false,

              data: data3

            },

          ]

        };

        setInterval(function() {

          //data.shift();
          var result=randomData();

          data.push(result[0]);
          data2.push(result[1]);
          data3.push(result[2]);

          myChart.setOption({

            series: [{

                data: data

              },
              {

                data: data2

              },
              {

                data: data3

              }
            ]

          });

        }, 1000);

        myChart.setOption(option);

      }
    }

  }
</script>

<style scoped>
  #uploadSpeed {
    width: 60%;
    height: 500px;
    background-color: #99A9BF;
  }
</style>
