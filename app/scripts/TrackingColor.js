class TrackingColor 
{
  
	constructor(canvasVideo, eyeDropper) 
	{
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
				this.canvasVideo.context.beginPath()
				this.canvasVideo.context.fillStyle = 'red'
				this.canvasVideo.context.arc(x, y, 1, 0, Math.PI * 2)
				this.canvasVideo.context.fill()
				this.canvasVideo.context.closePath()
			}
		}
		requestAnimationFrame(this.findColor.bind(this))
	}

	colorInterval(r, g, b)
	{
		const interval = 10
		return 	(r > this.trackedColor.red - interval && r < this.trackedColor.red + interval) &&
						(g > this.trackedColor.green - interval && g < this.trackedColor.green + interval) &&
						(b > this.trackedColor.blue - interval && b < this.trackedColor.blue + interval)
	}
}