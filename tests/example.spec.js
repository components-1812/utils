import { test, expect } from '@playwright/test';

const CASES = [
	{
		value: 'rgb(255, 0, 0)',
		expected: ['#ff0000', 'rgb(255 0 0)', 'hsl(0 100% 50%)'],
	},
	{
		value: 'rgba(28, 137, 191, 1)',
		expected: ['#1c89bf', 'rgb(28 137 191)', 'hsl(200 74% 43%)'],
	},
	{
		value: '#6ab148ff',
		expected: ['#6ab148', 'rgb(106 177 72)', 'hsl(101 42% 49%)'],
	},
	{
		value: 'hsla(147, 85%, 26%, 1.00)',
		expected: ['#0a7b3d', 'rgb(10 123 61)', 'hsl(147 85% 26%)'],
	},
	{
		value: 'rgba(255, 144, 20, 0.68)',
		expected: ['#ff9015ad', 'rgb(255 144 20 / 0.68)', 'hsl(32 100% 54% / 0.68)'],
	},
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

			const color = Attr.color.get(element, 'color');

			console.log([...color.channels]);

			return [
				color.hex,
				color.rgb,
				color.hsl
			]

		}, [value]);

		expect(color).toEqual(expected);
	}
});


