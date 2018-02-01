class DrumKit
{
	constructor(trackingColor)
	{
		this.trackingColor = trackingColor
        
		this._snare = document.querySelector('.snare')
		this._hiHat = document.querySelector('.hi-hat')
        
		this.run()
	}
    
	run()
	{
		if(this.trackingColor.oldY + 30 <= this.trackingColor.y) 
		{
			if(this.trackingColor.x < window.innerWidth / 2) 
			{
				this._snare.play()
			}

			if(this.trackingColor.x > window.innerWidth / 2) 
			{
				this._hiHat.play()
			}
		}
		requestAnimationFrame(this.run.bind(this))
	}
}