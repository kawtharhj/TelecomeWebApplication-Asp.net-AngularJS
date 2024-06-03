angular.module("myApp").directive("clientSelector", function () {
    return {
        restrict: 'E',
        template: `
          <label for="selectedClient"> Client Filter:</label>
        <select id="selectedClient" ng-model="selectedClient"  class="form-control" ng-options="client.ID as client.Name for client in clients" ng-change="onChangeRes()">
            <option value="">Select Client</option>
        </select>`,
        scope: {
            selectedClient: '=',
            clients: '=',
            filterReservations: '&'
        },
        link: function (scope) {
            scope.onChangeRes = function () {
                scope.filterReservations({ selectedClient: scope.selectedClient });
            };
        }

    };
});