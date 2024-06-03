angular.module("myApp").directive('statusFilter', function () {
    return {
        restrict: 'E',
        template: `
      <label for="statusSelected">Status Filter:</label>

    <select ng-model="statusSelected" ng-change="onChangeStatus()" >
      <option value="">All</option>
      <option value="Reserved"> Reserved</option>
      <option value="UnReserved">UnReserved</option>
      
    </select>`,

        scope: {
            statusSelected: '=',
            filterStatus: '&'
        },
        link: function (scope) {
            scope.onChangeStatus = function () {
                scope.filterStatus({ statusSelected: scope.statusSelected });
            };
        }

    };
});