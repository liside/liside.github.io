<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>SpeakQL</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js" integrity="sha384-vFJXuSJphROIrBnz7yo7oB41mKfc8JzQZiCq4NCceLEaO4IHwicKwpJf9c9IpFgh" crossorigin="anonymous"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/js/bootstrap.min.js" integrity="sha384-alpBpkh1PFOepccYVYDB4do5UnbKysX5WZXm3XxPqe5iKTfUKjNkCk9SaVuEZflJ" crossorigin="anonymous"></script>
  <script src="keywords.js"></script>
</head>
<body>
  <!-- navigation bar -->
  <nav aria-label="breadcrumb" role="navigation">
    <ol class="breadcrumb justify-content-between">
      <li class="breadcrumb-item active" aria-current="page" onClick="window.location.reload()">SpeakQL User Study</li>
    </ol>
  </nav>

  <!-- Experiment page -->
  <div class="container" id="experiments">
    <div class="card">
      <div class="card-header">
      </div>
      <div class="card-body">
        <!-- Audio info -->
        <form>
          <div class="form-group">
            <label for="exampleFormControlTextarea1">Audio url:</label>
            <textarea class="form-control" rows="3" id="audio-url"></textarea>
          </div>
        </form>
        <!-- ASR result -->
        <form>
          <div class="form-group">
            <label for="exampleFormControlTextarea1">Result:</label>
            <textarea class="form-control" rows="3" id="result-text" disabled>default text</textarea>
          </div>
        </form>

        <!-- record button -->
        <div class="row justify-content-md-center" id="record-block">
          <div class="col">
            <button type="button" class="btn btn-block btn-success" id="record-button">Record</button>
          </div>
        </div>
      </div>
    </div>
  </div>

</body>
<script>
$( document ).ready(() => {
  let recognizing = false;
  let recognition = new webkitSpeechRecognition();
  // let grammar = '#JSGF V1.0; grammar commands; public <command> = '
  //             + keywords.map((keyword) => keyword.toLowerCase()).join(' | ');
  // let speechRecognitionList = new webkitSpeechGrammarList();
  // speechRecognitionList.addFromString(grammar, 1.0);
  // recognition.grammars = speechRecognitionList;
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.maxAlternatives = 5;
  recognition.lang = 'en-US';

  recognition.onresult = function(event) {
    let asrResult = [];
    let index = 0;
    let maxConf = -1;
    for (let i = 0; i < event.results[0].length; i++) {
      asrResult.push([event.results[0][i]['transcript'], event.results[0][i]['confidence']])
      if (event.results[0][i]['confidence'] > maxConf) {
        maxConf = event.results[0][i]['confidence'];
        index = i;
      }
    }
    console.log(asrResult)
    $("#result-text").val(JSON.stringify(asrResult));
  };

  $( "#record-button" ).on("click", () => {
    $( "#record-button" ).toggleClass("btn-success");
    $( "#record-button" ).toggleClass("btn-danger");
    if (recognizing) {
      recognizing = false;
      recognition.stop();
      $( "#record-button" ).text("Record")
    } else {
      recognizing = true;
      let audio = new Audio($("#audio-url").val());
      audio.play()
      recognition.start();
      $( "#record-button" ).text("Listening....")
    }
  });
});
</script>
</html>
