<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="经办人姓名"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.phone"
        placeholder="联系方式"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-select
        v-model="listQuery.deparmdent"
        placeholder="所属部门"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option label="所有部门" />
        <el-option
          v-for="item in dapartments"
          :key="item.partmentid"
          :label="item.name"
          :value="item.partmentid"
        />
      </el-select>

      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>

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
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        label="编号"
        prop="id"
        sortable="custom"
        align="center"
        width="180"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{ row }">
          <span>{{ row.adminid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属部门">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.deparmdent }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" width="220px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="管理地区" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.countrys | countrysFilter }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="{ row }">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column> -->
      <el-table-column
        label="操作"
        align="center"
        width="auto"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
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
    />

    <el-dialog
      :title="dialogStatus"
      :visible.sync="dialogFormVisible"
      z-index="1000"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="max-width: 500px; margin-left: 50px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="所属部门" prop="deparmdentid">
          <el-select v-model="temp.deparmdentid" placeholder="请选择">
            <el-option
              v-for="(item, index) in dapartments"
              :key="index.partmentid"
              :label="item.name"
              :value="item.partmentid"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="temp.phone" type="Number" />
        </el-form-item>
        <el-form-item label="管理地区" prop="selected">
          <el-cascader
            :props="props"
            v-model="temp.selected"
            :options="options"
            :show-all-levels="false"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === '新增' ? createData() : updateData()"
        >
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  managerList,
  departmentList,
  deleteManager,
  addmanager,
  updatemanager,
  allcity,
} from "@/api/funeralSupervision";
import { getPrivateCodeApi } from "@/utils/requestPrivate";
// import waves from "@/directive/waves"; // waves directive
import { mapGetters } from "vuex";
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "ComplexTable",
  components: { Pagination },
  // directives: { waves },
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
    countrysFilter(countrys) {
      let countrysStr = "";
      let isFirst = true;

      countrys.forEach((element) => {
        if (isFirst) {
          countrysStr += element.name;
          isFirst = false;
        } else {
          countrysStr += "、" + element.name;
        }
      });

      return countrysStr;
    },
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      dapartments: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        rows: 10,
      },
      props: {
        multiple: true,
        expandTrigger: "hover",
        emitPath: false,
      },
      options: [],

      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" },
      ],
      someAddress: [
        "繁昌区-孙村镇-水口村",
        "繁昌区-繁阳镇-团阳社区",
        "繁昌区-繁阳镇-新光社区",
        "繁昌区-繁阳镇-安定社区",
        "繁昌区-平铺镇-五华村",
        "繁昌区-平铺镇-寒塘村",
        "繁昌区-荻港镇-桃冲村",
        "繁昌区-荻港镇-鹊江村",
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        name: "",
        deparmdentid: 1,
        phone: "",
        selected: [],
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "新增",
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        name: [{ required: true, message: "姓名不可为空", trigger: "blur" }],
        selected: [
          { required: true, message: "管理地区不可为空", trigger: "blur" },
        ],
        deparmdentid: [
          { required: true, message: "所属部门不可为空", trigger: "blur" },
        ],

        phone: [
          { required: true, message: "联系方式不可为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
      },
      downloadLoading: false,
    };
  },
  computed: {
    ...mapGetters(["user"]),
    canEdit() {
      return this.user.roles.includes("ROLE_ADMIN");
    },
  },
  created() {
    this.getList();
  },
  mounted() {
    allcity().then((response) => {
      const result = JSON.parse(response.result);
      console.log("result", result);
      this.options = this.findAndAssignChildren(result);
    });
  },
  methods: {
    getList() {
      this.listLoading = true;
      console.log(this.listQuery);
      managerList(this.listQuery).then((response) => {
        const result = JSON.parse(response.result);
        console.log(result);
        this.list = result.rows;
        this.total = result.total;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 100);
      });
      departmentList().then((response) => {
        this.dapartments = JSON.parse(response.result);
        this.dapartments.forEach((element) => {
          element.partmentid = element.partmentid.toString();
        });
      });
    },
    getCode() {
      getPrivateCodeApi().then((response) => {
        this.getList();
      });
    },
    findAndAssignChildren(obj) {
      let opt = [];
      obj.town.forEach((townElement) => {
        let town = {
          value: "cityID" + townElement.cityId,
          label: townElement.name,
          children: [],
        };

        townElement.townVos.forEach((townVoElement) => {
          let townVo = {
            value: "townID" + townVoElement.townId,
            label: townVoElement.name,
            children: townVoElement.countryVos.map((countryVoElement) => ({
              value: "countryID" + countryVoElement.countryId,
              label: countryVoElement.name,
            })),
          };

          town.children.push(townVo);
        });

        opt.push(town);
      });

      console.log("opt", opt);
      return opt;
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
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
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
        name: "",
        deparmdentid: "",
        phone: "",
        selected: [],
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "新增";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          let { name, phone, deparmdentid } = this.temp;
          console.log(
            "name",
            name,
            "phone",
            phone,
            "deparmdentid",
            deparmdentid
          );
          let countrys = [];
          this.temp.selected.forEach((element) => {
            countrys.push({ countryId: Number(element.split("countryID")[1]) });
          });
          console.log("countrys", countrys);
          addmanager({ name, phone, deparmdentid, countrys }).then(() => {
            this.dialogFormVisible = false;
            this.$message({
              message: "操作成功！",
              type: "success",
              duration: 2000,
            });
            this.dialogFormVisible = false;
            this.getList();
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj

      if (this.temp.phone.includes("*")) {
        this.$message({
          message:
            "详情内容中联系方式为敏感信息，请点击右侧'查看全部信息'按钮获取脱敏信息",
          type: "success",
          duration: 5000,
        });
      }
      if (this.temp.countrys && this.temp.countrys.length > 0) {
        // ("countryID1");
        // this.temp.selected = [];
        this.$set(this.temp, "selected", []);

        console.log("置空");
        this.temp.countrys.forEach((element) => {
          this.temp.selected.push("countryID" + element.countryId);
        });
      }
      this.temp.deparmdentid = this.temp.deparmdentid.toString();
      this.dialogStatus = "编辑";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          let { name, phone, deparmdentid, adminid } = this.temp;
          console.log(
            "name",
            name,
            "phone",
            phone,
            "deparmdentid",
            deparmdentid
          );
          let countrys = [];
          this.temp.selected.forEach((element) => {
            countrys.push({ countryId: Number(element.split("countryID")[1]) });
          });
          updatemanager({
            adminid,
            name,
            phone,
            deparmdentid,
            state: 1,
            countrys,
          }).then(() => {
            this.dialogFormVisible = false;
            this.$message({
              message: "操作成功！",
              type: "success",
              duration: 2000,
            });
            this.dialogFormVisible = false;
            this.getList();
          });
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
        const { adminid } = row;
        deleteManager(adminid).then(() => {
          this.$message({
            message: "操作成功！",
            type: "success",
            duration: 2000,
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
};
</script>
