const loadGruntTasks = require('load-grunt-tasks');

module.exports = grunt => {
  grunt.initConfig({
    pkgFile: 'package.json',
    bump: {
      options: {
        commitMessage: 'Release v%VERSION%',
        pushTo: 'origin',
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
        '.',
      ],
    },
  });

  loadGruntTasks(grunt);

  grunt.registerTask('default', ['eslint']);

  grunt.registerTask('release', 'Bump the version and publish to NPM.', type => {
    grunt.task.run([
      `bump-only:${(type || 'patch')}`,
      'conventionalChangelog',
      'bump-commit',
      'npm-publish',
    ]);
  });
};
