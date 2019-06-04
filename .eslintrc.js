
module.exports = {
	extends: ['react-app', 'prettier', 'prettier/react'],
	plugins: ['prettier'],
	rules: {
		'prettier/prettier': 'error',
		'jsx-a11y/href-no-hash': [0],
		'no-unused-expressions': 'off'
	},
    globals: {
        $: true
    },
	overrides: [
		{
			files: ['**/*.test.js', 'test-setup.js'],
			env: {
				jest: true
			},
			globals: {
			  expect: true,
				mount: true,
				sandbox: true,
				React: true,
				render: true,
				shallow: true,
                fetch: true
			},
			rules: {
				'no-unused-expressions': 'off'
			}
		}
	]
};
