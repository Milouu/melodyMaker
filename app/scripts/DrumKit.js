class DrumKit
{
	constructor(trackingColor)
	{
		this.trackingColor = trackingColor

		this.isUp = true
        
		this._snare = document.querySelector('.snare')
		this._hiHat = document.querySelector('.hi-hat')
        
		this.run()
	}
    
	run()
	{
		if(this.trackingColor.oldY + 40 <= this.trackingColor.y) 
		{
			if(this.trackingColor.x < window.innerWidth / 2 && this.isUp == true) 
			{
				this.isUp = false

				this._snare.currentTime = 0
				this._snare.play()
			}

			if(this.trackingColor.x > window.innerWidth / 2 && this.isUp == true) 
			{
				this.isUp = false

				this._hiHat.currentTime = 0
				this._hiHat.play()
			}
		}

		else if(this.trackingColor.oldY - 20 > this.trackingColor.y) // 10 allows to exclude tiny movements
		{
			this.isUp = true
		}
		
		requestAnimationFrame(this.run.bind(this))
	}
}