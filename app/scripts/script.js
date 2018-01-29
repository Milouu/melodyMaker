const canvasVideo = new CanvasVideo(window.innerWidth, window.innerHeight)
canvasVideo.draw()

const trackingColor = new TrackingColor(160, 160, 130, canvasVideo)
trackingColor.findColor()

const eyeDropper = new eyeDropper(canvasVideo)
