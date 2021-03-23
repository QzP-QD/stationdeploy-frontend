export const option = {
   tooltip: {
      backgroundColor:'white',
      textStyle:{
        color:'DarkSeaGreen'
      },
     formatter:function(params){
       //console.log(params)
       if(params.dataType=="node")
       return params.name+"："+"<br/>"+"上行速率："+params.data.upSpeed+"<br/>"+"下行速率："+params.data.downSpeed;

     }

   },
          series: [{
            type: 'graph',
            layout: 'force',
            legendHoverLink: true, //是否启用图例 hover(悬停) 时的联动高亮。
            hoverAnimation: true, //是否开启鼠标悬停节点的显示动画
            coordinateSystem: null, //坐标系可选
            xAxisIndex: 0, //x轴坐标 有多种坐标系轴坐标选项
            yAxisIndex: 0, //y轴坐标
            force: {
              repulsion: 450, //相距距离
              edgeLength: [150, 200],
              layoutAnimation: false,
              gravity: 0.04
            },
            roam: true, //是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
            nodeScaleRatio: 0.6, //鼠标漫游缩放时节点的相应缩放比例，当设为0时节点不随着鼠标的缩放而缩放
            draggable: true, //节点是否可拖拽，只在使用力引导布局的时候有用。
            focusNodeAdjacency: true, //是否在鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点。
            symbolSize: 50, //图形大小
            edgeSymbolSize: 10, //边两端的标记大小，可以是一个数组分别指定两端，也可以是单个统一指定。
            itemStyle: { //===============图形样式，有 normal 和 emphasis 两个状态。normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
              normal: { //默认样式
                label: {
                  show: true
                },
                //borderType : 'solid', //图形描边类型，默认为实线，支持 'solid'（实线）, 'dashed'(虚线), 'dotted'（点线）。
                //borderColor : 'rgba(255,215,0,0.4)', //设置图形边框为淡金色,透明度为0.4
                //borderWidth : 2, //图形的描边线宽。为 0 时无描边。
                // opacity : 1 // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。默认0.5

              },
              emphasis: { //高亮状态

              }
            },
            lineStyle: { //==========关系边的公用线条样式。
              normal: {
                color: 'rgba(128, 128, 128, 0.5)',
                width: '2',
                type: 'solid', //线的类型 'solid'（实线）'dashed'（虚线）'dotted'（点线）
                curveness: 0, //线条的曲线程度，从0到1
                opacity: 1
                // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。默认0.5
              },
              emphasis: { //高亮状态
              width:4

              }
            },
            label: { //=============图形上的文本标签
              normal: {
                show: true, //是否显示标签。
                position: 'inside', //标签的位置。['50%', '50%'] [x,y]   'inside'
                textStyle: { //标签的字体样式
                  color: '#FFC1C1', //字体颜色
                  fontStyle: 'normal', //文字字体的风格 'normal'标准 'italic'斜体 'oblique' 倾斜
                  fontWeight: 'bolder', //'normal'标准'bold'粗的'bolder'更粗的'lighter'更细的或100 | 200 | 300 | 400...
                  fontFamily: 'sans-serif', //文字的字体系列
                  fontSize: 12, //字体大小
                }
              },
              emphasis: { //高亮状态


              }
            },
            edgeLabel: { //==============线条的边缘标签
              normal: {
                show: false
              },
              emphasis: { //高亮状态

              }
            },
            categories: [{
              name: '',
              itemStyle: {
                normal: {
                  color: "#55aa7f"
                }
              },

            }, {
              name: '',
              itemStyle: {
                normal: {
                  color: "#55aa7f"
                }
              }
            }],
            label: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 12
                },
              }
            },

            data:[],
            links: [],

          }]

        }
