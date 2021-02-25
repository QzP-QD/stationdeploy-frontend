<template>
  <el-container>
    <el-header>
      <top-header style="width:100%"></top-header>
    </el-header>
    <el-main>
      <div>
        <!-- 位置信息 -->
        <div
          style="width: 100%; height:auto; border: 1px solid gray;margin-top: 60px;"
        >
          <el-row>
            <el-col
              :span="2"
              style="height:45px; line-height:45px; float: left; font-weight: 700; font-size: 13px;"
              >地点信息</el-col
            >
          </el-row>
          <el-table
            :data="location"
            border
            :header-cell-style="{ background: '#FAFAFA' }"
            style="width: 90% ;margin:0px auto; margin-bottom: 30px;"
          >
            <el-table-column prop="loc_id" label="地点" width="90">
            </el-table-column>
            <el-table-column prop="add" label="具体位置" width="250">
            </el-table-column>
            <el-table-column prop="loclng" label="经度" width="210">
            </el-table-column>
            <el-table-column prop="loclat" label="纬度" width="210">
            </el-table-column>
            <el-table-column prop="rad" label="范围(m)" width="170">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- scope.$index 即可获得行索引号 -->
                <el-button size="mini" @click="editInfo(scope.row)"
                  >调整</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteInfo(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 事件信息 -->
        <div
          style="width: 100%; height: auto; border: 1px solid gray;margin-top: 40px;"
        >
          <el-row>
            <el-col
              :span="2"
              style="height:45px; line-height:45px; float: left; font-weight: 700; font-size: 13px;"
              >事件信息</el-col
            >
          </el-row>
          <el-table
            :data="event"
            border
            :header-cell-style="{ background: '#FAFAFA' }"
            style="width: 90% ;margin:0px auto;margin-bottom: 30px;"
          >
            <el-table-column prop="inputtype" label="输入类型" width="250">
            </el-table-column>
            <el-table-column prop="inputresult" label="输入结果" width="350">
              <template slot-scope="scope">
                {{ scope.row.inputresult }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="editEvent(scope.row)"
                  >调整</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 设备信息 -->
        <div
          style="width: 100%; height: auto; border: 1px solid gray;margin-top: 40px;"
        >
          <el-row>
            <el-col
              :span="2"
              style="height:45px; line-height:45px; float: left; font-weight: 700; font-size: 13px;"
              >设备信息</el-col
            >
          </el-row>
          <el-table
            border
            :header-cell-style="{ background: '#FAFAFA' }"
            stripe
            :data="
              deviceForm.list_form.devices_onshow.slice(
                (deviceForm.list_form.currentpage - 1) *
                  deviceForm.list_form.pagesize,
                deviceForm.list_form.currentpage * deviceForm.list_form.pagesize
              )
            "
            style="width: 90% ;margin:0px auto;margin-bottom: 30px;
        			        font-size:small; "
          >
            <el-table-column prop="name" label="设备名称" width="150">
            </el-table-column>
            <el-table-column
              column-key="device_class"
              prop="class"
              label="设备分类"
              width="120"
            >
            </el-table-column>
            <el-table-column
              column-key="device_type"
              prop="devicetype"
              label="设备通信类型"
              width="115"
            >
            </el-table-column>
            <el-table-column prop="purpose" label="设备用途" width="260">
            </el-table-column>
            <el-table-column label="设备参数" width="420">
              <template slot-scope="scope">
                <div
                  v-for="(paramitem, paramidex) of deviceForm.list_form
                    .devices_onshow[
                    scope.$index +
                      (deviceForm.list_form.currentpage - 1) *
                        deviceForm.list_form.pagesize
                  ].params"
                  :key="paramidex"
                >
                  {{ paramitem.p_title }}：
                  {{ paramitem.p_value }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="repository_num" label="设备库存" width="100">
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope2">
                <el-input-number
                  v-model="
                    deviceForm.list_form.devices_onshow[
                      scope2.$index +
                        (deviceForm.list_form.currentpage - 1) *
                          deviceForm.list_form.pagesize
                    ].active_num
                  "
                  :min="0"
                  :max="
                    deviceForm.list_form.devices_onshow[
                      scope2.$index +
                        (deviceForm.list_form.currentpage - 1) *
                          deviceForm.list_form.pagesize
                    ].repository_num
                  "
                  label="数量"
                  size="small"
                >
                </el-input-number>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            @current-change="handleCurrentChange_list"
            :current-page="deviceForm.list_form.currentpage"
            :page-size="deviceForm.list_form.pagesize"
            layout="total,prev,pager,next"
            :total="deviceForm.list_form.devices_onshow.length"
            style="text-align:right; margin-bottom: 30px;"
          >
          </el-pagination>
        </div>

        <el-dialog title="调整" :visible.sync="dialogFormVisible" width="25%">
          <span>地点：{{ locform.loc_id }}</span
          ><br />
          <span>位置：{{ locform.add }}</span
          ><br />
          <span>经度：{{ locform.loclng }}</span
          ><br />
          <span>纬度：{{ locform.loclat }}</span
          ><br />
          <span>半径：</span>
          <el-input
            v-model="locform.rad"
            style="width: 30%;"
            @keyup.native="proving"
            >{{ locform.rad }}</el-input
          ><span>米</span><br />
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="editSubmit('locform')"
              >确 定</el-button
            >
          </div>
        </el-dialog>

        <el-dialog
          title="调整"
          :visible.sync="dialogEventFormVisible"
          width="30%"
        >
          <el-form
            :model="eventform"
            ref="eventform"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="类型">
              <el-select
                v-model="eventform.inputresult"
                placeholder="请选择类型"
              >
                <el-option
                  v-for="item in inputresultList"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogEventFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="editEventSubmit('eventform')"
              >确 定</el-button
            >
          </div>
        </el-dialog>

        <el-button
          style="
                height:50px;
                width:140px;
                float:right;"
          type="primary"
          @click="NextStep()"
        >
          提 交
        </el-button>
      </div>
    </el-main>
    <el-footer>Footer</el-footer>
  </el-container>
</template>

<script>
export default {
  name: "InfoManage",
  data() {
    return {
      location: [{}],
      event: [{}],
      weatherdata: [{}],
      devices: [{}],
      eventlist: [{}],
      scalelist: [{}],
      loctypelist: [{}],
      businesslist: [{}],
      missionlist: [{}],
      inputresultList: "",
      locform: {
        loc_id: "",
        add: "",
        loclng: "",
        loclat: "",
        rad: ""
      },
      eventform: {
        inputtype: "",
        inputresult: ""
      },
      deviceForm: {
        displayform_index: 0, //0：图片形式  1：列表形式
        device_data: "",
        graph_form: {
          currentindex: "",
          pages: []
        },
        list_form: {
          devices_onshow: [],
          last_deviceclass_list: [],
          last_devicetype_list: [],
          currentpage: 1,
          pagesize: 4,
          class_value: "不限",
          devicetype_value: "不限",
          class_filter: [],
          type_filter: []
        }
      },
      dialogFormVisible: false,
      dialogEventFormVisible: false,
      formLabelWidth: "120px"
      /*        testForm: [{t: 1}],   //使天气表格行数为1
       */
    };
  },
  created() {
    this.findAlllocation();
    this.findAllevent();
    this.findAllweather();
    this.findAlldevices();
    this.findAlleventlist();
    this.findAllscalelist();
    this.findAllloctypelist();
    this.findAllbusinesslist();
    this.findAllmissionlist();
  },
  methods: {
    findAlllocation() {
      const _this = this;
      this.axios
        .get("http://localhost:8080/static/mock/location.json")
        .then(function(resp) {
          _this.location = resp.data.location;
        });
    },
    findAllevent() {
      const _this = this;
      this.axios
        .get("http://localhost:8080/static/mock/event.json")
        .then(function(resp) {
          _this.event = resp.data.event;
        });
    },
    findAllweather() {
      const _this = this;
      this.axios
        .get("http://localhost:8080/static/mock/weatherdata.json")
        .then(function(resp) {
          _this.weatherdata = resp.data;
        });
    },
    /*      findAlldevices(){
        const _this = this
        this.axios.get('http://localhost:8080/static/mock/devices.json').then(function (resp) {
          _this.devices = resp.data.devices
        })
      }, */
    findAlleventlist() {
      const _this = this;
      this.axios
        .get("http://localhost:8080/static/mock/eventlist.json")
        .then(function(resp) {
          _this.eventlist = resp.data.eventlist;
        });
    },
    findAllscalelist() {
      const _this = this;
      this.axios
        .get("http://localhost:8080/static/mock/scalelist.json")
        .then(function(resp) {
          _this.scalelist = resp.data.scalelist;
        });
    },
    findAllloctypelist() {
      const _this = this;
      this.axios
        .get("http://localhost:8080/static/mock/loctypelist.json")
        .then(function(resp) {
          _this.loctypelist = resp.data.loctypelist;
        });
    },
    findAllbusinesslist() {
      const _this = this;
      this.axios
        .get("http://localhost:8080/static/mock/businesslist.json")
        .then(function(resp) {
          _this.businesslist = resp.data.businessList;
        });
    },
    findAllmissionlist() {
      const _this = this;
      this.axios
        .get("http://localhost:8080/static/mock/missionlist.json")
        .then(function(resp) {
          _this.missionlist = resp.data.missionList;
        });
    },
    findAlldevices() {
      //获取设备信息
      var that = this;
      this.axios({
        method: "get",
        url: "http://localhost:8080/static/mock/devicedata_2.json"
      }).then(function(response) {
        //将获取的数据导入到data域中
        that.deviceForm.device_data = response.data.device_data;
        //设备（列表展示下）的要显示的数据
        that.deviceForm.list_form.devices_onshow =
          response.data.device_data.devices;
      });
    },
    NextStep() {
      //获取后台建议数据后修改路由
      this.$router.replace("/suggest");
    },

    //地点部分
    editInfo(row) {
      const _this = this;
      _this.dialogFormVisible = true;
      _this.findOneByLocId(row);
    },
    findOneByLocId(row) {
      const _this = this;
      this.axios
        .get("http://localhost:8080/static/mock/location.json")
        .then(function(resp) {
          //'http://localhost:8181/location/findOne?locid=' + row.loc_id
          _this.locform = resp.data.location[0];
        });
    },
    editSubmit(formName) {
      const _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.axios
            .post("http://localhost:8181/location/edit", this.locform)
            .then(function(resp) {
              if (resp.data.success) {
                _this.$message({
                  type: "info",
                  message: "修改成功"
                });
                _this.dialogFormVisible = false;
                _this.findAlllocation();
              } else {
                alert(resp.data.message);
              }
            })
            .catch(function(err) {
              console.log(err);
            });
        } else {
          return false;
        }
      });
    },
    DeleteInfo(row) {
      const _this = this;
      this.$confirm("确定删除 ?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios
            .get("http://localhost:8181/location/delete?locid=" + row.loc_id)
            .then(function(resp) {
              if (resp.data.success) {
                _this.$message({
                  type: "info",
                  message: "删除成功"
                });
                _this.findAlllocation();
              } else {
                alert(resp.data.message);
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    //事件部分
    editEvent(row) {
      const _this = this;
      _this.findOneByInputtype(row);
      /*        if(_this.eventform.inputtype=="事件类型")
          _this.inputresultList = _this.eventlist
        if(_this.eventform.inputtype=="事件规模")
          _this.inputresultList = _this.scalelist
        if(_this.eventform.inputtype=="地点类型")
          _this.inputresultList = _this.loctypelist
        if(_this.eventform.inputtype=="救援任务")
          _this.inputresultList = _this.missionlist
        if(_this.eventform.inputtype=="数据任务")
          _this.inputresultList = _this.businesslist */
      _this.dialogEventFormVisible = true;
    },
    findOneByInputtype(row) {
      const _this = this;
      if (row.inputtype == "事件类型") _this.inputresultList = _this.eventlist;
      if (row.inputtype == "事件规模") _this.inputresultList = _this.scalelist;
      if (row.inputtype == "地点类型")
        _this.inputresultList = _this.loctypelist;
      if (row.inputtype == "救援任务")
        _this.inputresultList = _this.missionlist;
      if (row.inputtype == "数据任务")
        _this.inputresultList = _this.businesslist;
      this.axios
        .get("http://localhost:8080/static/mock/event.json")
        .then(function(resp) {
          //'http://localhost:8181/event/findOne?event=' + row.inputtype
          _this.eventform = resp.data.event[0];
        });
    },
    editEventSubmit(formName) {
      const _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.axios
            .post("http://localhost:8181/event/edit", this.eventform)
            .then(function(resp) {
              if (resp.data.success) {
                _this.$message({
                  type: "info",
                  message: "修改成功"
                });
                _this.dialogEventFormVisible = false;
                _this.findAllevent();
              } else {
                alert(resp.data.message);
              }
            })
            .catch(function(err) {
              console.log(err);
            });
        } else {
          return false;
        }
      });
    },

    handleChange(val) {
      console.log(val);
    },
    handleCurrentChange_list(val) {
      this.deviceForm.list_form.currentpage = val;
    },
    proving() {
      this.loc.rad = this.loc.rad.replace(/[^\.\d]/g, "");
      this.loc.rad = this.loc.rad.replace(".", "");
    },
    getactivedevices() {
      const _this = this;
      var resultlist = [];
      for (var i = 0; i < _this.deviceForm.device_data.devices.length; i++) {
        if (_this.deviceForm.device_data.devices[i].active_num > 0)
          resultlist.push(_this.deviceForm.device_data.devices[i]);
      }
      _this.deviceForm.list_form.devices_onshow.splice(
        0,
        _this.deviceForm.list_form.devices_onshow.length
      );
      console.log(_this.deviceForm.list_form.devices_onshow);
      for (var i = 0; i < resultlist.length; i++) {
        _this.deviceForm.list_form.devices_onshow.push(resultlist[i]);
      }
    }
  }
};
</script>

<style>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #999999;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
}
</style>
