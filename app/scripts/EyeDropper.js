class EyeDropper 
{
	constructor(canvasVideo)
	{
		this.canvasVideo = canvasVideo
  }
  
  pickColor()
  {
    this.canvasVideo.getImageData()
  }
}