class MusicalCanvas 
{
	constructor() 
	{
		this.video = this.setWebcam()

		this.canvas = this.setCanvasVideo(this.video)
		this.context = this.canvas.getContext('2d')

		this.position = { x: 0, y: 0 }
		this.pickedColor
		this.trackedPixels = []

		this.tab = []

		this.fps = 30
		this.now
		this.then = Date.now()
		this.interval = 1000/this.fps
		this.delta

		this.video.addEventListener('play', this.draw())
		this.canvas.addEventListener('click', (event) => this.pickColor(event.clientX, event.clientY))
		window.addEventListener('keydown', (event) => this.runColorTracker(event))

		// window.addEventListener('resize', this.canvasResize())
	}

	setWebcam() 
	{
		// Set variables
		const $body = document.querySelector('body')
		const $video = document.createElement('video')
    
		// Place the video tag at the end of body
		$body.appendChild($video)
	
		// Navigator supports getUserMedia ?
		if(navigator.mediaDevices.getUserMedia)
		{
			console.log(navigator)
			// Recover only video of webcam
			navigator.mediaDevices.getUserMedia({ video: true, audio: false })
				.then(localMediaStream => 
				{
					// Video tag takes source of webcam and play video
					$video.srcObject = localMediaStream
					$video.play()
                    
				})
				.catch(error => 
				{
					window.alert('The following error occurred: ' + error.name)
				})
		}
		else 
		{
			window.alert('getUserMedia not supported')
		}

		return $video
	}
    
	setCanvasVideo(video)
	{
		const $body = document.querySelector('body')
		const $canvas = document.createElement('canvas')

		$canvas.width = 480
		// $canvas.width = 240
		$canvas.height = 270
		// $canvas.height = 135

		$body.appendChild($canvas)
		
		video.style.display = 'none'
        
		return $canvas
	}

	draw()
	{
		// this.clearCanvas()
		// this.context.drawImage(this.video, 0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight)
		
		requestAnimationFrame(this.draw.bind(this))
		
		this.now = Date.now()
		this.delta = this.now - this.then
		
		if (this.delta > this.interval) 
		{				
			this.then = this.now - (this.delta % this.interval)		
			
			this.clearCanvas()
			this.context.drawImage(this.video, 0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight)
			
			if(this.pickedColor)
			{
				this.findColor()
			}
		}
	}

