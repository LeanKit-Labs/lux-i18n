import { Store } from "lux.js";
import IntlMessageFormat from "intl-messageformat";
import merge from "lodash/merge";
import cloneDeep from "lodash/cloneDeep";
const DEFAULT_LOCALE = "en-US";

export default new Store( {
	namespace: "i18n",
	state: {
		defaultLocale: DEFAULT_LOCALE,
		currentLocale: DEFAULT_LOCALE,
		translations: {}
	},
	handlers: {
		changeLocale( currentLocale ) {
			this.setState( { currentLocale } );
		},
		/*
			Incoming translation arg should be structured like this:
			{ locale : { key: translation } }
			for example:
			{
				"en-US": {
					"home.recentBoards": "Recent Boards"
				}
			}
		*/
		receiveTranslation( translations ) {
			const existing = this.getState().translations;
			this.setState( { translations: merge( cloneDeep( existing ), translations ) } );
		}
	},
	getCurrentTranslations() {
		const { defaultLocale, currentLocale, translations } = this.getState();
		const actualLocale = currentLocale || defaultLocale;
		const language = actualLocale.split( "-" )[ 0 ];
		const lang = {
			locale: actualLocale,
			messages: translations[ actualLocale ] || translations[ language ] || {}
		};
		return lang;
	},
	getFormattedMessage( key, data, defaultValue ) {
		const current = this.getCurrentTranslations();
		if ( current.messages[ key ] || typeof defaultValue !== "undefined" ) {
			const msg = new IntlMessageFormat( current.messages[ key ] || defaultValue, current.locale );
			return msg.format( data );
		}
		return key;
	},
	getFormattedNumber( data, options ) {
		const { currentLocale } = this.getState();
		return new window.Intl.NumberFormat( currentLocale, options ).format( data );
	},
	getFormattedDate( data, options ) {
		const { currentLocale } = this.getState();
		return new window.Intl.DateTimeFormat( currentLocale, options ).format( data );
	}
} );
