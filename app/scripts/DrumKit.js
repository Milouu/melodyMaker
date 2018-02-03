class DrumKit
{
	constructor(trackingColor)
	{
		this.trackingColor = trackingColor

		this.up = true
        
		this._snare = document.querySelector('.snare')
		this._hiHat = document.querySelector('.hi-hat')
        
		this.run()
	}
    
	run()
	{
		if(this.trackingColor.oldY + 40 <= this.trackingColor.y) 
		{
			if(this.trackingColor.x < window.innerWidth / 2 && this.up == true) 
			{
				this.up = false

				this._snare.currentTime = 0
				this._snare.play()
			}

			if(this.trackingColor.x > window.innerWidth / 2 && this.up == true) 
			{
				this.up = false

				this._hiHat.currentTime = 0
				this._hiHat.play()
			}
		}

		else if(this.trackingColor.oldY - 10 > this.trackingColor.y) // 10 allows to exclude tiny movements
		{
			this.up = true
		}
		
		requestAnimationFrame(this.run.bind(this))
	}
}