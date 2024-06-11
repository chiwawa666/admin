<template>
  <div class="components-container">
    <div style="margin: 20px">
      <el-form>
        <el-form-item label="日期">
          <el-col :span="12">
            <el-date-picker
              v-model="date"
              type="date"
              format="yyyy-MM-dd"
              placeholder="请选择"
            />
          </el-col>
        </el-form-item>
      </el-form>
    </div>
    <div class="board">
      <Kanban
        :id="1"
        :key="1"
        :list="toPickList"
        :group="group"
        class="kanban todo"
        header-text="未调度"
        @draggableEvent="handleDraggableEvent"
        @draggableTarget="draggableTarget"
        @draggableFrom="draggableFrom"
        @modefied="handleModefied"
        @draggableItem="draggableItem"
      />
      <Kanban
        :id="2"
        :key="2"
        :list="list2"
        :group="group"
        :dateFormatNow="dateToday"
        :is-draggable="this.drag[0].status"
        class="kanban working"
        header-text="第一班车（3辆） 6:00~8:00"
        @draggableEvent="handleDraggableEvent"
        @updateArrange="updateArrange"
        @draggableTarget="draggableTarget"
        @draggableFrom="draggableFrom"
        @draggableItem="draggableItem"
        @modefied="handleModefied"
      />
      <Kanban
        :id="3"
        :key="3"
        :list="list3"
        :group="group"
        :dateFormatNow="dateToday"
        :is-draggable="this.drag[1].status"
        class="kanban done"
        header-text="第二班车（3辆） 10:00~12:00"
        @draggableEvent="handleDraggableEvent"
        @updateArrange="updateArrange"
        @draggableTarget="draggableTarget"
        @draggableFrom="draggableFrom"
        @draggableItem="draggableItem"
        @modefied="handleModefied"
      />
      <Kanban
        :id="4"
        :key="4"
        :list="list4"
        :dateFormatNow="dateToday"
        :is-draggable="this.drag[2].status"
        :group="group"
        class="kanban doneY"
        header-text="第三班车（3辆） 13:00~14:00"
        @draggableEvent="handleDraggableEvent"
        @updateArrange="updateArrange"
        @draggableTarget="draggableTarget"
        @draggableFrom="draggableFrom"
        @draggableItem="draggableItem"
        @modefied="handleModefied"
      />
      <Kanban
        :id="5"
        :key="5"
        :list="list5"
        :dateFormatNow="dateToday"
        :dateTomorrow="dateTomorrow"
        :is-draggable="this.drag[3].status"
        :group="group"
        class="kanban doneC"
        header-text="第四班车（1辆） 14:00~次日6:00"
        @draggableEvent="handleDraggableEvent"
        @modefied="handleModefied"
        @updateArrange="updateArrange"
        @draggableTarget="draggableTarget"
        @draggableFrom="draggableFrom"
        @draggableItem="draggableItem"
      />
    </div>
    <el-dialog title="车辆、司机安排" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="车牌号">
          <el-select
            v-model="temp.carid"
            placeholder="请选择"
            clearable
            style="width: 200px"
            class="filter-item"
          >
            <el-option
              v-for="item in cars"
              :key="item.carid"
              :label="item.carName"
              :value="item.carid"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="司机">
          <el-select
            v-model="temp.driverid"
            placeholder="请选择"
            clearable
            style="width: 200px"
            class="filter-item"
          >
            <el-option
              v-for="item in drivers"
              :key="item.driverid"
              :label="item.driverName"
              :value="item.driverid"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
          <el-radio v-model="day" label="1" v-if="part4">当日下午</el-radio>
          <el-radio v-model="day" label="2" v-if="part4">次日凌晨</el-radio>
          <el-time-select
            placeholder="选择时间"
            v-model="temp.timePicker"
            :picker-options="pickeroptions"
          >
          </el-time-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="
            handleDateChange;
            dialogFormVisible = false;
          "
        >
          取消
        </el-button>
        <el-button type="primary" @click="updateData()"> 提交 </el-button>
      </div>
    </el-dialog>
  </div>
</template> 
<script>
import Kanban from "@/components/Kanban";
import {
  getTransports,
  updateTransport,
  deleteTransportOrder,
  getCars,
  getDrivers,
  updateTransportOrder,
} from "@/api/funeral";
import { getAppointments } from "@/api/appointment";

