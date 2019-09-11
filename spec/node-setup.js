import "babel-polyfill";
import { jsdom } from "jsdom";
import chai from "chai";
import React from "react";
import sinon from "sinon";
import "sinon-as-promised";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure( {
	adapter: new Adapter()
} );

global.document = jsdom( "<html><body></body></html>" );
global.window = document.defaultView;
global.chai = chai;
chai.use( require( "dirty-chai" ) );
chai.use( require( "sinon-chai" ) );
chai.use( require( "chai-as-promised" ) );
chai.use( require( "chai-enzyme" )() );
global.should = chai.should();
global.React = React;
global.sinon = sinon;
