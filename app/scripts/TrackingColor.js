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
		
		this.latency()

		for (let i = 0; i < data.length; i += 4) {
			const r = data[i]
			const g = data[i + 1]
			const b = data[i + 2]

			if (this.colorInterval(r, g, b)) {
				this.x = Math.floor((i % (this.canvasVideo.$canvas.width * 4)) / 4)
				this.y = Math.floor(i / (this.canvasVideo.$canvas.width * 4))
				// this.canvasVideo.context.beginPath()
				// this.canvasVideo.context.fillStyle = 'rgba(255, 0, 0, 0)'
				// this.canvasVideo.context.arc(x, y, 1, 0, Math.PI * 2)
				// this.canvasVideo.context.fill()
				// this.canvasVideo.context.closePath()

				this.canvasVideo.context.clearRect(this.x, this.y, 1, 1)
			}
		}
		requestAnimationFrame(this.findColor.bind(this))
	}

	colorInterval(r, g, b)
	{
		const interval = 15
		return 	(r > this.trackedColor.red - interval && r < this.trackedColor.red + interval) &&
						(g > this.trackedColor.green - interval && g < this.trackedColor.green + interval) &&
						(b > this.trackedColor.blue - interval && b < this.trackedColor.blue + interval)
	}

	latency()
	{
		this.oldX = this.x
		this.oldY = this.y
	}
}