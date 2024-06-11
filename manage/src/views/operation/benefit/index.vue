<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.defunctKey"
        placeholder="逝者名称或逝者身份证号"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <!-- <el-select
        v-model="listQuery.subsidy"
        placeholder="是否补贴 "
        clearable
        style="width: 200px"
        class="filter-item"
      >
        <el-option label="不补贴" value="" />
        <el-option label="补贴" value="1" />
      </el-select> -->
      <el-input
        v-model="listQuery.ashesName"
        placeholder="存放柜名称"
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
      <el-table-column align="center" label="编号/序号">
        <template slot-scope="{ row }">
          <span>{{ row.defunctid }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="逝者姓名">
        <template slot-scope="{ row }">
          <span>{{ row.defunctName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="证件号码">
        <template slot-scope="{ row }">
          <span>{{ row.defunctIdCard }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="办理时间">
        <template slot-scope="{ row }">
          <span>{{
            row.addtime[0] +
            "-" +
            row.addtime[1] +
            "-" +
            row.addtime[2] +
            " " +
            row.addtime[3] +
            ":" +
            row.addtime[4] +
            ":" +
            row.addtime[5]
          }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="补贴总计">
        <template slot-scope="{ row }">
          <span>{{ row.discount }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="{ row }">
          <el-button
            type="info"
            size="small"
            icon="el-icon-view"
            @click="getInfo(row)"
          >
            查看
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-document"
            @click="printNow(row)"
          >
            打印
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

    <el-dialog title="补贴详情" :visible.sync="dialogFormVisible">
      <div id="printBox">
        <div class="info">
          <span>逝者姓名：{{ finalObj.defunctName }}</span>
          <span>证件号码：{{ finalObj.defunctIdCard }}</span>
          <span>
            办理时间：{{
              finalObj.addtime
                ? finalObj.addtime[0] +
                  "-" +
                  finalObj.addtime[1] +
                  "-" +
                  finalObj.addtime[2] +
                  " " +
                  finalObj.addtime[3] +
                  ":" +
                  finalObj.addtime[4] +
                  ":" +
                  finalObj.addtime[5]
                : ""
            }}
          </span>
        </div>
        <table class="print_table">
          <thead>
            <tr>
              <th>服务项目</th>
              <th>补贴金额</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in finalObj.product" :key="index">
              <td>{{ item.names }}</td>
              <td>{{ item.subsidyPrice }}</td>
            </tr>
            <tr>
              <td colspan="2">补贴总计：{{ finalObj.discount }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 关闭 </el-button>
        <el-button type="primary" icon="el-icon-document" @click="print">
          打印
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import print from "print-js";
import {
  benefits,
  updateCineraryOrder,
  getCineraryOrderInfo,
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
        subsidy: 1,
      },
      listQuery2: {
        page: 1,
        rows: 10,
      },
      finalObj: {},
      dialogFormVisible: false,
      // defunctid: "",
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      benefits(this.listQuery).then((response) => {
        const result = JSON.parse(response.result);
        this.total = result.total;
        this.list = result.rows;
        this.listLoading = false;
      });
    },

    getInfo(row) {
      this.finalObj = Object.assign({}, row); //弹窗里面使用
      this.dialogFormVisible = true;
    },
    print() {
      const style =
        "@page {margin:10mm 10mm;   } " +
        "@media print {.print_table{width: 100%;}}";
      printJS({
        printable: "printBox", // 标签元素id
        type: "html",
        header: "",
        targetStyles: ["*"],
        styles: style,
      });
    },
    printNow(row) {
      this.listLoading = true;
      this.getInfo(row);
      //设置延时，否则print获取不到打印的元素
      setTimeout(() => {
        this.print();
        this.dialogFormVisible = false;
        this.listLoading = false;
      }, 500);
    },
    handleSizeChange(val) {
      this.listQuery.rows = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleSizeChange2(val) {
      this.listQuery2.rows = val;
      this.getList();
      this.print();
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
  },
};
</script>

<style scoped lang="scss">
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 15px;
}

#printBox {
  .info {
    display: flex;
    align-content: center;
    justify-content: space-around;
    span {
      margin-right: 20px;
      flex-wrap: nowrap;
      width: auto;
      min-width: 250px;
    }
  }
  table {
    width: 100%;
    margin-top: 20px;
    text-align: center;
    border-collapse: collapse;

    th,
    td {
      border: 1px solid black;
      padding: 8px;
    }
    tbody tr:first-child td {
      border-top: none; /* 移除 tbody 第一行的顶部边框 */
    }

    // tbody tr:last-child td {
    //   border-bottom: none; /* 移除 tbody 最后一行的底部边框 */
    // }

    thead {
      background-color: #d9d9d9;
      height: 40px;
    }
  }
}
</style>
