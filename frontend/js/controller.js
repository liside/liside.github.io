window.onload = function() {
  var start = document.querySelector('#start');
  var stop = document.querySelector('#stop');
  var container = document.querySelector('#audio-container');
  var recorder = new Recorder({
    sampleRate: 44100,
    bitRate: 128,
    success: function() {
      start.disabled = false;
    },
    error: function(msg) {
      alert(msg);
    },
    fix: function(msg) {
      alert(msg);
    }
  });

  start.addEventListener('click', function() {
    this.disabled = true;
    stop.disabled = false;
    var audio = document.querySelectorAll('audio');
    for (var i = 0; i < audio.length; i++) {
      if (!audio[i].paused) {
        audio[i].pause();
      }
    }
    recorder.start();
    $('#query-result').empty();
    $('#query-result').append('loading');
  });

  stop.addEventListener('click', function() {
    $('#audio-container').empty();
    this.disabled = true;
    start.disabled = false;
    recorder.stop();
    recorder.getBlob(function(blob) {
      var fd = new FormData();
      fd.append('data', blob);
      $.ajax({
        type: 'POST',
        url: '/query',
        data: fd,
        processData: false,
        contentType: false
      }).done(function(data) {
        $('#query-result').empty();
        let fakeData = {'content': ['select', 'employee_names', 'from', 'catalog'],
                        'position': {
                          1: ['employee_names', 'employees', 'employers', 'fgdfg'],
                          3: ['catalog', 'phonetool']
                        }};
        let display = '<div class="card"><div class="card-body row">';
        for (i = 0; i < fakeData['content'].length; i++) {
          if (i in fakeData['position']) {
            display += '<div class="dropdown query-content">' +
                       '<button class="btn btn-warning dropdown-toggle" type="button"' +
                       'data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                       fakeData['content'][i] +
                       '</button>' +
                       '<div class="dropdown-menu" aria-labelledby="dropdownMenu2">';
            for (j = 0; j < fakeData['position'][i].length; j++) {
              display += '<button class="dropdown-item" type="button">' +
                         fakeData['position'][i][j] +
                         '</button>'
            }
            display += '</div></div>'
          } else {
            display += '<h4 class="query-content">' +
            fakeData['content'][i].toUpperCase() + '</h4>';
          }
        }
        display += '</div></div>';
        $('#query-result').append(display);
      }).fail(function() {
        $('#query-result').empty();
        // $('#query-result').append('Error! Try again');
        let fakeData = {'content': ['select', 'employee_names', 'from', 'catalog'],
                        'position': {
                          1: ['employee_names', 'employees', 'employers', 'dsds'],
                          3: ['catalog', 'phonetool']
                        }};
        let display = '<div class="card"><div class="card-body row">';
        for (i = 0; i < fakeData['content'].length; i++) {
          if (i in fakeData['position']) {
            display += '<div class="dropdown query-content">' +
                       '<button class="btn btn-warning dropdown-toggle" type="button"' +
                       'data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                       fakeData['content'][i] +
                       '</button>' +
                       '<div class="dropdown-menu" aria-labelledby="dropdownMenu2">';
            for (j = 0; j < fakeData['position'][i].length; j++) {
              display += '<button class="dropdown-item" type="button">' +
                         fakeData['position'][i][j] +
                         '</button>'
            }
            display += '</div></div>'
          } else {
            display += '<h4 class="query-content">' +
            fakeData['content'][i].toUpperCase() + '</h4>';
          }
        }
        display += '</div></div>';
        $('#query-result').append(display);
      });

      var audio = document.createElement('audio');
      audio.src = URL.createObjectURL(blob);
      audio.controls = true;
      container.appendChild(audio);
    });
  });

  $(document).on('click','.dropdown-item', function(){
    $(this).parent().parent().find(".btn").html($(this).text());
    $(this).parent().parent().find(".btn").val($(this).text());
  })
};
