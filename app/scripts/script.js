const webcam = new Webcam()

const canvasVideo = new CanvasVideo(window.innerWidth, window.innerHeight, webcam)
canvasVideo.draw()

const trackingColor = new TrackingColor(160, 160, 130, canvasVideo)
trackingColor.findColor()

const eyeDropper = new EyeDropper(canvasVideo)
