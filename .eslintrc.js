return;
module.exports = {
    extends: 'airbnb-base',
    rules: {
        // errors
        'callback-return': ['error', ['callback', 'cb', 'next', 'done']],
        'no-console': 'error',

        // warning
        'comma-dangle': ['warn', 'always-multiline'],
        'comma-spacing': ['warn', { 'before': false, 'after': true }],
        'global-require': 'warn',
        'import/no-unresolved': ['warn', { 'commonjs': true }],
        'indent': ['warn', 2, { 'SwitchCase': 1 }],
        'key-spacing': ['warn', { 'beforeColon': false, 'afterColon': true }],
        'no-multi-spaces': 'warn',
        'no-nested-ternary': 'warn',
        'no-shadow': ['warn', {'allow': ['err']}],
        'no-spaced-func': 'warn',
        'no-unused-expressions': 'warn',
        'no-unused-vars': ['warn', { 'vars': 'local', 'args': 'after-used' }],
        'no-var': 'warn',
        'object-curly-spacing': ['warn', 'always'],
        'one-var': ['warn', 'never'],
        'prefer-template': 'warn',
        'prefer-arrow-callback': ['warn', { allowNamedFunctions: false, allowUnboundThis: true }],
        'quotes': [ 'warn', 'single', { 'avoidEscape': true }],
        'space-before-function-paren': ['warn', { 'anonymous': 'always', 'named': 'never' }],
        'spaced-comment': ['warn', 'always', { 'exceptions': ['-', '+'], 'markers': ['=', '!'] }],
        'space-infix-ops': 'warn',
        'space-before-blocks': 'warn',
        'wrap-iife': ['warn', 'outside'],

        // turned off
        'consistent-return': 'off',
        'func-names': 'off',
        'max-len': 'off',
        'newline-per-chained-call': 'off',
        'new-cap': 'off',
        'no-else-return': 'off',
        'no-new': 'off', // tried to keep it on for classes, but couldn't get it to work (eslint bug?)
        'no-param-reassign': 'off',
        'no-underscore-dangle': 'off',
        'no-use-before-define': 'off',
        'padded-blocks': 'off',
        'quote-props': 'off',
        'radix': 'off',
        'strict': 'off',
        'vars-on-top': 'off',
    },
};
