import { describe, expect, it } from 'vitest';

import { MAX_LETTERS } from '../constants';
import { render } from '../utils/test-utils';
import { Row, RowProps } from './Row';

describe(`${Row.name}`, () => {
	const initProps: RowProps = {
		word: 'ghost',
	};
	const setup = (args: RowProps) => {
		const { container } = render(<Row {...args} />);
		return container.querySelectorAll('.letter');
	};

	it('renders the correct number of letter elements', () => {
		const letterElements = setup(initProps);
		expect(letterElements.length).toBe(MAX_LETTERS);
	});

	it('renders letter elements without special classes', () => {
		const letterElements = setup(initProps);
		letterElements.forEach((letterElement) => {
			const letterClasses = letterElement.classList.toString();
			expect(letterClasses).not.toContain('guess');
		});
	});

	describe('when checking', () => {
		const setupCheck = (answer: string) => {
			const letterElements = setup({
				...initProps,
				check: true,
				answer,
			});
			return letterElements[0].classList.toString();
		};

		it('applies the correct class to the letters at correct positions', () => {
			const letterClasses = setupCheck('g____');
			expect(letterClasses).toContain('correct');
		});

		it('applies the present class to the letters that exist in the answer', () => {
			const letterClasses = setupCheck('agile');
			expect(letterClasses).toContain('present');
		});

		it('applies absent class to letters that do not exist in the answer', () => {
			const letterClasses = setupCheck('a____');
			expect(letterClasses).toContain('absent');
		});
	});
});
