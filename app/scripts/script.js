const notes = document.querySelectorAll('.note')

class Melody {
	constructor(notes){

		this.notes = notes
	}

	randomNote() {

		this.randomAccess = Math.floor(Math.random() * this.notes.length)
		return this.notes[this.randomAccess]
	}
	play() {

		setInterval(() => {

			this.randomNote().play()

		}, 2000)
	}
}

const test = new Melody(notes)
test.play()