import { CSVRow, QuestionItem } from 'interfaces';
import _ from 'lodash';

// common
export function shuffle<T>(array: Array<T>): Array<T> {
	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex > 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}

	return array;
}

export const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

const randomKeyInOptions = (key: string, options: string[]): string[] => {
	if (options.length) {
		const index = Math.floor(Math.random() * 4);
		options.splice(index, 0, key);
	}
	return options;
};

const randomOptions = (rows: CSVRow[]): string[] => {
	const random = _.sampleSize(rows, 3);
	return random.map(i => i.meaning);
};

export const buildQuestionData = (
	rows: CSVRow[],
	item: CSVRow
): QuestionItem => {
	let options = randomOptions(rows);
	options = randomKeyInOptions(item.meaning, options);
	return { content: item.vocab, options: options, key: item.meaning };
};
