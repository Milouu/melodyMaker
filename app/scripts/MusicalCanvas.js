class MusicalCanvas 
{
	constructor() 
	{
		// Webcam video
		this.video = this.setWebcam()

		// Canvas variables
		this.canvas = this.setCanvasVideo(this.video, 120, 67.5)
		this.context = this.canvas.getContext('2d')
		// For dev
		this.canvas.style.position = 'absolute'
		this.canvas.style.top = 0

		// Position of a pixel, used to clear rect a tracked pixels, may be obsolete
		this.position = { x: 0, y: 0 }
		
		this.mousePos = { x: 0, y: 0 }

		// Color picked with eye dropper
		this.pickedColor

		// Table containing all the pixels entering in the color interval of the picked color
		this.trackedPixels = []

		// Variables used to control the speed of requestAnimationFrame
		this.fps = 30
		this.now
		this.then = Date.now()
		this.interval = 1000/this.fps
		this.delta

		// Number of hitboxes being tracked
		this.hitboxNumber = 1
		// Minimum number of pixels needed for a hitbox to be considered as such
		this.hitboxSize = 20

		// Hitboxes positions 
		this.mainHitboxPosition = {}
		this.secondHitboxPosition = {}

		// Calibration variables
    this.videoHover = false
		this.videoContainer = undefined
		this.eyeDropperRing = undefined
		this.eyeDropperSquare = undefined

		// Event Listeners
		document.addEventListener('mousemove', (event) => this.saveMousePos(event.clientX, event.clientY))

		this.video.addEventListener('play', this.draw())

		// this.canvas.addEventListener('click', (event) => this.eyeDropperStatus === true ? this.pickColor(event.clientX - this.canvas.offsetLeft, event.clientY - this.canvas.offsetTop) : false)

		// window.addEventListener('resize', this.canvasResize())
	}

	// Activates video from webcam and returns it
	setWebcam() 
	{
		// Set variables
		const $calibrationVideo = document.querySelector('.videoContainer')
		console.log($calibrationVideo)
		const $video = document.createElement('video')
    
		// Place the video tag at the end of body
		$calibrationVideo.appendChild($video)
		
		$video.classList.add('calibration__video')
		
		// Navigator supports getUserMedia ?
		if(navigator.mediaDevices.getUserMedia)
		{
			// Recover only video of webcam
			navigator.mediaDevices.getUserMedia({ video: true, audio: false })
				.then(localMediaStream => 
				{
					// Video tag takes source of webcam and play video
					$video.srcObject = localMediaStream
					$video.play()
					$video.style.opacity = '1'
				})
				.catch(error => 
				{
					// For dev without webcam
					$video.src = "assets/videos/minions.mp4"
					$video.play()
					$video.muted = true
					$video.loop = true
					$video.style.opacity = '1'

					window.alert('The following error occurred: ' + error.name)
				})
		}
		else 
		{
			window.alert('getUserMedia not supported')
		}	

		return $video
	}
		
	// Appends a canvas of a given size in body
	// Useless video passage ???
	setCanvasVideo(video, width, height)
	{
		const $container = document.querySelector('body')
		const $canvas = document.createElement('canvas')

		$canvas.width = width
		$canvas.height = height

		$container.appendChild($canvas)
		
		return $canvas
	}

	// Draws the canvas based on the webcam video at 30fps
	draw()
	{		
		requestAnimationFrame(this.draw.bind(this))
		
		this.now = Date.now()
		this.delta = this.now - this.then
		
		if (this.delta > this.interval) 
		{				
			this.then = this.now - (this.delta % this.interval)		
			
			this.clearCanvas()
			this.context.drawImage(this.video, 0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight)
			
			if(this.videoHover === true)
			{
				this.eyeDropperColorUpdate(this.mousePos.x - this.video.offsetLeft - this.videoContainer.offsetLeft, this.mousePos.y - this.video.offsetTop - this.videoContainer.offsetTop)
			}
			
			if(this.pickedColor)
			{
				this.findColor()
			}
		}
	}

	// Saves mouse position
	saveMousePos(x, y)
	{
		this.mousePos.x = x
		this.mousePos.y = y
	}
	
	// Clears canvas
	clearCanvas() 
	{
		this.context.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight)
	}

	// Returns getImageData results from canvas 
	getImageData()
	{
		return this.context.getImageData(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight).data
	}
	
	// Picks a color by clicking on canvas 
	pickColor(x, y)
	{
		const data = this.getImageData()
		const clickedPixelIndex = ((this.canvas.offsetWidth * 4) * y) + (x * 4)
		
		// Converts the rgb color in hsl
		const hslPickedColor = this.rgbToHsl(data[clickedPixelIndex], data[clickedPixelIndex + 1], data[clickedPixelIndex + 2])
		this.pickedColor = {
			h : hslPickedColor[0],
			l : hslPickedColor[2]
		}

		console.log(this.pickedColor)
	}

	// Picks a color by clicking on webcam video
	pickColorFromDisplay(x, y, color)
	{
		const data = this.getImageData()
		const newX = Math.floor(x/(this.video.offsetWidth / this.canvas.offsetWidth))
		const newY = Math.floor(y/(this.video.offsetHeight / this.canvas.offsetHeight))
		const clickedPixelIndex = ((this.canvas.offsetWidth * 4) * newY) + (newX * 4)

		const hslPickedColor = this.rgbToHsl(data[clickedPixelIndex], data[clickedPixelIndex + 1], data[clickedPixelIndex + 2])
		this.pickedColor = {
			h : hslPickedColor[0],
			l : hslPickedColor[2]
		}
		
		// Update color card with the color picked during calibration
    color.style.background = 'hsl(' + hslPickedColor[0]*360 + ', ' + hslPickedColor[1]*100 + '%, ' + hslPickedColor[2]*100 + '%)'
	}

	// Updates eyedropper color depending on the pixel hovered
	eyeDropperColorUpdate(x, y)
	{
    const data = this.getImageData()
    const hoverX = Math.floor(x/(this.video.offsetWidth / this.canvas.offsetWidth))
    const hoverY = Math.floor(y/(this.video.offsetHeight / this.canvas.offsetHeight))
    const hoveredPixelIndex = ((this.canvas.offsetWidth * 4) * hoverY) + (hoverX * 4)
    
    const hslHoveredColor = this.rgbToHsl(data[hoveredPixelIndex], data[hoveredPixelIndex + 1], data[hoveredPixelIndex + 2])
    
    this.eyeDropperRing.style.borderColor = 'hsl(' + hslHoveredColor[0]*360 + ', ' + hslHoveredColor[1]*100 + '%, ' + hslHoveredColor[2]*100 + '%)'
    this.eyeDropperSquare.style.background = 'hsl(' + hslHoveredColor[0]*360 + ', ' + hslHoveredColor[1]*100 + '%, ' + hslHoveredColor[2]*100 + '%)' 
  }
  
  setEyedropperVariables(container, ring, square)
  {
    this.videoContainer = container
    this.eyeDropperRing = ring
		this.eyeDropperSquare = square
  }
	
	// Converts rgb color to hsl
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
		
	// Tracks every pixel on canvas whose color is in a certain interval of the eye dropped color
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
				// this.position.x = Math.floor((i % (this.canvas.offsetWidth * 4)) / 4)
				// this.position.y = Math.floor(i / (this.canvas.offsetWidth * 4))
				// this.context.clearRect(this.position.x, this.position.y, 1, 1)

				this.trackedPixels.push(i/4)
		

			}
		}
		
		// Launches hitboxes calculation and tracking based on the number of hitboxes to track
		if(this.hitboxNumber === 1)
		{
			this.drawMainHitbox(this.hitboxesCalculator())
		}
		else if(this.hitboxNumber === 2)
		{
			this.drawDoubleHitboxes(this.hitboxesCalculator())
		}
	}

	// Checks if a given color is in the interval of the eye dropped color
	colorInterval(h, l)
	{
		const hInterval = 0.03
		return 	(h > this.pickedColor.h - hInterval && h < this.pickedColor.h + hInterval) && (l > 0.3 && l <= 0.7)
	}

	// Calculates and draws the biggest hitbox
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
	
	// Calculates and draws the 2 biggest hitboxes
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

	// Draws a hitbox on canvas
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

	// Calculates the first point in a given hitbox
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

	// Calculates the last point in a given hitbox 
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

	// Resizes the canvas
	// Obsolete ?
	canvasResize()
	{
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight
	}

	// Calculates all the existing hitboxes based on the pixels tracked 
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
