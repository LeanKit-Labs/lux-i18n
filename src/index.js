import intlWrapper from "./intlWrapper";
import intlStore from "./intl.store";

const getFormattedMessage = intlStore.getFormattedMessage.bind( intlStore );
const getFormattedNumber = intlStore.getFormattedNumber.bind( intlStore );
const getFormattedDate = intlStore.getFormattedDate.bind( intlStore );

export {
	intlWrapper,
	getFormattedMessage,
	getFormattedNumber,
	getFormattedDate,
	intlStore
};
