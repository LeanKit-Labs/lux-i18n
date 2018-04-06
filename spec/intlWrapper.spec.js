import { mount } from "enzyme";

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
		FakeIntlProvider = ( { children } ) => <div>{ children }</div>;
		FakeIntlProvider.displayName = "FakeIntlProvider";
		WrappedProvider = intlWrapper( FakeIntlProvider );
		component = mount( <WrappedProvider /> );
	} );
	afterEach( () => {
		if ( component ) {
			component.unmount();
			component = null;
		}
	} );

	it( "should set the displayName", () => {
		WrappedProvider.displayName.should.eql( "LuxWrapped(IntlWrapper(FakeIntlProvider))" );
	} );

	it( "should set the displayName even if no component name is passed", () => {
		FakeIntlProvider = ( { children } ) => <div>{ children }</div>;
		delete FakeIntlProvider.displayName;
		WrappedProvider = intlWrapper( FakeIntlProvider );
		WrappedProvider.displayName.should.eql( "LuxWrapped(IntlWrapper(Component))" );
	} );

	it( "should pass expected props to IntlProvider on initialization", () => {
		const target = component.find( FakeIntlProvider );
		target.props().should.eql( {
			locale: "en-US",
			messages: {
				"test.one": "Hai",
				"test.two": "Hallo"
			}
		} );
	} );

	it( "should pass expected props to IntlProvider when store updates", () => {
		let target = component.find( FakeIntlProvider );
		target.props().should.eql( {
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

		component.update();
		target = component.find( FakeIntlProvider );

		target.props().should.eql( {
			locale: "en-US",
			messages: {
				"test.one": "Hai",
				"test.two": "Hallo",
				"test.three": "Waddup"
			}
		} );
	} );
} );
