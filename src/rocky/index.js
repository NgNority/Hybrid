var rocky = require('rocky');

var fonts = ['26px bold Leco-numbers-am-pm', '20px bold Leco-numbers'];

var obstructed = false;

var weather;

function fractionToRadian(fraction) {
  return fraction * 2 * Math.PI;
}

function drawTime(ctx, w, d) {
  //d.toLocaleString(undefined, {hour12 : 'true'});
  var rawTime = d.toLocaleTimeString(undefined, { hour: '2-digit' }) + ':' + d.toLocaleTimeString(undefined, { minute: '2-digit' });
  var rawtime2 = rawTime.split('PM').join('').trim();
  var rawtime3 = rawtime2.split('AM').join('').trim();
  var time = rawtime3.split(' ').join('').trim();
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  
  if(obstructed == true){
    ctx.font = fonts[1];
    if (ctx.canvas.clientWidth == ctx.canvas.clientHeight) {
      ctx.fillText(time, w / 2, 25, w);
    } else {
      ctx.fillText(time, w / 2, 20, w);
    }
  }else {
  ctx.font = fonts[0];
  
  if (parseInt(d.toLocaleTimeString(undefined, { minute: 'numeric' })) >= 50) {
    if (ctx.canvas.clientWidth == ctx.canvas.clientHeight) {
      ctx.fillText(time, w / 2, 125, w);
    } else {
      ctx.fillText(time, w / 2, 110, w);
    }
  }
  else if (parseInt(d.toLocaleTimeString(undefined, { minute: 'numeric' })) <= 10) {
    if (ctx.canvas.clientWidth == ctx.canvas.clientHeight) {
      ctx.fillText(time, w / 2, 125, w);
    } else {
      ctx.fillText(time, w / 2, 110, w);
    }

  } else {
    if (ctx.canvas.clientWidth == ctx.canvas.clientHeight) {
      ctx.fillText(time, w / 2, 25, w);
    } else {
      ctx.fillText(time, w / 2, 20, w);
    }
  }
}
}


function drawDate(ctx, w, h, d) {
  var date = d.toLocaleDateString(undefined, { day: '2-digit' });
  // Add this to the front of date to show the mothth number (This has not been tested yet)
  // d.toLocaleDateString(undefined, {month: '2-digit'})  + '.' +

  if (ctx.canvas.clientWidth == ctx.canvas.clientHeight) {
    ctx.fillStyle = 'white';
    ctx.font = fonts[1];
    ctx.textAlign = 'center';
    //ctx.fillText(date, 120, 79, w);
    ctx.fillText(date, 120, 79, w);

  } else {
    if(obstructed == true){
      ctx.fillStyle = 'white';
      ctx.font = fonts[1];
      ctx.textAlign = 'center';
      //ctx.fillText(date, 95, 72, w);
      ctx.fillText(date, 95, 45, w);
    }else{
      ctx.fillStyle = 'white';
      ctx.font = fonts[1];
      ctx.textAlign = 'center';
      //ctx.fillText(date, 95, 72, w);
      ctx.fillText(date, 95, 72, w);
    }
  }

}

function adjustHeight(ctx, yCoordinate) {
  return yCoordinate * (ctx.canvas.unobstructedHeight / ctx.canvas.clientHeight);
}

