<template>
  <div class="app-container">
    <div class="select-container">
      <el-button
        type="primary"
        size="mini"
        class="float-right-button"
        @click="handleCreate"
      >
        添加
      </el-button>
      <el-button
        type="primary"
        size="mini"
        class="float-right-button"
        @click="getCode"
      >
        查看全部信息
      </el-button>

      <!-- <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      > -->
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
      <el-table-column label="编号" align="center">
        <template slot-scope="{ $index }">
          <span>{{ $index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.driverName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证号" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.idcard }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="状态" align="center" width="auto">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.stateStr }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="操作"
        align="center"
        width="auto"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <!-- <el-button type="info" size="mini" @click="getInfo(row.driverid)">
            详情
          </el-button> -->
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            @click.native="handleDelete(row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :page-count="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    ></pagination>

    <!--弹窗-新增/编辑  -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      z-index="1000"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="司机姓名">
          <el-input v-model="temp.driverName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="temp.phone" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="身份证号" v-if="dialogStatus === 'create'">
          <el-input v-model="temp.idcard" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          :disabled="!validRules"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDrivers,
  getDriverInfo,
  updateDrivers,
  deleteDriver,
} from "@/api/funeral";

import { getPrivateCodeApi } from "@/utils/requestPrivate";
// import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "ComplexTable",
  components: { Pagination },
  // directives: { waves },
  filters: {},
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      state: "0",
      carInfos: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        // importance: undefined,
        // title: undefined,
        // type: undefined,
        // sort: "+id",
      },
      importanceOptions: [1, 2, 3],
      showReviewer: false,
      driverid: 0,
      temp: {
        parlorid: 1,
        driverName: "",
        phone: "",
      },
      dialogFormVisible: false,
      dialogInfoVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "新增",
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [
          { required: true, message: "type is required", trigger: "change" },
        ],
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change",
          },
        ],
        driverName: [
          { required: true, message: "编号不能为空", trigger: "blur" },
        ],
      },
      downloadLoading: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getDrivers(this.listQuery).then((response) => {
        const result = JSON.parse(response.result);
        this.list = result.rows;
        this.total = result.total;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 100);
      });
    },
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
    getInfo(driverid) {
      this.driverid = driverid; //弹窗里面使用
      getDriverInfo(driverid).then((response) => {
        this.carInfos = JSON.parse(response.result).rows;
        this.dialogInfoVisible = true;
      });
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    resetTemp() {
      this.temp = {
        parlorid: 1,
        driverName: "",
        phone: "",
        idcard: "",
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
          updateDrivers(this.temp, "post").then(() => {
            this.$message({
              message: "操作成功！",
              type: "success",
            });
            this.getList();
            this.dialogFormVisible = false;
          });
        }
      });
    },
    getCode() {
      getPrivateCodeApi().then((response) => {
        this.getList();
      });
    },
    handleUpdate(row) {
      // getPrivateCode().then((response) => {
      //   console.log("response", response);
      // });
      this.temp = Object.assign({}, row);
      if (this.temp.phone.includes("*")) {
        this.$message({
          message:
            "详情内容中联系方式为敏感信息，请点击右侧'查看全部信息'按钮获取脱敏信息",
          type: "success",
          duration: 5000,
        });
      }
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
          const { driverid, parlorid, driverName, phone } = tempData;
          updateDrivers({ driverid, parlorid, driverName, phone }, "put").then(
            () => {
              this.dialogFormVisible = false;
              this.$message({
                message: "操作成功！",
                type: "success",
              });
              this.getList();
            }
          );
        }
      });
    },
    handleDelete(row, index) {
      console.log(row);
      this.$confirm("确定执行删除操作吗?", "Warning", {
        confirmButtonText: "是的",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const { driverid } = row;
        deleteDriver(driverid).then(() => {
          this.$message({
            message: "操作成功！",
            type: "success",
          });
          this.getList();
        });
      });
      //   this.$notify({
      //     title: "Success",
      //     message: "Delete Successfully",
      //     type: "success",
      //     duration: 2000,
      //   });
      //   this.list.splice(index, 1);
    },
    handleFetchPv(pv) {
      fetchPv(pv).then((response) => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },
    // handleDownload() {
    //   this.downloadLoading = true;
    //   import("@/vendor/Export2Excel").then((excel) => {
    //     const tHeader = ["timestamp", "title", "type", "importance", "status"];
    //     const filterVal = [
    //       "timestamp",
    //       "title",
    //       "type",
    //       "importance",
    //       "status",
    //     ];
    //     const data = this.formatJson(filterVal);
    //     excel.export_json_to_excel({
    //       header: tHeader,
    //       data,
    //       filename: "table-list",
    //     });
    //     this.downloadLoading = false;
    //   });
    // },
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },
  },
  computed: {
    validRules() {
      if (this.dialogStatus == "create") {
        if (
          this.temp.driverName !== "" &&
          this.temp.phone !== "" &&
          this.temp.idcard !== ""
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        if (this.temp.driverName !== "" && this.temp.phone !== "") {
          return true;
        } else {
          return false;
        }
      }
    },
  },
};
</script>
<style scoped lang="scss">
</style>