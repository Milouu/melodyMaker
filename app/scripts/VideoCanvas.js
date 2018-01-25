class VideoCanvas {
	constructor(width, height) {

		this.$video = document.createElement('video')
		this.$video.src = 'assets/videos/minions.mp4'
		this.$video.controls = true
		this.$video.muted = true
		this.$video.autoplay = true

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
		if(this.$video.paused || this.$video.ended) { return false }
		this.context.drawImage(this.$video, 0, 0, this.canvas.width, this.canvas.height)
		setTimeout(() => { this.draw() }, 20)
	}
}
