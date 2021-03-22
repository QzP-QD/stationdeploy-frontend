<template>
  <div><span>上行速率</span>
    <div id="speed">

    </div>
  </div>
</template>

<script>
  export default {
    name: "Speed",

    mounted() {
      this.drawLine();
    },
    methods: {
      drawLine() {
        //var chartDom = document.getElementById('uploadSpeed');
        var myChart = this.$echarts.init(document.getElementById("speed"));
        //myChart.showLoading();
        var option;

        function randomData() {

          now = new Date(+now + 1000);

          value = value + Math.random() * 200 - 100;
          var value2 = value1 + Math.random() * 200 - 100;
          //var value3=value + Math.random() * 200 - 100;
          if(value<=value2)value+=value2;
          if(value<=0){
            value+=100;
          }
          if(value2<=0){
            value2=0;
          }


          return [{

              name: now.toString(),

              value: [

                now,

                Math.round(value)

              ]

            }, {

              name: now.toString(),

              value: [

                now,

                Math.round(value2)

              ]

            },


          ]

        }
        var data = [];
        var data2 = [];
        var data3 = [];
        var now = new Date();
        var value = parseInt(Math.random() * (1000 - 500 + 1) + 500, 10);
        var value1 = parseInt(Math.random() * (500 - 100 + 1) + 100, 10);

        //var value2 = Math.random() * 20;



        option = {

          title: {

            text: '网络速率'

          },
          legend: {
                  data: ['上行速率', '下行速率']
              },
              color: ['#41D6C3', '#5AAAFA'],


          tooltip: {

            trigger: 'axis',
            axisPointer: {
                    type: 'cross',
                    label: {
                      backgroundColor: '#6a7985'
                    }
                  },
                  //backgroundColor: '#fff',
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

          // xAxis: {

          //   type: 'time',
          //   splitNumber: 10,

          //   splitLine: {

          //     show: false

          //   }

          // },
          xAxis: [{
            type: 'time', // x轴为 时间轴
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                width: 0
              }
            },
            axisLabel: {
              color: '#5A6872',
              fontSize: 11
            },
            axisTick: {
              show: false
            },
            boundaryGap: false,

          }],


          // yAxis: {

          //   type: 'value',
          //   name: 'kb/s',

          //   boundaryGap: [0, '100%'],

          //   splitLine: {

          //     show: false

          //   }

          // },
          yAxis: [{
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dotted',
                color: 'rgba(155, 155, 155, 0.5)'
              }
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              color: '#5A6872',
              fontSize: 11
            },
            axisTick: {
              show: false
            },
            type: 'value'
          }],



          series: [{

              name: '下行速率',

              type: 'line',
              lineStyle: {
                normal: {
                  color: '#5AAAFA',
                  width: 1
                }
              },
              areaStyle: {
                normal: {
                  color: '#5AAAFA',
                  opacity: 0.5
                }
              },
              markPoint: {
                        label: {
                          normal: {
                            show: true,
                            backgroundColor: '#fff',
                            position: 'top',
                            color: '#5AAAFA',
                            borderColor: 'rgba(90,170,250,0.3)',
                            borderWidth: 1,
                            padding: 8,

                          }
                        },
                        symbol: 'circle',
                        itemStyle: {
                          normal: {
                            borderColor: 'rgba(90,170,250,0.3)',
                            borderWidth: 15
                          }
                        },
                        symbolSize: 7,
                        data: [
                          { type: 'max', name: 'Max' }
                        ]
                      },





              showSymbol: false,
              connectNulls: true,

              // hoverAnimation: false,

              data: data

            },
            {

              name: '上行速率',

              type: 'line',
              lineStyle: {
                normal: {
                  color: '#41D6C3',
                  width: 1
                }
              },
              areaStyle: {
                normal: {
                  color: '#41D6C3',
                  opacity: 0.5
                }
              },
             markPoint: {
                     label: {
                       normal: {
                         show: true,
                         backgroundColor: '#fff',
                         position: 'top',
                         color: '#5AAAFA',
                         borderColor: 'rgba(90,170,250,0.3)',
                         borderWidth: 1,
                         padding: 8,
                         //formatter: `{b}: {c} ${unit}`
                       }
                     },
                     symbol: 'circle',
                     itemStyle: {
                       normal: {
                         borderColor: 'rgba(90,170,250,0.3)',
                         borderWidth: 15
                       }
                     },
                     symbolSize: 7,
                     data: [
                       { type: 'max', name: 'Max' }
                     ]
                   },

              showSymbol: false,
              connectNulls: true,

              // hoverAnimation: false,

              data: data2

            },
            // {

            //   name: '设备3',

            //   type: 'line',
            //   lineStyle:{
            //     normal:{
            //       width:1
            //     }
            //   },


            //   showSymbol: false,

            //   // hoverAnimation: false,

            //   data: data3

            // },

          ]

        };

        setInterval(function() {

          //data.shift();
          var result = randomData();

          data.push(result[0]);
          data2.push(result[1]);
          //data3.push(result[2]);

          myChart.setOption({

            series: [{

                data: data

              },
              {

                data: data2

              },

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
    /* background-color: #99A9BF; */
  }
</style>
