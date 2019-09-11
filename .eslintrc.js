module.exports = {
	extends: [ "leankit", "leankit/es6", "leankit/babel" ],
	overrides: [
		{
			files: [ "*.spec.js", "spec/**/*.js" ],
			extends: [ "leankit/test" ],
			globals: {
				"sinon": true
			}
		}
	  ]
};
