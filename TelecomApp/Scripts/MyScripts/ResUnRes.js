angular.module("myApp", [])
    .controller("DeviceReportsController", ['$scope', '$http', function ($scope, $http) {

        $scope.DeviceReports = [];
        $scope.filteredDevices = [];
        $scope.Devices = [];

        $http.get('/api/Device/GetAllDeviceReports')
            .then(function (response) {
                $scope.DeviceReports = response.data;
                $scope.filteredDevices = response.data;
                $scope.UnReserved = true;
                $scope.Reserved = true;
                console.log("All Reserved Numbers:", $scope.DeviceReports);
            })
            .catch(function (error) {
                console.log("Can't Bring Reserved Numbers:", error);
            });


        $http.get('/api/Device/GetAllDevice')
            .then(function (response) {
                $scope.devices = response.data;
                console.log("List of Devices:", $scope.devices);
            })
            .catch(function (error) {
                console.log("Can't bring devices");
            });

        $scope.filterData = function (selectedDeviceId) {
            if (selectedDeviceId) {
                $scope.filteredDevices = $scope.DeviceReports.filter(function (report) {
                    return report.DeviceId === selectedDeviceId;
                });
                console.log("Filtered Device Data", $scope.filteredDevices);
            }
            else {
                console.log("No Selected Device Yet");
            }
        };

        $scope.filterStatus = function (statusSelected) {
            if (statusSelected === "Reserved") {
                $scope.filteredDevices = $scope.DeviceReports.filter(function (report) {
                    $scope.UnReserved = false;
                    $scope.Reserved = true;
                    return report.ReservedCount > 0;
                });
                console.log("Filtered Reserved Devices", $scope.filteredDevices);
            }
            else if (statusSelected === "UnReserved") {
                $scope.filteredDevices = $scope.DeviceReports.filter(function (resport) {
                    $scope.UnReserved = true;
                    $scope.Reserved = false;
                    return report.UnReservedCount > 0;
                });
                console.log("Filtered Unreserved Devices", $scope.filteredDevices);
            }
            else {
                $scope.UnReserved = true;
                $scope.Reserved = true;
                $scope.filteredDevices = $scope.DeviceReports;
                console.log("No Selected Status Yet");
            }
        };


    }]);