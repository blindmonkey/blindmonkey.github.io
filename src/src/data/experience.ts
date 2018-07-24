import { AbsoluteDate } from '@/helpers/dates';
import { ProgrammingLanguages } from '@/data/languages';

export namespace Jobs {
  export type Internship = 'internship';
  export type Coop = 'co-op';
  export type FullTime = 'fulltime';
  export type Type = Internship | Coop | FullTime;

  export const Internship: Internship = 'internship';
  export const Coop: Coop = 'co-op';
  export const FullTime: FullTime = 'fulltime';
}

export interface Job {
  hidden?: boolean;
  type: Jobs.Type;
  company: string;
  title: string;
  location: string;
  start: AbsoluteDate;
  end: AbsoluteDate|null;
  languages: Array<ProgrammingLanguages.Language|ProgrammingLanguages.Language[]>;
  skills: string[];
  achievements: string[];
}

const HopperJob: Job = {
  hidden: true,
  type: Jobs.FullTime,
  company: 'Hopper',
  title: 'Senior Software Engineer',
  location: 'Cambridge, MA',
  start: {month: 'May', year: 2017, day: 8},
  end: null,
  languages: ['Swift', 'Objective-C', 'Scala'],
  skills: ['Jenkins', 'AngularJS', 'Angular', 'AWS'],
  achievements: [],
};

const ShotputJob: Job = {
  type: Jobs.FullTime,
  company: 'Shotput',
  title: 'VP of Engineering',
  location: 'San Francisco, CA (remote)',
  start: {month: 'April', year: 2016},
  end: {month: 'March', year: 2017},
  languages: ['JavaScript', 'Python'],
  skills: ['AWS', 'SQLAlchemy', 'Flask', 'AngularJS', 'npm', 'Jenkins'],
  achievements: [
    'Defined and set priorities for the sales and operations team based on the tech roadmap.',
    'Scaled the logistics system to a peak of almost 3,000 orders a day.',
    'Set example of code style and testing as a culture, raising code coverage from 0% to 74%.',
    'Set up a Jenkins integration server to ensure all tests pass before merging into master.',
    'Created a repository for test data to minimize boilerplate setup code and later optimized ' +
      'it to create the data lazily, bringing the total runtime of the test suite from 13 minutes to 3.5.',
    'Specced and implemented a secure and robust webhook notification infrastructure.',
    'Designed and implemented an automated, self-correcting inventory management system to track inventory ' +
      'throughout the logistics pipeline.',
    'Architected, designed and implemented a user permissions system on top of an existing complex architecture ' +
      'to allow fine-grained control over what users can do.',
  ],
};

const GoogleJob: Job = {
  type: Jobs.FullTime,
  company: 'Google',
  title: 'Software Engineer',
  location: 'Cambridge, MA',
  start: {month: 'June', year: 2011},
  end: {month: 'April', year: 2016},
  languages: ['Java', 'JavaScript', ['C', 'C++', 'C++14'], 'Python'],
  skills: ['Google Closure', 'Bazel', 'Guice', 'FlumeJava', 'GWT', 'SVG', 'OpenGL', 'HTML5 Canvas'],
  achievements: [
    'Cowrote a patent application for efficient proximity detection.',
    'Wrote an efficient implementation of the Bentley-Ottmann line-set intersection algorithm, while ' +
      'dealing with floating point precision issues.',
    'Revised variable-width drawing algorithm for Drawings in Google Keep that reduced bugs, visual ' +
      'artifacts and overall improved appearance of rendered strokes.',
    'Communicated regularly with internal and external users of Google Charts via Google Groups and later ' +
      'GitHub Issues, helping them with bugs, workarounds, and implementations.',
    'Architected, designed and implemented a graph-based data pipeline framework using GWT that would run in ' +
      'browsers, iOS, Android, and desktop Java that supports asynchronous execution across all platforms.',
    'Owned and managed the MapReduce map data processing pipeline, and rewrote it in FlumeJava which resulted ' +
      'better-tested, more maintainable, and more efficient pipeline.',
    'Owned and developed many features of the Google Charts GeoChart, such as text markers, map projections, ' +
      'and many bug fixes.',
    'Helped launch Google+ Web Badges.',
    'Developed and maintained a new generation of Google Charts, including a new column chart, scatter chart, ' +
      'and line chart.',
    'Developed critical features in existing Google Charts, like trendlines, better interactivity and customization ' +
      'features, as well as low-level rendering features and fixed an uncountable number of bugs.',
    'Refactored the +1 button into reusable widget components.',
  ],
};

