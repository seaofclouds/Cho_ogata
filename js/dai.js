$(function (){
    $('body#bowlet div#progress').bind('click', function(event) {
        var length = currentTrack.property('length');
        var inp = event.screenX - Bowtie.currentFrame()[0];
        var result = inp / 200;
        var pos = Math.round(length * result);
        
        iTunes.setPlayerPosition(pos);
        $('div#progress div#bar').animate({width: inp + 'px'}, 100, "swing");  
    });
    $('div#rating a').bind('click', function(event) {
        var rate = $(this).attr('class') * 1;
        
        iTunes.setRating(rate);
        
        updateRating(rate);
        
        return false;
    });
});

var currentTrack;
var currentRating = 0;
var currentState = {
    volume: 100,
};
var toogleTimer = 0;

// player update functions
function playerUpdate() {
    var original = iTunes.playerPosition() / currentTrack.property('length');
    var progress = Math.round(200 * original);
    $('div#progress div#bar').stop().animate({width: progress + 'px'}, 50);
    
    var volume = iTunes.volume();
    
    if (volume != currentState.volume) {
        $('body#bowlet').stop().fadeTo(1000, volume / 100);
    };
    
    currentState.volume = volume;
    
    updateRating(iTunes.rating());
}


function trackUpdate(track) {
    clearTimeout(toogleTimer);
    var title = track.property('title').replace(/^\s+|\s+$/g, '');
    var artist = track.property('artist').replace(/^\s+|\s+$/g, '');
    var album = track.property('album').replace(/^\s+|\s+$/g, '');
    var tlength = track.property('length');
    
    if (title != undefined) {
        if (title.length >= 26) {
            title = title.substring(0,25).replace(/^\s+|\s+$/g, '') + '...'
        };
        $('div#title p').fadeTo(500,0, function() {
            $(this).text(title).fadeTo(500,1);
        });
    } else {
        $('div#title p').fadeTo(500,0,function() {
            $(this).text('No Track selected').fadeTo(500,1);
        });
    };
    
    if (tlength != undefined) {
        $('div#progress').fadeTo(500,1);
        $('div#rating').fadeTo(500,1);
    } else {
        $('div#progress').fadeTo(500,0);
        $('div#rating').fadeTo(500,0);
    };
    
    if (artist != undefined) {
        if (artist.length >= 23) {
            artist = artist.substring(0,22).replace(/^\s+|\s+$/g, '') + '...'
        };
        $('div#info p')
            .attr('class','')
            .fadeTo(500,0, function() {
                $(this)
                    .text(artist)
                    .addClass('artist')
                    .fadeTo(500,1, function() {
                        toogleTimer = setTimeout(toggleInfo, 30000); 
                    });
            });
    } else {
        $('div#info p')
            .attr('class','')
            .fadeOut(500, function() {
                $(this).text('').fadeIn(500);
            });
    };
    
    currentTrack = track;
    
    updateRating(iTunes.rating());
}

function toggleInfo() {
    clearTimeout(toogleTimer);
    var p = $('div#info p');
    var artist = currentTrack.property('artist');
    var album = currentTrack.property('album');
    if ($(p).hasClass('artist')) {
        if (album.length >= 23) {
            album = album.substring(0,22).replace(/^\s+|\s+$/g, '') + '...'
        };
        $(p).fadeTo(1000,0, function() {
            $(this)
                .attr('class','')
                .text(album)
                .addClass('album')
                .fadeTo(1000,1, function() {
                    toogleTimer = setTimeout(toggleInfo, 30000);
                });
        });
    } else if ($(p).hasClass('album')) {
        if (artist.length >= 23) {
            artist = artist.substring(0,22).replace(/^\s+|\s+$/g, '') + '...'
        };
        $(p).fadeTo(1000,0, function() {
            $(this)
                .attr('class','')
                .text(artist)
                .addClass('artist')
                .fadeTo(1000,1, function() {
                   toogleTimer = setTimeout(toggleInfo, 30000); 
                });
        });
    };
}

function updateRating(rating) {
    if (rating != currentRating) {
        if (rating > 0) {
    		$('div#rating a#star0').text('★');
    	} else {
            $('div#rating a#star0').text('☆');
    	}

        if (rating > 20) {
    		$('div#rating a#star1').text('★');
    	} else {
            $('div#rating a#star1').text('☆');
    	}

    	if (rating > 40) {
    		$('div#rating a#star2').text('★');
    	} else {
            $('div#rating a#star2').text('☆');
    	}

        if (rating > 60) {
    		$('div#rating a#star3').text('★');
    	} else {
            $('div#rating a#star3').text('☆');
    	}

    	if (rating > 80) {
    		$('div#rating a#star4').text('★');
    	} else {
            $('div#rating a#star4').text('☆');
    	}
    };
	
	currentRating = rating;
}

// simple logger for debugging
function log(message,status) {
    $('div#debug').css('display','block');
    $('div#debug ul').append('<li class="' + status + '">' + message + '</li>');
}