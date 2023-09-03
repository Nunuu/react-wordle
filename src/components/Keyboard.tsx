import { useId } from 'react';

import { KEYS } from '../constants';
import { CharStates } from '../types';

export function Keyboard({ onKeyClick, charStates }: { onKeyClick: (key: string) => void; charStates: CharStates }) {
	return (
		<section>
			{KEYS.map((row: Array<string>) => {
				return (
					<div className="keyboard-row" key={useId()}>
						{row.map((key) => {
							const buttonClassName = charStates[key] ? `guess ${charStates[key]}` : '';
							return (
								<button key={useId()} onClick={() => onKeyClick(key)} className={buttonClassName}>
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
