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
    <div class="flex">
      <freezerBox
        v-for="(item, index) in list"
        :key="index"
        :item="item"
        @putIn="handleOperation"
      ></freezerBox>
    </div>
    <!-- <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="序号" prop="id" sortable="custom" align="center">
        <template slot-scope="{ $index }">
          <span>{{ $index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编号" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.names }}</span>
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
        <template slot-scope="{ row, $index }">
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
    </el-table> -->

    <pagination
      v-show="total > 0"
      :page-count="total"
      :page.sync="listQuery.page"
      :rows.sync="listQuery.rows"
      @pagination="getList"
    ></pagination>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="逝者" prop="names">
          <el-select
            v-model="selectPeople.defunctId"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in peopleList"
              :key="item.id"
              :label="item.realName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="selectPeople.time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
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
import { getfreezerOrders, checkAppointment } from "@/api/funeral";
import { getPeopleList } from "@/api/people";
// import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import freezerBox from "./components/freezerBox.vue";

export default {
  name: "ComplexTable",
  components: { Pagination, freezerBox },
  // directives: { waves },
  filters: {},
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      state: "0",
      listLoading: true,
      listQuery: {
        page: 1,
        rows: 20,
        // defunctName: "",
        // defuntIdCard: "",
        // state: "",
        // freezerName: "",
      },
      selectPeople: {
        freezerid: undefined,
        defunctId: undefined,
        time: undefined,
      },
      peopleList: [],
      importanceOptions: [1, 2, 3],
      showReviewer: false,
      temp: {
        parlorid: 1,
        names: "",
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
        names: [{ required: true, message: "编号不能为空", trigger: "blur" }],
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

      getfreezerOrders(this.listQuery).then((response) => {
        const result = JSON.parse(response.result).list;
        console.log("result", result);
        this.list = result.rows;
        this.total = result.total;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 100);
      });
      getPeopleList({ page: 1, rows: 10000 }).then((response) => {
        console.log("getPeopleList", response);
        this.peopleList = JSON.parse(response.result).rows;
      });
    },
    handleOperation(id, type) {
      if (type == 1) {
        //入库
        console.log("id", id);
        this.selectPeople.freezerid = id;
        this.dialogFormVisible = true;
        // checkAppointment(id, { page: 1, rows: 100 }).then((response) => {
        //   console.log("response", response);
        // });
      }
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    resetTemp() {
      this.temp = {
        parlorid: 1,
        names: "",
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.flex {
  display: flex;
  // justify-content: space-between;
  flex-wrap: wrap;
}
.flex::after {
  content: "";
  // width: 16.9vw;
  margin-right: auto; //吃掉右侧空间
  // height: 20.5vh;
}
</style>