class WavesCanvas 
{
	constructor(parentClass, videoClass) 
	{
		// Set DOM elements
		this.$parent = document.querySelector('.' + parentClass)
		this.$video = document.querySelector('.' + videoClass)
		this.$canvas = document.createElement('canvas')
		this.context = this.$canvas.getContext('2d')

		// Add canvas class
		this.$canvas.classList.add('jelly')

		// Display none video
		this.$video.style.display = 'none'
        
		// Set canvas dimensions
		this.$canvas.width = this.$parent.offsetWidth
		this.$canvas.height = this.$parent.offsetHeight
		this.$canvas.style.transform = `scale(${window.innerWidth * 0.0007})`

		// Add canvas at parent
		this.$parent.appendChild(this.$canvas)

		// Resize
		window.addEventListener('resize', () => {
			window.innerWidth >= 760 ? this.$canvas.style.transform = `scale(${window.innerWidth * 0.0007})` : false
			console.log(window.innerWidth * 0.0007)
			// this.$canvas.height = this.$parent.offsetHeight
		})

		this.draw()
	}
	draw()
	{ 
		const pattern = this.context.createPattern(document.querySelector('.img'), 'repeat')
        
		this.options = {
			paths: '#jelly',                // Shape we want to draw
			pointsNumber: 20,               // Number of points
			maxDistance: 100,               // Max distance among points
			// color: pattern,              // Color of path
			// centroid: '.centroid-text',  // Element to move accordingly with the centroid of the shape
			// debug: true                  // Uncomment this to see the points
		}
		this.jelly = new Jelly('.jelly', this.options)
	}
	stop()
	{
		this.jelly.stop()
	}
}