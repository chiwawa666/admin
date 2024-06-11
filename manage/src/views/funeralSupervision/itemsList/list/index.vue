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
      <el-table-column label="类目" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.names }}</span>
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

    <el-dialog title="新增类型" :visible.sync="dialogFormVisible">
      <el-form
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="名称">
          <el-input v-model="temp.names" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="createData()"
          :disabled="temp.names == ''"
        >
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { FirstTypeList, addTypeList } from "@/api/funeralSupervision";
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
        names: "",
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
      FirstTypeList(this.listQuery).then((response) => {
        const result = JSON.parse(response.result);
        this.list = result;
        // this.total = result.total;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 100);
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleCreate() {
      this.dialogFormVisible = true;
    },
    createData() {
      addTypeList(this.temp).then((response) => {
        console.log("response", response);
        this.dialogFormVisible = false;
        this.getList();
        if (response.code == 1) {
          this.$message({
            message: "处理成功",
            type: "success",
          });
        } else {
          this.$message({
            message: "处理失败",
            type: "error",
          });
        }
      });
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
  },
  computed: {},
};
</script>
<style scoped lang="scss">
</style>