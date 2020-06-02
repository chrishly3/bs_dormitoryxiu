<template>
  <div class="chart-container">
    <chart height="100%" width="100%"/>
    <h1>聊天室：</h1>
    <div>
      <iframe src="http://129.211.62.146:3000/channel/general" width="2000" height="900"/>
    </div>
  </div>
</template>

<script>
// import Chart from '@/components/Charts/lineMarker'

export default {
  //name: 'LineChart'
  // components: { Chart }
}
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>
