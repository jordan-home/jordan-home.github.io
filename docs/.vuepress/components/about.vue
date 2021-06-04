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
        on the way to better...
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
          <li>🏠 2018 ~ 2019：work at 汉得, position is FE & SQL</li>
          <li>🏠 2020 ~ 2021：work at 再惠, position is FE</li>
        </ul>
      </div>
      <div v-show="cur === 'book'">
        正在看
        <ul>
          <li>🐎 奥古斯都/约翰·威廉斯</li>
          <li>🐎 CSS揭秘/LEA VEROU</li>
          <li>🐎 毛姆书单/毛姆</li>
          <li>🐎 学习之道/芭芭拉·奥克利</li>
          <li>🐎 昨日的世界/斯特凡·茨维格</li>
          <li>🐎 哲学的故事/威尔·杜兰特</li>
          <li>🐎 深入浅出React和Redux/程墨</li>
          <li>🐎 认识自己，接纳自己/马丁·赛利格曼</li>
        </ul>
        2021已读书单（更新中⌛️）
        <ul>
          <li>📖 CSS禅意花园</li>
          <li>📖 动物农场/乔治·奥维尔</li>
          <li>📖 生命最后的读书会/威尔·施瓦贝利</li>
          <li>📖 像高手一样行动/丹尼尔·科伊尔</li>
          <li>📖 ES6标准入门</li>
          <li>📖 被讨厌的勇气</li>
          <li>📖 你不知道的JavaScript中</li>
          <li>📖 心理暗示力/埃米尔·库埃</li>
          <li>📖 秘密/朗达·贝恩</li>
          <li>📖 此生未完成/于娟</li>
          <li>📖 情感勒索</li>
          <li>📖 你不知道的JavaScript上</li>
        </ul>
      </div>
      <div v-show="cur === 'sports'">
        运动
        <ul>
          <li>💪健身</li>
          <li>🥊拳击</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      movies: {
        type:  Array,
        default: () => []
      }
    },
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
