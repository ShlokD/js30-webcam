const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

let width = 0;
let height = 0;

const getVideo = () => {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false})
  .then(localMediaStream => {
    console.log(localMediaStream);
    video.src = window.URL.createObjectURL(localMediaStream);
    video.play();
  })
  .catch(err => {
    console.log(err);
  });
}

const paintVideoToCanvas = ev => {
    width = ev.target.videoWidth;
    height = ev.target.videoHeight;
    canvas.width = width;
    canvas.height = height;
  
    console.log(width, height);
  
    setInterval(() => {
      ctx.drawImage(video, 0, 0, width, height);
      let pixels = ctx.getImageData(0, 0, width, height);
      pixels = rgbSplit(pixels);
      ctx.globalAlpha = 0.3;
      ctx.putImageData(pixels, 0, 0);
    }, 16)
}

const takePhoto = () => {
  snap.currentTime = 0;
  snap.play();

  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'screenshot');
  link.innerHTML = `<img src=${data} alt="screenshot" />`
  strip.insertBefore(link, strip.firstChild);
};

const redEffect = pixels => {
  for (let i = 0; i < pixels.data.length ; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 60;
    pixels.data[i + 1] = pixels.data[i + 1] - 50;
    pixels.data[i + 2] = pixels.data[i + 2] * 0.25;
  }
  return pixels;
};

const rgbSplit = pixels => {
  for (let i = 0; i < pixels.data.length ; i += 4) {
    pixels.data[i - 350] = pixels.data[i + 0];
    pixels.data[i + 300] = pixels.data[i + 1];
    pixels.data[i - 350] = pixels.data[i + 2];
  }
  return pixels;
};
 
getVideo();

video.addEventListener('canplay', paintVideoToCanvas)