var song
let songs = []
var img
var fft
var particles = []

let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");

let track_index = 0

var track_list = [
  'song1.mp3',
  'song2.mp3',
  'song3.mp3'
]

function preload() {
  for(let filename of track_list) {
    songs.push(loadSound(filename))
  }
  img = loadImage('pic.jpg')
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  song = songs[track_index]
  fft = new p5.FFT(0.6)
  angleMode(DEGREES)
  imageMode(CENTER)
  rectMode(CENTER)
  img.filter(BLUR, 5)
  resetValues()
  noLoop()
}

function draw() {
  background(0)  

  translate(width / 2, height / 2)

  fft.analyze()
  amp = fft.getEnergy(20, 200)

  push()
  if(amp > 230) {
    rotate(random(-0.5, 0.5))
  }

  image(img, 0, 0, width, height)
  pop()

  var alpha = map(amp, 0, 255, 180, 150)
  fill(0, alpha)
  noStroke()
  rect(0, 0, width, height)

  stroke(255)
  strokeWeight(3)
  noFill()

  var wave = fft.waveform()

  for(var t = -1; t <= 1; t += 2) {
    beginShape()
    for(var i = 0; i <= 180; i += 0.5) {
      var index = floor(map(i, 0, 180, 0, wave.length - 1))

      var r = map(wave[index], -1, 1, 150, 350)

      var x = r * sin(i) * t
      var y = r * cos(i)
      vertex(x, y)
    }
    endShape()
  }
  
  var p = new Particle()
  particles.push(p)

  for(var i = 0; i < particles.length; i++) {
    if(!particles[i].edges()) {
      particles[i].update(amp > 230)
      particles[i].show()
    }
    else {
      particles.splice(i, 1)
    }
  }

  seekUpdate()
  auto()
  
}

class Particle {
  constructor() {
    this.pos = p5.Vector.random2D().mult(250)
    this.vel = createVector(0, 0)
    this.acc = this.pos.copy().mult(random(0.00001, 0.0001))

    this.w = random(3,5)

    this.color = [random(200, 255), random(200, 255), random(200, 255)]
  }

  update(cond) {
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    if(cond) {
      this.pos.add(this.vel)
      this.pos.add(this.vel)
      this.pos.add(this.vel)
    }
  }

  edges() {
    if(this.pos.x < -width / 2 || this.pos.x > width / 2 || this.pos.y < -height / 2 || this.pos.y > height / 2) {
      return true
    }
    else {
      return false
    }
  }

  show() {
    noStroke()
    fill(this.color)
    ellipse(this.pos.x, this.pos.y, this.w)
  }
}

function resetValues() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}

function playpauseTrack() {
  if(song.isPlaying()) {
    song.pause()
    playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
    noLoop()
  }
  else {
    song.play()
    playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
    loop()
  }
}

function nextTrack() {
  if(song.isPlaying()) {
    song.stop()
    track_index = track_index + 1
    if(track_index > track_list.length - 1) {
      track_index = 0
    }
    song = songs[track_index]
    resetValues()
    song.play()
  }
  else {
    song.stop()
    track_index = track_index + 1
    if(track_index > track_list.length - 1) {
      track_index = 0
    }
    song = songs[track_index]
    resetValues()
  }
}

function prevTrack() {
  if(song.isPlaying()) {
    song.stop()
    track_index = track_index - 1
    if(track_index < 0) {
      track_index = track_list.length - 1
    }
    song = songs[track_index]
    resetValues()
    song.play()
  }
  else {
    song.stop()
    track_index = track_index - 1
    if(track_index < 0) {
      track_index = track_list.length - 1
    }
    song = songs[track_index]
    resetValues()
  }  
}

function seekTo() {
  let seekto = song.duration() * (seek_slider.value / 100)
  song.jump(seekto)
}

function setVolume() {
  song.volume = outputVolume(volume_slider.value /100)
}

function seekUpdate() {
  let seekPosition = 0;

  if (!isNaN(song.duration())) {
    seekPosition = song.currentTime() * (100 / song.duration());

    seek_slider.value = seekPosition

    let currentMinutes = Math.floor(song.currentTime() / 60)
    let currentSeconds = Math.floor(song.currentTime() - currentMinutes * 60)
    let durationMinutes = Math.floor(song.duration() / 60)
    let durationSeconds = Math.floor(song.duration() - durationMinutes * 60)

    if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
    if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
    if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
    if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

    curr_time.textContent = currentMinutes + ":" + currentSeconds
    total_duration.textContent = durationMinutes + ":" + durationSeconds
  }
}

function auto() {
  if(song.currentTime() >= song.duration() - 1 ) {
    song.stop()
    track_index = track_index + 1
    if(track_index > track_list.length - 1) {
      track_index = 0
    }
    song = songs[track_index]
    resetValues()
    song.play()
  }  
}