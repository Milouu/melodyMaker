class TrackingColor 
{
  
	constructor(red, green, blue, canvasVideo) 
	{
		this.trackedColor = 
    {
    	red: red,
    	green: green,
    	blue: blue
    }
		this.canvasVideo = canvasVideo 
	}
 
	findColor() 
	{
		this.imageData = this.canvasVideo.context.getImageData(0, 0, this.canvasVideo.$canvas.width, this.canvasVideo.$canvas.height)
		const data = this.imageData.data   
		
		for (let i = 0; i < data.length; i += 4) {
			const r = data[i]
			const g = data[i + 1]
			const b = data[i + 2]
			if ((r >= this.trackedColor.red) && (g >= this.trackedColor.green) && (b <= this.trackedColor.blue)) {
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
}