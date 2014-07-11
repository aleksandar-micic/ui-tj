angular.module('ui.tj.wizard', ['ngAnimate'])
  .directive('tjWizard', function() {
    'use strict';

    return {
      restrict: 'E',
      controller: function($scope) {
        $scope.wizardSteps = [];
        $scope.active = {
          step: 0,
          elements: undefined
        };
        $scope.animating = {
          add: false,
          remove: false
        };

        function animating() {
          return $scope.animating.add || $scope.animating.remove;
        }

        $scope.isFutureStep = function(step) {
          return $scope.active.step < step;
        };

        this.next = function() {
          if (!animating() && $scope.active.step < $scope.wizardSteps.length - 1) {
            $scope.$apply(function() {
              ++$scope.active.step;
            });
          }
        };

        this.prev = function() {
          if (!animating() && $scope.active.step > 0) {
            $scope.$apply(function() {
              --$scope.active.step;
            });
          }
        };

        this.step = function(index) {
          if (!animating() && index >= 0 && index < $scope.wizardSteps.length) {
            $scope.$apply(function() {
              $scope.active.step = index;
            });
          }
        };

        this.addStep = function(step) {
          $scope.wizardSteps.push(step);

          return $scope.wizardSteps.length - 1;
        };
      }
    };
  })
  .directive('wizardStep', ['$animate', function($animate) {
    'use strict';

    return {
      require: '^tjWizard',
      restrict: 'A',
      link: function (scope, element, attrs, wizardCtrl) {
        var stepIndex = wizardCtrl.addStep(attrs.wizardStep);

        scope.$watch('active.step', function (step, prevStep) {
          if (stepIndex === step) {
            scope.animating.add = true;
            scope.animating.false = true;

            if (step !== prevStep) {
              element.addClass(step > prevStep ? 'next' : 'prev');
            }
            $animate.addClass(element, 'active', function () {
              scope.animating.add = false;
              element.removeClass('prev next');
            });

            if (scope.active.element) {
              var prevElement = scope.active.element;
              prevElement.addClass(step > prevStep ? 'next' : 'prev');
              $animate.removeClass(scope.active.element, 'active', function () {
                scope.animating.remove = false;
                prevElement.removeClass('prev next');
              });
            }

            scope.active.element = element;
          }
        });
      }
    };
  }])
  .directive('wizardControl', function() {
    'use strict';

    return {
      require: '^tjWizard',
      restrict: 'A',
      link: function (scope, element, attrs, wizardCtrl) {
        if (attrs.wizardControl === 'prev') {
          element.on('click', function () {
            wizardCtrl.prev();
          });
        }
        else if (attrs.wizardControl === 'next') {
          element.on('click', function () {
            wizardCtrl.next();
          });
        }
        else {
          var index = parseFloat(attrs.wizardControl);
          if (!isNaN(index)) {
            element.on('click', function () {
              wizardCtrl.step(index);
            });
          }
        }
      }
    };
  });
