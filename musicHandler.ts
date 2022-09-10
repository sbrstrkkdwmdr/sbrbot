import ytdl = require('youtube-mp3-downloader');
module.exports = (userdata, client, commandStruct, config, oncooldown) => {


    const YD = new ytdl({
        "ffmpegPath": "C:\\ffmpeg\\bin\\ffmpeg.exe",        // Where is the FFmpeg binary located?
        "outputPath": "./files/",    // Where should the downloaded and encoded files be stored?
        "youtubeVideoQuality": "highestaudio",       // What video quality should be used?
        "queueParallelism": 2,                  // How many parallel downloads/encodes should be started?
        "progressTimeout": 2000,                // How long should be the interval of the progress reports
        "allowWebm": false                      // Enable download from WebM sources
    });



    function downloadAsMp3(url:string){
        let init1;
        let init2;
        init1 = url.split('v=')[0]
        if(url.includes('youtu.be')){
            init1 = url.split('youtu.be/')[1]
        }
        if(url.includes('&')){
            init2 = url.split('&')[0]
        } else {
            init2 = init1
        }
        YD.download(init2, init2 + '.mp3');
    }
}