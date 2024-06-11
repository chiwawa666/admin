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
      <el-table-column label="商家名称" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="详细地址" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.contentAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column label="营业执照号码" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.licenseno }}</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.manager }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" align="center">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.managerPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="auto"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <!-- <el-button type="info" size="mini" @click="getInfo(row.productid)">
            详情
          </el-button> -->
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button
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
      :total="total"
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
        <el-form-item label="商家名称" prop="realName">
          <el-input v-model="temp.realName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="temp.address" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="详细地址" prop="contentAddress">
          <el-input v-model="temp.contentAddress" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="营业执照号码" prop="licenseno">
          <el-input
            v-model="temp.licenseno"
            placeholder="请输入"
            :disabled="dialogStatus === 'create' ? false : true"
          />
        </el-form-item>
        <el-form-item label="负责人" prop="manager">
          <el-input v-model="temp.manager" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="负责人联系方式" prop="managerPhone">
          <el-input v-model="temp.managerPhone" placeholder="请输入" />
        </el-form-item>
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
  merchants,
  addMerchant,
  updateMerchant,
  deleteMerchant,
} from "@/api/funeral";
import Upload from "@/components/Upload/SingleImage3";
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "Production",
  components: { Pagination, Upload },
  // directives: { waves },
  filters: {
    typeFilter(val) {
      const tempType = ["其他", "火化炉", "灵堂", "存放柜", "冷冻柜"];
      return tempType[val];
    },
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      state: "0",
      carInfos: [],
      imageUrl: "",
      listLoading: true,
      listQuery: {
        page: 1,
        rows: 10,
        type: 0,
      },
      importanceOptions: [1, 2, 3],
      showReviewer: false,
      productid: 0,
      temp: {
        parlorid: 1,
        realName: "",
        address: "",
        contentAddress: "",
        licenseno: "",
        manager: "",
        managerPhone: "",
      },
      dialogFormVisible: false,
      dialogInfoVisible: false,
      classifyList: [],
      stateList: [
        { id: 0, name: "不需要" },
        { id: 1, name: "自动排号" },
        { id: 2, name: "手动排号" },
      ],
      typeList: [
        { id: 0, name: "其他" },
        { id: 1, name: "火化炉" },
        { id: 2, name: "灵堂" },
        { id: 3, name: "存放柜" },
        { id: 4, name: "冷冻柜" },
      ],
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "新增",
      },
      dialogPvVisible: false,
      pvData: [],

      rules: {
        realName: [
          { required: true, message: "商家名称不可为空！", trigger: "blur" },
        ],
        address: [
          { required: true, message: "商家地址不可为空！", trigger: "blur" },
        ],
        contentAddress: [
          {
            required: true,
            message: "商家详细地址不可为空！",
            trigger: "blur",
          },
        ],
        licenseno: [
          {
            required: true,
            message: "商家营业执照号不可为空！",
            trigger: "blur",
          },
        ],
        manager: [
          {
            required: true,
            message: "商家负责人不可为空！",
            trigger: "blur",
          },
        ],
        managerPhone: [
          {
            required: true,
            message: "商家负责人电话不可为空！",
            trigger: "blur",
          },
        ],
      },
      downloadLoading: false,
    };
  },
  created() {
    this.getList();
    this.getclassify();
  },
  methods: {
    getList() {
      this.listLoading = true;
      merchants(this.listQuery).then((response) => {
        const result = JSON.parse(response.result);

        this.list = result.rows;
        this.total = result.total;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 100);
      });
    },
    getclassify() {
      getclassify({ type: 0 }).then((response) => {
        const result = JSON.parse(response.result);
        this.classifyList = result.rows;
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
    getInfo(productid) {
      this.productid = productid; //弹窗里面使用
      getDriverInfo(productid).then((response) => {
        this.carInfos = JSON.parse(response.result).rows;
        this.dialogInfoVisible = true;
      });
    },
    getFileId(order) {
      console.log("order", order);
      this.temp.picid = Number(order);
      this.imageUrl = "";
    },
    resetTemp() {
      this.temp = {
        parlorid: 1,
        realName: "",
        address: "",
        contentAddress: "",
        licenseno: "",
        manager: "",
        managerPhone: "",
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
          addMerchant(this.temp).then(() => {
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
          const {
            bussinessid,
            parlorid,
            realName,
            address,
            contentAddress,
            manager,
            managerPhone,
          } = this.temp;
          const newObj = {
            bussinessid,
            parlorid,
            realName,
            address,
            contentAddress,
            manager,
            managerPhone,
          };
          updateMerchant(newObj).then(() => {
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
      console.log(row);
      this.$confirm("确定执行删除操作吗?", "", {
        confirmButtonText: "是的",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const { bussinessid } = row;
        deleteMerchant(bussinessid).then(() => {
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
  computed: {
    validRules() {
      if (
        this.temp.names !== "" &&
        this.temp.categoryid !== "" &&
        this.temp.state !== "" &&
        this.temp.type !== "" &&
        this.temp.content !== "" &&
        this.temp.price !== "" &&
        this.temp.priceUnit !== "" &&
        this.temp.subsidy !== ""
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>
<style scoped lang="scss">
</style>