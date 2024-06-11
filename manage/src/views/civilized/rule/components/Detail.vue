<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="政策法规名称" prop="name">
        <el-input v-model="form.name" :span="6" />
      </el-form-item>
      <el-form-item label="封面" style="margin-bottom: 30px" prop="file">
        <Upload @uploadSuccess="getFileId" />
        <img :src="picUrl" alt="" class="imgLimit" />
      </el-form-item>
      <div>
        <tinymce v-model="content" :height="600" />
      </div>
      <el-form-item>
        <el-button
          type="primary"
          size="mini"
          @click="isEdit == true ? updateData() : addData()"
          >提交
        </el-button>

        <router-link to="/civilized/rule">
          <el-button size="mini"> 返回 </el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { postRule, updateRule, getRuleInfo } from "@/api/civilized";

import Tinymce from "@/components/Tinymce";
import Upload from "@/components/Upload/SingleImage3";
export default {
  name: "Detail",
  components: { Tinymce, Upload },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        name: "",
        date: "",
        fileId: "",
        putId: "",
      },
      picUrl: "",
      content: `<h1 style="text-align: center;">请在此编辑！</h1>`,
      info: [
        {
          label: "殡葬管理条例",
          date: "1997-07-21",
        },
        {
          label: "森林防火条例",
          date: "2008-12-01",
        },
        {
          label: "草原防火条例",
          date: "2008-11-29",
        },
      ],
      fileId: "",
      list: [
        '"<p align="left"><span style="font-family: 楷体_GB2312;">　（1997年7月11日国务院第60次常务会议通过　1997年7月21日中华人民共和国国务院令第225号发布）</span></p>\n<p style="text-align: center;" align="left"><strong><span style="font-family: 楷体_GB2312;">目　 录</span></strong></p>\n<p align="left"><span style="font-family: 楷体_GB2312;">　　第一章　总　则</span></p>\n<p align="left"><span style="font-family: 楷体_GB2312;">　　第二章　殡葬设施管理</span></p>\n<p align="left"><span style="font-family: 楷体_GB2312;">　　第三章　遗体处理和丧事活动管理</span></p>\n<p align="left"><span style="font-family: 楷体_GB2312;">　　第四章　殡葬设备和殡葬用品管理</span></p>\n<p align="left"><span style="font-family: 楷体_GB2312;">　　第五章　罚　则</span></p>\n<p align="left"><span style="font-family: 楷体_GB2312;">　　第六章　附　则&nbsp;</span></p>\n<p><span style="font-family: 黑体;">第一章　总则</span></p>\n<p>　　<strong>第一条</strong>　为了加强殡葬管理，推进殡葬改革，促进社会主义精神文明建设，制定本条例。</p>\n<p>　　<strong>第二条</strong>　殡葬管理的方针是：积极地、有步骤地实行火葬，改革土葬，节约殡葬用地，革除丧葬陋俗，提倡文明节俭办丧事。</p>\n<p>　　<strong>第三条</strong>　国务院民政部门负责全国的殡葬管理工作。县级以上地方人民政府民政部门负责本行政区域内的殡葬管理工作。</p>\n<p>　　<strong>第四条</strong>　人口稠密、耕地较少、交通方便的地区，应当实行火葬；暂不具备条件实行火葬的地区，允许土葬。</p>\n<p>　　实行火葬和允许土葬的地区，由省、自治区、直辖市人民政府划定，并由本级人民政府民政部门报国务院民政部门备案。</p>\n<p>　　<strong>第五条</strong>　在实行火葬的地区，国家提倡以骨灰寄存的方式以及其他不占或者少占土地的方式处理骨灰。县级人民政府和设区的市、自治州人民政府应当制定实行火葬的具体规划，将新建和改造殡仪馆、火葬场、骨灰堂纳入城乡建设规划和基本建设计划。</p>\n<p>　　在允许土葬的地区，县级人民政府和设区的市、自治州人民政府应当将公墓建设纳入城乡建设规划。</p>\n<p>　　<strong>第六条</strong>　尊重少数民族的丧葬习俗；自愿改革丧葬习俗的，他人不得干涉</p>"',
        '"<table border="0" width="100%" cellspacing="0" cellpadding="0">\n<tbody>\n<tr>\n<td width="100%" height="35">&nbsp;</td>\n</tr>\n</tbody>\n</table>\n<table border="0" width="95%" cellspacing="0" cellpadding="0" align="center">\n<tbody>\n<tr>\n<td class="p1">\n<p align="center"><span style="font-size: xx-small;"><strong>中华人民共和国国务院令</strong></span></p>\n<p align="center">第　<strong>541</strong>　号</p>\n<p>　　《森林防火条例》已经2008年11月19日国务院第36次常务会议修订通过，现将修订后的《森林防火条例》公布，自2009年1月1日起施行。<br />　　　　　　　　　　　　　　　　　　　　　　　　总　理　 温家宝<br />　　　　　　　　　　　　　　　　　　　　　　　　　　二○○八年十二月一日</p>\n<p>&nbsp;</p>\n<p align="center"><span style="font-size: xx-small;"><strong>森 林 防 火 条 例<br /></strong></span>（1988年1月16日国务院发布　2008年11月19日国务院第36次常务会议修订通过）</p>\n<p align="center">第一章　总　　则</p>\n<p align="left">　　<strong>第一条</strong>　为了有效预防和扑救森林火灾，保障人民生命财产安全，保护森林资源，维护生态安全，根据《中华人民共和国森林法》，制定本条例。<br />　　<strong>第二条</strong>　本条例适用于中华人民共和国境内森林火灾的预防和扑救。但是，城市市区的除外。<br />　　<strong>第三条</strong>　森林防火工作实行预防为主、积极消灭的方针。<br />　　<strong>第四条</strong>　国家森林防火指挥机构负责组织、协调和指导全国的森林防火工作。<br />　　国务院林业主管部门负责全国森林防火的监督和管理工作，承担国家森林防火指挥机构的日常工作。</p>\n</td>\n</tr>\n</tbody>\n</table>"',
        '"<table border="0" width="100%" cellspacing="0" cellpadding="0">\n<tbody>\n<tr>\n<td width="100%" height="35">&nbsp;</td>\n</tr>\n</tbody>\n</table>\n<table border="0" width="95%" cellspacing="0" cellpadding="0" align="center">\n<tbody>\n<tr>\n<td class="p1">\n<p align="center"><span style="font-size: xx-small;"><strong>中华人民共和国国务院令</strong></span></p>\n<p align="center">第　<strong>542</strong>　号</p>\n<p>　　《草原防火条例》已经2008年11月19日国务院第36次常务会议修订通过，现将修订后的《草原防火条例》公布，自2009年1月1日起施行。<br />　　　　　　　　　　　　　　　　　　　　　　 总　理　 温家宝<br />　　　　　　　　　　　　　　　　　　　　　　　　 二○○八年十一月二十九日</p>\n<p>&nbsp;</p>\n<p align="center"><span style="font-size: xx-small;"><strong>草 原 防 火 条 例</strong></span><br />（1993年10月5日中华人民共和国国务院令第130号公布<br />2008年11月19日国务院第36次常务会议修订通过）</p>\n<p align="center">第一章　总　　则</p>\n<p>　　<strong>第一条</strong>　为了加强草原防火工作，积极预防和扑救草原火灾，保护草原，保障人民生命和财产安全，根据《中华人民共和国草原法》，制定本条例。<br />　　<strong>第二条</strong>　本条例适用于中华人民共和国境内草原火灾的预防和扑救。但是，林区和城市市区的除外。<br />　　<strong>第三条</strong>　草原防火工作实行预防为主、防消结合的方针。<br />　　<strong>第四条</strong>　县级以上人民政府应当加强草原防火工作的组织领导，将草原防火所需经费纳入本级财政预算，保障草原火灾预防和扑救工作的开展。</p>\n</td>\n</tr>\n</tbody>\n</table>"',
      ],
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },
    };
  },
  created() {
    console.log("asdasd");
    if (this.isEdit) {
      this.id = this.$route.params && this.$route.params.id;
      this.fetchData(this.id);
    }
    this.tempRoute = Object.assign({}, this.$route);
  },
  methods: {
    getFileId(order) {
      this.fileId = order;
    },
    fetchData(id) {
      getRuleInfo(id).then((response) => {
        const result = JSON.parse(response.result);
        this.form.name = result.title;
        this.picUrl = result.pic;
        this.content = result.content;
        this.putId = result.messageid;
      });
    },
    addData() {
      console.log(this.form);
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (!this.fileId) {
            this.$message.error("请上传封面");
            return;
          }
          postRule({
            title: this.form.name,
            content: this.content,
            picid: this.fileId,
            type: "1",
          }).then((response) => {
            if (response.code == 1) {
              this.$message({
                message: "添加成功",
                type: "success",
              });
              this.$router.push({ path: "/civilized/rule" });
            } else {
              this.$message.error("添加失败");
            }
          });
        }
      });
    },
    updateData() {
      console.log(this.form);
      this.$refs["form"].validate((valid) => {
        if (valid) {
          updateRule({
            messageid: this.putId,
            title: this.form.name,
            content: this.content,
            picid: this.fileId,
            type: "1",
          }).then((response) => {
            if (response.code == 1) {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.$router.push({ path: "/civilized/rule" });
            } else {
              this.$message.error("添加失败");
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped >
.line {
  text-align: center;
}
::v-deep .el-upload {
  text-align: start;
}
</style>

