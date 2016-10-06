import intlWrapper from "./intlWrapper";
import intlStore from "./intl.store";

const getFormattedMessage = intlStore.getFormattedMessage.bind( intlStore );

export {
	intlWrapper,
	getFormattedMessage,
	intlStore
};
