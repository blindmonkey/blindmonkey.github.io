<template>

  <div id="app">
    <div style="position:fixed; left: 0px; top:0px; z-index: -1000">
      <transition name="fade-canvas">
        <canvas id="canvas" width="800" height="600" v-bind:class="{ focused: !textVisible }"></canvas>
      </transition>
    </div>
    <small style="position:fixed; right: 40px; top: 20px" class="fadein">
      <button id="hide-button" @click="hideContent()">Click here to hide/show the text</button>
    </small>
    <transition name="fade">
      <router-view v-show="textVisible"/>
    </transition>
  </div>
</template>

<style>
.fade-enter-active {
  transition: opacity 0.5s ease-in;
}
.fade-leave-active {
  transition: opacity 0.5s ease-out;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
.fade-leave, .fade-enter-to {
  opacity: 1;
}

#hide-button {
  background: none;
  border: 0px;
}
#canvas {
  opacity: 0.2;
  transition: opacity .5s;
}
#canvas.focused {
  opacity: 1;
  transition: opacity .5s;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { tryUntil } from '@/helpers/try';

// const

@Component({})
export default class App extends Vue {
  public textVisible = false;
  public created() {
    tryUntil(() => {
      const options = (window as {TriangleOptions?: undefined|{interactivity: boolean}}).TriangleOptions;
      if (!options) {
        return false;
      }
      options.interactivity = false;
      return true;
    }, .5);
  }
  public mounted() {
    this.textVisible = true;
    // setTimeout(() => {
    //   console.log('textvisible change')
    // }, 100)
  }
  public hideContent() {
    this.textVisible = !this.textVisible;
  }
}
</script>