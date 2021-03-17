const video = document.getElementById("video");
var unknown = 0
function postAndRedirect(url, postData)
{
    var postFormStr = "<form method='GET' action='" + url + "'>\n";

    for (var key in postData)
    {
        if (postData.hasOwnProperty(key))
        {
            postFormStr += "<input type='hidden' name='" + key + "' value='" + postData[key] + "'></input>";
        }
    }

    postFormStr += "</form>";
    var formElement = $(postFormStr);
    $('body').append(formElement);
    $(formElement).submit();
}

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/static/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/static/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/static/models"),
  faceapi.nets.ssdMobilenetv1.loadFromUri("/static/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/static/models")
]).then(startVideo);

async function startVideo() {
  const labeledFaceDescriptors = await loadLabeledImages();
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
  navigator.getUserMedia(
    {
      video: {}
    },
    stream => (video.srcObject = stream),
    err => console.error(err)
  );

  video.addEventListener("play", () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);
    const timeValue = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withFaceDescriptors();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
      const results = resizedDetections.map(d =>
        faceMatcher.findBestMatch(d.descriptor)
      );
      results.forEach((result, i) => {
        const box = resizedDetections[i].detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, {
          label: result.toString()
        });
        
        if (results[i]._label !='unknown'){
          postAndRedirect('/face_success/',{name:results});
          clearInterval(timeValue);
        }
        else{
          unknown += 1
          if (unknown>4){
            postAndRedirect('/face_fail/');
            clearInterval(timeValue)
          }

        }
      
        drawBox.draw(canvas);
      });
      
    }, 1000
    
    ); 
    
});
}
  
function loadLabeledImages() {
  const labels = [
    "Teaw",
  ];
  return Promise.all(
    labels.map(async label => {
      const descriptions = [];
      for (let i = 1; i <= 2; i++) {
        const img = await faceapi.fetchImage(
          `/static/labeled_images/${label}/${i}.jpg`
        );
        const detections = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        descriptions.push(detections.descriptor);
      }

      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    })
  );
}
