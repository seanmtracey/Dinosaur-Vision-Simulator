# Dinosaur Vision Simulator
An AR/VR hack that lets you see like a dinosaur!

_(Dinosaur onesie optional, but recommended for best experience)_

### **WARNING: Probably not suitable for sufferers of epilepsy**

## "Don't move, its vision is based on movement..."

I've never seen Jurassic Park, but this classic line is something I've been aware of for years. I thought it would cool to try and visualise what that would actually look like. We now have devices in our pockets that are powerful enough to do cool, real-time, computer vision thingies - and with the new super powers that web has gained over the years (getUserMedia + canvas), it's now super-easy to put something together.

## So, what does it look like?

Well, it looks a bit like this:

![dino-vision-snap](https://cloud.githubusercontent.com/assets/913687/24591290/1015b268-17f6-11e7-97c4-02010d0437e0.jpg)

This is a snapshot of the feed the simulator generates as the viewers head moves. The image is of the Central Hall in Southampton, where Hacksoton 2017 was held.

## How does it work?

The view is an edge detection effect applied to a live video feed. The view is generated by calculating the difference between two frames of a live video stream. 

Frame 1 is the current frame of the video, and frame 2 is the previous frame. Both frames are converted from color to greyscale, and then each pixel of each image is checked to see if it has changed significantly between the two frames. If a significant change has occurred, the pixel is colored red (the natural color for a blood thirsty dinosaur to see), if no change has occurred the pixel is colored black.

## Constraints/Things to finish

1. The camera is not guarenteed to be environment facing. The front-facing camera will sometimes load instead. If you're using Firefox on Android, you can choose the back-facing camera to create the effect, otherwise it's the luck of the draw with other browsers (for the time being).

2. The old getUserMedia interface is used. I like it better, but I'll upgrade the new promise-based interface when I get a chance.

## Here's a picture of me hunting my (very still) prey

![dino-vision-demo-stage jpg-large](https://cloud.githubusercontent.com/assets/913687/24591365/810a2764-17f7-11e7-8745-be48310419f8.jpg)

