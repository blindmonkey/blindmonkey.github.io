<template>
  <nav>
    <ul class="nav nav-pills nav-stacked">
      <router-link tag="li" role="presentation" v-for="route in routes" v-bind:to="route.url" active-class="active">
        <a>{{ route.text }}</a>
      </router-link>
      <li role="presentation"><a href="files/sergey-grabkovsky-resume.pdf" target="_blank">
        Resume &nbsp;<i class="glyphicon glyphicon-new-window"></i></a></li>
      <li role="presentation"><a href="https://www.linkedin.com/in/sergey-g/" target="_blank">
        LinkedIn &nbsp;<i class="glyphicon glyphicon-new-window"></i></a></li>
      <li role="presentation"><a href="https://github.com/blindmonkey" target="_blank">
        GitHub &nbsp;<i class="glyphicon glyphicon-new-window"></i></a></li>
    </ul>

    <br/>
    <p class="text-muted">This web site was built with love using <a href="http://knockoutjs.com/">Knockout</a>, <a href="http://getbootstrap.com/">Bootstrap</a>, and of course <a href="https://jquery.com/">jQuery</a>.</p>
    <p class="text-muted">&copy; Sergey Grabkovsky 2017</p>
  </nav>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  
})
export default class Navigation extends Vue {
  static Routes: {url: string, text: string}[] = [
    {url: '/about', text: 'About Me'},
    {url: '/experience', text: 'Experience & Education'},
    {url: '/projects', text: 'Projects'},
  ]

  routes = Navigation.Routes;

}

</script>