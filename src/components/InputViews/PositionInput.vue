<template>
  <div>
    <div style="margin-bottom: 10px;">
      <el-input id="suggestId" v-model="address_detail" placeholder="请输入地址来查找相关位置" clearable></el-input>
    </div>

    <ul style="soild 1px yellow" class="drawing-panel">

      <li class="bmap-btn bmap-marker" id="marker" @click="draw($event)"></li>
      <li class="bmap-btn bmap-circle" id="circle" @click="draw($event)"></li>
    </ul>

    <el-row :gutter="20">
      <el-col :span="18">
        <div id="container"></div>
      </el-col>
      <el-col :span="4">
        <div id="positions" style="overflow: auto">
          <div id="selectNum">

            <li v-for="(item, index) in local_list" :key="index" class="housingList" @click="center(index)">
              <!-- <span>地点{{ index+1 }}：</span><br> -->
              <div class="loc-num">
                <span class="pos-tag num">地点：</span><span class="pos-content num" >{{ item.loc_id }}</span></div>
              <!-- <span>id：{{ item.id }}</span><br> -->
              <div id="loc-content">
              <span class="pos-tag">位置：</span><span class="pos-content">{{ item.add }}</span><br>
              <span class="pos-tag">经度：</span><span class="pos-content">{{ item.loclng }}</span><br>
              <span class="pos-tag">纬度：</span><span class="pos-content">{{ item.loclat }}</span><br>
              <span class="pos-tag">半径：</span>
              <el-input v-model="item.rad" class="radius-input" v-on:input="changeCircle(index)">{{ item.rad }}</el-input><span>米</span><br>
              <!-- <span>{{ item.rad }}</span> -->
               <div class="block" style="height: 80px;">
                  <el-slider
                    v-model="item.rad"
                    v-on:input="changeCircle(index)"
                    show-input
                    :min="0" :max="10000"
                    >
                  </el-slider>
                  <el-button v-if="index >= 0" class="delete_button" @click="delete_housing(index)">删除</el-button>
                </div>

              </div>



            </li>

          </div>


        </div>
      </el-col>
    </el-row>
    <el-button style="
           height:50px;
           width:140px;
           float:right;
           margin-right:40px;"
      type="primary" @click="NextStep()">
      下一步
    </el-button>
  </div>
</template>

