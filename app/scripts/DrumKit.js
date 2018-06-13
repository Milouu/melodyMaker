class DrumKit extends MusicalCanvas
{
	constructor()
	{
		super()

		// Number of hitboxes being tracked
		this.hitboxNumber = 1

		// Interval the stick has travel from a zone to be able to launch a sound again in the same zone
		this.playInterval = 5

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
				sound2 : []
			},
			bpm : 120,
			instrument: 'drumkit'
		}
		// Variables to control requestAnimation Frame Speed
		this.now2
		this.then2 = Date.now()
		this.interval2 = 1000/this.fps
		this.delta2

		
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

		/**
		 * Event Listeners
		 */
		this.recordButton.addEventListener('click', this.recordSound)
		
		/**
		 * Launched methods
		 */
		this.run()
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

	// console logs
	logs()
	{
		// console.log('Mainpos:' + JSON.stringify(this.mainHitboxPosition))
		// console.log('Secondpos:' + JSON.stringify(this.secondHitboxPosition))
		console.log('snareReady : ' + this.snareReady)
		// console.log('hiHatReady : ' + this.hiHatReady)
		console.log('')
	}

	// Launch sounds based on the deplacements of the hitbox
	displacementSoundActivation(hitboxPos)
	{
		const soundInterval = 5
		if((hitboxPos.y >= this.oldMainPos.y + soundInterval) && (hitboxPos.x >= this.snarePos.x))
		{
			if(this.snareReady === true)
			{
				this.playSound(this._snare)
				this.snareReady = false

				if(this.recordBegun === true)
				{
					this.record.sounds.sound1.push(Date.now - this.recordBeginning)
				}
			}
		}
		else if ((hitboxPos.y >= this.oldMainPos.y + soundInterval) && (hitboxPos.x <= this.hiHatPos.x))
		{
			if(this.hiHatReady === true)
			{
				this.playSound(this._hiHat)
				this.hiHatReady = false

				if(this.recordBegun === true)
				{
					this.record.sounds.sound2.push(Date.now - this.recordBeginning)
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
	
				this.playSound(this._snare)

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
				
				this.playSound(this._hiHat)

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
	
				this.playSound(this._snare)
			}
		}
		else if(hitboxPosition.x <= this.hiHatPos.x && hitboxPosition.y >= this.hiHatPos.y)
		{
			if(isUp[0] === true)
			{
				isUp[0] = false
				
				this.playSound(this._hiHat)
			}
		}
		else if(hitboxPosition.y <= this.snarePos.y - this.playInterval)
		{
			isUp[0] = true
		}
	}

	// Plays the sound passed in the parameters
	playSound(sound)
	{
		console.log(sound)
		sound.currentTime = 0
		sound.play()
	}

	recordSound()
	{
		this.recordBegun = true
		this.recordBeginning = Date.now

		this.record.sounds.sound1 = []
		this.record.sounds.sound2 = []
	}

	setPickedColor(pickedColor)
	{
		this.pickedColor = pickedColor
	}
}