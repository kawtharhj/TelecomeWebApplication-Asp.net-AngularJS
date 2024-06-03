var app = angular.module('myApp', []);

app.controller('phoneReservationCtrl', function ($scope, $http) {
    $scope.reservations = [];
    $scope.filteredReservations = [];
    $scope.clients = [];
    $scope.filterReservations = function (selectedClient) {
        if (selectedClient) {
            $scope.filteredReservations = $scope.reservations.filter(function (reservation) {
                return reservation.ClientId === selectedClient;
            });
        }
        else {
            $scope.filteredReservations = $scope.reservations;
        }
    };

    $scope.filterNumber = function (selectedNumberId) {
        if (selectedNumberId) {
            $scope.filteredReservations = $scope.reservations.filter(function (phone) {
                return phone.PhoneNumberId === selectedNumberId;
            });
        } else {
            $scope.filteredReservations = $scope.reservations;
        }
    };



    $http.get('/api/PhoneReservation/GetAllPhoneReservation')
        .then(function (response) {
            $scope.filteredReservations = response.data;
            $scope.reservations = response.data;
            console.log("Res", $scope.reservations);
        })
        .catch(function (error) {
            console.log('Error fetching Phones Reservations:', error);
        });

    $http.get('/api/Client/GetAllClients')
        .then(function (response) {
            $scope.clients = response.data;
        })
        .catch(function (error) {
            console.log('Error fetching Clients:', error);
        });

    $http.get('/api/PhoneNumber/GetAllPhones')
        .then(function (response) {
            $scope.phones = response.data;
        })
        .catch(function (error) {
            console.log('Error fetching Phones:', error);
        });




});


app.directive("phoneReservationItem", function () {
    return {
        restrict: 'A',
        template: `
            <td>{{ phoneReservationItem.Id }}</td>
            <td>{{ phoneReservationItem.BED }}</td>
            <td>{{ phoneReservationItem.EED}}</td>
            <td>{{ phoneReservationItem.ClientName }}</td>
            <td>{{ phoneReservationItem.PhoneNumber.Number}} {{phoneReservationItem.PhoneNumber}}</td>
            `,
        scope: {
            phoneReservationItem: '=',
        }
    };
});