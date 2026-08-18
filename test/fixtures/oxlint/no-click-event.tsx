button.addEventListener('click', handler);
<button onClick={handler}>Click</button>;
// oxlint-disable-next-line unicorn/prefer-add-event-listener
button.onclick = handler;
$(button).on('click', handler);
$(button).click(handler);

document.body.click();
button.click();
$(button).click();
button.addEventListener('focus', handler);
// oxlint-disable-next-line unicorn/prefer-add-event-listener
button.onfocus = handler;
$(button).on('hover', handler);
