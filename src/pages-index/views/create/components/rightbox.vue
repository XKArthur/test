<template>
  <div class="right-box">
    <div id="viewContainer">
      <div id="playContainer" class="play-view">容器</div>
    </div>
  </div>
</template>

<script>
import { Loadscene } from '@/sh-newgl-sdk'
import { getfiledetail } from '@/api/tablelist'
// addfilterdata,editfilterdata
export default {
  data() {
    return {}
  },
  mounted() {
    console.log('**mounted**')
    const rowid = this.$route.query.rowid

    this.$nextTick(() => {
      this.$_resizeHandler()

      if (rowid) {
        this.rowid = rowid
        this.initData()
      } else {
        this.$parent.glClient = Loadscene({ renderViewId: 'playContainer' })
      }
    })
  },
  beforeMount() {
    window.addEventListener('resize', this.$_resizeHandler)
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.$_resizeHandler)
    this.$parent.glClient?.clear()
  },

  methods: {
    $_resizeHandler() {
      var viewContainer = document.getElementById('viewContainer')
      var playbox = document.getElementById('playContainer')

      if (viewContainer) {
        var w = viewContainer.offsetWidth // 返回元素的总宽度
        var h = viewContainer.offsetHeight // 返回元素的总高度
        // console.log('Width', w, 'Height', h)
        let new_w = 0
        let new_h = 0
        if ((w / 16) * 9 > h) {
          new_w = parseInt((h / 9) * 16)
          new_h = h
        } else {
          new_w = w
          new_h = parseInt((w / 16) * 9)
        }
        playbox.style.width = new_w + 'px'
        playbox.style.height = new_h + 'px'

        window.StageApp?.fire('RendererSettings:resize', {
          width: new_w,
          height: new_h
        })
      }
    },
    //
    initData() {
      getfiledetail({
        worksheetDesc: '平台商品',
        rowId: this.rowid
      })
        .then((res) => {
          console.log('[所有 平台商品 res]', res)
          if (res?.data?.meetingconfig) {
            try {
              const meetingconfig = JSON.parse(res?.data?.meetingconfig)
              console.log('[已有 平台商品]', meetingconfig)
              this.$parent.glClient = Loadscene({
                renderViewId: 'playContainer',
                config: meetingconfig
              })

              // 将数据通知的对应的组件
              this.$eventBus.$emit('moduleFile', meetingconfig)
              this.$eventBus.$emit('coverImage', res?.data?.cover_picture)
              this.$eventBus.$emit('sceneMesg', {
                scene_price: res?.data?.scene_price,
                sname: res?.data?.sname
              })
            } catch (error) {
              console.log('[已有 平台商品 JSONerr ]', error)
            }
          }
        })
        .catch((err) => {
          console.log('[已有 平台商品 err ]', err)
        })
    }
  }
}
</script>

<style>
</style>
