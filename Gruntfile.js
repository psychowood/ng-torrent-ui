// Generated on 2014-10-17 using generator-angular 0.9.8
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Require the proxy package  https://github.com/drewzboto/grunt-connect-proxy
  // to test locally outside uTorrent

  grunt.loadNpmTasks('grunt-connect-proxy');

  // Replaces strings on files by using string or regex patterns. Used to inject
  // package.json data in the app
  grunt.loadNpmTasks('grunt-string-replace');

  //Gzip files for utorrent archive
  grunt.loadNpmTasks('grunt-contrib-compress');

  // Create the zip for distribution
  grunt.loadNpmTasks('grunt-zip');

  // ProcessHtml for demo build
  grunt.loadNpmTasks('grunt-processhtml');

  // Rename to move dist/app to dist/demo
  grunt.loadNpmTasks('grunt-contrib-rename');

  // Validate json resources (language files)
  grunt.loadNpmTasks('grunt-jsonlint');

  // Converting .html templates in javascript for better cdn importing
  grunt.loadNpmTasks('grunt-html2js');

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    version: require('./bower.json').version || require('./package.json').version || 'version missing',
    releases: 'releases',
    distRoot: 'dist',
    dist: 'dist/app',
    distUtorrent: 'dist/utorrent',
    distDemo: 'dist/demo',
    utorrentClassicWebUIArchive: 'resources/utorrent-webui.2013052820184444.zip'
  };

  var torrentHost = grunt.option('torrent-host') || 'localhost';
  var torrentPort = grunt.option('torrent-port') || 58055;

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    html2js: {
      options: {
        base: '<%= yeoman.app %>',
        quoteChar: '\'',
        useStrict: true
      },
      views: {
        src: ['<%= yeoman.app %>/views/{,*/}*.html'],
        dest: '.tmp/scripts/views.js'
      },
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      views: {
        files: ['<%= yeoman.app %>/views/{,*/}*.html'],
        tasks: ['html2js'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      demo: {
        files: ['<%= yeoman.app %>/demo/{,*/}*'],
        tasks: ['processhtml:demo']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
        '<%= yeoman.app %>/{,*/}*.html',
        '<%= yeoman.app %>/demo/{,*/}*',
        '.tmp/styles/{,*/}*.css',
        '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // Demo setup with e2e
    processhtml: {
      demo: {
        files: {
          '.tmp/demo.html': ['<%= yeoman.app %>/index.html']
        }
      },
      demodist: {
        files: {
          '<%= yeoman.dist %>/index.html': ['<%= yeoman.app %>/index.html']
        }
      },
      analytics: {
        files: {
          '<%= yeoman.dist %>/index.html': ['<%= yeoman.dist %>/index.html']
        }
      }
    },

    rename: {
      demo: {
        files: [
              {src: ['<%= yeoman.dist %>'], dest: '<%= yeoman.distDemo %>'}
            ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
        livereload: 35729
      },
      proxies: [
      {
        context: '/gui',
        host: torrentHost,
        port: torrentPort,
        https: false,
        xforward: false
      }
      ],
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
            require('grunt-connect-proxy/lib/utils').proxyRequest,
            connect.static('.tmp'),
            connect().use(
              '/bower_components',
              connect.static('./bower_components')
            ),
            connect.static(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
            connect.static('.tmp'),
            connect.static('test'),
            connect().use(
              '/bower_components',
              connect.static('./bower_components')
            ),
            connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },

    'string-replace': {
      remoted:  {
        files: {
          '<%= yeoman.dist %>/latest.html': '<%= yeoman.dist %>/index.html'
        },
        options: {
          replacements: [{
            pattern: /src="scripts\//g,
            replacement: 'src="http://ng-torrent-ui.dtdns.net/ngtorrentui/scripts/'
          },{
            pattern: /href="styles\//g,
            replacement: 'href="http://ng-torrent-ui.dtdns.net/ngtorrentui/styles/'
          }]
        }
      }
    },


    zip: {
      utorrent: {
        cwd: '<%= yeoman.distUtorrent %>',
        src: '<%= yeoman.distUtorrent %>/**/*',
        dest: '<%= yeoman.releases %>/utorrent/webui.zip',
        dot: true
      }
    },

    unzip: {
      utorrent: {
        src: '<%= yeoman.utorrentClassicWebUIArchive %>',
        dest: '<%= yeoman.distUtorrent %>/classic'
      }
    },

    compress: {
      utorrent: {
        options: {
          mode: 'gzip'
        },
        files: [
          // Each of the files in the src/ folder will be output to
          // the dist/ folder each with the extension .gz.js
          // {expand: true, src: ['<%= yeoman.dist %>/**/*.js'], dest: '<%= yeoman.distUtorrent %>', ext: '.js.gz'},
          // {expand: true, src: ['<%= yeoman.dist %>/**/*.html'], dest: '<%= yeoman.distUtorrent %>', ext: '.html.gz'},
          // {expand: true, src: ['<%= yeoman.dist %>/**/*.css'], dest: '<%= yeoman.distUtorrent %>', ext: '.css.gz'}
          {expand: true, cwd: '<%= yeoman.dist %>',src: '**/*', dest: '<%= yeoman.distUtorrent %>/', filter: 'isFile', rename: function(dest, src) {
            return dest + src + '.gz';
          }}
        ]
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js'
        // '<%= yeoman.app %>/langs/utorrent/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    jsonlint: {
      languages: {
        src: [ '<%= yeoman.app %>/langs/{,*/}*.json', '<%= yeoman.app %>/langs/utorrent/{,*/}*.json' ]
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
          '.tmp',
          '<%= yeoman.distRoot %>',
          '.npm'
          ]
        }]
      },
      server: '.tmp',
      remoted: {
        files: [{
          dot: true,
          src: [
          '<%= yeoman.releases %>/remoted-resources'
          ]
        }]
      },
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath:  /\.\.\//
      },
      demo: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath:  /\.\.\//,
        devDependencies: true
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
        '<%= yeoman.dist %>/scripts/{,*/}*.js',
        '<%= yeoman.dist %>/styles/{,*/}*.css',
        '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
        '<%= yeoman.dist %>/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>','<%= yeoman.dist %>/images']
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/scripts/scripts.js': [
    //         '<%= yeoman.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    uglify: {
      dist: {
        options: { preserveComments: false }
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: ['*.js', '!oldieshim.js'],
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
          '*.{ico,png,txt}',
          '.htaccess',
          '*.html',
          // 'views/{,*/}*.html',
          'images/{,*/}*.{webp}',
          'fonts/*',
          'langs/{,*/}*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: 'bower_components/flatstrap-css-only/dist',
          src: 'fonts/*',
          dest: '<%= yeoman.dist %>'
        }, {
          expand: true,
          cwd: 'bower_components/components-font-awesome',
          src: 'fonts/*',
          dest: '<%= yeoman.dist %>'
        }, {
          '<%= yeoman.dist %>/bower.json':'bower.json'
        }]
      },
      demo: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: 'demo/*',
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      },
      bower: {
        files: {
          '.tmp/bower.json':'bower.json'
        }
      },
      remoted: {
        expand: true,
        cwd: '<%= yeoman.dist %>',
        src: [
        'scripts/{,*/}*',
        'styles/{,*/}*',
        'fonts/{,*/}*',
        'langs/{,*/}*',
        'favicon.png'
        ], dest: '<%= yeoman.distRoot %>/remoted-resources/'
        }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
      'copy:styles',
      'copy:bower'
      ],
      test: [
      'copy:styles'
      ],
      dist: [
      'copy:styles',
      'imagemin',
      'svgmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    }
  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'html2js',
      'wiredep:app',
      'configureProxies:server',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
      ]);
    });

    grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
      grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
      grunt.task.run(['serve:' + target]);
    });

    grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
    ]);

    grunt.registerTask('build', [
    'clean:dist',
    'wiredep:app',
    'useminPrepare',
    'html2js',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify'
    ]);

    grunt.registerTask('prepare', [
    'newer:jshint',
    'newer:jsonlint',
    //'test',
    'build',
    'processhtml:analytics'
    ]);

    grunt.registerTask('utorrent-archive', [
    'compress:utorrent',
    'unzip:utorrent',
    'zip:utorrent'
    ]);

    grunt.registerTask('default', [
    'prepare',
    'usemin',
    'string-replace:remoted',
    'copy:remoted',
    'utorrent-archive'
    ]);

    grunt.registerTask('serve-demo', [
     'clean:server',
     'html2js',
     'wiredep:demo',
     'configureProxies:server',
     'processhtml:demo',
     'concurrent:server',
     'autoprefixer',
     'connect:livereload',
     'watch'
     ]);

   grunt.registerTask('build-demo', [
    'newer:jshint',
    'newer:jsonlint',
    //'test',
    'clean:dist',
    'html2js',
    'wiredep:demo',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'copy:demo',
    'processhtml:demodist',
    'processhtml:analytics',
    'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    // 'htmlmin',
    'rename:demo'
    ]);



  };
