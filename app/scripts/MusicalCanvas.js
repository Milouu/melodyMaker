class MusicalCanvas 
{
	constructor() 
	{
		this.video = this.setWebcam()

		this.canvas = this.setCanvasVideo(this.video, 120, 67.5)
		this.context = this.canvas.getContext('2d')
		// this.canvas.style.display = 'none'

		// this.expositionCanvas = this.setCanvasVideo(this.video, 960, 540)
		// this.expositionContext = this.expositionCanvas.getContext('2d')

		this.position = { x: 0, y: 0 }
		this.pickedColor
		this.trackedPixels = []

		this.tab = []

		this.fps = 30
		this.now
		this.then = Date.now()
		this.interval = 1000/this.fps
		this.delta

		this.hitboxNumber = 0
		this.hitboxSize = 20
		this.mainHitboxPosition = {}
		this.secondHitboxPosition = {}

		this.video.addEventListener('play', this.draw())
		this.video.addEventListener('click', (event) => this.pickColorFromDisplay(event.clientX - this.video.offsetLeft, event.clientY - this.video.offsetTop))
		this.canvas.addEventListener('click', (event) => this.pickColor(event.clientX - this.canvas.offsetLeft, event.clientY - this.canvas.offsetTop))
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
    
	setCanvasVideo(video, width, height)
	{
		const $body = document.querySelector('body')
		const $canvas = document.createElement('canvas')

		// $canvas.width = 480
		// $canvas.height = 270

		// $canvas.width = 120
		// $canvas.height = 67.5

		$canvas.width = width
		$canvas.height = height

		$body.appendChild($canvas)
		
		// video.style.display = 'none'
        
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
			// this.drawExpoCanvas()
			
			
			if(this.pickedColor)
			{
				this.findColor()
			}
		}
	}

	drawExpoCanvas()
	{
		this.expositionContext.drawImage(this.canvas, 0, 0, this.expositionCanvas.offsetWidth, this.expositionCanvas.offsetHeight)
	}

	clearCanvas() 
	{
		this.context.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight)
		// this.expositionContext.clearRect(0, 0, this.expositionCanvas.offsetWidth, this.expositionCanvas.offsetHeight)
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
		
		// Create div showing what color has been picked 
		const $body = document.querySelector('body')
		const $colorDiv = document.createElement('div')
		$colorDiv.style.display = 'inline-block'
		$colorDiv.style.width = '20px'
		$colorDiv.style.height = '20px'
		$colorDiv.style.background = 'hsl(' + hslPickedColor[0]*360 + ', ' + hslPickedColor[1]*100 + '%, ' + hslPickedColor[2]*100 + '%)'
		// $colorDiv.style.background = 'red'

		$body.appendChild($colorDiv)

		console.log(this.pickedColor)
	}

	pickColorFromDisplay(x, y)
	{
		const data = this.getImageData()
		const newX = Math.floor(x/(this.video.offsetWidth / this.canvas.offsetWidth))
		const newY = Math.floor(y/(this.video.offsetHeight / this.canvas.offsetHeight))
		const clickedPixelIndex = ((this.canvas.offsetWidth * 4) * newY) + (newX * 4)
		console.log('x: ' + newX)
		console.log('y: ' + newY)

		
		const hslPickedColor = this.rgbToHsl(data[clickedPixelIndex], data[clickedPixelIndex + 1], data[clickedPixelIndex + 2])
		this.pickedColor = {
			h : hslPickedColor[0],
			l : hslPickedColor[2]
		}
		
		// Create div showing what color has been picked 
		const $body = document.querySelector('body')
		const $colorDiv = document.createElement('div')
		$colorDiv.style.display = 'inline-block'
		$colorDiv.style.width = '20px'
		$colorDiv.style.height = '20px'
		$colorDiv.style.background = 'hsl(' + hslPickedColor[0]*360 + ', ' + hslPickedColor[1]*100 + '%, ' + hslPickedColor[2]*100 + '%)'
		// $colorDiv.style.background = 'red'

		$body.appendChild($colorDiv)

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
		this.trackedPixels = []

		const data = this.getImageData() 
		this.trackedPixels = []

		for (let i = 0; i < data.length; i += 8) 
		{
			const hslPickedColor = this.rgbToHsl(data[i], data[i + 1], data[i + 2])
			const h = hslPickedColor[0]
			const l = hslPickedColor[2]

			if (this.colorInterval(h, l)) {
				this.position.x = Math.floor((i % (this.canvas.offsetWidth * 4)) / 4)
				this.position.y = Math.floor(i / (this.canvas.offsetWidth * 4))

				this.trackedPixels.push(i/4)
		

				// this.context.clearRect(this.position.x, this.position.y, 1, 1
			}
		}
		
		if(this.hitboxNumber === 1)
		{
			this.drawMainHitbox(this.hitboxesCalculator())
		}
		else if(this.hitboxNumber === 2)
		{
			this.drawDoubleHitboxes(this.hitboxesCalculator())
		}
	}

	colorInterval(h, l)
	{
		const hInterval = 0.03
		return 	(h > this.pickedColor.h - hInterval && h < this.pickedColor.h + hInterval) && (l > 0.3 && l < 0.6)
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
	
			if(hitboxes[biggest].length > this.hitboxSize)
			{
				this.drawHitbox(min, max)
				
				this.mainHitboxPosition.x = max.x - ((max.x - min.x) / 2)
				this.mainHitboxPosition.y = max.y - ((max.y - min.y)/2)
			}
			// else
			// {
			// 	this.mainHitboxPosition.x = 0
			// 	this.mainHitboxPosition.y = 0
			// }

		}
	}
	
	drawDoubleHitboxes(hitboxes)
	{
		if(hitboxes.length > 0)
		{
			let biggest = 0
			let biggish = 0
	
			for(let i = 1; i < hitboxes.length; i++)
			{
				if(hitboxes[i].length > hitboxes[biggish].length)
				{
					if(hitboxes[i].length > hitboxes[biggest].length)
					{
						biggish = biggest
						biggest = i
					}
					else
					{
						biggish = i
					}
				}
			}

			let minBiggest = this.getMinHitbox(hitboxes, biggest)
			let maxBiggest = this.getMaxHitbox(hitboxes, biggest)

			let minBiggish = this.getMinHitbox(hitboxes, biggish)
			let maxBiggish = this.getMaxHitbox(hitboxes, biggish)
	
			if(hitboxes[biggest].length > this.hitboxSize)
			{
				if(biggest !== 0)
				{
					if(hitboxes[biggish].length > this.hitboxSize)
					{
						this.drawHitbox(minBiggish, maxBiggish)
						
						this.secondHitboxPosition.x = maxBiggish.x - ((maxBiggish.x - minBiggish.x) / 2)
						this.secondHitboxPosition.y = maxBiggish.y - ((maxBiggish.y - minBiggish.y)/2)
					}
				}
				
				this.drawHitbox(minBiggest, maxBiggest)
				
				this.mainHitboxPosition.x = maxBiggest.x - ((maxBiggest.x - minBiggest.x) / 2)
				this.mainHitboxPosition.y = maxBiggest.y - ((maxBiggest.y - minBiggest.y)/2)
			}
		}
	}	

	drawHitbox(min, max)
	{
		this.context.clearRect(min.x, min.y, 1, 10)
		this.context.clearRect(min.x, min.y, 10, 1)

		this.context.clearRect(min.x, max.y, 1, -10)
		this.context.clearRect(min.x, max.y, 10, 1)

		this.context.clearRect(max.x, min.y, 1, 10)
		this.context.clearRect(max.x, min.y, -10, 1)
		
		this.context.clearRect(max.x, max.y, 1, -10)
		this.context.clearRect(max.x, max.y, -10, 1)
	}

	getMinHitbox(hitboxes, hitbox)
	{
		let min = {
			x: hitboxes[hitbox][0] % this.canvas.offsetWidth,
			y: hitboxes[hitbox][0] / this.canvas.offsetWidth
		}

		for(let j = 1; j < hitboxes[hitbox].length; j++)
		{
			let current = {
				x: hitboxes[hitbox][j] % this.canvas.offsetWidth,
				y: hitboxes[hitbox][j] / this.canvas.offsetWidth
			}

			if(current.x < min.x)
			{
				min.x = current.x
			}
			if(current.y < min.y)
			{
				min.y = current.y
			}
		}

		return min
	}

	getMaxHitbox(hitboxes, hitbox)
	{
		let max = {
			x: hitboxes[hitbox][0] % this.canvas.offsetWidth,
			y: hitboxes[hitbox][0] / this.canvas.offsetWidth
		}

		for(let j = 1; j < hitboxes[hitbox].length; j++)
		{
			let current = {
				x: hitboxes[hitbox][j] % this.canvas.offsetWidth,
				y: hitboxes[hitbox][j] / this.canvas.offsetWidth
			}

			if(current.x > max.x)
			{
				max.x = current.x
			}
			if(current.y > max.y)
			{
				max.y = current.y
			}
		}

		return max
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
