import React from "react";
import { luxWrapper } from "lux.js";
import { IntlProvider } from "react-intl";
import intlStore from "./intl.store";

export default function intlWrapper( Component ) {
	class IntlWrapper extends React.Component {
		render() {
			const props = Object.assign( this.props, this.state );
			return React.createElement(
				IntlProvider,
				props,
				React.createElement( Component, props )
			);
		}
	}

	IntlWrapper.displayName = `IntlWrapper(${ Component.displayName || "Component" })`;

	return luxWrapper( IntlWrapper, {
		stores: [ intlStore.namespace ],
		getState: props => {
			return intlStore.getCurrentTranslations();
		}
	} );
}
