import { useId, useMemo } from 'react';

import { MAX_LETTERS } from '../constants';

export interface RowProps {
	word: string;
	answer?: string;
	check?: boolean;
}

export function Row({ word, answer, check }: RowProps) {
	const id = useId();

	const rows = useMemo(() => {
		const letters = word.split('');
		return Array.from({ length: MAX_LETTERS }, (_, i) => {
			const currentLetter = letters[i];
			const extraClasses = ['letter'];
			if (check && answer) {
				extraClasses.push('guess');
				if (answer[i] === currentLetter) {
					extraClasses.push('correct');
				} else if (answer.includes(currentLetter)) {
					extraClasses.push('present');
				} else {
					extraClasses.push('absent');
				}
			}
			extraClasses.push(letters[i] ? 'filled' : '');

			return (
				<div key={`${id}-${i}`} className={extraClasses.join(' ')}>
					{letters[i]}
				</div>
			);
		});
	}, [word, answer, check]);

	return <div className="row">{rows}</div>;
}
