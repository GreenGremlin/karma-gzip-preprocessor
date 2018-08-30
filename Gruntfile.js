const loadGruntTasks = require('load-grunt-tasks');

module.exports = grunt => {
  grunt.initConfig({
    pkgFile: 'package.json',
    'npm-contributors': {
      options: {
        commitMessage: 'chore: update contributors',
      },
    },
    bump: {
      options: {
        commitMessage: 'chore: release v%VERSION%',
        pushTo: 'upstream',
        commitFiles: [
          'package.json',
          'CHANGELOG.md',
        ],
      },
    },
    conventionalChangelog: {
      release: {
        options: {
          changelogOpts: {
            preset: 'angular',
          },
        },
        src: 'CHANGELOG.md',
      },
    },
    eslint: {
      target: [
        'index.js',
        'gruntfile.js',
      ],
    },
  });

  loadGruntTasks(grunt);

  grunt.registerTask('default', ['eslint']);

  grunt.registerTask('release', 'Bump the version and publish to NPM.', type => {
    grunt.task.run([
      'npm-contributors',
      `bump-only:${(type || 'patch')}`,
      'conventionalChangelog',
      'bump-commit',
      'npm-publish',
    ]);
  });
};
