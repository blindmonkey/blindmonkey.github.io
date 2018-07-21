<template>
  <div>
    <h2>Projects</h2>

    <p>Here you can find a list of projects I've done, either professionally or simply for myself. A lot of these projects were prototypes and proof of concepts. At this time, I either no longer have or am unable to share the source code for some of them.</p>

    <div v-for="project in projects">
      <div class="page-header">
        <h3>
          <span>{{ project.title }}</span>
          <span>&nbsp;</span>
          <span class="label label-primary">{{ project.language }}</span>
        </h3>
      </div>
      <div v-for="paragraph in project.description">
        <p>{{ paragraph }}</p>
      </div>
      <div v-if="!!project.source" class="text-muted">
        Source:
        <span v-if="project.source.link == null">
          <span>{{ project.source.title }}</span>
        </span>
        <span v-if="project.source.link != null">
          <a v-bind:href="project.source.link" target="_blank">{{ project.source.title }}</a>
        </span>
      </div>
      <div v-if="!!project.demo" class="text-muted">
        Demo:
        <span v-if="project.demo.link == null">
          <span>{{ project.demo.title }}</span>
        </span>
        <span v-if="project.demo.link != null">
          <a v-bind:href="project.demo.link" target="_blank">{{ project.demo.title }}</a>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
import { Projects as ProjectDefs } from '@/data/projects';

@Component({})
export default class Projects extends Vue {
  projects = ProjectDefs;
}

</script>