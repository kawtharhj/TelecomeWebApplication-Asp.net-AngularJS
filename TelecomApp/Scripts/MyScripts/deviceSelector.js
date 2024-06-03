angular.module("myApp").directive('deviceSelector', function () {
    return {
        restrict: 'E',
        template: `
          <label for="selectedDeviceId">Device Filter:</label>
        <select ng-model="selectedDeviceId" ng-options="device.ID as device.Name for device in devices" ng-change="onChange()" >
          <option value="">All</option>
        </select>`,

        scope: {
            selectedDeviceId: '=',
            devices: '=',
            filterData: '&'
        },
        link: function (scope) {
            scope.onChange = function () {
                console.log("Test");
                scope.filterData({ selectedDeviceId: scope.selectedDeviceId });
            };
        }

    };
});

