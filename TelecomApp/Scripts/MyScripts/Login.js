angular.module('myApp', [])
    .controller("LoginController", ['$scope', '$http', '$window', function ($scope, $http, $window) {

        $scope.errorMessage = '';
        $scope.successMessage = '';
        $scope.LoginFunc = function () {
          
            $http.get('/api/Login/VerifyUser/' + $scope.username + '/' + $scope.password)
                .then(function (response) {

                    if (response.data === 'Success') {
                        console.log("LoginSucceed");
                        $scope.successMessage = 'Login successful!';
                        $window.location.href = "/Home/Index";
                    }
                    else if (response.data === 'Failure') {
                        $scope.successMessage = '';
                        $scope.errorMessage = 'Invalid username or password.';
                        console.log("Failed");

                    }
                })
                .catch(function (error) {
                    console.log("Failed to load loging ", error);
                });
        };



        $scope.Register = function () {

            $http.post('/api/Login/AddNewUser/' + $scope.username + '/' + $scope.password)
                .then(function (response) {
                    $scope.successMessage = "Form submitted successfully";
                    console.log("NewUser created:", response.data);

                })
                .catch(function (error) {
                    $scope.errorMessage = "Username already exist!";
                    console.log("Failed to Register");
                });
        };

    }]);