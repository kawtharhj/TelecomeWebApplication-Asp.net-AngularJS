angular.module('devicesApp', ['ui.bootstrap'])
    .controller('DeviceController', ['$scope', '$http', '$uibModal', function ($scope, $http, $uibModal) {
        $scope.devices = [];

        $scope.filteredDevices = $scope.devices;
        $scope.successMessage = '';
        $scope.errorMessage = '';

        $http.get('/api/Device/')
            .then(function (response) {
                $scope.devices = response.data;
                $scope.filteredDevices = $scope.devices;
            })
            .catch(function (error) {
                console.log('Error fetching devices:', error);
            });

        $scope.searchDevices = function () {
            $scope.filteredDevices = $scope.devices.filter(function (device) {
                return device.name.toLowerCase().includes($scope.searchText.toLowerCase());
            });
        };


        $scope.openAddModal = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'addEditModal.html',
                controller: 'ModalInstanceCtrl',
                controllerAs: '$ctrl',
                resolve: {
                    modalDevice: function () {
                        return {
                            id: $scope.devices.length + 1,
                            name: ''
                        };
                    },
                    modalMode: function () {
                        return 'add';
                    }
                }
            });

            modalInstance.result.then(function (device) {
                $scope.devices.push(device);
                $scope.filteredDevices = $scope.devices;
            }, function () {
                console.log('Modal dismissed');
            });
        };

        $scope.openEditModal = function (device) {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'addEditModal.html',
                controller: 'ModalInstanceCtrl',
                controllerAs: '$ctrl',
                resolve: {
                    modalDevice: function () {
                        return angular.copy(device);
                    },
                    modalMode: function () {
                        return 'edit';
                    }
                }
            });

            modalInstance.result.then(function (updatedDevice) {
                var index = $scope.devices.findIndex(function (d) {
                    return d.id === updatedDevice.id;
                });
                $scope.devices[index] = updatedDevice;
                $scope.filteredDevices = $scope.devices;
            }, function () {
                console.log('Modal dismissed');
            });
        };
    }])
    .controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, modalDevice, modalMode, $http, $timeout) {
        $scope.modalDevice = modalDevice;
        $scope.modalMode = modalMode;
        $scope.modalTitle = modalMode === 'add' ? 'Add Device' : 'Edit Device';

        $scope.saveDevice = function () {
            if ($scope.modalMode === 'add') {
                $http.post('/api/Device/AddDevice', $scope.modalDevice)
                    .then(function (response) {
                        $scope.successMessage = "Device Added Succefully";
                        $timeout(function () {
                            $uibModalInstance.close(response.data);
                        }, 2000);
                    })
                    .catch(function (error) {
                        $scope.errorMessage = "Device Name already exist";
                        console.log('Error adding device:', error);
                    });
            } else if ($scope.modalMode === 'edit') {

                $http.put('/api/Device/UpdateDevice/' + $scope.modalDevice.ID, $scope.modalDevice)
                    .then(function (response) {
                        $scope.successMessage = "Device Edited ";
                        $timeout(function () {
                            $uibModalInstance.close(response.data);
                        }, 2000);
                    })
                    .catch(function (error) {
                        console.log('Error updating device:', error);
                    });
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });