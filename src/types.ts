export type GameState = 'progress' | 'won' | 'lost';
export type CharType = 'correct' | 'present' | 'absent';
export type CharStates = { [key: string]: CharType };
