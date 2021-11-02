const url = "http://localhost:1337/API"

var processor = {
    timerCallback: function () {
        if (this.video.paused || this.video.ended) {
            return;
        }
        this.computeFrame();
        var self = this;
        setTimeout(function () {
            self.timerCallback();
        }, 1000); // roughly 60 frames per second
    },

    doLoad: function () {
        this.video = document.getElementById("my-video");
        this.c1 = document.getElementById("my-canvas");
        this.ctx1 = this.c1.getContext("2d");
        //var self = this;
        this.video.addEventListener("play",  ()=> {
            this.width = this.video.width;
            this.height = this.video.height;
            this.timerCallback();
        }, false);
        /*
        this.video.addEventListener("play", function () {
            self.width = self.video.width;
            self.height = self.video.height;
            self.timerCallback();
        }, false);*/
    },

    computeFrame: function () {
        this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
        var frame = this.ctx1.getImageData(0, 0, this.width, this.height);
        var l = frame.data.length / 4;

        for (var i = 0; i < l; i++) {
            var grey = (frame.data[i * 4 + 0] + frame.data[i * 4 + 1] + frame.data[i * 4 + 2]) / 3;

            frame.data[i * 4 + 0] = grey;
            frame.data[i * 4 + 1] = grey;
            frame.data[i * 4 + 2] = grey;
        }
        this.ctx1.putImageData(frame, 0, 0);

        this.c1.toBlob(a => { frameBlob = a }, 'image/jpeg');
        return;
    }
};  
async function fetchJson() {
    return (
            fetch(url).then(res => res.json())//.then(data => console.log(data))
   )
}
async function fetchPostJson(data) {
    fetch(url, {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {console.log('Success:', data);})
        .catch((error) => {
            console.error('Error:', error);
        });
}
async function fetchPostBlob(blob) {
    fetch(url+"/blob", {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'image/jpeg',
        },
        body: blob,
    })
        .then(response => response.json())
        .then(data => { console.log('Success:', data); })
        .catch((error) => {
            console.log('Error:', error);
        });
    console.log(blob)
    /*
    var newImg = document.createElement('img'),
        url = URL.createObjectURL(blob);

    newImg.onload = function () {
        // no longer need to read the blob so it's revoked
        URL.revokeObjectURL(url);
    };

    newImg.src = url;
    document.body.appendChild(newImg);
    */
}

function fetchPostCanvas() {
    canvas = document.getElementById("my-canvas");
    canvas.toBlob(fetchPostBlob, 'image/jpeg');
}