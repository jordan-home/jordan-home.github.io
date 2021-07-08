(window.webpackJsonp=window.webpackJsonp||[]).push([[32],{525:function(s,t,a){"use strict";a.r(t);var n=a(7),e=Object(n.a)({},(function(){var s=this,t=s.$createElement,a=s._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("h2",{attrs:{id:"都改了什么"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#都改了什么"}},[s._v("#")]),s._v(" 都改了什么？")]),s._v(" "),a("h3",{attrs:{id:"看多个提交的修改"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#看多个提交的修改"}},[s._v("#")]),s._v(" 看多个提交的修改")]),s._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" log -p\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 简略版")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" log --stat\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br")])]),a("h3",{attrs:{id:"查看某个commit"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#查看某个commit"}},[s._v("#")]),s._v(" 查看某个commit")]),s._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" show commitValue "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("filePath"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("h2",{attrs:{id:"上次commit提交的代码有遗漏"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#上次commit提交的代码有遗漏"}},[s._v("#")]),s._v(" 上次commit提交的代码有遗漏？")]),s._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 不会产生新的commit记录，而是合并在上一个commit里面")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" commit --amend\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br")])]),a("p",[s._v("不是上次，而是上上次、上上上次...,怎么办？")]),s._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 如果 git rebase -i, 则进入选择commit界面，将目标commit由pick改为edit")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" rebase -i commitValue\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 修改code")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("add")]),s._v(" XX\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" commit --amend\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" rebase --continue\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# end")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br")])]),a("h2",{attrs:{id:"某个commit不想要了"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#某个commit不想要了"}},[s._v("#")]),s._v(" 某个commit不想要了？")]),s._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" rebase -i\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 选择目标commit,直接删除这一行")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" rebase --continue\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# end")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br")])]),a("h2",{attrs:{id:"官方链接"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#官方链接"}},[s._v("#")]),s._v(" 官方链接")]),s._v(" "),a("p",[a("a",{attrs:{href:"https://git-scm.com/book/zh/v2",target:"_blank",rel:"noopener noreferrer"}},[s._v("View More about Git"),a("OutboundLink")],1)])])}),[],!1,null,null,null);t.default=e.exports}}]);