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
      <el-table-column label="名称" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.names }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="服务分类" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.type | typeFilter }}</span>
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
          <!-- <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button> -->
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
      :rows.sync="listQuery.rows"
      @pagination="getList"
    ></pagination>

    <!--弹窗-新增/编辑  -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="名称" prop="names">
          <el-input v-model="temp.names" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="所属商家" prop="adminid">
          <el-select v-model="temp.adminid" placeholder="请选择">
            <el-option
              v-for="(item, index) in merchantList"
              :key="index.bussinessid"
              :label="item.realName"
              :value="item.bussinessid"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="服务分类">
          <el-select v-model="temp.type" placeholder="请选择">
            <el-option value="0" label="殡仪服务" />
            <el-option value="1" label="第三方服务" />
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
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
  getclassify,
  addclassify,
  deleteclassify,
  merchants,
} from "@/api/funeral";
import { getUserId } from "@/utils/auth";
// import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
var that;
export default {
  name: "Classify",
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
      merchantList: [],
      listLoading: true,
      listQuery: {
        page: 1,
        rows: 100,
        type: 1,
      },
      importanceOptions: [1, 2, 3],
      showReviewer: false,
      driverid: 0,
      temp: {
        parlorid: 1,
        names: "",
        type: "1",
        adminid: "",
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
        names: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        adminid: [
          { required: true, message: "所属商家不能为空", trigger: "blur" },
        ],
      },
      downloadLoading: false,
    };
  },
  created() {
    that = this;
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getclassify(this.listQuery).then((response) => {
        const result = JSON.parse(response.result);
        this.list = result.rows;
        this.total = result.total;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 100);
      });

      merchants().then((response) => {
        const result = JSON.parse(response.result);
        this.merchantList = result.rows;
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

    resetTemp() {
      this.temp = {
        parlorid: 1,
        names: "",
        type: "1",
        adminid: "",
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
          const { driverid, parlorid, names, type, adminid } = tempData;
          addclassify({ driverid, parlorid, names, type, adminid }, "put").then(
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
  computed: {},
};
</script>
<style scoped lang="scss">
</style>