module.exports = {
  dest: 'blog',
  theme: 'reco',
  title: "Jordan の Words",
  description: '每一个不曾起舞的日子，都是对生命的辜负',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#66CDAA' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', href: '/icons/LatteAndCat.png' }],
    ['link', { rel: 'mask-icon', href: '/icons/LatteAndCat.svg', color: '#66CDAA' }],
    ['meta', { name: 'msapplication-TileImage', content: '/icons/LatteAndCat.png' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],
  serviceWorker: true,
  themeConfig: {
    type: 'blog',
    huawei: false,
    nav: [
      { text: 'Home', link: '/', icon: 'reco-home' },
      // { text: 'Notes', link: '/note/', icon: 'reco-document' },
      { text: 'TimeLine', link: '/timeline/', icon: 'reco-date' },
      // { text: '外链', link: '', icon: 'reco-blog'},
      { text: 'About', link: '/about/', icon: 'reco-account'},
      { text: 'GitHub', link: 'https://github.com/jordan-home', icon: 'reco-github' },
    ],
    friendLink: [
      {
        title: '午后南杂',
        desc: 'Enjoy when you can, and endure when you must.',
        email: '1156743527@qq.com',
        link: 'https://www.recoluan.com'
      },
      {
        title: 'vuepress-theme-reco',
        desc: 'A simple and beautiful vuepress Blog & Doc theme.',
        avatar: "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
        link: 'https://vuepress-theme-reco.recoluan.com'
      },
    ],
    // 博客设置
    blogConfig: {
      category: {
        location: 2, // 在导航栏菜单中所占的位置，默认2
        text: 'Category' // 默认 “分类”
      },
      tag: {
        location: 3, // 在导航栏菜单中所占的位置，默认3
        text: 'Tag' // 默认 “标签”
      }
    },
    logo: '/head.jpeg',
    // 搜索设置
    search: true,
    searchMaxSuggestions: 10,
    // 自动形成侧边导航
    subSidebar: 'auto',
    sidebarDepth: 1,
    displayAllHeaders: false,
    // sidebar: {
    //   '/note/': [
    //     {
    //       title: 'HTML5',
    //       collapsable: true,
    //       children: [
    //         'html5/HTML5的语义元素',
    //       ]
    //     },
    //   ]
    // },
    // 最后更新时间
    lastUpdated: 'Last Updated',
    // 作者
    author: 'Jordan',
    authorAvatar: '/head.jpeg',
    // 备案号
    // record: '豫ICP备19035192号',
    // recordLink: 'http://www.beian.miit.gov.cn/',
    // cyberSecurityRecord: '豫公网安备41172602000151号',
    // cyberSecurityLink: 'http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=41172602000151',
    // 项目开始时间
    startYear: '2020',
    /**
     * valine 设置 (if you need valine comment )
     */
    // valineConfig: {
    //   appId: 'XDwlSXS2pD137bPrPpwQaqqD-gzGzoHsz',// your appId
    //   appKey: 'CQ8FKrMUP76LwycPcKlDoRqV', // your appKey
    //   placeholder: '是时候展现真正的技术了',
    //   avatar: 'wavatar',
    //   serverUrl: 'https://leanserver.smallsunnyfox.com'
    // }
  },
  markdown: {
    lineNumbers: true
  },
  plugins: [
    [
      require('./plugins/KanBanNiang'),
      {
        theme: ['haruto'],
        width: 200,
        height: 400,
        modelStyle: {
          position: 'fixed',
          left: '70px',
          bottom: '50px',
          opacity: '0.9'
        },
        messageStyle: {
          position: 'fixed',
          left: '70px',
          bottom: '380px'
        },
        btnStyle: {
          bottom: '60px',
          left: '80px'
        }
      }
    ],
    // [
    //   require('./plugins/BgMusic'),
    //   {
    //     audios: [
    //       {
    //         name: '不喜欢下雨天Remix',
    //         artist: 'Piggy,Owen,DP龙猪',
    //         url: 'https://assets.smallsunnyfox.com/music/1.mp3',
    //         cover: 'https://assets.smallsunnyfox.com/music/1.jpg'
    //       },
    //     ]
    //   }
    // ],
    [
      'permalink-pinyin',
      {
        lowercase: true,
        separator: '-'
      }
    ]
  ]
}