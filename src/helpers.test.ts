import { describe, expect, it } from 'vitest';

import { MAX_GUESSES, WORDS } from './constants';
import { generateAnswer, generateGuesses } from './helpers';

describe(`${generateAnswer}.name`, () => {
	it('returns a random word from the predefined list of answers', () => {
		expect(WORDS).toContain(generateAnswer());
	});
});

describe(`${generateGuesses}.name`, () => {
	it('returns an array of empty strings with length equal to MAX_GUESSES', () => {
		expect(generateGuesses()).toEqual(Array(MAX_GUESSES).fill(''));
	});
});
