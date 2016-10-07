describe( "lux-i18n - intlWrapper", () => {
	let intlWrapper, FakeIntlProvider, WrappedProvider, component, getCurrentTranslations, getFormattedMessage;
	beforeEach( () => {
		getCurrentTranslations = sinon.stub().returns( {
			locale: "en-US",
			messages: {
				"test.one": "Hai",
				"test.two": "Hallo"
			}
		} );
		getFormattedMessage = sinon.stub();
		const deps = {
			"./intl.store": {
				namespace: "i18n",
				getCurrentTranslations,
				getFormattedMessage
			}
		};
		intlWrapper = proxyquire( "../src/intlWrapper", deps );
		FakeIntlProvider = React.createClass( {
			render() {
				return <div>{ this.props.children }</div>;
			}
		} );
		WrappedProvider = intlWrapper( FakeIntlProvider );
		component = ReactUtils.renderIntoDocument( <WrappedProvider /> );
	} );
	afterEach( () => {
		if ( component ) {
			ReactDOM.unmountComponentAtNode( ReactDOM.findDOMNode( component ).parentNode );
		}
	} );

	it( "should set the displayName", () => {
		WrappedProvider.displayName.should.eql( "LuxWrapped(IntlWrapper(FakeIntlProvider))" );
	} );

	it( "should set the displayName even if no component name is passed", () => {
		FakeIntlProvider = React.createClass( {
			render() {
				return <div>{ this.props.children }</div>;
			}
		} );
		delete FakeIntlProvider.displayName;
		WrappedProvider = intlWrapper( FakeIntlProvider );
		WrappedProvider.displayName.should.eql( "LuxWrapped(IntlWrapper(Component))" );
	} );

	it( "should pass expected props to IntlProvider on initialization", () => {
		const target = ReactUtils.findRenderedComponentWithType( component, FakeIntlProvider );
		target.props.should.eql( {
			locale: "en-US",
			messages: {
				"test.one": "Hai",
				"test.two": "Hallo"
			}
		} );
	} );

	it( "should pass expected props to IntlProvider when store updates", () => {
		const target = ReactUtils.findRenderedComponentWithType( component, FakeIntlProvider );
		target.props.should.eql( {
			locale: "en-US",
			messages: {
				"test.one": "Hai",
				"test.two": "Hallo"
			}
		} );

		getCurrentTranslations.returns( {
			locale: "en-US",
			messages: {
				"test.one": "Hai",
				"test.two": "Hallo",
				"test.three": "Waddup"
			}
		} );

		postal.channel( "lux.dispatcher" ).publish( "prenotify", { stores: [ "i18n" ] } );
		postal.channel( "lux.store" ).publish( "i18n.changed" );

		target.props.should.eql( {
			locale: "en-US",
			messages: {
				"test.one": "Hai",
				"test.two": "Hallo",
				"test.three": "Waddup"
			}
		} );
	} );
} );
