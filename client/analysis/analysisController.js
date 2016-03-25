app.controller('AnalysisController', ['$scope', 'WatchlistFactory','AnalysisFactory', '$window', '$rootScope', function($scope, WatchlistFactory,AnalysisFactory, $window, $rootScope){

  $scope.stock = {};
  // $scope.stock.symbol;
  // var test;

  // console.log('SCOPE SYMBOL:', test)
  var temp = ""
  $scope.stock.symbol='';
  $scope.stock.symbol = $window.sym;
  console.log($scope.stock.symbol,'symbple')
  

  // function watchlistToAnalysis(symbol){
  //   $scope.stock.symbol = symbol;
  //   console.log($scope.stock.symbol,'lolo')
  // }

//   $rootScope.$on('watchToChart', function(event, data){
//     console.log('DATATATTAT', data)
//     console.log(test, 'TEST TEST TEST')
//     test = data.symbol;
//     console.log('INSIDE ROOT', data.symbol)
//     console.log(test, 'WS WS WS')
//   });

// console.log('AFTER:', test)



  // $rootScope.$on('symbolAnalysis', function (event, data){
  //   console.log(data,'data');
  //   $scope.stock.symbol = data;
  //   console.log($scope.stock.symbol, 'yoyo');


  //   //watchlistToAnalysis(data);
  // })

  $scope.submitted = false;

  $scope.stockinfo = function(stock){
    AnalysisFactory.getinfo(stock)
      .then(function(stock){
        $scope.stock = stock;
        console.log($scope.stock)
      }).then(function(){
        $scope.submitted = true;
      })
  }

  $scope.getchart = function(stock){
    stock.end = moment(stock.end).format("YYYY-MM-DD").toString();
    stock.start = moment(stock.start).format("YYYY-MM-DD").toString();
    AnalysisFactory.getchart(stock)
      .then(function(){
        d3.select('#the_SVG_ID').remove();

        var svg = d3.select("#wow").append("svg").attr("id","the_SVG_ID")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.csv("/analysis/data.csv", function(error, data) {
          if (error) throw error;
            data.forEach(function(d){

            d.date = formatDate.parse(d.Date);
            d.close = +d.Close;
          })

          x.domain(d3.extent(data, function(d) { return d.date; }));
          y.domain(d3.extent(data, function(d) { return d.close; }));

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Price ($)");

          svg.append("path")
              .datum(data)
              .attr("class", "line")
              .attr("d", line);
        });
      });
   $scope.stock.symbol = '';
  };

  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var formatDate = d3.time.format("%Y-%m-%d");

  var x = d3.time.scale()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var line = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.close); });

  var svg = d3.select("#wow").append("svg").attr("id","the_SVG_ID")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



}]);