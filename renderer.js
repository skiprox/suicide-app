// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
'use strict';

const {ipcRenderer} = require('electron');

class Renderer {
	constructor() {
		console.log('hello');
		this.overlay = document.getElementById('overlay');
		this.subheader = document.getElementById('suicide-subheader');
		this.buttonsContainer = document.getElementById('buttons-container');
		this.buttonLinks = [].slice.call(document.querySelectorAll('.button-link'));
		this.currentQuestion = 0;
		this.questions = [];
		this.onButtonClicked = this.onButtonClicked.bind(this);
		this.constructQuestions();
		this.addListeners();
		this.updateSubheaderText();
	}
	constructQuestions() {
		for (let i = 0; i < 5; i++) {
			let randomInt = Math.floor(Math.random() * 5) + 1;
			this.questions.push({
				number: i,
				randomInt: randomInt,
				message: `For YES, select ${randomInt}. For NO, select 0.`
			});
		}
	}
	addListeners() {
		let i = this.buttonLinks.length;
		while (i--) {
			this.buttonLinks[i].addEventListener('click', this.onButtonClicked);
		}
	}
	onButtonClicked(e) {
		e.preventDefault();
		let button = e.target;
		let number = parseInt(button.innerText, 10);
		this.checkAnswer(number);
	}
	checkAnswer(number) {
		this.overlay.style.display = 'flex';
		setTimeout(() => {
			this.overlay.style.opacity = 1;
		}, 100);
		setTimeout(() => {
			let question = this.questions[this.currentQuestion];
			if (number == question.randomInt) {
				this.incrementQuestion();
			} else {
				ipcRenderer.sendSync('exit', 'exit');
			}
		}, 500);
	}
	incrementQuestion() {
		if (this.currentQuestion < 4) {
			this.overlay.style.opacity = 0;
			this.currentQuestion++;
			this.updateSubheaderText();
			setTimeout(() => {
				this.overlay.style.display = 'none';
			}, 500);
		} else {
			setTimeout(() => {
				this.overlay.innerText = '5';
				setTimeout(() => {
					this.overlay.innerText = '4';
					setTimeout(() => {
						this.overlay.innerText = '3';
						setTimeout(() => {
							this.overlay.innerText = '2';
							setTimeout(() => {
								this.overlay.innerText = '1';
								setTimeout(() => {
									this.overlay.innerText = '0';
									ipcRenderer.sendSync('suicide', 'suicide');
								}, 1000);
							}, 1000);
						}, 1000);
					}, 1000);
				}, 1000);
			}, 1000);
		}
	}
	updateSubheaderText() {
		this.subheader.innerText = this.questions[this.currentQuestion].message;
	}
}

new Renderer();