angular.module("myApp.services", [])
    .service("ClientTypeService", function () {
        this.Types = {
            Individual: 0,
            Organization: 1
        };
    });



var app = angular.module("myApp", ['myApp.services'])
    .controller("ClientController", ['$scope', '$http', 'ClientTypeService', function ($scope, $http, ClientTypeService) {


        $scope.AllClientTypes = [];
        $scope.clientCounts = [];

        $scope.loadClientCounts = function () {
            $http.get("/api/Client/GetClientCounts")
                .then(function (response) {
                    console.log("Count", response.data);
                    $scope.clientCounts = response.data;
                    $scope.AllClientTypes = response.data;

                })
                .catch(function (error) {
                    console.error("Error in Getting Count");
                });
        };

        $scope.filterClients = function () {
            if ($scope.selectedClientType) {
                var selectedType = parseInt($scope.selectedClientType);

                $scope.AllClientTypes = $scope.clientCounts.filter(function (clientType) {
                    return clientType.Type === selectedType;
                });
                console.log("After Filter", $scope.AllClientTypes);
            }
            else {
                $scope.AllClientTypes = $scope.clientCounts;
            }
        };

        $scope.loadClientCounts();
    }]);

app.filter('type', function () {
    return function (input) {
        switch (input) {
            case 0:
                return 'Individual';
            case 1:
                return 'Organization';
            default:
                return input;
        }
    };
});