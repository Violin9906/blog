module.exports = {
  title: 'Violin\'s Blog',
  theme: '@vuepress/theme-blog',
  base: '/blog/',
  themeConfig: {
    smoothScroll: true,
    nav: [
      {
        text: 'Home',
        link: 'https://violin9906.github.io/homepage/'
      },
      {
        text: 'Blog',
        link: '/'
      },
      {
        text: 'Tags',
        link: '/tag/'
      },
      {
        text: 'Contact',
        link: 'https://violin9906.github.io/homepage/#/contact'
      }
    ],
    footer: {
      contact: [
        {
          type: 'github',
          link: 'https://github.com/Violin9906'
        },
        {
          type: 'mail',
          link: 'mailto:violinwang@mail.ustc.edu.cn'
        },
        {
          type: 'web',
          link: 'https://violin9906.github.io/homepage/'
        }
      ],
      copyright: [
        {
          text: '本页面采用CC BY-SA 3.0协议发布',
          link: 'http://creativecommons.org/licenses/by-sa/3.0/'
        },
        {
          text: '源代码采用MIT许可协议',
          link: '/'
        },
        {
          text: 'Copyright © 2020 王若麟',
          link: '/'
        },
        {
          text: 'POWERED BY VUEPRESS',
          link: 'https://vuepress-theme-blog.ulivz.com/'
        }
      ]
    },
    comment: {
      service: 'vssue',
      owner: 'Violin9906',
      repo: 'blog',
      clientId: 'CLIENT_ID',
      clientSecret: 'CLIENT_SECRET',
    },
    sitemap: {
      hostname: 'https://violin9906.github.io/blog/'
    },
    feed: {
      canonical_base: 'https://violin9906.github.io/blog/',
    }
  },
  markdown: {
    anchor: { permalink: false },
    toc: { includeLevel: [1, 2] },
    extendMarkdown: md => {
      md.use(require('markdown-it-footnote'))
    }
  },
  plugins: [
    /*
    [
      'vuepress-plugin-mathjax',
      {
        target: 'svg',
        macros: {
          '*': '\\times',
        }
      }
    ]
    */
    '@maginapp/vuepress-plugin-katex',
    {
      delimiters: 'dollars'
    }
  ]
}