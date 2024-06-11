<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.defunctName"
        placeholder="逝者姓名"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.defunctIdCard"
        placeholder="逝者身份证号"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.state"
        clearable
        class="filter-item"
        style="width: 130px"
        placeholder="请选择"
      >
        <el-option
          v-for="item in stateOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>
      <router-link to="/funeral/create">
        <el-button
          type="primary"
          size="mini"
          class="float-right-button"
          @click="handleCreate"
        >
          添加
        </el-button>
      </router-link>
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
      <el-table-column label="编号" prop="id" sortable="custom" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.defunctid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="逝者姓名" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.defunctName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="年龄">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.age }}</span>
        </template>
      </el-table-column>
      <el-table-column label="遗体接运时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.carTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="死亡原因" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.death_cause }}</span>
        </template>
      </el-table-column>
      <el-table-column label="家属姓名" align="center" width="auto">
        <template slot-scope="{ row }">
          <span>{{ row.manager }}</span>
        </template>
      </el-table-column>
      <el-table-column label="家属联系方式" align="center" width="auto">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.managerPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="家属关系" align="center" width="auto">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.managerRelation }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预约来源" align="center" width="auto">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.srcTypeStr }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="auto">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.stateStr }}</span>
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
            @click="handleRegister(row)"
            v-if="row.state == 1"
          >
            接运登记
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
    />

    <el-dialog title="接运登记" :visible.sync="dialogFormVisible" width="68%">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="tempInfo"
        label-position="left"
        label-width="70px"
        style="margin-left: 50px"
      >
        <el-form-item label="逝者姓名">
          <span>{{ tempInfo.defunctName }}</span>
        </el-form-item>
        <el-form-item label="证件号码">
          <span>{{ tempInfo.defunctIdCard }}</span>
        </el-form-item>
        <el-form-item label="联系人">
          <span>{{ tempInfo.manager }}</span>
        </el-form-item>
        <el-form-item label="联系方式">
          <span>{{ tempInfo.managerPhone || "无" }}</span>
        </el-form-item>
        <el-form-item label="预约时间">
          <span>{{ tempInfo.carTime }}</span>
        </el-form-item>
        <el-form-item label="状态">
          <span>{{ tempInfo.stateStr }}</span>
        </el-form-item>
      </el-form>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="service"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="选择服务" align="center" width="auto">
          <template slot-scope="{ row }">
            <el-checkbox
              v-model="row.selected"
              @change="handleCheckedChange(row)"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="服务项目" align="center" width="auto">
          <template slot-scope="{ row }">
            <span class="link-type">{{ row.names }}</span>
          </template>
        </el-table-column>

        <el-table-column label="价格" align="center" width="auto">
          <template slot-scope="{ row }">
            <span class="link-type">{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="价格单位" align="center" width="auto">
          <template slot-scope="{ row }">
            <span class="link-type">{{ row.priceUnit }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数量" align="center" width="320px">
          <template slot-scope="{ row }">
            <el-input-number
              v-model="row.count"
              :min="0"
              :max="100"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="加班" align="center" width="auto">
          <template slot-scope="{ row }">
            <el-checkbox v-model="row.overTime"></el-checkbox>
          </template>
        </el-table-column>

        <el-table-column
          label="补贴金额"
          align="center"
          width="200px"
          class="limitWidth"
          style="padding-left: 10px"
        >
          <template slot-scope="{ row }">
            <span class="link-type">{{ row.subsidy }}</span>
          </template>
        </el-table-column>
        <el-table-column label="金额" align="center" width="auto">
          <template slot-scope="{ row }">
            <span class="link-type">{{
              !row.selected ? 0 : Number(row.price) * row.count - row.subsidy
            }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          :disabled="temp.carName == ''"
          @click="updateData"
        >
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAppointments } from "@/api/appointment";
import { getProduction, updatefinalOrder } from "@/api/funeral";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: "CN", display_name: "China" },
  { key: "US", display_name: "USA" },
  { key: "JP", display_name: "Japan" },
  { key: "EU", display_name: "Eurozone" },
];

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "ComplexTabsdle",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    },
    change(val) {
      const arr = ["第一班", "第二班", "第三班", "第四班"];
      return arr[val - 1];
    },
    salvage(val) {
      const arr = ["否", "是"];
      return arr[val];
    },
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      selected: 1,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        defunctName: "",
        defunctIdCard: "",
        state: 1,
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      stateOptions: [
        {
          id: 0,
          name: "待处理",
        },
        {
          id: 1,
          name: "已调度",
        },
        {
          id: 2,
          name: "已完成",
        },
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        type: "",
        status: "published",
      },
      tempInfo: [],
      service: [],
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create",
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
        title: [
          { required: true, message: "title is required", trigger: "blur" },
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
      getAppointments(this.listQuery).then((response) => {
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
      let tempArray = [];
      this.service.forEach((item) => {
        if (item.selected) {
          let tempObj = {
            productid: item.productid,
            names: item.names,
            price: item.price,
            subsidyPrice: item.subsidy,
            count: item.count,
            overTime: item.overTime,
            subsidy: item.subsidy == "" ? false : true,
          };
          tempArray.push(tempObj);
        }
      });
      console.log("tempArray", tempArray);
      const data = {
        orderUserNo: this.temp.orderUserNo,
        productDtos: tempArray,
      };
      updatefinalOrder(data, "post").then((response) => {
        console.log("response", response);
        this.dialogFormVisible = false;
        this.$message({
          message: "操作成功！",
          type: "success",
        });
        this.getList();
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
    handleRegister(row) {
      this.tempInfo = row;
      this.temp = Object.assign({}, row);
      //获取 接运列表
      getProduction({ categoryId: "1" }).then((response) => {
        const templist = JSON.parse(response.result).rows;
        templist.forEach((item) => {
          item.selected = false;
          item.overTime = false;
          item.count = 0;
        });
        this.service = templist;
        this.dialogFormVisible = true;
      });
    },
    handleCheckedChange(row) {
      if (row.selected) {
        row.count = 1;
      } else {
        row.count = 0;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.el-dialog__body .el-form-item {
  display: inline-block;
  width: 50%;
}
.el-input {
  width: 80%;
}
.el-dialog {
  width: 60%;
}
</style>