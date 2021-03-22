<template>
  <div id="trafficCapacity">

  </div>
</template>

<script>
  export default {
    name: "trafficCapacity",

    mounted() {
      this.drawLine();
    },
    methods: {
      drawLine() {

        var myChart = this.$echarts.init(document.getElementById("trafficCapacity"));
        //myChart.showLoading();
        var option;

        function randomData() {

          now = new Date(+now + 4000);

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

            },
            // {

            //   name: now.toString(),

            //   value: [

            //     now,

            //     Math.round(value2)

            //   ]

            // },


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

            text: '网络实时通信量'

          },
          // legend: {
          //         data: ['上行速率', '下行速率']
          //     },
              color: ['#41D6C3', '#5AAAFA'],


          tooltip: {

            trigger: 'axis',
            axisPointer: {
                    type: 'cross',
                    label: {
                      backgroundColor: '#6a7985'
                    }
                  },


          },

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
            type: 'value',
            name: 'Mbps',
          }],



          series: {

              name: '通信量',
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


            ]

          });

        }, 4000);

        myChart.setOption(option);

      }
    }

  }
</script>

<style>
  #trafficCapacity {
    width: 60%;
    height: 500px;
    /* background-color: #99A9BF; */
  }
</style>
