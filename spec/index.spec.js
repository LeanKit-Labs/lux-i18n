describe( "lux-i18n - getFormattedMessage", () => {
	it( "should pass the args straight through to the store accessor method", () => {
		const msgStub = sinon.stub();
		const instance = proxyquire( "../src", {
			"./intl.store": {
				getFormattedMessage: msgStub
			},
			"./intlWrapper": {}
		} );
		instance.getFormattedMessage( "fake.key", { datums: true }, "O NOES!" );
		msgStub.should.be.calledOnce.and.calledWith( "fake.key", { datums: true }, "O NOES!" );
	} );
} );
