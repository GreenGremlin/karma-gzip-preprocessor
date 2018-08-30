// ESLint rule severity
const OFF = 'off'; // 0
const WARN = 'warn'; // 1
const ERROR = 'error'; // 2
const STYLE = WARN; // Alias

module.exports = {
  extends: 'airbnb/base',

  /**
   * Overrides to the airbnb rules
   */
  rules: {
    'arrow-parens': [STYLE, 'as-needed'],
    'comma-dangle': [STYLE, 'always-multiline'],
    'no-undef': ERROR,
    'no-underscore-dangle': OFF,
    'no-unused-vars': [WARN, {
      'vars': 'local',
      'args': 'after-used',
      'ignoreRestSiblings': true,
    }],
    'padded-blocks': [STYLE, 'never'],
    'prefer-const': STYLE,
  }
}
