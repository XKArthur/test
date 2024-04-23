<template>
  <div style="padding-top: 20px">
    <div class="scene-tit">大屏幕</div>

    <div class="btn-3d" style="cursor: auto">
      <div class="cz-opt">
        <div class="zj-item-toggle">
          <span class="ra-label"> 显示/隐藏 </span>
          <el-switch
            v-model="screenIsShow"
            class="selectLight"
            active-color="#13ce66"
            inactive-color="#858585"
            @change="setScreenVis"
          />
        </div>
        <div class="upload-hb-box">
          <!-- @click="setImage" -->
          <input type="file" @change="upSetScreenImage">
          上传默认图片
        </div>
        <div class="setItem" style="margin-top:30px;">
          <div class="labPut">
            <div class="label">大屏幕旋转</div>
            <el-input-number v-model="screenRotatez" :min="-90" :max="90" label="描述文字" size="mini" @change="setScreenRotatez" />
          </div>
          <div class="siderItem">
            <div class="siderNum">{{ -90 }}</div>
            <input
              v-model="screenRotatez"
              style="width: 160px"
              class="inputItem"
              type="range"
              max="90"
              min="-90"
              step="1"
              show-input
              @input="setScreenRotatez"
            >
            <div class="siderNum">{{ 90 }}</div>
          </div>
        </div>
        <div class="setItem">
          <div class="labPut">
            <div class="label">大屏幕缩放</div>
            <el-input-number v-model="screenScale" :min="0" :max="5" label="描述文字" size="mini" @change="setScreenScale" />
          </div>
          <div class="siderItem">
            <div class="siderNum">{{ 0 }}</div>
            <input
              v-model="screenScale"
              style="width: 160px"
              class="inputItem"
              type="range"
              max="5"
              min="0"
              step="0.01"
              show-input
              @input="setScreenScale"
            >
            <div class="siderNum">{{ 5 }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="divider" />

    <div class="scene-tit" style="margin-top: 20px;">海报组件</div>
    <div class="com-box mar-t-10">
      <div
        v-for="item in '012345'"
        :key="item"
        class="btn-3d com-item"
        :class="{ active: operationIndex === item }"
        @click="setZJ(item)"
      >
        <span v-if="comItems[item].txt">{{ comItems[item].txt }}</span>
        <i v-else class="el-icon-plus" />
      </div>
    </div>
    <div v-for="(item, ind) in comItems" :key="ind">
      <div v-if="item.txt && 1 * operationIndex === ind">
        <div v-loading="listLoading" class="btn-3d zj-box" style="cursor: auto">
          <div>
            <div class="zj-title">
              <div>组件 {{ ind + 1 }}</div>
              <div style="float: right">
                <!-- <span
                  style="color: #0653d9; margin-right: 10px; cursor: pointer"
                  @click="resetCon(ind)"
                >
                  复位
                </span> -->
                <span
                  style="color: #ff0000; cursor: pointer"
                  @click="removeCon(ind)"
                >
                  删除
                </span>
              </div>
            </div>
            <div class="upload-hb-box">
              <!-- @click="setImage" -->
              <input type="file" @change="upSetImage">
              上传默认图片
            </div>
          </div>
          <div class="zj-item">
            <div class="labPut">
              <div class="label">缩放</div>
              <el-input-number v-model="item.scale" :min="0" :max="5" label="描述文字" size="mini" @change="userScale" />
            </div>
            <div class="siderItem">
              <div class="siderNum">{{ 0 }}</div>
              <input
                v-model="item.scale"
                style="width: 120px"
                class="inputItem"
                type="range"
                max="5"
                min="0"
                step="0.01"
                show-input
                @input="userScale"
              >
              <div class="siderNum">{{ 5 }}</div>
            </div>
          </div>
          <div class="zj-item">
            <div class="labPut">
              <div class="label">旋转X</div>
              <el-input-number v-model="item.rotateX" :min="-90" :max="90" label="描述文字" size="mini" @change="userRotateX" />
            </div>
            <div class="siderItem">
              <div class="siderNum">{{ -90 }}</div>
              <input
                v-model="item.rotateX"
                style="width: 120px"
                class="inputItem"
                type="range"
                max="90"
                min="-90"
                step="1"
                show-input
                @input="userRotateX"
              >
              <div class="siderNum">{{ 90 }}</div>
            </div>
          </div>
          <div class="zj-item">
            <div class="labPut">
              <div class="label">旋转Y</div>
              <el-input-number v-model="item.rotateY" :min="-90" :max="90" label="描述文字" size="mini" @change="userRotateY" />
            </div>
            <div class="siderItem">
              <div class="siderNum">{{ -90 }}</div>
              <input
                v-model="item.rotateY"
                style="width: 120px"
                class="inputItem"
                type="range"
                max="90"
                min="-90"
                step="1"
                show-input
                @input="userRotateY"
              >
              <div class="siderNum">{{ 90 }}</div>
            </div>
          </div>
          <div class="zj-item" style="display:none">
            <span class="ra-label"> 运动 </span>
            <el-switch
              v-model="item.isSport"
              class="selectLight"
              active-color="#13ce66"
              inactive-color="#858585"
              @change="isSportFun(item)"
            />
          </div>
          <div v-if="item.isSport">
            <div class="selectD">
              <div
                v-for="data in sportType"
                :key="data.value"
                class="SelcetGrop"
                @click="selectSport(data.value)"
              >
                <div
                  class="selectMod"
                  :class="data.value === item.sportVue ? 'active' : ''"
                >
                  <div v-if="data.value === item.sportVue" class="crelie" />
                </div>
                <span style="font-size: 12px; margin-left: 5px">{{
                  data.lable
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="divider" />

    <div class="scene-tit" style="margin-top: 20px;">灯箱组件</div>
    <div class="com-box mar-t-10">
      <div
        v-for="(item ,index) in ligboxItems"
        :key="index"
        class="btn-3d com-item"
        :class="{ active: lightboxIndex === index }"
        @click="setLB(index)"
      >
        <span v-if="item.txt">{{ item.txt }}</span>
        <i v-else class="el-icon-plus" />
      </div>
    </div>
    <div v-for="(item, index) in ligboxItems" :key="item.name">
      <div v-if="item.txt && 1 * lightboxIndex === index">
        <div v-loading="listLoading" class="btn-3d zj-box" style="cursor: auto">
          <div>
            <div class="zj-title">
              <div>组件 {{ index + 1 }}</div>
              <div style="float: right">
                <span
                  style="color: #ff0000; cursor: pointer"
                  @click="removeLB(index)"
                >
                  删除
                </span>
              </div>
            </div>
            <div class="upload-hb-box">
              <input type="file" @change="lightBoxSetImage">
              上传默认图片
            </div>
          </div>
          <div class="zj-item">
            <div class="labPut">
              <div class="label">缩放</div>
              <el-input-number v-model="item.scale" :min="0" :max="5" label="描述文字" size="mini" @change="lightboxScale" />
            </div>
            <div class="siderItem">
              <div class="siderNum">{{ 0 }}</div>
              <input
                v-model="item.scale"
                style="width: 120px"
                class="inputItem"
                type="range"
                max="5"
                min="0"
                step="0.01"
                show-input
                @input="lightboxScale"
              >
              <div class="siderNum">{{ 5 }}</div>
            </div>
          </div>
          <div class="zj-item">
            <div class="labPut">
              <div class="label">速度</div>
              <el-input-number v-model="item.speed" :min="0" :max="10" label="描述文字" size="mini" @change="lightboxSpeed" />
            </div>
            <div class="siderItem">
              <div class="siderNum">{{ 0 }}</div>
              <input
                v-model="item.speed"
                style="width: 120px"
                class="inputItem"
                type="range"
                max="10"
                min="0"
                step="1"
                show-input
                @input="lightboxSpeed"
              >
              <div class="siderNum">{{ 10 }}</div>
            </div>
          </div>
          <div class="zj-item">
            <div class="labPut">
              <div class="label">旋转Y</div>
              <el-input-number v-model="item.rotateY" :min="-90" :max="90" label="描述文字" size="mini" @change="lightboxrotate" />
            </div>
            <div class="siderItem">
              <div class="siderNum">{{ -90 }}</div>
              <input
                v-model="item.rotateY"
                style="width: 120px"
                class="inputItem"
                type="range"
                max="90"
                min="-90"
                step="1"
                show-input
                @input="lightboxrotate"
              >
              <div class="siderNum">{{ 90 }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="divider" style="margin-top:40px" />
    <el-dialog
      title="选择一种海报组件"
      :visible.sync="showChoseZJ"
      width="1000px"
      :before-close="closeChoseZJ"
    >
      <div class="chose-zj-box">
        <div
          class="zj-item"
          :class="{ active: activeIndex === 0 }"
          @click="zjActive(0)"
        >
          <div class="zj-ex">
            <div style="width: 149px; height: 83px" />
          </div>
          <div class="zj-la">16:9 横屏海报位</div>
        </div>
        <div
          class="zj-item"
          :class="{ active: activeIndex === 1 }"
          @click="zjActive(1)"
        >
          <div class="zj-ex">
            <div style="width: 81px; height: 123px" />
          </div>
          <div class="zj-la">9:16 竖屏海报位</div>
        </div>
        <div
          class="zj-item"
          :class="{ active: activeIndex === 2 }"
          @click="zjActive(2)"
        >
          <div class="zj-ex">
            <div style="width: 97px; height: 97px" />
          </div>
          <div class="zj-la">1:1 方形海报位</div>
        </div>
        <div
          class="zj-item"
          :class="{ active: activeIndex === 3 }"
          @click="zjActive(3)"
        >
          <div class="zj-ex">
            <div style="width: 141px; height: 29px" />
          </div>
          <div class="zj-la">4:1 长条海报位</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showChoseZJ = false">取 消</el-button>
        <el-button type="primary" @click="confirmZJ">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="选择轮播灯组件的类型" :visible.sync="showChoseLB" width="600px" :before-close="closeChoseLB">
      <div class="chose-lb-box">
        <div v-for="(item, index) in LightBoxTypes" :key="index" class="lb-item" :class="{ active: activeIndex === index }" @click="zjActive(index)">
          <div class="lb-ex">
            <img :src="item.imageUrl">
          </div>
          <div class="lb-la-bg">
            <div class="lb-la">{{ item.label }} <span class="lb-la-2">{{ item.ratio }}</span> </div>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showChoseLB = false">取 消</el-button>
        <el-button type="primary" @click="confirmLB">确 定</el-button>
      </span>

    </el-dialog>
  </div>
</template>

<script>
import { genID } from '@/utils/tools'
import uploadOss from '@/sh-oss-sdk'

export default {
  data() {
    return {
      num: 0,
      listLoading: false,
      screenIsShow: false,
      roleVis: true,
      rolePos: {
        x: 0, y: 0, z: 0
      },
      screenRotatez: 0,
      screenScale: 1,
      operationIndex: 100,
      lightboxIndex: 100,
      planeDir: false,
      activeIndex: 0,
      showChoseZJ: false, // 组件选择框
      showChoseLB: false,
      LightBoxTypes: [
        {
          style: 'strip',
          label: '细条型',
          ratio: '12:1',
          imageUrl: 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20230203/sh161a529e3e/LightBox_strip.jpg'
        },
        {
          style: 'longbox',
          label: '长条型',
          ratio: '4:1',
          imageUrl: 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20230111/sh15a3f52187/LightBox_longbox.jpg'
        },
        {
          style: 'ring',
          label: '回环型',
          ratio: '15:1',
          imageUrl: 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20230111/sh15a3fac528/LightBox_ring.jpg'
        },
        {
          style: 'banner_01',
          label: '条幅型',
          ratio: '12:1',
          imageUrl: 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20230111/sh15a40871fb/LightBox_banner_01.jpg'
        },
        {
          style: 'cube',
          label: '盒子型',
          ratio: '1:1',
          imageUrl: 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20230111/sh15a3c00b06/LightBox_cube.jpg'
        },
        {
          style: 'cylinder',
          label: '圆柱型',
          ratio: '4:1',
          imageUrl: 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20230111/sh15a3cb1d24/LightBox_cylinder.jpg'
        }
      ],
      ligboxItems: [
        {
          style: '',
          name: 'lightbox01',
          txt: '',
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          url: '',
          isSport: false,
          speed: 1
        },
        {
          style: '',
          name: 'lightbox02',
          txt: '',
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          url: '',
          isSport: false,
          speed: 1
        }
      ],
      ligboxItem: {
        txt: '',
        rotateX: 0,
        style: '',
        name: '',
        rotateY: 0,
        scale: 1,
        url: '',
        isSport: false,
        speed: 1
      },
      comItems: [
        {
          txt: '',
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          url: '',
          isSport: false,
          sportVue: 1
        },
        {
          txt: '',
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          url: '',
          isSport: false,
          sportVue: 1
        },
        {
          txt: '',
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          url: '',
          isSport: false,
          sportVue: 1
        },
        {
          txt: '',
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          url: '',
          isSport: false,
          sportVue: 1
        },
        {
          txt: '',
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          url: '',
          isSport: false,
          sportVue: 1
        },
        {
          txt: '',
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          url: '',
          isSport: false,
          sportVue: 1
        }
      ],
      sportType: [
        { lable: '浮动', value: 1 },
        { lable: '自转', value: 2 }
      ],
      restData: {
        txt: '',
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        url: '',
        name: '',
        type: '',
        isSport: false,
        sportVue: 1
      },
      labels: [
        {
          type: 'planar_16x9',
          label: '16:9'
        },
        {
          type: 'planar_9x16',
          label: '9:16'
        },
        {
          type: 'planar_1x1',
          label: '1:1'
        },
        {
          type: 'planar_4x1',
          label: '4:1'
        }
      ]
    }
  },
  mounted() {
    this.initEvent()
  },
  beforeDestroy() {
    this.removeEvent()
  },
  methods: {
    setplaneDir(data) {
      this.planeDir = data
      const dir = data ? 'vertical' : 'horizontal'
      window.StageApp.fire('StageHelper_setRolePlaneDirection', dir)
    },
    setRoleVis() {
      window.StageApp.fire('RoleVisibleSet', this.roleVis)
    },
    setRolePosX(e) {
      console.log('setRolePosX', this.rolePos.x)
      if (e.srcElement) this.rolePos.x = Number(e.srcElement.value)
      window.StageApp.fire('RolePositionSet', { pos: 'x', value: this.rolePos.x })
    },
    setRolePosY(e) {
      if (e.srcElement) this.rolePos.y = Number(e.srcElement.value)
      window.StageApp.fire('RolePositionSet', { pos: 'y', value: this.rolePos.y })
    },
    setRolePosZ(e) {
      if (e.srcElement) this.rolePos.z = Number(e.srcElement.value)
      window.StageApp.fire('RolePositionSet', { pos: 'z', value: this.rolePos.z })
    },
    setScreenRotatez(e) {
      if (e.srcElement) this.screenRotatez = Number(e.srcElement.value)
      console.log('setScreenRotatez', this.screenRotatez)
      window.StageApp.fire('HologramScreenMangerRotate', this.screenRotatez)
    },
    setScreenScale(e) {
      if (e.srcElement) { this.screenScale = Number(e.srcElement.value) }
      window.StageApp.fire('HologramScreenManger_scale', this.screenScale)
    },
    setScreenVis() {
      console.log('screenIsShow', this.screenIsShow)
      window.StageApp.fire('HologramScreenManger_setVisible', this.screenIsShow)
    },
    isSportFun(vue) {
      console.log('info', vue)
      const obj = {
        name: this.comItems[this.operationIndex].name,
        motion_type: 0
      }
      window.StageApp.fire('PosterManager_setMotion', obj)
    },
    selectSport(vue) {
      this.comItems[this.operationIndex].sportVue = vue
      const obj = {
        name: this.comItems[this.operationIndex].name,
        motion_type: this.comItems[this.operationIndex].sportVue
      }
      window.StageApp.fire('PosterManager_setMotion', obj)
    },
    // 添加监听
    initEvent() {
      this.$eventBus.$on('moduleFile', (data) => {
        console.log('opt-zujian 添加监听', data)
        if (data.components?.holo_posters?.instances) {
          data.components?.holo_posters?.instances.forEach((item, ind) => {
            let _txt = ''
            this.labels.forEach((nit) => {
              if (nit.type === item.style) {
                _txt = nit.label
              }
            })

            const _restData = { ...this.restData }
            _restData.txt = _txt
            _restData.type = item.style
            _restData.name = item.name
            _restData.scale = item.s[0]
            _restData.url = item.screen_src
            _restData.rotateX = item.r[0] * 180 / Math.PI
            _restData.rotateY = item.r[1] * 180 / Math.PI
            _restData.isSport = item.motion_type > 0
            _restData.sportVue = item.motion_type > 0 ? item.motion_type : 1
            this.$set(this.comItems, ind, _restData)
          })
        }
        if (data.components?.lightBox?.instances) {
          data.components?.lightBox?.instances.forEach((item, ind) => {
            let _txt = ''
            this.LightBoxTypes.forEach((nit) => {
              if (nit.style === item.style) {
                _txt = nit.label
              }
            })

            const _restData = { ...this.ligboxItem }
            _restData.txt = _txt
            _restData.style = item.style
            _restData.name = item.name
            _restData.scale = item.s[0]
            _restData.url = item.screen_src
            _restData.rotateX = item.r[0] * 180 / Math.PI
            _restData.rotateY = item.r[1] * 180 / Math.PI
            _restData.speed = item.speed
            this.$set(this.ligboxItems, ind, _restData)
          })
        }
        if (data.components?.holo_screen?.instances) {
          data.components?.holo_screen?.instances.forEach((item, ind) => {
            this.screenRotatez = item.r[1] //* 180 / Math.PI
            this.screenScale = item.s[0]
            this.screenIsShow = (item.visible !== undefined) ? item.visible : false
          })
        }
        if (data.roleplane?.arrangement[0]) {
          console.log('添加监听arrangement', data)
          const info = data.roleplane.arrangement[0]
          this.rolePos.x = info.x
          this.rolePos.y = info.y
          this.rolePos.z = info.z
          this.planeDir = info.direction === 'vertical'
        }
      })
    },
    // 移除监听
    removeEvent() {
      this.$eventBus.$off('moduleFile')
    },
    setLB(index) {
      console.log('组件设置', index)
      this.lightboxIndex = index
      if (this.ligboxItems[index].txt) {
        // console.log('')
      } else {
        this.showChoseLB = true
      }
    },
    // 选择组件设置
    setZJ(index) {
      console.log('组件设置', index)
      this.operationIndex = index
      if (this.comItems[index].txt) {
        // console.log('')
      } else {
        this.showChoseZJ = true
      }
    },
    // 选择 比率
    zjActive(index) {
      console.log('选择 比率', index)
      this.activeIndex = index
    },
    // 选择 组件 关闭
    closeChoseZJ() {
      console.log('选择 组件 关闭')
      this.showChoseZJ = false
    },
    closeChoseLB() {
      console.log('选择 组件 关闭')
      this.showChoseLB = false
    },
    // 设置海报图片
    setImage(url) {
      const _item = this.comItems[this.operationIndex]
      // console.log('设置图片', _item)
      window.StageApp.fire('PosterManager_set', {
        name: _item.name,
        format: 'image',
        src: url
      })
    },
    async lightBoxSetImage(e) {
      const data_hb = e.srcElement.files[0]
      const item = this.ligboxItems[this.lightboxIndex]
      this.listLoading = true
      if (data_hb) {
        const res1 = await uploadOss(data_hb)
        console.log('上传文件 ', res1)
        window.StageApp.fire('lightBox:setImage', {
          format: 'image',
          src: res1.url,
          name: item.name
        })
        // this.setImage(res1.url)
      }
      this.listLoading = false
    },
    // 上传 海报
    async upSetImage(e) {
      const data_hb = e.srcElement.files[0]
      this.listLoading = true
      if (data_hb) {
        const res1 = await uploadOss(data_hb)
        console.log('上传文件 ', res1)
        this.setImage(res1.url)
      }
      this.listLoading = false
    },
    // 上传大屏幕
    async upSetScreenImage(e) {
      const data_hb = e.srcElement.files[0]
      this.listLoading = true
      if (data_hb) {
        const res1 = await uploadOss(data_hb)
        console.log('上传文件 ', res1)
        this.setScreenImage(res1.url)
      }
      this.listLoading = false
    },
    setScreenImage(url) {
      // const _item = this.comItems[this.operationIndex]
      // console.log('设置图片', _item)
      window.StageApp.fire('HologramScreenManger_Img', {
        index: 0,
        format: 'image',
        src: url
      })
    },
    // 组件 旋转
    userRotate(e) {
      console.log('旋转', Number(e.srcElement.value))
      this.$set(
        this.comItems[this.operationIndex],
        'rotate',
        Number(e.srcElement.value)
      )
    },
    userRotateY(e) {
      let _value = 0
      if (e.srcElement) {
        _value = Number(e.srcElement.value)
      } else {
        _value = e
      }
      this.comItems[this.operationIndex].rotateY = _value
      const obj = {
        name: this.comItems[this.operationIndex].name,
        axis: 'y',
        angle: this.comItems[this.operationIndex].rotateY
      }
      console.log('旋转', obj)
      window.StageApp.fire('PosterManager_setRotate', obj)
    },
    userRotateX(e) {
      let _value = 0
      if (e.srcElement) {
        _value = Number(e.srcElement.value)
      } else {
        _value = e
      }
      this.comItems[this.operationIndex].rotateX = _value
      const obj = {
        name: this.comItems[this.operationIndex].name,
        axis: 'x',
        angle: _value// this.comItems[this.operationIndex].rotateX
      }
      console.log('旋转', obj)
      window.StageApp.fire('PosterManager_setRotate', obj)
    },
    lightboxrotate(e) {
      let _value = 0
      if (e.srcElement) {
        _value = Number(e.srcElement.value)
      } else {
        _value = e
      }
      this.ligboxItems[this.lightboxIndex].rotateY = _value
      const obj = {
        name: this.ligboxItems[this.lightboxIndex].name,
        type: 'rotateY',
        val: _value// this.comItems[this.operationIndex].rotateX
      }
      console.log('旋转', obj)
      window.StageApp.fire('lightBox:posterProp', obj)
    },
    lightboxScale(e) {
      let _value = 0
      if (e.srcElement) {
        _value = Number(e.srcElement.value)
      } else {
        _value = e
      }
      this.ligboxItems[this.lightboxIndex].scale = _value
      const obj = {
        name: this.ligboxItems[this.lightboxIndex].name,
        type: 'scale',
        val: _value// this.comItems[this.operationIndex].rotateX
      }
      console.log('缩放', obj)
      window.StageApp.fire('lightBox:posterProp', obj)
    },
    lightboxSpeed(e) {
      let _value = 0
      if (e.srcElement) {
        _value = Number(e.srcElement.value)
      } else {
        _value = e
      }
      this.ligboxItems[this.lightboxIndex].speed = _value
      const obj = {
        name: this.ligboxItems[this.lightboxIndex].name,
        type: 'speed',
        val: _value// this.comItems[this.operationIndex].rotateX
      }
      console.log('旋转', obj)
      window.StageApp.fire('lightBox:posterProp', obj)
    },
    // 组件 放缩
    userScale(e) {
      let _value = 0
      if (e.srcElement) {
        _value = Number(e.srcElement.value)
      } else {
        _value = e
      }
      // console.log('放缩', _value)
      const _item = this.comItems[this.operationIndex]
      window.StageApp.fire('PosterManager_scale', {
        name: _item.name,
        scale: _value
      })
      this.$set(_item, 'scale', _value)
    },
    confirmLB() {
      console.log('选中组件', this.activeIndex, this.LightBoxTypes[this.activeIndex])
      this.showChoseLB = false
      const _restData = { ...this.ligboxItem }
      _restData.txt = this.LightBoxTypes[this.activeIndex].label
      _restData.style = this.LightBoxTypes[this.activeIndex].style
      _restData.name = genID(1)
      this.$set(this.ligboxItems, this.lightboxIndex, _restData)

      window.StageApp.fire('LightBox:addLightBox', {
        style: _restData.style,
        name: _restData.name
      })
    },
    // 选中组件
    confirmZJ() {
      console.log('选中组件', this.activeIndex, this.labels[this.activeIndex])
      this.showChoseZJ = false
      const _restData = { ...this.restData }
      _restData.txt = this.labels[this.activeIndex].label
      _restData.type = this.labels[this.activeIndex].type
      _restData.name = genID(1)
      this.$set(this.comItems, this.operationIndex, _restData)

      window.StageApp.fire('PosterManager_add', {
        style: _restData.type,
        name: _restData.name
      })
    },
    // 重置数据
    resetCon(ind) {
      this.$set(this.comItems[this.operationIndex], 'rotate', 90)
      this.$set(this.comItems[this.operationIndex], 'scale', 1)
    },
    removeCon() {
      const _item = this.comItems[this.operationIndex]
      window.StageApp.fire('PosterManager_del', {
        name: _item.name
      })
      const _restData = { ...this.restData }
      this.$set(this.comItems, this.operationIndex, _restData)
    },
    // 删除配置
    removeLB() {
      const _item = this.ligboxItems[this.lightboxIndex]
      window.StageApp.fire('lightBox:del', {
        name: _item.name
      })
      const _restData = { ...this.ligboxItem }
      this.$set(this.ligboxItems, this.lightboxIndex, _restData)
    },
    setCzRange() {

    }
  }
}
</script>

<style lang="less" scoped>
.com-item {
  &.active {
    border: 2px solid #0653d9;
  }
}
.chose-lb-box {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    flex-direction: row;

    .lb-item {
      position: relative;
      margin-bottom: 20px;
      text-align: center;
      cursor: pointer;
    }

    .lb-la {
      padding-top: 10px;
      color: #fff;
      font-size: 16px;
      font-weight: bold;
      text-align: left;
    }

    .lb-la-2 {
      display: inline-block;
      margin-top: 2px;
      width: 30px;
      color: #838e9c;
      font-size: 13px;
      text-align: center;
      background: #fff;
      border-radius: 3px;
    }

    .lb-ex {
        width: 150px;
        height: 150px;
        border-radius: 5px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
        }

        &>div {
            background: #fff;
        }
    }

    .lb-la-bg {
      position: absolute;
      left: 10px;
      bottom: 10px;
    }

    .active {
        .lb-ex {
            outline: 2px solid #409eff;
        }

        .lb-la {
        }
    }
}
.chose-zj-box {
  display: flex;
  justify-content: space-around;
  .zj-item {
    text-align: center;
    cursor: pointer;
  }
  .zj-la {
    font-size: 16px;
    color: #000000;
    padding-top: 10px;
  }
  .zj-ex {
    width: 180px;
    height: 180px;
    background: #d8d8d8;
    border: 1px solid #979797;
    display: flex;
    justify-content: center;
    align-items: center;
    & > div {
      background: #fff;
    }
  }
  .active {
    .zj-ex {
      border: 2px solid #0653d9;
    }
    .zj-la {
      color: #0653d9;
    }
  }
}
.upload-hb-box {
  position: relative;
  margin: 20px 0;
  width: 100%;
  height: 32px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  color: #0653d9;
  font-size: 12px;
  line-height: 32px;
  text-align: center;
  overflow: hidden;
  cursor: pointer;
  input {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    cursor: pointer;
  }
}

.ra-label {
  display: inline-block;
  color: #222;
  font-size: 14px;
}
.zj-item-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
}

.zj-title {
  display: flex;
  align-items: center;
  justify-content: space-between;

}

.mt-20 {
  margin-top: 20px;
}
</style>
<style>
</style>
