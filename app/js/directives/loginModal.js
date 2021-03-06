/**
 * Created by Margo on 24/08/15.
 */

app.service('loginModal', function ($modal, $rootScope) {

    function assignCurrentUser (user) {
        $rootScope.currentUser = user;
        return user;
    }

    return function() {
        var instance = $modal.open({
            templateUrl: 'views/loginModalTemplate.html',
            controller: 'LoginModalCtrl',
            controllerAs: 'LoginModalCtrl'
        })

        return instance.result.then(assignCurrentUser);
    };

});