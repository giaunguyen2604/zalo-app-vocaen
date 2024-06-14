export interface CSVRow {
	vocab: string
    meaning: string
}

export interface QuestionItem {
	content: string;
	options?: string[];
    key: string
}