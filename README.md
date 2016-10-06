# lux-i18n
Make react-intl lux-aware, and capable of consuming translations from a lux store.

## Bare-Bones Example Usage

```jsx
import { intlWrapper } from "lux-i18n";
const InternationalizedApp = intlWrapper( App );
ReactDOM.render( <InternationalizedApp />, document.querySelector( ".main" ) );
```
