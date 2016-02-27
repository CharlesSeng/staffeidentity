angular.module('starter')

.controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
  $scope.username = AuthService.username();

  $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
    var alertPopup = $ionicPopup.alert({
      title: 'Unauthorized!',
      template: 'You are not allowed to access this resource.'
    });
  });

  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });

  $scope.setCurrentUsername = function(name) {
    $scope.username = name;
  };
})

.controller('LoginCtrl', function($scope, $state, $ionicPopup, AuthService) {
  $scope.data = {};

  $scope.login = function(data) {
    AuthService.login(data.username, data.password).then(function(authenticated) {
      $state.go('main.dash', {}, {reload: true});
      $scope.setCurrentUsername(data.username);
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
    });
  };
})

.controller('DashCtrl', function($scope, $state, $http, $ionicPopup, AuthService) {
  $scope.logout = function() {
    AuthService.logout();
    $state.go('login');
  };

  $scope.performValidRequest = function() {
    $http.get('http://localhost:8100/valid').then(
      function(result) {
        $scope.response = result;
      });
  };

  $scope.performUnauthorizedRequest = function() {
    $http.get('http://localhost:8100/notauthorized').then(
      function(result) {
        // No result here..
      }, function(err) {
        $scope.response = err;
      });
  };

  $scope.performInvalidRequest = function() {
    $http.get('http://localhost:8100/notauthenticated').then(
      function(result) {
        // No result here..
      }, function(err) {
        $scope.response = err;
      });
  };

  $scope.startScan = function() {
        resultDiv = document.querySelector("#results");
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                /*var s = "Result: " + result.text + "<br/>" +
                "Format: " + result.format + "<br/>" +
                "Cancelled: " + result.cancelled;
                resultDiv.innerHTML = s;*/
                if(result.format == "QR_CODE")  {
                    var s = result.text;
                    if (s.indexOf("http://")==0 || s.indexOf("https://")==0) {
                        window.open(s,'_blank','location=yes','closebuttoncaption=back');
                    }
                    else {
                        alert("Result: " + result.text + "\n" +"Format: " + result.format + "\n" + "Cancelled: " + result.cancelled);
                    }
                }
                else {
                    //alert("You are not scanning QR code");
                    $ionicPopup.alert({
                          title: 'Alert!',
                          template: 'You are not scanning QR code!'
                    });
                }
            },
            function (error) {
                alert("Scanning failed: " + error);
            }
        );
    };

    $scope.qrcodeString = 'http://g6.globportal.com/index.php/cards/cards/check/id/';
    $scope.size = 150;
    $scope.correctionLevel = '';
    $scope.typeNumber = 0;
    $scope.inputMode = '';
    $scope.image = true;
});
