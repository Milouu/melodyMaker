const webcam = new Webcam()

const canvasVideo = new CanvasVideo(window.innerWidth, window.innerHeight, webcam)
canvasVideo.draw()

const eyeDropper = new EyeDropper(canvasVideo)

const trackingColor = new TrackingColor(canvasVideo, eyeDropper)  

const drumKit = new DrumKit(trackingColor)

// const oscillator = new Oscillator(trackingColor)

