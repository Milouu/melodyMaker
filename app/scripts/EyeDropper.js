class EyeDropper 
{
	constructor(canvasVideo)
	{
		this.canvasVideo = canvasVideo
		this.pickedColor = null

		this.canvasVideo.$canvas.addEventListener('click', (event) => 
		{
			this.pickedColor = this.pickColor(event.clientX, event.clientY)
		})
	}
  
	pickColor(x, y)
	{
		const data = this.canvasVideo.getImageData()
		const clickedPixelIndex = ((this.canvasVideo.$canvas.width * 4) * y) + (x * 4)
		console.log(clickedPixelIndex)
		
		const hslPickedColor = this.rgbToHsl(data[clickedPixelIndex], data[clickedPixelIndex + 1], data[clickedPixelIndex + 2])
		const pickedColor = {
			h : hslPickedColor[0],
			l : hslPickedColor[2]
		}
		// console.log(`r: ${pickedColor.red} g: ${pickedColor.green} b: ${pickedColor.blue}`)
		// console.log('HSL ' + this.rgbToHsl(pickedColor.red, pickedColor.green, pickedColor.blue))
		console.log(pickedColor)

		return pickedColor
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

