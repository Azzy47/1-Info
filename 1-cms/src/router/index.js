import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Category from '@/pages/Category'
import User from '@/pages/User'
import Article from '@/pages/Article'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: HelloWorld
    },
    {
      path: '/user',
      component: User
    },{
      path: '/category',
      component: Category
    }
    ,{
      path: '/article',
      component: Article
    }
  ]
})
