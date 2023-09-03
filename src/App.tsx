import { useCallback, useEffect, useId, useState } from 'react';

import { Keyboard, Row } from './components';
import { MAX_GUESSES, MAX_LETTERS } from './constants';
import { generateAnswer, generateGuesses } from './helpers';
import { CharStates, GameState } from './types';

import './App.css';

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
			setGuesses((prevGuesses) => {
				prevGuesses[currentRow] = newWord;
				return prevGuesses;
			});
		},
		[currentRow]
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
		console.log('[DEBUG] answer is:', answer);
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
				<p>
					{gameState === 'won' ? 'Congratulations!' : `ANSWER: ${answer}`} <button onClick={reset}>Reset</button>
				</p>
			)}
			<section className="rows">
				{guesses?.map((word, i) => {
					console.log('map guesses');
					return <Row key={`${id}-${i}`} word={word} check={i < currentRow} answer={answer} />;
				})}
			</section>
			<Keyboard onKeyClick={handleKeyClick} charStates={guessedChars} />
		</main>
	);
}

export default App;
