module.exports = {
    env: {
        node: true,
        commonjs: true,
    },
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    overrides: [
        {
            files: ['*.ts'],
            parser: '@typescript-eslint/parser',
            extends: [
                'plugin:@typescript-eslint/recommended',
                // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
                'prettier/@typescript-eslint',
                // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
                'plugin:prettier/recommended',
            ],
            rules: {},
        },
        {
            files: ['*.js'],
            extends: [
                'eslint:recommended',
                // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
                'plugin:prettier/recommended',
            ],
            rules: {
                'react/jsx-props-no-spreading': 'off',
            },
        },
    ],
};
