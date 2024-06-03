angular.module("myApp").directive('numberFilter', function () {
    return {
        restrict: 'E',
        template: `
          <label for="selectedNumberId"> Number Filter:</label>
        <select ng-model="selectedNumberId" ng-options="phone.Id as phone.Number for phone in phones" ng-change="onChangeNumber()" >
          <option value="">Select Number</option>
        </select>`,

        scope: {
            selectedNumberId: '=',
            phones: '=',
            filterNumber: '&'
        },
        link: function (scope) {
            scope.onChangeNumber = function () {
                console.log("Test", scope.selectedNumberId);
                scope.filterNumber({ selectedNumberId: scope.selectedNumberId });
            };
        }

    };
});

