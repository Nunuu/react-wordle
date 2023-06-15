import { useCallback, useEffect, useId, useState } from 'react';

import './App.css';

const MAX_LETTERS = 5;
const MAX_GUESSES = 6;
const WORDS = Object.freeze([
	'APPLE',
	'BEAST',
	'FAINT',
	'FEAST',
	'FRUIT',
	'GAMES',
	'MAPLE',
	'PAINT',
	'PASTE',
	'TOWER',
	'REACT',
	'QUEST',
	'STACK',
	'QUEUE',
	'QUEEN',
	'GHOST',
]);
const KEYS = Object.freeze([
	['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
	['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
	['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Delete'],
]);
type GameState = 'progress' | 'won' | 'lost';
type CharType = 'correct' | 'present' | 'absent';
type CharStates = { [key: string]: CharType };

function App() {
	const [answer, setAnswer] = useState(generateAnswer());
	const [currentWord, setCurrentWord] = useState('');
	const [gameState, setGameState] = useState<GameState>('progress');
	const [currentRow, setCurrentRow] = useState(0);
	const [guesses, setGuesses] = useState<string[]>(generateGuesses());
	const [guessedChars, setGuessedChars] = useState<CharStates>({});

	const id = useId();

	const checkAnswer = useCallback(() => {
		if (currentWord.length < MAX_LETTERS) {
			return;
		}

		const won = currentWord === answer;
		if (currentRow >= MAX_GUESSES - 1 || won) {
			setGameState(won ? 'won' : 'lost');
		}

		const charsCopy = { ...guessedChars };
		currentWord.split('').forEach((letter, i) => {
			if (answer[i] === letter) {
				charsCopy[letter] = 'correct';
			} else if (answer.includes(letter) && charsCopy[letter] !== 'correct') {
				charsCopy[letter] = 'present';
			} else if (charsCopy[letter] !== 'correct' && charsCopy[letter] !== 'present') {
				charsCopy[letter] = 'absent';
			}
		});
		setGuessedChars(charsCopy);

		setCurrentWord('');
		setCurrentRow(currentRow + 1);
	}, [currentWord, currentRow]);

	const deleteLetter = useCallback(() => {
		if (currentWord.length === 0) {
			return;
		}
		updateWord(currentWord.slice(0, -1));
	}, [currentWord, guesses]);

	const addLetter = useCallback(
		(letter: string) => {
			const isLetter = /^[a-zA-Z]$/.test(letter);
			if (!isLetter || currentWord.length >= MAX_LETTERS) {
				return;
			}

			updateWord((currentWord + letter).toUpperCase());
		},
		[currentWord, guesses]
	);

	const updateWord = useCallback(
		(newWord: string) => {
			setCurrentWord(newWord);

			const copy = [...guesses];
			copy[currentRow] = newWord;
			setGuesses(copy);
		},
		[currentRow, guesses]
	);

	const handleKeyClick = useCallback(
		(key: string) => {
			if (gameState !== 'progress') {
				return;
			}

			if (key === 'Enter') {
				checkAnswer();
			} else if (key === 'Delete' || key === 'Backspace') {
				deleteLetter();
			} else {
				addLetter(key);
			}
		},
		[gameState, addLetter, checkAnswer, deleteLetter]
	);

	const reset = useCallback(() => {
		setCurrentWord('');
		setCurrentRow(0);
		setGuesses(generateGuesses());
		setAnswer(generateAnswer());
		setGameState('progress');
		setGuessedChars({});
	}, []);

	useEffect(() => {
		console.log('debugging:', answer);
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) {
				return;
			}

			handleKeyClick(e.key);
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [handleKeyClick]);

	return (
		<main>
			<h1>Wordle Jr.</h1>
			{gameState !== 'progress' && (
				<div>
					{gameState === 'won' ? 'Congratulations!' : `ANSWER: ${answer}`} <button onClick={reset}>Reset</button>
				</div>
			)}
			<section className="rows">
				{guesses?.map((word, i) => {
					return <Row key={`${id}-${i}`} word={word} check={i < currentRow} answer={answer} />;
				})}
			</section>
			<Keyboard onKeyClick={handleKeyClick} charStates={guessedChars} />
		</main>
	);
}

function Row({ word, answer, check }: { word: string; answer?: string; check?: boolean }) {
	const id = useId();
	const letters = word.split('');

	const rows: JSX.Element[] = [];
	for (let i = 0; i < MAX_LETTERS; i++) {
		const extraClasses: string[] = [];
		if (check && answer) {
			const currentLetter = letters[i];
			extraClasses.push('guess');
			if (answer[i] === currentLetter) {
				extraClasses.push('correct');
			} else if (answer.includes(currentLetter)) {
				extraClasses.push('present');
			} else {
				extraClasses.push('absent');
			}
		}
		if (letters[i] && letters[i] !== '') {
			extraClasses.push('filled');
		}
		rows.push(
			<div key={`${id}-${i}`} className={`letter ${extraClasses.join(' ')}`}>
				{letters[i]}
			</div>
		);
	}

	return <div className="row">{rows}</div>;
}

function Keyboard({ onKeyClick, charStates }: { onKeyClick: (key: string) => void; charStates: CharStates }) {
	const id = useId();
	return (
		<section>
			{KEYS.map((row: Array<string>, index) => {
				return (
					<div className="keyboard-row" key={`${id}-${index}`}>
						{row.map((key, index) => {
							return (
								<button
									key={`${id}-${index}`}
									onClick={() => onKeyClick(key)}
									className={charStates[key] ? `guess ${charStates[key]}` : undefined}
								>
									{key}
								</button>
							);
						})}
					</div>
				);
			})}
		</section>
	);
}

function generateAnswer() {
	return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function generateGuesses() {
	return Array.from({ length: MAX_GUESSES }, () => '');
}

export default App;
