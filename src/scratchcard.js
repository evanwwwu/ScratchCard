function ScratchCard(selector, options) {
  let defaultOptions = {
    width: "300",
    height: "300",
    imageForwardSrc: null,
    colorForward: "gray",
    imageBackgroundSrc: null,
    colorBackground: "red",
    clearRadius: 50,
    percentToFinish: null,
    callback: function () {
      console.log("card clear");
    },
    open: function () {
      console.log("card open");
    }
  };
  this.canvas = document.createElement("canvas");
  this.ctx = this.canvas.getContext('2d');
  this.progress = 0;
  this.old = { x: 0, Y: 0 };
  this.feedback = false;
  this.options = Object.assign({}, defaultOptions, options);
  this.init(selector);
}
ScratchCard.prototype.init = function (selector) {
  let self = this, bgc = "";
  console.log(selector);
  selector.appendChild(self.canvas);
  self.canvas.width = self.options.width;
  self.canvas.height = self.options.height;
  new Promise(function (resolve) {
    if (self.options.imageForwardSrc) {
      let img = new Image();
      img.onload = function () {
        self.ctx.drawImage(img, 0, 0, self.options.width, self.options.height);
        resolve(true);
      }
      img.src = self.options.imageForwardSrc;
    }
    else {
      self.ctx.fillStyle = self.options.colorForward;
      self.ctx.fillRect(0, 0, self.options.width, self.options.height);
      resolve(true);
    }
  }).then(function () {
    if (self.options.imageBackgroundSrc) {
      selector.style.background = "url(" + self.options.imageBackgroundSrc + ")";
      // bgc += "background:url(" + self.options.imageBackgroundSrc + ");";
    } else {
      selector.style.background = self.options.colorBackground;
      // bgc += "background:" + self.options.colorBackground + ";";
    }
    // bgc += "background-size: cover;font-size: 0;display:inline-block;";
    selector.style.backgroundSize = "cover";
    selector.style.fontSize = "0";
    selector.style.display = "inline-block";
    // selector.style = bgc;
  });
  this.drawSet();
}
ScratchCard.prototype.drawSet = function () {
  let self = this,
    isPress = false,
    eventDown = ['mousedown', 'touchstart'],
    eventMove = ['mousemove', 'touchmove'],
    eventUp = ['mouseup', 'touchend'];
  function getProgress() {
    let pix = self.options.width * self.options.height;
    let holes = 0;
    let data = self.ctx.getImageData(0, 0, self.options.width, self.options.height).data;
    for (let index = 3, count = data.length; index < count; index += 4) {
      if (data[index] >= 255) {
        holes++;
      }
    }
    let percent = Math.round((pix - holes) / pix * 100 * Math.pow(10, 2)) / Math.pow(10, 2);
    return percent;
  }
  function onMouseDown(e) {
    let boundingRect = self.canvas.getBoundingClientRect();
    isPress = true;
    self.old = { x: e.clientX || e.targetTouches[0].clientX, y: e.clientY || e.targetTouches[0].clientY };
    self.old.x -= boundingRect.left;
    self.old.y -= boundingRect.top;
    self.ctx.globalCompositeOperation = 'destination-out';
    self.ctx.beginPath();
    self.ctx.arc(self.old.x, self.old.y, self.options.clearRadius / 2, 0, 2 * Math.PI);
    self.ctx.fill();
  }

  function onMouseMove(e) {
    e.preventDefault();
    if (isPress) {
      let boundingRect = self.canvas.getBoundingClientRect();
      var x = e.clientX || e.targetTouches[0].clientX;
      var y = e.clientY || e.targetTouches[0].clientY;
      x -= boundingRect.left;
      y -= boundingRect.top;
      self.ctx.beginPath();
      self.ctx.arc(self.old.x, self.old.y, self.options.clearRadius / 2, 0, 2 * Math.PI);
      self.ctx.fill();
      self.ctx.lineWidth = self.options.clearRadius;
      self.ctx.beginPath();
      self.ctx.moveTo(self.old.x, self.old.y);
      self.ctx.lineTo(x, y);
      self.ctx.stroke();
      self.old = { x: x, y: y };
      self.progress = getProgress();
      if (self.options.percentToFinish && self.progress >= self.options.percentToFinish) {
        finish();
      }
    }
  }
  function onMouseUp(e) {
    isPress = false;
  }
  // finish。
  function finish() {
    eventDown.forEach(function (event) {
      self.canvas.removeEventListener(event, onMouseDown, true);
    });
    eventMove.forEach(function (event) {
      self.canvas.removeEventListener(event, onMouseMove, true);
    });
    eventUp.forEach(function (event) {
      self.canvas.removeEventListener(event, onMouseUp, true);
    });
    self.ctx.clearRect(0, 0, self.options.width, self.options.height);
    return self.options.callback();
  }
  function onOpenOnce(e) {
    if (!self.feedback) {
      self.feedback = true;
      return self.options.open();
    }
  }

  eventDown.forEach(function (event) {
    self.canvas.addEventListener(event, onMouseDown, true);
    self.canvas.addEventListener(event, onOpenOnce, { "once": true, "capture": true });
  });
  eventMove.forEach(function (event) {
    self.canvas.addEventListener(event, onMouseMove, true);
  });
  eventUp.forEach(function (event) {
    self.canvas.addEventListener(event, onMouseUp, true);
  });
}