export default {
  name: "DragKanbanDemo",
  components: {
    Kanban,
  },
  data() {
    return {
      group: "mission",
      toPickList: [], //未安排
      list2: [], //第一班车
      list3: [],
      list4: [],
      list5: [],
      drag: [
        { name: "list2", status: true },
        { name: "list3", status: true },
        { name: "list4", status: true },
        { name: "list5", status: true },
      ],
      date: new Date(),
      dragTarget: "",
      dragFrom: "",
      dragItem: "",
      dialogFormVisible: false,
      cars: [],
      part4: false,
      drivers: [],
      temp: {
        recordid: 1,
        carid: 1,
        driverid: 1,
        starttime: "",
      },
      day: "1",
      pickeroptions: {
        start: "14:00",
        step: "00:15",
        end: "23:45",
      },
      timePicker: "",
      tempobj: {},
    };
  },
  watch: {
    date(val) {
      this.handleDateChange();
    },
    dragItem(val) {
      let startStr = "";
      let endStr = "";
      if (this.dragTarget == 2) {
        startStr = this.dateToday + " 06:00:00";
        endStr = this.dateToday + " 08:00:00";
      } else if (this.dragTarget == 3) {
        startStr = this.dateToday + " 10:00:00";
        endStr = this.dateToday + " 12:00:00";
      } else if (this.dragTarget == 4) {
        startStr = this.dateToday + " 13:00:00";
        endStr = this.dateToday + " 14:00:00";
      } else if (this.dragTarget == 5) {
        startStr = this.dateToday + " 14:00:00";
        endStr = this.dateTomorrow + " 06:00:00";
      } else if (this.dragTarget == 1) {
        deleteTransportOrder(this.temp.recordid).then((res) => {
          this.$message({
            message: "操作成功！",
            type: "success",
          });
          this.handleDateChange();
          return;
        });
      }
      const temp = {
        orderUserNo: this.dragItem,
        parlorid: 1,
        starttime: startStr,
        endtime: endStr,
        recordid: this.temp.recordid,
      };
      if (this.dragTarget !== 1) {
        updateTransport(temp, this.dragFrom)
          .then((res) => {
            this.$message({
              message: "操作成功！",
              type: "success",
            });
            this.handleDateChange();
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "出错了!",
              type: "warning",
            });
          });
      }
    },
    day(val) {
      if (val == "2") {
        this.pickeroptions = {
          start: "00:00",
          step: "00:15",
          end: "06:00",
        };
      } else {
        this.pickeroptions = {
          start: "14:00",
          step: "00:15",
          end: "23:45",
        };
      }
    },
  },
  mounted() {
    this.handleDateChange();
    getCars().then((response) => {
      const result = JSON.parse(response.result);
      this.cars = result.rows;
    });
    getDrivers().then((response) => {
      const result = JSON.parse(response.result);
      this.drivers = result.rows;
    });
  },
  methods: {
    handleDateChange(val) {
      getTransports({
        page: 1,
        rows: 20,
        startTime: this.dateFormatToday,
        endTime: this.dateFormatTomorrow,
      })
        .then((response) => {
          console.log("res", JSON.parse(response.result));
          const items = JSON.parse(response.result).rows;
          if (items == null) {
            this.list2 = [];
            this.list3 = [];
            this.list4 = [];
            this.list5 = [];
            return;
          }
          items.forEach((item) => {
            //键名修改
            this.changekeys("phone", "managerPhone", item);
          });
          const groupedByStarttime = items.reduce((acc, item) => {
            //根据时间分组
            const key = item.starttime;
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(item);
            return acc;
          }, {});
          this.list2 = [];
          this.list3 = [];
          this.list4 = [];
          this.list5 = [];
          for (const key in groupedByStarttime) {
            if (key.includes("06:00:00")) {
              //第一班车
              this.list2 = groupedByStarttime[key];
            } else if (key.includes("10:00:00")) {
              //第二班车
              this.list3 = groupedByStarttime[key];
            } else if (key.includes("13:00:00")) {
              //第三班车
              this.list4 = groupedByStarttime[key];
            } else if (key.includes("14:00:00")) {
              //第四班车
              this.list5 = groupedByStarttime[key];
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
      getAppointments({
        state: 0,
      }).then((response) => {
        const result = JSON.parse(response.result);
        this.toPickList = result.rows;
      });
    },
    handleDraggableEvent(val) {
      if (val == -1) {
        // 传值-1，即为鼠标放开，单次的拖动结束，恢复所有的拖动状态为true
        for (let i = 0; i < this.drag.length; i++) {
          this.drag[i].status = true;
        }
      } else {
        for (let i = 0; i < this.drag.length; i++) {
          if (this[this.drag[i].name].length > 3) {
            // 传值为id,修改长度超过3的列的拖动状态
            this.drag[i].status = false;
          }
        }
      }
    },
    updateArrange(val, time) {
      this.temp.recordid = val;
      console.log("time", time);
      if (time.includes("06:00:00")) {
        this.part4 = false;
        this.pickeroptions = {
          start: "06:00",
          step: "00:15",
          end: "08:00",
        };
      } else if (time.includes("10:00:00")) {
        this.part4 = false;
        this.pickeroptions = {
          start: "10:00",
          step: "00:15",
          end: "12:00",
        };
      } else if (time.includes("13:00")) {
        this.part4 = false;
        this.pickeroptions = {
          start: "13:00",
          step: "00:15",
          end: "14:00",
        };
      } else {
        this.part4 = true;
        this.pickeroptions = {
          start: "14:00",
          step: "00:15",
          end: "23:45",
        };
      }
      this.starttime = time;
      console.log("updateArrange", val);
      this.dialogFormVisible = true;
    },
    draggableTarget(val) {
      this.dragTarget = val;
    },
    draggableFrom(val) {
      this.dragFrom = val;
    },
    draggableItem(val, recordid) {
      this.dragItem = val;
      this.temp.recordid = recordid;
    },
    changekeys(key1, key2, obj) {
      obj[key2] = obj[key1];
      delete obj[key1];
    },
    updateData() {
      if (this.part4) {
        if (this.day == 1) {
          this.temp.starttime =
            this.dateToday + " " + this.temp.timePicker + ":00";
        } else {
          this.temp.starttime =
            this.dateTomorrow + " " + this.temp.timePicker + ":00";
        }
      } else {
        this.temp.starttime =
          this.dateToday + " " + this.temp.timePicker + ":00";
      }
      console.log("temp", this.temp);
      // return;
      updateTransportOrder(this.temp)
        .then((res) => {
          this.$message({
            message: "操作成功！",
            type: "success",
          });
          this.dialogFormVisible = false;
          this.handleDateChange();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "出错了!",
            type: "warning",
          });
          this.dialogFormVisible = false;
          // this.handleDateChange();
        });
    },
    handleModefied(id, carid, driverid, time) {
      this.temp.recordid = id;
      this.temp.carid = carid;
      this.temp.driverid = driverid;
      console.log("time", time);
      if (time.includes("06:00:00")) {
        this.part4 = false;
        this.pickeroptions = {
          start: "06:00",
          step: "00:15",
          end: "08:00",
        };
      } else if (time.includes("10:00:00")) {
        this.part4 = false;
        this.pickeroptions = {
          start: "10:00",
          step: "00:15",
          end: "12:00",
        };
      } else if (time.includes("13:00")) {
        this.part4 = false;
        this.pickeroptions = {
          start: "13:00",
          step: "00:15",
          end: "14:00",
        };
      } else {
        this.part4 = true;
        this.pickeroptions = {
          start: "14:00",
          step: "00:15",
          end: "23:45",
        };
      }
      this.starttime = time;
      this.dialogFormVisible = true;
    },
  },
  computed: {
    dateFormatToday() {
      const date = new Date(this.date);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day} 06:00:00`;
      return formattedDate;
    },
    // 次日
    dateFormatTomorrow() {
      const date = new Date(this.date);
      date.setDate(date.getDate() + 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day} 06:00:00`;
      return formattedDate;
    },
    // 当前时间
    dateToday() {
      const date = new Date(this.date);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      return formattedDate;
    },
    dateTomorrow() {
      const date = new Date(this.date);
      date.setDate(date.getDate() + 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      return formattedDate;
    },
  },
};
</script>
<style lang="scss">
.board {
  width: 100%;
  padding: 0 20px;

  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: flex-start;
}
.el-form {
  flex-basis: 100%;
}
.kanban {
  &.todo {
    .board-column-header {
      background: #4a9ff9;
    }
  }
  &.working {
    .board-column-header {
      background: #f9944a;
    }
  }
  &.done {
    .board-column-header {
      background: #2ac06d;
    }
  }
  &.doneY {
    .board-column-header {
      background: #58b582;
    }
  }
  &.doneC {
    .board-column-header {
      background: #377352;
    }
  }
}
</style>

