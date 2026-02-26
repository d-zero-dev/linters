// Pattern 1: addEventListener('click')
document.addEventListener('click', () => {});

// Pattern 2: onclick IDL property
const button = document.querySelector('button');
if (button) {
	button.onclick = () => {};
}

// Pattern 3: jQuery .on('click')
declare const $: any;
$('#element').on('click', () => {});

// Pattern 4: jQuery .click(handler)
$('.button').click(() => {});

// Valid: not click events
document.addEventListener('focus', () => {});