const AmazonJob: Job = {
  type: Jobs.Coop,
  company: 'Amazon.com',
  title: 'Software Development Co-op',
  location: 'Seattle, WA',
  start: {month: 'January', year: 2009},
  end: {month: 'June', year: 2009},
  languages: ['Java', 'JavaScript', 'Perl'],
  skills: ['Hibernate', 'Mechanical Turk'],
  achievements: [
    'Organized and developed a project to improve product classification using Amazon’s Mechanical ' +
      'Turk in Java using Hibernate.',
    'Organized and developed a project to help the sales team with locating websites to contact using ' +
      'the Mechanical Turk in Java.',
    'Streamlined the registration pipeline for Product Ads in Perl Mason.',
  ],
};

const AmpIdeaJob: Job = {
  type: Jobs.FullTime,
  company: 'AmpIdea',
  title: 'Co-Founder',
  location: 'Boston, MA',
  start: {month: 'September', year: 2007},
  end: {month: 'June', year: 2009},
  languages: ['Python'],
  skills: ['PyGame'],
  achievements: [
    'Architected and implemented a general widget system in Python for touchscreen-based devices, complete with ' +
      'momentum scrolling, transitions and animations to mimic the then-new iPhone interface, which included ' +
      'managing text rendering and touched upon line breaking and typesetting.',
    'Used our custom built widget system to create a smooth and beautiful interface for a touchscreen-based ' +
      'device meant to display relevant information in the back of a taxicab.',
    'Designed and developed a module to interface with various outdated taximeters in Python, which required ' +
      'using serial ports and understanding the protocols they used.',
  ],
};

const EmcJob: Job = {
  type: Jobs.Coop,
  company: 'EMC',
  title: 'Software Development Co-op',
  location: 'Southborough, MA',
  start: {month: 'January', year: 2008},
  end: {month: 'June', year: 2008},
  languages: ['Java', 'C', 'Perl'],
  skills: [],
  achievements: [
    'Wrote a Java application to parse a single text help file and produce and ' +
      'view a searchable and organized data set.',
    'Fixed bugs in the driver for large server racks in a monolithic C codebase.',
    'Tested the performance of large collections of fast 15,000 RPM fiberoptic hard drives.',
    'Wrote Perl scripts to help with development and consolidate testing data.',
  ],
};

const RueLaLaJob: Job = {
  type: Jobs.Internship,
  company: 'Rue La La',
  title: 'Software Development Intern',
  location: 'Boston, MA',
  start: {month: 'June', year: 2010},
  end: {month: 'August', year: 2010},
  languages: ['JavaScript', 'Java'],
  skills: ['jQuery', 'SmartGWT'],
  achievements: [
    'Fixed a number of bugs and added features to an internal tool written in GWT.',
    'Ported a number of features on the website from the Prototype javascript framework to jQuery.',
  ],
};

export const JOBS: Job[] = [
  HopperJob,
  ShotputJob,
  GoogleJob,
  AmazonJob,
  AmpIdeaJob,
  EmcJob,
  RueLaLaJob,
];
JOBS.sort((a, b) => {
  if (a.end == null) { return -1; }
  if (b.end == null) { return 1; }
  if (a.end.year > b.end.year) { return -1; }
  if (a.end.year < b.end.year) { return 1; }
  return 0;
});
