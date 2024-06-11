<template>
  <div class="freezer-box">
    <div class="line1">
      <img src="./../../../../assets/image/ava.png" alt="" class="ava" />
      <span class="name">{{
        item.peopleName != null ? item.peopleName : "无"
      }}</span>
      <div class="info">
        <div class="id">编号：{{ item.names }}</div>
        <div class="status" :class="item.state === 1 ? 'active' : ''">
          {{ item.stateStr }}
        </div>
      </div>
    </div>
    <div class="line2">
      <img src="./../../../../assets/image/time.png" alt="" class="ava" />
      <div class="time">{{ item.startTime ? item.startTime : "无" }}</div>
    </div>
    <div class="line3">
      <div class="handle" @click="putIn" v-if="item.state === 0">入库</div>
      <div class="handle handle2" @click="putIn" v-else>出库</div>
      <div class="record">存放记录</div>
    </div>
  </div>
</template>

<script>
// import draggable from "vuedraggable";
import { updateTransport } from "@/api/funeral";
export default {
  name: "freezerBox",
  props: {
    item: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {
    putIn() {
      this.$emit("putIn", this.item.freezerid, 1); //param1 柜id ;param2 操作类型 ：1出库 2入库 3存放记录
    },
  },
  computed: {},
};
</script>
<style lang="scss" scoped>
.freezer-box {
  width: 16.9vw;
  height: 20.5vh;
  margin-right: 8px;
  margin-bottom: 20px;
  background-image: url("./../../../../assets/image/freezer.png");
  background-size: 100% 100%;
  padding: 22px 10px 22px 20px;
  .line1 {
    display: flex;
    // justify-content: center;
    align-items: center;
    .ava {
      width: 70px;
      align-self: flex-start;
    }
    .name {
      font-size: 16px;
      color: #3f434f;
      flex-grow: 1;
      //   margin-top: 10px;
    }
    .info {
      .id {
        font-size: 12px;
        color: #c0c4cc;
        text-align: center;
      }
      .status {
        width: 86px;
        height: 26px;
        background-color: #eef1f7;
        border-top-left-radius: 15px;
        border-bottom-left-radius: 15px;
        font-size: 14px;
        line-height: 26px;
        text-align: center;
        color: #31ceb1;
      }
      .active {
        color: #3140ce;
      }
      //   align-self: flex-end;
    }
  }
  .line2 {
    display: flex;
    align-items: center;
    font-size: 14px;
    img {
      margin: 0 10px;
    }
  }
  .line3 {
    display: flex;
    justify-content: center;
    text-align: center;
    line-height: 50px;
    margin-top: 5px;
    .handle {
      width: 134px;
      height: 50px;
      border-bottom-left-radius: 10px;
      background-color: #31ceb1;
      color: #fff;
      cursor: pointer;
    }
    .handle2 {
      background-color: #3140ce;
    }
    .record {
      width: 134px;
      height: 50px;
      background-color: #eef1f7;
      border-bottom-right-radius: 10px;
      color: #3140ce;
      cursor: pointer;
    }
  }

  //   display: inline-block;
}
</style>

