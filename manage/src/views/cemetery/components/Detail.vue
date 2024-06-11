<template>
  <div class="app-container">
    <h3>{{ temp.cemeteryName }}</h3>
    <div class="grapgBoxs">
      <div class="grapgBox" ref="chart1"></div>
      <div class="grapgBox" ref="chart2"></div>
      <div class="grapgBox" ref="chart3"></div>
      <div class="grapgBox" ref="chart4"></div>
    </div>
    <div class="graveCounts">
      <span>{{ temp.cemeteryName + ":" }}</span>
      <span>单穴个数：{{ temp.graveUsageValue.singleGraveCount }}个</span>
      <span>双穴个数：{{ temp.graveUsageValue.doubleGraveCount }}个</span>
      <span>空闲墓位：{{ temp.graveUsageValue.emptyGraveCount }}个</span>
      <span>已入葬：{{ temp.graveUsageValue.usedGraveCount }}个</span>
      <span>已购未入葬：{{ temp.graveUsageValue.buyGraveCount }}个</span>
      <span>总数：{{ temp.graveUsageValue.graveCount }}个</span>
      <span>生态墓：{{ temp.graveUsageValue.ecologicalGraveCount }}个</span>
    </div>
    <div class="graveBlocks">
      <span>片区选择</span>
      <el-select v-model="blockId" @change="changeBlocks(blockId)">
        <el-option
          v-for="item in temp.tombs"
          :key="item.id"
          :label="item.tombName"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </div>
    <div class="graveCounts">
      <span>{{ getBlockName }}</span>
      <span>单穴个数：{{ GraveDetailCount.singleGraveCount }}个</span>
      <span>双穴个数：{{ GraveDetailCount.doubleGraveCount }}个</span>
      <span>空闲墓位：{{ GraveDetailCount.emptyGraveCount }}个</span>
      <span>已入葬：{{ GraveDetailCount.usedGraveCount }}个</span>
      <span>已购未入葬：{{ GraveDetailCount.buyGraveCount }}个</span>
      <span>总数：{{ GraveDetailCount.graveCount }}个</span>
      <span>生态墓：{{ GraveDetailCount.ecologicalGraveCount }}个</span>
    </div>
    <!-- 图例 -->
    <div class="flex floatRight">
      <div class="flex width100">
        <div class="long ecoColor"></div>
        <span>生态墓</span>
      </div>
      <div class="flex width100">
        <div class="short1 unEco"></div>
        <div class="short2 unEco"></div>
        <span>双穴</span>
      </div>
      <div class="flex width100">
        <div class="long"></div>
        <span>单穴</span>
      </div>
      <div class="flex width100">
        <div class="short1 blue"></div>
        <span>已入葬</span>
      </div>
      <div class="flex width120">
        <div class="short1 noEmpty"></div>
        <span>已购未入葬</span>
      </div>
      <div class="flex width100">
        <div class="short1 empty"></div>
        <span>空</span>
      </div>
    </div>
    <div
      class="graveLines"
      v-for="key in Object.keys(groupedBlocks)"
      :key="key"
    >
      <span>{{ key }}</span>
      <div class="graveLine">
        <GraveBlock
          v-for="(item, index) in groupedBlocks[key]"
          :key="index"
          :data="item"
          @clickGrave="clickGrave"
        ></GraveBlock>
      </div>
    </div>
    <el-dialog title="墓穴详情" :visible.sync="dialogGraveVisible">
      <el-descriptions class="margin-top" :column="2" border>
        <el-descriptions-item>
          <template slot="label"> 墓穴位置 </template>
          {{ graveInfo.location }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 墓型 </template>
          {{ graveInfo.graveTypeStr | graveTypeFilter(0) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 墓穴编号 </template>
          {{ graveInfo.graveTypeValue.id }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 墓穴类型 </template>
          {{ graveInfo.graveTypeStr | graveTypeFilter(1) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 当前墓穴状态 </template>
          {{ graveInfo.state }}
        </el-descriptions-item>
        <el-descriptions-item v-if="graveInfo.state !== '未认购'">
          <template slot="label"> 认购人 </template>
          {{ graveInfo.state }}
        </el-descriptions-item>
      </el-descriptions>
      <div v-if="graveInfo.defuncts">
        <el-descriptions
          class="margin-top top10"
          :column="2"
          border
          v-for="(item, index) in graveInfo.defuncts"
          :key="index"
          title="逝者信息"
        >
          <template slot="extra">
            <el-button
              type="primary"
              size="small"
              @click="getPeopleDetail(item.id)"
              >查看更多</el-button
            >
          </template>
          <el-descriptions-item>
            <template slot="label"> 逝者姓名 </template>
            {{ item.realName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label"> 身份证号 </template>
            {{ item.idNumber }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label"> 性别 </template>
            {{ item.gender | genderFilter }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label"> 入葬日期 </template>
            {{ item.buryTime }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogGraveVisible = false"> 关闭 </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="逝者详情"
      :visible.sync="dialogPeopleVisible"
      class="flex"
    >
      <div class="flex">
        <el-descriptions class="margin-top halfWidth" :column="1" border>
          <el-descriptions-item>
            <template slot="label"> 逝者姓名 </template>
            {{ defunctInfo.realName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label"> 性别 </template>
            {{ defunctInfo.gender == "1" ? "男" : "女" }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label"> 身份证号 </template>
            {{ defunctInfo.idNumber }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label"> 死亡原因 </template>
            {{ defunctInfo.death_cause }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label"> 死亡时间 </template>
            {{ defunctInfo.deathTime }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label"> 家属信息 </template>
            {{ defunctInfo.family != null ? defunctInfo.family.names : "" }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label"> 联系方式 </template>
            {{ defunctInfo.family != null ? defunctInfo.family.phone : "" }}
          </el-descriptions-item>
        </el-descriptions>
        <el-timeline class="halfWidth">
          <el-timeline-item
            v-for="(activity, index) in boneashRecord"
            :key="index"
            :timestamp="activity.addtime"
          >
            <div>类型： {{ activity.recordType | recordTypeFilter }}</div>
            <div>{{ activity.description }}</div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCemeteryDetail,
  getTombAndGraveDetail,
  getTombGraveDetail,
  getTombGraveStatics,
  getGraveDetails,
} from "@/api/cemetery";
import { getPeopleDetail, getBoneashRecord } from "@/api/people";
import echarts from "echarts";
import GraveBlock from "@/components/GraveBlock";
export default {
  name: "Detail",
  components: {
    GraveBlock,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  filters: {
    graveTypeFilter(str, num) {
      const strArr = str.split("/");
      return strArr[num];
    },
    genderFilter(str) {
      if (str == "1") {
        return "男";
      } else {
        return "女";
      }
    },
    recordTypeFilter(str) {
      let temp = ["逝者信息上报", "骨灰流向意向", "入墓", "迁出"];
      return temp[str];
    },
  },
  data() {
    return {
      temp: {
        cemeteryName: "",
        graveUsageValue: {
          singleGraveCount: 0,
          doubleGraveCount: 0,
          emptyGraveCount: 0,
          usedGraveCount: 0,
          buyGraveCount: 0,
          ecologicalGraveCount: 0,
          graveCount: 0,
        },
      },
      GraveDetailCount: {},
      GraveDetailBlocks: [],
      id: "",
      blockId: "",
      groupedBlocks: {},
      staticsData: {},
      graveInfo: {
        location: "",
        graveTypeStr: "11/22",
        graveTypeValue: {
          id: "11",
        },
      },
      defunctInfo: {
        realName: "",
        gender: "",
        idNumber: "",
        death_cause: "",
        deathTime: "",
        family: {
          names: "",
          phone: "",
        },
      },
      boneashRecord: [], //骨灰流向
      tempRoute: {},
      dialogGraveVisible: false,
      dialogPeopleVisible: false,
    };
  },
  created() {
    if (this.isEdit) {
      this.id = this.$route.params && this.$route.params.id;
      this.fetchData(this.id);
    }
    this.tempRoute = Object.assign({}, this.$route);
  },
  //计算属性
  computed: {
    // 计算属性的 getter
    getBlockName() {
      () => {
        temp.tombs.forEach((item) => {
          if (item.id == this.blockId) {
            return item.name;
          }
        });
      };
    },
  },

  methods: {
    onSubmit() {
      this.$message("submit!");
    },
    onCancel() {
      this.$message({
        message: "cancel!",
        type: "warning",
      });
    },
    fetchData(id) {
      this.getTombGraveStatics(id),
        getTombAndGraveDetail(id)
          .then((response) => {
            const result = JSON.parse(response.result);
            console.log("result", result);
            this.temp = Object.assign({}, result);
            if (result.tombs.length > 0) {
              this.blockId = result.tombs[0].id;

              // 绘制图表 等待这两个接口完成获得数据再渲染
              Promise.all([this.getTombGraveDetail(this.blockId)]).then(() => {
                // 避免vue渲染过慢，echarts渲染过快，导致图表不显示
                setTimeout(() => {
                  this.setChart1();
                  this.setChart2();
                  this.setChart3();
                  this.setChart4();
                }, 100);
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
    },
    changeBlocks(id) {
      console.log("墓区切换");
      console.log("blockId", this.blockId);
      this.getTombGraveDetail(id);
    },
    //获取墓区下墓穴分布
    getTombGraveDetail(id) {
      return new Promise((resolve, reject) => {
        // 发起请求，并在请求完成后调用 resolve 或 reject
        getTombGraveDetail(id).then((response) => {
          const result = JSON.parse(response.result);
          this.GraveDetailCount = result.graveUsageValue;
          this.GraveDetailBlocks = result.graves;
          //根据行号 分块
          const groupedBlocks = this.GraveDetailBlocks.reduce(
            (groups, block) => {
              if (!groups[block.rowName]) {
                groups[block.rowName] = [];
              }
              groups[block.rowName].push(block);
              return groups;
            },
            {}
          );
          this.groupedBlocks = groupedBlocks;
          resolve();
        });
      });
    },
    getTombGraveStatics(id) {
      return new Promise((resolve, reject) => {
        getTombGraveStatics(id).then((response) => {
          this.staticsData = JSON.parse(response.result);
          resolve();
        });
      });
    },
    //点击墓穴
    clickGrave(id) {
      getGraveDetails(id).then((response) => {
        this.graveInfo = JSON.parse(response.result);
        this.dialogGraveVisible = true;
      });
    },
    setChart1() {
      let line = [];
      let bar = [];
      let monthCount = [];
      this.staticsData.monthCount.forEach((item) => {
        line.push(item.noNatureCount);
        bar.push(item.natureCount);
        monthCount.push(item.month + "月");
      });
      this.chart = echarts.init(this.$refs.chart1);
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },

        legend: {
          data: ["生态葬", "非生态葬"],
        },
        xAxis: [
          {
            type: "category",
            data: monthCount,
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            min: 0,
            interval: 50,
            axisLabel: {
              formatter: "{value} 人",
            },
          },
          {
            type: "value",
            min: 0,
            interval: 5,
          },
        ],
        series: [
          {
            name: "生态葬",
            type: "bar",
            tooltip: {
              valueFormatter: function (value) {
                return value + " ml";
              },
            },
            data: bar,
          },

          {
            name: "非生态葬",
            type: "line",
            yAxisIndex: 1,
            tooltip: {
              valueFormatter: function (value) {
                return value + " °C";
              },
            },
            data: line,
          },
        ],
      });
    },
    setChart2() {
      this.chart = echarts.init(this.$refs.chart2);
      const data2 = [];

      this.staticsData.ageRate.forEach((item) => {
        data2.push({
          name: item.title,
          value: item.count,
        });
      });
      console.log("data", data2);
      this.chart.setOption({
        color: ["#68bbc4", "#5087ec", "#58a55c", "#f2bd42", "#c23531"],
        tooltip: {
          trigger: "item",
        },
        title: {
          text: "逝者年龄分析",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "horizontal",
          left: "center",
          top: "15%",
        },
        series: [
          {
            name: "墓穴情况分析",
            type: "pie",
            radius: ["40%", "60%"],
            center: ["50%", "60%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 20,
              borderColor: "#fff",
              borderWidth: 1,
            },

            label: {
              show: false,
              position: "center",
            },

            labelLine: {
              show: false,
            },
            data: data2,
          },
        ],
      });
    },
    setChart3() {
      const data3 = [];

      this.staticsData.graveTypeRate.forEach((item) => {
        data3.push({
          name: item.title,
          value: item.count,
        });
      });
      this.chart = echarts.init(this.$refs.chart3);
      this.chart.setOption({
        color: ["#68bbc4", "#5087ec"],
        title: {
          text: "墓位分析",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "horizontal",
          left: "center",
          top: "15%",
        },
        series: [
          {
            type: "pie",
            center: ["50%", "60%"],
            radius: "50%",
            data: data3,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
    },
    setChart4() {
      const data4 = [];

      this.staticsData.buriedTypeRate.forEach((item) => {
        data4.push({
          name: item.title,
          value: item.count,
        });
      });
      this.chart = echarts.init(this.$refs.chart4);
      this.chart.setOption({
        color: ["#68bbc4", "#5087ec", "#58a55c"],
        tooltip: {
          trigger: "item",
        },
        title: {
          text: "墓穴情况分析",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "horizontal",
          left: "center",
          top: "15%",
        },
        series: [
          {
            name: "墓穴情况分析",
            type: "pie",
            radius: ["40%", "60%"],
            center: ["50%", "60%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 20,
              borderColor: "#fff",
              borderWidth: 1,
            },

            label: {
              show: false,
              position: "center",
            },

            labelLine: {
              show: false,
            },
            data: data4,
          },
        ],
      });
    },
    getPeopleDetail(id) {
      getPeopleDetail(id).then((response) => {
        const defunctInfo = JSON.parse(response.result);
        this.defunctInfo = defunctInfo;
      });
      getBoneashRecord(id).then((response) => {
        const boneashRecord = JSON.parse(response.result);
        this.boneashRecord = boneashRecord;
        this.dialogPeopleVisible = true;
      });
    },
  },
};
</script>

<style scoped lang="scss">
.grapgBoxs {
  display: flex;
  .grapgBox {
    width: 25%;
    height: 300px;
  }
}
.graveCounts {
  display: inline-block;
  padding: 5px 10px;
  border: 1px solid #a59696;
  margin-top: 10px;
  span {
    display: inline-block;
    width: auto;
    padding: 0 15px;
  }
}
.graveBlocks {
  span {
    margin-right: 5px;
  }
  margin-top: 10px;
}
.graveLines {
  display: flex;
  margin-top: 10px;
  span {
    width: 100px;
    text-align: center;
    margin-top: 20px;
    padding-top: 15px;
  }
  .graveLine {
    // flex: 1;
    display: inline-block;
    width: calc(100% - 120px);
    padding: 10px;
  }
}
.top10 {
  margin-top: 20px;
}
.halfWidth {
  display: inline-block;
  width: 48%;
}
.flex {
  display: flex;
  height: 95%;
  span {
    margin-left: 5px;
  }
}
.long {
  width: 40px;
  height: 20px;
  border: 2px solid #000;
  border-radius: 5px;
}
.ecoColor {
  border: 3px solid #c23531;
}
.blue {
  background-color: #5894ff;
}
.noEmpty {
  background-color: #8ec937;
}
.short1 {
  width: 20px;
  height: 20px;
  border: 3px solid #979797;
  // border-radius: 5px;
}
.short2 {
  width: 20px;
  height: 20px;
  border: 3px solid #979797;
  border-left: none;
  // border-radius: 5px;
}
.width100 {
  width: 100px;
}
.width120 {
  width: 120px;
}
.floatRight {
  float: right;
  margin-top: 10px;
}

::v-deep .el-dialog {
  position: fixed;
  left: 25%;
  overflow: scroll;
  max-height: 80%;
  padding-bottom: 20px;
}
::v-deep .el-dialog::-webkit-scrollbar {
  display: none !important;
}
</style>

