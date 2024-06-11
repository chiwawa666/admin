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
      :span-method="handleSpan"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column label="类型" prop="id" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.typeName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="事项" align="center" row="2">
        <template slot-scope="{ row }">
          <span>{{ row.names }}</span>
        </template>
      </el-table-column>
      <el-table-column label="牵头部门">
        <template slot-scope="{ row }">
          <span class="link-type">{{
            row.partmentList | filterPartment(1)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="配合部门">
        <template slot-scope="{ row }">
          <span class="link-type">{{
            row.partmentList | filterPartment(2)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="监管内容" width="auto">
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.content }}</span>
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

          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row.typeid)"
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="margin-left: 50px"
      >
        <el-form-item label="分类" prop="typeId">
          <el-select v-model="temp.typeId" placeholder="请选择">
            <el-option
              v-for="(item, index) in FirstTypeList"
              :key="index.typeid"
              :label="item.names"
              :value="item.typeid"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="事项" prop="names" placeholder="请输入">
          <el-input v-model="temp.names" />
        </el-form-item>

        <el-form-item label="牵头部门" prop="managerid">
          <el-select
            v-model="temp.managerid"
            placeholder="请选择"
            @change="managerChange"
          >
            <el-option
              v-for="(item, index) in dapartments"
              :key="index.partmentid"
              :label="item.name"
              :value="item.partmentid"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="配合部门">
          <el-select v-model="temp.handleLists" multiple placeholder="请选择">
            <el-option
              v-for="(item, index) in dapartments"
              :key="index.partmentid"
              :label="item.name"
              :value="item.partmentid"
              :disabled="item.partmentid == temp.managerid"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="监管内容"
          placeholder="请输入"
          prop="content"
          width="200%"
        >
          <el-input
            v-model="temp.content"
            type="textarea"
            width="200%"
            size="medium"
            :autosize="{ minRows: 5 }"
            row="5"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          :disabled="disabled"
          @click="dialogStatus === '新建' ? createData() : updateData()"
        >
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  itemsList,
  departmentList,
  addItems,
  updateItems,
  deleteItems,
  FirstTypeList,
} from "@/api/funeralSupervision";
// import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "Items",
  components: { Pagination },
  // directives: { waves },
  filters: {
    filterPartment(value, tag) {
      let thisindex = 0;
      let result = value.map((item, index) => {
        if (item.type == tag) {
          if (thisindex == 0) {
            thisindex++;
            return item.partment;
          } else {
            thisindex++;
            return "、" + item.partment;
          }
        } else {
          return "";
        }
      });
      return result.join("");
    },
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      disabled: false,
      typeSpanMap: {},
      FirstTypeList: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        rows: 10,
        // importance: undefined,
        matter: undefined,
        // type: undefined,
        // sort: "+id",
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" },
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      dapartments: [],
      temp: {
        fid: 0,
        names: "",
        content: "",
        partmentList: [],
        handleLists: [],
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "更新",
        create: "新建",
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        typeId: [
          {
            required: true,
            message: "分类未选择",
            trigger: ["blur", "change"],
          },
        ],
        names: [{ required: true, message: "事项未填写", trigger: "blur" }],
        content: [
          { required: true, message: "监管内容未填写", trigger: "blur" },
        ],

        managerid: [
          { required: true, message: "牵头部门未选择", trigger: "blur" },
        ],
      },
      downloadLoading: false,
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    this.calculateMergeInfo();
  },
  methods: {
    getList() {
      this.listLoading = true;
      console.log(this.listQuery);
      itemsList(this.listQuery).then((response) => {
        let result = JSON.parse(response.result);
        let temp = result.map((item) => {
          item.caseTypeSecondList.forEach((element) => {
            element.typeName = item.names;
            element.typeId = item.typeid;
            element.handleLists = [];
            element.partmentList.forEach((item) => {
              if (item.type == 1) {
                // 牵头部门
                element.managerid = item.dataid.toString();
              } else if (item.type == 2) {
                // 配合部门
                element.handleLists.push(item.dataid.toString());
              }
            });
            this.list.push(element);
          });
          return item;
        });
        // this.list = result
        this.total = result.total;

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
      FirstTypeList().then((response) => {
        let result = JSON.parse(response.result);
        this.FirstTypeList = result;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    managerChange() {
      this.temp.handleLists = this.temp.handleLists.filter((item) => {
        return item !== this.temp.managerid;
        console.log("item", item);
        console.log("managerid", this.temp.managerid);
      });
    },
    // 合并计算函数
    calculateMergeInfo() {
      let currentTypeId = null;
      let spanCount = 0;

      this.list.forEach((row, rowIndex) => {
        const typeId = row.typeId;

        // 如果当前行的 typeId 与前一行不同，则可能需要合并
        if (typeId !== currentTypeId) {
          spanCount = 1; // 重置合并行数
          currentTypeId = typeId; // 更新当前 typeId

          // 如果有前一个 typeId 的合并记录，则存储它
          if (this.typeSpanMap[previousTypeId]) {
            this.typeSpanMap[previousTypeId] = spanCountPrev;
          }

          // 重置前一个 typeId 的合并行数（如果有的话）
          spanCountPrev = 0;
        } else {
          spanCount++; // 相同 typeId，增加合并行数
        }

        // 存储当前 typeId 的临时合并行数（在循环结束时更新到 typeSpanMap）
        const spanCountPrev = spanCount;

        // 注意：这里不直接调用 objectSpanMethod，而是在渲染时调用
      });

      // 不要忘记存储最后一个 typeId 的合并行数
      if (this.typeSpanMap[currentTypeId]) {
        this.typeSpanMap[currentTypeId] = spanCount;
      }
    },
    handleSpan({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex > 0 && row.typeId === this.list[rowIndex - 1].typeId) {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
        let rowspan = 1;
        for (let i = rowIndex + 1; i < this.list.length; i++) {
          if (this.list[i].typeId === row.typeId) {
            rowspan++;
          } else {
            break;
          }
        }
        return {
          rowspan,
          colspan: 1,
        };
      }
    },
    // 表格渲染时调用的合并方法

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
        fid: 0,
        names: "",
        content: "",
        partmentList: [],
        handleLists: [],
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "新建";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.disabled = true;
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          let { typeId, names, content, managerid } = this.temp;
          let partmentList = [];
          partmentList.push({
            type: 1,
            partment: managerid,
          });
          console.log("handleLists");
          this.temp.handleLists.forEach((item) => {
            // 配合部门
            partmentList.push({
              type: 2,
              partment: item,
            });
          });
          addItems({ fid: typeId, names, content, partmentList }).then(
            (response) => {
              if (response.code == 1) {
                this.dialogFormVisible = false;
                this.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 2000,
                });
                setTimeout(() => {
                  window.location.reload(); //列表错位bug
                }, 500);
              } else {
                this.$message({
                  message: "操作失败",
                  type: "error",
                  duration: 2000,
                });
              }
            }
          );
        }
        this.disbaled = false;
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
      this.disabled = true;
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          let { typeId, names, content, managerid, typeid } = this.temp;
          let partmentList = [];
          partmentList.push({
            type: 1,
            partment: managerid,
          });
          this.temp.handleLists.forEach((item) => {
            // 配合部门
            partmentList.push({
              type: 2,
              partment: item,
            });
          });
          console.log("partmentList", partmentList);
          // return;
          updateItems({
            typeid,
            fid: typeId,
            names,
            content,
            partmentList,
          }).then((response) => {
            if (response.code == 1) {
              this.dialogFormVisible = false;
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 2000,
              });
              setTimeout(() => {
                window.location.reload();
              }, 1000);
              // window.location.reload();
              // this.getList();
            } else {
              this.$message({
                message: "操作失败",
                type: "error",
                duration: 2000,
              });
            }

            // this.getList();
          });
        }
      });
    },
    handleDelete(id) {
      this.$confirm("确定执行删除操作吗?", "Warning", {
        confirmButtonText: "是的",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        deleteItems(id).then(() => {
          this.$message({
            message: "操作成功！",
            type: "success",
          });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          // this.getList();
        });
      });
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
<style lang="scss" scoped>
::v-deep .el-input,
.el-textarea {
  width: 80%;
}
</style>