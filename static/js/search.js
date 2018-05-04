const search = instantsearch({
    appId: 'VFNZSMYZTP',
    apiKey: '0715aead48751fb9eafd37c1fbc7e343',
    indexName: 'SOGMI.org',
    urlSync: true,
    searchParameters: { distinct: true }
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
    '<div class="hit-image" style="background-image: URL({{featuredImage}}?w=150&h=150&fit=fill&f=face&q=80)"></div>' +
    '<div class="hit-content">'+
      '<p class="title">{{{_highlightResult.title.value}}}</p>' +
      '<p>{{{_snippetResult.description.value}}}...</p>' + 
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