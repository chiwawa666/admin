<template>
  <div class="app-container">
    <div class="select-container"></div>

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
      <el-table-column label="公墓" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.warnSource }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预警" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.warnReason }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总容量" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.totalCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已使用" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.usageCount }}</span>
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
import { getGraveLack, modifyStatus } from "@/api/warn";
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
      getGraveLack(this.listQuery).then((response) => {
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
  },
  computed: {},
};
</script>
<style scoped lang="scss">
</style>