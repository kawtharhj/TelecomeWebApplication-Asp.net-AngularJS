angular.module('myApp').directive('typeSelector', function () {
    return {
        restrict: 'E',
        template: `

       <label for="clientTypeFilter">Type Filter:</label>
        <select id="clientTypeFilter" class="form-control" ng-model="selectedClientType" ng-change="getData()">
            <option value=""> All</option>
            <option value="0"> Individual</option>
            <option value="1"> Organization</option>
        </select>`,

        scope: {
            selectedClientType: '=',
            filterClient: '&',
            clients: '='
        },
        link: function (scope) {
            scope.getData = function () {
                scope.filterClient({ selectedClientType: scope.selectedClientType });
            };
        }
        

    };
});
