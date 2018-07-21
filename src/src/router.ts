import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import About from './views/About.vue';
import Main from './views/Main.vue';
import Experience from './views/Experience.vue';
import Projects from './views/Projects.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/', name: 'main', component: Main, redirect: '/about',
      children: [
        { path: 'about', component: About },
        { path: 'experience', component: Experience },
        { path: 'projects', component: Projects },
      ],
    }/*,

    {
      path: '/about',
      name: 'about',
      component: About,
    },*/
  ],
});