<script>
  import bus from "./eventbus";
  export default {
     name:"PositionInput",
    data() {
      return {
        map: "", // 地图对象
        drawingManager: "", // 绘制管理器
        centerPoint: null, // 中心点
        label: null,
        polyline: null,
        active: 0, //进度条
        address_detail: "", //详细地址
        //add_housing_list: [""],//右边地址框展示地址
        userlocation: {
          lng: "",
          lat: ""
        }, //本地所在位置

        local_list: [],
        flag: "", //0点  1圆
        id: 1, //用于自增做marker的id
        //loc_id: 1, //用于自增做地点的id
        radius: '' ,//半径
        pointaddress: '',
        value: 0
      };
    },
    mounted() {
      this.init();
    },

    methods: {
      init() {
        var th = this;

        this.map = new window.BMapGL.Map("container", {
          enableMapClick: false
        }); // 创建Map实例,GL版命名空间为BMapGL(鼠标右键控制倾斜角度)
        this.map.centerAndZoom(new window.BMapGL.Point(116.404, 39.915), 16); // 初始化地图,设置中心点坐标和地图级别
        this.map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
        var geolocation = new BMapGL.Geolocation();

        geolocation.getCurrentPosition(
          (r) => {
            if (r.point) {

              let markers = new BMapGL.Marker(r.point);
              this.map.addOverlay(markers);
              this.map.panTo(r.point);
              this.map.centerAndZoom(r.point, 16);
              //this.add_housing_list.push(r.address.province + r.address.city);

              //?
              markers.id = th.id;
              th.id = th.id + 1;
              markers.type = 0;//0标注 1圆 2标签
              let circle = new BMapGL.Circle(r.point,
                0.1, {
                  strokeColor: "#5E87DB", // 边线颜色
                  fillColor: "#5E87DB", // 填充颜色。当参数为空时，圆形没有填充颜色
                  strokeWeight: 2, // 边线宽度，以像素为单位
                  strokeOpacity: 1, // 边线透明度，取值范围0-1
                  fillOpacity: 0.2 // 填充透明度，取值范围0-1
                });
              this.map.addOverlay(circle);
              circle.id = this.id;
              circle.type=1;
              this.id++;
              let len=this.local_list.length+1;
              let name = '地点' + len;
              // 指定文本标注所在的地理位置
              let opts = {
                position: r.point,
                offset: new window.BMapGL.Size(7, -15) //设置文本偏移量
              };
              // 创建文本标注对象
              let label = new window.BMapGL.Label(
                name,
                opts
              );
              //文本标注样式
              label.setStyle({
                color: "#000000",
                //fontSize:'14px',
                fontWeight: "bold",
                border: "0px solid #ccc",
                backgroundColor: ""
              });
              this.map.addOverlay(label); //添加文本标注
              label.id = this.id;
              label.type=2;
              this.id++;



              function loc(id, loc_id, add, loclng, loclat, rad) {
                this.id = id;
                this.loc_id = loc_id;
                this.add = add;
                this.loclng = loclng;
                this.loclat = loclat;
                this.rad = rad;
              }
              var objloc2 = new loc(markers.id, len, r.address.province + r.address.city, r.point.lng, r.point.lat,
                0);
              th.local_list.push(objloc2);
              th.loc_id++;


            }
          }, {
            enableHighAccuracy: true
          }
        );

        var ac = new BMapGL.Autocomplete({ //建立一个自动完成的对象
          input: "suggestId",
          location: this.map,
        });
        var myValue;
        ac.addEventListener("onconfirm", function(e) {
          //鼠标点击下拉列表后的事件
          var _value = e.item.value;
          myValue =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business;
          this.address_detail = myValue;
          //th.add_housing_list.push(myValue);

          setPlace();
        });

        function setPlace() {

          function myFun() {
            th.userlocation = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
            th.map.centerAndZoom(th.userlocation, 18);
            var maker = new window.BMapGL.Marker(th.userlocation);
            maker.id = th.id;
            maker.type = 0;
            th.id = th.id + 1;
            th.map.addOverlay(maker); //添加标注
            //console.log(maker);
            let circle = new BMapGL.Circle(th.userlocation,
              0.1, {
                strokeColor: "#5E87DB", // 边线颜色
                fillColor: "#5E87DB", // 填充颜色。当参数为空时，圆形没有填充颜色
                strokeWeight: 2, // 边线宽度，以像素为单位
                strokeOpacity: 1, // 边线透明度，取值范围0-1
                fillOpacity: 0.2 // 填充透明度，取值范围0-1
              });
            th.map.addOverlay(circle);
            circle.id = th.id;
            circle.type=1;
            th.id++;
            let len=th.local_list.length+1;
            let name = '地点' + len;
            // 指定文本标注所在的地理位置
            let opts = {
              position: th.userlocation,
              offset: new window.BMapGL.Size(7, -15) //设置文本偏移量
            };
            // 创建文本标注对象
            let label = new window.BMapGL.Label(
              name,
              opts
            );
            //文本标注样式
            label.setStyle({
              color: "#000000",
              //fontSize:'14px',
              fontWeight: "bold",
              border: "0px solid #ccc",
              backgroundColor: ""
            });
            th.map.addOverlay(label); //添加文本标注
            label.id = th.id;
            label.type=2;
            th.id++;


            //?
            function loc(id, loc_id, add, loclng, loclat, rad) {
              this.id = id;
              this.loc_id = loc_id;
              this.add = add;
              this.loclng = loclng;
              this.loclat = loclat;
              this.rad = rad;
            }
            var objloc1 = new loc(maker.id, len, myValue, th.userlocation.lng, th.userlocation.lat, 0);
            th.local_list.push(objloc1);
            th.loc_id++;

          }

          var local = new BMapGL.LocalSearch(th.map, {
            //智能搜索
            onSearchComplete: myFun,
          });
          local.search(myValue);

          //测试输出坐标（指的是输入框最后确定地点的经纬度）
          th.map.addEventListener("click", function(e) {
            //经度
            // console.log(th.userlocation.lng);
            // //纬度
            // console.log(th.userlocation.lat);
          });
        };


        //圆的样式
        var styleOptions = {
          strokeColor: "#5E87DB", // 边线颜色
          fillColor: "#5E87DB", // 填充颜色。当参数为空时，圆形没有填充颜色
          strokeWeight: 2, // 边线宽度，以像素为单位
          strokeOpacity: 1, // 边线透明度，取值范围0-1
          fillOpacity: 0.2 // 填充透明度，取值范围0-1
        };
        //label的样式
        var labelOptions = {
          borderRadius: "2px",
          background: "#FFFBCC",
          border: "1px solid #E1E1E1",
          color: "#703A04",
          fontSize: "12px",
          letterSpacing: "0",
          padding: "5px"
        };

        // 实例化鼠标绘制工具
        this.drawingManager = new window.BMapGLLib.DrawingManager(this.map, {
          // isOpen: true,        // 是否开启绘制模式
          enableCalculate: true, // 绘制是否进行测距测面
          enableSorption: TextTrackCue, // 是否开启边界吸附功能
          sorptiondistance: 20, // 边界吸附距离
          circleOptions: styleOptions, // 圆的样式
          labelOptions: labelOptions // label样式
        });


        this.drawingManager.addEventListener("markercomplete", this.markercomplete);
        this.drawingManager.addEventListener("circlecomplete", this.circlecomplete);

        console.log("init()");
      },

      /**
       * 画图
       */
      draw(event) {
        console.log("draw(event)");
        this.centerPoint = null; // 中心点
        this.label = null;
        this.polyline = null;
        var arr = document.getElementsByClassName("bmap-btn");
        for (var i = 0; i < arr.length; i++) {
          arr[i].style.backgroundPositionY = "0";
        }
        event.target.style.backgroundPositionY = "-52px";
        switch (event.target.id) {
          case "marker":
            {
              var drawingType = BMAP_DRAWING_MARKER;
              this.flag = 0;
              break;
            }
          case "polyline":
            {
              var drawingType = BMAP_DRAWING_POLYLINE;
              break;
            }
          case "rectangle":
            {
              var drawingType = BMAP_DRAWING_RECTANGLE;
              break;
            }
          case "polygon":
            {
              var drawingType = BMAP_DRAWING_POLYGON;
              break;
            }
          case "circle":
            {
              var drawingType = BMAP_DRAWING_CIRCLE;
              this.flag = 1;
              break;
            }
        }
        // 进行绘制
        if (
          this.drawingManager._isOpen &&
          this.drawingManager.getDrawingMode() === drawingType
        ) //如果再次点击，关闭绘制
        {
          this.drawingManager.close();
        } else {
          this.drawingManager.setDrawingMode(drawingType);
          this.drawingManager.open();


        }
      },
      /**
       * 画完标注调用,每个标注由一个红点，圆和文字标注组成，圆是方便后续修改半径
       * */
      markercomplete(event, overlay) {
        // console.log("markercomplete")
        // console.log(event);
        //console.log(overlay.latLng.lat);
        const that = this;
        function loc(id, loc_id, add, loclng, loclat, rad) {
          this.id = id;
          this.loc_id = loc_id;
          this.add = add;
          this.loclng = loclng;
          this.loclat = loclat;
          this.rad = rad;
        }
        overlay.id = this.id;
        let len=this.local_list.length+1;
        console.log("列表长度："+this.local_list.length);
        let name = '地点' + len;
        overlay.type = 0;
        // console.log("marker");
        // console.log(overlay);

        var myGeo = new BMapGL.Geocoder();
        // 根据坐标得到地址描述
         myGeo.getLocation(new BMapGL.Point(overlay.latLng.lng, overlay.latLng.lat),  function(result){
         if (result){
            that.pointaddress = result.address+"附近";
            var objloc = new loc(overlay.id, len, that.pointaddress, overlay.latLng.lng, overlay.latLng.lat, 0);
            that.local_list.push(objloc);
         }
         });

        this.id++;
        this.loc_id++;
        let circle = new BMapGL.Circle(new BMapGL.Point(overlay.latLng.lng, overlay.latLng.lat),
          0.1, {
            strokeColor: "#5E87DB", // 边线颜色
            fillColor: "#5E87DB", // 填充颜色。当参数为空时，圆形没有填充颜色
            strokeWeight: 2, // 边线宽度，以像素为单位
            strokeOpacity: 1, // 边线透明度，取值范围0-1
            fillOpacity: 0.2 // 填充透明度，取值范围0-1
          });
        this.map.addOverlay(circle);
        circle.id = this.id;
        this.id++;

        // 指定文本标注所在的地理位置
        let opts = {
          position: new BMapGL.Point(overlay.latLng.lng, overlay.latLng.lat),
          offset: new window.BMapGL.Size(7, -15) //设置文本偏移量
        };
        // 创建文本标注对象
        let label = new window.BMapGL.Label(
          name,
          opts
        );
        //文本标注样式
        label.setStyle({
          color: "#000000",
          //fontSize:'14px',
          fontWeight: "bold",
          border: "0px solid #ccc",
          backgroundColor: ""
        });
        label.id = this.id;
        this.map.addOverlay(label); //添加label
        this.id++;
        //console.log(label);
        //label.setContent("didian");


      },
      /**
       * 画完圆调用
       * */
      circlecomplete(event, overlay) {
        // console.log("circlecomplete")
        // console.log(event);
        // console.log(overlay);
        const that = this;
        function loc(id, loc_id, add, loclng, loclat, rad) {
          this.id = id;
          this.loc_id = loc_id;
          this.add = add;
          this.loclng = loclng;
          this.loclat = loclat;
          this.rad = rad;
        }
        overlay.id = this.id;
        overlay.type = 1;
        let location = {
          lng: overlay.latLng.lng,
          lat: overlay.latLng.lat
        };
        var maker_ = new window.BMapGL.Marker(location);
        this.map.addOverlay(maker_);
        maker_.id = this.id + 1;
        //console.log(maker_);
        let len=this.local_list.length+1;
        let name = '地点' + len;
        // 指定文本标注所在的地理位置
        let opts = {
          position: new BMapGL.Point(overlay.latLng.lng, overlay.latLng.lat),
          offset: new window.BMapGL.Size(7, -15) //设置文本偏移量
        };
        // 创建文本标注对象
        let label = new window.BMapGL.Label(
          name,
          opts
        );
        //文本标注样式
        label.setStyle({
          color: "#000000",
          //fontSize:'14px',
          fontWeight: "bold",
          border: "0px solid #ccc",
          backgroundColor: ""
        });
        this.map.addOverlay(label);
        label.id = this.id + 2;

        var myGeo = new BMapGL.Geocoder();
         // 根据坐标得到地址描述
         myGeo.getLocation(new BMapGL.Point(overlay.latLng.lng, overlay.latLng.lat),  function(result){
         if (result){
          that.pointaddress = result.address+"附近";
          var objloc = new loc(overlay.id, len, that.pointaddress, overlay.latLng.lng, overlay.latLng.lat, parseInt(overlay.radius));
          that.local_list.push(objloc);
         }
         });

        this.id = this.id + 3;
        this.loc_id++;

      },

      delete_housing(index) {
        console.log("delete_housing");
        console.log("index:" + index);
        let _this = this;
        let allOverlay = this.map.getOverlays();
        let location = _this.local_list[index];
        for (let i = 0; i < allOverlay.length; i++) {
          // console.log("alloverlay"+allOverlay[i].id);
          // console.log("location"+location.id);
          if (allOverlay[i].id == location.id) { //删除连续三个标注
            _this.map.removeOverlay(allOverlay[i]);
            _this.map.removeOverlay(allOverlay[i + 1]);
            _this.local_list.splice(index, 1);
            _this.map.removeOverlay(allOverlay[i + 2]);


          }

        }

        //改序号
        let len=_this.local_list.length;
        let local_list_1=_this.local_list;
        for(let i=0;i<len;i++){
          if(local_list_1[i].loc_id!=i+1){
            local_list_1[i].loc_id=i+1;
            for (let j = 0; j < allOverlay.length; j++){
              if (allOverlay[j].id == local_list_1[i].id) {
                let label=allOverlay[j+2];
                console.log(label.content);
                let name="地点"+local_list_1[i].loc_id;
                label.setContent(name);
              }
            }


          }
        }


      },
      changeCircle(index) {
        console.log(index);

        let this1 = this;
        let point = this1.local_list[index];
        // console.log(point);
        // console.log(point.loclng);
        // console.log(point.loclat);
        // console.log(point.rad);
        let radius = point.rad.toString();
        let radius_num = parseInt(radius);


        //this1.map.clearOverlays();
        var allOverlay = this.map.getOverlays();
        for (let i = 0; i < allOverlay.length; i++) {
          //console.log(allOverlay[i]);
          if (allOverlay[i].id == this1.local_list[index].id) {
            if (allOverlay[i].type == 0) {
              allOverlay[i + 1].setRadius(radius_num);

            } else allOverlay[i].setRadius(radius_num); //更改半径


          }
        }



      },
      center(index) {
        //console.log(index);
        let th2 = this;
        let location = th2.local_list[index];
        let point = new BMapGL.Point(location.loclng, location.loclat);
        th2.map.centerAndZoom(point, 16);

      },
      NextStep() {
        this.$emit("Positionfinished", 1);
        bus.$emit("sendPositioninfo_1", this.local_list);
        //bus.$emit("sendPositioninfo_2", this.input)
      }


    }

  };
