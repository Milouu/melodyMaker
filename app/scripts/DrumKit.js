class DrumKit extends MusicalCanvas
{
	constructor()
	{
		super()

		this.hitboxNumber = 1

		this.playInterval = 20

		// this.mainIsUp = [true]
		// this.secondIsUp = [true]

		this.snareReady = true 
		this.hiHatReady = true
		
		this._snare = document.querySelector('.snare')
		this._hiHat = document.querySelector('.hi-hat')

		this.snarePos = {
			x: this.canvas.offsetWidth / 2,
			y: (this.canvas.offsetHeight / 3) * 2
		}

		this.hiHatPos = {
			x: this.canvas.offsetWidth / 2,
			y: (this.canvas.offsetHeight / 3) * 2
		}
        
		this.run()
	}
	

	run()
	{
		this.checkSnare()
		this.checkHiHat()
		this.activateSound(this.mainHitboxPosition)
		this.activateSound(this.secondHitboxPosition)
		// this.logs()

		requestAnimationFrame(this.run.bind(this))
	}

	logs()
	{
		console.log('snareReady : ' + this.snareReady)
		console.log('Mainpos:' + JSON.stringify(this.mainHitboxPosition))
		console.log('Secondpos:' + JSON.stringify(this.secondHitboxPosition))
		// console.log('hiHatReady : ' + this.hiHatReady)
	}

	checkSnare()
	{
		if((this.mainHitboxPosition.x < this.snarePos.x - this.playInterval || this.mainHitboxPosition.y < this.snarePos.y - this.playInterval) && (this.secondHitboxPosition.x < this.snarePos.x - this.playInterval || this.secondHitboxPosition.y < this.snarePos.y - this.playInterval))
		{
			this.snareReady = true
		}
	}

	checkHiHat()
	{
		if((this.mainHitboxPosition.x > this.hiHatPos.x + this.playInterval || this.mainHitboxPosition.y < this.hiHatPos.y - this.playInterval) && (this.secondHitboxPosition.x > this.hiHatPos.x + this.playInterval || this.secondHitboxPosition.y < this.hiHatPos.y - this.playInterval))
		{
			this.hiHatReady = true
		}
	}

	activateSound(hitboxPosition)
	{
		if(hitboxPosition.x >= this.snarePos.x && hitboxPosition.y >= this.snarePos.y)
		{
			if(this.snareReady === true)
			{
				this.snareReady = false
	
				this.playSound(this._snare)
			}
		}
		else if(hitboxPosition.x <= this.hiHatPos.x && hitboxPosition.y >= this.hiHatPos.y)
		{
			if(this.hiHatReady === true)
			{
				this.hiHatReady = false
				
				this.playSound(this._hiHat)
			}
		}
	}

	// activateSound(hitboxPosition, isUp)
	// {
	// 	if(hitboxPosition.x >= this.snarePos.x && hitboxPosition.y >= this.snarePos.y)
	// 	{
	// 		if(isUp[0] === true)
	// 		{
	// 			isUp[0] = false
	
	// 			this.playSound(this._snare)
	// 		}
	// 	}
	// 	else if(hitboxPosition.x <= this.hiHatPos.x && hitboxPosition.y >= this.hiHatPos.y)
	// 	{
	// 		if(isUp[0] === true)
	// 		{
	// 			isUp[0] = false
				
	// 			this.playSound(this._hiHat)
	// 		}
	// 	}
	// 	else if(hitboxPosition.y <= this.snarePos.y - 10)
	// 	{
	// 		isUp[0] = true
	// 	}
	// }

	playSound(sound)
	{
		sound.currentTime = 0
		sound.play()
	}
}