function drawWeather(ctx, weather, w, d) {
  // Create a string describing the weather
  if(weather.country == 'US'){
    var weatherString = weather.fahrenheit + '°F, ' + weather.desc;
    console.log("In the US: " + weather.country);
  }else{
    var weatherString = weather.celcius + '°C, ' + weather.desc;
  }
  //var weatherString = weather.fahrenheit + 'ºF, ' + weather.desc;
  ctx.fillStyle = 'lightgray';
  ctx.textAlign = 'center';

  if (parseInt(d.toLocaleTimeString(undefined, { minute: 'numeric' })) >= 50) {
    if (ctx.canvas.clientWidth == ctx.canvas.clientHeight) {
      ctx.fillText(weatherString, w / 2, 115);
    } else {
      ctx.fillText(weatherString, w / 2, 100);
    }
  } else if (parseInt(d.toLocaleTimeString(undefined, { minute: 'numeric' })) <= 10) {
    if (ctx.canvas.clientWidth == ctx.canvas.clientHeight) {
      ctx.fillText(weatherString, w / 2, 115);
    } else {
      ctx.fillText(weatherString, w / 2, 100);
    }
  } else {
    if (ctx.canvas.clientWidth == ctx.canvas.clientHeight) {
      ctx.fillText(weatherString, w / 2, 50);
    } else {
      ctx.fillText(weatherString, w / 2, 45);
    }
  }

  // // Draw the text, top center
  // ctx.fillStyle = 'lightgray';
  // ctx.textAlign = 'center';
  // ctx.font = '14px Gothic';
  // ctx.fillText(weatherString, ctx.canvas.unobstructedWidth / 2, 2);
}

function drawMarkers(ctx) {
  if (ctx.canvas.clientWidth == ctx.canvas.clientHeight) {
    // Device is round
    ctx.fillStyle = 'white';
    ctx.fillRect(89.5, 0, 2, 24);
    ctx.fillRect(89, 156, 2, 24);
    ctx.fillRect(156, 91, 24, 2);
    ctx.fillRect(0, 91, 24, 2);
  } else {
    // Device is not round
    ctx.fillStyle = 'white';
    ctx.fillRect(72, 0, 2, 20);
    ctx.fillRect(71, adjustHeight(ctx, 144), 2, 24);
    ctx.fillRect(120, adjustHeight(ctx, 85), 24, 2);
    ctx.fillRect(0, adjustHeight(ctx, 85), 24, 2);
    // }
  }
}

function drawHand(ctx, cx, cy, angle, length, color) {
  var x2 = cx + Math.sin(angle) * length;
  var y2 = cy - Math.cos(angle) * length;

  ctx.lineWidth = 4;
  ctx.strokeStyle = color;

  ctx.beginPath();

  ctx.moveTo(cx, cy);
  ctx.lineTo(x2, y2);

  ctx.stroke();
}

rocky.on('draw', function (event) {
  var ctx = event.context;
  var d = new Date();

  ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

  var w = ctx.canvas.unobstructedWidth;
  var h = ctx.canvas.unobstructedHeight;

  if(h < 168){
    obstructed = true;
  }else {
    obstructed = false;
  }

  drawMarkers(ctx);

  var cx = w / 2;
  var cy = h / 2;
  if(obstructed == true){

  }else{
  if (weather) {
    drawWeather(ctx, weather, w, d);
  }
}
  drawDate(ctx, w, h, d);

  var maxLength = (Math.min(w, h) - 20) / 2;

  var minuteFraction = (d.getMinutes()) / 60;
  var minuteAngle = fractionToRadian(minuteFraction);

  


  var hourFraction = (d.getHours() % 12 + minuteFraction) / 12;
  var hourAngle = fractionToRadian(hourFraction);
  
  if (rocky.watchInfo.platform === 'diorite') {
    drawHand(ctx, cx, cy, hourAngle, maxLength * 0.6, "white");
  } else {
    drawHand(ctx, cx, cy, hourAngle, maxLength * 0.6, "red");
  }

  drawHand(ctx, cx, cy, minuteAngle, maxLength, "white");
  drawTime(ctx, w, d);
  

  ctx.fillStyle = 'white';
  ctx.rockyFillRadial(cx, cy, 0, 4, 0, 2 * Math.PI);

});

rocky.on('message', function (event) {
  // Receive a message from the mobile device (pkjs)
  var message = event.data;

  if (message.weather) {
    // Save the weather data
    weather = message.weather;

    // Request a redraw so we see the information
    rocky.requestDraw();
  }
});

rocky.on('minutechange', function (event) {
  rocky.requestDraw();
});

rocky.on('hourchange', function (event) {
  // Send a message to fetch the weather information (on startup and every hour)
  rocky.postMessage({ 'fetch': true });
});