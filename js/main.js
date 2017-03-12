$(function() {
  var JOBS = [{
    company: 'Shotput',
    title: 'VP of Engineering',
    location: 'San Francisco, CA',
    start: {month: 'April', year: 2016},
    end: null, //{month: 'April', year: 2017},
    achievements: [
      'Defined and set priorities for the sales and operations team based on the tech roadmap.',
      'Set example of code style and testing as a culture, raising code coverage from 0% to 74%.',
      'Set up a Jenkins integration server to ensure all tests pass before merging into master.',
      'Scaled the logistics system to a peak of almost 3,000 orders a day.',
      'Specced and implemented a robust webhook notification infrastructure.',
      'Designed and implemented an almost real-time inventory management system.',
      'Architected, designed and implemented a user permissions system.'
    ],
  }, {
    company: 'Google',
    title: 'Software Engineer',
    location: 'Cambridge, MA',
    start: {month: 'June', year: 2011},
    end: {month: 'April', year: 2016},
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
    company: 'Amazon.com',
    title: 'Software Development Co-op',
    location: 'Seattle, WA',
    start: {month: 'January', year: 2009},
    end: {month: 'June', year: 2009},
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
    achievements: [
      'Architected and implemented a general widget system in Python for touchscreen-based devices, complete with momentum scrolling, transitions and animations to mimic the then-new iPhone interface, which included managing text rendering and touched upon line breaking and typesetting.',
      'Used our custom built widget system to create a smooth and beautiful interface for a touchscreen-based device meant to display relevant information in the back of a taxicab.',
      'Designed and developed a module to interface with various outdated taximeters in Python, which required using serial ports and understanding the protocols they used.'
    ]
  }, {
    company: 'EMC',
    title: 'Software Development Co-op',
    location: 'Southborough, MA',
    start: {month: 'January', year: 2008},
    end: {month: 'June', year: 2008},
    achievements: [
      'Wrote a Java application to parse a single text help file and produce and view a searchable and organized data set.',
      'Fixed bugs in the driver for large server racks in a monolithic C codebase.',
      'Tested the performance of large collections of fast 15,000 RPM fiberoptic hard drives.',
      'Wrote Perl scripts to help with development and consolidate testing data.'
    ]
  }, {
    company: 'Rue La La',
    title: 'Software Development Intern',
    location: 'Boston, MA',
    start: {month: 'June', year: 2010},
    end: {month: 'August', year: 2010},
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

  var SergeyWebsiteViewModel = function() {
    var self = this;
    self.jobs = ko.observable(JOBS);

    var pages = self.pages = {
      ABOUT: 'about',
      EXPERIENCE: 'experience',
      PROJECTS: 'projects'
    };

    // Page navigation
    self.page     = ko.observable();
    self.isPage   = function(p) { return p === self.page(); };
    self.goToPage = function(p) { self.page(p); };
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
