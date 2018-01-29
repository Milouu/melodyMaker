// const notes = document.querySelectorAll('.note')

// class Melody {
// 	constructor(notes){

// 		this.notes = notes
// 	}

// 	randomNote() {

// 		this.randomAccess = Math.floor(Math.random() * this.notes.length)
// 		return this.notes[this.randomAccess]
// 	}
// 	play() {

// 		setInterval(() => {

// 			this.randomNote().play()

// 		}, 2000)
// 	}
// }

// const test = new Melody(notes)
// test.play()

const canvasVideo = new CanvasVideo(window.innerWidth, window.innerHeight)
canvasVideo.draw()

const trackingColor = new TrackingColor(160, 160, 130, canvasVideo)
trackingColor.findColor()

// const trackingColorTwo = new TrackingColor(103, 55, 161, testVideo)
// // trackingColorTwo.draw()
// trackingColorTwo.findColor()
