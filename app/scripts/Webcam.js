class Webcam 
{
	constructor() 
	{
		// Set variables
		const $body = document.querySelector('body')
		this.$video = document.createElement('video')
    
		// Place the video tag at the end of body
		$body.appendChild(this.$video)
	
		// Navigator supports getUserMedia ?
		if(navigator.mediaDevices.getUserMedia)
		{
			console.log(navigator)
			// Recover only video of webcam
			navigator.mediaDevices.getUserMedia({ video: true, audio: false })
				.then(localMediaStream => 
				{
					// Video tag takes source of webcam and play video
					this.$video.srcObject = localMediaStream
					this.$video.play()
				})
				.catch(error => 
				{
					window.alert('The following error occurred: ' + error.name)
				})
		}
		else { window.alert('getUserMedia not supported') }
	}
}