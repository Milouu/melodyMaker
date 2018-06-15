class Calibration {
	constructor() {
		/**
		 * Object Instanciations
		 */
		this.musicalCanvas = new MusicalCanvas()

		/**
		 * DOM Elements & Variables
		 */
		this.body = document.querySelector('body')
		this.addStick = this.body.querySelector('.pickedColors__addStick')
		this.videoContainer = this.body.querySelector('.calibration')

		this.eyeDropper = this.body.querySelector('.eyeDropper')
		this.eyeDropperCursor = this.eyeDropper.querySelector('.eyeDropper__greyRing')
		this.eyeDropperColored = this.eyeDropperCursor.querySelector('.eyeDropper__coloredRing')
		this.eyeDropperSquare = this.eyeDropperColored.querySelector('.eyeDropper__square')

		this.colors = this.body.querySelectorAll('.pickedColors__color')
		this.stickNumbers = this.body.querySelectorAll('.pickedColors__stickNumber>p')
		this.colorsHitbox = this.body.querySelector('.pickedColors__hitbox')
		this.trashcans = this.body.querySelectorAll('.pickedColors__trashcan')
		this.explanations = this.body.querySelectorAll('.explanations__explanation')
		this.fillBar = this.body.querySelector('.explanations__fillBar')
		
		this.mouse = { x: 0, y: 0 }

		// Click active on addStick
		this.addStickActive = true

		// Eye dropper status
		this.eyeDropperActive = false

		// Click active on addStick
		this.drumStickOneCalibrated = false

		// Step number
		this.step = 1
		
		// Variables for calibration rings animations
		this.ringsDisplay = false
		this.calibratedRings = [false, false, false, false]
		this.calibrationSuccessful = false
		this.firstColorCalibrated = false
		this.secondColorCalibrated = false
		this.calibratedRingNumber = 0
		this.calibrationRingContainers = this.videoContainer.querySelectorAll('.calibration__ringContainer')
		this.calibrationRings = this.videoContainer.querySelectorAll('.calibration__ring')
		this.validationRings = this.videoContainer.querySelectorAll('.calibration__validationRing')
		this.successTicks1 = this.videoContainer.querySelectorAll('.calibration__successTick1')
		this.successTicks2 = this.videoContainer.querySelectorAll('.calibration__successTick2')
		this.successTxt = this.videoContainer.querySelector('.calibration__successTxt')
		this.whiteCircle = this.videoContainer.querySelector('.calibration__whiteCircle')
		this.transitionRing = this.whiteCircle.querySelector('.calibration__transitionRing')
		this.newViewButton = document.querySelector('.newViewButton')

		this.posStickX = 0
		this.posStickY = 0
		this.stickCursor = document.querySelector('.stickCursor')

		/**
		 * TweenMax Timelines
		 */

		//TweenMax Timeline for calibrationRings apparition/disapparition animation
		this.calibrationTL = new TimelineLite({paused: true})
		this.calibrationTL
			.staggerFromTo(this.calibrationRings, 0.4, {scale: 0, opacity: 0}, {scale: 1.2, opacity: 1}, 0.6)
			.staggerTo(this.calibrationRings, 0.2, {scale: 1}, 0.6, '-=1.8')
		
		//Animation timeline for calibration calculation on a ring
		this.calibrationCalculationTLs = [
			this.calibrationCalculationTLGenerator(0),
			this.calibrationCalculationTLGenerator(1),
			this.calibrationCalculationTLGenerator(2),
			this.calibrationCalculationTLGenerator(3),
		]

		// Animation timeline on calibration success
		this.calibrationSuccessTL = new TimelineLite({paused: true, onComplete: this.checkGoToDashboardWithStick, onCompleteScope: this})
		this.calibrationSuccessTL
			.to(this.successTxt, 0.3, {opacity: 1}, '+= 1')
			.fromTo(this.whiteCircle, 0.3, {scale: 0, opacity: 0}, {scale: 1.2, opacity: 1}, '+=0.5')
			.to(this.whiteCircle, 0.1, {scale: 1})
			.fromTo(this.transitionRing, 0.3, {scale: 0, opacity: 0}, {scale: 1.2, opacity: 1})
			.to(this.transitionRing, 0.1, {scale: 1})

		// Animation timeline for the transition button leading to the dashboard page
		this.toDashboardTL = new TimelineLite({paused: true})
		this.toDashboardTL
			.to(this.transitionRing, 0.3, {scale: 1.8})
			.to(this.transitionRing, 1, {strokeDashoffset: 230, onComplete: this.goToDashboard, onCompleteScope: this}, '+=0.5')
			.to(this.whiteCircle, 0.3, {backgroundColor: '#5469FE'})

			// Testing
		let i = 0
		document.addEventListener('keydown', () =>{ 
			//spacebar
			if (event.keyCode == 32) {
				this.calibrationSuccessTL.play()
				this.calibrationSuccessful = true
			}
			// F
			if((event.keyCode == 70) && (i<4)) {
				this.calibrationCalculationTLs[i].play()
				this.calibratedRings[i++] = true
			}	
			else if(i == 4) i = 0

			if(event.keyCode == 69){
				this.toDashboardTL.play({onComplete: console.log('lol')})
			}
		})

		/**
		 * Event Listeners
		*/

		// Click event on add stick button
		this.addStick.addEventListener('click', () => {
			this.fillBar.classList.add('explanations__fillBar--step2')
			this.addStickActive ? this.flash(this.addStick) : false
			this.addStickActive ? this.addColor() : false
      
			if(this.calibrationSuccessful === true) 
			{
				this.calibrationSuccessful = false

				this.calibrationSuccessTL.timeScale(2)
				this.calibrationSuccessTL.reverse()
			}
		})

		// Click events on trashcans in color cards
		for (const trashcan of this.trashcans) {
			// Launch removeColor() on click
			trashcan.addEventListener('click', () => { 
				event.stopPropagation()
				this.removeColor(trashcan) 
			})
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
				this.deactivateCalibrationRings()

				this.calibrationSuccessTL.timeScale(2)
				this.calibrationSuccessTL.reverse()
				this.calibrationSuccessful = false

				this.addStickActive = false
				this.addStick.classList.add('pickedColors__addStick--disabled')

				!this.eyeDropperActive ? this.eyeDropperInit() : false
				!this.eyeDropperActive ? this.colors[i].classList.add('pickedColors__color--undropped') : false			
			})
		}

		// Color dropped in video with click event
		this.videoContainer.addEventListener('click', () => {
			if (!this.addStickActive) {
				this.step = 3
				this.fillBar.classList.add('explanations__fillBar--step3')

				this.explanations[1].classList.remove('explanations__explanation--current')
				this.explanations[2].classList.add('explanations__explanation--current')
        
				this.eyeDropperColored.classList.add('eyeDropper__coloredRing--dropped')
				this.eyeDropper.classList.add('eyeDropper--dropped')

				this.stickCursor.style.opacity = 0.5
        
       
				if(this.colors[0].classList.contains('pickedColors__color--undropped'))
				{
					this.musicalCanvas.pickColorFromDisplay(event.clientX - this.videoContainer.offsetLeft - this.musicalCanvas.video.offsetLeft, event.clientY - this.videoContainer.offsetTop - this.musicalCanvas.video.offsetTop, this.colors[0])
         
					this.colors[0].classList.remove('pickedColors__color--undropped')
					this.colors[0].classList.add('pickedColors__color--dropped')
				}
				else if(this.colors[1].classList.contains('pickedColors__color--undropped'))
				{
					this.musicalCanvas.pickColorFromDisplay(event.clientX - this.videoContainer.offsetLeft - this.musicalCanvas.video.offsetLeft, event.clientY - this.videoContainer.offsetTop - this.musicalCanvas.video.offsetTop, this.colors[1])

					this.colors[1].classList.remove('pickedColors__color--undropped')
					this.colors[1].classList.add('pickedColors__color--dropped')
				} 
        
				this.eyeDropperActive = false
				setTimeout(() => { this.body.classList.remove('cursor--undisplay') }, 300)

				this.activateCalibrationRings()

			}
		})

		this.videoContainer.addEventListener('mouseenter', () => {
			this.musicalCanvas.videoHover = true
		})
		this.videoContainer.addEventListener('mouseleave', () => {
			this.musicalCanvas.videoHover = false
		})

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



		/**
		 * Methods launched
		 */

		this.setMouse()
    
		this.musicalCanvas.setEyedropperVariables(this.videoContainer, this.eyeDropperColored, this.eyeDropperSquare)

		this.stickPosUpdate()
	}
  
	/**
   * Monitors calibration once calibration rings are displayed and stops when calibration is successful
   */
	calibrate()
	{
		if(this.ringsDisplay === true)
		{
			requestAnimationFrame(this.calibrate.bind(this))
		
			if(this.calibrationSuccessful !== true)
			{
				for(let index of this.calibrationRingContainers.keys())
				{
					this.calibratedRingNumber = index
		
					const ringLeftInCanvas = (this.musicalCanvas.canvas.offsetWidth * this.calibrationRingContainers[index].offsetLeft) / this.musicalCanvas.video.offsetWidth
					const ringWidthInCanvas = (this.musicalCanvas.canvas.offsetWidth * this.calibrationRingContainers[index].offsetWidth) / this.musicalCanvas.video.offsetWidth
					const ringTopInCanvas = (this.musicalCanvas.canvas.offsetHeight * this.calibrationRingContainers[index].offsetTop) / this.musicalCanvas.video.offsetHeight
					const ringHeightInCanvas = (this.musicalCanvas.canvas.offsetHeight * this.calibrationRingContainers[index].offsetHeight) / this.musicalCanvas.video.offsetHeight
		
					if((this.musicalCanvas.mainHitboxPosition.x  > ringLeftInCanvas && this.musicalCanvas.mainHitboxPosition.x < ringLeftInCanvas + ringWidthInCanvas) &&
					this.musicalCanvas.mainHitboxPosition.y > ringTopInCanvas && this.musicalCanvas.mainHitboxPosition.y < ringTopInCanvas + ringHeightInCanvas )
					{
						this.calibrationCalculationTLs[this.calibratedRingNumber].timeScale(1)
						this.calibrationCalculationTLs[this.calibratedRingNumber].play()
					}
					else
					{
						if(this.calibratedRings[index] === false)
						{
							this.calibrationCalculationTLs[this.calibratedRingNumber].timeScale(2)
							this.calibrationCalculationTLs[this.calibratedRingNumber].reverse()
						}
					}
				}
			}
			else 
			{
				this.deactivateCalibrationRings()
				this.calibrationSuccessTL.timeScale(1)
				this.calibrationSuccessTL.play()

				this.addStick.classList.remove('pickedColors__addStick--disabled')
				this.addStickActive = true
        
				if(this.colors[0].classList.contains('pickedColors__color--dropped'))
				{
					this.colors[0].classList.remove('pickedColors__color--dropped')
					this.colors[0].classList.add('pickedColors__color--calibrated')
					this.firstColorCalibrated = true
				}
				else if(this.colors[1].classList.contains('pickedColors__color--dropped'))
				{
					this.colors[1].classList.remove('pickedColors__color--dropped')
					this.colors[1].classList.add('pickedColors__color--calibrated')
					this.secondColorCalibrated = true
				}
			}
		}
	}

	getPickedColor()
	{
		return this.musicalCanvas.pickedColor
	}

	/**
   * Creates GSAP timelines for each calibration ring
   * @param {Number of the calibration ring} index 
   */
	calibrationCalculationTLGenerator(index)
	{
		let calibrationCalculationTL = new TimelineLite({paused: true})
		calibrationCalculationTL.to(this.validationRings[index], 0.3, {scale: 1.2, opacity: 1})
		calibrationCalculationTL.to(this.validationRings[index], 1, {strokeDashoffset: 230, onComplete : this.validateCalibration, onCompleteParams: [index], onCompleteScope: this})
		calibrationCalculationTL.to(this.calibrationRings[index], 0.3, {backgroundColor: '#5469FE'})
		calibrationCalculationTL.from(this.successTicks1[index], 0.1, {scale: 0}, '-=0.1')
		calibrationCalculationTL.from(this.successTicks2[index], 0.1, {scale: 0})

		return calibrationCalculationTL
	}

	/**
   * Monitors which rings has been successfully calibrated
   * @param {Number of the calibration ring} ringIndex 
   */
	validateCalibration(ringIndex)
	{
		this.calibratedRings[ringIndex] = true
		
		let countRings = 0
		while(countRings < this.calibratedRings.length)
		{
			if(this.calibratedRings[countRings] !== true)
			{
				break
			}
			else
			{
				countRings++
			}
		}
		if(countRings === 4)
		{
			this.calibrationSuccessful = true
			console.log(this.calibrationSuccessful)
		}
	}
  
	/**
   * Makes calibration rings appear
   */
	activateCalibrationRings()
	{
		this.calibrationTL.timeScale(1)
		this.calibrationTL.play()
		this.ringsDisplay = true
		this.calibrate()
	}

	/**
   * Makes calibration rings disappear
   */
	deactivateCalibrationRings()
	{
		this.calibrationTL.timeScale(2)
		this.calibrationTL.reverse()
		for(const calibrationCalculationTL of this.calibrationCalculationTLs)
		{
			calibrationCalculationTL.pause(0, true)
      
			// calibrationCalculationTL.restart()
			// calibrationCalculationTL.pause()
      
			// calibrationCalculationTL.reverse()
		}
		// this.calibrationSuccessful = false
		this.ringsDisplay = false
		this.calibratedRings = [false, false, false, false]
	}

	/**
   * Add a color card
   */
	addColor() 
	{
		this.eyeDropperInit()

		this.addStickActive = false
		this.colorsHitbox.style.cursor = 'no-drop'

		if (!this.addStick.classList.contains('pickedColors__addStick--oneColor')) {
			this.colors[0].classList.add('pickedColors__color--undropped')
			this.addStick.classList.add('pickedColors__addStick--oneColor')
			this.addStick.classList.add('pickedColors__addStick--disabled')

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

	/**
   * Removes color card when its trashcan is clicked
   * @param {The trashcan's color card number} trashcan 
   */
	removeColor(trashcan) 
	{
		this.deactivateCalibrationRings()

		if (trashcan === this.trashcans[0]) 
		{
			// Reset color block when removed
			this.colors[0].classList.remove('pickedColors__color--undropped')
			this.colors[0].classList.remove('pickedColors__color--dropped')
			this.colors[0].classList.remove('pickedColors__color--calibrated')
			this.firstColorCalibrated = false
		

			if ((this.colors[1].classList.contains('pickedColors__color--undropped') || this.colors[1].classList.contains('pickedColors__color--calibrated')) && !this.colors[1].classList.contains('pickedColors__color--secondIsFirst')) 
			{
				console.log('WE ARE HERE BOIS')
				this.addStick.classList.remove('pickedColors__addStick--twoColor')
				this.colors[0].classList.add('pickedColors__color--firstIsSecond')
				this.colors[1].classList.add('pickedColors__color--secondIsFirst')
				this.stickNumbers[0].innerHTML = 'Drum Stick 2'
				this.stickNumbers[1].innerHTML = 'Drum Stick 1'
			}
			else if ((this.colors[1].classList.contains('pickedColors__color--undropped') || this.colors[1].classList.contains('pickedColors__color--calibrated')) && this.colors[1].classList.contains('pickedColors__color--secondIsFirst')) 
			{
				this.addStick.classList.remove('pickedColors__addStick--twoColor')
			}
			else 
			{
				this.addStick.classList.remove('pickedColors__addStick--oneColor')
				this.addStick.classList.remove('pickedColors__addStick--disabled')
				this.colorsHitbox.style.cursor = 'none'
				this.addStickActive = true
			}
		}
		else if (trashcan === this.trashcans[1]) 
		{
			// Reset color block when removed
			this.colors[1].classList.remove('pickedColors__color--undropped')
			this.colors[1].classList.remove('pickedColors__color--dropped')
			this.colors[1].classList.remove('pickedColors__color--calibrated')
			this.secondColorCalibrated = false

			if (this.colors[1].classList.contains('pickedColors__color--secondIsFirst') && !(this.colors[0].classList.contains('pickedColors__color--undropped') || this.colors[0].classList.contains('pickedColors__color--calibrated'))) 
			{
				this.addStick.classList.remove('pickedColors__addStick--oneColor')
				this.colors[0].classList.remove('pickedColors__color--firstIsSecond')
				this.colors[1].classList.remove('pickedColors__color--secondIsFirst')
				this.stickNumbers[0].innerHTML = 'Drum Stick 1'
				this.stickNumbers[1].innerHTML = 'Drum Stick 2'
				this.colorsHitbox.style.cursor = 'pointer'
			}
			else if (this.colors[1].classList.contains('pickedColors__color--secondIsFirst') && (this.colors[0].classList.contains('pickedColors__color--undropped') || this.colors[0].classList.contains('pickedColors__color--calibrated'))) 
			{
				this.addStick.classList.remove('pickedColors__addStick--twoColor')
				this.colors[0].classList.remove('pickedColors__color--firstIsSecond')
				this.colors[1].classList.remove('pickedColors__color--secondIsFirst')
				this.stickNumbers[0].innerHTML = 'Drum Stick 1'
				this.stickNumbers[1].innerHTML = 'Drum Stick 2'
			}
			else 
			{
				this.addStick.classList.remove('pickedColors__addStick--twoColor')
			}
		}
    
		if(this.calibrationSuccessful === true && this.firstColorCalibrated === false && this.secondColorCalibrated === false)
		{
			this.calibrationSuccessTL.timeScale(2)
			this.calibrationSuccessTL.reverse()
			this.calibrationSuccessful = false
		}
		else if(this.calibrationSuccessful == false && (this.firstColorCalibrated === true || this.secondColorCalibrated === true))
		{
			this.calibrationSuccessTL.timeScale(1)
			this.calibrationSuccessTL.play()
			this.calibrationSuccessful = true
		}
	}

	/**
   * Records mouse position for the eyedropper movements
   */
	setMouse() 
	{
		window.addEventListener('mousemove', (event) => {
			this.mouse.x = event.clientX
			this.mouse.y = event.clientY

			this.eyeDropperMove()
		})
	}

	/**
   * Initialiazes eyeDropper
   */
	eyeDropperInit() 
	{
		const body = document.querySelector('body')

		body.classList.add('cursor--undisplay')

		this.eyeDropper.classList.remove('eyeDropper--dropped') // ???
		this.eyeDropperCursor.classList.add('eyeDropper--transparent')
		this.eyeDropperColored.classList.remove('eyeDropper__coloredRing--dropped')

		this.eyeDropperMove()

		this.videoContainer.addEventListener('mouseenter', () => {
			this.eyeDropperCursor.classList.remove('eyeDropper--transparent')
			this.eyeDropperCursor.classList.add('eyeDropper--display')
			this.videoContainer.addEventListener('mouseleave', () => {
				this.eyeDropperCursor.classList.remove('eyeDropper--display')
				this.eyeDropperCursor.classList.add('eyeDropper--transparent')
			})
		})
	}

	/**
   * Controls eyedropper movements
   */
	eyeDropperMove() 
	{
		this.eyeDropper.style.transform = `translate(${this.mouse.x - (this.eyeDropper.offsetWidth / 2)}px, ${this.mouse.y - (this.eyeDropper.offsetHeight / 2)}px) scale(1)`
	}

	/**
   * Makes color flash appear in a DOM element
   * @param {Element of DOM} container 
   */
	flash(container) 
	{
		const $expenders = []
		const $expender = document.createElement('div')

		$expender.classList.add('pickedColors__flash')
		$expender.classList.add('pickedColors__color--flash')
		container.appendChild($expender)
		$expenders.push($expender)

		for (const $expender of $expenders) { setTimeout(() => { $expender.remove() }, 500) }
	}

	/**
   * Simulates a click on the whitecircle button appearing at the end of calibration
   */
	goToDashboard()
	{
		this.newViewButton.click()
	}

	/**
   * Monitors stick position relative to the button to go to the dashboard page
   */
	checkGoToDashboardWithStick()
	{
		const ringLeftInCanvas = (this.musicalCanvas.canvas.offsetWidth * this.whiteCircle.offsetLeft) / this.musicalCanvas.video.offsetWidth
		const ringWidthInCanvas = (this.musicalCanvas.canvas.offsetWidth * this.whiteCircle.offsetWidth) / this.musicalCanvas.video.offsetWidth
		const ringTopInCanvas = (this.musicalCanvas.canvas.offsetHeight * this.whiteCircle.offsetTop) / this.musicalCanvas.video.offsetHeight
		const ringHeightInCanvas = (this.musicalCanvas.canvas.offsetHeight * this.whiteCircle.offsetHeight) / this.musicalCanvas.video.offsetHeight

		if((this.musicalCanvas.mainHitboxPosition.x  > ringLeftInCanvas && this.musicalCanvas.mainHitboxPosition.x < ringLeftInCanvas + ringWidthInCanvas) &&
					this.musicalCanvas.mainHitboxPosition.y > ringTopInCanvas && this.musicalCanvas.mainHitboxPosition.y < ringTopInCanvas + ringHeightInCanvas )
		{
			this.toDashboardTL.timeScale(1)
			this.toDashboardTL.play()
		}
		else
		{
			this.toDashboardTL.timeScale(2)
			this.toDashboardTL.reverse()	
		}

		setTimeout(this.checkGoToDashboardWithStick.bind(this), 50)
	}

	stickPosUpdate()
	{
		setTimeout(() =>
		{
			if(this.musicalCanvas.mainHitboxPosition.x !== undefined && this.musicalCanvas.mainHitboxPosition.y !== undefined)
			{
				const distanceX = ((this.musicalCanvas.mainHitboxPosition.x * this.videoContainer.offsetWidth) / this.musicalCanvas.canvas.offsetWidth) - (this.stickCursor.offsetLeft - this.videoContainer.offsetLeft)
				const distanceY = ((this.musicalCanvas.mainHitboxPosition.y * this.videoContainer.offsetHeight) / this.musicalCanvas.canvas.offsetHeight) - (this.stickCursor.offsetTop - this.videoContainer.offsetTop)
				this.posStickX += (distanceX / 3) 
				this.posStickY += (distanceY / 3)

				this.stickCursor.style.left = (this.posStickX - this.stickCursor.offsetWidth / 2) + 'px'
				this.stickCursor.style.top = (this.posStickY - this.stickCursor.offsetHeight / 2) + 'px'
			}

			this.stickPosUpdate()
		}, 25)
	}
}