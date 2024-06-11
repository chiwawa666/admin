<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input
        v-model="listQuery.title"
        placeholder="事项"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      /> -->

      <!-- <router-link to="/funeralSupervision/create">
        <el-button type="primary" size="mini"> 添加 </el-button>
      </router-link> -->
      <!-- <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      > -->
      <el-button
        type="primary"
        size="mini"
        class="float-right-button"
        @click="getCode"
      >
        查看全部信息
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="编号" prop="id" sortable="custom" align="center">
        <template slot-scope="{ $index }">
          <span>{{ $index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="逝者姓名" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.gender == 1 ? "男" : "女" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证号码" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.idNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="死亡日期" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.deathTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="家属姓名" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.familyName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="家属联系方式" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.familyPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关系" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.familyRelation }}</span>
        </template>
      </el-table-column>
      <el-table-column label="骨灰状态" align="center">
        <template slot-scope="{ row }">
          <span>{{
            (row.boneashRecord !== null ? row.boneashRecord.recordType : "")
              | recordTypeFilter
          }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="auto"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            size="mini"
            @click="getPeopleDetail(row.id)"
          >
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :page-count="total"
      :page.sync="listQuery.page"
      :rows.sync="listQuery.rows"
      @pagination="getList"
    />
    <el-dialog title="逝者详情" :visible.sync="dialogGraveVisible">
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
import { getPeopleList, getBoneashRecord, getPeopleDetail } from "@/api/people";
import { getPrivateCodeApi } from "@/utils/requestPrivate";
// import { getPeopleDetail } from "@/api/cemetery";
// import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "ComplexTable",
  components: { Pagination },
  // directives: { waves },
  filters: {
    recordTypeFilter(str) {
      let temp = ["逝者信息上报", "骨灰流向意向", "入墓", "迁出"];
      return temp[str];
    },
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        rows: 10,
      },
      defunctInfo: {
        id: "",
        realName: "",
        gender: "",
        idNumber: "",
        deathTime: "",
        death_cause: "",
        family: {
          names: "",
          phone: "",
        },
      },
      boneashRecord: [], //骨灰流向
      dialogGraveVisible: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        type: "",
        status: "published",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create",
      },
      dialogPvVisible: false,
      pvData: [],
      // rules 校验规则

      downloadLoading: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      // 具体接口
      getPeopleList(this.listQuery).then((response) => {
        const result = JSON.parse(response.result);
        this.list = result.rows;
        this.total = result.total;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 100);
      });
    },
    getPeopleDetail(id) {
      getPeopleDetail(id).then((response) => {
        const defunctInfo = JSON.parse(response.result);
        this.defunctInfo = defunctInfo;
        this.dialogGraveVisible = true;
      });
      getBoneashRecord(id).then((response) => {
        const boneashRecord = JSON.parse(response.result);
        this.boneashRecord = boneashRecord;
      });
    },
    getCode() {
      getPrivateCodeApi().then((response) => {
        this.getList();
      });
    },
    // 查询过滤器
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作Success",
        type: "success",
      });
      row.status = status;
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        status: "published",
        type: "",
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024; // mock a id
          this.temp.author = "vue-element-admin";
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Created Successfully",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.id);
            this.list.splice(index, 1, this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Update Successfully",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    handleDelete(row, index) {
      this.$notify({
        title: "Success",
        message: "Delete Successfully",
        type: "success",
        duration: 2000,
      });
      this.list.splice(index, 1);
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

