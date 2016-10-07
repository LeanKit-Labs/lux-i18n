describe( "lux-i18n - intl.store", () => {
	let store;
	beforeEach( () => {
		store = proxyquire( "../src/intl.store", {} );
	} );
	afterEach( () => {
		store.dispose();
	} );

	it( "should init with default state", () => {
		store.getState().should.eql( {
			defaultLocale: "en-US",
			currentLocale: "en-US",
			translations: {}
		} );
	} );

	describe( "when handling changeLocale action", () => {
		it( "should update the locale", () => {
			store.getState().currentLocale.should.eql( "en-US" );
			lux.dispatch( "changeLocale", "es-MX" );
			store.getState().currentLocale.should.eql( "es-MX" );
		} );
	} );

	describe( "when handling receiveTranslation action", () => {
		it( "should update translations state", () => {
			store.getState().translations.should.eql( {} );
			lux.dispatch( "receiveTranslation", {
				"es-MX": {
					"hello.world": "hola mundo"
				}
			} );
			store.getState().translations.should.eql( {
				"es-MX": {
					"hello.world": "hola mundo"
				}
			} );
		} );
		it( "should merge new and old translations, not overwrite them", () => {
			store.getState().translations.should.eql( {} );
			lux.dispatch( "receiveTranslation", {
				"es-MX": {
					"hello.world": "hola mundo"
				},
				"en-US": {
					"hello.world": "HAY Y'ALL!"
				}
			} );
			const { "es-MX": origES, "en-US": origEN } = store.getState().translations;
			lux.dispatch( "receiveTranslation", {
				"es-MX": {
					"my.house": "mi casa"
				},
				"en-US": {
					"my.house": "muh crib"
				}
			} );
			store.getState().translations.should.eql( {
				"es-MX": {
					"hello.world": "hola mundo",
					"my.house": "mi casa"
				},
				"en-US": {
					"hello.world": "HAY Y'ALL!",
					"my.house": "muh crib"
				}
			} );
			const { "es-MX": newES, "en-US": newEN } = store.getState().translations;
			newES.should.not.equal( origES );
			newEN.should.not.equal( origEN );
		} );
	} );
	describe( "read accessor methods", () => {
		beforeEach( () => {
			store.getState().translations = {
				"en-US": {
					"hello.world": "oh, hai world"
				}
			};
		} );

		describe( "when calling getCurrentTranslations", () => {
			it( "should return expected state", () => {
				store.getCurrentTranslations().should.eql( {
					locale: "en-US",
					messages: {
						"hello.world": "oh, hai world"
					}
				} );
			} );
		} );

		describe( "when calling getFormattedMessage", () => {
			it( "should return expected message", () => {
				store.getFormattedMessage( "hello.world" ).should.equal( "oh, hai world" );
			} );

			it( "should return expected message that takes data into account", () => {
				const msgArray = [
					"You have said hello to {numWorlds, plural, ",
					"=0 {no worlds.}",
					"=1 {one world.}",
					"other {# worlds.}}"
				];
				store.getState().translations = {
					"en-US": {
						"hello.world": msgArray.join( "" )
					}
				};
				store.getFormattedMessage( "hello.world", { numWorlds: 42 } ).should.equal( "You have said hello to 42 worlds." );
			} );

			it( "should return the key if no message is found", () => {
				store.getFormattedMessage( "nope.nope" ).should.equal( "nope.nope" );
			} );

			it( "should return the default value if no message is found & default is provided", () => {
				store.getFormattedMessage( "nope.nope", {}, "absonopely" ).should.equal( "absonopely" );
			} );
		} );
	} );
} );
