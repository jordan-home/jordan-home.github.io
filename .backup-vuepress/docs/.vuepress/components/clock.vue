<template>
  <div class="clock">
    <div class="title">当前浏览时长</div>
    <div class="time">{{ timeInfo.hours | formatedTime }}</div>
    :
    <div class="time">{{ timeInfo.miniutes | formatedTime }}</div>
    :
    <div class="time">{{ timeInfo.seconds | formatedTime }}</div>
  </div>
</template>
<script>
export default {
  name: 'clock',
  data() {
    return {
      timer: null,
      timeInfo: {
        hours: 0,
        miniutes: 0,
        seconds: 0,
      },
    }
  },
  mounted() {
    this.initTime()
  },
  beforeDestroy() {
    this.timer = null
  },
  filters: {
    formatedTime(val) {
      if (val < 10) return `0${val}`
      return val
    }
  },
  methods: {
    initTime() {
      this.timer = setInterval(() => this.updateTime(), 1000)
    },
    updateTime() {
      if (this.timeInfo.seconds === 59) {
        this.timeInfo.seconds = 0
        if (this.timeInfo.miniutes === 59) {
          this.timeInfo.miniutes = 0
          this.timeInfo.hours ++
        }
        else { this.timeInfo.miniutes++ }
      } else {
        this.timeInfo.seconds ++
      }
    },

  }
}
</script>
<style scoped>
.clock {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: sienna;
}

.clock div {
  border-radius: 4px;
  padding: 0 2px;
  margin: 0 4px 0 0;
}

.clock .title {
  background: whitesmoke;
}

.clock .time {
  padding: 0 6px;
  color: whitesmoke;
  background: sienna;
  margin: 0 2px;
}
</style>