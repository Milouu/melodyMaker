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
				
			const hslPickedColor = this.rgbToHsl(data[i], data[i + 1], data[i + 2])
			const h = hslPickedColor[0]
			const l = hslPickedColor[2]


			if (this.colorInterval(h, l)) {
				this.x = Math.floor((i % (this.canvasVideo.$canvas.width * 4)) / 4)
				this.y = Math.floor(i / (this.canvasVideo.$canvas.width * 4))
				// this.canvasVideo.context.beginPath()
				// this.canvasVideo.context.fillStyle = 'rgba(255, 0, 0, 0)'
				// this.canvasVideo.context.arc(this.x, this.y, 1, 0, Math.PI * 2)
				// this.canvasVideo.context.fill()
				// this.canvasVideo.context.closePath()

				this.canvasVideo.context.clearRect(this.x, this.y, 1, 1)
			}
		}
		requestAnimationFrame(this.findColor.bind(this))
	}

	colorInterval(h, l)
	{
		const hInterval = 0.01
		return 	(h > this.trackedColor.h - hInterval && h < this.trackedColor.h + hInterval) &&
				(l > 0.30 && l < 0.9)
	}

	latency()
	{
		this.oldX = this.x
		this.oldY = this.y
	}
	rgbToHsl(r, g, b)
	{
		r /= 255, g /= 255, b /= 255;
		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, l = (max + min) / 2;
	
		if(max == min){
			h = s = 0; // achromatic
		}else{
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch(max){
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h /= 6;
		}
	
		return [h, s, l];
	}
}