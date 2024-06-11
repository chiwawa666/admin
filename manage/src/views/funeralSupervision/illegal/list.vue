<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.content"
        placeholder="案件描述"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.userName"
        placeholder="上报人"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.userPhone"
        placeholder="上报人联系方式"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.type"
        clearable
        class="filter-item"
        style="width: 200px"
        placeholder="违法类型"
      >
        <el-option
          v-for="item in departmentLists"
          :key="item.typeid"
          :label="item.names"
          :value="item.typeid"
        />
      </el-select>
      <el-select
        v-model="listQuery.state"
        clearable
        class="filter-item"
        style="width: 200px"
        placeholder="状态"
      >
        <el-option
          v-for="item in stateList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
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
        @click="handleUpload"
        v-if="!canEdit"
      >
        上报
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
        :class-name="getSortClass('caseid')"
      >
        <template slot-scope="{ row }">
          <span>{{ row.caseid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="属地" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="事项">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="监管部门" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.partment | deptFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上报人" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="违法类型" align="center" width="auto">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处置结果" align="center" width="auto">
        <template slot-scope="{ row }">
          <span class="link-type">{{
            row.state | statusFilter(row.caseTackle)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="auto"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <router-link :to="'/funeralSupervision/edit/' + row.caseid">
            <el-button size="mini" type="primary"> 详情 </el-button>
          </router-link>

          <el-button
            size="mini"
            type="danger"
            v-if="canEdit && (row.state == 0 || row.state == 1)"
            @click="getpartmentList(row.caseid)"
          >
            指派
          </el-button>
          <el-button
            size="mini"
            type="danger"
            v-if="!canEdit && row.state == 0"
            @click="handle(row)"
          >
            处理
          </el-button>
          <el-button
            size="mini"
            type="danger"
            v-if="!canEdit && row.state == 0"
            @click="refuse(row.caseid)"
          >
            拒绝
          </el-button>
          <el-button
            size="mini"
            type="danger"
            v-if="canEdit && row.state != 2 && row.state != 3"
            @click="finish(row.caseid)"
          >
            结束
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

    <el-dialog title="事件上报" :visible.sync="dialogCaseVisible">
      <el-form
        ref="dataFormCase"
        :rules="rules"
        :model="uploadTemp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="案件归属地">
          <el-cascader
            v-model="uploadTemp.addressBelong"
            :options="options"
            :show-all-levels="false"
            prop="address"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="uploadTemp.addressDetail" />
        </el-form-item>
        <el-form-item label="举报类型">
          <el-cascader
            v-model="uploadTemp.type"
            :options="items"
            :show-all-levels="false"
            prop="type"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="举报内容" placeholder="请输入">
          <el-input
            type="textarea"
            v-model="uploadTemp.content"
            prop="content"
          />
        </el-form-item>
        <el-form-item label="图片上传" style="margin-bottom: 30px">
          <Upload @uploadSuccess="getFileId" />
          <img :src="imageUrl" alt="" class="imgLimit" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCaseVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="updateUpload()"
          :disabled="
            !uploadTemp.addressBelong ||
            !uploadTemp.addressDetail ||
            !uploadTemp.type ||
            !uploadTemp.content ||
            !uploadTemp.picid
          "
        >
          提交
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="事件指派" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="指派给">
          <el-checkbox-group v-model="checkList">
            <el-checkbox
              :label="item.name"
              v-for="(item, index) in partmentLists"
              :key="index"
            ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="处理意见" placeholder="请输入">
          <el-input type="textarea" v-model="view" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="updateOrder()"
          :disabled="checkList.length == 0 || view == ''"
        >
          提交
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="事件处理" :visible.sync="dialogHandleVisible">
      <el-form
        ref="dataFormhandle"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="处理意见" placeholder="请输入">
          <el-input type="textarea" v-model="handleView" />
        </el-form-item>
        <el-form-item label="图片上传" style="margin-bottom: 30px">
          <Upload @uploadSuccess="getFileId2" />
          <img :src="imageUrl2" alt="" class="imgLimit" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogHandleVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="updateHandle()"
          :disabled="handleView == '' || !picid2"
        >
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  illegalList,
  typeList,
  itemsList,
  partmentList,
  postOrder,
  refuseCase,
  finishCase,
  handleCase,
  uploadCase,
  allcity,
} from "@/api/funeralSupervision";
import Upload from "@/components/Upload/SingleImage3";
// import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import { mapGetters } from "vuex";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: "CN", display_name: "China" },
  { key: "US", display_name: "USA" },
  { key: "JP", display_name: "Japan" },
  { key: "EU", display_name: "Eurozone" },
];

const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});
let that;
export default {
  name: "ComplexTable",
  components: { Pagination, Upload },
  // directives: { waves },
  filters: {
    statusFilter(status, caseTackle) {
      let statusMap = {
        3: "用户取消",
        2: "已结束",
        1: "已处理",
        0: "未处理",
      };
      if (that.canEdit) {
        //admin 管理员登录的时候 状态内容不一样
        statusMap = {
          3: "用户取消",
          2: "已结束",
          1: "处理中",
          0: "未处理",
        };
        that.stateList = [
          { id: 0, name: "未处理" },
          { id: 1, name: "处理中" },
          { id: 2, name: "已结束" },
          { id: 3, name: "用户取消" },
        ];
      }

      return statusMap[status];
    },

    // const caseTackleMap = {
    //   0: "未处理",
    //   1: "已处理",
    //   2: "已结束",
    // };

    typeFilter(type) {
      return calendarTypeKeyValue[type];
    },
    deptFilter(partments) {
      let countrysStr = "";
      let isFirst = true;

      partments.forEach((element) => {
        if (isFirst) {
          countrysStr += element;
          isFirst = false;
        } else {
          countrysStr += "、" + element;
        }
      });

      return countrysStr;
    },
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      items: [],
      options: [],
      imageUrl: "",
      imageUrl2: "",
      picid2: "",
      listLoading: true,
      listQuery: {
        page: 1,
        rows: 10,
      },
      handleView: "",
      partmentLists: [],
      departmentLists: [],
      caseid: "",
      view: "",
      checkList: [],
      dialogPvVisible: false,
      dialogHandleVisible: false,
      dialogCaseVisible: false,
      typeLists: [],
      uploadTemp: {
        addressBelong: [],
        addressDetail: "",
        content: "",
        picid: "",
        type: [],
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" },
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
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create",
      },
      stateList: [
        { id: 0, name: "未处理" },
        { id: 1, name: "已处理" },
        { id: 2, name: "已结束" },
        { id: 3, name: "用户取消" },
      ],
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [
          { required: true, message: "type is required", trigger: "change" },
        ],
        address: [
          { required: true, message: "type is required", trigger: "change" },
        ],
        content: [
          { required: true, message: "type is required", trigger: "change" },
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
    that = this;
    allcity().then((response) => {
      const result = JSON.parse(response.result);
      console.log("result", result);
      this.options = this.findAndAssignChildren(result);
    });
    itemsList({}).then((response) => {
      let result = JSON.parse(response.result);
      console.log("result", result);
      let temp = result.map((item) => {
        return {
          value: item.typeid,
          label: item.names,
          children: this.getSecondType(item.caseTypeSecondList),
        };
      });

      this.items = temp;
    });
  },
  methods: {
    getList() {
      this.listLoading = true;
      illegalList(this.listQuery).then((response) => {
        const result = JSON.parse(response.result);
        this.list = result.rows;
        this.total = result.total;

        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 100);
      });
      typeList().then((response) => {
        const result = JSON.parse(response.result);
        this.departmentLists = result;
      });
    },
    getSecondType(list) {
      return list.map((item) => {
        return {
          value: item.typeid,
          label: item.names,
        };
      });
    },
    getFileId(order) {
      console.log("order", order);
      this.uploadTemp.picid = order.toString();
      this.imageUrl = "";
    },
    getFileId2(order) {
      console.log("order", order);
      this.picid2 = order.toString();
      this.imageUrl2 = "";
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
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
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
    updateOrder() {
      const tempids = [];
      this.checkList.map((dept1) => {
        this.partmentLists.forEach((dept) => {
          if (dept.name == dept1) {
            tempids.push(Number(dept.partmentid));
            return;
          }
        });
      }); // 过滤出匹配的部门
      console.log(tempids);
      postOrder({
        caseid: this.caseid,
        partmentids: tempids,
        view: this.view,
      }).then((response) => {
        const result = JSON.parse(response.result);
        this.dialogFormVisible = false;
        this.$message({
          message: "操作成功！",
          type: "success",
        });
        console.log("提交");
      });
    },
    getpartmentList(caseid) {
      this.caseid = caseid;
      partmentList(caseid).then((response) => {
        const result = JSON.parse(response.result);
        this.partmentLists = result;

        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 100);
      });
      this.dialogFormVisible = true;
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
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.id);
            this.list.splice(index, 1, this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Update Successfully",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    updateUpload() {
      const flattenedOption = this.transformOption(this.options);
      console.log("flattenedOption", flattenedOption);
      const temp = {
        address: flattenedOption[0].str + this.uploadTemp.addressDetail,
        country: Number(
          this.uploadTemp.addressBelong[2].replace(/^countryID(\d+)$/, "$1")
        ),
        longitude: "120.245065",
        latitude: "29.720665",
        content: this.uploadTemp.content,
        type: this.uploadTemp.type[1],
        picid: this.uploadTemp.picid,
      };
      uploadCase(temp).then(() => {
        this.$message({
          title: "操作成功",
          type: "success",
          duration: 2000,
        });
        this.dialogCaseVisible = false;
        this.getList();
      });
      console.log("temp", temp);
    },

    // 辅助函数：递归遍历 option 并平铺成一维数组
    flattenOption(option, address = [], str = "") {
      let result = [];
      for (let item of option) {
        let newAddress = [...address, item.value];
        let newStr = str === "" ? item.label : `${str}${item.label}`;
        if (
          address[0] == this.uploadTemp.addressBelong[0] &&
          address[1] == this.uploadTemp.addressBelong[1] &&
          item.value == this.uploadTemp.addressBelong[2]
        ) {
          result.push({
            value1: address[0] || "",
            value2: address[1] || "",
            value3: item.value || "",
            str: newStr,
          });
        }

        if (item.children) {
          result = result.concat(
            this.flattenOption(item.children, newAddress, newStr)
          );
        }
      }
      return result;
    },

    // 将 option 平铺为一维数组，并构造所需的数据格式
    transformOption(option) {
      return this.flattenOption(option);
    },

    // 匹配函数：检查数组结果中的 value1、value2 和 value3 是否与给定地址值匹配
    matchAddress(arr, cityID, townID, countryID) {
      for (let item of arr) {
        if (
          item.value1 === cityID &&
          item.value2 === townID &&
          item.value3 === countryID
        ) {
          return item.str;
        }
      }
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
    handleFetchPv(pv) {
      fetchPv(pv).then((response) => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },
    handle(row) {
      this.dialogHandleVisible = true;
      this.temp = Object.assign({}, row); // copy obj
      this.handleView = "";
    },
    updateHandle() {
      let temp = {
        caseid: this.temp.caseid,
        view: this.handleView,
        picid: this.picid2,
      };

      handleCase(temp).then(() => {
        this.$notify({
          title: "操作成功",
          type: "success",
          duration: 2000,
        });
        this.dialogHandleVisible = false;
        this.getList();
      });
    },
    refuse(id) {
      this.$confirm("请再次确认是否要拒绝案件", "", {
        confirmButtonText: "是的",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        refuseCase({ caseid: id }).then(() => {
          this.$message({
            message: "操作成功！",
            type: "success",
          });
          this.getList();
        });
      });
    },
    finish(id) {
      this.$confirm("请再次确认是否要结束案件", "", {
        confirmButtonText: "是的",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        finishCase({ caseid: id }).then(() => {
          this.$message({
            message: "操作成功！",
            type: "success",
          });
          this.getList();
        });
      });
    },
    handleUpload() {
      this.upload = {
        address: "",
        country: 1,
        longitude: "120.245065",
        latitude: "29.720665",
        content: "",
        type: 0,
        picid: "",
      };
      this.dialogCaseVisible = true;
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
    ...mapGetters(["user"]),
    canEdit() {
      return this.user.roles.includes("ROLE_ADMIN");
    },
  },
};
</script>

<style scoped lang="scss">
.imgLimit {
  width: 100px;
  margin-left: 20px;
}
</style>