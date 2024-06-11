<template>
  <div class="components-container">
    <div style="margin: 20px">
      <el-form>
        <el-form-item label="日期">
          <el-col :span="12">
            <el-date-picker
              v-model="date"
              type="datetime"
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
        :list="list1"
        :group="group"
        class="kanban todo"
        header-text="未调度"
        @draggableEvent="handleDraggableEvent"
      />
      <Kanban
        :id="2"
        :key="2"
        :list="list2"
        :group="group"
        :is-draggable="this.drag[0].status"
        class="kanban working"
        header-text="第一班车（3辆） 6:00~8:00"
        @draggableEvent="handleDraggableEvent"
      />
      <Kanban
        :id="3"
        :key="3"
        :list="list3"
        :group="group"
        :is-draggable="this.drag[1].status"
        class="kanban done"
        header-text="第二班车（3辆） 10:00~12:00"
        @draggableEvent="handleDraggableEvent"
      />
      <Kanban
        :id="4"
        :key="4"
        :list="list4"
        :is-draggable="this.drag[2].status"
        :group="group"
        class="kanban doneY"
        header-text="第三班车（3辆） 13:00~14:00"
        @draggableEvent="handleDraggableEvent"
      />
      <Kanban
        :id="5"
        :key="5"
        :list="list5"
        :is-draggable="this.drag[3].status"
        :group="group"
        class="kanban doneC"
        header-text="第四班车（1辆） 14:00~次日6:00"
        @draggableEvent="handleDraggableEvent"
      />
    </div>
  </div>
</template> 
<script>
import Kanban from "@/components/Kanban";
import { randomName } from "@/api/funeral";
export default {
  name: "DragKanbanDemo",
  components: {
    Kanban,
  },
  data() {
    return {
      group: "mission",
      list1: [
        { name: "吕秀兰", id: 1, status: 0 },
        { name: "郝丽", id: 2, status: 0 },
        { name: "谢霞", id: 3, status: 0 },
        { name: "姚敏", id: 4, status: 0 },
        { name: "吕明", id: 5, status: 0 },
        { name: "龚俊", id: 6, status: 0 },
        { name: "张淑玲", id: 7, status: 0 },
        { name: "王胜利", id: 8, status: 0 },
        { name: "邓平龙", id: 9, status: 0 },
      ],
      list2: [
        { name: "Mission", id: 20, status: 1 },
        { name: "Mission", id: 21, status: 1 },
        { name: "Mission", id: 22, status: 2 },
      ],
      list3: [
        { name: "Mission", id: 40, status: 2 },
        { name: "Mission", id: 41, status: 2 },
        { name: "Mission", id: 42, status: 2 },
      ],
      list4: [
        { name: "Mission", id: 50, status: 2 },
        { name: "Mission", id: 51, status: 2 },
        { name: "Mission", id: 52, status: 2 },
      ],
      list5: [
        { name: "Mission", id: 60, status: 2 },
        { name: "Mission", id: 61, status: 2 },
        { name: "Mission", id: 62, status: 2 },
      ],
      drag: [
        { name: "list2", status: true },
        { name: "list3", status: true },
        { name: "list4", status: true },
        { name: "list5", status: true },
      ],
      date: new Date(),
    };
  },
  watch: {
    date(val) {
      this.handleDateChange();
    },
    list1: {
      handler(newVal, oldVal) {
        if (newVal.length > oldVal.length) {
          console.log("list1 add ");
        }
      },
      deep: true,
    },
    list2: {
      handler(newVal, oldVal) {
        if (newVal.length > oldVal.length) {
          console.log("list2 add ");
        }
      },
      deep: true,
    },
    list3: {
      handler(newVal, oldVal) {
        if (newVal.length < oldVal.length) {
          console.log("list3 add ");
        }
      },
      deep: true,
    },
    list4: {
      handler(newVal, oldVal) {
        if (newVal.length < oldVal.length) {
          console.log("list4 add ");
        }
      },
      deep: true,
    },
    list5: {
      handler(newVal, oldVal) {
        if (newVal.length > oldVal.length) {
          console.log("list5 add ");
        }
      },
      deep: true,
    },
  },
  created() {
    this.handleDateChange();
  },
  methods: {
    handleDateChange(val) {
      randomName(6)
        .then((response) => {
          console.log("res", response.data);
          this.list2 = [];
          this.list3 = [];
          this.list4 = [];
          this.list5 = [];
          for (let i = 0; i < 3; i++) {
            const temp = {
              name: response.data.items[i].people,
              id: new Date().getTime() + i,
            };
            this.list2.push(temp);
          }
          for (let i = 3; i < 7; i++) {
            const temp = {
              name: response.data.items[i].people,
              id: new Date().getTime() + i,
            };
            this.list3.push(temp);
          }
          for (let i = 7; i < 9; i++) {
            const temp = {
              name: response.data.items[i].people,
              id: new Date().getTime() + i,
            };
            this.list4.push(temp);
          }
          for (let i = 9; i < 15; i++) {
            const temp = {
              name: response.data.items[i].people,
              id: new Date().getTime() + i,
            };
            this.list5.push(temp);
          }
        })
        .catch((err) => {
          console.log(err);
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

