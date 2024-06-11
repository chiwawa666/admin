<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="上报人">
        <el-input v-model="form.userName" disabled />
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="form.userPhone" disabled />
      </el-form-item>
      <el-form-item label="违法类型">
        <el-input v-model="form.type" disabled />
      </el-form-item>
      <el-form-item label="案件编号">
        <el-input v-model="form.caseNo" disabled />
      </el-form-item>
      <el-form-item label="上报时间">
        <el-date-picker
          v-model="form.addtime"
          type="date"
          placeholder="Pick a date"
          style="width: 100%"
          disabled
        />
      </el-form-item>
      <el-form-item label="案件描述">
        <el-input type="textarea" v-model="form.content" disabled />
      </el-form-item>
      <el-form-item label="图片">
        <!-- <img
          :src="item"
          alt=""
          v-for="(item, index) in form.pic"
          :key="index"
        /> -->
        <el-image
          style="width: 120px; height: 100px"
          v-for="(item, index) in form.pic"
          :key="index"
          :src="item"
          :preview-src-list="form.pic"
        ></el-image>
      </el-form-item>

      <el-form-item>
        <router-link :to="'/supervision/index/'">
          <el-button @click="onCancel">返回</el-button>
        </router-link>
        <!-- <el-button type="primary" @click="onSubmit">提交</el-button> -->
        <!-- <el-button @click="onCancel">返回</el-button> -->
      </el-form-item>
    </el-form>
    <div class="timeline">
      <h3>案件流转</h3>
      <el-timeline>
        <el-timeline-item
          v-for="(record, index) in recordList"
          :key="index"
          :icon="index | iconFilter"
          :type="record.type"
          color="#339dff"
          size="large"
        >
          <div class="font-bold text-color339DFF">
            {{ record.type | stateFilter }}
          </div>

          <div class="caseContent">
            <div v-if="record.type == 0">
              <div>{{ record.userName }}</div>
              <div>{{ record.userPhone }}</div>
              <div>{{ record.caseType + "-" + record.caseContent }}</div>
              <div v-if="record.picid">
                <el-image
                  style="width: 120px; height: 100px"
                  v-for="(item, index) in record.picid"
                  :key="index"
                  :src="item"
                  :preview-src-list="record.picid"
                ></el-image>
              </div>
              <div class="time">{{ record.addtime }}</div>
            </div>
            <div v-else-if="record.type == 1">
              {{ record.partment + "：" + record.adminName }}
              <div v-if="record.view !== null">
                {{ "处理意见：" + record.view }}
              </div>
              <div v-else>
                {{ "处理状态：待处理" }}
              </div>
              <div v-if="record.picid">
                <el-image
                  style="width: 120px; height: 100px"
                  v-for="(item, index) in record.picid"
                  :key="index"
                  :src="item"
                  :preview-src-list="record.picid"
                ></el-image>
              </div>
              <div class="time">{{ record.addtime }}</div>
            </div>
            <div v-else-if="record.type == 2">
              {{ record.partment + "：" + record.adminName }}
              <div v-if="record.view !== null">
                {{ "处理意见：" + record.view }}
              </div>
              <div v-else>处理状态：{{ +record.state | caseTypeFilter }}</div>
              <div v-if="record.picid" class="flex">
                <el-image
                  style="width: 120px; height: 100px"
                  v-for="(item, index) in record.picid"
                  :key="index"
                  :src="item"
                  :preview-src-list="record.picid"
                ></el-image>
              </div>
              <div class="time">{{ record.addtime }}</div>
            </div>
            <div v-else>
              {{ record.partment + "：" + record.adminName }}

              <div class="time">{{ record.addtime }}</div>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
import {
  illegalListDetail,
  typeList,
  caseRecord,
} from "@/api/funeralSupervision";
var that;

export default {
  name: "IllegalDetail",
  props: {
    isEdit: {
      type: Boolean,
      default: true,
    },
  },
  filters: {
    iconFilter(val) {
      if (val == that.recordList.length - 1) {
        return "el-icon-more";
      } else {
        return "";
      }
    },
    stateFilter(val) {
      if (val == 0) {
        return "案件上报";
      } else if (val == 1) {
        return "案件指派";
      } else if (val == 2) {
        return "案件处理";
      } else {
        return "案件结束";
      }
    },
    caseTypeFilter(val) {
      if (val == 0) {
        return "待处理";
      } else if (val == 1) {
        return "已处理";
      } else {
        return "已拒绝";
      }
    },
  },
  components: {},
  computed: {},
  watch: {},
  mounted() {},
  destroyed() {},
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
        content: "",
        status: "",
        createTime: "",
      },
      id: "",
      typeList: [],
      recordList: [],
    };
  },
  created() {
    that = this;
    that.getTypeList();
  },
  methods: {
    onSubmit() {
      this.$message("submit!");
    },
    onCancel() {
      // this.$message({
      //   message: "cancel!",
      //   type: "warning",
      // });
    },
    getTypeList() {
      typeList().then((response) => {
        this.typeList = JSON.parse(response.result);
        if (this.isEdit) {
          const id = this.$route.params && this.$route.params.id;
          this.fetchData(id);
        }
      });
    },
    fetchData(id) {
      this.id = id;
      illegalListDetail(id)
        .then((response) => {
          console.log(response);
          this.form = JSON.parse(response.result);
        })
        .catch((err) => {
          console.log(err);
        });
      caseRecord(id)
        .then((response) => {
          this.recordList = JSON.parse(response.result);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped lang="scss">
.app-container {
  display: flex;
  /* align-items: center; */
  justify-content: space-around;
}
.line {
  text-align: center;
}
.el-form-item img {
  height: 200px;
  width: auto;
  margin-left: 10px;
}
.font-bold {
  font-size: 18px;
  font-weight: bold;
}
::v-deep .el-form,
::v-deep .el-timeline {
  display: inline-block;
  width: 49%;
  margin-top: 1px;
  top: 0;
}
.timeline {
  width: 50%;
  padding-left: 10%;
}
// ::v-deep .el-timeline-item__content {
//   /* border: 1px solid #000; */
// }
.text-color339DFF {
  color: #339dff;
}

.caseContent {
  // width: 320px;
  min-width: 320px;
  height: auto;
  min-height: 93px;
  padding: 14px 12px;
  margin-top: 5px;
  background-image: url("../../../../assets/timeline.png");
  background-size: 100% 100%;
  position: relative;
  color: #339dff;
  .time {
    position: absolute;
    bottom: 0;
    font-weight: 400;
    font-size: 12px;
    color: #7e7e7e;
    line-height: 14px;
    margin-top: 5px;
  }
}
.caseContent > div > div {
  margin: 10px 0;
}

.el-form-item__label {
  font-size: 18px;
  font-weight: bold;
}
.el-form-item__content {
  font-size: 18px;
}

.el-timeline-item__content {
  font-size: 18px;
}
.el-image {
  margin-right: 5px;
}
.flex {
  display: flex;
  margin: 10px 0;

  img {
    width: 120px;
  }
}
</style>

