import proxyFn from "proxyquire";
const proxyquire = proxyFn.noPreserveCache().noCallThru();
import { mount } from "enzyme";

describe( "lux-i18n - intlWrapper", () => {
	let intlWrapper, IntlWrapper, luxConfig, FakeIntlProvider, WrappedProvider, component, getCurrentTranslations, getFormattedMessage;
	beforeEach( () => {
		const translations = {
			locale: "en-US",
			messages: {
				"test.one": "Hai",
				"test.two": "Hallo"
			}
		};

		getCurrentTranslations = sinon.stub();
		getFormattedMessage = sinon.stub();
		const deps = {
			"./intl.store": {
				namespace: "i18n",
				getCurrentTranslations,
				getFormattedMessage
			},
			"lux.js": {
				luxWrapper( comp, cfg ) {
					luxConfig = cfg;
					IntlWrapper = comp;
					return IntlWrapper;
				}
			}
		};
		FakeIntlProvider = ( { children } ) => <div>{ children }</div>;
		FakeIntlProvider.displayName = "FakeIntlProvider";
		intlWrapper = proxyquire( "./intlWrapper", deps );
		WrappedProvider = intlWrapper( FakeIntlProvider );
		component = mount( <WrappedProvider { ...translations } /> );
	} );

	afterEach( () => {
		if ( component ) {
			component.unmount();
			component = null;
		}
	} );

	it( "should set the displayName", () => {
		WrappedProvider.displayName.should.eql( "IntlWrapper(FakeIntlProvider)" );
	} );

	it( "should set the displayName even if no component name is passed", () => {
		FakeIntlProvider = ( { children } ) => <div>{ children }</div>;
		delete FakeIntlProvider.displayName;
		WrappedProvider = intlWrapper( FakeIntlProvider );
		WrappedProvider.displayName.should.eql( "IntlWrapper(Component)" );
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

	it( "should listen to the intl store", () => {
		luxConfig.stores.should.eql( [ "i18n" ] );
	} );

	it( "should get current translations as state", () => {
		getCurrentTranslations.returns( {
			locale: "en-US",
			messages: {
				"test.one": "Hai",
				"test.two": "Hallo",
				"test.three": "Waddup"
			}
		} );

		luxConfig.getState().should.eql( {
			locale: "en-US",
			messages: {
				"test.one": "Hai",
				"test.two": "Hallo",
				"test.three": "Waddup"
			}
		} );
	} );
} );
