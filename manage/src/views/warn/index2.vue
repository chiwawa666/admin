<template>
  <div class="app-container">
    <div class="select-container">
      <!-- <el-button
        type="primary"
        size="mini"
        class="float-right-button"
        @click="handleCreate"
      >
        添加
      </el-button> -->

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
      <el-table-column label="殡仪馆" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.warnSource }}</span>
        </template>
      </el-table-column>
      <el-table-column label="逝者姓名" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.defunctName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="逝者身份证号" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.defunctCard }}</span>
        </template>
      </el-table-column>
      <el-table-column label="家属" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.familyName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.contact }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.status == 0 ? "未处理" : "已处理" }}</span>
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
            v-if="row.status == 0"
            @click="handleModifyStatus(row)"
          >
            处理
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
    ></pagination>
  </div>
</template>

<script>
import { getRemainsCold, modifyStatus } from "@/api/warn";
// import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
var that;
export default {
  name: "Classisfy",
  components: { Pagination },
  // directives: { waves },
  filters: {
    typeFilter(val) {
      return that.type[val];
    },
  },
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
        rows: 10,
        type: 0,
      },
      importanceOptions: [1, 2, 3],
      showReviewer: false,
      driverid: 0,
      temp: {
        parlorid: 1,
        names: "",
        type: 0,
      },
      type: ["殡仪服务", "第三方服务"],
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
          {
            required: true,
            message: "类型不可为空",
            trigger: "change",
          },
        ],
        names: [{ required: true, message: "编号不能为空", trigger: "blur" }],
      },
      downloadLoading: false,
    };
  },
  created() {
    that = this;
    this.getList();
    console.log("asd ");
  },
  methods: {
    getList() {
      this.listLoading = true;
      getRemainsCold(this.listQuery).then((response) => {
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
    handleModifyStatus(row) {
      modifyStatus(row.id).then((response) => {
        console.log("response", response);

        if (response.code == 1) {
          this.$message({
            message: "处理成功",
            type: "success",
          });
          row.status = 1;
        } else {
          this.$message({
            message: "处理失败",
            type: "error",
          });
        }
      });
    },

    resetTemp() {
      this.temp = {
        parlorid: 1,
        names: "",
        type: 0,
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
          addclassify(this.temp, "post").then(() => {
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row);
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
          const { driverid, parlorid, names, type, idcard } = tempData;
          addclassify({ driverid, parlorid, names, type, idcard }, "put").then(
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
        const { typeid } = row;
        deleteclassify(typeid).then(() => {
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
  },
  computed: {
    validRules() {
      if (this.temp.names !== "") {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>
<style scoped lang="scss">
</style>