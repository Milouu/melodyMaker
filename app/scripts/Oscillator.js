class Oscillator extends MusicalCanvas
{
	constructor()
	{
		super()
		
		this.audioContext = new AudioContext()
		this.oscillator = this.audioContext.createOscillator()

		this.oscillatorGain = this.audioContext.createGain()

		this.oscillator.frequency.value = 440
		this.oscillatorGain.gain.value = 0.6

		this.oscillator.connect(this.oscillatorGain)
		this.oscillatorGain.connect(this.audioContext.destination)

		this.launch()
	}

	launch()
	{
		if(this.pickedColor)
		{
			cancelAnimationFrame(this.loop)
			this.play()
			this.update()
			return false
		}

		this.loop = requestAnimationFrame(this.launch.bind(this))
	}

	play()
	{
		this.oscillator.start(0)
	}

	update()
	{
		// console.log(Math.floor(this.mainHitboxPosition.y))
		this.oscillator.frequency.value = Math.floor((((this.mainHitboxPosition.y) / this.canvas.offsetHeight) * 500) + 100)
		this.oscillatorGain.gain.value = this.mainHitboxPosition.x / this.canvas.offsetWidth
		
		requestAnimationFrame(this.update.bind(this))
	}

	stop()
	{
		this.oscillator.stop()
	}
}