export const Component = () => {
	return (
		<div className="c-component">
			<div className="c-component__valid-element">
				<img src="/images/hero.jpg" alt="" />
			</div>
			<div className="c-component__invalid_element"></div>
			<span>
				<div>not allowed</div>
			</span>
			<img src="/images/Hero_Banner.jpg" />
			<a href="javascript:void(0)">link</a>
			<br />
			<div id="hardcoded">a &amp; b</div>
			<p className="c-component__text">a &copy b</p>
		</div>
	);
};
