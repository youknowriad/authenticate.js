module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // validate js files
        jshint: {
            options: {
              multistr: true
            },
            all: ['src/js/**/*.js']
        },

        // Concat Files
        concat: {
            lib: {
                src: [
                    'src/js/module.js',
                    'src/js/**/*.js'
                ],
                dest: 'build/authenticate.js'
            }
        },

        // Copy Files
        copy: {
          lib: {
            files: [
              {expand: true, cwd: 'src/partials', src: ['**/*.html'], dest: 'build/partials'}
            ]
          }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['jshint', 'concat', 'copy']);
};
