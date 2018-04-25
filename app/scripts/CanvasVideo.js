class CanvasVideo 
{
	constructor(width, height, webcam) 
	{
		this.$body = document.querySelector('body')
		this.$canvas = document.createElement('canvas')
		this.context = this.$canvas.getContext('2d')

		this.$canvas.width = 480
		this.$canvas.height = 270

		this.$body.appendChild(this.$canvas)
		
		webcam.$video.style.display = 'none'

		webcam.$video.addEventListener('play', this.draw(), false)

		// window.addEventListener('resize', () => 
		// {
		// 	this.$canvas.width = window.innerWidth
		// 	this.$canvas.height = window.innerHeight
		// })
	}

	draw() 
	{
		this.context.drawImage(webcam.$video, 0, 0, this.$canvas.width, this.$canvas.height)
		setTimeout(() => { 
			this.clearCanvas()
			this.draw() 
		}, 32)
	}

	clearCanvas() 
	{
		this.context.clearRect(0, 0, this.$canvas.width, this.$canvas.height)
	}

	getImageData()
	{
		return this.context.getImageData(0, 0, this.$canvas.width, this.$canvas.height).data
	}
}
