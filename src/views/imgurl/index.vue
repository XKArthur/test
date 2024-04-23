<template>
  <div>
    <div v-for="url in urlList" :key="url" class="exp-img">
      <img :src="url" alt="">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      urlList: [
        'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211122/shd4ad72a0d.jpg',
        'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211025/04%20%E5%A4%AA%E7%A9%BA%E5%B9%B3%E5%8F%B0.png',
        'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211025/06%20%E8%92%B8%E6%B1%BD%E6%B3%A2.png',
        'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211025/05%20%E5%A4%96%E5%A4%AA%E7%A9%BA.png',
        'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211122/shd4b3a847f.png',
        'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211122/shd4b3a8508.png',
        'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211122/shd4b3a8546.png',
        'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211122/shd4b3a8575.png',
        'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211122/shd4b3a85b0.png',
        'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211122/shd4b3a85f1.png',
        'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211122/shd4b3a8623.png',
        'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211122/shd4b3a864b.png',
        'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211122/shd4b3a8680.png',
        'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211122/shd4b3a872a.png',
        'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211122/shd4b3a87b4.png',
        'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211122/shd4b3a8818.png',
        'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211122/shd4b3a8848.png',
        'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211122/shd4b3a8878.png',
        'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211122/shd4b3a88bd.png',
        'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211122/shd4b3a88e5.png',
        'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211122/shd4b3a8914.png',
        'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211122/shd4b3a8941.png',
        'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211122/shd4b3a896d.png',
        'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211215/shdc05549af.png'
      ]
    }
  }
}
</script>
<style lang="less" scoped>
.exp-img {
  float: left;
  width: 100px;
  height: 100px;
  overflow: hidden;
  margin: 10px;
  background: #ccc;
  img {
    width: 100%;
  }
}
</style>
<style>
</style>
