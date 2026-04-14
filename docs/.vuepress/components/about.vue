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
      <div v-show="cur === 'intro'">
        <p>资深前端工程师，专注 AI 技术与产品化落地，热爱养生与心理学，追求技术与身心的平衡成长。</p>
        <p style="margin-top:12px;font-size:13px;color:#888;">
          出于个人兴趣搭建此博客，用于记录技术思考、身心成长与日常感悟。
        </p>
        <p style="margin-top:12px;font-size:13px;color:#666;">
          联系方式：mikie139@foxmail.com
        </p>
        <p style="margin-top:8px;font-size:13px;color:#888;">
          「每一个不曾起舞的日子，都是对生命的辜负」
        </p>
      </div>
      <div v-show="cur === 'skill'">
        <ul>
          <li>💻 React / Vue / SSR</li>
          <li>💻 TypeScript / 国际化</li>
          <li>💻 LangChain / AI 工具链与自动化</li>
          <li>💻 前端性能优化</li>
          <li>💻 设计模式与系统设计</li>
        </ul>
      </div>
      <div v-show="cur === 'work'">
        <ul>
          <li>🏠 2018 ～ 2019：汉得，FE & SQL</li>
          <li>🏠 2020 ～ 2021：再惠，前端开发</li>
          <li>🏠 2022 ～ 现在：某公司，前端开发</li>
          <li>🏠 长期从事前端开发，拥有丰富的 B 端、C 端项目实战经验，涉及电商平台、CRM 系统等多个领域</li>
        </ul>
      </div>
      <div v-show="cur === 'goal'">
        <p>2026，正在做两件事：</p>
        <ul>
          <li>🚂 轨道 A：前端求职，探索 AI + 前端结合的岗位</li>
          <li>💰 轨道 B：小红书 + OpenClaw 探索副业</li>
        </ul>
        <p>目标：时间自由。</p>
      </div>
      <div v-show="cur === 'book'">
        近期主题：财务自由、副业思维、心理学
        <ul>
          <li>📖 财务自由之路 / 博多·舍费尔</li>
          <li>📖 设计模式的艺术</li>
          <li>📖 马斯洛需求层次理论</li>
          <li>📖 资治通鉴</li>
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
          { title: '简介', code: 'intro' },
          { title: '技能', code: 'skill' },
          { title: '工作', code: 'work' },
          { title: '目标', code: 'goal' },
          { title: '读书', code: 'book' },
        ],
        cur: 'intro'
      }
    },
    methods: {
      showNav(code) {
        this.cur = code
      }
    }
  }
</script>
