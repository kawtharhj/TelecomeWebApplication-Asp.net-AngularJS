var app = angular.module("myApp", ["ui.bootstrap"])
    .controller("ClientController", ['$scope', '$http', '$uibModal', function ($scope, $http, $uibModal) {
        $scope.modalVisible = false;

        $scope.Clients = [];
        $scope.selectedClientType = '';
        $scope.filteredClients = $scope.Clients;
        $scope.successMessage = '';
        $scope.errorMessage = '';
        
        

        
        /////////////////////////////////////
        $scope.phones = [];
        $scope.selectedPhoneNumber = '';
        $scope.reservedPhones = [];


        $http.get('/api/PhoneNumber/GetAllPhones')
            .then(function (response) {
                $scope.phones = response.data;
            })
            .catch(function (error) {
                console.log('Error fetching phones:', error);
            });


    $scope.openReserveModal = function (client) {
        $scope.getClientDetails(client)
            .then(function () {
                var modalInstance = $uibModal.open({
                    templateUrl: "ReserveUnreserve.html",
                    controller: "modalResController",
                    resolve: {
                        UnReserveMode: function () {
                            return false;
                        },
                        clientData: function () {
                            return client;
                        },
                        phonesData: function () {
                            return $scope.phones;
                        },
                        selectedPhoneNumber: function () {
                            return $scope.selectedPhoneNumber
                        },
                        reservedPhones: function () {
                            return $scope.reservedPhones;
                        }
                    }
                });

                modalInstance.result.then(function (selectedPhoneNumber) {
                    console.log('Selected phone number:', selectedPhoneNumber);

                });
            })
    };
    $scope.getClientDetails = function (client) {
                return $http.get('/api/PhoneReservation/GetReservedPhoneNumbers/' + client.ID)
    .then(function (response) {
        $scope.reservedPhones = response.data.map(function (reservation) {
            return {
                Id: reservation.PhoneNumberId,
                Number: reservation.PhoneNumber,
            };

        });
            client.reservedPhones = $scope.reservedPhones; 
           $scope.hasReservedPhones = $scope.reservedPhones.length;
            console.log("Test button ", $scope.reservedPhones);
            console.log('ClientID from GetClientDetails', $scope.reservedPhones);
      })
    .catch(function (error) {
        console.log('Error getting reserved phones:', error);
                    });
            };
    $scope.OpenUnReserve = function (client) {
        $scope.getClientDetails(client)
            .then(function () {
                var modalInstance = $uibModal.open({
                    templateUrl: "ReserveUnreserve.html",
                    controller: "modalResController",
                    resolve: {
                        UnReserveMode: function () {
                            return true;
                        },
                        clientData: function () {
                            return client;
                        },
                        selectedPhoneNumber: function () {
                            return $scope.selectedPhoneNumber;
                        },
                        phonesData: function () {
                            return $scope.phones;
                        },
                        reservedPhones: function () {
                            return client.reservedPhones;
                        }
                    }
                });

                modalInstance.result.then(function (selectedPhoneNumber) {
                    console.log('Selected phone number:', selectedPhoneNumber);
                });
            })
            .catch(function (error) {
                console.log('Error getting reserved phones:', error);
            });
            };



        /////////


        $scope.filterReservations = function (selectedClient) {
            if (selectedClient) {
                $scope.filteredClients = $scope.Clients.filter(function (reservation) {
                    return reservation.ID === selectedClient;
                });
            }
            else {
                $scope.filteredClients = $scope.Clients;
            }
        };
       
    $scope.$watch('selectedClientType', function (newvalue, oldvalue) {
                if (newvalue == '') {
                 $scope.filteredClients = $scope.Clients;
                }
           else {
              $scope.filteredClients = $scope.Clients.filter(function (client) {
                  return client.ClientType.toString() === newvalue
             });
           }
     });

    $scope.searchClients = function () {
        $scope.filteredClients = $scope.Clients.filter(function (client) {
            return client.Name.toLowerCase().includes($scope.searchText.toLowerCase());
        });
            };

        $http.get('/api/Client/')
            .then(function (response) {
                $scope.Clients = response.data;
                $scope.filteredClients = $scope.Clients;
              })
            .catch(function (error) {
                console.log('Error fetching clients:', error);
             });
    $scope.openAddModal = function () {
                
                var modalInstance = $uibModal.open({
                 templateUrl: "addEditModal.html",
                 controller: "modalController",
                 resolve: {
                    newClient: function () {
                            return {
                          ID: $scope.Clients.length + 1
                                }
                        },
                    isEditMode: function () {
                            return false;
                        }
                    }
                });

                modalInstance.result.then(function (newClient) {
                    $scope.Clients.push(newClient);
                    $scope.filteredClients = $scope.Clients;
                },
                    function () {
                  console.log('Modal dismissed');
                });
            };
    ///Now For Edit Modal //

    $scope.openEditModal = function (client) {
                
                var modalInstance = $uibModal.open({
                 templateUrl: "addEditModal.html",
                 controller: "modalController",
                 resolve: {
                     newClient: function () {
                         return angular.copy(client);
                        },

                     isEditMode: function () {
                            return true;
                        }
                    }
                });

    modalInstance.result.then(function (updatedClient) {
                    
                    var index = $scope.Clients.findIndex(function (c) {
                        return c.ID === updatedClient.ID;
                    });
                        if (index !== -1) {
                        $scope.Clients[index] = updatedClient;
                                }
                        else {
                    console.error('Client with ID', updatedClient.ID, 'not found in Clients array');
                                }
                    $scope.filteredClients = $scope.Clients;
                            }, function () {
                    console.log('Modal dismissed');
                            });
                        };
        }])
    .controller("modalController", function ($scope, $uibModalInstance, newClient, isEditMode ,$http,$timeout) {

        $scope.isEditMode = isEditMode;
    $scope.newClient = angular.copy(newClient);
    $scope.newClient.BirthDate = new Date(newClient.BirthDate);
        $scope.successMessage = "";
        $scope.errorMessage = "";

        $scope.validateBirthDate = function () {
            var currentDate = new Date();
            var selectedDate = new Date($scope.newClient.BirthDate);
            var yearsDiff = currentDate.getFullYear() - selectedDate.getFullYear();
            var monthsDiff = currentDate.getMonth() - selectedDate.getMonth();
            var daysDiff = currentDate.getDate() - selectedDate.getDate();

            if (yearsDiff < 18 || (yearsDiff === 18 && (monthsDiff < 0 || (monthsDiff === 0 && daysDiff < 0)))) {
                $scope.invalidBirthdate = true; // Set a flag to indicate invalid birthdate
            } else {
                $scope.invalidBirthdate = false; // Clear the flag if birthdate is valid
            }
        }


    $scope.closeModal = function () {
        $uibModalInstance.dismiss();
            };
    $scope.saveClient = function () {
                if (!$scope.isEditMode) {

        $http.post('/api/Client/AddClient', $scope.newClient)
            .then(function (response) {
                $scope.successMessage = "Client Added Succefully";
                $timeout(function () {
                    $uibModalInstance.close(response.data);
                }, 2000);
            })
            .catch(function (error) {
                $scope.errorMessage = "Can't Add Client";
                $timeout(function () {
                    $uibModalInstance.close(response.data);
                }, 2000);
                console.log('Error adding client:', error);
            });
                } else {

        $http.put('/api/Client/UpdateClient/' + $scope.newClient.ID, $scope.newClient)
            .then(function (response) {
                    $scope.successMessage = "Client Details are Updated";
                    $timeout(function () {
                       $uibModalInstance.close(response.data);
                     }, 2000);            
               
            })
            .catch(function (error) {
                $scope.errorMessage = "Can't Update Details";
                $timeout(function () {
                    $uibModalInstance.close(response.data);
                }, 2000);
                console.log('Error updating client:', error);
            });
                }
            };
           
        });


    app.controller("modalResController", function ($scope, $uibModalInstance, clientData,
    selectedPhoneNumber, reservedPhones, phonesData, UnReserveMode, $http ,$timeout) {

        console.log('Phones in modal:', phonesData);

    $scope.UnReserveMode = UnReserveMode;
    $scope.client = angular.copy(clientData);
    $scope.phones = angular.copy(phonesData);
    $scope.selectedPhoneNumber = selectedPhoneNumber;
        $scope.reservedPhones = reservedPhones;
        $scope.successMessage = '';
        $scope.errorMessage = '';

        //$scope.reservedPhones = [];

        //$http.get('/api/PhoneReservation/GetReservedPhoneNumbers/' + clientData.ID)
        //    .then(function (response) {
        //       $scope.reservedPhones = response.data;

        //    })
        //    .catch(function (error) {
        //        console.log('Error getting reserved phones:', error);
        //   });

        console.log('ReservedPhones in modal:', $scope.reservedPhones);
    console.log('Client Details :', $scope.client.ID);


    $scope.getDeviceId = function (selectedPhoneNumber) {
        $scope.selectedPhoneNumber = selectedPhoneNumber; // Set the selected device ID
        };


    $scope.saveReservation = function () {
            var reservationData = {
                 clientId: $scope.client.ID,
                 PhoneNumberId: $scope.selectedPhoneNumber
        };

        console.log("client: ", $scope.client.ID);
        console.log("Phone:", $scope.selectedPhoneNumber);
    if (!$scope.selectedPhoneNumber) {
        console.log("Please Select Phone Number")
                return;
            }

    if (UnReserveMode) {
        $http.put('/api/PhoneReservation/UnreservePhoneNumber/' + $scope.selectedPhoneNumber)
            .then(function (response) {
                console.log('Phone number Unreserved successfully.');
                $scope.successMessage = "Unreserved Successfully";
                $timeout(function () {
                     $uibModalInstance.close($scope.selectedPhoneNumber);
                }, 2000);
              
            })
            .catch(function (error) {
                console.error('Error Unreserving phone number:', error);
            });
            }
    else {
        $http.post('/api/PhoneReservation/AddReservation', reservationData)
            .then(function (response) {
                console.log('Phone number reserved successfully.');
                if (response.data === 'Success') {
                    $scope.successMessage = "PhoneNumber Reserved Successfully";
                    $timeout(function () {
                        $uibModalInstance.close($scope.selectedPhoneNumber);
                    }, 2000);
                }
                else if (response.data === 'Failure') {
                    $scope.errorMessage = "Try Another PhoneNumber. This one is Reserved";
                    $timeout(function () {
                        $uibModalInstance.close(response.data);
                    }, 3000);
                }
            })
            .catch(function (error) {
                console.error('Error reserving phone number:', error);
                $scope.errorMessage = "Try Another PhoneNumber. This one is Reserved";
                $timeout(function () {
                    $uibModalInstance.close();
                }, 3000);
            });
            }

        };

    $scope.closeModal = function () {
        // Close modal without saving
        $uibModalInstance.dismiss('cancel');
        };
    });

    app.filter('clientType', function () {
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

