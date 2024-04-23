<template>
  <div class="cover-image-box">
    <div class="scene-tit">
      项目预览图：<el-tooltip
        class="item"
        effect="dark"
        content="列表/详情预览图,截取当前场景的显示"
        placement="right"
      >
        <i class="el-icon-question" style="font-size: 18px" />
      </el-tooltip>
    </div>
    <div v-if="coverImage" class="btn-3d">
      <img :src="coverImage" alt="封面图" srcset="">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      coverImage: ''
    }
  },
  mounted() {
    this.initEvent()
  },
  beforeDestroy() {
    this.removeEvent()
  },
  methods: {
    // 添加监听
    initEvent() {
      this.$eventBus.$on('coverImage', data => {
        // console.log('添加监听', data)
        this.coverImage = data
      })
    },
    // 移除监听
    removeEvent() {
      this.$eventBus.$off('coverImage')
    }
  }
}
</script>

<style>
</style>
