import { Store } from "lux.js";
import IntlMessageFormat from "intl-messageformat";
import { merge, cloneDeep } from "lodash";
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
		const lang = {
			locale: actualLocale,
			messages: translations[ actualLocale ] || {}
		};
		return lang;
	},
	getFormattedMessage( key, data, defaultValue ) {
		const current = this.getCurrentTranslations();
		if ( current.messages[ key ] ) {
			const msg = new IntlMessageFormat( current.messages[ key ], current.locale );
			return msg.format( data );
		}
		return typeof defaultValue !== "undefined" ? defaultValue : key;
	}
} );
