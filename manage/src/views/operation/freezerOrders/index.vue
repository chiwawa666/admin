<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.defunctName"
        placeholder="逝者名称"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.defuntIdCard"
        placeholder="逝者身份证号"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.state"
        placeholder="冷冻柜状态"
        clearable
        style="width: 200px"
        class="filter-item"
      >
        <el-option label="空闲" value="0" />
        <el-option label="使用中" value="1" />
      </el-select>
      <el-input
        v-model="listQuery.freezerName"
        placeholder="冷冻柜名称"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="订单编号">
        <template slot-scope="{ row }">
          <span>{{ row.freezerid }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="{ row }">
          <span>{{ row.state | stateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="冷冻柜编号">
        <template slot-scope="{ row }">
          <span>{{ row.names }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="使用人">
        <template slot-scope="{ row }">
          <span>{{ row.defunctName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="使用结束时间">
        <template slot-scope="{ row }">
          <span>{{ row.endTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="{ row }">
          <el-button
            type="info"
            size="small"
            icon="el-icon-edit"
            @click="getInfo(row.freezerid)"
          >
            存放记录
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            v-if="row.state == 1"
            @click="updateData(row)"
          >
            出库
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

    <el-dialog title="存放记录" :visible.sync="dialogFormVisible">
      <el-table
        v-loading="listLoading"
        :data="orderInfos"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column align="center" label="订单编号">
          <template slot-scope="{ row }">
            <span>{{ row.finalOrderNo }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="使用人">
          <template slot-scope="{ row }">
            <span>{{ row.defunctName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="开始使用时间">
          <template slot-scope="{ row }">
            <span>{{ row.startTime }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="结束使用时间">
          <template slot-scope="{ row }">
            <span>{{ row.endTime }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="{ row }">
            <span>{{ row.stateStr }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total2 > 0"
        :total="total2"
        :page.sync="listQuery2.page"
        :rows.sync="listQuery2.rows"
        @pagination="getInfo(this.freezerid)"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 关闭 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getfreezerOrders,
  updatefreezerOrders,
  getOrderInfo,
} from "@/api/funeral";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "CineraryOrder",
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
    statusChange(status, name) {
      const that = this;
      if (status == "0") {
        return "闲置";
      } else {
        return name;
      }
    },
    stateFilter(status) {
      const statusMap = {
        0: "空闲",
        1: "使用中",
        2: "维护中",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      total2: 0,
      setName: "",
      listQuery: {
        page: 1,
        rows: 10,
        defunctName: "",
        defuntIdCard: "",
        state: "",
        freezerName: "",
      },
      listQuery2: {
        page: 1,
        rows: 10,
      },
      orderInfos: [],
      dialogFormVisible: false,
      freezerid: "",
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getfreezerOrders(this.listQuery).then((response) => {
        const result = JSON.parse(response.result).list;
        this.total = result.total;
        this.list = result.rows;
        this.listLoading = false;
      });
    },

    updateData(row) {
      this.$confirm("确定执行出库操作吗?", "Warning", {
        confirmButtonText: "是的",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const { freezerid, finalOrderNo } = row;
        console.log(freezerid, finalOrderNo);

        updatefreezerOrders({ freezerid, finalOrderNo }).then(() => {
          this.dialogFormVisible = false;
          this.$message({
            message: "操作成功！",
            type: "success",
          });
          this.getList();
        });
      });
    },
    getInfo(freezerid) {
      this.freezerid = freezerid; //弹窗里面使用
      getOrderInfo(freezerid).then((response) => {
        console.log("response", response);
        this.orderInfos = JSON.parse(response.result).rows;
        this.dialogFormVisible = true;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
  },
};
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 15px;
}
</style>
