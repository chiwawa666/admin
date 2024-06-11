<template>
  <div class="board-column">
    <div class="board-column-header">
      {{ headerText }}
    </div>
    <draggable
      :list="list"
      v-bind="$attrs"
      class="board-column-content"
      :set-data="setData"
      :disabled="!isDraggable"
      @add="draggableTarget(headerText)"
    >
      <div
        v-for="element in list"
        :key="element.orderUserNo"
        class="board-item"
        @dragover.prevent
        @dragenter.prevent
        @dragend="handleMouseUp(element.orderUserNo, element.recordid)"
      >
        <div
          v-if="element.state == 1 && headerText !== '未调度'"
          style="height: auto"
        >
          <div class="info">
            <span> 出车司机 {{ element.driverName }}</span>
          </div>
          <div class="motify">
            <el-button
              type="primary"
              @click="
                modefied(
                  element.recordid,
                  element.carid,
                  element.driverid,
                  element.starttime
                )
              "
              >修改</el-button
            >
            <span><car-license :license="element.carnum" /> </span>
          </div>
          <hr />
        </div>

        <div
          v-if="element.state == 0 && headerText !== '未调度'"
          style="height: auto"
        >
          <div class="motify">
            <el-button
              type="primary"
              @click="updateArrange(element.recordid, element.starttime)"
              >派车</el-button
            >
            <hr />
          </div>
        </div>
        <div>逝者姓名：{{ element.defunctName }}</div>
        <div>联系人：{{ element.manager }}</div>
        <div>联系电话：{{ element.managerPhone }}</div>
        <div class="address">
          接运地点：{{
            element.address == undefined
              ? element.carAddress + "," + element.carAddressDetail
              : element.address
          }}
        </div>
        <div v-if="element.carTime !== undefined">
          接运时间：{{ element.carTime }}
        </div>
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import carLicense from "./License.vue";
import { updateTransport } from "@/api/funeral";
export default {
  name: "DragKanbanDemo",
  components: {
    draggable,
    carLicense,
  },
  props: {
    headerText: {
      type: String,
      default: "Header",
    },
    options: {
      type: Object,
      default() {
        return {};
      },
    },
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    id: {
      // 用于标识当前列的id,在拖曳的时候emit给父组件,父组件修改拖曳状态
      // required: true,
      type: Number,
      // default: "default-id",
    },

    isDraggable: {
      type: Boolean,
      default: true,
    },
    dateFormatNow: {
      type: String,
      default: "",
    },
    dateTomorrow: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      dragId: "",
    };
  },
  methods: {
    setData(dataTransfer) {
      // console.log(dataTransfer);
      // to avoid Firefox bug
      // Detail see : https://github.com/RubaXa/Sortable/issues/1012
      dataTransfer.setData("Text", "11");
      console.log(this.id, "list");
      // this.$emit("draggableEvent", this.id);
      if (this.id == 1) {
        this.$emit("draggableFrom", "post");
      } else {
        this.$emit("draggableFrom", "put");
      }
    },
    //拖入目标的headerText
    draggableTarget(headerText) {
      // console.log("add", headerText);
      this.$emit("draggableTarget", this.id);
      // console.log(new Date());
    },
    //拖动的id
    handleMouseUp(orderUserNo, recordid) {
      // console.log("movedId", orderUserNo);
      // console.log(new Date());
      this.$emit("draggableItem", orderUserNo, recordid);
    },
    updateArrange(id, startTime) {
      this.$emit("updateArrange", id, startTime);
      console.log(id);
    },
    modefied(id, carid, driverid, starttime) {
      this.$emit("modefied", id, carid, driverid, starttime);
    },
  },
  computed: {
    startTime() {
      return this.options.startTime;
    },
  },
};
</script>
<style lang="scss" scoped>
.board-column {
  min-width: 300px;
  min-height: 100px;
  height: auto;
  overflow: hidden;
  background: #f0f0f0;
  border-radius: 3px;

  .board-column-header {
    height: 50px;
    line-height: 50px;
    overflow: hidden;
    padding: 0 20px;
    text-align: center;
    background: #333;
    color: #fff;
    border-radius: 3px 3px 0 0;
  }

  .board-column-content {
    height: auto;
    overflow: hidden;
    border: 10px solid transparent;
    min-height: 60px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;

    .board-item {
      cursor: pointer;
      width: 100%;
      // height: 180px;
      margin: 5px 0;
      background-color: #fff;
      text-align: left;
      line-height: 54px;
      padding: 8px 10px;
      box-sizing: border-box;
      box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.2);
      .info {
        height: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .motify {
        height: auto;
        display: flex;
        margin-top: 10px;
        justify-content: space-between;
        align-items: baseline;
      }
      div {
        height: 30px;
        line-height: 30px;
      }
      .address {
        max-width: 265px;
        height: auto;
        word-break: break-all;
        word-wrap: break-word;
        line-height: 30px;
      }
    }
  }
}
</style>

