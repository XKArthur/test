<template>
  <div class="main-box create-box">
    <topbox>topbox</topbox>
    <div class="bottom-box">
      <div class="left-box">
        <div class="tab-bg">
          <div
            v-for="item in tabList"
            :key="item.lable"
            class="tab-box"
            :class="tabAct === item.lable ? 'active' : ''"
            @click="setTabAct(item.lable)"
          >
            <div v-if="tabAct === item.lable" class="layer1" />
            <div class="tab-label" :class="tabAct === item.lable ? 'active' : ''">{{ item.lable }}</div>
          </div>
        </div>
        <div class="scroll-box">
          <opt-camera v-show="tabAct === '机位'">OptCamera</opt-camera>
          <opt-module v-show="tabAct === '场景'">OptModule</opt-module>
          <opt-coverImage v-if="!1"> OptCoverImage </opt-coverImage>
          <opt-caizhi v-if="!1">OptCaizhi</opt-caizhi>
          <opt-background v-show="tabAct === '环境'">OptBackground</opt-background>
          <opt-zujian v-show="tabAct === '组件'">OptZujian</opt-zujian>
          <opt-people v-show="tabAct === '人物'">OptPeople</opt-people>
          <!-- <div class="space-box">space</div> -->
        </div>
        <!-- <savebox>Savebox</savebox> -->
      </div>
      <rightbox>rightbox</rightbox>
    </div>
  </div>
</template>

<script>
//  getfiledetail,
import Topbox from './components/topbox.vue'
import Rightbox from './components/rightbox.vue'
// import Savebox from './components/savebox.vue'
import OptModule from './components/opt-module.vue'
import OptCoverImage from './components/opt-coverImage.vue'
import OptCaizhi from './components/opt-caizhi.vue'
import OptBackground from './components/opt-background.vue'
import OptZujian from './components/opt-zujian.vue'
import OptCamera from './components/opt-camera.vue'
import OptPeople from './components/opt-people.vue'

export default {
  components: {
    Topbox,
    Rightbox,
    // Savebox,
    OptModule,
    OptCoverImage,
    OptCaizhi,
    OptBackground,
    OptZujian,
    OptCamera,
    OptPeople
  },
  data() {
    return {
      glClient: null, // 场景的实例
      mudelMesh: null,
      tabAct: '场景',
      tabList: [
        { lable: '机位' },
        { lable: '场景' },
        { lable: '环境' },
        { lable: '组件' },
        { lable: '人物' }
      ]
    }
  },
  mounted() {
    this.initEvent()
    const editType = this.$route.query.editType
    if (editType === 1) {
      this.tabAct = '组件'
    } else if (editType === 2) {
      this.tabAct = '环境'
    }
  },
  beforeDestroy() {
    this.removeEvent()
  },

  methods: {
    setTabAct(val) {
      this.tabAct = val
    },
    // 添加监听
    initEvent() {
      this.$eventBus.$on('meetingconfig', (data) => {
        // console.log('添加监听', data)
        this.coverImage = data?.cover_picture
        this.file1 = data.meetingconfig.stage.path_model
        this.file2 = data.meetingconfig.stage.path_tex
      })
    },
    // 移除监听
    removeEvent() {
      this.$eventBus.$off('meetingconfig')
    }
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>

