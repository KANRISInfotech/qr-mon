# qr-mon
Microservice to create qr data stream in NodeJS with customized design options.

##
<p float="left">
<img src="assets/examples/qr_2.svg" width="100" style="margin-left:25px;display:inline-block" > &nbsp; &nbsp;
<img src="assets/examples/qr_3.svg" width="100" style="margin-left:25px;display:inline-block" > &nbsp; &nbsp;
<img src="assets/examples/qr_4.svg" width="100" style="margin-left:25px;display:inline-block" > &nbsp; &nbsp;
<img src="assets/examples/qr_5.svg" width="100" style="margin-left:25px;display:inline-block" > &nbsp; &nbsp;
</p>

### Getting Started
```
npm install qr-mon --save
```
```
var express = require('express');
var app = express();

var qr-mon = require('qr-mon');

app.get('/qr', function(req, res) {
    let error = false;
    let options = req.query;
    let text = req.query.data ? req.query.data : error = true;
    if (!error) {
        var code = qr-mon.generate(text, options);
        res.type('svg');
        res.send(code);
    } else {
        res.status(500);
        res.json({ error: 'Needs text to be encoded' });
    }
});

app.listen(3000, () => console.log('server started.....'));
```

### HTML
```
<img src="http://localhost:3000/qr?data=my_data">
```


## Options

### **margin**
_Margin to be left around the qr code_  
>Type: Integer  
Default : 0

### **background**
_Background color the qr code_  
>Type: rgb()  
Default : transparent

### **shape**
_Shape of points inside the body of the qr code_  
>Default : 0, square

Option | Image
--- | ---
0 | ![body shape 0 image](/assets/body_shapes/body_0.svg " ")
1 | ![body shape 1 image](/assets/body_shapes/body_1.svg " ")
2 | ![body shape 2 image](/assets/body_shapes/body_2.svg " ")
3 | ![body shape 3 image](/assets/body_shapes/body_3.svg " ")

### **eye ball**
_Shape of inner section of the position markers_  
>Default : 0, square

Option | Image
--- | ---
0 | ![eye ball 0 image](/assets/eye_balls/eye_ball_0.svg " ")
1 | ![eye ball 1 image](/assets/eye_balls/eye_ball_1.svg " ")
2 | ![eye ball 2 image](/assets/eye_balls/eye_ball_2.svg " ")
3 | ![eye ball 3 image](/assets/eye_balls/eye_ball_3.svg " ")
4 | ![eye ball 4 image](/assets/eye_balls/eye_ball_4.svg " ")
5 | ![eye ball 5 image](/assets/eye_balls/eye_ball_5.svg " ")
6 | ![eye ball 6 image](/assets/eye_balls/eye_ball_6.svg " ")
7 | ![eye ball 7 image](/assets/eye_balls/eye_ball_7.svg " ")
8 | ![eye ball 8 image](/assets/eye_balls/eye_ball_8.svg " ")
rotary | ![rotary eye ball image](/assets/eye_balls/eye_ball_rotary.svg " ")

### **eye frame**
_Shape of frame of the position markers_  
>Default : 0, square

Option | Image
--- | ---
0 | ![eye_frame 0 image](/assets/eye_frame/eye_frame_0.svg " ")
1 | ![eye_frame 1 image](/assets/eye_frame/eye_frame_1.svg " ")
2 | ![eye_frame 2 image](/assets/eye_frame/eye_frame_2.svg " ")
3 | ![eye_frame 3 image](/assets/eye_frame/eye_frame_3.svg " ")
4 | ![eye_frame 4 image](/assets/eye_frame/eye_frame_4.svg " ")
5 | ![eye_frame 5 image](/assets/eye_frame/eye_frame_5.svg " ")
6 | ![eye_frame 6 image](/assets/eye_frame/eye_frame_6.svg " ")
7 | ![eye_frame 7 image](/assets/eye_frame/eye_frame_7.svg " ")
8 | ![eye_frame 8 image](/assets/eye_frame/eye_frame_8.svg " ")

### **fill**
_Fill of the qr code_  
>Default : solid

+ solid
+ linear-horizontal
+ linear-vertical
+ radial

### **color**
_color of the qr code_  
>Default :  
solid : black  
gradient : rgb(0,0,0), rgb(2,119,189)

+ solid - rgb / name of color
+ gradient - color1.color2 

<p float="center">
<img src="assets/examples/qr.svg" width="150" style=";display:inline-block"/>
&nbsp;
<img src="assets/examples/qr_1.svg" width="150" style="margin-left:25px;display:inline-block" left="0"/>
</p>

```
1. http://localhost:3000/qr?data=my_data&fill=radial&color=red.black

2. http://localhost:3000/qr?data=my_data&fill=radial  (default-fill)
```