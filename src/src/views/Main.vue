<template>
  <div class="main-content">
    <Header></Header>
    <Navigation></Navigation>
    <transition :name="transitionName">
      <router-view class="content child-view"></router-view>
    </transition>
  </div>
</template>

<style>

.child-view {
  position: absolute;
  transition: all .5s cubic-bezier(.55,0,.1,1);
}
.slide-down-enter, .slide-up-leave-active {
  opacity: 0;
  -webkit-transform: translate(0, 50px);
  transform: translate(0, 50px);
}

.slide-down-leave-active, .slide-up-enter {
  opacity: 0;
  -webkit-transform: translate(0, -50px);
  transform: translate(0, -50px);
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Header from '@/components/Header.vue';
import Navigation from '@/components/Navigation.vue';
import { Route } from 'vue-router';
import { ga } from '@/helpers/ga';

Component.registerHooks([
  // 'beforeRouteEnter',
  // 'beforeRouteLeave',
  'beforeRouteUpdate', // for vue-router 2.2+
]);

@Component({
  components: {
    Navigation,
    Header,
  },
})
export default class Main extends Vue {
  public transitionName = 'slide-left';
  public beforeRouteUpdate(to: Route, from: Route, next: () => void) {
    ga('send', 'pageview', to.path);
    const routeUrls = Navigation.Routes.map((r) => r.url);
    const fromPathIndex = routeUrls.indexOf(from.path);
    const toPathIndex = routeUrls.indexOf(to.path);
    this.transitionName = fromPathIndex < toPathIndex ? 'slide-down' : 'slide-up';
    next();
  }
}
</script>