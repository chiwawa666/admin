<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.queryName"
        placeholder="逝者名称"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.idCard"
        placeholder="证件号码"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.status"
        placeholder="状态"
        clearable
        style="width: 200px"
        class="filter-item"
      >
        <el-option label="全部" value="" />
        <el-option label="未缴费" value="1" />
        <el-option label="已缴费" value="2" />
        <el-option label="已火化" value="3" />
        <el-option label="已生成火化证明" value="4" />
      </el-select>

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
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-s-order"
        @click="dialogExcelVisible = true"
      >
        导出
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
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="逝者姓名">
        <template slot-scope="{ row }">
          <span>{{ row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="证件号码">
        <template slot-scope="{ row }">
          <span>{{ row.idNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="年龄">
        <template slot-scope="{ row }">
          <span>{{ row.age }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="死亡日期">
        <template slot-scope="{ row }">
          <span>{{ row.deathTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="家属联系方式">
        <template slot-scope="{ row }">
          <span>{{ row.familyPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="{ row }">
          <span>{{ row.status | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="auto"
        minWidth="200px"
        class-name="small-padding fixed-width"
        label="操作"
      >
        <template slot-scope="{ row }">
          <el-button type="info" size="small" @click="handleProcess(row.id)">
            逝者流转
          </el-button>
          <el-button
            type="primary"
            size="small"
            v-if="row.status >= 4"
            @click="checkInfo(row)"
          >
            生成身份信息
          </el-button>
          <el-button
            type="primary"
            size="small"
            v-if="row.status == 5"
            @click="burned(row)"
          >
            生成火化证明
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-view"
            v-if="row.status > 5"
            @click="checkburned(row)"
          >
            查看火化证明
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

    <el-dialog title="逝者流转" :visible.sync="dialogFormVisible">
      <div class="personInfo">
        <div>逝者姓名：{{ personInfo.defunctName }}</div>
        <div>证件类型：{{ personInfo.cardType }}</div>
        <div>证件号码：{{ personInfo.idNumber }}</div>
        <div>死亡日期：{{ personInfo.deathTime }}</div>
      </div>
      <div class="processBoxs">
        <div
          class="processBox"
          v-for="(item, index) in personInfo.processList"
          :key="index"
        >
          <div class="processTitle">{{ item.opInfo }}</div>
          <div class="processHandler">操作人：{{ item.operator }}</div>
          <div class="processTime">操作时间：{{ item.addtime }}</div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 关闭 </el-button>
      </div>
    </el-dialog>
    <el-dialog title="数据导出" :visible.sync="dialogExcelVisible">
      <el-form :inline="true" class="demo-form-inline">
        <el-row>
          <el-form-item class="width120">
            <el-checkbox v-model="exportQuery.excelType1"
              >火化证明编号</el-checkbox
            >
          </el-form-item>
          <el-form-item class="ml20">
            <el-input
              v-model="exportQuery.startNum"
              placeholder="开始编号"
              type="Number"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="exportQuery.endNum"
              placeholder="结束编号"
              type="Number"
            ></el-input>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item class="width120">
            <el-checkbox v-model="exportQuery.excelType2">火化时间</el-checkbox>
          </el-form-item>
          <el-form-item class="ml20">
            <el-date-picker
              v-model="exportQuery.startTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-row>
      </el-form>
      <!-- <div>
        <el-checkbox v-model="exportQuery.excelType1">火化证明编号</el-checkbox>
        <el-form-item
          ><el-input
            v-model="input"
            placeholder="开始编号"
            type="Number"
          ></el-input>
        </el-form-item>

        <el-input
          v-model="input"
          placeholder="结束编号"
          type="Number"
        ></el-input>
      </div> -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-s-order" @click="handleExport">
          导出
        </el-button>
        <el-button @click="dialogExcelVisible = false"> 关闭 </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="火化证明"
      :visible.sync="dialogPrintVisible"
      width="700px"
    >
      <div id="printBox">
        <div class="number">
          编号：<span>{{ personInfo.cremation }}</span>
        </div>
        <div class="title">火化证明</div>
        <div class="content indent">
          兹有死者{{ personInfo.defunctName }}，性别：{{
            personInfo.gender == 0 ? "女" : "男"
          }}，出生日期{{ personInfo.birthday }}；身份证号：{{
            personInfo.idNumber
          }}于{{ personInfo.fireTime }}在我馆火化。
        </div>
        <div class="indent">特此证明</div>
        <div class="end">繁昌区殡仪馆</div>
        <div class="end">{{ personInfo.cremationTime }}</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPrintVisible = false"> 关闭 </el-button>
        <el-button type="primary" icon="el-icon-document" @click="print">
          打印
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="身份信息" :visible.sync="dialogInfoVisible" width="700px">
      <div id="printBox2">
        <table>
          <tr>
            <td>逝者姓名</td>
            <td>{{ personInfo2.defunctName }}</td>
          </tr>
          <tr>
            <td>身份证号</td>
            <td>{{ personInfo2.idNumber }}</td>
          </tr>
          <tr>
            <td>家属姓名</td>
            <td>{{ personInfo2.familyName }}</td>
          </tr>
          <tr>
            <td>联系方式</td>
            <td>{{ personInfo2.contact }}</td>
          </tr>
          <tr>
            <td>火化时间</td>
            <td>{{ personInfo2.fireTime }}</td>
          </tr>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogInfoVisible = false"> 关闭 </el-button>
        <el-button type="primary" icon="el-icon-document" @click="print2">
          打印
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  firePage,
  updateCineraryOrder,
  process,
  burned,
  checkburned,
  checkInfo,
} from "@/api/funeral";
import { exportExcel } from "@/api/excel";
import { getExcel } from "@/vendor/Export2Excel";
import print from "print-js";
import { getBlob, saveFile } from "@/utils/request-blob";

import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "CineraryOrder",
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: "未缴费",
        2: "已缴费",
        3: "已火化",
        4: "已生成火化证明",
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
      setName: "",
      listQuery: {
        page: 1,
        rows: 10,
        defunctName: "",
        defuntIdCard: "",
        state: "",
        ashesName: "",
      },
      exportQuery: {
        fileName: "逝者信息表格",
        excelType1: false, //编号
        excelType2: false, //日期
        startNum: "",
        endNum: "",
        startTime: "",
        endTime: "",
      },
      personInfo: {}, //火化证明
      personInfo2: {}, //身份信息

      dialogFormVisible: false,
      dialogExcelVisible: false,
      dialogPrintVisible: false,
      dialogInfoVisible: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      firePage(this.listQuery).then((response) => {
        const result = JSON.parse(response.result);
        // console.log("result", result);
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
        const { ashesid, finalOrderNo } = row;
        console.log(ashesid, finalOrderNo);

        updateCineraryOrder({ ashesid, finalOrderNo }).then(() => {
          this.dialogFormVisible = false;
          this.$message({
            message: "操作成功！",
            type: "success",
          });
          this.getList();
        });
      });
    },
    handleProcess(id) {
      // this.ashesid = ashesid; //弹窗里面使用
      process(39).then((response) => {
        console.log("response", response);
        this.personInfo = JSON.parse(response.result);
        console.log("this.personInfo", this.personInfo);
        this.dialogFormVisible = true;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    ckeckEndNum() {
      if (this.exportQuery.endNum) {
        if (this.exportQuery.endNum < this.exportQuery.startNum) {
          this.$message({
            message: "结束编号不能小于开始编号",
            type: "warning",
          });
          this.exportQuery.endNum = this.exportQuery.startNum;
          return false;
        }
      }
      return true;
    },
    async handleExport() {
      let temp = { fileName: "逝者信息表格" };
      if (this.exportQuery.excelType1) {
        if (this.ckeckEndNum()) {
          temp["startNum"] = this.exportQuery.startNum;
          temp["endNum"] = this.exportQuery.endNum;
        } else {
          return;
        }
      }
      if (this.exportQuery.excelType2) {
        if (this.exportQuery.startTime.length > 0) {
          temp["startTime"] = this.timeFormat(this.exportQuery.startTime[0]);
          temp["endTime"] = this.timeFormat(this.exportQuery.startTime[1]);
        } else {
          this.$message({
            message: "请选择时间",
            type: "warning",
          });
          return;
        }
      }
      const str = this.objectToString(temp);
      getBlob("/defunct/export/fireList?" + str, "逝者信息表格");
    },
    objectToString(obj) {
      return Object.keys(obj)
        .map((key) => `${key}=${obj[key]}`)
        .join("&");
    },
    timeFormat(dateStr) {
      // 创建一个新的Date对象
      const date = new Date(dateStr);

      // 获取年、月、日
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，所以需要+1
      const day = String(date.getDate()).padStart(2, "0");

      // 组合成所需的格式
      const formattedDate = `${year}-${month}-${day}`;
      return formattedDate;
    },
    burned(row) {
      burned(row.id).then((response) => {
        this.$message({
          message: "操作成功！",
          type: "success",
        });
        this.showPrint(response.result);
      });
    },
    checkburned(row) {
      checkburned(row.id).then((response) => {
        this.showPrint(response.result);
      });
    },
    checkInfo(row) {
      checkInfo(row.id).then((response) => {
        this.dialogInfoVisible = true;
        this.personInfo2 = JSON.parse(response.result);
      });
    },
    //打开打印
    showPrint(response) {
      this.dialogPrintVisible = true;
      this.personInfo = Object.assign({}, JSON.parse(response));
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
    print2() {
      const style =
        "@page {margin:10mm 10mm;   } " +
        "@media print {.print_table{width: 100%;}}";
      printJS({
        printable: "printBox2", // 标签元素id
        type: "html",
        header: "",
        targetStyles: ["*"],
        styles: style,
      });
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
.personInfo {
  display: flex;
  font-weight: bold;
  justify-content: space-between;
  color: #000;
  div {
    width: 20%;
  }
}
.processBoxs {
  height: 500px;
  overflow: scroll;
  display: flex;
  flex-wrap: wrap;
  padding: 60px 0;
  color: #000;
  .processBox {
    width: 50%;
    height: 80px;
    margin-bottom: 30px;
    .processTitle {
      font-size: 24px;
      margin-bottom: 15px;
    }
    .processHandler {
      font-size: 14px;
      margin-left: 48px;
    }
    .processTime {
      font-size: 14px;
      margin-left: 48px;
    }
  }
}
.ml20 {
  margin-left: 20px;
}
.width120 {
  width: 120px;
}
#printBox {
  width: 75%;
  // padding: 0 26%;
  // box-sizing: border-box;
  margin: 0 auto;
  div {
    line-height: 30px;
    letter-spacing: 1px;
  }
  // text-align: center;
  .number {
    // float: right;
    text-align: right;
    margin-bottom: 10px;
    span {
      text-decoration: underline;
      // color: aqua;
      // border-bottom: 1px solid #000;
    }
  }
  .title {
    font-size: 24px;
    text-align: center;
    margin-bottom: 30px;
  }
  .content {
    height: auto;
  }
  .indent {
    text-indent: 36px;
  }
  .end {
    text-align: end;
  }
}

#printBox2 {
  table {
    border-collapse: collapse;
    width: 100%;
  }

  th,
  td {
    border: 1px solid black;
    padding: 8px;
    text-align: center;
  }

  thead th {
    background-color: #f2f2f2;
  }

  tbody {
    border: 2px solid black;
  }

  tbody tr:first-child td {
    border-top: none; /* 移除 tbody 第一行的顶部边框 */
  }

  tbody tr:last-child td {
    border-bottom: none; /* 移除 tbody 最后一行的底部边框 */
  }

  tbody tr td:first-child {
    border-left: none; /* 移除 tbody 每行第一列的左边框 */
  }

  tbody tr td:last-child {
    border-right: none; /* 移除 tbody 每行最后一列的右边框 */
  }
}
</style>
