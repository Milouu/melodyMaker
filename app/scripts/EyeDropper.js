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
		
		const pickedColor = {
			red: data[clickedPixelIndex],
			green: data[clickedPixelIndex + 1],
			blue: data[clickedPixelIndex + 2]
		}
		console.log(`r: ${pickedColor.red} g: ${pickedColor.green} b: ${pickedColor.blue}`)

		return pickedColor
	}
}