</script>

<style>
  #container {
    width: 100%;
    height: 650px;
    margin: 0;
    font-family: "微软雅黑";
  }

  ul li {
    list-style: none;
  }

  .info {
    z-index: 999;
    width: auto;
    min-width: 22rem;
    padding: 0.75rem 1.25rem;
    margin-left: 1.25rem;
    position: fixed;
    top: 1rem;
    background-color: #fff;
    border-radius: 0.25rem;
    font-size: 14px;
    color: #666;
    box-shadow: 0 2px 6px 0 rgba(27, 142, 236, 0.5);
  }

  .drawing-panel {
    z-index: 999;
    position: fixed;
    bottom: 3.5rem;
    margin-left: 2.5rem;
    padding-left: 0;
    border-radius: 0.25rem;
    height: 47px;
    box-shadow: 0 2px 6px 0 rgba(27, 142, 236, 0.5);
  }

  .bmap-btn {
    border-right: 1px solid #d2d2d2;
    float: left;
    width: 64px;
    height: 100%;
    background-image: url(//api.map.baidu.com/library/DrawingManager/1.4/src/bg_drawing_tool.png);
    cursor: pointer;
  }

  .drawing-panel .bmap-marker {
    background-position: -65px 0;
  }

  .drawing-panel .bmap-polyline {
    background-position: -195px 0;
  }

  .drawing-panel .bmap-rectangle {
    background-position: -325px 0;
  }

  .drawing-panel .bmap-polygon {
    background-position: -260px 0;
  }

  .drawing-panel .bmap-circle {
    background-position: -130px 0;
  }

  .pageHeader {
    margin-top: 20px;
  }

  #allWrap {
    margin-left: 20px;
  }

  .step {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  #suggestId {
    width: 30%;
  }

  #allmap {
    width: 100%;
    height: 650px;
    z-index: 0;
  }

  #positions {
    width: 300px;
    height: 650px;
    border: solid #99a9bf 1px;
  }

  #selectNum {
    margin-top: 10px;
  }

  .el-row {
    margin-bottom: 20px;
    margin-left: 100px;
  }

  .el-col {
    border-radius: 4px;
  }

  .housingList {
    margin-top: 20px;
    margin-left: 20px;
    list-style: none;
  }

  .tangram-suggestion-main {
    z-index: 999999;
  }

  .radius-input {
    width: 30%;
  }

  .pos-tag {
    color: #000000;

  }

  .pos-content {
    color:#666666;
    font-size: 14px;
  }

  .loc-num {
    width: 80px;
    font-size: 20px;
    color: #0079FE;
    border: #D7D7D7 1.2px solid;
    border-radius: 4px;
    border-bottom: 0px;

  }
  #loc-content{
    border: #D7D7D7 1.2px solid;
    width:250px;
    height:auto;
    /* height:180px; */
    margin-bottom: 10px;
    padding-bottom: 10px;
    padding-top:10px;
    padding-left:10px;
  }
  .delete_button{
    float:right;
    margin-right: 10px;
    margin-top: 5px;

  }
  .num{
    font-size: 20px;
    color:#0079FE;
  }


</style>
