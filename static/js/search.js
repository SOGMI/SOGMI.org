const search = instantsearch({
    appId: 'VFNZSMYZTP',
    apiKey: '0715aead48751fb9eafd37c1fbc7e343',
    indexName: 'SOGMI.org',
    urlSync: true
  });
  
  search.addWidget(
    instantsearch.widgets.stats({
      container: '#stats',
    })
  );

  search.addWidget(
    instantsearch.widgets.searchBox({
      container: '#search-input',
      placeholder: 'Search Site Content'
    })
  );


  var hittemplate =
  '<a href={{relpermalink}} class="hit">' +
    '<div class="hit-image" style="background-image: URL({{featuredimage}}{{profilephoto}}?w=200&q=80)"></div>' +
    '<div class="hit-content">'+
      '<p class="title">{{{_highlightResult.title.value}}}</p>' +
      '<p>{{{_highlightResult.description.value}}}</p>' + 
      '<p class="itemsection">{{section}}</p>' +
    '</div>' +
  '</a>';


  search.addWidget(
    instantsearch.widgets.hits({
      container: '#hits',
      templates: {
        empty: 'No Results',
        item: hittemplate,
      }
    })
  );

  search.start();