export class Test1 {
	constructor() {}
	member = true;
}

export class Test2 {
	constructor() {}
	member = true;
	
	static staticMember = true;
	method() {}
}

export class Test3 {
	#a = true;
	readonly c1 = true;
	c2 = true;
	b2 = () => {};
	b1 = () => {};

	set a(value) {
		this.#a = value;
	}
	get a() {
		return this.#a;
	}

	constructor() {}
	protected _method() {}
}

export class Test4 extends Test3 {
	constructor() {
		super();
		this.#privateMethod();
	}

	protected override _method() {
		super._method();
	}
	#privateMethod() {}
	method2() {}
}
