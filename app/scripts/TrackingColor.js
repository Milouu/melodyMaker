class TrackingColor 
{
  
	constructor(canvasVideo, eyeDropper) 
	{
		this._snare = document.querySelector('.snare')
		this._hiHat = document.querySelector('.hi-hat')
		this.canvasVideo = canvasVideo 
		this.trackedColor = eyeDropper.pickedColor

		// For test
		this.canvasVideo.$canvas.addEventListener('click', () =>
		{
			this.trackedColor = eyeDropper.pickedColor
		})

		window.addEventListener('keydown', (event) =>
		{
			if(event.keyCode == 32)
			{
				if(this.trackedColor)
				{
					this.findColor()
				}
				else
				{
					window.prompt('No color selected')
				}
			}
		})
	}
 
	findColor() 
	{
		const data = this.canvasVideo.getImageData() 

		for (let i = 0; i < data.length; i += 4) {
			const r = data[i]
			const g = data[i + 1]
			const b = data[i + 2]

			if (this.colorInterval(r, g, b)) {
				let x = Math.floor((i % (this.canvasVideo.$canvas.width * 4)) / 4)
				let y = Math.floor(i / (this.canvasVideo.$canvas.width * 4))
				// this.canvasVideo.context.beginPath()
				// this.canvasVideo.context.fillStyle = 'rgba(255, 0, 0, 0)'
				// this.canvasVideo.context.arc(x, y, 1, 0, Math.PI * 2)
				// this.canvasVideo.context.fill()
				// this.canvasVideo.context.closePath()
				this.canvasVideo.context.clearRect(x, y, 1, 1)
				if(y > window.innerHeight / 2 && x > 0 && x < (window.innerWidth / 2)) 
				{
					this._snare.play()
				
					// if(y < 600)
					// {
					// 	this._snare.currentTime = 0
					// }

				}
				else if(y > window.innerHeight / 2 && x > (window.innerWidth / 2) && x < window.innerWidth)
				{
					this._hiHat.play()

					// if(y < 600)
					// {
					// 	this._hiHat.currentTime = 0
					// }
				}
			}
		}
		requestAnimationFrame(this.findColor.bind(this))
	}

	colorInterval(r, g, b)
	{
		const interval = 30
		return 	(r > this.trackedColor.red - interval && r < this.trackedColor.red + interval) &&
						(g > this.trackedColor.green - interval && g < this.trackedColor.green + interval) &&
						(b > this.trackedColor.blue - interval && b < this.trackedColor.blue + interval)
	}
}