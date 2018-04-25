const space = 'vfgh62eq5a4k';
const environment = 'master'; // defaults to 'master' if not set
const token = '00ae52ccc5d7e46ccbfcace0e86689f47068f627843cd0a7a7107824eb58b384';
const entryId = '4AntGXKRpYUyQ4qQiy0Ksk';

var galleryContainer = document.getElementById("gallery");
const fetchData = new XMLHttpRequest();
fetchData.open('GET', 'https://cdn.contentful.com/spaces/' + space + '/environments/' + environment + '/entries/' + entryId + '?access_token=' + token);
fetchData.onload = function() {
    var eventData = JSON.parse(fetchData.responseText);
    console.log(eventData);
    /*renderHTML(eventData);*/
    /*renderAssets(eventData);*/
};
fetchData.send();

/*function renderHTML(data) {
    var htmlString = ""; 

    for (i = 0; i < data.fields.gallery.length; i++) {
        var assetId = data.fields.gallery[i].sys.id;
        htmlString += '<div style="margin-bottom: 10px">Image Id #' + 
        [i] + '<br/>' + assetId + '</div>';
    };

    galleryContainer.insertAdjacentHTML('beforeend', htmlString );
    
    testFunction();
}*/

/*function renderHTML(data) {
    var htmlString = '';
    for (i = 0; i < data.fields.gallery.length; i++) {
        var assetId = data.fields.gallery[i].sys.id;
        htmlString += '<a href="#" class="gallery-grid-item w-inline-block w-lightbox" id="' + assetId + '"></a>';
    };

    galleryContainer.insertAdjacentHTML('beforeend', htmlString );
}*/

//start loop

/*function renderAssets(data) {
    for (i = 0; i < data.fields.gallery.length; i++) {
        var fetchAsset = new XMLHttpRequest();
        var myAsset = data.fields.gallery[i].sys.id;
        var assetImage = document.getElementById( myAsset );
        fetchAsset.open('GET', 'https://cdn.contentful.com/spaces/' + space + '/environments/' + environment + '/assets/' + myAsset + '?access_token=' + token);
        fetchAsset.onload = function() {
            var assetData = JSON.parse(fetchAsset.responseText);
            console.log(assetData);
            renderAsset(assetData);
        };
        fetchAsset.send();

        function renderAsset(asset) {
            var htmlString2 = '';
            var url = asset.fields.file.url;
            var name = asset.fields.file.filename;
            var type = asset.fields.file.contentType;
            var width = asset.fields.file.details.image.width;
            var height = asset.fields.file.details.image.height;
            var filesize = asset.fields.file.details.size;
            var id = asset.sys.id
            htmlString2 += '<div class="gallery-grid-photo" style="background-image:URL(' + url + '?w=500&h=500&fit=fill&q=60)"></div>' +
            '<script type="application/json" class="w-json">{"items": [' + 
            '{"type": "image","origFileName": "' + name + '","width": ' + width + ',"height": ' + height + ',"fileSize": ' + 
            filesize + ',"url": "https:' + url + '"}],"group": "Gallery"}</script>'

            document.getElementById( id ).innerHTML = htmlString2;
        };
    };
}*/