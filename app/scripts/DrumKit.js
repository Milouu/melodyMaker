class DrumKit extends MusicalCanvas
{
	constructor()
	{
		super()

		/**
		 * Variables
		 */

		//Drumkit sounds
		this.drumkitSounds = {
			bass: 
			[
					new Audio(this.path + 'drumKit/bass/bass-2.mp3'),
					new Audio(this.path + 'drumKit/bass/bass-1.mp3'),
					new Audio(this.path + 'drumKit/bass/bass-3.mp3'),
					new Audio(this.path + 'drumKit/bass/bass-4.mp3'),
					new Audio(this.path + 'drumKit/bass/bass-5.mp3'),
			], 
			snare: 
			[
					new Audio(this.path + 'drumKit/snare/snare-2.mp3'),
					new Audio(this.path + 'drumKit/snare/snare-1.mp3'),
					new Audio(this.path + 'drumKit/snare/snare-3.mp3'),
					new Audio(this.path + 'drumKit/snare/snare-4.mp3'),
					new Audio(this.path + 'drumKit/snare/snare-5.mp3'),
			], 
			hiHat: 
			[
					new Audio(this.path + 'drumKit/hiHat/hiHat-1.mp3'),
					new Audio(this.path + 'drumKit/hiHat/hiHat-2.mp3'),
					new Audio(this.path + 'drumKit/hiHat/hiHat-3.mp3'),
					new Audio(this.path + 'drumKit/hiHat/hiHat-4.mp3'),
					new Audio(this.path + 'drumKit/hiHat/hiHat-5.mp3'),
			], 
			cymbal:
			[
				new Audio(this.path + 'drumKit/cymbal/cymbal-1.wav'),
				new Audio(this.path + 'drumKit/cymbal/cymbal-2.wav'),
				new Audio(this.path + 'drumKit/cymbal/cymbal-3.wav'),
				new Audio(this.path + 'drumKit/cymbal/cymbal-4.wav'),
				new Audio(this.path + 'drumKit/cymbal/cymbal-5.wav'),
		], 
		}

		// Number of hitboxes being tracked
		this.hitboxNumber = 1

		// Interval the stick has travel from a zone to be able to launch a sound again in the same zone
		this.playInterval = 5

		// Number of beat in a loop
		this.beatInLoop = 16

		// Variables used to control if the sound in a zone can be launched again
		this.isUp = [true]
		// this.mainIsUp = [true]
		// this.secondIsUp = [true]
		this.snareReady = true 
		this.hiHatReady = true
		this.cymbalReady = true
		this.bassDrumReady = true
		// this.oldMainPos = this.mainHitboxPosition
		this.oldMainPos = {x: 0, y: 0}

		//Record Variables
		this.recordBegun = false
		this.recordBeginning = undefined
		this.record = {
			sounds : {
				sound1 : [],
				sound2 : [],
				sound3 : [],
				sound4 : []
			},
			bpm : 120,
			instrument: 'drum'
		}
		// Variables to control requestAnimation Frame Speed
		this.now2
		this.then2 = Date.now()
		this.interval2 = 1000/this.fps
		this.delta2

		// Variable for record countdown
		this.countdown = 3

		//Position of cursor following stick
		this.posStickX = 0
		this.posStickY = 0
		this.oldStickPosX = 0 
		this.oldStickPosY = 0

		// Window variables
		this.windowHeight = window.innerHeight
		this.windowWidth = window.innerWidth
		
		// Position of the snare zone 
		this.snarePos = {
			x: this.canvas.offsetWidth / 2,
			// y: (this.canvas.offsetHeight / 3) * 2
			y: this.canvas.offsetHeight / 2
		}

		// Position of the hi-hat zone
		this.hiHatPos = {
			x: this.canvas.offsetWidth / 2,
			// y: (this.canvas.offsetHeight / 3) * 2
			y: this.canvas.offsetHeight / 2
		}

		// Metronome object
		this.metronome = 
		{
			strong: new Audio('assets/sounds/metronome/metronomeStrong.mp3'),
			weak: new Audio('assets/sounds/metronome/metronomeWeak.mp3'),
			count: 0,
			dateNow: 0,
			animationFrame: null
		}

		// DOM Variables
		this.recordButton = document.querySelector('.dashboard__reset')
		this.metrics = document.querySelector('.dashboard__metrics')
		this.cursor = document.querySelector('.dashboard__cursor')
		this.recordCountdown = document.querySelector('.drumkit__recordCountdown')

		this.stickCursor = document.querySelector('.stickCursor')
		this.stickCursor.style.opacity = 0.5

		this.inputBpm = document.querySelector('.inputBpm')

		this.successTxt = document.querySelector('.calibration__successTxt')
		this.whiteCircle = document.querySelector('.calibration__whiteCircle')
		this.transitionRing = this.whiteCircle.querySelector('.calibration__transitionRing')
		this.newViewButton = document.querySelector('.newViewButton')

		/**
		 * GSAP Timelines
		 */
		// Animation timeline on record validation
		this.recordValidationTL = new TimelineLite({paused: true, onComplete: this.checkGoToDashboardWithStick, onCompleteScope: this})
		this.recordValidationTL
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

		/**
		 * Event Listeners
		 */
		this.recordButton.addEventListener('click', () => 
		{ 
			this.launchCountdown() 
			this.metronomeUpdateDate()
			this.playMetronome(this.record.bpm)
		})

		// For dev
		document.addEventListener('keydown', () =>
		{	
			if(event.keyCode === 71)
			{
				this.playSound('hiHat')

				if(this.recordBegun === true)
				{	
					this.record.sounds.sound1.push(Date.now() - this.recordBeginning)
				}	
			}
			else if(event.keyCode === 70)
			{
				this.playSound('snare')

				if(this.recordBegun === true)
				{	
					this.record.sounds.sound2.push(Date.now() - this.recordBeginning)
				}
			}	
			// R
			else if(event.keyCode === 82)
			{
				if(localStorage.getItem('records'))
				{
					console.log(this.retrieveRecords())
				}
			}
		})

		this.inputBpm.addEventListener('change', () => {
			this.record.bpm = this.inputBpm.value
		})

		window.addEventListener('resize', () => { this.updateWindowVariables() })

		// Tests
		this.newViewButton.addEventListener('click', ()=> { this.storeRecord() })
		
		/**
		 * Launched methods
		 */
		this.run()
		this.stickPosUpdate()
	}
	
	// Launches the correct functions for the sound activation based on the number of hitboxes calculated
	run()
	{
		requestAnimationFrame(this.run.bind(this))

		this.now2 = Date.now()
		this.delta2 = this.now2 - this.then2
		
		if (this.delta2 > this.interval2) 
		{				
			this.then2 = this.now2 - (this.delta2 % this.interval2)		
			
			if(this.hitboxNumber === 1)
			{
				// this.activateSoundSolo(this.mainHitboxPosition, this.isUp)
				this.displacementSoundActivation(this.mainHitboxPosition)
				// this.logs()
			}
			else if(this.hitboxNumber === 2)
			{
				this.checkSnare()
				this.checkHiHat()
				this.activateSound(this.mainHitboxPosition)
				this.activateSound(this.secondHitboxPosition)
			}
		}
	}

	// Launch sounds based on the deplacements of the hitbox
	displacementSoundActivation(hitboxPos)
	{
		const soundInterval = 5
		if((hitboxPos.y >= this.oldMainPos.y + soundInterval))
		{	
			if((hitbox.y >= this.snarePos.y) &&(hitboxPos.x >= this.hiHatPos.x))
			{
				if(this.snareReady === true)
				{
					this.playSound('bass')
					this.bassReady = false
	
					if(this.recordBegun === true)
					{
						this.record.sounds.sound1.push(Date.now() - this.recordBeginning)
					}
				}
			}
			else if((hitbox.y >= this.snarePos.y) &&(hitboxPos.x <= this.hiHatPos.x))
			{
				if(this.snareReady === true)
				{
					this.playSound('snare')
					this.snareReady = false
	
					if(this.recordBegun === true)
					{
						this.record.sounds.sound2.push(Date.now() - this.recordBeginning)
					}
				}
			}
			else if((hitbox.y <= this.snarePos.y) && (hitboxPos.x >= this.snarePos.x))
			{
				if(this.hiHatReady === true)
				{
					this.playSound('hiHat')
					this.hiHatReady = false
	
					if(this.recordBegun === true)
					{
						this.record.sounds.sound3.push(Date.now() - this.recordBeginning)
					} 
				}
			}
			else if ((hitbox.y <= this.snarePos.y) &&(hitboxPos.x <= this.hiHatPos.x))
			{
				if(this.cymbalReady === true)
				{
					this.playSound('cymbal')
					this.cymbalReady = false
	
					if(this.recordBegun === true)
					{
						this.record.sounds.sound4.push(Date.now() - this.recordBeginning)
					}
				}
			}
		}
		else if(hitboxPos.y < this.oldMainPos.y)
		{
			this.snareReady = true
			this.hiHatReady = true
			this.cymbalReady = true
			this.bassReady = true
		}
		
		this.oldMainPos.x = hitboxPos.x
		this.oldMainPos.y = hitboxPos.y	
	}
	
	// Checks that there is no hitbox in the snare zone
	checkSnare()
	{
		if((this.mainHitboxPosition.x < this.snarePos.x - this.playInterval || this.mainHitboxPosition.y < this.snarePos.y - this.playInterval) && (this.secondHitboxPosition.x < this.snarePos.x - this.playInterval || this.secondHitboxPosition.y < this.snarePos.y - this.playInterval))
		{
			this.snareReady = true
		}
	}

	// Checks that there is no hitbox in the hi-hat zone
	checkHiHat()
	{
		if((this.mainHitboxPosition.x > this.hiHatPos.x + this.playInterval || this.mainHitboxPosition.y < this.hiHatPos.y - this.playInterval) && (this.secondHitboxPosition.x > this.hiHatPos.x + this.playInterval || this.secondHitboxPosition.y < this.hiHatPos.y - this.playInterval))
		{
			this.hiHatReady = true
		}
	}

	// Launch sounds based on the position of the hitbox 
	activateSound(hitboxPosition)
	{
		if(hitboxPosition.x >= this.snarePos.x && hitboxPosition.y >= this.snarePos.y)
		{
			if(this.snareReady === true)
			{
				this.snareReady = false
	
				this.playSound('snare')

				if(this.recordBegun === true)
				{
					this.record.sounds.sound1.push(Date.now - this.recordBeginning)
				} 
			}
		}
		else if(hitboxPosition.x <= this.hiHatPos.x && hitboxPosition.y >= this.hiHatPos.y)
		{
			if(this.hiHatReady === true)
			{
				this.hiHatReady = false
				
				this.playSound('hiHat')

				if(this.recordBegun === true)
				{
					this.record.sounds.sound2.push(Date.now - this.recordBeginning)
				} 
			}
		}
	}

	// Launches sounds based on the position of the hitbox
	// Works only with one hitbox 
	activateSoundSolo(hitboxPosition, isUp)
	{
		if(hitboxPosition.x >= this.snarePos.x && hitboxPosition.y >= this.snarePos.y)
		{
			if(isUp[0] === true)
			{
				isUp[0] = false
	
				this.playSound('snare')
			}
		}
		else if(hitboxPosition.x <= this.hiHatPos.x && hitboxPosition.y >= this.hiHatPos.y)
		{
			if(isUp[0] === true)
			{
				isUp[0] = false
				
				this.playSound('hiHat')
			}
		}
		else if(hitboxPosition.y <= this.snarePos.y - this.playInterval)
		{
			isUp[0] = true
		}
	}

	// Plays the sound passed in the parameters
	playSound(soundName)
	{	
		const sound = eval('this.drumkitSounds.' + soundName)
	
		const drumkit = '.drumkit__' + soundName + '>.drumkit__img'

		const random = Math.floor(Math.random() * sound.length)
		sound[random].currentTime = 0
		sound[random].play()

		// Animate the drumkit img
		const drumkitTL = new TimelineMax()
		drumkitTL
			.set(drumkit, {scale: 1})
			.to(drumkit, 0.15, {scale: 1.1})
			.to(drumkit, 0.15, {scale: 1})
	}

	// Init variables & launch animations of sound recording
	recordSound()
	{
		this.recordBegun = true
		this.recordBeginning = Date.now()

		this.record.sounds.sound1 = []
		this.record.sounds.sound2 = []

		const movement = this.metrics.offsetWidth - (this.cursor.offsetWidth / 2)

		// Calculate how long is a loop (in seconds) depending on bpm
		const loopTime = (this.beatInLoop * 60) / this.record.bpm

		TweenMax.set(this.cursor, { x: 0 })
		TweenMax.to(this.cursor, loopTime, {x: movement, ease: Power0.easeNone})

		setTimeout(()=> {
			this.stopRecord()
		}, loopTime * 1000)
	}

	// Stops sound recording
	stopRecord()
	{
		this.recordBegun = false
		this.magnet(this.record.sounds)
		
		this.stopMetronome()
	}

	// Launches the countdown of sound recording
	launchCountdown()
	{	
		this.recordValidationTL.timeScale(2)
		this.recordValidationTL.reverse()

		if(this.countdown > 0)
		{
			this.recordCountdown.innerHTML = this.countdown
			const appearingDigit = new TimelineMax({onComplete : this.launchCountdown, onCompleteScope: this})
			appearingDigit 
				.set(this.recordCountdown, {opacity : 0, scale : 1})
				.to(this.recordCountdown, 0.5, {opacity : 1, scale: 1.5})
				.to(this.recordCountdown, 0.5, {opacity : 0})
			this.countdown--
			
		}
		else
		{
			TweenMax.to(this.recordCountdown, 0.5, {opacity : 0})
			this.countdown = 3
			this.recordSound()
		}
	}

	// Update the stickcursor position
	stickPosUpdate()
	{
		setTimeout(() =>
		{
			if(this.mainHitboxPosition.x !== undefined && this.mainHitboxPosition.y !== undefined)
			{
				const distanceX = ((this.mainHitboxPosition.x * this.windowWidth) / this.canvas.offsetWidth) - this.oldStickPosX
				const distanceY = ((this.mainHitboxPosition.y * this.windowHeight) / this.canvas.offsetHeight) - this.oldStickPosY
				this.posStickX += (distanceX / 3) 
				this.posStickY += (distanceY / 3)
				this.oldStickPosX = this.posStickX
				this.oldStickPosY = this.posStickY

				this.stickCursor.style.transform = `translateX(${this.posStickX - (this.stickCursor.offsetWidth / 2)}px) translateY(${this.posStickY - (this.stickCursor.offsetHeight / 2)}px)`
			}

			this.stickPosUpdate()
		}, 25)
	}

	// Update Window variables on resize
	updateWindowVariables()
	{
		this.windowWidth = window.innerWidth
		this.windowHeight = window.innerHeight
	}

	// Sets the tracked color
	setPickedColor(pickedColor)
	{
		this.pickedColor = pickedColor
	}

	// Stores the sound that's been recorded in localstorage
	storeRecord()
	{
		let records = undefined

		if(localStorage.getItem('records'))
		{
			records = this.retrieveRecords()
		}
		else
		{
			records = []
		}
		records.push(this.record)
		localStorage.setItem('records', JSON.stringify(records))
	}

	// Gets the list of tracks that have been recorded from localstorage
	retrieveRecords()
	{
		return JSON.parse(localStorage.getItem('records'))
	}

	//Updates metronome date property
	metronomeUpdateDate()
	{
		this.metronome.dateNow = Date.now()
	}

	// Launches metronomes at a given bpm
	playMetronome(bpm)
	{
		if(this.metronome.dateNow + (60000 / bpm) <= Date.now())
		{
			if(this.metronome.count % 4 == 0) 
			{
				this.metronome.strong.currentTime = 0
				this.metronome.strong.play()
				this.metronome.count = 0
			
			}
			else
			{
				this.metronome.weak.currentTime = 0
				this.metronome.weak.play()
			}
			this.metronomeUpdateDate()
			this.metronome.count++
		}

		this.metronome.animationFrame = window.requestAnimationFrame(this.playMetronome.bind(this, bpm))
	}


	// Stops metronome
	stopMetronome()
	{
		window.cancelAnimationFrame(this.metronome.animationFrame)
	}

	magnet(sounds)
	{
		
		const interval = (60000 / this.record.bpm) / 4
		
		for(const sound in sounds)
		{
		
			for(const [index, note] of sounds[sound].entries())
			{
				const delay = note % interval
				if(delay > (interval / 2))
				{
					sounds[sound][index] = note - delay
				}
				else
				{
					sounds[sound][index] = note + (interval - delay)
				}
			}
		}
		
		this.soundsRedundancy(sounds)
	}

	soundsRedundancy(sounds)
	{
		for(const sound in sounds)
		{
			
			for(const [index, note] of sounds[sound].entries())
			{
				for(let i = index + 1; i < sounds[sound].length; i++)
				{
					if(note == sounds[sound][i])
					{
						sounds[sound].splice(i, 1)
					}
				}
			}
		}
		this.displayValidationScreen()
	}

	displayValidationScreen()
	{
		this.recordValidationTL.timeScale(1)
		this.recordValidationTL.play()
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
		if((this.mainHitboxPosition.x  > this.whiteCircle.offsetLeft && this.mainHitboxPosition.x < this.whiteCircle.offsetLeft + this.whiteCircle.offsetWidth) &&
					this.mainHitboxPosition.y > this.whiteCirlce.offsetTop && this.mainHitboxPosition.y < this.whiteCirlce.offsetTop + this.whiteCircle.offsetHeight)
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
}