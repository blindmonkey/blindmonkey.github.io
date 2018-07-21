import { ProgrammingLanguages } from '@/data/languages';

interface ProjectDefinition {
  language: ProgrammingLanguages.Language,
  title: string,
  description: string[],
  source: null|{
    title: string,
    link: string|null,
  },
  demo: null|{
    title: string,
    link: string,
  }
}

export const Projects: ProjectDefinition[] = [{
  language: 'TypeScript',
  title: 'Triangle Visualization',
  description: ['A small visualization I built for fun. It can be seen running in the background of this website. Please be warned that it requires some patience.'],
  source: {title: 'view on GitHub', link: 'https://github.com/blindmonkey/blindmonkey.github.io/tree/master/triangles'},
  demo: {title: 'view standalone', link: 'https://blindmonkey.github.io/triangles.html'}
}, {
  language: 'Haxe',
  title: 'Tail Recursion Eliminating Macro',
  description: ['For fun, I built a proof of concept for a Haxe macro that can take a tail-recursive function  and flatten it into a while loop form.'],
  source: {title: 'view on GitHub', link: 'https://github.com/blindmonkey/haxe-tail-recursion'},
  demo: null
}, {
  language: 'Python',
  title: 'PyGame Widgets and PySignature',
  description: ['As a part of the taxicab advertisement platform we developed at AmpIdea, we wanted users to have a smooth experience using it. This was around the time the first iPhone was being announced, so we made a platform that had a similar smooth experience, momentum scrolling, and animated transitions.',
    'In order to catch more errors I also wrote PySignature, which is a runtime typechecking system for Python. This allowed us to catch a lot more potential runtime errors and give users a much smoother experience. Given more development, this decorator-based system could be extended into a much more rigorous static typechecking, akin to something like MyPy.'],
  source: {title: 'coming soon', link: null},
  demo: {title: 'Watch a short video demonstrating the AmpIdea platform', link: 'https://www.youtube.com/watch?v=oozFrEOwO5c'}
}, {
  language: 'Java',
  title: 'Scheme Interpreter',
  description: ['For a school project, I wrote an interpreter for a version of the Scheme language as part of a text-based adventure game.'],
  source: null,
  demo: null
}];