/**
 * Created by esattahaibis on 2016-11-08.
 */

$(document).ready(function(e){
    $('.search-panel .dropdown-menu').find('a').click(function(e) {
        e.preventDefault();
        var param = $(this).attr("href").replace("#","");
        var concept = $(this).text();
        $('.search-panel span#search_concept').text(concept);
        $('.input-group #search_param').val(param);
    });

    var opts = {
        lines: 13 // The number of lines to draw
        , length: 28 // The length of each line
        , width: 14 // The line thickness
        , radius: 42 // The radius of the inner circle
        , scale: 1 // Scales overall size of the spinner
        , corners: 1 // Corner roundness (0..1)
        , color: '#000' // #rgb or #rrggbb or array of colors
        , opacity: 0.25 // Opacity of the lines
        , rotate: 0 // The rotation offset
        , direction: 1 // 1: clockwise, -1: counterclockwise
        , speed: 1 // Rounds per second
        , trail: 60 // Afterglow percentage
        , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
        , zIndex: 2e9 // The z-index (defaults to 2000000000)
        , className: 'spinner' // The CSS class to assign to the spinner
        , top: '300%' // Top position relative to parent
        , left: '50%' // Left position relative to parent
        , shadow: false // Whether to render a shadow
        , hwaccel: false // Whether to use hardware acceleration
        , position: 'absolute' // Element positioning
    };
    var target = document.querySelector('#spinner');



    // setting up some initial values
    // TODO: find a better way to store these keys
    const API_KEY_PUBLIC = 'fce3fca9aff2ec76f4c3b45e6c282f47';
    const API_KEY_PRIVATE = 'a942fe807817c5eb6feedc1d4fa437030023807d';
    var section = document.querySelector('section#results');


    // Select the search button and add event listener
    document.querySelector('#searchButton').addEventListener('click', function (event) {
        event.preventDefault();

        var spinner = new Spinner(opts).spin(target);
        section.innerHTML = '';
        var timeStamp = Date.now() / 1000 | 0;
        var apiKeyHash = md5(timeStamp + API_KEY_PRIVATE + API_KEY_PUBLIC);
        var searchValue = document.querySelector('#searchValue').value;

        $.ajax({
            url: 'https://gateway.marvel.com/v1/public/characters',
            type: 'GET',
            dataType: 'json',
            data: {
                ts:timeStamp ,
                apikey: API_KEY_PUBLIC,
                hash: apiKeyHash,
                nameStartsWith: searchValue,
                orderBy: 'name'
            },
            success: renderData,
            error: displayError
        })
    });

    function renderData(rawData){
        target.display = 'none';

        console.log(rawData);
        var count = rawData.data.count;
        var results = rawData.data.results;


        results.forEach(function (item) {
            var thumbnail = item.thumbnail.path + '/portrait_uncanny.' + item.thumbnail.extension;

            var events = '';
            if(item.events.returned > 0)
                item.events.items.forEach(function (event, index) {
                if(index < parseInt(item.events.returned) -1) {
                    events += event.name + ', ';
                } else {
                    events += event.name ;
                }

            });
            var series = '';
            if(item.series.returned > 0)
                item.series.items.forEach(function (s, index) {
                    if(index < parseInt(item.series.returned) - 1) {
                        series += s.name + ', ';
                    } else {
                        series += s.name ;
                    }
                });

            var stories = '';
            if(item.stories.returned > 0)
                item.stories.items.forEach(function (story, index) {
                    if(index < parseInt(item.stories.returned) - 1) {
                        stories += story.name + ', ';
                    } else {
                        stories += story.name ;
                    }
                });


            var template =
               `<div class="panel panel-info">
                            <div class="panel-heading">
                                <h3 class="panel-title">${item.name}</h3>
                            </div>
                            <div class="panel-body">
                                <div class="row">
                                    <div class="col-md-3 col-lg-3 " align="center"><img alt="Character Pic" src="${thumbnail}" class="img-responsive"> </div>

                                    <div class=" col-md-9 col-lg-9 ">
                                        <table class="table table-user-information">
                                            <tbody>
                                            <tr>
                                                <td>Description:</td>
                                                <td>${item.description}</td>
                                            </tr>
                                            <tr>
                                                <td>Events:</td>
                                                <td>${events}</td>
                                            </tr>
                                            <tr>
                                                <td>Series:</td>
                                                <td>${series}</td>
                                            </tr>

                                            <tr>
                                            <tr>
                                                <td>Stories:</td>
                                                <td>${stories}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>`;

            section.innerHTML += template;

        })
    }


    function displayError(error) {
        console.log(error);
    }
});