	clearCanvas() 
	{
		this.context.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight)
	}

	getImageData()
	{
		return this.context.getImageData(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight).data
	}

	pickColor(x, y)
	{
		const data = this.getImageData()
		const clickedPixelIndex = ((this.canvas.offsetWidth * 4) * y) + (x * 4)
		
		const hslPickedColor = this.rgbToHsl(data[clickedPixelIndex], data[clickedPixelIndex + 1], data[clickedPixelIndex + 2])
		this.pickedColor = {
			h : hslPickedColor[0],
			l : hslPickedColor[2]
		}
        
		console.log(this.pickedColor)
	}

	rgbToHsl(r, g, b)
	{
		r /= 255, g /= 255, b /= 255
		var max = Math.max(r, g, b), min = Math.min(r, g, b)
		var h, s, l = (max + min) / 2
	
		if(max == min){
			h = s = 0 // achromatic
		}else{
			var d = max - min
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
			switch(max){
			case r: 
				h = (g - b) / d + (g < b ? 6 : 0)
				break
			case g: 
				h = (b - r) / d + 2
				break
			case b: 
				h = (r - g) / d + 4
				break
			}
			h /= 6
		}
        
		return [h, s, l]
	}
    
	findColor() 
	{
		const data = this.getImageData() 
		this.trackedPixels = []
		let halfcounter = 0

		for (let i = 0; i < data.length; i += 4) 
		{
			const hslPickedColor = this.rgbToHsl(data[i], data[i + 1], data[i + 2])
			const h = hslPickedColor[0]
			const l = hslPickedColor[2]

			if (this.colorInterval(h, l)) {
				this.position.x = Math.floor((i % (this.canvas.offsetWidth * 4)) / 4)
				this.position.y = Math.floor(i / (this.canvas.offsetWidth * 4))

				// if (!halfcounter % 2)
				// {
					const index = i / 4
					this.trackedPixels.push(index)
				// }

				// this.context.clearRect(this.position.x, this.position.y, 1, 1)
				halfcounter++
			}
		}
		this.drawHitboxes(this.hitboxesCalculator())

		// requestAnimationFrame(this.findColor.bind(this))
	}

	colorInterval(h, l)
	{
		const hInterval = 0.03
		return 	(h > this.pickedColor.h - hInterval && h < this.pickedColor.h + hInterval) && (l > 0.3 && l < 0.8)
	}

	drawHitboxes(hitboxes)
	{
		// console.log(hitboxes)
		for(let i = 0; i < hitboxes.length; i++)
		{
			if(hitboxes[i].length > 100)
			{
				this.context.clearRect(hitboxes[i][hitboxes[i].length] % this.canvas.offsetWidth, hitboxes[i][hitboxes[i].length] / this.canvas.offsetWidth, 20, 20)
			}
		}
	}

	latency()
	{
		this.oldPosition.x = this.position.x
		this.oldPosition.y = this.position.y
	}
    
	runColorTracker(event)
	{
		if(event.keyCode == 32)
		{
			if(this.pickedColor)
			{
				this.findColor()
			}
			else
			{
				window.alert('No color selected')
			}
		}
	}

	canvasResize()
	{
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight
	}

	hitboxesCalculator()
	{
		this.hitboxes = []
		let current = 0

		for(let i = 0; i < this.trackedPixels.length; i++)
		{
			let currentHitbox = []

			if(this.trackedPixels[i] != -1)
			{
				currentHitbox.push([this.trackedPixels[i]])
				this.trackedPixels[i] = -1
			}
			else
			{
				continue
			}

		
			while(currentHitbox.length > 0)
			{
				let currentPoint
				let adjacentPoints = []
				let adjacentChecks = []

				if(currentHitbox[currentHitbox.length - 1].length > 0)
				{
					currentPoint = currentHitbox[currentHitbox.length - 1].pop()
					adjacentChecks = [currentPoint - this.canvas.offsetWidth - 1, currentPoint - this.canvas.offsetWidth, currentPoint - this.canvas.offsetWidth + 1, currentPoint - 1, currentPoint + 1, currentPoint + this.canvas.offsetWidth - 1, currentPoint + this.canvas.offsetWidth, currentPoint + this.canvas.offsetWidth + 1]
				}
				else
				{
					currentHitbox.pop()
					continue
				}

				for(let adj = 0; adj < adjacentChecks.length; adj++)
				{
					if(this.trackedPixels.indexOf(adjacentChecks[i]) != -1)
					{
						if(this.trackedPixels[this.trackedPixels.indexOf(adjacentChecks[i])] != -1)
						{
							adjacentPoints.push(this.trackedPixels[this.trackedPixels.indexOf(adjacentChecks[i])])
							this.trackedPixels[this.trackedPixels.indexOf(adjacentChecks[i])] = -1
						}
					}
				}
				
				if(adjacentPoints.length > 0)
				{ 
					currentHitbox.push(adjacentPoints)
				}
		
				if(this.hitboxes[current] === undefined)
				{
					this.hitboxes.push([])
					this.hitboxes[current].push(currentPoint)
				}
				else
				{
					this.hitboxes[current].push(currentPoint)
				}
			}	

			current++
			
		}

		return this.hitboxes
	}		

	// 	this.hitboxes = []
	// 	let current = 0

	// 	for(let i = 0; i < this.tab.length; i++)
	// 	{
	// 		let currentHitbox = []

	// 		if(this.tab[i] != -1)
	// 		{
	// 			currentHitbox.push([this.tab[i]])
	// 			this.tab[i] = -1
	// 		}
	// 		else
	// 		{
	// 			continue
	// 		}

		
	// 		while(currentHitbox.length > 0)
	// 		{
	// 			let currentPoint
	// 			let adjacentPoints = []
	// 			const adjacentChecks = [currentPoint - this.canvas.offsetWidth - 1, currentPoint - this.canvas.offsetWidth, currentPoint - this.canvas.offsetWidth + 1, currentPoint - 1, currentPoint + 1, currentPoint + this.canvas.offsetWidth - 1, currentPoint + this.canvas.offsetWidth, currentPoint + this.canvas.offsetWidth + 1]

	// 			if(currentHitbox[currentHitbox.length - 1].length > 0)
	// 			{
	// 				currentPoint = currentHitbox[currentHitbox.length - 1].pop()
	// 			}
	// 			else
	// 			{
	// 				currentHitbox.pop()
	// 				continue
	// 			}

	// 			for(let adj = 0; adj < adjacentChecks.length; adj++)
	// 			{
	// 				if(this.tab.indexOf(adjacentChecks[i]) != -1)
	// 				{
	// 					if(this.tab[this.tab.indexOf(adjacentChecks[i])] != -1)
	// 					{
	// 						adjacentPoints.push(this.tab[this.tab.indexOf(adjacentChecks[i])])
	// 						this.tab[this.tab.indexOf(adjacentChecks[i])] = -1
	// 					}
	// 				}
	// 			}
				
	// 			if(adjacentPoints.length > 0)
	// 			{ 
	// 				currentHitbox.push(adjacentPoints)
	// 			}
		
	// 			if(this.hitboxes[current] === undefined)
	// 			{
	// 				this.hitboxes.push([])
	// 				this.hitboxes[current].push(currentPoint)
	// 			}
	// 			else
	// 			{
	// 				this.hitboxes[current].push(currentPoint)
	// 			}
	// 		}	

	// 		current++
			
	// 	}

	// 	return this.hitboxes
	// }	
}


