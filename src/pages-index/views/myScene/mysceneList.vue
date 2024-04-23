<template>
  <div>
    <div class="scene-title">
      <div style="margin: 0px 0 30px; font-size: 28px; font-weight: bold;">新建场景</div>
      <!-- <div style="margin: 20px 0; font-size:20px;">从模板创建场景</div> -->
      <div class="subtitle">选择一种创建场景的方式</div>
    </div>

    <div class="selectMud" style="display: flex">
      <div
        v-for="(item, index) in createType"
        :key="index"
        class="createType"
        :class="posActive === item.id ? 'active' : ''"
        @click="choseCreate(item)"
      >
        <div class="section">
          <div class="checkIcon"></div>
          <div class="title-1">{{ item.label }}</div>
          <div class="title-1">{{ item.label2 }}</div>
          <div class="createText mt">
            <span class="hardText">上手简单：</span>
            <span class="hardText">{{ item.hard }}</span>
          </div>
          <div class="createText">
            <span class="hardText">创作自由：</span>
            <span class="hardText">{{ item.create }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="colltypestyle">
      <p v-show="posActive === 1" class="colllabel">风格选择</p>
      <div v-show="posActive === 1" class="collselect">
        <el-select
          v-model="sceneType"
          placeholder="请选择"
          style="width: 1080px"
          popper-class="camera-sel"
          @change="selectTag"
        >
          <el-option
            v-for="item in tags"
            :key="item.item_text"
            :label="item.item_text"
            :value="item.item_text"
          />
        </el-select>
      </div>
    </div>

    <div v-if="showEmpty">
      <el-empty :image-size="200" />
    </div>

    <div v-show="posActive === 1">
      <div
        v-for="item in scenelist"
        :key="item.rowid"
        class="scene-box"
        @dblclick="gotoDetail(item.rowid)"
      >
        <div class="scene-img">
          <img
            :src="
              item.cover_picture ||
              'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211122/shd4ad72a0d.jpg'
            "
            alt="封面图"
          />
        </div>
        <div class="scene-name">{{ item.sname || "新建场景" }}</div>
      </div>
    </div>

    <div v-show="posActive === 2">
      <div v-for="item in stageType" :key="item.rowid" class="template-box">
        <div class="name">{{ item.name || "新建场景" }}</div>
        <div class="img">
          <img
            :src="
              item.cover_picture ||
              'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211122/shd4ad72a0d.jpg'
            "
            alt=""
            width="100%"
          />
        </div>
        <div class="template-enter-box">
          <button class="btn-enter" @click="gotoDetail(item.rowid)">使用该模板</button>
        </div>
      </div>
    </div>

    <div v-show="posActive === 3" class="box-addfromNew">
      <!-- <div class="section_9" /> -->
      <div class="section_10">
        <span class="paragraph_4"
          >-&nbsp;模型仅支持&nbsp;FBX&nbsp;格式<br />-&nbsp;在3D软件中导出FBX格式时，不要附带任何材质<br />-&nbsp;模型支持最多&nbsp;4&nbsp;个<br />-&nbsp;模型上传后，每个模型还需要贴上与之相对的贴图<br />-&nbsp;贴图请尽可能进行事先烘焙<br
        /></span>
        <div class="btn_create flex-col" @click="$router.push('/create')">
          <img
            class="thumbnail_1"
            referrerpolicy="no-referrer"
            src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng2fc5f5d4c1808775b46d2fb681392b2429a0dcf868043de84d73b37346c82373"
          />
          <span class="text_19">上传模型&nbsp;创建场景</span>
        </div>
      </div>
    </div>

    <div style="height: 100px" />
    <div style="padding-top: 100px" />

    <div v-if="posActive === 1" class="pagination">
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[50, 100, 200]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { addfilterdata, getfilterdata, deleterowid } from "@/api/tablelist";
import { getUserInfo } from "@/utils/auth";
import moduleList from "./moduleList";
import variables from '@/styles/variables.less'


export default {
  data() {
    return {
      sceneType: "",
      tags: [],
      pageNum: 1,
      pageSize: 50,
      total: 0,
      loading: true,
      showEmpty: false,
      scenelist: moduleList,
      posActive: 1,
      createType: [
        {
          id: 1,
          label: "从我们开放的场景库中", // <br />
          label2: "选择一个进行二次加工",
          hard: "⭑⭑⭑⭑⭑",
          create: "⭑",
        },
        {
          id: 2,
          label: "选择一个基础舞台模板", // /<br //>
          label2: "自行搭配背景图片、视频",
          hard: "⭑⭑⭑",
          create: "⭑⭑⭑",
        },
        {
          id: 3,
          label: "上传场景模型和贴图", // <br />自行调节材质
          label2: "自行调节材质",
          hard: "⭑",
          create: "⭑⭑⭑⭑⭑",
        },
      ],
      stageType: [
        {
          id: 1,
          name: "模板-讲座单间",
          rowid: "1598898147284000770",
          cover_picture:
            "https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/webeditor/20221203/ed14d9f72cf3.jpg",
        },
        {
          id: 2,
          name: "模板-宽阔舞台",
          rowid: "1598904090474356738",
          cover_picture:
            "https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/webeditor/20221203/ed14da039bab.jpg",
        },
        {
          id: 3,
          name: "模板-圆弧舞台",
          rowid: "1598916663546519553",
          cover_picture:
            "https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/webeditor/20221203/ed14da320dc5.jpg",
        },
      ],
    };
  },

  mounted() {
    // this.initData()
    this.choseCreate(this.createType[1]);
  },

  methods: {
    choseCreate(val) {
      console.log("choseCreate", val);
      this.posActive = val.id;
      switch (this.posActive) {
        case 1:
          this.initData();
          break;
        case 2:
          this.scenelist = moduleList;
          break;
        case 3:
          this.scenelist = [];
          break;

        default:
          break;
      }
    },

    initData() {
      // 场景列表
      this.initAll();
      // 获取标签tag列表
      getfilterdata({
        worksheetDesc: "数据字典",
        self_dict_name: "tags",
      })
        .then((res) => {
          console.log("[标签]", res);
          if (res?.data?.data?.rows) {
            this.tags = res.data.data.rows;
            const item = {
              item_text: "全部",
              item_value: "全部",
            };
            this.tags.push(item);
          }
          this.loading = false;
        })
        .catch((err) => {
          console.log("[会议配置 err ]", err);
        });
    },

    // 获取场景列表
    initAll() {
      getfilterdata({
        worksheetDesc: "小幻演播厅exe商品",
        pageNo: this.pageNum,
        pageSize: this.pageSize,
      })
        .then((res) => {
          // console.log('[会议配置]', res)
          if (res?.data?.data?.rows) {
            this.total = res.data.data.total;
            this.scenelist = res?.data?.data?.rows.filter((item) => {
              return item.sname;
            });
            if (!this.scenelist || this.scenelist.length < 1) {
              this.showEmpty = true;
            } else {
              this.showEmpty = false;
            }
          }
          this.loading = false;
          console.log("[会议配置]", this.scenelist);
        })
        .catch((err) => {
          this.loading = false;
          this.showEmpty = true;
          console.log("[会议配置 err ]", err);
        });
    },

    selectTag() {
      var arr = [];
      this.tags.forEach((e) => {
        if (e.item_value === this.sceneType && this.sceneType !== "全部") {
          arr.push(e.item_value);
        }
      });
      if (!arr.length) {
        this.initAll();
        // this.$msg.warning('请选择筛选标签')
        return;
      }
      getfilterdata({
        worksheetDesc: "小幻演播厅exe商品",
        tage: arr.toString(),
      })
        .then((res) => {
          // console.log('[会议配置]', res)
          if (res?.data?.data?.rows) {
            this.total = res.data.data.total;
            this.scenelist = res?.data?.data?.rows.filter((item) => {
              return item.sname;
            });
            if (!this.scenelist || this.scenelist.length < 1) {
              this.showEmpty = true;
            } else {
              this.showEmpty = false;
            }
          }
          this.loading = false;
          console.log("[会议配置]", this.scenelist);
        })
        .catch((err) => {
          this.loading = false;
          this.showEmpty = true;
          console.log("[会议配置 err ]", err);
        });
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.initData();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.initData();
    },

    // 跳转到详情编辑页
    gotoDetail(rowid) {
      this.$router.push({
        path: "/create",
        query: {
          rowid: rowid,
          demo: true,
          editType: this.posActive,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.colltypestyle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 14px;
  .colltitle {
    display: none;
    width: 50px;
    font-size: 12px;
    color: #f9f9f9;
  }
  .colllabel {
    position: absolute;
    padding: 0 20px;
    color: #bbb;
    z-index: 99;
  }
  .collselect {
    .el-select {
    }
    ::v-deep.el-input__inner {
      padding-left: 80px;
    }
  }
}
.pagination {
  background: #ffffff;
  height: 80px;
  text-align: right;
  padding-top: 24px;
  position: fixed;
  bottom: 0;
  left: 0;
  border-top: 1px solid #f0f0f0;
  box-shadow: 0px -2px 5px rgba(100, 100, 100, 0.1);
  width: 100%;
}

.paragraph {
  width: 180px;
  height: 48px;
  overflow-wrap: break-word;
  color: rgba(24, 24, 25, 1);
  font-size: 18px;
  font-family: PingFangSC-Semibold;
  font-weight: 600;
  text-align: left;
  line-height: 24px;
  margin: 24px 0 0 20px;
}

.selectMud {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  padding: 10px 20px;
  width: 1080px;
  background: #f7f7f8;
  border-radius: 10px;
}

.createType {
  flex: 1;
  position: relative;
  padding: 10px;
  text-align: center;

  &.active {
    .section {
      outline: 2px solid rgba(0, 219, 125, 1);
      border: 1px solid rgba(0, 219, 125, 1);
    }

    .checkIcon {
      display: block;
    }
  }

  .checkIcon {
    display: none;
    position: absolute;
    top: 8px;
    right: 4px;
    width: 26px;
    height: 26px;
    background-image: url(https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20221201/check.png);
    background-size: cover;
  }

  .section {
    display: inline-block;
    margin: 0 4px;
    padding: 20px;
    width: 100%;
    height: 140px;
    border: 1px solid #e9e9e9;
    background-color: rgba(255, 255, 255, 1);
    border-radius: 5px;
    cursor: pointer;
  }

  .title-1 {
    font-size: 20px;
    font-weight: bold;
    text-align: left;
  }

  .createText {
    width: 104px;
    height: 20px;
    overflow-wrap: break-word;
    font-size: 0;
    text-align: left;
    white-space: nowrap;
    line-height: 20px;

    &.mt {
      margin-top: 8px;
    }
  }

  .hardText {
    width: 104px;
    height: 20px;
    overflow-wrap: break-word;
    color: rgba(24, 24, 25, 1);
    font-size: 14px;
    font-weight: NaN;
    text-align: left;
    white-space: nowrap;
    line-height: 20px;
  }
}

.scene-box {
  display: inline-block;
  margin: 40px 20px 0 0px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 1px 2px 5px rgba(204, 204, 204, 0.3);
  border-radius: 8px;
  transition: all 0.1s;
  position: relative;

  &:hover {
    box-shadow: 0 0 5px #ccc;

    .scene-del,
    .scene-edit {
      display: inline-block;
    }
  }
}

.scene-img {
  width: 256px;
  height: 144px;
  background: #eee;

  img {
    width: 100%;
    height: 100%;
  }
}

.scene-name {
  position: absolute;
  padding: 10px 0;
  bottom: 0;
  width: 100%;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  background-color: rgba(0, 0, 0, 0.4);
  overflow: hidden;
}

.template-box {
  display: inline-block;
  margin: 10px 0px 0 15px;
  padding: 26px;
  width: 340px;
  background-color: #181819;
  border-radius: 10px;

  .name {
    margin-bottom: 20px;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
  }

  .img {
    width: 288px;
    height: 162px;
    border-radius: 5px;
    overflow: hidden;
  }

  .template-enter-box {
    margin-top: 20px;
    text-align: center;

    .btn-enter {
      width: 120px;
      height: 40px;
      font-size: 14px;
      background: #00db7d;
      border-radius: 5px;
      border: none;
      outline: none;
      cursor: pointer;
    }

  }
}

.box-addfromNew {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  width: 1080px;
  height: 294px;
  border-radius: 5px;
  background-color: rgba(247, 247, 247, 1);

  .section_9 {
    background-color: rgba(216, 216, 216, 1);
    width: 416px;
    height: 234px;
    margin: 30px 0 0 30px;
  }

  .section_10 {
    width: 400px;
    height: 234px;
    margin: 30px;
  }

  .paragraph_4 {
    width: 345px;
    height: 168px;
    overflow-wrap: break-word;
    color: rgba(24, 24, 25, 1);
    font-size: 15px;
    font-family: PingFangSC-Semibold;
    font-weight: 600;
    text-align: left;
    line-height: 28px;
  }

  .btn_create {
    margin-top: 14px;
    width: 400px;
    height: 80px;
    border-radius: 5px;
    background-color: rgba(0, 219, 125, 1);
    opacity: 1;
    cursor: pointer;

    &:hover {
      opacity: 0.85;
    }
  }

  .thumbnail_1 {
    width: 20px;
    height: 18px;
    margin: 16px 0 0 190px;
  }

  .text_19 {
    width: 150px;
    height: 25px;
    overflow-wrap: break-word;
    color: rgba(255, 255, 255, 1);
    font-size: 18px;
    font-family: PingFangSC-Semibold;
    font-weight: 600;
    text-align: left;
    white-space: nowrap;
    line-height: 25px;
    margin: 6px 0 15px 125px;
  }
}
</style>