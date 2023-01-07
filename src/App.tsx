import {useCallback, useEffect, useState} from 'react';
import {HangmanDrawing} from './HangmanDrawing';
import {HangmanWord} from './HangmanWord';
import {Keyboard} from './Keyboard/Keyboard';
import words from './wordList.json';

function getWord() {
	return words[Math.floor(Math.random() * words.length)];
}

function App() {
	const [wordToGuess, setwordToGuess] = useState(getWord());

	const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

	const inCorrectLetters = guessedLetters.filter(
		letter => !wordToGuess.includes(letter)
	);

	const isLoser = inCorrectLetters.length >= 6;
	const isWinner = wordToGuess
		.split('')
		.every(letter => guessedLetters.includes(letter));

	const addGuessedLetter = useCallback(
		(letter: string) => {
			if (guessedLetters.includes(letter) || isWinner || isLoser) return;

			setGuessedLetters(currentLetters => [...currentLetters, letter]);
		},
		[guessedLetters, isWinner, isLoser]
	);
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			const key = e.key;

			if (!key.match(/^[a-z]$/)) return;

			e.preventDefault();
			addGuessedLetter(key);
		};
		document.addEventListener('keypress', handler);

		return () => {
			document.removeEventListener('keypress', handler);
		};
	}, [guessedLetters]);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			const key = e.key;

			if (key !== 'Enter') return;

			e.preventDefault();
			setGuessedLetters([]);
			setwordToGuess(getWord());
		};
		document.addEventListener('keypress', handler);

		return () => {
			document.removeEventListener('keypress', handler);
		};
	}, []);

	return (
		<div
			style={{
				maxWidth: '800px',
				display: 'flex',
				flexDirection: 'column',
				gap: '2rem',
				margin: '0 auto',
				alignItems: 'center',
			}}
		>
			<div style={{fontSize: '2rem', textAlign: 'center'}}>
				{isWinner && 'Winner! Refresh to try again'}
				{isLoser && 'Nice try! Refresh to try again'}
			</div>
			<HangmanDrawing numberOfGuesses={inCorrectLetters.length} />
			<HangmanWord
				reveal={isLoser}
				guessedLetters={guessedLetters}
				wordToGuess={wordToGuess}
			/>
			<div style={{alignSelf: 'stretch'}}>
				<Keyboard
					activeLetters={guessedLetters.filter(letter =>
						wordToGuess.includes(letter)
					)}
					inactiveLetters={inCorrectLetters}
					addGuessedLetter={addGuessedLetter}
					disabled={isWinner || isLoser}
				/>
			</div>
		</div>
	);
}

export default App;
