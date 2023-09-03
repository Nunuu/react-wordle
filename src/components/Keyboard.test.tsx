import { describe, expect, it, vi } from 'vitest';

import { KEYS } from '../constants';
import { CharStates } from '../types';
import { render, screen, userEvent } from '../utils/test-utils';
import { Keyboard } from './Keyboard';

const sampleCharStates: CharStates = {
	A: 'correct',
	B: 'present',
	C: 'absent',
};

describe('Keyboard', () => {
	const setup = () => {
		const mockClick = vi.fn();
		render(<Keyboard onKeyClick={mockClick} charStates={sampleCharStates} />);
		return mockClick;
	};

	const button = (letter: string) => screen.getByRole('button', { name: letter });

	it('renders all buttons with correct keys', () => {
		setup();

		KEYS.flat().forEach((key) => {
			expect(screen.getByText(key)).toBeInTheDocument();
		});
	});

	it('calls onKeyClick with correct key when a button is clicked', async () => {
		const mockClick = setup();

		await userEvent.click(button('A'));

		expect(mockClick).toHaveBeenCalledWith('A');
	});

	it('applies correct classes to buttons', () => {
		setup();

		expect(button('A')).toHaveClass('guess correct');
		expect(button('B')).toHaveClass('guess present');
		expect(button('C')).toHaveClass('guess absent');
		expect(button('D')).not.toHaveClass('guess');
	});
});
