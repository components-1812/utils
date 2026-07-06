import { test, expect } from '@playwright/test';

const CASES = [
	{
		value: 'rgba(28, 137, 191, 1)',
		expected: {
			rgba: { r: 28, g: 137, b: 191, a: 1 },
			hex: '#1c89bf'
		},
	}
]

test('ColorUtil', async ({ page }) => {

	page.on('console', msg => {
		console.log(`[Navegador] ${msg.type()}: ${msg.text()}`);
	});

	page.on('pageerror', exception => {
		console.error(`[Error de JS] ${exception.message}`);
	});

	await page.goto('http://127.0.0.1:3000/tests/test.html');

	for (const [i, { value, expected }] of CASES.entries()) {

		const color = await page.evaluate(([v]) => {

			const element = document.getElementById('element');

			Attr.color.set(element, 'color', v);

			return Attr.color.get(element, 'color');

		}, [value]);

		expect(color).toEqual(expected);
	}
});


