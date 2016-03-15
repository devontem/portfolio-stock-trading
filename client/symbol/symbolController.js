app.controller('SymbolController', function($scope, $http){

  $scope.stockName;

  $scope.result;

  $scope.getStock = function(stock){

    console.log('clicked')

    var xhr = new XMLHttpRequest();
    xhr.open("get", "http://d.yimg.com/aq/autoc?query="+stock+"&region=US&lang=en-US", true);
    xhr.onload = function(data){  //instead of onreadystatechange
        $scope.result = data;
    };
    xhr.send(null);

    // $http.get("http://d.yimg.com/aq/autoc?query="+stock+"&region=US&lang=en-US&callback=YAHOO.util.ScriptNodeDataSource.callbacks")
    // .then(function(response){
    //   $scope.result = response.data;
    // });

  }

    //"http://d.yimg.com/aq/autoc?query=chipotle&region=US&lang=en-US"

})
