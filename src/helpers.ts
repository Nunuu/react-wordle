import { MAX_GUESSES, WORDS } from './constants';

export function generateAnswer() {
	return WORDS[Math.floor(Math.random() * WORDS.length)];
}

export function generateGuesses() {
	return Array.from({ length: MAX_GUESSES }, () => '');
}
