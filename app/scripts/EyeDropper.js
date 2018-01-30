class EyeDropper 
{
	constructor(canvasVideo)
	{
		this.canvasVideo = canvasVideo
		this.canvasVideo.$canvas.addEventListener('click', (event) => 
		{
			this.pickColor(event.clientX, event.clientY)
		})
	}
  
	pickColor(x, y)
	{
		const data = this.canvasVideo.getImageData()
		const clickedPixelIndex = ((this.canvasVideo.$canvas.width * 4) * y) + (x * 4)
		console.log(clickedPixelIndex)
		console.log(x)
		console.log(y)
    
		const r = data[clickedPixelIndex]
		const g = data[clickedPixelIndex + 1]
		const b = data[clickedPixelIndex + 2]
		console.log(`r: ${r} g: ${g} b: ${b}`)
	}
}