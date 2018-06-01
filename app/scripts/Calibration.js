class Calibration {
	constructor() {
		this.musicalCanvas = new MusicalCanvas()

		this.body = document.querySelector('body')
		this.addStick = document.querySelector('.pickedColors__addStick')
		// this.color1 = document.querySelector('.pickedColors__color1')
		// this.color2 = document.querySelector('.pickedColors__color2')
		// this.trashcan1 = this.color1.querySelector('.pickedColors__trashcan')
		// this.trashcan2 = this.color2.querySelector('.pickedColors__trashcan')
		this.video = document.querySelector('.calibration')

		this.eyeDropper = document.querySelector('.eyeDropper')
		this.eyeDropperCursor = document.querySelector('.eyeDropper__greyRing')
		this.eyeDropperColored = document.querySelector('.eyeDropper__coloredRing')

		this.colors = document.querySelectorAll('.pickedColors__color')
		this.stickNumbers = document.querySelectorAll('.pickedColors__stickNumber>p')
		this.colorsHitbox = document.querySelector('.pickedColors__hitbox')
		this.trashcans = document.querySelectorAll('.pickedColors__trashcan')
		this.explanations = document.querySelectorAll('.explanations__explanation')
		console.log(this.explanations)
		this.mouse = { x: 0, y: 0 }

    this.fillBar = document.querySelector('.explanations__fillBar')
    
		
		// Variables for calibration rings animations
		this.ringsDisplay = false
		this.calibrationRingContainers = document.querySelectorAll('.calibration__ringContainer')
    this.calibrationRings = document.querySelectorAll('.calibration__ring')
		this.calibratedRingNumber = 0
		this.validationRing = document.querySelector('.calibration__validationRing')
		this.successLogo = document.querySelector('.calibration__successTickContainer')
		this.successTick1 = document.querySelector('.calibration__successTick1')
		this.successTick2 = document.querySelector('.calibration__successTick2')

    //TweenMax Timeline for calibrationRings apparition/disapparition animation
    this.calibrationTL = new TimelineLite()
    this.calibrationTL.pause()
    this.calibrationTL.staggerFromTo(this.calibrationRings, 0.4, {scale: 0, opacity: 0}, {scale: 1.2, opacity: 1}, 0.6)
		this.calibrationTL.staggerTo(this.calibrationRings, 0.2, {scale: 1}, 0.6, '-=1.8')
		
		//Animation timeline for calibration calculation on a ring
		
		this.calibrationCalculationTL = new TimelineLite()
		this.calibrationCalculationTL.pause()
		this.calibrationCalculationTL.to(this.validationRing, 0.3, {scale: 1.2, opacity: 1})
		this.calibrationCalculationTL.to(this.validationRing, 1, {strokeDashoffset: 230})
		this.calibrationCalculationTL.to(this.calibrationRings[this.calibratedRingNumber], 0.3, {backgroundColor: "#5469FE"})
		this.calibrationCalculationTL.from(this.successTick1, 0.1, {scale: 0}, '-=0.1')
		this.calibrationCalculationTL.from(this.successTick2, 0.1, {scale: 0})

		//Timeline for animation on successful calibration on a ring
		this.calibrationSuccessTL = new TimelineLite()
		this.calibrationSuccessTL.pause()
		this.calibrationSuccessTL.to(this.calibrationRings[this.calibratedRingNumber], 0.3, {backgroundColor: "#5469FE"})
		this.calibrationSuccessTL.from(this.successTick1, 0.15, {scale: 0})
		this.calibrationSuccessTL.from(this.successTick2, 0.15, {scale: 0})

		// Testing animation 
		this.calibrationRingContainers[this.calibratedRingNumber].addEventListener('mouseenter', () => { 
			this.calibrationCalculationTL.timeScale(1)
			this.calibrationCalculationTL.play() 

			// this.calibrationSuccessTL.play()
		})
		this.calibrationRingContainers[0].addEventListener('mouseleave', () => { 
			this.calibrationCalculationTL.timeScale(2)
			this.calibrationCalculationTL.reverse()
			
			// this.calibrationSuccessTL.reverse()
		})

		// Click active on addStick
		this.addStickActive = true

		// Eye dropper status
		this.eyeDropperActive = false

		// Click active on addStick
		this.drumStickOneCalibrated = false

		// Step number
		this.step = 1

		this.addStick.addEventListener('click', () => {
			this.fillBar.classList.add('explanations__fillBar--step2')
			this.addStickActive ? this.musicalCanvas.activateEyedropper() : false
			this.addStickActive ? this.flash(this.addStick) : false
			this.addStickActive ? this.addColor() : false
			// this.addStickActive ? this.eyeDropperActive = true : false
		})

		// Trashcan events
		for (const trashcan of this.trashcans) {
			// Launch removeColor() on click
			trashcan.addEventListener('click', () => { this.removeColor(trashcan) })

			// Set eyeDropper style when mouseneter and mouseleave on trashcan
			// trashcan.addEventListener('mouseenter', () => 
			// { 
			//   this.eyeDropperCursor.classList.add('eyeDropper--delete')
			//   trashcan.addEventListener('mouseleave', () => 
			//   {
			//     this.eyeDropperCursor.classList.remove('eyeDropper--delete')
			//   })
			// })
		}

		// Set eyeDropper style when mouseneter and mouseleave on color cards.
		for (let i = 0; i < this.colors.length; i++) {
			this.colors[i].addEventListener('mouseenter', () => {
				this.eyeDropperCursor.classList.add('eyeDropper--delete')

				this.colors[i].addEventListener('mouseleave', () => {
					this.eyeDropperCursor.classList.remove('eyeDropper--delete')
				})
			})
			this.colors[i].addEventListener('click', () => {
        this.flash(this.colors[i])

        // for(const calibrationRing of this.calibrationRings)
        // {
        //   calibrationRing.classList.add('calibration__ring--deactivate')
        //   calibrationRing.classList.remove('calibration__ring--activate')
        // }
        this.deactivateCalibrationRings()
			})
			this.colors[i].addEventListener('click', () => {
				!this.eyeDropperActive ? this.musicalCanvas.activateEyedropper() : false
				!this.eyeDropperActive ? this.eyeDropperInit() : false
				!this.eyeDropperActive ? this.colors[i].style.background = '#ccc' : false
				!this.eyeDropperActive ? this.colors[i].classList.add('pickedColors__color--undropped') : false			})
		}

		// Delete eyeDropper style between colors
		this.colorsHitbox.addEventListener('mouseenter', () => {
			this.eyeDropperCursor.classList.add('eyeDropper--delete')

			this.colorsHitbox.addEventListener('mouseleave', () => {
				this.eyeDropperCursor.classList.remove('eyeDropper--delete')
			})
		})

		this.addStick.addEventListener('mouseenter', () => {
			this.eyeDropperCursor.classList.add('eyeDropper--delete')

			this.addStick.addEventListener('mouseleave', () => {
				this.eyeDropperCursor.classList.remove('eyeDropper--delete')
			})
		})


		// Color dropped
		this.video.addEventListener('click', () => {
			if (!this.addStickActive) {
				this.fillBar.classList.add('explanations__fillBar--step3')
        // this.eyeDropperActive ? this.musicalCanvas.activateEyedropper() : false
        
				this.eyeDropperColored.classList.add('eyeDropper__coloredRing--dropped')
        this.eyeDropper.classList.add('eyeDropper--dropped')
        
        setTimeout(() => { this.body.classList.remove('cursor--undisplay') }, 300)
        
				this.colors[0].classList.remove('pickedColors__color--undropped')
        this.colors[0].classList.add('pickedColors__color--dropped')
        
				this.explanations[1].classList.remove('explanations__explanation--current')
        this.explanations[2].classList.add('explanations__explanation--current')
        
        this.step = 3
        
				this.eyeDropperActive = false

        // this.addStickActive = true
        // for(const calibrationRing of this.calibrationRings)
        // {
        //   calibrationRing.classList.remove('calibration__ring--deactivate')
        //   calibrationRing.classList.add('calibration__ring--activate')
        // }
        this.activateCalibrationRings()
			}
		})

		this.setMouse()

		// this.eyeDropperInit()
	}
	
	calibrate()
	{
		if(this.ringsDisplay === true)
		{
			requestAnimationFrame(this.calibrate.bind(this))
			const ringLeftInCanvas = (this.musicalCanvas.canvas.offsetWidth * this.calibrationRingContainers[0].offsetLeft) / this.musicalCanvas.video.offsetWidth
			const ringWidthInCanvas = (this.musicalCanvas.canvas.offsetWidth * this.calibrationRingContainers[0].offsetWidth) / this.musicalCanvas.video.offsetWidth
			const ringTopInCanvas = (this.musicalCanvas.canvas.offsetHeight * this.calibrationRingContainers[0].offsetTop) / this.musicalCanvas.video.offsetHeight
			const ringHeightInCanvas = (this.musicalCanvas.canvas.offsetHeight * this.calibrationRingContainers[0].offsetHeight) / this.musicalCanvas.video.offsetHeight
	
			// console.log('RL: ' + ringLeftInCanvas)
			// console.log('RW: ' + ringWidthInCanvas)
			// console.log('HBX: ' + this.musicalCanvas.mainHitboxPosition.x)
			// console.log(this.calibrationRingContainers[0].offsetWidth)
			// console.log('RT: ' + ringTopInCanvas)
			// console.log('RH: ' + ringHeightInCanvas)
			// console.log('HBY: ' + this.musicalCanvas.mainHitboxPosition.y)
			// console.log('')

			if((this.musicalCanvas.mainHitboxPosition.x  > ringLeftInCanvas && this.musicalCanvas.mainHitboxPosition.x < ringLeftInCanvas + ringWidthInCanvas) &&
			this.musicalCanvas.mainHitboxPosition.y > ringTopInCanvas && this.musicalCanvas.mainHitboxPosition.y < ringTopInCanvas + ringHeightInCanvas )
			{
				this.calibrationCalculationTL.play()
			}
			else
			{
				this.calibrationCalculationTL.reverse()
			}
		}
	}
  
  activateCalibrationRings()
  {
    this.calibrationTL.timeScale(1)
		this.calibrationTL.play()
		this.ringsDisplay = true
		this.calibrate()
  }

  deactivateCalibrationRings()
  {
    this.calibrationTL.timeScale(2)
		this.calibrationTL.reverse()
		this.ringsDisplay = false
  }

	addColor() {
		this.eyeDropperInit()
		if (!this.addStick.classList.contains('pickedColors__addStick--oneColor')) {
			this.colors[0].classList.add('pickedColors__color--undropped')
			this.addStick.classList.add('pickedColors__addStick--oneColor')
			this.addStick.classList.add('pickedColors__addStick--disabled')

			this.colorsHitbox.style.cursor = 'no-drop'
			this.addStickActive = false

			// Display step2 on click to addStick
			this.step < 2 ? this.explanations[0].classList.remove('explanations__explanation--current') : false
			this.step < 2 ? this.explanations[1].classList.add('explanations__explanation--current') : false
		}
		else if (this.addStick.classList.contains('pickedColors__addStick--oneColor') && this.colors[1].classList.contains('pickedColors__color--secondIsFirst')) {
			this.colors[0].classList.add('pickedColors__color--undropped')
			this.addStick.classList.add('pickedColors__addStick--twoColor')
		}
		else {
			this.colors[1].classList.add('pickedColors__color--undropped')
			this.addStick.classList.add('pickedColors__addStick--twoColor')
		}
	}

	removeColor(trashcan) {
    console.log(this.colors[1].classList.contains('pickedColors__color--undropped'))
    
    // for(const calibrationRing of this.calibrationRings)
    // {
    //   calibrationRing.classList.add('calibration__ring--deactivate')
    //   calibrationRing.classList.remove('calibration__ring--activate')
    // }
    this.deactivateCalibrationRings()

		if (trashcan === this.trashcans[0]) {
			this.colors[0].classList.remove('pickedColors__color--undropped')
			this.colors[0].classList.remove('pickedColors__color--dropped')
			this.colors[0].style.background = '#ccc'

			if (this.colors[1].classList.contains('pickedColors__color--undropped') && !this.colors[1].classList.contains('pickedColors__color--secondIsFirst')) {
				this.addStick.classList.remove('pickedColors__addStick--twoColor')
				this.colors[0].classList.add('pickedColors__color--firstIsSecond')
				this.colors[1].classList.add('pickedColors__color--secondIsFirst')
				this.stickNumbers[0].innerHTML = "Drum Stick 2"
				this.stickNumbers[1].innerHTML = "Drum Stick 1"
			}
			else if (this.colors[1].classList.contains('pickedColors__color--undropped') && this.colors[1].classList.contains('pickedColors__color--secondIsFirst')) {
				this.addStick.classList.remove('pickedColors__addStick--twoColor')
			}
			else {
				this.addStick.classList.remove('pickedColors__addStick--oneColor')
				this.addStick.classList.remove('pickedColors__addStick--disabled')
				this.colorsHitbox.style.cursor = 'none'
				this.addStickActive = true
			}
		}
		else if (trashcan === this.trashcans[1]) {
			this.colors[1].classList.remove('pickedColors__color--undropped')
			this.colors[1].classList.remove('pickedColors__color--dropped')
			this.colors[1].style.background = '#ccc'

			if (this.colors[1].classList.contains('pickedColors__color--secondIsFirst') && !this.colors[0].classList.contains('pickedColors__color--undropped')) {
				this.addStick.classList.remove('pickedColors__addStick--oneColor')
				this.colors[0].classList.remove('pickedColors__color--firstIsSecond')
				this.colors[1].classList.remove('pickedColors__color--secondIsFirst')
				this.stickNumbers[0].innerHTML = "Drum Stick 1"
				this.stickNumbers[1].innerHTML = "Drum Stick 2"
				this.colorsHitbox.style.cursor = 'pointer'
			}
			else if (this.colors[1].classList.contains('pickedColors__color--secondIsFirst') && this.colors[0].classList.contains('pickedColors__color--undropped')) {
				this.addStick.classList.remove('pickedColors__addStick--twoColor')
				this.colors[0].classList.remove('pickedColors__color--firstIsSecond')
				this.colors[1].classList.remove('pickedColors__color--secondIsFirst')
				this.stickNumbers[0].innerHTML = "Drum Stick 1"
				this.stickNumbers[1].innerHTML = "Drum Stick 2"
			}
			else {
				this.addStick.classList.remove('pickedColors__addStick--twoColor')
			}
		}
	}

	setMouse() {
		window.addEventListener('mousemove', (event) => {
			this.mouse.x = event.clientX
			this.mouse.y = event.clientY

			this.eyeDropperMove()
		})
	}
	eyeDropperInit() {
		const body = document.querySelector('body')

		body.classList.add('cursor--undisplay')
		// body.style.cursor = 'none'

		this.eyeDropper.classList.remove('eyeDropper--dropped') // ???
		this.eyeDropperCursor.classList.add('eyeDropper--transparent')
		this.eyeDropperColored.classList.remove('eyeDropper__coloredRing--dropped')

		this.eyeDropperMove()

		this.video.addEventListener('mouseenter', () => {
			// console.log('opacity 1')
			// this.eyeDropperCursor.style.opacity = '1'
			this.eyeDropperCursor.classList.remove('eyeDropper--transparent')
			this.eyeDropperCursor.classList.add('eyeDropper--display')
			this.video.addEventListener('mouseleave', () => {
				this.eyeDropperCursor.classList.remove('eyeDropper--display')
				this.eyeDropperCursor.classList.add('eyeDropper--transparent')
				// this.eyeDropperCursor.style.opacity = '0.2'
			})
		})
	}
	eyeDropperMove() {
		this.eyeDropper.style.transform = `translate(${this.mouse.x - (this.eyeDropper.offsetWidth / 2)}px, ${this.mouse.y - (this.eyeDropper.offsetHeight / 2)}px) scale(1)`
	}
	eyeDropperRemove() {
		eyeDropper.style.opacity = '0'
	}
	flash(container) {
		console.log('toggle')
		const $expenders = []
		const $expender = document.createElement('div')

		$expender.classList.add('pickedColors__flash')
		$expender.classList.add('pickedColors__color--flash')
		container.appendChild($expender)
		$expenders.push($expender)

		for (const $expender of $expenders) { setTimeout(() => { $expender.remove() }, 500) }
	}
}
// new Calibration()