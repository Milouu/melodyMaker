class VideoCanvas {
	constructor(width, height) {

		this.$video = document.createElement('video')
		this.$video.src = 'assets/videos/minions.mp4'
		this.$video.controls = true
		this.$video.muted = true
		this.$video.autoplay = true
		this.$video.currentTime = 17

		this.$body = document.querySelector('body')
		this.canvas = document.createElement('canvas')
		this.context = this.canvas.getContext('2d')

		this.canvas.width = width
		this.canvas.height = height

		this.$body.appendChild(this.$video)
		this.$body.appendChild(this.canvas)

		this.$video.style.display = 'none'

		this.$video.addEventListener('play', () =>
		{
			this.draw()
		}, false)
	}
  
	draw()
	{
		this.clearCanvas()
		if(this.$video.paused || this.$video.ended) { return false }
		this.context.drawImage(this.$video, 0, 0, this.canvas.width, this.canvas.height)
		this.imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)
		this.findColor()
		setTimeout(() => { this.draw() }, 20)
	}

	findColor()
	{
		const data = this.imageData.data
		// let counter = 0
		for(let i = 0; i < data.length ; i+=4)
		{
			const r = data[i]
			const g = data[i+1]
			const b = data[i+2]
			// counter++
			if((r>=160)&&(g>=160)&&(b<=130))
			{
				let x = Math.floor((i%3200)/4)
				let y = Math.floor(i/3200) 
				// console.log(`Call n°${counter} : x = ${x} y = ${y}`)
				this.context.beginPath() // C'EST CETTE PUTAIN DE LIGNE DE MERDE QUI FAISAIT TOUT BUGUER BORDEL DE CUL
				this.context.fillStyle = 'red'
				this.context.arc(x, y, 1, 0, Math.PI*2)
				this.context.fill()
				this.context.closePath()
			}
		}
	}

	clearCanvas()
	{
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
	}
}
