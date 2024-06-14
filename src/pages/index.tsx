import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Icon, Page, Text, useSnackbar } from 'zmp-ui';
import Papa from 'papaparse';
import { CSVRow, QuestionItem } from 'interfaces';
import { buildQuestionData, shuffle } from 'utils';
import TextTransition, { presets } from 'react-text-transition';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { CORRECT_SCORE_ANIMATE } from 'constant';
import LoadingOverlay from 'react-loading-overlay-ts';
import ConfettiExplosion from 'react-confetti-explosion';

const DATA_URL =
	'https://docs.google.com/spreadsheets/d/e/2PACX-1vTYOz6-NUSu6cKmSdiGumlCs0sgfPnaipbnnQwWEFTQAqOHGFPojbLPFrm91fS44vNUpR2jhk0iXuau/pub?output=csv';

const HomePage: React.FunctionComponent = () => {
	const [ready, setReady] = useState(false);
	const [indexQ, setIndexQ] = useState<number>(0);
	const [currentQ, setCurrentQ] = useState<QuestionItem>();
	const [selectedAnswer, setSelectedAnswer] = useState<string>();
	const snackbar = useSnackbar();
	const [vocabs, setVocabs] = useState<CSVRow[]>([]);
	const [score, setScore] = useState<number>(0);
	const [submitted, setSubmitted] = useState(false);

	useEffect(() => {
		Papa.parse<CSVRow>(DATA_URL, {
			download: true,
			header: true,

			complete: results => {
				let data = results.data as CSVRow[];
				const suffleData = shuffle<CSVRow>(data);
				snackbar.openSnackbar({
					duration: 3000,
					text: 'Load data successfully!',
					type: 'success',
				});

				setVocabs(suffleData || []);
				setReady(true);
			},
			error: () => {
				snackbar.openSnackbar({
					duration: 3000,
					text: 'Load data failed. Please try again!',
					type: 'error',
				});
				setReady(true);
			},
		});
	}, []);

	useEffect(() => {
		if (vocabs.length && indexQ < vocabs.length) {
			setCurrentQ(buildQuestionData(vocabs, vocabs[indexQ]));
		}
	}, [indexQ, vocabs]);

	const handleSubmit = () => {
		setSubmitted(true);
		let timeout = 3000;
		if (selectedAnswer === currentQ?.key) {
			setScore(score + 10);
			timeout = 1000;
		}

		setTimeout(() => {
			setIndexQ(indexQ + 1);
		}, timeout);
	};

	useEffect(() => {
		setSubmitted(false);
		setSelectedAnswer(undefined);
	}, [indexQ]);

	const handleStartOver = () => {
		setSubmitted(false);
		setSelectedAnswer(undefined);
		setVocabs(shuffle(vocabs));
		setScore(0);
		setIndexQ(0);
	};

	const getOptionVariant = (
		optionTxt: string
	): 'secondary' | 'primary' | 'tertiary' => {
		if (submitted) {
			if (optionTxt === selectedAnswer || optionTxt === currentQ?.key)
				return 'primary';
			return 'secondary';
		}

		return optionTxt === selectedAnswer ? 'primary' : 'secondary';
	};

	const getOptionType = (
		optionTxt: string
	): 'highlight' | 'danger' | 'neutral' => {
		if (submitted) {
			if (optionTxt === selectedAnswer && selectedAnswer !== currentQ?.key)
				return 'danger';
			return 'highlight';
		}
		return 'highlight';
	};

	const isLastQ = vocabs.length > 0 && indexQ === vocabs.length;
	const isCorrect = selectedAnswer && selectedAnswer === currentQ?.key;

	return (
		<LoadingOverlay active={!ready} spinner>
			<Page className='page'>
				<AnimatePresence>
					<LayoutGroup>
						{!isLastQ && (
							<motion.div layout='position'>
								<div className='section-container h-[52px]'>
									<TextTransition springConfig={presets.default}>
										{currentQ?.content}
									</TextTransition>
								</div>
								<div className='section-container'>
									<Grid columnSpace='1rem' rowSpace='1rem' columnCount={2}>
										{currentQ?.options?.map((option, index) => (
											<Button
												variant={getOptionVariant(option)}
												type={getOptionType(option)}
												key={option + index}
												onClick={() => setSelectedAnswer(option)}
											>
												{option}
											</Button>
										))}
									</Grid>
								</div>
							</motion.div>
						)}

						<motion.div layout='position'>
							<Box flex justifyContent='space-between'>
								<Button
									type='neutral'
									variant='secondary'
									disabled={!vocabs?.length || isLastQ}
									onClick={() => setIndexQ(indexQ + 1)}
								>
									Bỏ qua
								</Button>
								<Button
									variant='primary'
									disabled={!isLastQ && !selectedAnswer}
									onClick={isLastQ ? handleStartOver : handleSubmit}
									suffixIcon={<Icon icon='zi-arrow-right' />}
								>
									{isLastQ ? 'Bắt đầu lại' : 'Tiếp theo'}
								</Button>
							</Box>
							<Box
								flex
								flexDirection='column'
								justifyContent='center'
								alignItems='center'
								mt={4}
							>
								<TextTransition springConfig={presets.stiff}>
									{isLastQ ? 'Your final score' : 'Your score'}
								</TextTransition>
								<Box className='score relative pt-2 text-center'>
									<Text style={{ fontSize: '30px', marginTop: '10px' }} bold>
										<TextTransition springConfig={presets.wobbly}>
											{score}
										</TextTransition>
									</Text>
									{isLastQ && <ConfettiExplosion duration={2000} />}

									<AnimatePresence mode='popLayout'>
										{submitted && (
											<motion.div
												{...CORRECT_SCORE_ANIMATE}
												className={`absolute text-green-500 top-0 left-1 ${
													isCorrect ? 'text-green-500' : 'text-red-500 left-2'
												}`}
											>
												{isCorrect ? '+10' : '+0'}
											</motion.div>
										)}
									</AnimatePresence>
								</Box>
								{isLastQ && (
									<p className='text-[15px] mt-3'>
										Accuracy Rate:
										{' ' + ((score * 10) / vocabs.length).toFixed(1) + '%'}
									</p>
								)}
							</Box>
						</motion.div>
					</LayoutGroup>
				</AnimatePresence>
			</Page>
		</LoadingOverlay>
	);
};

export default HomePage;
