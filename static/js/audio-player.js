$(document).ready(function() {
  init();

  function init() {
    var current = 0;
    var audio = $('#audio');
    var playlist = $('#playlist');
    var tracks = playlist.find('.play-button');
    var len = tracks.length - 1;
    audio[0].volume = 1;
    audio[0].play();
    playlist.on('click', 'a.play-button', function(e) {
      e.preventDefault();
      link = $(this);
      current = link.parent().index();
      run(link, audio[0]);
    });
    
    audio[0].addEventListener('ended', function(e) {
      current++;
      if (current == len) {
        current = 0;
        link = playlist.find('a.podcast-grid-inner')[0];
      } else {
        link = playlist.find('a.podcast-grid-inner')[current];
      }
      run($(link), audio[0]);
    });
  }

  function run(link, player) {
    player.src = link.attr('href');
    par = link.parent();
    par.addClass('active').siblings().removeClass('active');
    player.load();
    player.play();
    var currentTitle = document.querySelector(".podcast-grid-item.active h2").innerHTML
    var currentImage = document.querySelector(".podcast-grid-item.active").getAttribute("data-image")
    var currentSeries = document.querySelector(".podcast-grid-item.active").getAttribute("data-series")
    document.getElementById("player-title").innerHTML = currentTitle
    document.querySelector(".audio-player img").src = currentImage + "?w=150&h=150&q=50&fit=fill"
    document.getElementById("player-series").innerHTML = currentSeries
  }
});

function copyText() {
  var copyText = document.getElementById("podcast-link");
  copyText.select();
  document.execCommand("Copy");
  alert("The following has been copied to your clipboard: " + copyText.value);
}