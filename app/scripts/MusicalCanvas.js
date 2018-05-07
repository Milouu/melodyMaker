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
		const hitbox = []
		this.trackedPixels = []

		const data = this.getImageData() 
		this.trackedPixels = []
		// let halfcounter = 0

		for (let i = 0; i < data.length; i += 8) 
		{
			const hslPickedColor = this.rgbToHsl(data[i], data[i + 1], data[i + 2])
			const h = hslPickedColor[0]
			const l = hslPickedColor[2]

			if (this.colorInterval(h, l)) {
				this.position.x = Math.floor((i % (this.canvas.offsetWidth * 4)) / 4)
				this.position.y = Math.floor(i / (this.canvas.offsetWidth * 4))

				// if (halfcounter % 2 == 0)
				// {
				this.trackedPixels.push(i/4)
				// }

				// this.context.clearRect(this.position.x, this.position.y, 1, 1)
				// halfcounter++
			}
		}
		// this.hitboxesCalculator()
		// this.drawHitboxes(this.hitboxesCalculator())
		this.drawMainHitbox(this.hitboxesCalculator())

		// requestAnimationFrame(this.findColor.bind(this))
	}

	colorInterval(h, l)
	{
		const hInterval = 0.03
		return 	(h > this.pickedColor.h - hInterval && h < this.pickedColor.h + hInterval) && (l > 0.3 && l < 0.6)
	}

	drawHitboxes(hitboxes)
	{
		for(let i = 0; i < hitboxes.length; i++)
		{
			if(hitboxes[i].length > 800)
			{
				this.context.clearRect(hitboxes[i][hitboxes[i].length/2] % this.canvas.offsetWidth, hitboxes[i][hitboxes[i].length/2] / this.canvas.offsetWidth, 50, 50)
			}
		}
	}

	drawMainHitbox(hitboxes)
	{
		if(hitboxes.length > 0)
		{
			let biggest = 0
	
			for(let i = 1; i < hitboxes.length; i++)
			{
				if(hitboxes[i].length > hitboxes[biggest].length)
				{
					biggest = i
				}
			}
	
			let min = {
				x: hitboxes[biggest][0] % this.canvas.offsetWidth,
				y: hitboxes[biggest][0] / this.canvas.offsetWidth
			}
	
			let max = {
				x: hitboxes[biggest][0] % this.canvas.offsetWidth,
				y: hitboxes[biggest][0] / this.canvas.offsetWidth
			}
	
			for(let j = 1; j < hitboxes[biggest].length; j++)
			{
				let current = {
					x: hitboxes[biggest][j] % this.canvas.offsetWidth,
					y: hitboxes[biggest][j] / this.canvas.offsetWidth
				}
	
				if(current.x < min.x)
				{
					min.x = current.x
				}
				if(current.x > max.x)
				{
					max.x = current.x
				}
				if(current.y < min.y)
				{
					min.y = current.y
				}
				if(current.y > max.y)
				{
					max.y = current.y
				}
			}
	
			this.context.clearRect(min.x, min.y, 1, 10)
			this.context.clearRect(min.x, min.y, 10, 1)

			this.context.clearRect(min.x, max.y, 1, -10)
			this.context.clearRect(min.x, max.y, 10, 1)

			this.context.clearRect(max.x, min.y, 1, 10)
			this.context.clearRect(max.x, min.y, -10, 1)
			
			this.context.clearRect(max.x, max.y, 1, -10)
			this.context.clearRect(max.x, max.y, -10, 1)
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
				// let adjacentChecks = []

				if(currentHitbox[currentHitbox.length - 1].length > 0)
				{
					currentPoint = currentHitbox[currentHitbox.length - 1].pop()
					// adjacentChecks = [currentPoint - this.canvas.offsetWidth - 1, currentPoint - this.canvas.offsetWidth, currentPoint - this.canvas.offsetWidth + 1, currentPoint - 1, currentPoint + 1, currentPoint + this.canvas.offsetWidth - 1, currentPoint + this.canvas.offsetWidth, currentPoint + this.canvas.offsetWidth + 1]
				}
				else
				{
					currentHitbox.pop()
					continue
				}

				// for(let adj = 0; adj < adjacentChecks.length; adj++)
				// {
				// 	if(this.trackedPixels.indexOf(adjacentChecks[i]) != -1)
				// 	{
				// 		if(this.trackedPixels[this.trackedPixels.indexOf(adjacentChecks[i])] != -1)
				// 		{
				// 			adjacentPoints.push(this.trackedPixels[this.trackedPixels.indexOf(adjacentChecks[i])])
				// 			this.trackedPixels[this.trackedPixels.indexOf(adjacentChecks[i])] = -1
				// 		}
				// 	}
				// }

				if(this.trackedPixels.indexOf(currentPoint - this.canvas.offsetWidth - 2) != -1)
				{
					if(this.trackedPixels[this.trackedPixels.indexOf(currentPoint - this.canvas.offsetWidth - 2)] != -1)
					{
						adjacentPoints.push(this.trackedPixels[this.trackedPixels.indexOf(currentPoint - this.canvas.offsetWidth - 2)])
						this.trackedPixels[this.trackedPixels.indexOf(currentPoint - this.canvas.offsetWidth - 2)] = -1
					}
				}
				if(this.trackedPixels.indexOf(currentPoint - this.canvas.offsetWidth) != -1)
				{
					if(this.trackedPixels[this.trackedPixels.indexOf(currentPoint - this.canvas.offsetWidth)] != -1)
					{
						adjacentPoints.push(this.trackedPixels[this.trackedPixels.indexOf(currentPoint - this.canvas.offsetWidth)])
						this.trackedPixels[this.trackedPixels.indexOf(currentPoint - this.canvas.offsetWidth)] = -1
					}
				}
				if(this.trackedPixels.indexOf(currentPoint - this.canvas.offsetWidth + 2) != -1)
				{
					if(this.trackedPixels[this.trackedPixels.indexOf(currentPoint - this.canvas.offsetWidth + 2)] != -1)
					{
						adjacentPoints.push(this.trackedPixels[this.trackedPixels.indexOf(currentPoint - this.canvas.offsetWidth + 2)])
						this.trackedPixels[this.trackedPixels.indexOf(currentPoint - this.canvas.offsetWidth + 2)] = -1
					}
				}
				if(this.trackedPixels.indexOf(currentPoint - 2) != -1)
				{
					if(this.trackedPixels[this.trackedPixels.indexOf(currentPoint - 2)] != -1)
					{
						adjacentPoints.push(this.trackedPixels[this.trackedPixels.indexOf(currentPoint - 2)])
						this.trackedPixels[this.trackedPixels.indexOf(currentPoint - 2)] = -1
					}
				}	
				if(this.trackedPixels.indexOf(currentPoint + 2) != -1)
				{
					if(this.trackedPixels[this.trackedPixels.indexOf(currentPoint + 2)] != -1)
					{
						adjacentPoints.push(this.trackedPixels[this.trackedPixels.indexOf(currentPoint + 2)])
						this.trackedPixels[this.trackedPixels.indexOf(currentPoint + 2)] = -1
					}
				}			
				if(this.trackedPixels.indexOf(currentPoint + this.canvas.offsetWidth - 2) != -1)
				{
					if(this.trackedPixels[this.trackedPixels.indexOf(currentPoint + this.canvas.offsetWidth - 2)] != -1)
					{
						adjacentPoints.push(this.trackedPixels[this.trackedPixels.indexOf(currentPoint + this.canvas.offsetWidth - 2)])
						this.trackedPixels[this.trackedPixels.indexOf(currentPoint + this.canvas.offsetWidth - 2)] = -1
					}
				}			
				if(this.trackedPixels.indexOf(currentPoint + this.canvas.offsetWidth) != -1)
				{
					if(this.trackedPixels[this.trackedPixels.indexOf(currentPoint + this.canvas.offsetWidth)] != -1)
					{
						adjacentPoints.push(this.trackedPixels[this.trackedPixels.indexOf(currentPoint + this.canvas.offsetWidth)])
						this.trackedPixels[this.trackedPixels.indexOf(currentPoint + this.canvas.offsetWidth)] = -1
					}
				}			
				if(this.trackedPixels.indexOf(currentPoint + this.canvas.offsetWidth + 2) != -1)
				{
					if(this.trackedPixels[this.trackedPixels.indexOf(currentPoint + this.canvas.offsetWidth + 2)] != -1)
					{
						adjacentPoints.push(this.trackedPixels[this.trackedPixels.indexOf(currentPoint + this.canvas.offsetWidth + 2)])
						this.trackedPixels[this.trackedPixels.indexOf(currentPoint + this.canvas.offsetWidth + 2)] = -1
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
}

			while(currentHitbox.length > 0)
			{
				let adjacentPoints = []
				let currentPoint

				if(currentHitbox[currentHitbox.length - 1].length > 0)
				{
					currentPoint = currentHitbox[currentHitbox.length - 1].pop()
				}
				else
				{
					currentHitbox[currentHitbox.length - 1].pop()
					continue
				}

				for(let j = 0; j < this.trackedPixels.length; j++)
				{
					switch(j)
					{
						case (currentPoint - this.canvas.offsetWidth - 1) :
						case (currentPoint - this.canvas.offsetWidth) :
						case (currentPoint - this.canvas.offsetWidth + 1) :
						case (currentPoint - 1) :
						case (currentPoint + 1) :
						case (currentPoint + this.canvas.offsetWidth - 1) :
						case (currentPoint + this.canvas.offsetWidth) :
						case (currentPoint + this.canvas.offsetWidth + 1) : 
							adjacentPoints.push(j)
							break
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
}
