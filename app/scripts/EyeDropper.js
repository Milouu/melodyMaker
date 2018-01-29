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
    const pixel = ((this.canvasVideo.$canvas.width * 4) * (y - 1)) + (x * 4)
    console.log(pixel)
    
		const r = data[pixel]
		const g = data[pixel + 1]
		const b = data[pixel + 2]
		console.log(`r: ${r} g: ${g} b: ${b}`)
	}
}