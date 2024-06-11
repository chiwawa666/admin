<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="编号">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态">
        <template slot-scope="{ row }">
          <!-- <span>{{ row.status | statusChange(row.name) }}</span> -->
          <template v-if="row.edit">
            <!-- <el-input v-model="row.name" class="edit-input" size="small" /> -->

            <el-select
              v-model="setName"
              style="width: 140px"
              class="filter-item"
              @change="handleFilter"
            >
              <el-option
                v-for="(item, index) in sortOptions"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>

            <el-button
              class="cancel-btn"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              取消
            </el-button>
          </template>
          <span v-else>{{ row.status | statusChange(row.name) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions">
        <template slot-scope="{ row }">
          <el-button
            v-if="row.edit"
            type="success"
            size="small"
            icon="el-icon-circle-check-outline"
            @click="confirmEdit(row)"
          >
            提交
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="row.edit = !row.edit"
          >
            编辑
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
  </div>
</template>

<script>
import { getBlocks } from "@/api/funeral";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "InlineEditTable",
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
      setName: "",
      sortOptions: [
        "王小明",
        "李小红",
        "张建国",
        "刘丽华",
        "陈强",
        "杨静",
        "赵宇",
        "黄晓云",
        "周刚",
        "吴秀英",
        "徐明",
        "孙丽",
        "胡军",
        "朱芳",
      ],
      listQuery: {
        page: 1,
        limit: 10,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      const { data } = await getBlocks(this.listQuery);
      const items = data.items;
      this.total = data.total;
      this.list = items.map((v) => {
        this.$set(v, "edit", false); // https://vuejs.org/v2/guide/reactivity.html
        v.originalTitle = v.title; //  will be used when user click the cancel botton
        return v;
      });
      this.listLoading = false;
    },
    cancelEdit(row) {
      row.title = row.originalTitle;
      row.edit = false;
      this.$message({
        message: "The title has been restored to the original value",
        type: "warning",
      });
    },
    confirmEdit(row) {
      row.edit = false;
      row.name = this.setName;

      row.status = 1;
      this.sortOptions = this.sortOptions.filter(
        (sortOption) => sortOption !== this.setName
      );
      this.setName = "";
      this.$message({
        message: "修改成功！",
        type: "success",
      });
    },
  },
};
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 15px;
}
</style>
