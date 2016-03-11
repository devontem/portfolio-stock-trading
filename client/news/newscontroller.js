app.controller('NewsController', function($scope, $http){

  

  $http({
  	method: 'Get',
  	url: 'https://access.alchemyapi.com/calls/data/GetNews?apikey=ee1d7c96bf11519e0b3197ac6b975cab043877d6&return=enriched.url.title&start=1457049600&end=1457737200&q.enriched.url.enrichedTitle.entities.entity=|text=IBM,type=company|&q.enriched.url.enrichedTitle.docSentiment.type=positive&q.enriched.url.enrichedTitle.taxonomy.taxonomy_.label=technology%20and%20computing&count=25&outputMode=json',

  }).then( function(res) {
  	console.log(res.data.result,'*****')

  })
})






