class DrumKit extends MusicalCanvas
{
	constructor()
	{
		super()

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
		
		
		// Position of the snare zone 
		this.snarePos = {
			x: this.canvas.offsetWidth / 2,
			y: (this.canvas.offsetHeight / 3) * 2
		}

		// Position of the hi-hat zone
		this.hiHatPos = {
			x: this.canvas.offsetWidth / 2,
			y: (this.canvas.offsetHeight / 3) * 2
		}

		// DOM Variables
		this._snare = document.querySelector('.snare')
		this._hiHat = document.querySelector('.hi-hat')

		this.recordButton = document.querySelector('.dashboard__reset')
		this.metrics = document.querySelector('.dashboard__metrics')
		this.cursor = document.querySelector('.dashboard__cursor')
		this.recordCountdown = document.querySelector('.drumkit__recordCountdown')

		this.stickCursor = document.querySelector('.stickCursor')
		this.stickCursor.style.opacity = 0.5

		/**
		 * Event Listeners
		 */
		this.recordButton.addEventListener('click', () => { this.launchCountdown() })

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
			else if(event.keyCode === 82)
			{
				if(localStorage.getItem('records'))
				{
					console.log(this.retrieveRecords())
				}
			}
		})
		
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
				this.logs()
			}
		}
	}

	// Launch sounds based on the deplacements of the hitbox
	displacementSoundActivation(hitboxPos)
	{
		const soundInterval = 5
		if((hitboxPos.y >= this.oldMainPos.y + soundInterval) && (hitboxPos.x >= this.snarePos.x))
		{
			if(this.snareReady === true)
			{
				this.playSound('snare')
				this.snareReady = false

				if(this.recordBegun === true)
				{
					this.record.sounds.sound1.push(Date.now() - this.recordBeginning)
				}
			}
		}
		else if ((hitboxPos.y >= this.oldMainPos.y + soundInterval) && (hitboxPos.x <= this.hiHatPos.x))
		{
			if(this.hiHatReady === true)
			{
				this.playSound('hiHat')
				this.hiHatReady = false

				if(this.recordBegun === true)
				{
					this.record.sounds.sound2.push(Date.now() - this.recordBeginning)
				} 
			}
		}
		else if(hitboxPos.y < this.oldMainPos.y && hitboxPos.y < this.snarePos.y)
		{
			this.snareReady = true
			this.hiHatReady = true
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
		const sound = eval('this._' + soundName)
	
		const drumkit = '.drumkit__' + soundName + '>.drumkit__img'

		sound.currentTime = 0
		sound.play()

		// Animate the drumkit img
		const drumkitTL = new TimelineMax()
		drumkitTL
			.set(drumkit, {scale: 1})
			.to(drumkit, 0.15, {scale: 1.1})
			.to(drumkit, 0.15, {scale: 1})
	}

	recordSound()
	{
		this.recordBegun = true
		this.recordBeginning = Date.now()

		this.record.sounds.sound1 = []
		this.record.sounds.sound2 = []

		// const cursorMovement = new TimelineMax()
		// cursorMovement
		// 	.to(this.cursor, 3, {x: 100})

		const movement = this.metrics.offsetWidth - (this.cursor.offsetWidth / 2)

		// Calculate how long is a loop (in seconds) depending on bpm
		const loopTime = (this.beatInLoop * 60) / this.record.bpm

		TweenMax.set(this.cursor, { x: 0 })
		TweenMax.to(this.cursor, loopTime, {x: movement, ease: Power0.easeNone})

		setTimeout(()=> {
			this.stopRecord()
		}, loopTime * 1000)
	}

	stopRecord()
	{
		this.recordBegun = false
		this.storeRecord()
	}

	launchCountdown()
	{	
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

	stickPosUpdate()
	{
		setTimeout(() =>
		{
			if(this.mainHitboxPosition.x !== undefined && this.mainHitboxPosition.y !== undefined)
			{
				const distanceX = ((this.mainHitboxPosition.x * window.innerWidth) / this.canvas.offsetWidth) - this.stickCursor.offsetLeft
				const distanceY = ((this.mainHitboxPosition.y * window.innerHeight) / this.canvas.offsetHeight) - this.stickCursor.offsetTop
				this.posStickX += (distanceX / 3) 
				this.posStickY += (distanceY / 3)

				this.stickCursor.style.left = this.posStickX + 'px'
				this.stickCursor.style.top = this.posStickY + 'px'
			}

			this.stickPosUpdate()
		}, 25)
	}

	setPickedColor(pickedColor)
	{
		this.pickedColor = pickedColor
	}

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
	
		console.log('store')
	}

	retrieveRecords()
	{
		console.log('retrieve')
		return JSON.parse(localStorage.getItem('records'))
	}
}