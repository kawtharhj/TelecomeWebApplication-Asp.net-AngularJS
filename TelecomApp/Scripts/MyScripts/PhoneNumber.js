angular.module("myApp", ["ui.bootstrap"])
    .controller("PhoneNumberController", ['$scope', '$http', '$uibModal', function ($scope, $http, $uibModal) {
        $scope.modalVisible = false;

        $scope.Phones = [];
        $scope.devices = [];
        $scope.filteredPhones = $scope.Phones;
        $scope.selectedDevice = '';
        $scope.successMessage = '';
        $scope.errorMessage = '';
       

        $http.get('/api/PhoneNumber/GetAllPhones')
            .then(function (response) {
                $scope.Phones = response.data;
                $scope.filteredPhones = $scope.Phones;
                
            })
            .catch(function (error) {
                console.log('Error fetching Phones:', error);
            });


        $http.get('/api/Device/GetAllDevices')
            .then(function (response) {
                $scope.devices = response.data;
            })
            .catch(function (error) {
                console.log('Error fetching Devices:', error);
            });
        $scope.filterData = function (selectedDeviceId) {
            if (selectedDeviceId) {
                $scope.filteredPhones = $scope.Phones.filter(function (report) {
                    return report.DeviceId === selectedDeviceId;
                });
                console.log("Filtered Device Data", $scope.filteredPhones);
            }
            else {
                $scope.filteredPhones = $scope.Phones;
                console.log("No Selected Device Yet");
            }
        };

        $scope.filterNumber = function (selectedNumberId) {
            if (selectedNumberId) {
                $scope.filteredPhones = $scope.Phones.filter(function (phone) {
                    return phone.Id === selectedNumberId;
                });
            } else {
                $scope.filteredPhones = $scope.Phones;
            }
        };

        $scope.openAddModal = function () {
            var modalInstance = $uibModal.open({
                templateUrl: "addEditModal.html",
                controller: "modalController",
                resolve: {
                    newPhone: function () {
                        return {
                            ID: $scope.Phones.length +1,
                            Number: '',
                            DeviceId:null
                        }
                    },
                    isEditMode: function () {
                        return false;
                    },
                    devices: function () {
                        return $scope.devices;
                    },
                    selectedDevice: function () {
                        return $scope.selectedDevice
                    }
                }
            });

            modalInstance.result.then(function (newPhone) {
                $scope.Phones.push(newPhone);
                $scope.filteredPhones = $scope.Phones;
            }, function () {
                console.log('Modal dismissed');
            });
        };
        ///Now For Edit Modal //

        $scope.openEditModal = function (phone) {

            var modalInstance = $uibModal.open({
                templateUrl: "addEditModal.html",
                controller: "modalController",
                resolve: {
                    newPhone: function () {
                        return angular.copy(phone);
                    },
                    isEditMode: function () {
                        return true;
                    },
                    devices: function () {
                        return $scope.devices;
                    },
                    selectedDevice: function () {
                        return phone.DeviceId;
                    }
                }
            });

            modalInstance.result.then(function (updatedPhone) {

                var index = $scope.Phones.findIndex(function (c) {
                    return c.ID === updatedPhone.ID;
                });

                $scope.Phones[index] = updatedPhone;
                $scope.filteredPhones = $scope.Phones;
            }, function () {
                console.log('Modal dismissed');
            });
        };


    }])
    .controller("modalController", function ($scope, selectedDevice ,$uibModalInstance, newPhone ,devices, isEditMode, $http,$timeout) {

        $scope.newPhone = newPhone;
        $scope.isEditMode = isEditMode;
        $scope.devices = devices;
        $scope.selectedDevice = selectedDevice;
        $scope.closeModal = function () {
            $uibModalInstance.dismiss();
        };

        console.log("newPhone", $scope.newPhone);
        console.log("selected", $scope.selectedDevice);

        $scope.getDeviceID = function (selectedDevice) {
            var foundDevice = $scope.devices.find(function (device) {
                return device.ID === selectedDevice;
            });

            if (foundDevice) {
                var deviceId = foundDevice.ID;
                console.log("DeviceId: " + deviceId);
                return deviceId;
            } else {
                console.log("Device not found.");
                return null;
            }
        };

      /*  $scope.getDeviceID = function (selectedDevice) {
            $scope.newPhone.DeviceId = $scope.devices.find(function (d) {
                return d.ID === selectedDevice;
            });
            console.log("newPhoneG", $scope.newPhone);
            console.log("selectedG", selectedDevice);

            console.log("selectedG", $scope.selectedDevice);

        };
        */
        $scope.savePhone = function () {
            if (!$scope.isEditMode) {
                var deviceId = $scope.getDeviceID($scope.selectedDevice);
                var data = {
                    Phone: $scope.newPhone,
                    DeviceId: deviceId
                };
                    
                console.log("newPhoneS", data);

                $http.post('/api/PhoneNumber/AddPhoneNumber',data)
                    .then(function (response) {
                        $scope.successMessage = "PhoneNumber Added Succefully";
                        $timeout(function () {
                            $uibModalInstance.close(response.data);
                        }, 2000);
                    })
                    .catch(function (error) {

                        console.log('Error adding Phone:', error);
                    });
            } else {
                $http.put('/api/PhoneNumber/UpdatePhone/' + $scope.newPhone.Id, $scope.newPhone)
                    .then(function (response) {
                        $scope.successMessage = "PhoneNumber Updated";
                        $timeout(function () {
                            $uibModalInstance.close(response.data);
                        }, 2000);
                    })
                    .catch(function (error) {
                        $scope.errorMessage = "Can't update PhoneNumber";
                        $timeout(function () {
                            $uibModalInstance.close(response.data);
                        }, 2000);
                        console.log('Error updating phone:', error);
                    });
            }
        };

    })

