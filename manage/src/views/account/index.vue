<template>
  <div class="app-container">
    <div class="filter-container">
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
        <template slot-scope="{ $index }">
          <span>{{ $index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.roles != null ? row.roles[0].roleName : "" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.realname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建者" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.creator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="auto">
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeState(row)"
          >
          </el-switch>
          <span style="margin-left: 5px">{{
            row.state ? "正常" : "冻结"
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
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="姓名" prop="realname">
          <el-input v-model="temp.realname" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="temp.phone" placeholder="请输入" />
        </el-form-item>

        <el-form-item
          label="角色"
          prop="role"
          v-if="!(temp.role == 2 && dialogStatus == 'update')"
        >
          <el-select v-model="temp.role" placeholder="请选择">
            <el-option
              :value="item.roleId"
              :label="item.roleName"
              v-for="item in roles"
              :key="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" prop="department" v-if="temp.role == 12">
          <el-select v-model="temp.department" placeholder="请选择">
            <el-option
              :value="item.partmentid"
              :label="item.name"
              v-for="item in departmentList"
              :key="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="公墓" prop="cemetery" v-if="temp.role == 2">
          <el-select v-model="temp.cemetery" multiple placeholder="请选择">
            <el-option
              v-for="(item, index) in cemeteryList"
              :key="index.cemeteryId"
              :label="item.cemeteryName"
              :value="item.cemeteryId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属商家" prop="merchant" v-if="temp.role == 11">
          <el-select v-model="temp.department" placeholder="请选择">
            <el-option
              v-for="(item, index) in merchantList"
              :key="index.bussinessid"
              :label="item.realName"
              :value="item.bussinessid"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商家地址" prop="address" v-if="temp.role == 11">
          <el-input v-model="temp.address" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          :disabled="temp.names == ''"
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
  getAccounts,
  updateState,
  getRoles,
  getRelationship,
  updateAccounts,
} from "@/api/account";
import { departmentList } from "@/api/funeralSupervision";
import { merchants } from "@/api/funeral";
// import { getCemeterys } from "@/api/cemetery";
import waves from "@/directive/waves"; // waves directive
import { getPrivateCodeApi } from "@/utils/requestPrivate";
import Pagination from "@/components/Pagination";

export default {
  name: "ComplexTable",
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
    var validateCemetery = (rule, value, callback) => {
      if (value === "" && this.temp.role == 2) {
        callback(new Error("公墓是必填项"));
      } else {
        callback();
      }
    };
    var validateAddress = (rule, value, callback) => {
      if (value === "" && this.temp.role == 11) {
        callback(new Error("商家地址是必填项"));
      } else {
        callback();
      }
    };
    var validateMerchant = (rule, value, callback) => {
      if (value === "" && this.temp.role == 11) {
        callback(new Error("所属商家是必填项"));
      } else {
        callback();
      }
    };
    var validateDepartment = (rule, value, callback) => {
      if (value === "" && (this.temp.role == 12 || this.temp.role == 11)) {
        callback(new Error("部门是必填项"));
      } else {
        callback();
      }
    };
    return {
      tableKey: 0,
      list: null,
      total: 0,
      selected: 1,
      listLoading: true,
      listQuery: {
        page: 1,
        rows: 10,
        defunctName: "",
        defunctIdCard: "",
        state: null,
      },
      importanceOptions: [1, 2, 3],
      stateOptions: [
        {
          id: null,
          name: "全部",
        },
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
      roles: [],
      showReviewer: false,
      departmentList: [],
      temp: {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        type: "",
        status: "published",
        department: "",
        role: "",
        cemetery: "",
        merchant: "",
        address: "",
      },
      tempInfo: [],
      merchantList: [],
      service: [],
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "新增",
      },
      dialogPvVisible: false,
      pvData: [],
      cemeteryList: [],
      rules: {
        username: [
          { required: true, message: "用户名是必填项", trigger: "blur" },
        ],
        realname: [
          {
            required: true,
            message: "姓名是必填项",
            trigger: "blur",
          },
        ],
        phone: [
          { required: true, message: "联系方式是必填项", trigger: "blur" },
        ],

        role: [{ required: true, message: "角色是必填项", trigger: "change" }],
        cemetery: [{ validator: validateCemetery, trigger: "blur" }],
        address: [{ validator: validateAddress, trigger: "blur" }],
        department: [{ validator: validateDepartment, trigger: "blur" }],
        merchant: [{ validator: validateMerchant, trigger: "blur" }],
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
      getAccounts(this.listQuery).then((response) => {
        const result = JSON.parse(response.result);
        let temp = result.rows.map((item) => {
          item.state = item.state == 1 ? true : false;
          item.department = Number(item.department);
          return item;
        });
        this.list = temp;
        this.total = result.total;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 100);
      });
      getRoles().then((response) => {
        const result = JSON.parse(response.result);
        this.roles = result.filter((item) => item.roleId != 1);
      });
      departmentList().then((response) => {
        const result = JSON.parse(response.result);
        this.departmentList = result;
      });
      merchants().then((response) => {
        const result = JSON.parse(response.result);
        this.merchantList = result.rows;
      });
      getRelationship().then((response) => {
        const result = JSON.parse(response.result);
        let tempArr = [];
        result.forEach((element) => {
          if (element.cemeteryVoList.length > 0) {
            element.cemeteryVoList.forEach((item) => {
              let tempObj = {
                cemeteryId: item.cemeteryId,
                cemeteryName: item.cemeteryName,
                departmentId: element.departmentId,
                type: element.type,
              };
              tempArr.push(tempObj);
            });
          }
        });
        this.cemeteryList = tempArr;
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
        type: "",
        status: "published",
        department: "",
        role: 2,
        cemetery: [],
        address: "",
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
          const tempData = Object.assign({}, this.temp);
          let tempStr = "";
          let { username, realname, phone } = tempData;
          const upateObj = {
            username,
            realname,
            phone,
          };
          if (tempData.role === 9 || tempData.role === 10) {
            //殡仪馆
            upateObj.parlorIds = 1;
          }
          if (tempData.role === 2) {
            //公墓
            tempData.cemetery.forEach((item) => {
              this.cemeteryList.forEach((cemetery) => {
                if (item == cemetery.cemeteryId) {
                  if (tempStr == "") {
                    tempStr =
                      cemetery.departmentId +
                      "-" +
                      cemetery.type +
                      "-" +
                      cemetery.cemeteryId;
                  } else {
                    tempStr =
                      tempStr +
                      "," +
                      cemetery.departmentId +
                      "-" +
                      cemetery.type +
                      "-" +
                      cemetery.cemeteryId;
                  }
                }
              });
              console.log("tempStr", tempStr);
            });
          } else if (tempData.role === 11) {
            upateObj.address = tempData.address;
            upateObj.department = tempData.department;
            tempStr = tempData.role + "-4";
          } else if (tempData.role === 12) {
            upateObj.department = tempData.department;
            tempStr = tempData.role + "-4";
          } else {
            tempStr = tempData.role + "-4";
          }
          upateObj.roleIds = tempStr;
          updateAccounts(upateObj, "post").then((response) => {
            console.log("response", response);
            this.dialogFormVisible = false;
            this.$message({
              message: "操作成功！",
              type: "success",
            });
            this.getList();
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj

      this.$set(this.temp, "role", this.temp.roles[0].roleId);
      if (this.temp.role == 2) {
        this.$set(this.temp, "cemetery", []);
        this.temp.roles[0].adminCemeteries.forEach((item) => {
          this.temp.cemetery.push(item.cemeteryid);
        });
      }
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    getCode() {
      getPrivateCodeApi().then((response) => {
        this.getList();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          let tempStr = "";
          let { username, realname, phone, adminid } = tempData;
          const upateObj = {
            adminid,
            username,
            realname,
            phone,
          };
          if (tempData.role === 9 || tempData.role === 10) {
            //殡仪馆
            upateObj.parlorIds = 1;
          }
          if (tempData.role === 2) {
            //公墓
            tempData.cemetery.forEach((item) => {
              this.cemeteryList.forEach((cemetery) => {
                if (item == cemetery.cemeteryId) {
                  if (tempStr == "") {
                    tempStr =
                      cemetery.departmentId +
                      "-" +
                      cemetery.type +
                      "-" +
                      cemetery.cemeteryId;
                  } else {
                    tempStr =
                      tempStr +
                      "," +
                      cemetery.departmentId +
                      "-" +
                      cemetery.type +
                      "-" +
                      cemetery.cemeteryId;
                  }
                }
              });
              console.log("tempStr", tempStr);
            });
          } else if (tempData.role === 11) {
            upateObj.address = tempData.address;
            upateObj.department = tempData.department;
            tempStr = tempData.role + "-4";
          } else if (tempData.role === 12) {
            upateObj.department = tempData.department;
            tempStr = tempData.role + "-4";
          } else {
            tempStr = tempData.role + "-4";
          }
          upateObj.roleIds = tempStr;
          updateAccounts(upateObj, "put").then((response) => {
            console.log("response", response);
            this.dialogFormVisible = false;
            this.$message({
              message: "操作成功！",
              type: "success",
            });
            this.getList();
          });
        }
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

    changeState(row) {
      let state = row.state ? 1 : 0;
      const { adminid } = row;
      updateState({ adminid, state }).then((response) => {
        console.log("response", response);
        this.dialogFormVisible = false;
        this.$message({
          message: "操作成功！",
          type: "success",
        });
        this.getList();
      });
    },
  },
};
</script>

<style scoped lang="scss">
.el-input {
  width: 80%;
}
.el-dialog {
  width: 60%;
}
</style>