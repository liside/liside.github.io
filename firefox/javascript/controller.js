String.prototype.width = (font) => {
  let f = font || '12px arial',
      o = $('<div></div>')
            .text(this)
            .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
            .appendTo($('body')),
      w = o.width();

  o.remove();

  return w;
}

$( document ).ready(() => {
  let recorder = new Recorder({
    sampleRate: 44100,
    bitRate: 128,
    success: function() {
    },
    error: function(msg) {
      alert(msg);
    },
    fix: function(msg) {
      alert(msg);
    }
  });
  let mode = "s";
  let experimentId = "default";
  let recognizing = false;
  let recognition = new webkitSpeechRecognition();
  let logs = {};
  let counter = 0;
  let currentQueryFinished = false;
  let currentRecordTry = 0;
  let currentCheckTry = 0;
  let writtenUnlocked = false;
  let round = 1;
  let currentResult =
                [{'content': ['select', 'employee_names', 'from', 'catalog'],
                  'position': {
                    1: ['employee_names', 'employees', 'employers'],
                    3: ['catalog', 'phonetool']
                  }},
                  {'content': ['select', 'employee_names', 'from', 'catalog'],
                  'position': {
                    1: ['sdasd', 'adssa', 'asdas'],
                    3: ['gdfgdf', 'gfgfdgfd']
                  }}]
  let currentQuery = [{'content': ['select', 'employee_names', 'from', 'catalog'],
                  'position': {
                    1: ['employee_names', 'employees', 'employers'],
                    3: ['catalog', 'phonetool']
                  }}];
  let firstSpeakIndex = 0;

  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.maxAlternatives = 5;
  recognition.lang = 'en-US';
  // var grammar = '#JSGF V1.0; grammar commands; public <command> = sum'
  // var speechRecognitionList = new webkitSpeechGrammarList();
  // speechRecognitionList.addFromString(grammar, 1.0);
  // recognition.grammars = speechRecognitionList;
  let searchLog = (logs, pattern) => {
      for (let log of logs) {
        if (log["event"].includes(pattern)) {
          return new Date(log["timestamp"]);
        }
      }
  };

  let countLog = (logs, pattern) => {
    let count = 0;
    for (let log of logs) {
      if (log["event"].includes(pattern)) {
        count += 1;
      }
    }
    return count;
  }

  let parseLog = (event, data) => {
    return {"timestamp": new Date().toString(), "event": event, "data": data};
  };

  let nextQuery = () => {
    logs["meta_timestamp"].push(parseLog("completed query " + counter));

    // save meta data
    start = new Date(logs[counter]["events"][0]["timestamp"]);
    end = searchLog(logs["meta_timestamp"], "completed query " + counter);
    speakStart = new Date(logs[counter]["events"][firstSpeakIndex]["timestamp"]);
    logs[counter]["metadata"] = {
      "mode": (mode == "s") ? "speak" : "type",
      "complexity": experimentConfig["queries"][counter]["complexity"],
      "end_to_end_time": end - start,
      "speakql_time": (mode == "s") ? end - speakStart : 0,
      "num_of_speaking": currentRecordTry,
      "num_of_correctness_check": currentCheckTry,
      "units_of_efforts": countLog(logs[counter]["events"], "clicked"),
      "num_of_key_strokes": logs[counter]["keyup"].length,
      "query_id": counter
    };

    // Save logs to the server
    $.ajax({
      method: "POST",
      url: experimentConfig["saveLogQueryAPI"],
      data: JSON.stringify({"id": experimentId, "data": logs}),
      contentType: "application/json"
    }).done((data) => {

    });

    counter += 1;
    if (counter == experimentConfig["numOfQueries"] && round <= 2) {
      counter = 0;
      round += 1;
      mode = mode == "w" ? "s" : "w";
    }

    if (counter < experimentConfig["numOfQueries"]) {
      logs[counter] = {
        "events": [],
        "keyup": []
      };

      // reset local config
      firstSpeakIndex = 0;
      currentQueryFinished = false;
      currentRecordTry = 0;
      currentCheckTry = 0;
      $('#query-result').empty();
      $( "#structure-control" ).empty();
      $( "#result-status" ).removeClass("alert-danger").removeClass("alert-success");
      $( "#result-status" ).text("");
      $( "#result-text" ).val("");
      $( "#InterimModal" ).modal("toggle");
      $( "#InterimModalLongTitle" ).text("Ready for query " + counter);

      if (mode == "w") {
        mode = "s";
        $( "#switch-mode" ).text(mode)
        $( "#record-block" ).show();
        $( "#result-text" ).prop("readonly", true);
        writtenUnlocked = false;
      } else {
        mode = "w";
        $( "#switch-mode" ).text(mode);
        $( "#result-text" ).prop("readonly", false);
        $( "#record-block" ).hide();
        writtenUnlocked = true;
      }
    } else {
        logs["meta_timestamp"].push(parseLog("Finished the experiment"));
        window.location.href = "thankyou.html";
    }
  }

  let propSQL = (query) => {
    $(".SQL").text(query);
  };

  let propDropdown = (data) => {
    // TODO: fake data
    // comment out when backend is done
    // data = {'content': ['select', 'employee_names', 'from', 'catalog'],
    //                 'position': {
    //                   1: ['employee_names', 'employees', 'employers'],
    //                   3: ['catalog', 'phonetool']
    //                 }};

    currentQuery = data;
    $('#query-result').empty();
    $( "#result-text" ).prop("readonly", true);
    writtenUnlocked = false;

    // generate length for each selectable block
    var block_length = {};
    for (key in data['position']) {
      block_length[key] = data['position'][key].reduce((m, e) => Math.max(m, e.width() * 3), 0);
    }
    var display = '<div class="card"><div class="card-body row">';
    for (i = 0; i < data['content'].length; i++) {
      if (i in data['position']) {
        display += '<div class="dropdown query-content">' +
                   '<button style="width:'+ block_length[i] +'px!important;" class="btn btn-warning dropdown-toggle" type="button"' +
                   'data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                   data['content'][i] +
                   '</button>' +
                   '<div class="dropdown-menu" aria-labelledby="dropdownMenu2">';
        for (j = 0; j < data['position'][i].length; j++) {
          display += '<button style="width:'+ block_length[i] +'px!important;" id="drop-' + i + '-' + j + '" class="dropdown-item" type="button">' +
                     data['position'][i][j] +
                     '</button>'
        }
        display += '</div></div>'
      } else {
        display += '<h4 class="query-content">' +
        data['content'][i].toUpperCase() + '</h4>';
      }
    }
    display += '</div></div>';
    $('#query-result').append(display);
    $( "#result-text" ).val( data["content"].join(" "));
  };

  recognition.onerror = function(event) {
    logs[counter]["events"].push(parseLog("ASR error"));
  };

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
    logs[counter]["events"].push(parseLog("ASR result", asrResult));

    // Send the request to server
    $.ajax({
      method: "POST",
      url: experimentConfig["getQueryAPI"],
      data: JSON.stringify(asrResult),
      contentType: 'application/json',
      success: (xhr) => {
        logs[counter]["events"].push(parseLog("Sent ASR result", counter + "-" + currentRecordTry + ".mp3"));
      }
    }).done((data) => {
      logs[counter]["events"].push(parseLog("Received final request", data));
      currentResult = data;
      let radioButton = "<div class='btn-group btn-group-toggle' data-toggle='buttons'>";
      for(let i = 0; i < currentResult.length; i++) {
        radioButton += "<label class='btn btn-secondary structures' id='structure-" + i + "'>";
        radioButton += "<input type='radio' name='options' autocomplete='off'> " + i + " </label>"
      }
      radioButton += "</div>";
      $( "#structure-control" ).empty();
      $( "#structure-control" ).append(radioButton);
      $( "#structure-0" ).addClass('active');
      propDropdown(currentResult[0]);
    });

    // Save recorded audio
    recorder.getBlob((blob) => {
      let fd = new FormData();
      fd.append("data", blob);
      fd.append("experimentId", experimentId);
      fd.append("fileName", counter + "-" + currentRecordTry + ".mp3");
      $.ajax({
        type: 'POST',
        url: experimentConfig["saveAudioQueryAPI"],
        data: fd,
        processData: false,
        contentType: false
      }).done((data) => {

      });
    });

    currentRecordTry += 1;
  };

  $( "#record-button" ).on("click", () => {
    $( "#record-button" ).toggleClass("btn-success");
    $( "#record-button" ).toggleClass("btn-danger");
    if (recognizing) {
      if (currentRecordTry == 0) {
        firstSpeakIndex = logs[counter]["events"].length;
      }
      logs[counter]["events"].push(parseLog("stopped recording"));
      recognition.stop();
      // recorder.stop();
      $( "#record-button" ).text("Record")
      recognizing = false;
    } else {
      logs[counter]["events"].push(parseLog("started recording"));
      let audio = document.querySelectorAll('audio');
      for (var i = 0; i < audio.length; i++) {
        if (!audio[i].paused) {
          audio[i].pause();
        }
      }
      // recorder.start();
      recognition.start();
      $( "#record-button" ).text("Listening....")
      recognizing = true;
    }
  });

  // Listener on switch mode
  $( "#switch-mode" ).on( "click", () => {
    if (mode == "w") {
      mode = "s";
      $( "#switch-mode" ).text(mode)
      $( "#record-block" ).show();
      $( "#result-text" ).prop("readonly", true);
    } else {
      mode = "w";
      $( "#switch-mode" ).text(mode);
      $( "#result-text" ).prop("readonly", false);
      $( "#record-block" ).hide();
    }
  });

  // listener on start button on intro page
  $( "#start-experiment" ).on("click", () => {
    counter = 0;
    currentQueryFinished = false;
    logs[counter] = {
      "events": [],
      "keyup": []
    };
    experimentId = $( "#experiment-id" ).val();
    logs["experimentId"] = experimentId;
    logs["meta_timestamp"] = [parseLog("started a new experiment")];

    $("#instructions").hide();
    $("#experiments").show();
    $( "#InterimModal" ).modal("toggle");
    $( "#InterimModalLongTitle" ).text("Ready for query " + counter + "?");
  });

  $( "#start-query" ).on("click", () => {
    propSQL(experimentConfig["queries"][counter]["description"]);
    logs["meta_timestamp"].push(parseLog("started query " + counter));
  })

  $( "#check-button" ).on("click", () => {
    logs[counter]["events"].push(parseLog("clicked check"));
    currentCheckTry += 1;
    let result = $( "#result-text" ).val();

    $.ajax({
      method: "POST",
      url: experimentConfig["checkQueryAPI"],
      data: JSON.stringify(
        {"original": experimentConfig["queries"][counter]["answer"], "result": result}
      ),
      contentType: 'application/json',
      success: (xhr) => {
        logs[counter]["events"].push(parseLog("Sent check correctness request"));
      }
    }).done((data) => {
      logs[counter]["events"].push(parseLog("Received correctness result", data));

      let compare = data;
      if (compare) {
        $( "#result-status" ).text("Well done! Now submit to proceed to next query!")
        $( "#result-status" ).removeClass("alert-danger").addClass("alert-success");
        currentQueryFinished = true;
      } else {
        $( "#result-status" ).text("Mismatched! Please try again!")
        $( "#result-status" ).removeClass("alert-success").addClass("alert-danger");
      }
    });
  });

  $( "#submit-button" ).on("click", () => {
    logs[counter]["events"].push(parseLog("clicked submit"));

    if (currentQueryFinished) {
      nextQuery();
    } else {
      $( "#skipConfirmModal" ).modal("toggle");
    }
  });

  $( "#skip-button" ).on("click", () => {
    logs[counter]["events"].push(parseLog("clicked to skip to next query"));
    nextQuery();
  });

  $( "#result-text" ).on("click", () => {
    logs[counter]["events"].push(parseLog("clicked textarea"));
    if (!writtenUnlocked && mode != "w") {
      $( "#writtenConfirmModal" ).modal("toggle");
    }
  });

  $("#result-text").on("keyup", () => {
  // $("#result-text").on("change", () => {
    logs[counter]["keyup"].push(parseLog("modified sql by typing", $("#result-text").val()))
  });

  $( "#unlock-button" ).on("click", () => {
    writtenUnlocked = true;
    $('#query-result').empty();
    $( "#structure-control" ).empty();
    $( "#result-text" ).prop("readonly", false);
  });

  $( document ).on("click", ".structures", function() {
    let id = parseInt($(this).attr("id").split("-")[1]);
    logs[counter]["events"].push(parseLog("clicked to change query structure " + id));
    propDropdown(currentResult[id]);
  });

  $( document ).on("click", ".dropdown-toggle", ()=> {
    logs[counter]["events"].push(parseLog("clicked dropdown to show literal options"));
  });

  $( document ).on("click", ".dropdown-menu", ()=> {
    logs[counter]["events"].push(parseLog("clicked to change literal"));
  });

  $( document ).on("click", ".dropdown-item", function(){
    let id = $(this).attr("id").split("-").slice(1, 3).map(x => parseInt(x));
    let result = currentQuery["content"].slice();
    result[id[0]] = currentQuery["position"][id[0]][id[1]];
    logs[counter]["events"].push(parseLog("clicked item in dropdown",
      {"selected": currentQuery["position"][id[0]][id[1]],
       "result": result.join(" ")}));

    $( "#result-text" ).val(result.join(" "));
    $(this).parent().parent().find(".btn").html($(this).text());
    $(this).parent().parent().find(".btn").val($(this).text());
  })
});
