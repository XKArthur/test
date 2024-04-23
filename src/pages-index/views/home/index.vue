<template>
  <div class="app-container">
    <div class="showIF">
      <!-- <h1>项目登录首页3</h1>
      <el-button type="primary" @click="$router.push('/create')">创建新项目</el-button> -->
      <!-- <img style="width:100%" src="https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211203/shd835a2186.png" alt=""> -->
      <!-- <h1>使用步骤：</h1>
      <h3>
        <ol style="line-height:2">
          <li>个人场景列表，点击【创建新场景】</li>
          <li>场景需要【手动推送】到场景使用的渠道</li>
          <li>修改场景只需要【双击场景】进入编辑页面</li>
        </ol>
      </h3> -->
      <iframe
        class="sh-word"
        src="https://www.yuque.com/docs/share/c633de11-bd01-4b5c-bcfe-bb3db80fad43"
        frameborder="0"
      />
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.showIF {
  overflow: auto;
}
.showIF::-webkit-scrollbar {
  display: none;
}
.sh-word {
  width: 100%;
  height: 800px;
  overflow: auto;
}
.sh-word::-webkit-scrollbar {
  display: none;
}
</style>
