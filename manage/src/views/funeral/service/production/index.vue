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
      <el-table-column label="名称" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.names }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分类" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.categoryName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品类型" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.type | typeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格单位" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.priceUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="补助" align="center">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.subsidy }}</span>
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
            v-if="row.status != 'deleted'"
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
        <el-form-item label="名称">
          <el-input v-model="temp.names" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select
            v-model="temp.categoryid"
            class="filter-item"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in classifyList"
              :key="item.typeid"
              :label="item.names"
              :value="item.typeid"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否需要排号">
          <el-select
            v-model="temp.state"
            class="filter-item"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in stateList"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="产品类型">
          <el-select
            v-model="temp.type"
            class="filter-item"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in typeList"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="temp.price" type="Number" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="价格单位">
          <el-input v-model="temp.priceUnit" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="补助">
          <el-input v-model="temp.subsidy" type="Number" />
        </el-form-item>
        <el-form-item label="详细内容" style="width: 800px">
          <el-input
            v-model="temp.content"
            autosize
            show-word-rows
            maxlength="1000"
            type="textarea"
            placeholder="请输入"
          />
        </el-form-item>
        <!-- 七牛云 -->
        <el-form-item
          label="图片上传"
          style="margin-bottom: 30px; width: 800px"
        >
          <Upload @uploadSuccess="getFileId" />
          <img :src="imageUrl" alt="" class="imgLimit" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          :disabled="!validRules"
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
  getProductAll,
  getclassify,
  getProductionInfo,
  updateProduction,
  deleteProduction,
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
        names: "",
        categoryid: 0,
        state: 1,
        type: 1,
        content: "",
        priceUnit: "",
        price: "",
        subsidy: "",
        picid: "",
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
        driverName: [
          { required: true, message: "编号不能为空", trigger: "blur" },
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
      getProductAll(this.listQuery).then((response) => {
        const result = JSON.parse(response.result);
        let arr = [];
        console.log("result", result);
        result.forEach((element) => {
          element.voLists.forEach((item) => {
            arr.push(item);
          });
        });

        this.list = arr;
        this.total = arr.length;
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
        names: "",
        categoryid: "",
        state: "",
        type: "",
        content: "",
        price: "",
        priceUnit: "",
        subsidy: "",
        picid: "",
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
          updateProduction(this.temp, "post").then(() => {
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
      getProductionInfo(this.temp.productid).then((response) => {
        console.log("response", response);
        this.temp = JSON.parse(response.result);
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          const {
            productid,
            names,
            parlorid,
            categoryid,
            state,
            type,
            content,
            price,
            priceUnit,
            subsidy,
            picid,
          } = tempData;
          updateProduction(
            {
              productid,
              names,
              parlorid,
              categoryid,
              state,
              type,
              content,
              price,
              priceUnit,
              subsidy,
              picid,
            },
            "put"
          ).then(() => {
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
      this.$confirm("确定执行删除操作吗?", "Warning", {
        confirmButtonText: "是的",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const { productid } = row;
        deleteProduction(productid).then(() => {
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