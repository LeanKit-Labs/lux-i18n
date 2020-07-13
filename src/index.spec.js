import proxyFn from "proxyquire";
const proxyquire = proxyFn.noPreserveCache().noCallThru();

describe( "lux-i18n - getFormattedMessage", () => {
	it( "should pass the args straight through to the store accessor method", () => {
		const msgStub = sinon.stub();
		const numStub = sinon.stub();
		const dateStub = sinon.stub();
		const instance = proxyquire( "./", {
			"./intl.store": {
				getFormattedMessage: msgStub,
				getFormattedNumber: numStub,
				getFormattedDate: dateStub
			},
			"./intlWrapper": {}
		} );
		instance.getFormattedMessage( "fake.key", { datums: true }, "O NOES!" );
		instance.getFormattedNumber( 20, { style: "percent" } );
		instance.getFormattedDate( new Date( Date.UTC( 2020, 12, 31, 0, 0, 0 ) ), { weekday: "long", year: "numeric", month: "short", day: "numeric" } );
		msgStub.should.be.calledOnce.and.calledWith( "fake.key", { datums: true }, "O NOES!" );
		numStub.should.be.calledOnce.and.calledWith( 20, { style: "percent" } );
		dateStub.should.be.calledOnce.and.calledWith( new Date( Date.UTC( 2020, 12, 31, 0, 0, 0 ) ), { weekday: "long", year: "numeric", month: "short", day: "numeric" } );
	} );
} );
