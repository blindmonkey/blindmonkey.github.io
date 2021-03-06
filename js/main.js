$(function() {
  var JobTypes = {};
  JobTypes.Internship = 'internship';
  JobTypes.Coop = 'co-op';
  var JOBS = [{
    hidden: true,
    company: 'Hopper',
    title: 'Senior Software Engineer',
    location: 'Cambridge, MA',
    start: {month: 'May', year: 2017, day: 8},
    end: null,
    languages: [],
    skills: [],
    achievements: []
  }, {
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
      'Created a repository for test data to minimize boilerplate setup code and later optimized it to create the data lazily, bringing the total runtime of the test suite from 13 minutes to 3.5.',
      'Specced and implemented a secure and robust webhook notification infrastructure.',
      'Designed and implemented an automated, self-correcting inventory management system to track inventory throughout the logistics pipeline.',
      'Architected, designed and implemented a user permissions system on top of an existing complex architecture to allow fine-grained control over what users can do.'
    ],
  }, {
    company: 'Google',
    title: 'Software Engineer',
    location: 'Cambridge, MA',
    start: {month: 'June', year: 2011},
    end: {month: 'April', year: 2016},
    languages: ['Java', 'JavaScript', 'C/C++/C++14', 'Python'],
    skills: ['Google Closure', 'Bazel', 'Guice', 'FlumeJava', 'GWT', 'SVG', 'OpenGL', 'HTML5 Canvas'],
    achievements: [
      'Cowrote a patent application for efficient proximity detection.',
      'Wrote an efficient implementation of the Bentley-Ottmann line-set intersection algorithm, while dealing with floating point precision issues.',
      'Revised variable-width drawing algorithm for Drawings in Google Keep that reduced bugs, visual artifacts and overall improved appearance of rendered strokes.',
      'Communicated regularly with internal and external users of Google Charts via Google Groups and later GitHub Issues, helping them with bugs, workarounds, and implementations.',
      'Architected, designed and implemented a graph-based data pipeline framework using GWT that would run in browsers, iOS, Android, and desktop Java that supports asynchronous execution across all platforms.',
      'Owned and managed the MapReduce map data processing pipeline, and rewrote it in FlumeJava which resulted better-tested, more maintainable, and more efficient pipeline.',
      'Owned and developed many features of the Google Charts GeoChart, such as text markers, map projections, and many bug fixes.',
      'Helped launch Google+ Web Badges.',
      'Developed and maintained a new generation of Google Charts, including a new column chart, scatter chart, and line chart.',
      'Developed critical features in existing Google Charts, like trendlines, better interactivity and customization features, as well as low-level rendering features and fixed an uncountable number of bugs.',
      'Refactored the +1 button into reusable widget components.'
    ]
  }, {
    type: JobTypes.Coop,
    company: 'Amazon.com',
    title: 'Software Development Co-op',
    location: 'Seattle, WA',
    start: {month: 'January', year: 2009},
    end: {month: 'June', year: 2009},
    languages: ['Java', 'JavaScript', 'Perl'],
    skills: ['Hibernate', 'Mechanical Turk'],
    achievements: [
      'Organized and developed a project to improve product classification using Amazon’s Mechanical Turk in Java using Hibernate.',
      'Organized and developed a project to help the sales team with locating websites to contact using the Mechanical Turk in Java.',
      'Streamlined the registration pipeline for Product Ads in Perl Mason.'
    ]
  }, {
    company: 'AmpIdea',
    title: 'Co-Founder',
    location: 'Boston, MA',
    start: {month: 'September', year: 2007},
    end: {month: 'June', year: 2009},
    languages: ['Python'],
    skills: ['PyGame'],
    achievements: [
      'Architected and implemented a general widget system in Python for touchscreen-based devices, complete with momentum scrolling, transitions and animations to mimic the then-new iPhone interface, which included managing text rendering and touched upon line breaking and typesetting.',
      'Used our custom built widget system to create a smooth and beautiful interface for a touchscreen-based device meant to display relevant information in the back of a taxicab.',
      'Designed and developed a module to interface with various outdated taximeters in Python, which required using serial ports and understanding the protocols they used.'
    ]
  }, {
    type: JobTypes.Coop,
    company: 'EMC',
    title: 'Software Development Co-op',
    location: 'Southborough, MA',
    start: {month: 'January', year: 2008},
    end: {month: 'June', year: 2008},
    languages: ['Java', 'C', 'Perl'],
    skills: [],
    achievements: [
      'Wrote a Java application to parse a single text help file and produce and view a searchable and organized data set.',
      'Fixed bugs in the driver for large server racks in a monolithic C codebase.',
      'Tested the performance of large collections of fast 15,000 RPM fiberoptic hard drives.',
      'Wrote Perl scripts to help with development and consolidate testing data.'
    ]
  }, {
    type: JobTypes.Internship,
    company: 'Rue La La',
    title: 'Software Development Intern',
    location: 'Boston, MA',
    start: {month: 'June', year: 2010},
    end: {month: 'August', year: 2010},
    languages: ['JavaScript', 'Java'],
    skills: ['jQuery', 'SmartGWT'],
    achievements: [
      'Fixed a number of bugs and added features to an internal tool written in GWT.',
      'Ported a number of features on the website from the Prototype javascript framework to jQuery.'
    ]
  }];
  JOBS.sort(function(a, b) {
    if (a.end == null) return -1;
    if (b.end == null) return 1;
    if (a.end.year > b.end.year) return -1;
    if (a.end.year < b.end.year) return 1;
    return 0;
  })

  var PROJECTS = [{
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

  var SergeyWebsiteViewModel = function() {
    var self = this;
    self.jobs = ko.observable(JOBS);
    self.projects = ko.observable(PROJECTS);

    var pages = self.pages = {
      ABOUT: 'about',
      EXPERIENCE: 'experience',
      PROJECTS: 'projects'
    };

    self.generateMailLink = function() {
      var contact = 'contact';
      var first = 'sergey';
      var g = 'g';
      var mail = 'mail';
      return [mail, 'to:', contact, '@', first, g, '.com'].join('');
    };

    self.hideContent = function() {
      var canvasElement = document.getElementById('canvas');
      var mainContent = document.getElementsByClassName('main-content');
      if (mainContent.length > 0) {
        mainContent = mainContent[0];
        if (mainContent.classList.contains('hidden')) {
          mainContent.classList.remove('hidden');
          // mainContent.style.display = null;
          $(mainContent).show(1000);
          $(canvasElement).animate({'opacity': 0.2}, 1000);
          // canvasElement.style.opacity = 0.2;
        } else {
          mainContent.classList.add('hidden');
          // mainContent.style.display = 'none';
          $(mainContent).hide(1000);
          $(canvasElement).animate({'opacity': 1}, 1000);
          // canvasElement.style.opacity = 1;
        }
      }
    };

    var MONTHS = ['january', 'february', 'march', 'april',
                  'may', 'june', 'july', 'august',
                  'september', 'october', 'november', 'december'];
    var dateFromComponents = function(date, end) {
      if (date == null) return new Date();
      var month = MONTHS.indexOf(date.month.toLowerCase())
      return new Date(date.year, month + (end?1:0), 1);
    };
    var computeMonthsWorked = function(job) {
      console.log('Computing months from', job.start, 'to', job.end);
      var endDate = dateFromComponents(job.end, true);
      var startDate = dateFromComponents(job.start);
      console.log('Start:', startDate)
      console.log('End:', endDate)
      var months = 0;
      while (endDate.getFullYear() > startDate.getFullYear() || endDate.getMonth() > startDate.getMonth()) {
        console.log('End date is ', endDate);
        endDate.setMonth(endDate.getMonth() - 1);
        months++;
      }
      return months;
    };
    var computeYearsWorked = function(job) {
      return computeMonthsWorked(job) / 12;
    };
    self.computeDurationWorked = function(job) {
      var months = computeMonthsWorked(job);
      var remainingMonths = months % 12;
      var years = (months - remainingMonths) / 12;
      var output = [];
      if (years > 0) {
        output.push(String(years));
        if (years > 1) {
          output.push('years');
        } else {
          output.push('year');
        }
      }
      if (remainingMonths > 0) {
        output.push(String(remainingMonths))
        if (remainingMonths > 1) {
          output.push('months');
        } else {
          output.push('month');
        }
      }
      return output.join(' ');
    };
    self.computeMonthsWorked = computeMonthsWorked;
    self.computeYearsWorked = computeYearsWorked;

    self.computeExperience = function() {
      var yearsWorked = 0;
      for (var i = 0; i < JOBS.length; i++) {
        var job = JOBS[i]
        var title = job.title;
        if (title.toLowerCase().indexOf('co-op') < 0 && title.toLowerCase().indexOf('intern') < 0) {
          yearsWorked += computeYearsWorked(job);
        }
      }
      return String(Math.floor(yearsWorked * 2) / 2);
    };

    self.filteredJobs = [];
    for (var i = 0; i < JOBS.length; i++) {
      var job = JOBS[i];
      if (!job.hidden) self.filteredJobs.push(job);
    }

    // Page navigation
    self.page     = ko.observable();
    self.isPage   = function(p) { return p === self.page(); };
    self.goToPage = function(p) { ga('send', 'pageview', '/' + p); self.page(p); };
    self.goToPage(pages.ABOUT);
    var hashHandler = function() {
      var hashValue = window.location.hash.slice(1);
      var resolved = null;
      for (var pageKey in pages) {
        if (pages[pageKey] === hashValue) {
          resolved = pages[pageKey];
          break;
        }
      }
      if (resolved == null) {
        resolved = pages.ABOUT;
      }
      self.goToPage(resolved);
    };
    window.addEventListener('hashchange', hashHandler);
    hashHandler();
  };
  ko.applyBindings(new SergeyWebsiteViewModel());
});
