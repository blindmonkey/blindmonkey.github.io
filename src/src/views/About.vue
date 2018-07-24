<template>
  <div class="about">
    <h2>Contact</h2>
    <p>You may contact me either by navigating to <a href="https://www.linkedin.com/in/sergey-g/" target="_blank">my LinkedIn page</a> or by <a v-bind:href="generateMailLink()">sending me an email</a>.</p>

    <br/>
    <h2>About Me</h2>
    <p>I am a problem solver who takes big complex tasks and breaks them down into small executable pieces. Whether working with other engineers or taking the task on myself, I get things done in a maintainable and efficient way. I clarify project specifications by noticing ambiguities and asking the right questions to resolve them.</p>

    <p>In my <span>{{ computeExperience() }}</span> of experience, I have worked everywhere in the stack. I am as comfortable writing backend C as I am writing frontend JavaScript and laying out HTML. I pride myself in being a quick learner and enjoy working in new fields, languages, and frameworks.
    </p>

    <p>Especially interested in compilers, parsers, programming languages, artificial intelligence, game development, computer graphics, audio generation and processing, visualization, and computational geometry.</p>



    <!--
    <p>I am a software engineer with 7 years of hands-on professional experience architecting, designing, testing, implementing, and repairing large complex systems. Flexible, willing to own code, not afraid of refactoring when necessary, diligent, and detail-oriented.</p>
    -->

    <br/>
    <h2>Technical Skills</h2>
    <table class="table">
      <thead>
        <tr>
          <th style="width: 25%">Category</th>
          <th>Skills (sorted by approximate proficiency in descending order)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Programming Languages</td>
          <td>Python, JavaScript, Java, SQL, TypeScript, Haxe, C/C++/C++14, Perl, Scheme, Ruby</td>
        </tr>
        <tr>
          <td>Operating Systems</td>
          <td>OS X, Linux (Ubuntu, Gentoo, Red Hat), Windows</td>
        </tr>
        <tr>
          <td>Databases</td>
          <td>PostgreSQL, MySQL, BigTable</td>
        </tr>
        <tr>
          <td>Frameworks and Tools</td>
          <td>Angular 1 &amp; 2, AWS, Bazel, Django, Flask, jQuery, Google Closure, GWT, Hibernate, HTML5 Canvas, Node.js, OpenGL, SQLAlchemy, SVG, Three.js</td>
        </tr>
        <tr>
          <td>Source Control</td>
          <td>Git/GitHub, Subversion, Perforce</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { DateMath } from '@/helpers/dates';
import { JOBS, Jobs } from '@/data/experience';

@Component({})
export default class About extends Vue {
  public generateMailLink(): string {
    const contact = 'contact';
    const first = 'sergey';
    const g = 'g';
    const mail = 'mail';
    return [mail, 'to:', contact, '@', first, g, '.com'].join('');
  }

  public computeExperience(): string {
    const relevantExperience = JOBS.filter((job) => job.type === Jobs.FullTime);
    let totalYears = 0;
    for (const job of relevantExperience) {
      totalYears += DateMath.yearsDuration(job.start, job.end);
    }

    const wholeYears = Math.floor(totalYears);
    const fractionalRemainder = totalYears % 1;
    if (fractionalRemainder >= 0.85) {
      return ['almost', wholeYears + 1, 'years'].join(' ');
    } else if (0.4 < fractionalRemainder && fractionalRemainder < 0.85) {
      return [wholeYears + .5, 'years'].join(' ');
    } else {
      return [wholeYears, 'years'].join(' ');
    }
  }
}
</script>