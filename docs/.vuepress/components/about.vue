<template>
  <div class="about">
    <ul class="aboutNav">
      <li
        v-for="item in nav"
        @click="showNav(item.code)"
        :style="cur === item.code ? 'background:#389;color:#fff;' : ''"
        class="aboutNavItem">
        {{item.title}}
      </li>
    </ul>
    <div class="aboutContent">
      <div v-show="cur === 'others'">
        <p>2026，正在做两件事：</p>
        <ul>
          <li>🚂 轨道 A：前端求职，准备跳槽</li>
          <li>💰 轨道 B：小红书 + OpenClaw 探索副业</li>
        </ul>
        <p>目标：时间自由。</p>
        <p style="margin-top:12px;font-size:13px;color:#888;">
          「每一个不曾起舞的日子，都是对生命的辜负」
        </p>
      </div>
      <div v-show="cur === 'tech'">
        <ul>
          <li>💻 css</li>
          <li>💻 javascript</li>
          <li>💻 react</li>
          <li>💻 vue</li>
        </ul>
      </div>
      <div v-show="cur === 'work'">
        <ul>
          <li>🏠 2018 ~ 2019：汉得，FE & SQL</li>
          <li>🏠 2020 ~ 2021：再惠，FE</li>
          <li>🏠 2022 ~ 现在：某公司，FE</li>
          <li>🎯 2026：准备转型，探索副业</li>
        </ul>
      </div>
      <div v-show="cur === 'book'">
        正在看（2026）
        <ul>
          <li>📖 财务自由之路/博多·舍费尔</li>
          <li>📖 设计模式的艺术</li>
          <li>📖 马斯洛需求层次理论</li>
        </ul>
        近期主题：财务自由、副业思维、心理学
      </div>
      <div v-show="cur === 'sports'">
        目标：80kg → 70kg（进行中🎯）
        <ul>
          <li>💪 健身</li>
          <li>🥊 拳击</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        nav: [
          { title: '技能', code: 'tech' },
          { title: '工作', code: 'work' },
          { title: '读书', code: 'book' },
          { title: '运动', code: 'sports' },
          { title: '当下', code: 'others' },
        ],
        cur: 'others'
      }
    },
    methods: {
      showNav(code) {
        this.cur = code
      }
    }
  }
</script>
