(function() {
    'use strict';

    angular
        .module('app.examples.dashboards', [

        ]);
})();
(function() {
    'use strict';
    angular
        .module('app.examples.dashboards')
        .component('tabsWidget', {
            templateUrl: 'app/examples/dashboards/analytics/widgets/tabs-widget/tabs-widget.tmpl.html',
            controller: TabsWidget,
            controllerAs: 'vm',
            bindings: {
                languages: '<',
                countries: '<'
            }
        });

    /* @ngInject */
    function TabsWidget() {
        var vm = this;

        vm.tableQueries = {
            languages: {
                order: '-percent',
                limit: 5,
                page: 1
            },
            countries: {
                order: '-percent',
                limit: 5,
                page: 1
            }
        };
    }
})();

(function() {
    'use strict';
    StatWidgetController.$inject = ["$timeout"];
    angular
        .module('app.examples.dashboards')
        .component('statChartWidget', {
            templateUrl: 'app/examples/dashboards/analytics/widgets/stat-chart-widget/stat-chart-widget.tmpl.html',
            controllerAs: 'vm',
            controller: StatWidgetController,
            bindings: {
                name: '@',
                statistic: '@',
                data: '<',
                options: '<'
            }
        });

    /* @ngInject */
    function StatWidgetController($timeout) {
        var vm = this;

        $timeout(function() {
            vm.api.refreshWithTimeout(200);
        }, 0);
    }

})();

(function() {
    'use strict';
    PieChartWidgetController.$inject = ["$timeout"];
    angular
        .module('app.examples.dashboards')
        .component('pieChartWidget', {
            templateUrl: 'app/examples/dashboards/analytics/widgets/pie-chart-widget/pie-chart-widget.tmpl.html',
            controllerAs: 'vm',
            controller: PieChartWidgetController,
            bindings: {
                data: '<',
                options: '<'
            }
        });

    /* @ngInject */
    function PieChartWidgetController($timeout) {
        var vm = this;

        $timeout(function() {
            vm.api.refreshWithTimeout(200);
        }, 0);
    }
})();

(function() {
    'use strict';
    MapWidgetController.$inject = ["uiGmapGoogleMapApi"];
    angular
        .module('app.examples.dashboards')
        .component('mapWidget', {
            templateUrl: 'app/examples/dashboards/analytics/widgets/map-widget/map-widget.tmpl.html',
            controller: MapWidgetController,
            controllerAs: 'vm'
        });

    /* @ngInject */
    function MapWidgetController(uiGmapGoogleMapApi) {
        var vm = this;

        // setup map
        uiGmapGoogleMapApi.then(function(maps) {
            vm.map = {
                center: {
                    latitude: 40.1451,
                    longitude: -99.6680
                },
                zoom: 4,
                bounds: {
                    northeast: {
                        latitude: 45.1451,
                        longitude: -80.6680
                    },
                    southwest: {
                        latitude: 30.000,
                        longitude: -120.6680
                    }
                },
                options: {
                    scrollwheel: false,
                    mapTypeId: maps.MapTypeId.TERRAIN
                }
            };

            var markers = [];
            for (var i = 0; i < 10; i++) {
                markers.push(createRandomMarker(i, vm.map.bounds));
            }
            vm.randomMarkers = markers;
        });

        function createRandomMarker(i, bounds, idKey) {
            var latMin = bounds.southwest.latitude,
                latRange = bounds.northeast.latitude - latMin,
                lngMin = bounds.southwest.longitude,
                lngRange = bounds.northeast.longitude - lngMin;

            if (idKey == null) {
                idKey = 'id';
            }

            var latitude = latMin + (Math.random() * latRange);
            var longitude = lngMin + (Math.random() * lngRange);
            var ret = {
                latitude: latitude,
                longitude: longitude,
                title: 'm' + i
            };
            ret[idKey] = i;
            return ret;
        }
    }
})();

(function() {
    'use strict';
    LineChartWidgetController.$inject = ["$timeout"];
    angular
        .module('app.examples.dashboards')
        .component('lineChartWidget', {
            templateUrl: 'app/examples/dashboards/analytics/widgets/line-chart-widget/line-chart-widget.tmpl.html',
            controllerAs: 'vm',
            controller: LineChartWidgetController,
            bindings: {
                start: '<',
                end: '<',
                timeSpans: '<',
                onTimeChange: '&',
                data: '<',
                options: '<'
            }
        });

    /* @ngInject */
    function LineChartWidgetController($timeout) {
        var vm = this;

        $timeout(function() {
            vm.api.refreshWithTimeout(200);
        }, 0);
    }
})();

(function() {
    'use strict';

    angular
        .module('app.examples.dashboards')
        .component('counterWidget', {
            templateUrl: 'app/examples/dashboards/analytics/widgets/counter-widget/counter-widget.tmpl.html',
            controllerAs: 'vm',
            bindings: {
                title: '@',
                count: '<',
                icon: '@',
                background: '@',
                color: '@'
            }
        });
})();

(function() {
    'use strict';

    angular
        .module('triangular.layouts', [

        ]);
})();
'use strict';

/**
 * @ngdoc function
 * @name AdminController
 * @module triAngular
 * @kind function
 *
 * @description
 *
 * Handles the admin view
 */
(function() {
    'use strict';

    TriangularStateController.$inject = ["$scope", "$rootScope", "$timeout", "$templateRequest", "$compile", "$element", "$window", "triLayout", "triLoaderService"];
    angular
        .module('triangular.layouts')
        .controller('TriangularStateController', TriangularStateController);

    /* @ngInject */
    function TriangularStateController($scope, $rootScope, $timeout, $templateRequest, $compile, $element, $window, triLayout, triLoaderService) {
        var loadingQueue = [];
        var vm = this;

        vm.activateHover = activateHover;
        vm.removeHover  = removeHover;
        vm.showLoader = triLoaderService.isActive();

        // we need to use the scope here because otherwise the expression in md-is-locked-open doesnt work
        $scope.layout = triLayout.layout; //eslint-disable-line


        ////////////////

        function activateHover() {
            if(triLayout.layout.sideMenuSize === 'icon') {
                $element.find('.triangular-sidenav-left').addClass('hover');
                $timeout(function(){
                    $window.dispatchEvent(new Event('resize'));
                }, 300);
            }
        }

        function injectFooterUpdateContent(viewName) {
            var contentView = $element.find('.triangular-content');
            if (viewName === '@triangular' && angular.isDefined(triLayout.layout.footerTemplateUrl)) {
                // add footer to the content view
                $templateRequest(triLayout.layout.footerTemplateUrl)
                .then(function(template) {
                    // compile template with current scope and add to the content
                    var linkFn = $compile(template);
                    var content = linkFn($scope);
                    $timeout(function() {
                        contentView.append(content);
                    });
                });
            }
        }

        function loaderEvent(event, isActive) {
            vm.showLoader = isActive;
        }

        function stateChangeStart() {
            // state has changed so start the loader
            triLoaderService.setLoaderActive(true);
        }

        function removeHover () {
            if(triLayout.layout.sideMenuSize === 'icon') {
                $element.find('.triangular-sidenav-left').removeClass('hover');
                $timeout(function(){
                    $window.dispatchEvent(new Event('resize'));
                }, 300);
            }
        }

        function viewContentLoading($event, viewName) {
            // a view is loading so add it to the queue
            // so we know when to turn off the loader
            loadingQueue.push(viewName);
        }

        function viewContentLoaded($event, viewName) {
            if(angular.isDefined(triLayout.layout.footer) && triLayout.layout.footer === true) {
                // inject footer into content
                injectFooterUpdateContent(viewName);
            }

            // view content has loaded so remove it from queue
            var index = loadingQueue.indexOf(viewName);
            if(-1 !== index) {
                loadingQueue.splice(index, 1);
            }
            // is the loadingQueue empty?
            if(loadingQueue.length === 0) {
                // nothing left to load so turn off the loader
                triLoaderService.setLoaderActive(false);
            }
        }

        // watches

        // register listeners for loader
        $scope.$on('loader', loaderEvent);

        // watch for ui router state change
        $scope.$on('$stateChangeStart', stateChangeStart);

        // watch for view content loading
        $scope.$on('$viewContentLoading', viewContentLoading);

        // watch for view content loaded
        $scope.$on('$viewContentLoaded', viewContentLoaded);
    }
})();

(function() {
    'use strict';

    angular
        .module('app.examples.email', [

        ]);
})();
(function() {
    'use strict';

    EmailToolbarController.$inject = ["$rootScope", "$mdMedia", "$filter", "$mdUtil", "$mdSidenav", "$state", "triBreadcrumbsService", "triLayout", "EMAIL_ROUTES"];
    angular
        .module('app.examples.email')
        .controller('EmailToolbarController', EmailToolbarController);

    /* @ngInject */
    function EmailToolbarController($rootScope, $mdMedia, $filter, $mdUtil, $mdSidenav, $state, triBreadcrumbsService, triLayout, EMAIL_ROUTES) {
        var vm = this;
        vm.breadcrumbs = triBreadcrumbsService.breadcrumbs;
        vm.filterEmailList = filterEmailList;
        vm.hideMenuButton = hideMenuButton;
        vm.openSideNav = openSideNav;
        vm.showSearch = false;
        vm.toggleSearch = toggleSearch;
        vm.toolbarMenu = [];

        /////////////////

        function filterEmailList(emailSearch) {
            $rootScope.$broadcast('emailSearch', emailSearch);
        }

        function toggleSearch() {
            vm.showSearch = !vm.showSearch;
        }

        function hideMenuButton() {
            return triLayout.layout.sideMenuSize !== 'hidden' && $mdMedia('gt-sm');
        }

        /**
         * Build handler to open/close a SideNav;
         */
        function openSideNav(navID) {
            $mdUtil.debounce(function(){
                $mdSidenav(navID).toggle();
            }, 300)();
        }


        // init

        for(var i = 0; i < EMAIL_ROUTES.length; i++) {
            vm.toolbarMenu.push({
                name: $filter('triTranslate')(EMAIL_ROUTES[i].name),
                state: EMAIL_ROUTES[i].state,
                icon: EMAIL_ROUTES[i].icon
            });
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('app.examples.calendar', [

        ]);
})();
(function() {
    'use strict';

    CalendarToolbarController.$inject = ["$scope", "$state", "$element", "$mdUtil", "$mdSidenav", "triBreadcrumbsService", "uiCalendarConfig"];
    angular
        .module('app.examples.calendar')
        .controller('CalendarToolbarController', CalendarToolbarController);

    /* @ngInject */
    function CalendarToolbarController($scope, $state, $element, $mdUtil, $mdSidenav, triBreadcrumbsService, uiCalendarConfig) {
        var vm = this;
        vm.breadcrumbs = triBreadcrumbsService.breadcrumbs;
        vm.changeMonth = changeMonth;
        vm.changeView = changeView;
        vm.openSideNav = openSideNav;
        vm.views = [{
            name: 'Month',
            icon: 'zmdi zmdi-view-module',
            viewName: 'month'
        },{
            name: 'Week',
            icon: 'zmdi zmdi-view-week',
            viewName: 'agendaWeek'
        },{
            name: 'Day',
            icon: 'zmdi zmdi-view-day',
            viewName: 'agendaDay'
        }];
        vm.currentView = vm.views[0];

        //////////////

        function changeMonth(direction) {
            uiCalendarConfig.calendars['triangular-calendar'].fullCalendar(direction);
        }

        function changeView(view) {
            vm.currentView = view;
            uiCalendarConfig.calendars['triangular-calendar'].fullCalendar('changeView', view.viewName);
        }

        function openSideNav(navID) {
            $mdUtil.debounce(function(){
                $mdSidenav(navID).toggle();
            }, 300)();
        }
    }
})();
'use strict';

/**
 * @ngdoc function
 * @name AdminController
 * @module triAngular
 * @kind function
 *
 * @description
 *
 * Handles the admin view
 */
(function() {
    'use strict';

    DefaultLayoutController.$inject = ["$scope", "$element", "$timeout", "$window", "triLayout"];
    angular
        .module('triangular.layouts')
        .controller('DefaultLayoutController', DefaultLayoutController);

    /* @ngInject */
    function DefaultLayoutController($scope, $element, $timeout, $window, triLayout) {
        // we need to use the scope here because otherwise the expression in md-is-locked-open doesnt work
        $scope.layout = triLayout.layout; //eslint-disable-line
        var vm = this;

        vm.activateHover = activateHover;
        vm.removeHover  = removeHover;

        ////////////////

        function activateHover() {
            if(triLayout.layout.sideMenuSize === 'icon') {
                $element.find('.admin-sidebar-left').addClass('hover');
                $timeout(function(){
                    $window.dispatchEvent(new Event('resize'));
                },300);
            }
        }

        function removeHover () {
            if(triLayout.layout.sideMenuSize === 'icon') {
                $element.find('.admin-sidebar-left').removeClass('hover');
                $timeout(function(){
                    $window.dispatchEvent(new Event('resize'));
                },300);
            }
        }
    }
})();
(function() {
    'use strict';

    triDefaultContent.$inject = ["$rootScope", "$compile", "$templateRequest", "triLayout"];
    angular
        .module('triangular.layouts')
        .directive('triDefaultContent', triDefaultContent);

    /* @ngInject */
    function triDefaultContent ($rootScope, $compile, $templateRequest, triLayout) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            link: link,
            replace: true,
            restrict: 'A'
        };
        return directive;

        function link($scope, $element) {
            // scroll page to the top when content is loaded (stops pages keeping scroll position even when they have changed url)
            $scope.$on('$stateChangeStart', scrollToTop);

            // when content view has loaded add footer if needed and send mdContentLoaded event
            $scope.$on('$viewContentLoaded', injectFooterUpdateContent);

            ////////////////////////

            function scrollToTop() {
                $element.scrollTop(0);
            }

            function injectFooterUpdateContent() {
                var contentView = $element.find('#admin-panel-content-view');
                var footerElem = contentView.find('#footer');
                if (footerElem.length === 0) {
                    // add footer to the content view
                    $templateRequest(triLayout.layout.footerTemplateUrl)
                    .then(function(template) {
                        // compile template with current scope and add to the content
                        var linkFn = $compile(template);
                        var content = linkFn($scope);
                        contentView.append(content);
                    });

                }
            }
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('triangular.components', [
        ]);
})();
(function() {
    'use strict';

    WizardController.$inject = ["$scope", "$timeout"];
    angular
        .module('triangular.components')
        .directive('triWizard', TriWizard);

    /* @ngInject */
    function TriWizard() {
        // Usage: <div tri-wizard> (put some forms in here) </div>
        //
        // Creates: Nothing
        //
        var directive = {
            bindToController: true,
            controller: WizardController,
            controllerAs: 'triWizard',
            restrict: 'A'
        };
        return directive;
    }

    /* @ngInject */
    function WizardController($scope, $timeout) {
        var vm = this;

        var forms = [];
        var totalRequiredFields = 0;

        vm.currentStep = 0;
        vm.getForm = getForm;
        vm.isFormValid = isFormValid;
        vm.nextStep = nextStep;
        vm.nextStepDisabled = nextStepDisabled;
        vm.prevStep = prevStep;
        vm.prevStepDisabled = prevStepDisabled;
        vm.progress = 0;
        vm.registerForm = registerForm;
        vm.updateProgress = updateProgress;

        ////////////////

        function getForm(index) {
            return forms[index];
        }

        function nextStep() {
            vm.currentStep = vm.currentStep + 1;
        }

        function nextStepDisabled() {
            // get current active form
            var form = $scope.triWizard.getForm(vm.currentStep);
            var formInvalid = true;
            if(angular.isDefined(form) && angular.isDefined(form.$invalid)) {
                formInvalid = form.$invalid;
            }
            return formInvalid;
        }

        function isFormValid(step) {
            if(angular.isDefined(forms[step])) {
                return forms[step].$valid;
            }
        }

        function prevStep() {
            vm.currentStep = vm.currentStep - 1;
        }

        function prevStepDisabled() {
            return vm.currentStep === 0;
        }

        function registerForm(form) {
            forms.push(form);
        }

        function updateProgress() {
            var filledRequiredFields = calculateFilledFields();

            // calculate percentage process for completing the wizard
            vm.progress = Math.floor((filledRequiredFields / totalRequiredFields) * 100);
        }

        function calculateFilledFields() {
            var filledValidFields = 0;
            for (var form = forms.length - 1; form >= 0; form--) {
                angular.forEach(forms[form], function(field) {
                    if(angular.isObject(field) && field.hasOwnProperty('$modelValue') && field.$valid === true){
                        filledValidFields = filledValidFields + 1;
                    }
                });
            }
            return filledValidFields;
        }

        // init

        // wait until this tri wizard is ready (all forms registered)
        // then calculate the total form fields
        $timeout(function() {
            for (var form = forms.length - 1; form >= 0; form--) {
                angular.forEach(forms[form], function(field) {
                    if(angular.isObject(field) && field.hasOwnProperty('$modelValue')){
                        totalRequiredFields = totalRequiredFields + 1;
                    }
                });
            }
            updateProgress();
        });
    }
})();
(function() {
    'use strict';

    angular
        .module('triangular.components')
        .directive('triWizardForm', WizardFormProgress);

    /* @ngInject */
    function WizardFormProgress() {
        // Usage:
        //  <div tri-wizard>
        //      <form tri-wizard-form>
        //      </form>
        //  </div>
        //
        var directive = {
            require: ['form', '^triWizard'],
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs, require) {
            var ngFormCtrl = require[0];
            var triWizardCtrl = require[1];

            // register this form with the parent triWizard directive
            triWizardCtrl.registerForm(ngFormCtrl);

            // watch for form input changes and update the wizard progress
            element.on('input', function() {
                triWizardCtrl.updateProgress();
            });
        }
    }
})();
(function() {
    'use strict';

    widget.$inject = ["$mdTheming"];
    angular
        .module('triangular.components')
        .directive('triWidget', widget);

    /* @ngInject */
    function widget ($mdTheming) {
        // Usage:
        //
        // ```html
        // <widget title="'Nice Title'" subtitle="'Subtitle'" avatar="http://myavatar.jpg" title-position="top|bottom|left|right" content-padding overlay-title>content here</widget>
        // ```

        // Creates:
        //
        // Widget for use in dashboards
        var directive = {
            restrict: 'E',
            templateUrl: 'app/triangular/components/widget/widget.tmpl.html',
            transclude: true,
            replace: true,
            scope: {
                title: '@',
                subtitle: '@',
                avatar: '@'
            },
            bindToController: true,
            controller: Controller,
            controllerAs: 'vm',
            link: link
        };
        return directive;

        function link($scope, $element, attrs) {
            // set the value of the widget layout attribute
            $scope.vm.widgetLayout = attrs.titlePosition === 'left' || attrs.titlePosition === 'right' ? 'row' : 'column';
            // set the layout attribute for the widget content
            $scope.vm.contentLayout = angular.isUndefined(attrs.contentLayout) ? 'column' : attrs.contentLayout;
            // set if the layout-padding attribute will be added
            $scope.vm.contentPadding = angular.isDefined(attrs.contentPadding);
            // set the content align
            $scope.vm.contentLayoutAlign = angular.isUndefined(attrs.contentLayoutAlign) ? '' : attrs.contentLayoutAlign;
            // set the order of the title and content based on title position
            $scope.vm.titleOrder = attrs.titlePosition === 'right' || attrs.titlePosition === 'bottom' ? 2 : 1;
            $scope.vm.contentOrder = attrs.titlePosition === 'right' || attrs.titlePosition === 'bottom' ? 1 : 2;
            // set if we overlay the title on top of the widget content
            $scope.vm.overlayTitle = angular.isUndefined(attrs.overlayTitle) ? undefined : true;

            $mdTheming($element);

            if(angular.isDefined(attrs.class)) {
                $element.addClass(attrs.class);
            }

            if(angular.isDefined(attrs.backgroundImage)) {
                $element.css('background-image', 'url(' + attrs.backgroundImage + ')');
            }

            $scope.menuClick = function($event) {
                if(angular.isUndefined($scope.menu.menuClick)) {
                    $scope.menu.menuClick($event);
                }
            };

            // remove title attribute to stop popup on hover
            $element.attr('title', '');
        }
    }

    /* @ngInject */
    function Controller () {
        var vm = this;
        vm.menu = null;
        vm.loading = false;

        this.setMenu = function(menu) {
            vm.menu = menu;
        };

        this.setLoading = function(loading) {
            vm.loading = loading;
        };
    }
})();
(function() {
    'use strict';

    DefaultToolbarController.$inject = ["$scope", "$injector", "$rootScope", "$mdMedia", "$state", "$element", "$filter", "$mdUtil", "$mdSidenav", "$mdToast", "$timeout", "$document", "triBreadcrumbsService", "triSettings", "triLayout"];
    angular
        .module('triangular.components')
        .controller('DefaultToolbarController', DefaultToolbarController);

    /* @ngInject */
    function DefaultToolbarController($scope, $injector, $rootScope, $mdMedia, $state, $element, $filter, $mdUtil, $mdSidenav, $mdToast, $timeout, $document, triBreadcrumbsService, triSettings, triLayout) {
        var vm = this;
        vm.breadcrumbs = triBreadcrumbsService.breadcrumbs;
        vm.emailNew = false;
        vm.languages = triSettings.languages;
        vm.openSideNav = openSideNav;
        vm.hideMenuButton = hideMenuButton;
        vm.switchLanguage = switchLanguage;
        vm.toggleNotificationsTab = toggleNotificationsTab;
        vm.isFullScreen = false;
        vm.fullScreenIcon = 'zmdi zmdi-fullscreen';
        vm.toggleFullScreen = toggleFullScreen;

        // initToolbar();

        ////////////////

        function openSideNav(navID) {
            $mdUtil.debounce(function(){
                $mdSidenav(navID).toggle();
            }, 300)();
        }

        function switchLanguage(languageCode) {
            if($injector.has('$translate')) {
                var $translate = $injector.get('$translate');
                $translate.use(languageCode)
                .then(function() {
                    $mdToast.show(
                        $mdToast.simple()
                        .content($filter('triTranslate')('Language Changed'))
                        .position('bottom right')
                        .hideDelay(500)
                    );
                    $rootScope.$emit('changeTitle');
                });
            }
        }

        function hideMenuButton() {
            return triLayout.layout.sideMenuSize !== 'hidden' && $mdMedia('gt-sm');
        }

        function toggleNotificationsTab(tab) {
            $rootScope.$broadcast('triSwitchNotificationTab', tab);
            vm.openSideNav('notifications');
        }

        function toggleFullScreen() {
            vm.isFullScreen = !vm.isFullScreen;
            vm.fullScreenIcon = vm.isFullScreen ? 'zmdi zmdi-fullscreen-exit':'zmdi zmdi-fullscreen';
            // more info here: https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
            var doc = $document[0];
            if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement ) {
                if (doc.documentElement.requestFullscreen) {
                    doc.documentElement.requestFullscreen();
                } else if (doc.documentElement.msRequestFullscreen) {
                    doc.documentElement.msRequestFullscreen();
                } else if (doc.documentElement.mozRequestFullScreen) {
                    doc.documentElement.mozRequestFullScreen();
                } else if (doc.documentElement.webkitRequestFullscreen) {
                    doc.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (doc.exitFullscreen) {
                    doc.exitFullscreen();
                } else if (doc.msExitFullscreen) {
                    doc.msExitFullscreen();
                } else if (doc.mozCancelFullScreen) {
                    doc.mozCancelFullScreen();
                } else if (doc.webkitExitFullscreen) {
                    doc.webkitExitFullscreen();
                }
            }
        }

        $scope.$on('newMailNotification', function(){
            vm.emailNew = true;
        });
    }
})();

(function() {
    'use strict';

    triTable.$inject = ["$filter"];
    angular
        .module('triangular.components')
        .directive('triTable', triTable);

    /* @ngInject */
    function triTable($filter) {
        var directive = {
            restrict: 'E',
            scope: {
                columns: '=',
                contents: '=',
                filters: '='
            },
            link: link,
            templateUrl: 'app/triangular/components/table/table-directive.tmpl.html'
        };
        return directive;

        function link($scope, $element, attrs) {
            var sortableColumns = [];
            var activeSortColumn = null;
            var activeSortOrder = false;

            // init page size if not set to default
            $scope.pageSize = angular.isUndefined(attrs.pageSize) ? 0 : attrs.pageSize;

            // init page if not set to default
            $scope.page = angular.isUndefined(attrs.page) ? 0 : attrs.page;

            // make an array of all sortable columns
            angular.forEach($scope.columns, function(column) {
                if(column.sortable) {
                    sortableColumns.push(column.field);
                }
            });

            $scope.refresh = function(resetPage) {
                if(resetPage === true) {
                    $scope.page = 0;
                }
                $scope.contents = $filter('orderBy')($scope.contents, activeSortColumn, activeSortOrder);
            };

            // if we have sortable columns sort by first by default
            if(sortableColumns.length > 0) {
                // sort first column by default
                activeSortOrder = false;
                activeSortColumn = sortableColumns[0];
                $scope.refresh();
            }

            $scope.sortClick = function(field) {
                if(sortableColumns.indexOf(field) !== -1) {
                    if(field === activeSortColumn) {
                        activeSortOrder = !activeSortOrder;
                    }
                    activeSortColumn = field;
                    $scope.refresh();
                }
            };

            $scope.showSortOrder = function(field, orderDown) {
                return field === activeSortColumn && activeSortOrder === orderDown;
            };

            $scope.headerClass = function(field) {
                var classes = [];
                if(sortableColumns.indexOf(field) !== -1) {
                    classes.push('sortable');
                }
                if(field === activeSortColumn) {
                    classes.push('sorted');
                }
                return classes;
            };

            $scope.cellContents = function(column, content) {
                if(angular.isDefined(column.filter)) {
                    return $filter(column.filter)(content[column.field]);
                }
                else {
                    return content[column.field];
                }
            };

            $scope.totalItems = function() {
                return $scope.contents.length;
            };

            $scope.numberOfPages = function() {
                return Math.ceil($scope.contents.length / $scope.pageSize);
            };

            $scope.pageStart = function() {
                return ($scope.page * $scope.pageSize) + 1;
            };

            $scope.pageEnd = function() {
                var end = (($scope.page + 1) * $scope.pageSize);
                if(end > $scope.contents.length) {
                    end = $scope.contents.length;
                }
                return end;
            };

            $scope.goToPage = function (page) {
                $scope.page = page;
            };
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('triangular.components')
        .filter('startFrom', startFrom);

    function startFrom() {
        return filterFilter;

        ////////////////

        function filterFilter(input, start) {
            if (input && input.length > 0) {
                start = +start;
                return input.slice(start);
            }
        }
    }

})();

(function() {
    'use strict';

    tableImage.$inject = ["$sce"];
    angular
        .module('triangular.components')
        .filter('tableImage', tableImage);

    function tableImage($sce) {
        return filterFilter;

        ////////////////

        function filterFilter(value) {
            return $sce.trustAsHtml('<div style=\"background-image: url(\'' + value + '\')\"/>');
        }
    }

})();
(function() {
    'use strict';

    NotificationsPanelController.$inject = ["$scope", "$http", "$mdSidenav", "$state", "API_CONFIG"];
    angular
        .module('triangular.components')
        .controller('NotificationsPanelController', NotificationsPanelController);

    /* @ngInject */
    function NotificationsPanelController($scope, $http, $mdSidenav, $state, API_CONFIG) {
        var vm = this;
        // sets the current active tab
        vm.close = close;
        vm.currentTab = 0;
        vm.notificationGroups = [{
            name: 'Twitter',
            notifications: [{
                title: 'Mention from oxygenna',
                icon: 'fa fa-twitter',
                iconColor: '#55acee',
                date: moment().startOf('hour')
            },{
                title: 'Oxygenna',
                icon: 'fa fa-twitter',
                iconColor: '#55acee',
                date: moment().startOf('hour')
            },{
                title: 'Oxygenna',
                icon: 'fa fa-twitter',
                iconColor: '#55acee',
                date: moment().startOf('hour')
            },{
                title: 'Followed by Oxygenna',
                icon: 'fa fa-twitter',
                iconColor: '#55acee',
                date: moment().startOf('hour')
            }]
        },{
            name: 'Server',
            notifications: [{
                title: 'Server Down',
                icon: 'zmdi zmdi-alert-circle',
                iconColor: 'rgb(244, 67, 54)',
                date: moment().startOf('hour')
            },{
                title: 'Slow Response Time',
                icon: 'zmdi zmdi-alert-triangle',
                iconColor: 'rgb(255, 152, 0)',
                date: moment().startOf('hour')
            },{
                title: 'Server Down',
                icon: 'zmdi zmdi-alert-circle',
                iconColor: 'rgb(244, 67, 54)',
                date: moment().startOf('hour')
            }]
        },{
            name: 'Sales',
            notifications: [{
                title: 'Triangular Admin $21',
                icon: 'zmdi zmdi-shopping-cart',
                iconColor: 'rgb(76, 175, 80)',
                date: moment().startOf('hour')
            },{
                title: 'Lambda WordPress $60',
                icon: 'zmdi zmdi-shopping-cart',
                iconColor: 'rgb(76, 175, 80)',
                date: moment().startOf('hour')
            },{
                title: 'Triangular Admin $21',
                icon: 'zmdi zmdi-shopping-cart',
                iconColor: 'rgb(76, 175, 80)',
                date: moment().startOf('hour')
            },{
                title: 'Triangular Admin $21',
                icon: 'zmdi zmdi-shopping-cart',
                iconColor: 'rgb(76, 175, 80)',
                date: moment().startOf('hour')
            },{
                title: 'Lambda WordPress $60',
                icon: 'zmdi zmdi-shopping-cart',
                iconColor: 'rgb(76, 175, 80)',
                date: moment().startOf('hour')
            },{
                title: 'Triangular Admin $21',
                icon: 'zmdi zmdi-shopping-cart',
                iconColor: 'rgb(76, 175, 80)',
                date: moment().startOf('hour')
            }]
        }];
        vm.openMail = openMail;
        vm.settingsGroups = [{
            name: 'Account Settings',
            settings: [{
                title: 'Show my location',
                icon: 'zmdi zmdi-pin',
                enabled: true
            },{
                title: 'Show my avatar',
                icon: 'zmdi zmdi-face',
                enabled: false
            },{
                title: 'Send me notifications',
                icon: 'zmdi zmdi-notifications-active',
                enabled: true
            }]
        },{
            name: 'Chat Settings',
            settings: [{
                title: 'Show my username',
                icon: 'zmdi zmdi-account',
                enabled: true
            },{
                title: 'Make my profile public',
                icon: 'zmdi zmdi-account-box',
                enabled: false
            },{
                title: 'Allow cloud backups',
                icon: 'zmdi zmdi-cloud-upload',
                enabled: true
            }]
        }];

        vm.statisticsGroups = [{
            name: 'User Statistics',
            stats: [{
                title: 'Storage Space (120/160 Gb)',
                mdClass: 'md-primary',
                value: 60
            },{
                title: 'Bandwidth Usage (10/100 Gb)',
                mdClass: 'md-accent',
                value: 10
            },{
                title: 'Memory Usage (1/8 Gb)',
                mdClass: 'md-warn',
                value: 100
            }]
        },{
            name: 'Server Statistics',
            stats: [{
                title: 'Storage Space (120/160 Gb)',
                mdClass: 'md-primary',
                value: 60
            },{
                title: 'Bandwidth Usage (10/100 Gb)',
                mdClass: 'md-accent',
                value: 10
            },{
                title: 'Memory Usage (1/8 Gb)',
                mdClass: 'md-warn',
                value: 100
            }]
        }];

        ////////////////

        // add an event to switch tabs (used when user clicks a menu item before sidebar opens)
        $scope.$on('triSwitchNotificationTab', function($event, tab) {
            vm.currentTab = tab;
        });

        // fetch some dummy emails from the API
        $http({
            method: 'GET',
            url: API_CONFIG.url + 'email/inbox'
        }).then(function(response) {
            vm.emails = response.data.slice(1,20);
        });

        function openMail() {
            $state.go('triangular-no-scroll.email.inbox');
            vm.close();
        }

        function close() {
            $mdSidenav('notifications').close();
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('triangular.components')
        .provider('triMenu', menuProvider);


    /* @ngInject */
    function menuProvider() {
        // Provider
        var menuArray = [];

        this.addMenu = addMenu;
        this.removeMenu = removeMenu;
        this.removeAllMenu = removeAllMenu;

        function addMenu(item) {
            menuArray.push(item);
        }

        function getMenu(id) {
            return findMenu(menuArray, id);
        }

        function removeMenu(state, params) {
            findAndDestroyMenu(menuArray, state, params);
        }

        function removeAllMenu() {
            for (var i = menuArray.length - 1; i >= 0 ; i--) {
                menuArray.splice(i, 1);
            }
        }

        function findMenu(menu, id) {
            var found;
            if (menu instanceof Array) {
                for (var i = 0; i < menu.length; i++) {
                    if(menu[i].id === id) {
                        found = menu[i];
                        break;
                    }
                    else if(angular.isDefined(menu[i].children)) {
                        found = findMenu(menu[i].children, id);
                        if(angular.isDefined(found)) {
                            break;
                        }
                    }
                }
            }
            return found;
        }

        function findAndDestroyMenu(menu, state, params, isChildren) {
            if (menu instanceof Array) {
                for (var i = menu.length - 1; i >= 0 ; i--) {
                    if(menu[i].state === state && angular.equals(menu[i].params, params)) {
                        menu.splice(i, 1);
                        if (!isNaN(isChildren) && !menuArray[isChildren].children.length) {
                            menuArray.splice(isChildren, 1);
                        }
                        break;
                    }
                    else if(angular.isDefined(menu[i].children)) {
                        findAndDestroyMenu(menu[i].children, state, params, i);
                    }
                }
            }
        }

        // Service
        this.$get = function() {
            return {
                menu: menuArray,
                addMenu: addMenu,
                getMenu: getMenu,
                removeMenu: removeMenu,
                removeAllMenu: removeAllMenu
            };
        };
    }
})();


(function() {
    'use strict';

    triMenuDirective.$inject = ["$location", "$mdTheming", "triTheming"];
    triMenuController.$inject = ["triMenu"];
    angular
        .module('triangular.components')
        .directive('triMenu', triMenuDirective);

    /* @ngInject */
    function triMenuDirective($location, $mdTheming, triTheming) {
        var directive = {
            restrict: 'E',
            template: '<md-content><tri-menu-item permission permission-only="item.permission" ng-repeat="item in triMenuController.menu | orderBy:\'priority\'" item="::item"></tri-menu-item></md-content>',
            scope: {},
            controller: triMenuController,
            controllerAs: 'triMenuController',
            link: link
        };
        return directive;

        function link($scope, $element) {
            $mdTheming($element);
            var $mdTheme = $element.controller('mdTheme'); //eslint-disable-line

            var menuColor = triTheming.getThemeHue($mdTheme.$mdTheme, 'primary', 'default');
            var menuColorRGBA = triTheming.rgba(menuColor.value);
            $element.css({ 'background-color': menuColorRGBA });
            $element.children('md-content').css({ 'background-color': menuColorRGBA });
        }
    }

    /* @ngInject */
    function triMenuController(triMenu) {
        var triMenuController = this;
        // get the menu and order it
        triMenuController.menu = triMenu.menu;
    }
})();

(function() {
    'use strict';

    triMenuItemController.$inject = ["$scope", "$injector", "$mdSidenav", "$state", "$filter", "$window", "triBreadcrumbsService"];
    angular
        .module('triangular.components')
        .directive('triMenuItem', triMenuItemDirective);

    /* @ngInject */
    function triMenuItemDirective() {
        var directive = {
            restrict: 'E',
            require: '^triMenu',
            scope: {
                item: '='
            },
            // replace: true,
            template: '<div ng-include="::triMenuItem.item.template"></div>',
            controller: triMenuItemController,
            controllerAs: 'triMenuItem',
            bindToController: true
        };
        return directive;
    }

    /* @ngInject */
    function triMenuItemController($scope, $injector, $mdSidenav, $state, $filter, $window, triBreadcrumbsService) {
        var triMenuItem = this;
        // load a template for this directive based on the type ( link | dropdown )
        triMenuItem.item.template = 'app/triangular/components/menu/menu-item-' + triMenuItem.item.type + '.tmpl.html';

        switch(triMenuItem.item.type) {
            case 'dropdown':
                // if we have kids reorder them by priority
                triMenuItem.item.children = $filter('orderBy')(triMenuItem.item.children, 'priority');
                triMenuItem.toggleDropdownMenu = toggleDropdownMenu;
                // add a check for open event
                $scope.$on('toggleDropdownMenu', function(event, item, open) {
                    // if this is the item we are looking for
                    if(triMenuItem.item === item) {
                        triMenuItem.item.open = open;
                    }
                    else {
                        triMenuItem.item.open = false;
                    }
                });
                // this event is emitted up the tree to open parent menus
                $scope.$on('openParents', function() {
                    // openParents event so open the parent item
                    triMenuItem.item.open = true;
                    // also add this to the breadcrumbs
                    triBreadcrumbsService.addCrumb(triMenuItem.item);
                });
                break;
            case 'link':
                triMenuItem.openLink = openLink;

                // on init check if this is current menu
                checkItemActive($state.current.name, $state.params);

                $scope.$on('$stateChangeSuccess', function(event, toState, toParams) {
                    checkItemActive(toState.name, toParams);
                });
                break;
        }

        function checkItemActive() {
            // first check if the state is the same
            triMenuItem.item.active = $state.includes(triMenuItem.item.state, triMenuItem.item.params);
            // if we are now the active item reset the breadcrumbs and open all parent dropdown items
            if(triMenuItem.item.active) {
                triBreadcrumbsService.reset();
                triBreadcrumbsService.addCrumb(triMenuItem.item);
                $scope.$emit('openParents');
            }
        }

        function toggleDropdownMenu() {
            $scope.$parent.$parent.$broadcast('toggleDropdownMenu', triMenuItem.item, !triMenuItem.item.open);
        }

        function openLink() {
            if(angular.isDefined(triMenuItem.item.click)) {
                $injector.invoke(triMenuItem.item.click);
            }
            else {
                var params = angular.isUndefined(triMenuItem.item.params) ? {} : triMenuItem.item.params;
                if(angular.isDefined(triMenuItem.item.openInNewTab) && triMenuItem.item.openInNewTab === true) {
                    var url = $state.href(triMenuItem.item.state, params);
                    $window.open(url, '_blank');
                }
                else {
                    $state.go(triMenuItem.item.state, params);
                }
            }
            triMenuItem.item.active = true;
            $mdSidenav('left').close();
        }
    }
})();

(function() {
    'use strict';

    TriLoaderController.$inject = ["$rootScope", "triLoaderService", "triSettings"];
    angular
        .module('triangular.components')
        .directive('triLoader', TriLoader);

    /* @ngInject */
    function TriLoader () {
        var directive = {
            bindToController: true,
            controller: TriLoaderController,
            controllerAs: 'vm',
            template: '<div flex class="loader padding-100" ng-show="vm.isActive()" layout="column" layout-fill layout-align="center center"><h3 class="md-headline">{{vm.triSettings.name}}</h3><md-progress-linear md-mode="indeterminate"></md-progress-linear></div>',
            restrict: 'E',
            replace: true,
            scope: {
            }
        };
        return directive;
    }

    /* @ngInject */
    function TriLoaderController ($rootScope, triLoaderService, triSettings) {
        var vm = this;
        vm.triSettings = triSettings;
        vm.isActive    = triLoaderService.isActive;
    }
})();

(function() {
    'use strict';

    LoaderService.$inject = ["$rootScope"];
    angular
        .module('triangular.components')
        .factory('triLoaderService', LoaderService);

    /* @ngInject */
    function LoaderService($rootScope) {
        var active = false;

        return {
            isActive: isActive,
            setLoaderActive: setLoaderActive
        };

        ////////////////

        function isActive() {
            return active;
        }

        function setLoaderActive(setActive) {
            active = setActive;
            $rootScope.$broadcast('loader', active);
        }
    }
})();

(function() {
    'use strict';

    FooterController.$inject = ["triSettings", "triLayout"];
    angular
        .module('triangular.components')
        .controller('FooterController', FooterController);

    /* @ngInject */
    function FooterController(triSettings, triLayout) {
        var vm = this;
        vm.name = triSettings.name;
        vm.copyright = triSettings.copyright;
        vm.layout = triLayout.layout;
        vm.version = triSettings.version;
    }
})();
(function() {
    'use strict';

    BreadcrumbsService.$inject = ["$rootScope"];
    angular
        .module('triangular.components')
        .factory('triBreadcrumbsService', BreadcrumbsService);

    /* @ngInject */
    function BreadcrumbsService($rootScope) {
        var crumbs = [];

        return {
            breadcrumbs: {
                crumbs: crumbs
            },
            addCrumb: addCrumb,
            reset: reset
        };

        ////////////////

        function addCrumb(item) {
            this.breadcrumbs.crumbs.unshift(item);
            $rootScope.$emit('changeTitle');
        }

        function reset() {
            this.breadcrumbs.crumbs = [];
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('app.products', ['xeditable'
        ])
        // x EDITABLE run function
		.run(['editableOptions', function(editableOptions) {
  				editableOptions.theme = 'hager-pink'; // bootstrap3 theme. Can be also 'bs2', 'default'
		}]);
         
})();
(function() {
    'use strict';

     productsDashboardController.$inject = ["$mdDialog", "$document", "$interval", "$scope", "$state", "$filter", "$stateParams", "$rootScope", "$log", "ProductsManagementService", "PCAManagementService", "UserService", "DocsService", "documentsAPIService", "$timeout", "NotificationService"];
    angular
        .module('app.products')
        .controller('productsDashboardController', productsDashboardController);

    /* @ngInject */ 
    function productsDashboardController($mdDialog, $document , $interval , $scope , $state , $filter , $stateParams ,$rootScope , $log,ProductsManagementService , PCAManagementService, UserService, DocsService , documentsAPIService, $timeout, NotificationService ) {
        var vm = this;

        // Env Vars
        vm.product = {};
        vm.CategoryView = {};
        // Loading status 
        vm.status = 'idle';  // idle | uploading | complete
        vm.reports = [];

        // Charts
        vm.series = [];
        //vm.labels = ['P','F','A'];
        vm.labels = ['NA','F','A', 'P'];
        vm.data = {};
        vm.options = {
            datasetFill: false
        };

        var AcceptedFileTypes = ["application/pdf"];
        // Public functions
        vm.getStandardColor = getStandardColor;
        vm.backtoproducts = backtoproducts;
        vm.saveproduct = saveproduct;
        vm.getStdProgress = getStdProgress;
        vm.getCategoryProgress = getCategoryProgress;
        vm.GeneratedTF = GeneratedTF;
        vm.getreport = getreport;

        /////////

        // init 
        init(); 
 
        function init()
        {
            var promise1 = new Promise(function(resolve, reject) {
                resolve($timeout( function(){ vm.status = 'loading' ;}  , 100));
            });

            promise1.then(function(value) {
                        if($stateParams.product == null)
                        {
                            $state.go('triangular.products-manage');
                        }
                        else
                        {
                            vm.product = angular.copy($stateParams.product);
                            vm.CategoryView = buildCategoryView();
                            buildStats();
                            vm.status = 'idle';
                        }        
            });
        }

       /* function buildStats()
        {
            initVars();

            for(var i=0; i < vm.series.length ; i++)
            {
                var count = getCategoryProgress(vm.series[i]);
                vm.data[vm.series[i]].push(
                    $filter('number')(count.perP, 2), 
                    $filter('number')(count.perF, 2),
                    $filter('number')(count.perA, 2)
                    );
            }
        } */

        function buildStats()
        {
            initVars();
            var P = 0;
            var F = 0;
            var A = 0;
            var NA= 0;
            for(var i=0; i < vm.series.length ; i++)
            {
                var count = getCategoryProgress(vm.series[i]);
                P = P + count.P;
                A = A + count.A;
                F = F + count.F;
                NA = NA + count.NA;
            }
            vm.data['ALL Categories'].push(  NA ,F , A, P); 
        }

        function getStdProgress(std)
        {
            var count = {
                P: 0,
                A: 0,
                F: 0,
                NA:0,
                '':0,
                perP: 0,
            };

            var len= vm.product.ProductJSON.Standards[std].Designations.length;
            for(var i =0 ; i < len; i++ )
            {
                count[vm.product.ProductJSON.Standards[std].Designations[i].Status]++;
            }
            if(len !=  count.NA +count[''])
                {
                    count.perP =  count.P / (len - count.NA - count[''] ) * 100;
                }
            return count;
        }

        function getCategoryProgress(CategoryName)
        {
            var Category = vm.CategoryView[CategoryName];
            var SubCat = Object.keys(Category);
            var len = 0;
            var count = {
                P: 0,
                A: 0,
                F: 0,
                NA:0,
                '':0,
                perP: 0,
                perA: 0,
                perF: 0,
            };

            for(var i = 0; i< SubCat.length ; i++)
            {
                for(var j = 0 ; j < Category[SubCat[i]].length ; j++)
                {
                        count[Category[SubCat[i]][j].Status] = count[Category[SubCat[i]][j].Status] + 1;
                        len++;
                }
            }

            if(len !=  count.NA +count[''])
                {
                    count.perP =  count.P / (len - count.NA - count[''] ) * 100;
                    count.perF =  count.F / (len - count.NA - count[''] ) * 100;
                    count.perA =  count.A / (len - count.NA - count[''] ) * 100;
                }
            return count;
        }

        function buildCategoryView()
        {
            var Standards = Object.keys(vm.product.ProductJSON.Standards);

            for(var i = 0; i < Standards.length ; i++)
            {
                for(var j = 0; j < vm.product.ProductJSON.Standards[Standards[i]].Designations.length ; j++)
                {
                    var Point = vm.product.ProductJSON.Standards[Standards[i]].Designations[j];
                    vm.product.ProductJSON.Standards[Standards[i]].Designations[j] = Point;

                    // find reports 
                    if(Array.isArray(Point.Reports))
                    {
                        Array.prototype.push.apply(vm.reports ,Point.Reports);
                    }

                    // Point having category 
                    if(Point.Category != '')
                    {
                        // is the Object having this Category as key ?
                        if( vm.CategoryView.hasOwnProperty(Point.Category) )
                        {
                            // yes => is this category value is a map having a key named DesignationTitle ?
                            if( vm.CategoryView[Point.Category].hasOwnProperty(Point.SubCategory) )
                            {
                                // yes => push the point to this map
                                vm.CategoryView[Point.Category][Point.SubCategory].push(Point);
                            }
                            else
                            {
                                // No : create a new map having this DesignationTitle as a key and the array of points as value 
                                vm.CategoryView[Point.Category][Point.SubCategory] = [Point] ;
                            }
                        }
                        else 
                        {
                            // No => Create a new key in CategoryView equal to the category, and add to this key a new map of Titles
                            vm.CategoryView[Point.Category] = {} ;
                            vm.CategoryView[Point.Category][Point.SubCategory] = [Point] ;
                        }
                    }
                    else
                    {
                      // No => Add a new key equal to Standard and add a new map to the value of this key
                      if(vm.CategoryView.hasOwnProperty(Standards[i]))
                      {
                          vm.CategoryView[Standards[i]][Point.DesignationTitle] = [Point] ; 
                      }
                      else
                      {
                          vm.CategoryView[Standards[i]] = {};
                          vm.CategoryView[Standards[i]][Point.DesignationTitle] = [Point] ;                         
                      }
                    }    
                }
            }
            return vm.CategoryView;
        }

       /* function initVars()
        {
            vm.series = Object.keys(vm.CategoryView);
            for(var i = 0 ; i < vm.series.length ; i++)
            {
                vm.data[vm.series[i]] = [];
            }
        } */

         function initVars()
        {
            vm.series = Object.keys(vm.CategoryView);
            vm.data['ALL Categories'] = [];
        }

        function getStandardColor(standard)
        {
            if(standard.Updates.length == 0)
            {
                return 'light-green:400';
            }
            else if(standard.Updates.length < 10)
            {
                return 'deep-orange:'+ standard.Updates.length + '00';
            }
            else 
            {
                return 'deep-orange:900';
            }
        }

        function backtoproducts()
        {
            $state.go('triangular.products-manage');
        }

        function saveproduct()
        {
            buildStats();
            ProductsManagementService.Updateproduct(vm.product)
                                     .then(function(product){
                                           NotificationService.RightSidebarNotif( 'Products', 'Update' , product.ProductInfo.Reference , UserService.getCurrentUser().username);
                                           NotificationService.popAToast('Product Saved successfully', 5000);  
                                     }).catch(function(err){
                                           //NotificationService.RightSidebarNotif( 'Errors', 'SAVING' , NewProduct.ProductInfo.Reference );
                                           NotificationService.popAToast('Product saving Error', 5000);
                                     });
        }

        $scope.AddReports = function (e , designation) 
        {
            var j = 0;
            for(var i = 0 ; i < e.files.length ; i++)
            {
                var file = e.files[i];
                if( true)
                {
                    var reader = new FileReader();
                    reader.readAsBinaryString(file);

                    reader.onerror = function (){
                        reader.abort();
                        new DOMException('Problem parsing input file.');
                        j++;
                    };

                    reader.onload = function () {     
                        StoreReport(designation, e.files[j].name, reader.result);   
                        j++; 
                    };
                }
                else 
                {
                    $timeout( NotificationService.popAToast('Error: not a pdf File.', 5000), 500);
                }
            
                $scope.$apply();
            }
        };

        function StoreReport(designation, filename, content)
        {
            if( !Array.isArray(designation.Reports) )
            {
                designation.Reports = [];
            }   
                
            DocsService.storedocument(content,  filename)
                       .then(function(report){
                                designation.Reports.push({name : report.name , id : report._id});
                                Array.prototype.push.apply(vm.reports , {name : report.name , id : report._id});
                                saveproduct();
                        }).catch(function(error){
                                // voilaa
                        })
        }

        function getreport(id, designation) {
            documentsAPIService.getDocumentbyId(id)
                               .then(function(report){

                                    saveAs(new Blob([DocsService.s2ab(report.document)],{type:""}), report.name);
                                    // doc...
                               }).catch(function(error){
                                     NotificationService.popAToast('Do you want to delete the report ? ', 5000)
                                                        .then(function(response){
                                                                 deleteReport(id, designation);
                                                        })
                                                        .catch(function(error){

                                                        })
                               })
        }

        function deleteReport(id, designation){

            for(var i = 0 ; i < designation.Reports.length ; i++)
            {
                if(designation.Reports[i].id == id)
                {
                    designation.Reports.splice(i, 1);
                    saveproduct();
                }
            }
        }

        // Generate Technichal Folder
        function GeneratedTF()
        {
            var QS = PCAManagementService.JsontoPCA(vm.product, 'QS');
            DocsService.GeneratedTF(QS , vm.product.ProductInfo.Reference , vm.reports);
        }

     }
    
})();


(function() {
    'use strict';

    AddProductController.$inject = ["$http", "ProductsAPIService", "$scope", "ProductsManagementService", "NotificationService", "StandardsAPIService", "StandardsManagementService", "$log", "UserService", "triLoaderService", "triMenu"];
    angular
        .module('app.products')
        .controller('AddProductController', AddProductController);

    /* @ngInject */
    function AddProductController($http, ProductsAPIService, $scope, ProductsManagementService, NotificationService , StandardsAPIService, StandardsManagementService, $log , UserService, triLoaderService, triMenu) {
        var vm = this;

        vm.product = '';
        vm.standards= [];

        vm.selectStandard = selectStandard;
        vm.addNewProduct = addNewProduct;

        vm.Product = {
            ProductInfo: {
                Reference: '',
                ImageBuffer: '',
                RiskAnalysis: '',
                Designation: '',
                Links: '',
                CreatedBy:UserService.getCurrentUser().displayName,
                Version: 0,
                Id_UpdateOf: 0
            },
            ProductJSON: {
                Standards:{

                }
            }
        }
 
        vm.formestatus = formestatus;
        vm.formcheck = formcheck;

        var productsMenu = triMenu.getMenu('Products');

        function init() { 
             // pop a toast telling users about the how to:
            NotificationService.popAToast('Add a new product by selecting a standard list.', 1000);
            StandardsAPIService.getStandardsList()
                               .then(function(standards) {
                                   vm.standards = StandardsManagementService.FormatStandards(standards) ;
                               });
        }
    
        function selectStandard(standard, state)
        {
            if(state == true)
            {
                // Add some  properties to Standard designations

                for(var i = 0 ; i < standard.Designations.length ; i++)
                {
                    standard.Designations[i].Comments = '';
                    standard.Designations[i].Reports = '';
                    standard.Designations[i].Status = '';
                } 

                vm.Product.ProductJSON.Standards[standard.Infos.Name] = {};
                vm.Product.ProductJSON.Standards[standard.Infos.Name].Designations = standard.Designations;
            } 

            else if(state == false && vm.Product.ProductJSON.Standards.hasOwnProperty(standard.Infos.Name))
               delete vm.Product.ProductJSON.Standards[standard.Infos.Name] ;
        }
 
         function addNewProduct()
        {
            ProductsManagementService.addNewProduct(vm.Product);
            NotificationService.RightSidebarNotif( 'Products', 'Add' , vm.Product.ProductInfo.Reference , UserService.getCurrentUser().username);
            NotificationService.popAToast('New Product Created successfully', 5000);        
        }

        $scope.TreatImage = function (e) {
           
            var reader = new FileReader();
            var file = e.files[0];

            if(file.size < 500000)
            {
              reader.readAsDataURL(file);
            }
            else 
            {
              NotificationService.popAToast('Error: Image size must be under 100 kB.', 5000);
            }

            reader.onerror = function (){
                        reader.abort();
                        new DOMException('Problem parsing input file.');
                        result.status = false;
                        resolve( result );
            };

            reader.onload = function () {
                        vm.Product.ProductInfo.ImageBuffer = reader.result; 
                        $scope.$apply();         
            };
        };

        function formestatus()
        {
            var status = false;
            var ErrorStack = '';

            if(vm.Product.ProductInfo.Reference =='' || vm.Product.ProductInfo.ImageBuffer =='' || vm.Product.ProductInfo.RiskAnalysis =='' || vm.Product.ProductInfo.Designation =='' || vm.Product.ProductInfo.Links =='' )
            {
                status = true;
            }
            return status;
        }

        function formcheck()
        {
            var ErrorStack = 'Error: ';

            if(vm.Product.ProductInfo.Reference =='')
            {
                ErrorStack = ErrorStack + 'Product Reference is Empty \n';
            }
            if( vm.Product.ProductInfo.ImageBuffer =='')
            {
                ErrorStack = ErrorStack + ' - ' + 'Product Image is Empty \n';
            }
            if( vm.Product.ProductInfo.RiskAnalysis =='')
            {
                ErrorStack = ErrorStack + ' - ' + 'Product RiskAnalysis is Empty \n';
            }
            if(vm.Product.ProductInfo.Designation =='')
            {
                ErrorStack = ErrorStack + ' - ' + 'Product Designation is Empty \n';
            }
            if( vm.Product.ProductInfo.Links =='')
            {
                ErrorStack = ErrorStack + ' - ' + 'Product Links is Empty \n';
            }

            if(ErrorStack != 'Error: ')
            {
                NotificationService.popAToast(ErrorStack, 5000);
            }
        }
        // init
        init();
    }
})();
(function() {
    'use strict';

    angular
        .module('app.examples.menu', [

        ]);
})();
(function() {
    'use strict';

    MenuDynamicController.$inject = ["dynamicMenuService", "triMenu"];
    angular
        .module('app.examples.menu')
        .controller('MenuDynamicController', MenuDynamicController);

    /* @ngInject */
    function MenuDynamicController(dynamicMenuService, triMenu) {
        var vm = this;
        // get dynamic menu service to store & keep track the state of the menu status
        vm.dynamicMenu = dynamicMenuService.dynamicMenu;
        // create toggle function
        vm.toggleExtraMenu = toggleExtraMenu;

        ////////////////

        function toggleExtraMenu(showMenu) {
            if(showMenu) {
                triMenu.addMenu({
                    name: 'Dynamic Menu-MENU',
                    icon: 'zmdi zmdi-flower-alt',
                    type: 'link',
                    priority: 0.0,
                    state: 'triangular.menu-dynamic-dummy-page'
                });
            }
            else {
                triMenu.removeMenu('triangular.menu-dynamic-dummy-page');
            }
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('app.examples.maps', [

        ]);
})();
(function() {
    'use strict';

    MapTerrainDemoController.$inject = ["uiGmapGoogleMapApi"];
    angular
        .module('app.examples.maps')
        .controller('MapTerrainDemoController', MapTerrainDemoController);

    /* @ngInject */
    function MapTerrainDemoController(uiGmapGoogleMapApi) {
        var vm = this;
        uiGmapGoogleMapApi.then(function(maps) {
            vm.terrainMap = {
                center: {
                    latitude: 51.219053,
                    longitude: 4.404418
                },
                zoom: 10,
                options:{
                    scrollwheel:false,
                    mapTypeId:maps.MapTypeId.TERRAIN
                }
            };

            vm.mapMarkers = [{
                id:0,
                coords: {
                    latitude: 51.239053,
                    longitude: 4.434418
                },
                options: {
                    icon: {
                        anchor: new maps.Point(36,36),
                        origin: new maps.Point(0,0),
                        url: 'assets/images/maps/blue_marker.png'
                    }
                },
                labelTitle: 'Hello from Antwerp!'
            },{
                id:1,
                coords: {
                    latitude: 51.379053,
                    longitude: 4.654418
                },
                options: {
                    icon: {
                        anchor: new maps.Point(36,36),
                        origin: new maps.Point(0,0),
                        url: 'assets/images/maps/blue_marker.png'
                    }
                },
                labelTitle: 'Hello from Brecht!'
            }];
        });
    }
})();
(function() {
    'use strict';

    MapLabelDemoController.$inject = ["$scope", "uiGmapGoogleMapApi"];
    angular
        .module('app.examples.maps')
        .controller('MapLabelDemoController', MapLabelDemoController);

    /* @ngInject */
    function MapLabelDemoController($scope, uiGmapGoogleMapApi) {
        var vm = this;
        uiGmapGoogleMapApi.then(function(maps) {
            vm.labeledMap = {
                center: {
                    latitude: 35.027469,
                    longitude: -111.022753
                },
                zoom: 4,
                marker: {
                    id:0,
                    coords: {
                        latitude: 35.027469,
                        longitude: -111.022753
                    },
                    options: {
                        icon: {
                            anchor: new maps.Point(36,36),
                            origin: new maps.Point(0,0),
                            url: 'assets/images/maps/blue_marker.png'
                        }
                    }
                },
                options:{
                    scrollwheel:false
                }
            };

            vm.labelTitle = 'Hello from Arizona!';
        });
    }
})();
(function() {
    'use strict';

    angular
        .module('app.examples.forms', [

        ]);
})();
(function() {
    'use strict';

    angular
        .module('app.examples.forms')
        .controller('Binding1Controller', Binding1Controller);

    /* @ngInject */
    function Binding1Controller() {
        var vm = this;
        vm.user = {
            username: 'Morris',
            password: '',
            description: '',
            favouriteColor: ''
        };
    }
})();
(function() {
    'use strict';

    Autocomplete1Controller.$inject = ["$timeout", "$q", "$log"];
    angular
        .module('app.examples.forms')
        .controller('Autocomplete1Controller', Autocomplete1Controller);

    /* @ngInject */
    function Autocomplete1Controller($timeout, $q, $log) {
        var vm = this;
        // list of `state` value/display objects
        vm.states             = loadAll();
        vm.selectedItem       = null;
        vm.searchText         = null;
        vm.querySearch        = querySearch;
        vm.simulateQuery      = false;
        vm.isDisabled         = false;
        vm.selectedItemChange = selectedItemChange;
        vm.searchTextChange   = searchTextChange;

        //////////////////
        function querySearch (query) {
            var results = query ? vm.states.filter( createFilterFor(query) ) : vm.states, deferred;
            if(self.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                return results;
            }
        }

        function searchTextChange(text) {
            $log.info('Text changed to ' + text);
        }

        function selectedItemChange(item) {
            $log.info('Item changed to ' + item);
        }

        /**
        * Build `states` list of key/value pairs
        */
        function loadAll() {
        /* jshint multistr: true */
            var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
                Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
                Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
                Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
                North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
                South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
                Wisconsin, Wyoming';

            return allStates.split(/, +/g).map(function (state) {
                return {
                    value: state.toLowerCase(),
                    display: state
                };
            });
        }

        /**
        * Create filter function for a query string
        */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(state) {
                return (state.value.indexOf(lowercaseQuery) === 0);
            };
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('app.examples.elements', [

        ]);
})();

(function() {
    'use strict';

    ElementsUploadAnimateController.$inject = ["$timeout", "$mdToast"];
    angular
        .module('app.examples.elements')
        .controller('ElementsUploadAnimateController', ElementsUploadAnimateController);

    /* @ngInject */
    function ElementsUploadAnimateController($timeout, $mdToast) {
        var vm = this;
        vm.status = 'idle';  // idle | uploading | complete
        vm.upload = upload;

        var fileList;
        ////////////////

        function upload($files) {
            if($files !== null && $files.length > 0) {
                fileList = $files;

                uploadStarted();

                $timeout(uploadComplete, 4000);
            }
        }

        function uploadStarted() {
            vm.status = 'uploading';
        }

        function uploadComplete() {
            vm.status = 'complete';
            var message = 'Thanks for ';
            for(var file in fileList) {
                message += fileList[file].name + ' ';
            }
            $mdToast.show({
                template: '<md-toast><span flex>' + message + '</span></md-toast>',
                position: 'bottom right',
                hideDelay: 5000
            });

            $timeout(uploadReset, 3000);
        }

        function uploadReset() {
            vm.status = 'idle';
        }
    }
})();
(function() {
    'use strict';

    ElementsUpload1Controller.$inject = ["$mdToast"];
    angular
        .module('app.examples.elements')
        .controller('ElementsUpload1Controller', ElementsUpload1Controller);

    /* @ngInject */
    function ElementsUpload1Controller($mdToast) {
        var vm = this;
        vm.upload = upload;

        ////////////////

        function upload($files) {
            if($files !== null && $files.length > 0) {
                var message = 'Thanks for ';
                for(var file in $files) {
                    message += $files[file].name + ' ';
                }
                $mdToast.show({
                    template: '<md-toast><span flex>' + message + '</span></md-toast>',
                    position: 'bottom right',
                    hideDelay: 5000
                });
            }
        }
    }
})();
(function() {
    'use strict';

    Toast1Controller.$inject = ["$mdToast"];
    angular
        .module('app.examples.elements')
        .controller('Toast1Controller', Toast1Controller);

    /* @ngInject */
    function Toast1Controller($mdToast) {
        var vm = this;
        vm.showToast = showToast;

        ////////////////

        function showToast($event, position) {
            var $button = angular.element($event.currentTarget);
            $mdToast.show({
                template: '<md-toast><span flex>I\'m a toast</span></md-toast>',
                position: position,
                hideDelay: 3000,
                parent: $button.parent()
            });
        }
    }
})();
(function() {
    'use strict';

    Controller.$inject = ["$scope", "$timeout", "$q", "GithubService"];
    angular
        .module('app.examples.elements')
        .controller('TablesAdvancedController', Controller);

    /* @ngInject */
    function Controller($scope, $timeout, $q, GithubService) {
        var vm = this;
        vm.query = {
            filter: '',
            limit: '10',
            order: '-id',
            page: 1
        };
        vm.selected = [];
        vm.columns = {
            avatar: 'Avatar',
            login: 'Login',
            id: 'ID'
        };
        vm.filter = {
            options: {
                debounce: 500
            }
        };
        vm.getUsers = getUsers;
        vm.removeFilter = removeFilter;

        activate();

        ////////////////

        function activate() {
            var bookmark;
            $scope.$watch('vm.query.filter', function (newValue, oldValue) {
                if(!oldValue) {
                    bookmark = vm.query.page;
                }

                if(newValue !== oldValue) {
                    vm.query.page = 1;
                }

                if(!newValue) {
                    vm.query.page = bookmark;
                }

                vm.getUsers();
            });
        }

        function getUsers() {
            vm.promise = GithubService.getUsers(vm.query);
            vm.promise.then(function(users){
                vm.users = users;
            });
        }

        function removeFilter() {
            vm.filter.show = false;
            vm.query.filter = '';

            if(vm.filter.form.$dirty) {
                vm.filter.form.$setPristine();
            }
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('app.examples.elements')
        .factory('GithubService', Service);

    Service.$inject = ['$http', '$q'];

    /* @ngInject */
    function Service($http) {
        return {
            getUsers: getUsers
        };

        ////////////////

        function getUsers(query) {
            var order = query.order === 'id' ? 'desc':'asc';
            return $http.get('https://api.github.com/search/users?q=' + query.filter + '+repos:%3E10+followers:%3E100&order='+order+'&sort=joined&per_page='+query.limit+'&page='+query.page).
            then(function(response) {
                return response.data;
            });
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('app.examples.elements')
        .controller('Tables1Controller', Tables1Controller);

    /* @ngInject */
    function Tables1Controller() {
        var vm = this;
        vm.columns = [{
            title: '',
            field: 'thumb',
            sortable: false,
            filter: 'tableImage'
        },{
            title: 'Name',
            field: 'name',
            sortable: true
        },{
            title: 'Description',
            field: 'description',
            sortable: true
        },{
            title: 'Date of Birth',
            field: 'birth',
            sortable: true
        }];

        vm.contents = [{
            thumb:'assets/images/avatars/avatar-1.png',
            name: 'Chris Doe',
            description: 'Developer',
            birth: 'Jun 5, 1994'
        },{
            thumb:'assets/images/avatars/avatar-2.png',
            name: 'Ann Doe',
            description: 'Commerce',
            birth: 'Jul 15, 1993'
        },{
            thumb:'assets/images/avatars/avatar-3.png',
            name: 'Mark Ronson',
            description: 'Designer',
            birth: 'Jan 27, 1984'
        },{
            thumb:'assets/images/avatars/avatar-4.png',
            name: 'Eric Doe',
            description: 'Human Resources',
            birth: 'Feb 3, 1985'
        },{
            thumb:'assets/images/avatars/avatar-5.png',
            name: 'John Doe',
            description: 'Commerce',
            birth: 'Sep 5, 1978'
        },{
            thumb:'assets/images/avatars/avatar-1.png',
            name: 'George Doe',
            description: 'Media',
            birth: 'Jun 23, 1996'
        },{
            thumb:'assets/images/avatars/avatar-2.png',
            name: 'Ann Ronson',
            description: 'Commerce',
            birth: 'Aug 16, 1995'
        },{
            thumb:'assets/images/avatars/avatar-3.png',
            name: 'Adam Ronson',
            description: 'Developer',
            birth: 'Jan 7, 1987'
        },{
            thumb:'assets/images/avatars/avatar-4.png',
            name: 'Hansel Doe',
            description: 'Social Media',
            birth: 'Feb 13, 1977'
        },{
            thumb:'assets/images/avatars/avatar-5.png',
            name: 'Tony Doe',
            description: 'CEO',
            birth: 'Sep 29, 1970'
        }];
    }
})();
(function() {
    'use strict';

    Loader1Controller.$inject = ["$timeout", "triLoaderService"];
    angular
        .module('app.examples.elements')
        .controller('Loader1Controller', Loader1Controller);

    /* @ngInject */
    function Loader1Controller($timeout, triLoaderService) {
        var vm = this;

        vm.showLoader = showLoader;
        vm.time = 5;

        ////////////

        function showLoader() {
            // turn the loader on
            triLoaderService.setLoaderActive(true);

            // wait for a while
            $timeout(function() {
                // now turn it off
                triLoaderService.setLoaderActive(false);
            }, vm.time * 1000);
        }
    }
})();

(function() {
    'use strict';

    Grids1Controller.$inject = ["triTheming"];
    angular
        .module('app.examples.elements')
        .controller('Grids1Controller', Grids1Controller);

    /* @ngInject */
    function Grids1Controller(triTheming) {
        var vm = this;
        vm.colorTiles = (function() {
            var tiles = [];
            for (var i = 0; i < 46; i++) {
                var tile = {
                    colspan: randomSpan(),
                    rowspan: randomSpan()
                };
                setColors(tile);
                tiles.push(tile);
            }
            return tiles;
        })();

        function setColors(tile) {
            var result;
            var count = 0;
            for (var palette in triTheming.palettes) {
                if (Math.random() < 1 / ++count && palette !== 'white') {
                    tile.palette = palette;
                    result = triTheming.palettes[palette];
                }
            }

            tile.hue = Math.floor((Math.random() * 9) + 1) * 100;
            tile.color = triTheming.rgba(result[tile.hue].value);
        }

        function randomSpan() {
            var r = Math.random();
            if (r < 0.8) {
                return 1;
            } else if (r < 0.9) {
                return 2;
            } else {
                return 3;
            }
        }
    }
})();
(function() {
    'use strict';

    Fab1Controller.$inject = ["$scope", "$mdToast", "$element"];
    angular
        .module('app.examples.elements')
        .controller('Fab1Controller', Fab1Controller);

    /* @ngInject */
    function Fab1Controller($scope, $mdToast, $element) {
        var vm = this;
        vm.fabDirections = ['up', 'down', 'left', 'right'];
        vm.fabDirection = vm.fabDirections[0];
        vm.fabAnimations = ['md-fling', 'md-scale'];
        vm.fabAnimation = vm.fabAnimations[0];
        vm.fabStatuses = [false, true];
        vm.fabStatus = vm.fabStatuses[0];
        vm.share = share;

        function share(message) {
            $mdToast.show({
                template: '<md-toast><span flex>' + message + '</span></md-toast>',
                position: 'top right',
                hideDelay: 3000,
                parent: $element
            });
        }
    }
})();
(function() {
    'use strict';

    DialogsController.$inject = ["$mdDialog"];
    angular
        .module('app.examples.elements')
        .controller('DialogsController', DialogsController);

    /* @ngInject */
    function DialogsController($mdDialog) {
        var vm = this;
        vm.createDialog = createDialog;
        vm.newDialog = {
            title: 'Are you sure?',
            content: 'This will wipe your whole computer!',
            ok: 'Agree',
            cancel: 'Disagree'
        };

        function createDialog($event, dialog) {
            $mdDialog.show(
                $mdDialog.confirm()
                .title(dialog.title)
                .textContent(dialog.content)
                .ok(dialog.ok)
                .cancel(dialog.cancel)
                .targetEvent($event)
            );
        }
    }
})();
(function() {
    'use strict';

    ChipsController.$inject = ["contacts"];
    angular
        .module('app.examples.elements')
        .controller('ChipsController', ChipsController);

    /* @ngInject */
    function ChipsController(contacts) {
        var vm = this;
        vm.email = {
            to: [],
            cc: [],
            bcc: []
        };
        vm.queryContacts = queryContacts;

        ////////////////

        function queryContacts($query) {
            var lowercaseQuery = angular.lowercase($query);
            return contacts.data.filter(function(contact) {
                var lowercaseName = angular.lowercase(contact.name);
                if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                    return contact;
                }
            });
        }
    }
})();
(function() {
    'use strict';

    weatherWidget.$inject = ["$http"];
    angular
        .module('app.examples.dashboards')
        .directive('weatherWidget', weatherWidget);

    /* @ngInject */
    function weatherWidget($http) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            require: 'triWidget',
            link: link,
            restrict: 'A'
        };
        return directive;

        function link($scope, $element, attrs, widgetCtrl) {
            widgetCtrl.setLoading(true);

            var query = 'select item.condition from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + attrs.weatherWidget + '")';
            var url = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(query) + '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';

            $http.get(url).
            then(function(response) {
                if(response.data.query.count > 0) {
                    widgetCtrl.setLoading(false);
                    $scope.weather = {
                        iconClass: 'wi-yahoo-' + response.data.query.results.channel.item.condition.code,
                        date: new Date(response.data.query.created),
                        temp: response.data.query.results.channel.item.condition.temp,
                        text: response.data.query.results.channel.item.condition.text,
                        location: attrs.weatherWidget
                    };
                }
            });
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('app.examples.dashboards')
        .directive('twitterWidget', twitterWidget);

    /* @ngInject */
    function twitterWidget() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            require: 'triWidget',
            link: link,
            restrict: 'A'
        };
        return directive;

        function link($scope) {
            $scope.tweets = [{
                user: 'oxygenna',
                body: 'Don\'t miss it! A Material Design Avatar set with 1440 avatars! http://sellfy.com/p/EUcC/ #avatars #materialdesign'
            },{
                user: 'oxygenna',
                body: 'Looking for a design for emotion case study to convince the boss/client? This one\'s worth $2.8 million.'
            },{
                user: 'oxygenna',
                body: 'New Freebie! A set of 27 Drinks-Lifestyle Icons available in PSD/AI/PNG format #freebie #icons #drinks http://wp.me/p5Xp06-Fq'
            }];

            $scope.selectedTab = 0;

            $scope.prevTweet = function() {
                $scope.selectedTab--;
                if($scope.selectedTab < 0) {
                    $scope.selectedTab = $scope.tweets.length - 1;
                }
            };

            $scope.nextTweet = function() {
                $scope.selectedTab++;
                if($scope.selectedTab === $scope.tweets.length) {
                    $scope.selectedTab = 0;
                }
            };
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('app.examples.dashboards')
        .directive('todoWidget', todoWidget);

    /* @ngInject */
    function todoWidget() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            require: 'triWidget',
            link: link,
            restrict: 'A'
        };
        return directive;

        function link($scope) {
            $scope.todos = [{
                name: 'Buy Milk',
                done: false
            },{
                name: 'Fix Server',
                done: true
            },{
                name: 'Walk the dog',
                done: false
            },{
                name: 'Upload files',
                done: false
            }];
        }
    }
})();
(function() {
    'use strict';

    serverWidget.$inject = ["$timeout", "$interval"];
    angular
        .module('app.examples.dashboards')
        .directive('serverWidget', serverWidget);

    /* @ngInject */
    function serverWidget($timeout, $interval) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            require: 'triWidget',
            link: link,
            restrict: 'A'
        };
        return directive;

        function link($scope) {
            $scope.serverCharts = {
                bandwidth: {
                    dataLength: 50,
                    maximum: 40,
                    data: [[]],
                    labels: [],
                    options: {
                        animation: false,
                        showTooltips: false,
                        pointDot: false,
                        datasetStrokeWidth: 0.5,
                        maintainAspectRatio: false
                    },
                    colours: ['#4285F4']
                },
                cpu: {
                    dataLength: 50,
                    maximum: 100,
                    data: [[]],
                    labels: [],
                    options: {
                        animation: false,
                        showTooltips: false,
                        pointDot: false,
                        datasetStrokeWidth: 0.5,
                        maintainAspectRatio: false
                    },
                    colours: ['#DB4437']
                },
                data24hrs: {
                    series: ['Bandwidth', 'CPU'],
                    labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
                },
                data7days: {
                    series: ['Bandwidth', 'CPU'],
                    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
                },
                data365days: {
                    series: ['Bandwidth', 'CPU'],
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                }
            };

            randomData($scope.serverCharts.data24hrs);
            randomData($scope.serverCharts.data7days);
            randomData($scope.serverCharts.data365days);


            // Update the dataset at 25FPS for a smoothly-animating chart
            $interval(function () {
                getLiveChartData($scope.serverCharts.bandwidth);
                getLiveChartData($scope.serverCharts.cpu);
            }, 1000);

            function getLiveChartData (chart) {
                if (chart.data[0].length) {
                    chart.labels = chart.labels.slice(1);
                    chart.data[0] = chart.data[0].slice(1);
                }

                while (chart.data[0].length < chart.dataLength) {
                    chart.labels.push('');
                    chart.data[0].push(getRandomValue(chart.data[0], chart.maximum));
                }
            }

            function randomData(chart) {
                chart.data = [];
                for(var series = 0; series < chart.series.length; series++) {
                    var row = [];
                    for(var label = 0; label < chart.labels.length; label++) {
                        row.push(Math.floor((Math.random() * 100) + 1));
                    }
                    chart.data.push(row);
                }
            }

            function getRandomValue (data, max) {
                var l = data.length, previous = l ? data[l - 1] : 50;
                var y = previous + Math.random() * 10 - 5;
                return y < 0 ? 0 : y > max ? max : y;
            }
        }
    }
})();
(function() {
    'use strict';

    loadDataWidget.$inject = ["$parse", "$http", "$mdDialog"];
    angular
        .module('app.examples.dashboards')
        .directive('loadDataWidget', loadDataWidget);

    /* @ngInject */
    function loadDataWidget($parse, $http, $mdDialog) {
        // Usage:
        //
        // <tri-widget load-data-widget="{ variableName: urlOfJSONData }"></tri-widget>
        // Creates:
        //
        var directive = {
            require: 'triWidget',
            link: link,
            restrict: 'A'
        };
        return directive;

        function link($scope, $element, attrs, widgetCtrl) {
            LoadDataDialogController.$inject = ["$scope", "$mdDialog", "data"];
            widgetCtrl.setLoading(true);
            var loadData = $parse(attrs.loadDataWidget)($scope);

            widgetCtrl.setMenu({
                icon: 'zmdi zmdi-more-vert',
                items: [{
                    icon: 'zmdi zmdi-search',
                    title: 'Details',
                    click: function($event) {
                        var data = [];
                        angular.forEach(loadData, function(url, variable) {
                            data = $scope[variable];
                        });
                        $mdDialog.show({
                            controller: LoadDataDialogController,
                            templateUrl: 'app/examples/dashboards/widgets/widget-load-data-dialog.tmpl.html',
                            targetEvent: $event,
                            locals: {
                                data: data
                            },
                            clickOutsideToClose: true
                        })
                        .then(function(answer) {
                            $scope.alert = 'You said the information was "' + answer + '".';
                        }, cancelDialog);
                    }
                },{
                    icon: 'zmdi zmdi-share',
                    title: 'Share'
                },{
                    icon: 'zmdi zmdi-print',
                    title: 'Print'
                }]
            });

            function cancelDialog() {
                $scope.alert = 'You cancelled the dialog.';
            }

            ///////////////////

            /* @ngInject */
            function LoadDataDialogController($scope, $mdDialog, data) {
                $scope.data = data;

                $scope.closeDialog = function() {
                    $mdDialog.cancel();
                };
            }

            angular.forEach(loadData, function(url, variable) {
                $http.get(url).
                then(function(response) {
                    var header = response.data.shift();
                    widgetCtrl.setLoading(false);
                    $scope[variable] = {
                        header: header,
                        data: response.data
                    };
                });
            });
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('app.examples.dashboards')
        .directive('googleGeochartWidget', googleGeochartWidget);

    /* @ngInject */
    function googleGeochartWidget() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            require: 'triWidget',
            link: link,
            restrict: 'A'
        };
        return directive;

        function link($scope) {
            $scope.geoChartData = {
                type: 'GeoChart',
                data: [
                    ['Country', 'Popularity'],
                    ['Germany', 200],
                    ['United States', 300],
                    ['Brazil', 400],
                    ['Canada', 500],
                    ['France', 600],
                    ['RU', 700]
                ]
            };
        }
    }

})();
(function() {
    'use strict';

    angular
        .module('app.examples.dashboards')
        .directive('contactsWidget', contactsWidget);

    /* @ngInject */
    function contactsWidget() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            requrie: 'triWidget',
            link: link,
            restrict: 'A'
        };
        return directive;

        function link($scope) {
            $scope.contacts = [{
                name: 'Morris Onions',
                image: 'assets/images/avatars/avatar-2.png'
            },{
                name: 'Newton Welch',
                image: 'assets/images/avatars/avatar-5.png'
            },{
                name: 'Kelly Koelpin',
                image: 'assets/images/avatars/avatar-1.png'
            },{
                name: 'Rowland Emard',
                image: 'assets/images/avatars/avatar-2.png'
            },{
                name: 'Kailee Johnston',
                image: 'assets/images/avatars/avatar-3.png'
            },{
                name: 'Roberto Grimes',
                image: 'assets/images/avatars/avatar-4.png'
            }];
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('app.examples.dashboards')
        .directive('chatWidget', chatWidget);

    /* @ngInject */
    function chatWidget() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            require: 'triWidget',
            link: link,
            restrict: 'A'
        };
        return directive;

        function link($scope) {
            $scope.conversation = [{
                name: 'Morris Onions',
                image: 'assets/images/avatars/avatar-6.png',
                messages: ['Hi there how are you?', 'Hello?']
            },{
                name: 'Danny Ings',
                image: 'assets/images/avatars/avatar-3.png',
                messages: ['Howsitgowin?']
            },{
                name: 'Morris Onions',
                image: 'assets/images/avatars/avatar-6.png',
                messages: ['We need those images ASAP!', 'Client asked about them.']
            },{
                name: 'Danny Ings',
                image: 'assets/images/avatars/avatar-3.png',
                messages: ['OK, will send them over']
            }];

            $scope.userClass = function($even) {
                return $even ? 'user-left' : 'user-right';
            };
        }
    }
})();

(function() {
    'use strict';

    chartjsTickerWidget.$inject = ["$timeout", "$interval"];
    angular
        .module('app.examples.dashboards')
        .directive('chartjsTickerWidget', chartjsTickerWidget);

    /* @ngInject */
    function chartjsTickerWidget($timeout, $interval) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            require: 'triWidget',
            link: link,
            restrict: 'A'
        };
        return directive;

        function link($scope) {
            var maximum = 100;
            $scope.tickerChart = {
                data: [[]],
                labels: [],
                options: {
                    animation: false,
                    showScale: false,
                    showTooltips: false,
                    pointDot: false,
                    datasetStrokeWidth: 0.5,
                    maintainAspectRatio: false
                }
            };

            // Update the dataset at 25FPS for a smoothly-animating chart
            $interval(function () {
                getLiveChartData();
            }, 1000);

            function getLiveChartData () {
                if ($scope.tickerChart.data[0].length) {
                    $scope.tickerChart.labels = $scope.tickerChart.labels.slice(1);
                    $scope.tickerChart.data[0] = $scope.tickerChart.data[0].slice(1);
                }

                while ($scope.tickerChart.data[0].length < maximum) {
                    $scope.tickerChart.labels.push('');
                    $scope.tickerChart.data[0].push(getRandomValue($scope.tickerChart.data[0]));
                }
            }

            function getRandomValue (data) {
                var l = data.length, previous = l ? data[l - 1] : 50;
                var y = previous + Math.random() * 10 - 5;
                return y < 0 ? 0 : y > 100 ? 100 : y;
            }
        }
    }
})();

(function() {
    'use strict';

    chartjsPieWidget.$inject = ["$timeout"];
    angular
        .module('app.examples.dashboards')
        .directive('chartjsPieWidget', chartjsPieWidget);

    /* @ngInject */
    function chartjsPieWidget($timeout) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            require: 'triWidget',
            link: link,
            restrict: 'A'
        };
        return directive;

        function link($scope, $element, attrs, widgetCtrl) {
            widgetCtrl.setLoading(true);

            $timeout(function() {
                widgetCtrl.setLoading(false);
            }, 2500);

            widgetCtrl.setMenu({
                icon: 'zmdi zmdi-more-vert',
                items: [{
                    icon: 'zmdi zmdi-refresh',
                    title: 'Refresh',
                    click: function() {
                        widgetCtrl.setLoading(true);
                        $timeout(function() {
                            widgetCtrl.setLoading(false);
                        }, 1500);
                    }
                },{
                    icon: 'zmdi zmdi-share',
                    title: 'Share'
                },{
                    icon: 'zmdi zmdi-print',
                    title: 'Print'
                }]
            });

            $scope.pieChart = {
                labels: ['Facebook', 'Twitter', 'Google+', 'Others'],
                data: [300, 500, 100, 50]
            };
        }
    }
})();
(function() {
    'use strict';

    chartjsLineWidget.$inject = ["$timeout", "$interval"];
    angular
        .module('app.examples.dashboards')
        .directive('chartjsLineWidget', chartjsLineWidget);

    /* @ngInject */
    function chartjsLineWidget($timeout, $interval) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            require: 'triWidget',
            link: link,
            restrict: 'A'
        };
        return directive;

        function link($scope, $element, attrs, widgetCtrl) {
            widgetCtrl.setLoading(true);

            $timeout(function() {
                widgetCtrl.setLoading(false);
                randomData();
            }, 1500);

            widgetCtrl.setMenu({
                icon: 'zmdi zmdi-more-vert',
                items: [{
                    icon: 'zmdi zmdi-refresh',
                    title: 'Refresh',
                    click: function() {
                        $interval.cancel($scope.intervalPromise);
                        widgetCtrl.setLoading(true);
                        $timeout(function() {
                            widgetCtrl.setLoading(false);
                            randomData();
                        }, 1500);
                    }
                },{
                    icon: 'zmdi zmdi-share',
                    title: 'Share'
                },{
                    icon: 'zmdi zmdi-print',
                    title: 'Print'
                }]
            });

            $scope.lineChart = {
                labels: ['January', 'February', 'March', 'April', 'May'],
                series: ['Pageviews', 'Visits', 'Sign ups'],
                options: {
                    datasetFill: false,
                    responsive: true
                },
                data: []
            };

            function randomData() {
                $scope.lineChart.data = [];
                for(var series = 0; series < $scope.lineChart.series.length; series++) {
                    var row = [];
                    for(var label = 0; label < $scope.lineChart.labels.length; label++) {
                        row.push(Math.floor((Math.random() * 100) + 1));
                    }
                    $scope.lineChart.data.push(row);
                }
            }

            // Simulate async data update
            // $scope.intervalPromise = $interval(randomData, 5000);
        }
    }
})();
(function() {
    'use strict';

    chartjsBarWidget.$inject = ["$timeout"];
    angular
        .module('app.examples.dashboards')
        .directive('chartjsBarWidget', chartjsBarWidget);

    /* @ngInject */
    function chartjsBarWidget($timeout) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            require: 'triWidget',
            link: link,
            restrict: 'A'
        };
        return directive;

        function link($scope, $element, attrs, widgetCtrl) {
            widgetCtrl.setLoading(true);

            $timeout(function() {
                widgetCtrl.setLoading(false);
            }, 2500);

            widgetCtrl.setMenu({
                icon: 'zmdi zmdi-more-vert',
                items: [{
                    icon: 'zmdi zmdi-refresh',
                    title: 'Refresh',
                    click: function() {
                        widgetCtrl.setLoading(true);
                        $timeout(function() {
                            widgetCtrl.setLoading(false);
                        }, 1500);
                    }
                },{
                    icon: 'zmdi zmdi-share',
                    title: 'Share'
                },{
                    icon: 'zmdi zmdi-print',
                    title: 'Print'
                }]
            });

            $scope.labels = ['Facebook', 'Twitter', 'Google+', 'Others'];
            $scope.series = ['This Week', 'Last week'];

            $scope.data = [
                [65, 59, 80, 81],
                [28, 48, 40, 19]
            ];
        }
    }
})();
(function() {
    'use strict';

    Controller.$inject = ["$scope", "uiCalendarConfig", "$rootScope"];
    angular
        .module('app.examples.dashboards')
        .directive('calendarWidget', calendarWidget);

    /* @ngInject */
    function calendarWidget() {
        // Usage:
        //
        // <tri-widget calendar-widget></tri-widget>
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: Controller,
            controllerAs: 'calendarController',
            restrict: 'A'
        };
        return directive;
    }

    /* @ngInject */
    function Controller ($scope, uiCalendarConfig, $rootScope) {
        var vm = this;
        vm.calendarEvents = [];
        vm.calendarOptions = {
            lang: 'en',
            header: false,
            height: 'auto',
            viewRender: function(view) {
                vm.currentDay = view.calendar.getDate();
            }
        };
        vm.changeMonth = changeMonth;

        var destroyOn = $rootScope.$on('$translateChangeSuccess', switchLanguage);
        $scope.$on('$destroy', destroyListener);

        function changeMonth(direction) {
            uiCalendarConfig.calendars.calendarWidget.fullCalendar(direction);
        }

        function switchLanguage() {
            // vm.calendarOptions.lang = $translate.use();
        }

        function destroyListener() {
            destroyOn();
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('app.examples.dashboards')
        .controller('DashboardSocialController', DashboardSocialController);

    /* @ngInject */
    function DashboardSocialController() {
        var vm = this;
        vm.whotofollow = [{
            name: 'Twitch',
            user: 'twitch',
            avatar: 'assets/images/avatars/avatar-1.png'
        },{
            name: 'MaterialUp',
            user: 'materialUP',
            avatar: 'assets/images/avatars/avatar-3.png'
        },{
            name: 'Bower',
            user: 'bower',
            avatar: 'assets/images/avatars/avatar-2.png'
        }];

        vm.trends = [
            '#DescribeTwitterIn3Words',
            '#OhNoHarry',
            '#mnimonio3',
            '#WeForgiveYouAriana',
            '#FifthHarmonyTODAY',
            'Omar Sharif',
            'Go Set a Watchman',
            'Ηρωδειο',
            'Ryanair',
            'Η ΕΡΤ'
        ];

        vm.favorites = [{
            name: 'Twitch',
            avatar: 'assets/images/avatars/avatar-1.png',
            user: 'twitch',
            date: moment().subtract(1, 'hour'),
            tweet: 'We had an absolute blast bringing @E3 to you this year. Check out our video recap.'
        },{
            name: 'PixelBucket',
            avatar: 'assets/images/avatars/avatar-2.png',
            user: 'twitch',
            date: moment().subtract(1, 'days'),
            tweet: 'Turn a Pencil Sketch Into a Colorful and Dynamic Character Illustration http://bit.ly/1HoJhbN  @TutsPlusDesign'
        },{
            name: 'Webdesigntuts',
            avatar: 'assets/images/avatars/avatar-3.png',
            user: 'wdtuts',
            date: moment().subtract(2, 'days'),
            tweet: '100 people have entered our challenge to win @CodePen & @envatomarket goodies! 2 days left :) http://ow.ly/PqjP9'
        },{
            name: 'BestCSS',
            avatar: 'assets/images/avatars/avatar-4.png',
            user: 'bestcss',
            date: moment().subtract(3, 'days'),
            tweet: '#Site of the Day'
        },{
            name: 'MaterialUP',
            avatar: 'assets/images/avatars/avatar-5.png',
            user: 'materialup',
            date: moment().subtract(4, 'days'),
            tweet: 'OnePlus One Mockup PSD - Mockup by @zerpixelung'
        },{
            name: 'Webdesigner Depot',
            avatar: 'assets/images/avatars/avatar-6.png',
            user: 'DesignerDepot',
            date: moment().subtract(7, 'days'),
            tweet: 'Semantic UI 2.0: Design beautiful websites quicker http://depot.ly/Pq6oC'
        }];
    }
})();
(function() {
    'use strict';

    DashboardServerController.$inject = ["$scope", "$timeout", "$mdToast"];
    angular
        .module('app.examples.dashboards')
        .controller('DashboardServerController', DashboardServerController);

    /* @ngInject */
    function DashboardServerController($scope, $timeout, $mdToast) {
        var vm = this;
        vm.disks = [{
            icon: 'zmdi zmdi-storage',
            name: 'Ubuntu 10.04 LTS Disk Image',
            enabled: true
        },{
            icon: 'zmdi zmdi-input-composite',
            name: 'Ubuntu 11.10 SSD Image',
            enabled: false
        },{
            icon: 'zmdi zmdi-storage',
            name: '256MB Swap Image',
            enabled: true
        }];

        vm.jobs = [{
            job: 'Host initiated restart',
            time: 'Took: 10 seconds',
            complete: true
        },{
            job: 'Snapshot ',
            time: 'Took: 6minutes 26 seconds',
            complete: false
        }];

        vm.serverChart = {
            labels: ['Swap space', 'Kernel', 'OS', 'Free space'],
            data: [15, 5, 35, 45]
        };

        $timeout(function() {
            $mdToast.show(
                $mdToast.simple()
                .content('Server CPU at 100%!')
                .position('bottom right')
                .hideDelay(3000)
            );
        }, 5000);
    }
})();

(function() {
    'use strict';

    angular
        .module('app.examples.dashboards')
        .factory('SalesService', SalesService);

    /* @ngInject */
    function SalesService() {
        return {
            generateSales: generateSales,
            createLineChartData: createLineChartData,
            createPieChartData: createPieChartData,
            createBarChartData: createBarChartData
        };

        ////////////////

        function generateSales(dateRange) {
            var salesData = {
                totalSales: 0,
                totalEarnings: 0,
                dayTotals: [],
                orders: []
            };

            var startTime = dateRange.start.toDate();
            var endTime = dateRange.end.toDate();

            for(var date = startTime.getTime(); date < endTime.getTime(); date += 86400000) {
                var salesForTheDay = Math.floor(Math.random() * (100 - 0)) + 0;
                var ordersData = generateOrders(salesForTheDay, date);

                salesData.orders = salesData.orders.concat(ordersData.orders);

                salesData.dayTotals.push({
                    date: moment(date),
                    sales: salesForTheDay,
                    earnings: ordersData.totalEarnings
                });
                salesData.totalSales += salesForTheDay;
                salesData.totalEarnings += ordersData.totalEarnings;
            }

            return salesData;
        }

        function generateOrders(numOrders, date) {
            var ordersData = {
                orders: [],
                totalEarnings: 0
            };
            for(var o = 0; o < numOrders; o++) {
                var order = generateOrder(date);
                ordersData.totalEarnings += order.total;
                ordersData.orders.push(order);
            }

            return ordersData;
        }

        function generateOrder(date) {
            var statuses = ['complete', 'pending', 'delivered'];
            var names = ['Loraine Heidenreich', 'Amie Hane', 'Rosalyn Heller V', 'Dr. Kristian Boyle II', 'Clarabelle Weber', 'Rowland Emard', 'Kitty Heller DVM', 'Winston Frami', 'Newton Welch', 'Trudie Feest', 'Vivien Sauer', 'Cleta Kuhn', 'Ruby Shields', 'Dr. Moises Beahan DDS', 'Miss Shanel Jenkins DVM', 'Kitty Heller DVM', 'Vivien Sauer', 'Clara Cremin', 'Eunice Morissette', 'Arch Sporer IV', 'Miss Shanel Jenkins DVM', 'Ryann Balistreri I', 'Norma Yost DDS', 'Manley Roberts', 'Ruby Shields', 'Miss Lavada Runolfsson', 'Kira Dooley', 'Meredith Ebert DDS'];
            var emails = ['johnson.althea@gleichner.net','will.rhea@weber.biz','roslyn75@keebler.com','okon.glenda@hamill.com','estroman@cruickshank.org','victoria41@hartmann.com','bogisich.janice@wilkinson.com','bryce97@kris.com','noe59@king.com','wiza.litzy@kozey.com','oconner.cortney@gmail.com','kub.fannie@hotmail.com','adrian00@gutkowski.com','justice69@yahoo.com','torphy.toney@yahoo.com','bogisich.janice@wilkinson.com','oconner.cortney@gmail.com','orval63@gmail.com','jaime94@gmail.com','olaf69@okeefe.com','torphy.toney@yahoo.com','bernhard.bruen@marvin.com','otilia61@hotmail.com','bogan.lelia@bins.info','adrian00@gutkowski.com','yazmin76@hotmail.com','kglover@hotmail.com','erick.hermann@larkin.net','bernhard.bruen@marvin.com','bradly90@corkery.info','orval63@gmail.com','olaf69@okeefe.com'];
            var order = {
                id: makeid(),
                buyer: emails[Math.floor(Math.random() * emails.length)],
                name: names[Math.floor(Math.random() * names.length)],
                date: moment(date + Math.floor(Math.random() * (86400000 - 0)) + 0),
                items: [],
                subTotal: 0,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                tax: 0,
                total: 0
            };

            var numItems = Math.floor(Math.random() * (6 - 1)) + 1;
            var productAdjectives = ['Super', 'Amazing', 'Great', 'New'];
            var productTypes = ['T-Shirt', 'Book', 'Desk', 'Coat', 'Chair', 'Hat', 'Jeans'];
            var productColors = ['Red', 'Green', 'Blue', 'Pink', 'Yellow', 'Orange'];
            var productCategories = ['Books', 'Electronics', 'Home', 'Toys', 'Clothes', 'Shoes', 'Mobiles'];
            for(var i = 0; i < numItems; i++) {
                var item = {
                    name: productAdjectives[Math.floor(Math.random() * productAdjectives.length)] + ' ' + productColors[Math.floor(Math.random() * productColors.length)] + ' ' + productTypes[Math.floor(Math.random() * productTypes.length)],
                    category: productCategories[Math.floor(Math.random() * productCategories.length)],
                    price: (Math.random() * (100 - 1) + 1).toFixed(2)
                };
                order.subTotal += parseFloat(item.price);

                order.items.push(item);
            }

            order.tax = order.subTotal * 0.2;
            order.total += order.subTotal + order.tax;
            return order;
        }

        function createLineChartData(salesData) {
            var chartData = {
                labels: [],
                series: ['Sales'],
                options: {
                    maintainAspectRatio: false,
                    datasetFill: false,
                    responsive: true,
                    scaleShowGridLines: false,
                    bezierCurve: true,
                    pointDotRadius: 2,
                    scaleFontColor: '#ffffff',
                    scaleFontSize: 16
                },
                colors: ['#ffffff'],
                data: []
            };

            var row = [];
            for (var i = 0; i < salesData.dayTotals.length; i++) {
                chartData.labels.push(salesData.dayTotals[i].date.format('M/D/YY'));
                row.push(salesData.dayTotals[i].sales);
            }
            chartData.data.push(row);

            return chartData;
        }

        function createPieChartData(salesData) {
            var chartData = {
                labels: [],
                data: []
            };

            for (var i = 0; i < salesData.orders.length; i++) {
                if(chartData.labels.indexOf(salesData.orders[i].status) === -1) {
                    chartData.labels.push(salesData.orders[i].status);
                    chartData.data.push(0);
                }
                var index = chartData.labels.indexOf(salesData.orders[i].status);
                chartData.data[index]++;
            }
            return chartData;
        }

        function createBarChartData(salesData) {
            var chartData = {
                labels: [],
                series: ['Sales'],
                data: [],
                options: {
                    barShowStroke : false
                }
            };

            var row = [];
            for (var order = 0; order < salesData.orders.length; order++) {
                for (var item = 0; item < salesData.orders[order].items.length; item++) {
                    if(chartData.labels.indexOf(salesData.orders[order].items[item].category) === -1) {
                        chartData.labels.push(salesData.orders[order].items[item].category);
                        row.push(0);
                    }
                    var index = chartData.labels.indexOf(salesData.orders[order].items[item].category);
                    row[index]++;
                }
            }
            chartData.data.push(row);
            return chartData;
        }

        function makeid() {
            var text = '';
            var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

            for( var i=0; i < 5; i++ ) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            return text;
        }
    }
})();

(function() {
    'use strict';

    SalesOrderDialogController.$inject = ["$window", "$mdDialog", "order"];
    angular
        .module('app.examples.dashboards')
        .controller('SalesOrderDialogController', SalesOrderDialogController);

    /* @ngInject */
    function SalesOrderDialogController($window, $mdDialog, order) {
        var vm = this;
        vm.cancelClick = cancelClick;
        vm.okClick = okClick;
        vm.order = order;
        vm.printClick = printClick;


        ////////////////

        function okClick() {
            $mdDialog.hide();
        }

        function cancelClick() {
            $mdDialog.cancel();
        }

        function printClick() {
            $window.print();
        }

    }
})();
(function() {
    'use strict';

    SalesFabController.$inject = ["$rootScope"];
    angular
        .module('app.examples.dashboards')
        .controller('SalesFabController', SalesFabController  );

    /* @ngInject */
    function SalesFabController($rootScope) {
        var vm = this;
        vm.changeDate = changeDate;

        ////////////////

        function changeDate($event) {
            $rootScope.$broadcast('salesChangeDate', $event);
        }
    }
})();
(function() {
    'use strict';

    DateChangeDialogController.$inject = ["$mdDialog", "range"];
    angular
        .module('app.examples.dashboards')
        .controller('DateChangeDialogController', DateChangeDialogController);

    /* @ngInject */
    function DateChangeDialogController($mdDialog, range) {
        var vm = this;
        vm.cancelClick = cancelClick;
        vm.okClick = okClick;

        ////////////////

        function okClick() {
            range.start = new moment(vm.start);
            range.end = new moment(vm.end);
            $mdDialog.hide();
        }

        function cancelClick() {
            $mdDialog.cancel();
        }

        // init

        vm.start = range.start.toDate();
        vm.end = range.end.toDate();
    }
})();
(function() {
    'use strict';

    DashboardSalesController.$inject = ["$scope", "$q", "$timeout", "$mdToast", "$filter", "$mdDialog", "SalesService"];
    angular
        .module('app.examples.dashboards')
        .controller('DashboardSalesController', DashboardSalesController);

    /* @ngInject */
    function DashboardSalesController($scope, $q, $timeout, $mdToast, $filter, $mdDialog, SalesService) {
        var vm = this;
        vm.dateRange = {
            start: moment().startOf('week'),
            end: moment().endOf('week')
        };

        vm.query = {
            order: 'date',
            limit: 5,
            page: 1
        };

        vm.openOrder = openOrder;

        /////////////////////////////////

        function openOrder(order, $event) {
            $mdDialog.show({
                controller: 'SalesOrderDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/examples/dashboards/sales/order-dialog.tmpl.html',
                locals: {
                    order: order
                },
                targetEvent: $event
            });
        }

        function createData() {
            vm.salesData = SalesService.generateSales(vm.dateRange);
            vm.chartLineData = SalesService.createLineChartData(vm.salesData);
            vm.chartPieData = SalesService.createPieChartData(vm.salesData);
            vm.chartBarData = SalesService.createBarChartData(vm.salesData);
        }

        // events

        $scope.$on('salesChangeDate', function(event, $event) {
            $mdDialog.show({
                controller: 'DateChangeDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/examples/dashboards/sales/date-change-dialog.tmpl.html',
                locals: {
                    range: vm.dateRange
                },
                targetEvent: $event
            })
            .then(function() {
                // create new data
                createData();

                // pop a toast
                $mdToast.show(
                    $mdToast.simple()
                    .content($filter('triTranslate')('Date Range Updated'))
                    .position('bottom right')
                    .hideDelay(2000)
                );
            });
        });

        // init

        createData();
    }
})();

(function() {
    'use strict';

    DashboardAnalyticsController.$inject = ["$scope", "$timeout", "$mdToast", "$rootScope", "$state"];
    angular
        .module('app.examples.dashboards')
        .controller('DashboardClassicController', DashboardAnalyticsController);

    /* @ngInject */
    function DashboardAnalyticsController($scope, $timeout, $mdToast, $rootScope, $state) {
        var vm = this;

        vm.data = {
            social: {
                comments: 54,
                tweets: 101,
                likes: 943,
                pageviews: 911
            }
        };

        vm.init = init;

        /////////////////////

        function init() {

            $timeout(function() {
                $rootScope.$broadcast('newMailNotification');

                var toast = $mdToast.simple()
                    .textContent('You have new email messages!')
                    .action('View')
                    .highlightAction(true)
                    .position('bottom right');
                $mdToast.show(toast).then(function(response) {
                    if (response == 'ok') {
                        $state.go('triangular.email.inbox');
                    }
                });
            }, 5000);
        }

        // init

        init();
    }
})();

(function() {
    'use strict';

    angular
        .module('app.examples.dashboards')
        .filter('secondsToDate', secondsToDate);

    function secondsToDate() {
        return secondsToDateFilter;

        function secondsToDateFilter(seconds) {
            var d = new Date(0, 0, 0, 0, 0, 0, 0);
            d.setSeconds(seconds);
            return d;
        }
    }
})();

(function() {
    'use strict';

    DashboardAnalyticsFabButtonController.$inject = ["$rootScope"];
    angular
        .module('app.examples.dashboards')
        .controller('DashboardAnalyticsFabButtonController', DashboardAnalyticsFabButtonController);

    /* @ngInject */
    function DashboardAnalyticsFabButtonController($rootScope) {
        var vm = this;

        vm.changeDate = changeDate;

        ////////////////

        function changeDate($event) {
            // send event to open the change data dialog
            $rootScope.$broadcast('analyticsChangeDate', $event);
        }
    }

})();

(function() {
    'use strict';

    DateChangeDialogController.$inject = ["$mdDialog", "start", "end"];
    angular
        .module('app.examples.dashboards')
        .controller('DashboardAnalyticsDateChangeDialogController', DateChangeDialogController);

    /* @ngInject */
    function DateChangeDialogController($mdDialog, start, end) {
        var vm = this;
        vm.cancelClick = cancelClick;
        vm.okClick = okClick;

        ////////////////

        function okClick() {
            start = new moment(vm.start);
            end = new moment(vm.end);
            $mdDialog.hide({
                start: start,
                end: end
            });
        }

        function cancelClick() {
            $mdDialog.cancel();
        }

        // init

        vm.start = start.toDate();
        vm.end = end.toDate();
    }
})();

(function() {
    'use strict';

    angular
        .module('app.examples.dashboards')
        .factory('AnalyticsService', AnalyticsService);

    /* @ngInject */
    function AnalyticsService() {
        var service = {
            getData: getData
        };

        return service;

        function getData(start, end, span) {
            var startTime = angular.copy(start);
            var endTime = angular.copy(end);

            var data = {
                sessionsLineChartData: [{
                    key: 'Sessions',
                    values: [],
                    area: true
                }],
                visitorPieChartData: [{
                    name: 'New Visitor',
                    value: 0
                },{
                    name: 'Returning Visitor',
                    value: 0
                }],
                usersLineChartData: [{
                    key: 'Users',
                    values: [],
                    area: true
                }],
                pageviewsLineChartData: [{
                    key: 'Users',
                    values: [],
                    area: true
                }],
                pagesSessionsLineChartData: [{
                    key: 'Pages / Session',
                    values: [],
                    area: true
                }],
                avgSessionLineChartData: [{
                    key: 'Avg. Session Duration',
                    values: [],
                    area: true
                }],
                bounceLineChartData: [{
                    key: 'Bounce Rate',
                    values: [],
                    area: true
                }],
                social: {
                    comments: Math.floor((Math.random() * (100)) + 1),
                    tweets: Math.floor((Math.random() * (200)) + 1),
                    likes: Math.floor((Math.random() * (200)) + 1),
                    pageviews: Math.floor((Math.random() * (400)) + 1)
                },
                totals: {
                    sessions: 0,
                    users: 0,
                    pageviews: 0,
                    pagesessions: 0.0,
                    avgsessions: 0,
                    bounces: 0
                }
            };

            // fake pie chart
            data.visitorPieChartData[0].value = Math.random();
            data.visitorPieChartData[1].value = 1 - data.visitorPieChartData[0].value;

            // loop through time to create fake data
            for (var m = startTime; m.diff(endTime, span) <= 0; m.add(1, span)) {
                // fake sessions
                var sessions = Math.floor((Math.random() * (70000 - 50000)) + 50000);
                data.sessionsLineChartData[0].values.push([m.clone().toDate(), sessions]);
                data.totals.sessions += sessions;

                // fake users
                var users = Math.floor((Math.random() * (70000 - 50000)) + 50000);
                data.usersLineChartData[0].values.push([m.clone().toDate(), users]);
                data.totals.users += users;

                // fake pageviews
                var pageviews = Math.floor((Math.random() * (70000 - 50000)) + 50000);
                data.pageviewsLineChartData[0].values.push([m.clone().toDate(), pageviews]);
                data.totals.pageviews += pageviews;

                // fake pages / sessions
                var pagesessions = Math.random() * 4 + 1;
                data.pagesSessionsLineChartData[0].values.push([m.clone().toDate(), pagesessions.toFixed(2)]);
                data.totals.pagesessions += pagesessions;

                // fake avg session in sec
                var avgsession = Math.floor(Math.random() * 240 + 1);
                data.avgSessionLineChartData[0].values.push([m.clone().toDate(), avgsession]);
                data.totals.avgsessions += avgsession;

                // fake bounce rate
                var bounce = Math.random() * 100 + 1;
                data.bounceLineChartData[0].values.push([m.clone().toDate(), bounce]);
                data.totals.bounces += bounce;
            }

            // calculate average for pagesessions
            data.totals.pagesessions = data.totals.pagesessions / data.pagesSessionsLineChartData[0].values.length;
            data.totals.pagesessions = data.totals.pagesessions.toFixed(2);

            // calculate average for avgsessions
            data.totals.avgsessions = Math.floor(data.totals.avgsessions / data.avgSessionLineChartData[0].values.length);

            // calculate average for bounces
            data.totals.bounces = data.totals.bounces / data.bounceLineChartData[0].values.length;


            // Create fake language data
            data.languages = [{
                language: 'en-us',
                percent: 52.86
            },{
                language: 'fr',
                percent: 4.58
            },{
                language: 'en-gb',
                percent: 4.37
            },{
                language: 'es',
                percent: 4.21
            },{
                language: 'pt-br',
                percent: 4.18
            },{
                language: 'de',
                percent: 2.99
            },{
                language: 're',
                percent: 2.93
            },{
                language: 'tr',
                percent: 2.18
            },{
                language: 'it',
                percent: 1.86
            },{
                language: 'nl',
                percent: 1.54
            }];

            for (var lang = 0; lang < data.languages.length; lang++) {
                data.languages[lang].sessions = Math.floor(data.totals.sessions * data.languages[lang].percent);
            }

            // create fake country data
            data.countries = [{
                country: 'United States',
                percent: 14.75
            },{
                country: 'India',
                percent: 11.00
            },{
                country: 'Brazil',
                percent: 4.99
            },{
                country: 'United Kingdom',
                percent: 4.42
            },{
                country: 'France',
                percent: 3.87
            },{
                country: 'Germany',
                percent: 3.82
            },{
                country: 'Spain',
                percent: 3.31
            },{
                country: 'Turkey',
                percent: 3.27
            },{
                country: 'Italy',
                percent: 3.14
            },{
                country: 'Canada',
                percent: 2.62
            }];

            for (var c = 0; c < data.countries.length; c++) {
                data.countries[c].sessions = Math.floor(data.totals.sessions * data.countries[c].percent);
            }

            return data;
        }
    }
})();

/* global d3 */
(function() {
    'use strict';

    DashboardAnalyticsController.$inject = ["$scope", "$timeout", "$mdToast", "$filter", "$mdDialog", "AnalyticsService"];
    angular
        .module('app.examples.dashboards')
        .controller('DashboardAnalyticsController', DashboardAnalyticsController);

    /* @ngInject */
    function DashboardAnalyticsController($scope, $timeout, $mdToast, $filter, $mdDialog, AnalyticsService) {
        var vm = this;
        vm.timeSpans = [{
            name: 'Hourly',
            value: 'hours'
        },{
            name: 'Daily',
            value: 'days'
        },{
            name: 'Weekly',
            value: 'weeks'
        },{
            name: 'Monthly',
            value: 'months'
        }];
        vm.timeSpanChanged = timeSpanChanged;
        /////////////////////

        function init() {
            vm.start = moment().subtract(30, 'days');
            vm.end = moment();
            vm.activeTimeSpan = vm.timeSpans[1];

            // create some fake data
            createFakeData(vm.start, vm.end, vm.activeTimeSpan.value);

            // pop a toast telling users about datepicker
            $timeout(popAToast, 3000);
        }

        function changeDate($event) {
            $mdDialog.show({
                controller: 'DashboardAnalyticsDateChangeDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/examples/dashboards/analytics/date-change-dialog.tmpl.html',
                locals: {
                    start: vm.start,
                    end: vm.end
                },
                targetEvent: $event
            })
            .then(function(response) {

                vm.start = response.start;
                vm.end = response.end;

                // create new data
                createFakeData(vm.start, vm.end, vm.activeTimeSpan.value);

                // pop a toast
                $mdToast.show(
                    $mdToast.simple()
                    .content($filter('triTranslate')('Date Range Updated'))
                    .position('bottom right')
                    .hideDelay(2000)
                );
            });

        }

        function createFakeData(start, end, span) {
            vm.data = AnalyticsService.getData(start, end, span);

            vm.overviewLineChartOptions = {
                chart: {
                    type: 'lineChart',
                    x: function(d){
                        return d[0];
                    },
                    y: function(d){
                        return d[1];
                    },
                    color: ['#82B1FF'],
                    xAxis: {
                        tickFormat: function(d) {
                            return d3.time.format('%m/%d/%y')(new Date(d));
                        },
                        showMaxMin: false
                    },

                    yAxis: {
                        tickFormat: function(d){
                            return d3.format(',')(d);
                        },
                        domain: [0, 100000]
                    }
                }
            };

            vm.visitorPieChartOptions = {
                chart: {
                    type: 'pieChart',
                    height: 300,
                    x: function(d){
                        return d.name;
                    },
                    y: function(d){
                        return d.value;
                    },
                    showLegend: true,
                    valueFormat: function(d) {
                        return d3.format(',.1%')(d);
                    },
                    color: ['#4CAF50', '#2196F3'],
                    margin: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    }
                }
            };

            vm.statLineChartOptions = {
                chart: {
                    type: 'lineChart',
                    height: 40,
                    x: function(d){
                        return d[0];
                    },
                    y: function(d){
                        return d[1];
                    },
                    color: ['#82B1FF'],
                    showXAxis: false,
                    showYAxis: false,
                    showLegend: false,
                    xAxis: {
                        tickFormat: function(d) {
                            return d3.time.format('%m/%d/%y')(new Date(d));
                        },
                        showMaxMin: false
                    },
                    yAxis: {
                        tickFormat: function(d){
                            return d3.format(',')(d);
                        }
                    },
                    margin: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    }
                }
            };

            vm.statTimeLineChartOptions = angular.copy(vm.statLineChartOptions);
            vm.statTimeLineChartOptions.chart.yAxis.tickFormat = function(d) {
                d = $filter('secondsToDate')(d);
                d = $filter('date')(d, 'HH:mm:ss');
                return d;
            };

            vm.statPercentLineChartOptions = angular.copy(vm.statLineChartOptions);
            vm.statPercentLineChartOptions.chart.yAxis.tickFormat = function(d) {
                return d.toFixed(2) + '%';
            };
        }

        function popAToast() {
            var toast = $mdToast.simple()
                .textContent('Try changing your analytics date, click the icon above.')
                .highlightAction(true)
                .position('bottom right');
            $mdToast.show(toast);
        }

        function timeSpanChanged(span) {
            vm.activeTimeSpan = span;
            // create new data
            createFakeData(vm.start, vm.end, vm.activeTimeSpan.value);
        }

        // init

        init();

        // events

        $scope.$on('analyticsChangeDate', changeDate);
    }
})();

(function() {
    'use strict';

    angular
        .module('app.examples.charts', [

        ]);
})();
(function() {
    'use strict';

    angular
        .module('app.examples.charts')
        .controller('GoogleChartsScatterController', GoogleChartsScatterController);

    GoogleChartsScatterController.$inject = [];

    /* @ngInject */
    function GoogleChartsScatterController() {
        var vm = this;
        var scatterData = [];
        vm.chartData = {
            type: 'Scatter',
            data: {
                cols: [
                    {id: 'id', label: 'Student ID', type: 'number'},
                    {id: 'hours', label: 'Hours Studied', type: 'number'},
                    {id: 'final', label: 'Final', type: 'number'}
                ],
                rows: scatterData
            },
            options: {
                chart: {
                    title: 'Box Office Earnings in First Two Weeks of Opening',
                    subtitle: 'in millions of dollars (USD)'
                },
                width: '100%',
                height: 600
            }
        };

        ////////////////////

        // init

        // create some random data
        for(var x = 0; x < 100; x++) {
            scatterData.push({
                c: [{
                    v: x
                },{
                    v: Math.floor((Math.random() * 100) + 1)
                },{
                    v: Math.floor((Math.random() * 100) + 1)
                }]
            });
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('app.examples.charts')
        .controller('GoogleChartsLineController', GoogleChartsLineController);

    /* @ngInject */
    function GoogleChartsLineController() {
        var vm = this;
        vm.chartData = {
            type: 'Line',
            data: {
                'cols': [
                    {id: 'day', label: 'Day', type: 'number'},
                    {id: 'sales', label: 'Sales', type: 'number'},
                    {id: 'income', label: 'Income', type: 'number'}
                ],
                'rows': [
                    {
                        c: [{v: 14}, {v: 37.8}, {v: 90.8}]
                    },
                    {
                        c: [{v: 13}, {v: 30.9}, {v: 69.5}]
                    },
                    {
                        c: [{v: 12}, {v: 25.4}, {v: 57}]
                    },
                    {
                        c: [{v: 11}, {v: 11.7}, {v: 18.8}]
                    },
                    {
                        c: [{v: 10}, {v: 11.9}, {v: 17.6}]
                    },
                    {
                        c: [{v: 9}, {v: 8.8}, {v: 13.6}]
                    },
                    {
                        c: [{v: 8}, {v: 7.6}, {v: 12.3}]
                    },
                    {
                        c: [{v: 7}, {v: 12.3}, {v: 29.2}]
                    },
                    {
                        c: [{v: 6}, {v: 16.9}, {v: 42.9}]
                    },
                    {
                        c: [{v: 5}, {v:12.8}, {v: 30.9}]
                    },
                    {
                        c: [{v: 4}, {v: 5.3}, {v: 7.9}]
                    },
                    {
                        c: [{v: 3}, {v: 6.6}, {v: 8.4}]
                    },
                    {
                        c: [{v: 2}, {v: 4.8}, {v: 6.3}]
                    },
                    {
                        c: [{v: 1}, {v: 4.2}, {v: 6.2}]
                    }
                ]
            },
            options: {
                chart: {
                    title: 'Box Office Earnings in First Two Weeks of Opening',
                    subtitle: 'in millions of dollars (USD)'
                },
                width: '100%',
                height: 600
            }
        };
    }
})();

(function() {
    'use strict';

    angular
        .module('app.examples.charts')
        .controller('GoogleChartsBarController', GoogleChartsBarController);

    /* @ngInject */
    function GoogleChartsBarController() {
        var vm = this;
        vm.barChart = {
            type: 'Bar',
            data: [
                ['Year', 'Sales', 'Expenses', 'Profit'],
                ['2014', 1000, 400, 200],
                ['2015', 1170, 460, 250],
                ['2016', 660, 1120, 300],
                ['2017', 1030, 540, 350]
            ],
            options: {
                chart: {
                    title: 'Company Performance',
                    subtitle: 'Sales, Expenses, and Profit: 2014-2017'
                },
                bars: 'vertical',
                width: '100%',
                height: '600'
            }
        };
    }
})();

(function() {
    'use strict';

    angular
        .module('app.examples.charts')
        .controller('D3ScatterChartController', D3ScatterChartController);

    /* @ngInject */
    function D3ScatterChartController() {
        var vm = this;

        vm.scatterChartOptions = {
            chart: {
                type: 'scatterChart',
                height: 450,
                color: d3.scale.category10().range(),
                scatter: {
                    onlyCircles: false
                },
                showDistX: true,
                showDistY: true,
                duration: 350,
                xAxis: {
                    axisLabel: 'X Axis',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    }
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: -5
                },
                zoom: {
                    //NOTE: All attributes below are optional
                    enabled: true,
                    scaleExtent: [1, 10],
                    useFixedDomain: false,
                    useNiceScale: false,
                    horizontalOff: false,
                    verticalOff: false,
                    unzoomEventType: 'dblclick.zoom'
                }
            }
        };

        vm.scatterChartData = generateData(4,40);

        /* Random Data Generator (took from nvd3.org) */
        function generateData(groups, points) {
            var data = [],
                shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'],
                random = d3.random.normal();

            for (var i = 0; i < groups; i++) {
                data.push({
                    key: 'Server ' + i,
                    values: []
                });

                for (var j = 0; j < points; j++) {
                    data[i].values.push({
                        x: random()
                        , y: random()
                        , size: Math.random()
                        , shape: shapes[j % 6]
                    });
                }
            }
            return data;
        }

    }
})();
(function() {
    'use strict';

    angular
        .module('app.examples.charts')
        .controller('D3MultiLineChartController', D3MultiLineChartController);

    /* @ngInject */
    function D3MultiLineChartController() {
        var vm = this;

        vm.multiLineChartOptions = {
            chart: {
                type: 'multiChart',
                height: 450,
                margin : {
                    top: 30,
                    right: 60,
                    bottom: 50,
                    left: 70
                },
                color: d3.scale.category10().range(),
                //useInteractiveGuideline: true,
                duration: 500,
                xAxis: {
                    tickFormat: function(d){
                        return d3.format(',f')(d);
                    }
                },
                yAxis1: {
                    tickFormat: function(d){
                        return d3.format(',.1f')(d);
                    }
                },
                yAxis2: {
                    tickFormat: function(d){
                        return d3.format(',.1f')(d);
                    }
                }
            }
        };

        vm.multiLineChartData = generateMultiLineData();

        function generateMultiLineData(){
            var testdata = stream_layers(7,10+Math.random()*100,.1).map(function(data, i) {
                return {
                    key: 'AWS ' + i,
                    values: data.map(function(a){a.y = a.y * (i <= 1 ? -1 : 1); return a;})
                };
            });

            testdata[0].type = 'area';
            testdata[0].yAxis = 1;
            testdata[1].type = 'area';
            testdata[1].yAxis = 1;
            testdata[2].type = 'line';
            testdata[2].yAxis = 1;
            testdata[3].type = 'line';
            testdata[3].yAxis = 2;
            testdata[4].type = 'bar';
            testdata[4].yAxis = 2;
            testdata[5].type = 'bar';
            testdata[5].yAxis = 2;
            testdata[6].type = 'bar';
            testdata[6].yAxis = 2;

            return testdata;
        }

        /* Inspired by Lee Byron's test data generator. */
        function stream_layers(n, m, o) {
            if (arguments.length < 3) o = 0;
            function bump(a) {
                var x = 1 / (.1 + Math.random()),
                    y = 2 * Math.random() - .5,
                    z = 10 / (.1 + Math.random());
                for (var i = 0; i < m; i++) {
                    var w = (i / m - y) * z;
                    a[i] += x * Math.exp(-w * w);
                }
            }
            return d3.range(n).map(function() {
                var a = [], i;
                for (i = 0; i < m; i++) a[i] = o + o * Math.random();
                for (i = 0; i < 5; i++) bump(a);
                return a.map(stream_index);
            });
        }

        function stream_index(d, i) {
            return {x: i, y: Math.max(0, d)};
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('app.examples.charts')
        .controller('D3BarChartController', D3BarChartController);

    /* @ngInject */
    function D3BarChartController() {
        var vm = this;

        vm.ohclBarOptions = {
            chart: {
                type: 'ohlcBarChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 60
                },
                x: function(d){ return d['date']; },
                y: function(d){ return d['close']; },
                duration: 100,

                xAxis: {
                    axisLabel: 'Dates',
                    tickFormat: function(d) {
                        return d3.time.format('%x')(new Date(new Date() - (20000 * 86400000) + (d * 86400000)));
                    },
                    showMaxMin: false
                },

                yAxis: {
                    axisLabel: 'AWS Profit',
                    tickFormat: function(d){
                        return '$' + d3.format(',.1f')(d);
                    },
                    showMaxMin: false
                },

                zoom: {
                    enabled: false,
                    scaleExtent: [1, 10],
                    useFixedDomain: false,
                    useNiceScale: false,
                    horizontalOff: false,
                    verticalOff: true,
                    unzoomEventType: 'dblclick.zoom'
                }
            }
        };

        vm.ohclBarData= [{values: [
            {'date': 15707, 'open': 145.11, 'high': 146.15, 'low': 144.73, 'close': 146.06, 'volume': 192059000, 'adjusted': 144.65},
            {'date': 15708, 'open': 145.99, 'high': 146.37, 'low': 145.34, 'close': 145.73, 'volume': 144761800, 'adjusted': 144.32},
            {'date': 15709, 'open': 145.97, 'high': 146.61, 'low': 145.67, 'close': 146.37, 'volume': 116817700, 'adjusted': 144.95},
            {'date': 15712, 'open': 145.85, 'high': 146.11, 'low': 145.43, 'close': 145.97, 'volume': 110002500, 'adjusted': 144.56},
            {'date': 15713, 'open': 145.71, 'high': 145.91, 'low': 144.98, 'close': 145.55, 'volume': 121265100, 'adjusted': 144.14},
            {'date': 15714, 'open': 145.87, 'high': 146.32, 'low': 145.64, 'close': 145.92, 'volume': 90745600, 'adjusted': 144.51},
            {'date': 15715, 'open': 146.73, 'high': 147.09, 'low': 145.97, 'close': 147.08, 'volume': 130735400, 'adjusted': 145.66},
            {'date': 15716, 'open': 147.04, 'high': 147.15, 'low': 146.61, 'close': 147.07, 'volume': 113917300, 'adjusted': 145.65},
            {'date': 15719, 'open': 146.89, 'high': 147.07, 'low': 146.43, 'close': 146.97, 'volume': 89567200, 'adjusted': 145.55},
            {'date': 15720, 'open': 146.29, 'high': 147.21, 'low': 146.2, 'close': 147.07, 'volume': 93172600, 'adjusted': 145.65},
            {'date': 15721, 'open': 146.77, 'high': 147.28, 'low': 146.61, 'close': 147.05, 'volume': 104849500, 'adjusted': 145.63},
            {'date': 15722, 'open': 147.7, 'high': 148.42, 'low': 147.15, 'close': 148, 'volume': 133833500, 'adjusted': 146.57},
            {'date': 15723, 'open': 147.97, 'high': 148.49, 'low': 147.43, 'close': 148.33, 'volume': 169906000, 'adjusted': 146.9},
            {'date': 15727, 'open': 148.33, 'high': 149.13, 'low': 147.98, 'close': 149.13, 'volume': 111797300, 'adjusted': 147.69},
            {'date': 15728, 'open': 149.13, 'high': 149.5, 'low': 148.86, 'close': 149.37, 'volume': 104596100, 'adjusted': 147.93},
            {'date': 15729, 'open': 149.15, 'high': 150.14, 'low': 149.01, 'close': 149.41, 'volume': 146426400, 'adjusted': 147.97},
            {'date': 15730, 'open': 149.88, 'high': 150.25, 'low': 149.37, 'close': 150.25, 'volume': 147211600, 'adjusted': 148.8},
            {'date': 15733, 'open': 150.29, 'high': 150.33, 'low': 149.51, 'close': 150.07, 'volume': 113357700, 'adjusted': 148.62},
            {'date': 15734, 'open': 149.77, 'high': 150.85, 'low': 149.67, 'close': 150.66, 'volume': 105694400, 'adjusted': 149.2},
            {'date': 15735, 'open': 150.64, 'high': 150.94, 'low': 149.93, 'close': 150.07, 'volume': 137447700, 'adjusted': 148.62},
            {'date': 15736, 'open': 149.89, 'high': 150.38, 'low': 149.6, 'close': 149.7, 'volume': 108975800, 'adjusted': 148.25},
            {'date': 15737, 'open': 150.65, 'high': 151.42, 'low': 150.39, 'close': 151.24, 'volume': 131173000, 'adjusted': 149.78},
            {'date': 15740, 'open': 150.32, 'high': 151.27, 'low': 149.43, 'close': 149.54, 'volume': 159073600, 'adjusted': 148.09},
            {'date': 15741, 'open': 150.35, 'high': 151.48, 'low': 150.29, 'close': 151.05, 'volume': 113912400, 'adjusted': 149.59},
            {'date': 15742, 'open': 150.52, 'high': 151.26, 'low': 150.41, 'close': 151.16, 'volume': 138762800, 'adjusted': 149.7},
            {'date': 15743, 'open': 151.21, 'high': 151.35, 'low': 149.86, 'close': 150.96, 'volume': 162490000, 'adjusted': 149.5},
            {'date': 15744, 'open': 151.22, 'high': 151.89, 'low': 151.22, 'close': 151.8, 'volume': 103133700, 'adjusted': 150.33},
            {'date': 15747, 'open': 151.74, 'high': 151.9, 'low': 151.39, 'close': 151.77, 'volume': 73775000, 'adjusted': 150.3},
            {'date': 15748, 'open': 151.78, 'high': 152.3, 'low': 151.61, 'close': 152.02, 'volume': 65392700, 'adjusted': 150.55},
            {'date': 15749, 'open': 152.33, 'high': 152.61, 'low': 151.72, 'close': 152.15, 'volume': 82322600, 'adjusted': 150.68},
            {'date': 15750, 'open': 151.69, 'high': 152.47, 'low': 151.52, 'close': 152.29, 'volume': 80834300, 'adjusted': 150.82},
            {'date': 15751, 'open': 152.43, 'high': 152.59, 'low': 151.55, 'close': 152.11, 'volume': 215226500, 'adjusted': 150.64},
            {'date': 15755, 'open': 152.37, 'high': 153.28, 'low': 152.16, 'close': 153.25, 'volume': 95105400, 'adjusted': 151.77},
            {'date': 15756, 'open': 153.14, 'high': 153.19, 'low': 151.26, 'close': 151.34, 'volume': 160574800, 'adjusted': 149.88},
            {'date': 15757, 'open': 150.96, 'high': 151.42, 'low': 149.94, 'close': 150.42, 'volume': 183257000, 'adjusted': 148.97},
            {'date': 15758, 'open': 151.15, 'high': 151.89, 'low': 150.49, 'close': 151.89, 'volume': 106356600, 'adjusted': 150.42},
            {'date': 15761, 'open': 152.63, 'high': 152.86, 'low': 149, 'close': 149, 'volume': 245824800, 'adjusted': 147.56},
            {'date': 15762, 'open': 149.72, 'high': 150.2, 'low': 148.73, 'close': 150.02, 'volume': 186596200, 'adjusted': 148.57},
            {'date': 15763, 'open': 149.89, 'high': 152.33, 'low': 149.76, 'close': 151.91, 'volume': 150781900, 'adjusted': 150.44},
            {'date': 15764, 'open': 151.9, 'high': 152.87, 'low': 151.41, 'close': 151.61, 'volume': 126866000, 'adjusted': 150.14},
            {'date': 15765, 'open': 151.09, 'high': 152.34, 'low': 150.41, 'close': 152.11, 'volume': 170634800, 'adjusted': 150.64},
            {'date': 15768, 'open': 151.76, 'high': 152.92, 'low': 151.52, 'close': 152.92, 'volume': 99010200, 'adjusted': 151.44},
            {'date': 15769, 'open': 153.66, 'high': 154.7, 'low': 153.64, 'close': 154.29, 'volume': 121431900, 'adjusted': 152.8},
            {'date': 15770, 'open': 154.84, 'high': 154.92, 'low': 154.16, 'close': 154.5, 'volume': 94469900, 'adjusted': 153.01},
            {'date': 15771, 'open': 154.7, 'high': 154.98, 'low': 154.52, 'close': 154.78, 'volume': 86101400, 'adjusted': 153.28},
            {'date': 15772, 'open': 155.46, 'high': 155.65, 'low': 154.66, 'close': 155.44, 'volume': 123477800, 'adjusted': 153.94},
            {'date': 15775, 'open': 155.32, 'high': 156.04, 'low': 155.13, 'close': 156.03, 'volume': 83746800, 'adjusted': 154.52},
            {'date': 15776, 'open': 155.92, 'high': 156.1, 'low': 155.21, 'close': 155.68, 'volume': 105755800, 'adjusted': 154.17},
            {'date': 15777, 'open': 155.76, 'high': 156.12, 'low': 155.23, 'close': 155.9, 'volume': 92550900, 'adjusted': 154.39},
            {'date': 15778, 'open': 156.31, 'high': 156.8, 'low': 155.91, 'close': 156.73, 'volume': 126329900, 'adjusted': 155.21},
            {'date': 15779, 'open': 155.85, 'high': 156.04, 'low': 155.31, 'close': 155.83, 'volume': 138601100, 'adjusted': 155.01},
            {'date': 15782, 'open': 154.34, 'high': 155.64, 'low': 154.2, 'close': 154.97, 'volume': 126704300, 'adjusted': 154.15},
            {'date': 15783, 'open': 155.3, 'high': 155.51, 'low': 153.59, 'close': 154.61, 'volume': 167567300, 'adjusted': 153.8},
            {'date': 15784, 'open': 155.52, 'high': 155.95, 'low': 155.26, 'close': 155.69, 'volume': 113759300, 'adjusted': 154.87},
            {'date': 15785, 'open': 154.76, 'high': 155.64, 'low': 154.1, 'close': 154.36, 'volume': 128605000, 'adjusted': 153.55},
            {'date': 15786, 'open': 154.85, 'high': 155.6, 'low': 154.73, 'close': 155.6, 'volume': 111163600, 'adjusted': 154.78},
            {'date': 15789, 'open': 156.01, 'high': 156.27, 'low': 154.35, 'close': 154.95, 'volume': 151322300, 'adjusted': 154.13},
            {'date': 15790, 'open': 155.59, 'high': 156.23, 'low': 155.42, 'close': 156.19, 'volume': 86856600, 'adjusted': 155.37},
            {'date': 15791, 'open': 155.26, 'high': 156.24, 'low': 155, 'close': 156.19, 'volume': 99950600, 'adjusted': 155.37},
            {'date': 15792, 'open': 156.09, 'high': 156.85, 'low': 155.75, 'close': 156.67, 'volume': 102932800, 'adjusted': 155.85},
            {'date': 15796, 'open': 156.59, 'high': 156.91, 'low': 155.67, 'close': 156.05, 'volume': 99194100, 'adjusted': 155.23},
            {'date': 15797, 'open': 156.61, 'high': 157.21, 'low': 156.37, 'close': 156.82, 'volume': 101504300, 'adjusted': 155.99},
            {'date': 15798, 'open': 156.91, 'high': 157.03, 'low': 154.82, 'close': 155.23, 'volume': 154167400, 'adjusted': 154.41},
            {'date': 15799, 'open': 155.43, 'high': 156.17, 'low': 155.09, 'close': 155.86, 'volume': 131885000, 'adjusted': 155.04},
            {'date': 15800, 'open': 153.95, 'high': 155.35, 'low': 153.77, 'close': 155.16, 'volume': 159666000, 'adjusted': 154.34},
            {'date': 15803, 'open': 155.27, 'high': 156.22, 'low': 154.75, 'close': 156.21, 'volume': 86571200, 'adjusted': 155.39},
            {'date': 15804, 'open': 156.5, 'high': 157.32, 'low': 155.98, 'close': 156.75, 'volume': 101922200, 'adjusted': 155.92},
            {'date': 15805, 'open': 157.17, 'high': 158.87, 'low': 157.13, 'close': 158.67, 'volume': 135711100, 'adjusted': 157.83},
            {'date': 15806, 'open': 158.7, 'high': 159.71, 'low': 158.54, 'close': 159.19, 'volume': 110142500, 'adjusted': 158.35},
            {'date': 15807, 'open': 158.68, 'high': 159.04, 'low': 157.92, 'close': 158.8, 'volume': 116359900, 'adjusted': 157.96},
            {'date': 15810, 'open': 158, 'high': 158.13, 'low': 155.1, 'close': 155.12, 'volume': 217259000, 'adjusted': 154.3},
            {'date': 15811, 'open': 156.29, 'high': 157.49, 'low': 155.91, 'close': 157.41, 'volume': 147507800, 'adjusted': 156.58},
            {'date': 15812, 'open': 156.29, 'high': 156.32, 'low': 154.28, 'close': 155.11, 'volume': 226834800, 'adjusted': 154.29},
            {'date': 15813, 'open': 155.37, 'high': 155.41, 'low': 153.55, 'close': 154.14, 'volume': 167583200, 'adjusted': 153.33},
            {'date': 15814, 'open': 154.5, 'high': 155.55, 'low': 154.12, 'close': 155.48, 'volume': 149687600, 'adjusted': 154.66},
            {'date': 15817, 'open': 155.78, 'high': 156.54, 'low': 154.75, 'close': 156.17, 'volume': 106553500, 'adjusted': 155.35},
            {'date': 15818, 'open': 156.95, 'high': 157.93, 'low': 156.17, 'close': 157.78, 'volume': 166141300, 'adjusted': 156.95},
            {'date': 15819, 'open': 157.83, 'high': 158.3, 'low': 157.54, 'close': 157.88, 'volume': 96781200, 'adjusted': 157.05},
            {'date': 15820, 'open': 158.34, 'high': 159.27, 'low': 158.1, 'close': 158.52, 'volume': 131060600, 'adjusted': 157.69},
            {'date': 15821, 'open': 158.33, 'high': 158.6, 'low': 157.73, 'close': 158.24, 'volume': 95918800, 'adjusted': 157.41},
            {'date': 15824, 'open': 158.67, 'high': 159.65, 'low': 158.42, 'close': 159.3, 'volume': 88572800, 'adjusted': 158.46},
            {'date': 15825, 'open': 159.27, 'high': 159.72, 'low': 158.61, 'close': 159.68, 'volume': 116010700, 'adjusted': 158.84},
            {'date': 15826, 'open': 159.33, 'high': 159.41, 'low': 158.1, 'close': 158.28, 'volume': 138874200, 'adjusted': 157.45},
            {'date': 15827, 'open': 158.68, 'high': 159.89, 'low': 158.53, 'close': 159.75, 'volume': 96407600, 'adjusted': 158.91},
            {'date': 15828, 'open': 161.14, 'high': 161.88, 'low': 159.78, 'close': 161.37, 'volume': 144202300, 'adjusted': 160.52},
            {'date': 15831, 'open': 161.49, 'high': 162.01, 'low': 161.42, 'close': 161.78, 'volume': 66882100, 'adjusted': 160.93},
            {'date': 15832, 'open': 162.13, 'high': 162.65, 'low': 161.67, 'close': 162.6, 'volume': 90359200, 'adjusted': 161.74},
            {'date': 15833, 'open': 162.42, 'high': 163.39, 'low': 162.33, 'close': 163.34, 'volume': 97419200, 'adjusted': 162.48},
            {'date': 15834, 'open': 163.27, 'high': 163.7, 'low': 162.47, 'close': 162.88, 'volume': 106738600, 'adjusted': 162.02},
            {'date': 15835, 'open': 162.99, 'high': 163.55, 'low': 162.51, 'close': 163.41, 'volume': 103203000, 'adjusted': 162.55},
            {'date': 15838, 'open': 163.2, 'high': 163.81, 'low': 162.82, 'close': 163.54, 'volume': 81843200, 'adjusted': 162.68},
            {'date': 15839, 'open': 163.67, 'high': 165.35, 'low': 163.67, 'close': 165.23, 'volume': 119000900, 'adjusted': 164.36},
            {'date': 15840, 'open': 164.96, 'high': 166.45, 'low': 164.91, 'close': 166.12, 'volume': 120718500, 'adjusted': 165.25},
            {'date': 15841, 'open': 165.78, 'high': 166.36, 'low': 165.09, 'close': 165.34, 'volume': 109913600, 'adjusted': 164.47},
            {'date': 15842, 'open': 165.95, 'high': 167.04, 'low': 165.73, 'close': 166.94, 'volume': 129801000, 'adjusted': 166.06},
            {'date': 15845, 'open': 166.78, 'high': 167.58, 'low': 166.61, 'close': 166.93, 'volume': 85071200, 'adjusted': 166.05},
            {'date': 15846, 'open': 167.08, 'high': 167.8, 'low': 166.5, 'close': 167.17, 'volume': 95804200, 'adjusted': 166.29},
            {'date': 15847, 'open': 167.34, 'high': 169.07, 'low': 165.17, 'close': 165.93, 'volume': 244031800, 'adjusted': 165.06},
            {'date': 15848, 'open': 164.16, 'high': 165.91, 'low': 163.94, 'close': 165.45, 'volume': 211064400, 'adjusted': 164.58},
            {'date': 15849, 'open': 164.47, 'high': 165.38, 'low': 163.98, 'close': 165.31, 'volume': 151573900, 'adjusted': 164.44},
            {'date': 15853, 'open': 167.04, 'high': 167.78, 'low': 165.81, 'close': 166.3, 'volume': 143679800, 'adjusted': 165.42},
            {'date': 15854, 'open': 165.42, 'high': 165.8, 'low': 164.34, 'close': 165.22, 'volume': 160363400, 'adjusted': 164.35},
            {'date': 15855, 'open': 165.35, 'high': 166.59, 'low': 165.22, 'close': 165.83, 'volume': 107793800, 'adjusted': 164.96},
            {'date': 15856, 'open': 165.37, 'high': 166.31, 'low': 163.13, 'close': 163.45, 'volume': 176850100, 'adjusted': 162.59},
            {'date': 15859, 'open': 163.83, 'high': 164.46, 'low': 162.66, 'close': 164.35, 'volume': 168390700, 'adjusted': 163.48},
            {'date': 15860, 'open': 164.44, 'high': 165.1, 'low': 162.73, 'close': 163.56, 'volume': 157631500, 'adjusted': 162.7},
            {'date': 15861, 'open': 163.09, 'high': 163.42, 'low': 161.13, 'close': 161.27, 'volume': 211737800, 'adjusted': 160.42},
            {'date': 15862, 'open': 161.2, 'high': 162.74, 'low': 160.25, 'close': 162.73, 'volume': 200225500, 'adjusted': 161.87},
            {'date': 15863, 'open': 163.85, 'high': 164.95, 'low': 163.14, 'close': 164.8, 'volume': 188337800, 'adjusted': 163.93},
            {'date': 15866, 'open': 165.31, 'high': 165.4, 'low': 164.37, 'close': 164.8, 'volume': 105667100, 'adjusted': 163.93},
            {'date': 15867, 'open': 163.3, 'high': 164.54, 'low': 162.74, 'close': 163.1, 'volume': 159505400, 'adjusted': 162.24},
            {'date': 15868, 'open': 164.22, 'high': 164.39, 'low': 161.6, 'close': 161.75, 'volume': 177361500, 'adjusted': 160.9},
            {'date': 15869, 'open': 161.66, 'high': 164.5, 'low': 161.3, 'close': 164.21, 'volume': 163587800, 'adjusted': 163.35},
            {'date': 15870, 'open': 164.03, 'high': 164.67, 'low': 162.91, 'close': 163.18, 'volume': 141197500, 'adjusted': 162.32},
            {'date': 15873, 'open': 164.29, 'high': 165.22, 'low': 163.22, 'close': 164.44, 'volume': 136295600, 'adjusted': 163.57},
            {'date': 15874, 'open': 164.53, 'high': 165.99, 'low': 164.52, 'close': 165.74, 'volume': 114695600, 'adjusted': 164.87},
            {'date': 15875, 'open': 165.6, 'high': 165.89, 'low': 163.38, 'close': 163.45, 'volume': 206149500, 'adjusted': 162.59},
            {'date': 15876, 'open': 161.86, 'high': 163.47, 'low': 158.98, 'close': 159.4, 'volume': 321255900, 'adjusted': 158.56},
            {'date': 15877, 'open': 159.64, 'high': 159.76, 'low': 157.47, 'close': 159.07, 'volume': 271956800, 'adjusted': 159.07},
            {'date': 15880, 'open': 157.41, 'high': 158.43, 'low': 155.73, 'close': 157.06, 'volume': 222329000, 'adjusted': 157.06},
            {'date': 15881, 'open': 158.48, 'high': 160.1, 'low': 157.42, 'close': 158.57, 'volume': 162262200, 'adjusted': 158.57},
            {'date': 15882, 'open': 159.87, 'high': 160.5, 'low': 159.25, 'close': 160.14, 'volume': 134848000, 'adjusted': 160.14},
            {'date': 15883, 'open': 161.1, 'high': 161.82, 'low': 160.95, 'close': 161.08, 'volume': 129483700, 'adjusted': 161.08},
            {'date': 15884, 'open': 160.63, 'high': 161.4, 'low': 159.86, 'close': 160.42, 'volume': 160402900, 'adjusted': 160.42},
            {'date': 15887, 'open': 161.26, 'high': 162.48, 'low': 161.08, 'close': 161.36, 'volume': 131954800, 'adjusted': 161.36},
            {'date': 15888, 'open': 161.12, 'high': 162.3, 'low': 160.5, 'close': 161.21, 'volume': 154863700, 'adjusted': 161.21},
            {'date': 15889, 'open': 160.48, 'high': 161.77, 'low': 160.22, 'close': 161.28, 'volume': 75216400, 'adjusted': 161.28},
            {'date': 15891, 'open': 162.47, 'high': 163.08, 'low': 161.3, 'close': 163.02, 'volume': 122416900, 'adjusted': 163.02},
            {'date': 15894, 'open': 163.86, 'high': 164.39, 'low': 163.08, 'close': 163.95, 'volume': 108092500, 'adjusted': 163.95},
            {'date': 15895, 'open': 164.98, 'high': 165.33, 'low': 164.27, 'close': 165.13, 'volume': 119298000, 'adjusted': 165.13},
            {'date': 15896, 'open': 164.97, 'high': 165.75, 'low': 164.63, 'close': 165.19, 'volume': 121410100, 'adjusted': 165.19},
            {'date': 15897, 'open': 167.11, 'high': 167.61, 'low': 165.18, 'close': 167.44, 'volume': 135592200, 'adjusted': 167.44},
            {'date': 15898, 'open': 167.39, 'high': 167.93, 'low': 167.13, 'close': 167.51, 'volume': 104212700, 'adjusted': 167.51},
            {'date': 15901, 'open': 167.97, 'high': 168.39, 'low': 167.68, 'close': 168.15, 'volume': 69450600, 'adjusted': 168.15},
            {'date': 15902, 'open': 168.26, 'high': 168.36, 'low': 167.07, 'close': 167.52, 'volume': 88702100, 'adjusted': 167.52},
            {'date': 15903, 'open': 168.16, 'high': 168.48, 'low': 167.73, 'close': 167.95, 'volume': 92873900, 'adjusted': 167.95},
            {'date': 15904, 'open': 168.31, 'high': 169.27, 'low': 168.2, 'close': 168.87, 'volume': 103620100, 'adjusted': 168.87},
            {'date': 15905, 'open': 168.52, 'high': 169.23, 'low': 168.31, 'close': 169.17, 'volume': 103831700, 'adjusted': 169.17},
            {'date': 15908, 'open': 169.41, 'high': 169.74, 'low': 169.01, 'close': 169.5, 'volume': 79428600, 'adjusted': 169.5},
            {'date': 15909, 'open': 169.8, 'high': 169.83, 'low': 169.05, 'close': 169.14, 'volume': 80829700, 'adjusted': 169.14},
            {'date': 15910, 'open': 169.79, 'high': 169.86, 'low': 168.18, 'close': 168.52, 'volume': 112914000, 'adjusted': 168.52},
            {'date': 15911, 'open': 168.22, 'high': 169.08, 'low': 167.94, 'close': 168.93, 'volume': 111088600, 'adjusted': 168.93},
            {'date': 15912, 'open': 168.22, 'high': 169.16, 'low': 167.52, 'close': 169.11, 'volume': 107814600, 'adjusted': 169.11},
            {'date': 15915, 'open': 168.68, 'high': 169.06, 'low': 168.11, 'close': 168.59, 'volume': 79695000, 'adjusted': 168.59},
            {'date': 15916, 'open': 169.1, 'high': 169.28, 'low': 168.19, 'close': 168.59, 'volume': 85209600, 'adjusted': 168.59},
            {'date': 15917, 'open': 168.94, 'high': 169.85, 'low': 168.49, 'close': 168.71, 'volume': 142388700, 'adjusted': 168.71},
            {'date': 15918, 'open': 169.99, 'high': 170.81, 'low': 169.9, 'close': 170.66, 'volume': 110438400, 'adjusted': 170.66},
            {'date': 15919, 'open': 170.28, 'high': 170.97, 'low': 170.05, 'close': 170.95, 'volume': 91116700, 'adjusted': 170.95},
            {'date': 15922, 'open': 170.57, 'high': 170.96, 'low': 170.35, 'close': 170.7, 'volume': 54072700, 'adjusted': 170.7},
            {'date': 15923, 'open': 170.37, 'high': 170.74, 'low': 169.35, 'close': 169.73, 'volume': 87495000, 'adjusted': 169.73},
            {'date': 15924, 'open': 169.19, 'high': 169.43, 'low': 168.55, 'close': 169.18, 'volume': 84854700, 'adjusted': 169.18},
            {'date': 15925, 'open': 169.98, 'high': 170.18, 'low': 168.93, 'close': 169.8, 'volume': 102181300, 'adjusted': 169.8},
            {'date': 15926, 'open': 169.58, 'high': 170.1, 'low': 168.72, 'close': 169.31, 'volume': 91757700, 'adjusted': 169.31},
            {'date': 15929, 'open': 168.46, 'high': 169.31, 'low': 168.38, 'close': 169.11, 'volume': 68593300, 'adjusted': 169.11},
            {'date': 15930, 'open': 169.41, 'high': 169.9, 'low': 168.41, 'close': 169.61, 'volume': 80806000, 'adjusted': 169.61},
            {'date': 15931, 'open': 169.53, 'high': 169.8, 'low': 168.7, 'close': 168.74, 'volume': 79829200, 'adjusted': 168.74},
            {'date': 15932, 'open': 167.41, 'high': 167.43, 'low': 166.09, 'close': 166.38, 'volume': 152931800, 'adjusted': 166.38},
            {'date': 15933, 'open': 166.06, 'high': 166.63, 'low': 165.5, 'close': 165.83, 'volume': 130868200, 'adjusted': 165.83},
            {'date': 15936, 'open': 165.64, 'high': 166.21, 'low': 164.76, 'close': 164.77, 'volume': 96437600, 'adjusted': 164.77},
            {'date': 15937, 'open': 165.04, 'high': 166.2, 'low': 164.86, 'close': 165.58, 'volume': 89294400, 'adjusted': 165.58},
            {'date': 15938, 'open': 165.12, 'high': 166.03, 'low': 164.19, 'close': 164.56, 'volume': 159530500, 'adjusted': 164.56},
            {'date': 15939, 'open': 164.9, 'high': 166.3, 'low': 164.89, 'close': 166.06, 'volume': 101471400, 'adjusted': 166.06},
            {'date': 15940, 'open': 166.55, 'high': 166.83, 'low': 165.77, 'close': 166.62, 'volume': 90888900, 'adjusted': 166.62},
            {'date': 15943, 'open': 166.79, 'high': 167.3, 'low': 165.89, 'close': 166, 'volume': 89702100, 'adjusted': 166},
            {'date': 15944, 'open': 164.36, 'high': 166, 'low': 163.21, 'close': 163.33, 'volume': 158619400, 'adjusted': 163.33},
            {'date': 15945, 'open': 163.26, 'high': 164.49, 'low': 163.05, 'close': 163.91, 'volume': 108113000, 'adjusted': 163.91},
            {'date': 15946, 'open': 163.55, 'high': 165.04, 'low': 163.4, 'close': 164.17, 'volume': 119200500, 'adjusted': 164.17},
            {'date': 15947, 'open': 164.51, 'high': 164.53, 'low': 163.17, 'close': 163.65, 'volume': 134560800, 'adjusted': 163.65},
            {'date': 15951, 'open': 165.23, 'high': 165.58, 'low': 163.7, 'close': 164.39, 'volume': 142322300, 'adjusted': 164.39},
            {'date': 15952, 'open': 164.43, 'high': 166.03, 'low': 164.13, 'close': 165.75, 'volume': 97304000, 'adjusted': 165.75},
            {'date': 15953, 'open': 165.85, 'high': 166.4, 'low': 165.73, 'close': 165.96, 'volume': 62930500, 'adjusted': 165.96}
        ]}];
    }
})();
(function() {
    'use strict';

    ChartJsTickerController.$inject = ["$interval"];
    angular
        .module('app.examples.charts')
        .controller('ChartJsTickerController', ChartJsTickerController);

    /* @ngInject */
    function ChartJsTickerController($interval) {
        var maximum = 100;
        var vm = this;
        vm.data = [[]];
        vm.labels = [];
        vm.options = {
            animation: false,
            showScale: false,
            showTooltips: false,
            pointDot: false,
            datasetStrokeWidth: 0.5
        };

        // Update the dataset at 25FPS for a smoothly-animating chart
        $interval(function () {
            getLiveChartData();
        }, 40);

        function getLiveChartData () {
            if (vm.data[0].length) {
                vm.labels = vm.labels.slice(1);
                vm.data[0] = vm.data[0].slice(1);
            }

            while (vm.data[0].length < maximum) {
                vm.labels.push('');
                vm.data[0].push(getRandomValue(vm.data[0]));
            }
        }

        function getRandomValue (data) {
            var l = data.length, previous = l ? data[l - 1] : 50;
            var y = previous + Math.random() * 10 - 5;
            return y < 0 ? 0 : y > 100 ? 100 : y;
        }

    }
})();
(function() {
    'use strict';

    ChartJsPieController.$inject = ["$interval"];
    angular
        .module('app.examples.charts')
        .controller('ChartJsPieController', ChartJsPieController);

    /* @ngInject */
    function ChartJsPieController($interval) {
        var vm = this;
        vm.labels = ['Download Sales', 'Instore Sales', 'Mail Order'];
        vm.options = {
            datasetFill: false
        };

        /////////////

        function randomData() {
            vm.data = [];
            for(var label = 0; label < vm.labels.length; label++) {
                vm.data.push(Math.floor((Math.random() * 100) + 1));
            }
        }

        // init

        randomData();

        // Simulate async data update
        $interval(randomData, 5000);
    }
})();
(function() {
    'use strict';

    ChartJsLineController.$inject = ["$interval"];
    angular
        .module('app.examples.charts')
        .controller('ChartJsLineController', ChartJsLineController);

    /* @ngInject */
    function ChartJsLineController($interval) {
        var vm = this;
        vm.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
        vm.series = ['Series A', 'Series B', 'Series C'];
        vm.options = {
            datasetFill: false
        };

        ///////////

        function randomData() {
            vm.data = [];
            for(var series = 0; series < vm.series.length; series++) {
                var row = [];
                for(var label = 0; label < vm.labels.length; label++) {
                    row.push(Math.floor((Math.random() * 100) + 1));
                }
                vm.data.push(row);
            }
        }

        // init

        randomData();

        // Simulate async data update
        $interval(randomData, 5000);
    }
})();
(function() {
    'use strict';

    ChartJSBarController.$inject = ["$interval"];
    angular
        .module('app.examples.charts')
        .controller('ChartJsBarController', ChartJSBarController);

    /* @ngInject */
    function ChartJSBarController($interval) {
        var vm = this;
        vm.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
        vm.series = ['Series A', 'Series B'];

        /////////

        function randomData() {
            vm.data = [];
            for(var series = 0; series < vm.series.length; series++) {
                var row = [];
                for(var label = 0; label < vm.labels.length; label++) {
                    row.push(Math.floor((Math.random() * 100) + 1));
                }
                vm.data.push(row);
            }
        }

        // init

        randomData();

        // Simulate async data update
        $interval(randomData, 5000);
    }
})();
(function() {
    'use strict';

    angular
        .module('app.examples.authentication', [

        ]);
})();
(function() {
    'use strict';

    angular
        .module('app.examples.authentication')
        .controller('ProfileController', ProfileController);

    /* @ngInject */
    function ProfileController() {
        var vm = this;
        vm.settingsGroups = [{
            name: 'Account Settings',
            settings: [{
                title: 'Show my location',
                icon: 'zmdi zmdi-pin',
                enabled: true
            },{
                title: 'Show my avatar',
                icon: 'zmdi zmdi-face',
                enabled: false
            },{
                title: 'Send me notifications',
                icon: 'zmdi zmdi-notifications-active',
                enabled: true
            }]
        },{
            name: 'Chat Settings',
            settings: [{
                title: 'Show my username',
                icon: 'zmdi zmdi-account',
                enabled: true
            },{
                title: 'Make my profile public',
                icon: 'zmdi zmdi-account-box',
                enabled: false
            },{
                title: 'Allow cloud backups',
                icon: 'zmdi zmdi-cloud-upload',
                enabled: true
            }]
        }];
        vm.user = {
            name: 'Christos',
            email: 'info@oxygenna.com',
            location: 'Sitia, Crete, Greece',
            website: 'http://www.oxygenna.com',
            twitter: 'oxygenna',
            bio: 'We are a small creative web design agency \n who are passionate with our pixels.',
            current: '',
            password: '',
            confirm: ''
        };
    }
})();
(function() {
    'use strict';

    SignupController.$inject = ["$scope", "$state", "$mdToast", "$http", "$filter", "triSettings"];
    angular
        .module('app.examples.authentication')
        .controller('SignupController', SignupController);

    /* @ngInject */
    function SignupController($scope, $state, $mdToast, $http, $filter, triSettings) {
        var vm = this;
        vm.triSettings = triSettings;
        vm.signupClick = signupClick;
        vm.user = {
            name: '',
            email: '',
            password: '',
            confirm: ''
        };

        ////////////////

        function signupClick() {
            $mdToast.show(
                $mdToast.simple()
                .content($filter('triTranslate')('Confirmation sent'))
                .position('bottom right')
                .action($filter('triTranslate')('Login'))
                .highlightAction(true)
                .hideDelay(0)
            ).then(function() {
                $state.go('authentication.login');
            });
        }
    }
})();

(function() {
    'use strict';

    LoginController.$inject = ["$state", "AuthenticationService", "AuthenticationAPIService", "NotificationService", "triSettings"];
    angular
        .module('app.examples.authentication')
        .controller('LoginController', LoginController);

    /* @ngInject */
    function LoginController($state, AuthenticationService ,AuthenticationAPIService, NotificationService, triSettings) {
        var vm = this;
        vm.loginClick = loginClick;
        vm.socialLogins = [{
            icon: 'fa fa-twitter',
            color: '#5bc0de',
            url: '#'
        },{
            icon: 'fa fa-facebook',
            color: '#337ab7',
            url: '#'
        },{
            icon: 'fa fa-google-plus',
            color: '#e05d6f',
            url: '#'
        },{
            icon: 'fa fa-linkedin',
            color: '#337ab7',
            url: '#'
        }];
        vm.triSettings = triSettings;
        // create blank user variable for login form
        vm.credentials = {
            username: '',
            password: ''
        };

        // 
        init();

        function init(){
            AutoConnect();
        }
        ////////////////

        function AutoConnect()
        {
            AuthenticationService.getUserByToken()
                                 .then(function(user) {
                                    NotificationService.popAToast('Connect as: ' + user.username + ' ?', 10000)
                                    .then(function(response){
                                        if(response == true)
                                        {
                                            $state.go('triangular.products-manage') ;  
                                        }
                                    })                          
                        })
                        .catch(function(err) {
                            // it's okey, just conenct with the normal way.
                        })
        }
        
        function loginClick() {
                Promise.resolve(AuthenticationService.login(vm.credentials))
                       .then(function(success) {
                               $state.go('triangular.products-manage') ;
                        })
                        .catch(function(err) {
                                NotificationService.popAToast('Error: '+ err.status + err.statusText + ' : ' + err.data, 5000);
                        }) 
        }
    }
})();

(function() {
    'use strict';

    LockController.$inject = ["$state", "triSettings"];
    angular
        .module('app.examples.authentication')
        .controller('LockController', LockController);

    /* @ngInject */
    function LockController($state, triSettings) {
        var vm = this;
        vm.loginClick = loginClick;
        vm.user = {
            name: 'Morris Onions',
            email: 'info@oxygenna.com',
            password: ''
        };
        vm.triSettings = triSettings;

        ////////////////

        // controller to handle login check
        function loginClick() {
            // user logged in ok so goto the dashboard
            $state.go('triangular.dashboard-general');
        }
    }
})();
(function() {
    'use strict';

    ForgotController.$inject = ["$scope", "$state", "$mdToast", "$filter", "$http", "triSettings"];
    angular
        .module('app.examples.authentication')
        .controller('ForgotController', ForgotController);

    /* @ngInject */
    function ForgotController($scope, $state, $mdToast, $filter, $http, triSettings) {
        var vm = this;
        vm.triSettings = triSettings;
        vm.user = {
            email: ''
        };
        vm.resetClick = resetClick;

        ////////////////

        function resetClick() {
            $mdToast.show(
                $mdToast.simple()
                .content($filter('triTranslate')('Your new password has been mailed'))
                .position('bottom right')
                .action($filter('triTranslate')('Login'))
                .highlightAction(true)
                .hideDelay(0)
            ).then(function() {
                $state.go('authentication.login');
            });
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('triangular.themes', [

        ]);
})();
(function() {
    'use strict';

    themingProvider.$inject = ["$mdThemingProvider"];
    angular
        .module('triangular.themes')
        .provider('triTheming', themingProvider);

    /* @ngInject */
    function themingProvider($mdThemingProvider) {
        var themes = {};

        return {
            theme: function(name) {
                if(angular.isDefined(themes[name])) {
                    return themes[name];
                }

                var theme = new Theme(name);

                themes[name] = theme;

                return themes[name];

            },
            $get: function() {
                return {
                    getTheme: function(themeName) {
                        return themes[themeName];
                    },
                    getThemeHue: function(themeName, intentName, hue) {
                        if(angular.isDefined($mdThemingProvider._THEMES[themeName]) && angular.isDefined($mdThemingProvider._THEMES[themeName].colors[intentName])) {
                            var palette = $mdThemingProvider._THEMES[themeName].colors[intentName];
                            if(angular.isDefined($mdThemingProvider._PALETTES[palette.name]) && angular.isDefined($mdThemingProvider._PALETTES[palette.name][palette.hues[hue]])) {
                                return $mdThemingProvider._PALETTES[palette.name][palette.hues[hue]];
                            }
                        }
                    },
                    getPalette: function(name) {
                        return $mdThemingProvider._PALETTES[name];
                    },
                    getPaletteColor: function(paletteName, hue) {
                        if(angular.isDefined($mdThemingProvider._PALETTES[paletteName]) && angular.isDefined($mdThemingProvider._PALETTES[paletteName][hue])) {
                            return $mdThemingProvider._PALETTES[paletteName][hue];
                        }
                    },
                    rgba: $mdThemingProvider._rgba,
                    palettes: $mdThemingProvider._PALETTES,
                    themes: $mdThemingProvider._THEMES,
                    parseRules: $mdThemingProvider._parseRules
                };
            }
        };
    }

    function Theme(name) {
        var THEME_COLOR_TYPES = ['primary', 'accent', 'warn', 'background'];
        var self = this;
        self.name = name;
        self.colors = {};
        self.isDark = false;

        THEME_COLOR_TYPES.forEach(function(colorType) {
            self[colorType + 'Palette'] = function setPaletteType(paletteName, hues) {
                self.colors[colorType] = {
                    name: paletteName,
                    hues: {}
                };
                if(angular.isDefined(hues)) {
                    self.colors[colorType].hues = hues;
                }
                return self;
            };
        });

        self.dark = function(isDark) {
            // default setting when dark() is called is true
            self.isDark = angular.isUndefined(isDark) ? true : isDark;
        };
    }
})();
(function() {
    'use strict';

    skinsProvider.$inject = ["$mdThemingProvider", "triThemingProvider"];
    Skin.$inject = ["id", "name", "$mdThemingProvider", "triThemingProvider"];
    addSkinToScope.$inject = ["$rootScope", "triSkins"];
    angular
        .module('triangular.themes')
        .provider('triSkins', skinsProvider)
        .run(addSkinToScope);

    /* @ngInject */
    function skinsProvider($mdThemingProvider, triThemingProvider) {
        var skins = {};
        var currentSkin = null;
        var useSkinCookie = false;

        return {
            skin: function(id, name) {
                if(angular.isDefined(skins[id])) {
                    return skins[id];
                }

                var skin = new Skin(id, name, $mdThemingProvider, triThemingProvider);

                skins[id] = skin;

                return skins[id];
            },
            setSkin: function(id) {
                if(angular.isUndefined(skins[id])) {
                    return;
                }

                // set skin to selected skin
                currentSkin = skins[id];

                // override the skin if cookie is enabled and has been set
                if(useSkinCookie) {
                    // we need to check cookies to see if skin has been saved so inject it
                    var $cookies;
                    angular.injector(['ngCookies']).invoke(['$cookies', function(cookies) {
                        $cookies = cookies;
                    }]);
                    // if we have a cookie set then override the currentSkin
                    var triangularSkin = $cookies.get('triangular-skin');
                    if(angular.isDefined(triangularSkin)) {
                        var cookieTheme = angular.fromJson(triangularSkin);
                        currentSkin = angular.isDefined(skins[cookieTheme.skin]) ? skins[cookieTheme.skin] : skins[0];
                    }
                }

                // make material load the themes needed for the skin
                currentSkin.loadThemes();

                return currentSkin;
            },
            useSkinCookie: function(skinCookie) {
                useSkinCookie = skinCookie;
            },
            $get: function() {
                return {
                    getCurrent: function() {
                        return currentSkin;
                    },
                    getSkins: function() {
                        return skins;
                    }
                };
            }
        };
    }

    /* @ngInject */
    function Skin(id, name, $mdThemingProvider, triThemingProvider) {
        var THEMABLE_ELEMENTS = ['sidebar', 'logo', 'toolbar', 'content'];
        var self = this;
        self.id = id;
        self.name = name;
        self.elements = {};

        THEMABLE_ELEMENTS.forEach(function(element) {
            self[element + 'Theme'] = function setElementTheme(themeName) {
                self.elements[element] = themeName;
                return self;
            };
        });

        self.loadThemes = function() {
            // go through each element
            for (var element in self.elements) {
                // register theme with mdThemingProvider (will load css in the header)
                var theme = triThemingProvider.theme(self.elements[element]);

                $mdThemingProvider.theme(theme.name)
                .primaryPalette(theme.colors.primary.name, theme.colors.primary.hues)
                .accentPalette(theme.colors.accent.name, theme.colors.accent.hues)
                .warnPalette(theme.colors.warn.name, theme.colors.warn.hues)
                .dark(theme.isDark);

                if(angular.isDefined(theme.colors.background)) {
                    $mdThemingProvider
                    .theme(theme.name)
                    .backgroundPalette(theme.colors.background.name, theme.colors.background.hues);
                }
            }

            $mdThemingProvider.setDefaultTheme(self.elements.content);
        };
    }

    /* @ngInject */
    function addSkinToScope($rootScope, triSkins) {
        $rootScope.triSkin = triSkins.getCurrent();
    }
})();
(function() {
    'use strict';

    angular
        .module('triangular', [
            'ngMaterial',
            'triangular.layouts', 'triangular.components', 'triangular.themes', 'triangular.directives', 'triangular.router',
            // 'triangular.profiler',
            // uncomment above to activate the speed profiler
            'ui.router'
        ]);
})();
(function() {
    'use strict';

    runFunction.$inject = ["$rootScope", "$window", "$state", "$filter", "$timeout", "$injector", "triRoute", "triBreadcrumbsService"];
    angular
        .module('triangular')
        .run(runFunction);

    /* @ngInject */
    function runFunction($rootScope, $window, $state, $filter, $timeout, $injector, triRoute, triBreadcrumbsService) {
        var breadcrumbs = triBreadcrumbsService.breadcrumbs;

        // change title when language changes - when a menu item is clicked - on app init
        var menuTitleHandler = $rootScope.$on('changeTitle', function(){
            setFullTitle();
        });

        $rootScope.$on('$destroy', function(){
            menuTitleHandler();
        });

        function setFullTitle() {
            $timeout(function(){
                var title = triRoute.title;
                angular.forEach(breadcrumbs.crumbs, function(crumb){
                    var name = crumb.name;
                    if($injector.has('translateFilter')) {
                        name = $filter('translate')(crumb.name);
                    }
                    title +=' ' + triRoute.separator + ' ' + name;
                });
                $window.document.title = title;
            });
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('triangular')
        .provider('triRoute', routeProvider);

    /* @ngInject */
    function routeProvider() {
        // Provider
        var settings = {
            docTitle: '',
            separator: ''
        };

        this.setTitle = setTitle;
        this.setSeparator = setSeparator;
        this.$get = routeHelper;

        function setTitle(title) {
            settings.docTitle = title;
        }

        function setSeparator(separator) {
            settings.separator = separator;
        }

        // Service
        function routeHelper() {
            return {
                title: settings.docTitle,
                separator: settings.separator
            };
        }
    }
})();


(function() {
    'use strict';

    angular
        .module('triangular.router', [

        ]);
})();
(function() {
    'use strict';

    angular
        .module('triangular.profiler', [
            'digestHud'
        ]);
})();
(function() {
    'use strict';

    profilerConfig.$inject = ["digestHudProvider"];
    angular
        .module('triangular.profiler')
        .config(profilerConfig);

    /* @ngInject */
    function profilerConfig(digestHudProvider) {
        digestHudProvider.enable();

        // Optional configuration settings:
        digestHudProvider.setHudPosition('top right'); // setup hud position on the page: top right, bottom left, etc. corner
        digestHudProvider.numTopWatches = 20;  // number of items to display in detailed table
        digestHudProvider.numDigestStats = 25;  // number of most recent digests to use f
    }
})();
(function() {
    'use strict';

    layoutRunner.$inject = ["$rootScope", "triLayout"];
    angular
        .module('triangular')
        .run(layoutRunner)
        .provider('triLayout', layoutProvider);

    /* @ngInject */
    function layoutProvider() {
        var layoutDefaults = {
            toolbarSize: 'default',
            toolbarShrink: true,
            toolbarClass: '',
            contentClass: '',
            innerContentClass: '',
            sideMenuSize: 'full',
            showToolbar: true,
            footer: true,
            contentTemplateUrl: 'app/triangular/layouts/default/default-content.tmpl.html',
            sidebarLeftTemplateUrl: 'app/layouts/leftsidenav/leftsidenav.tmpl.html',
            sidebarLeftController: 'MenuController',
            sidebarRightTemplateUrl: 'app/triangular/components/notifications-panel/notifications-panel.tmpl.html',
            sidebarRightController: 'NotificationsPanelController',
            toolbarTemplateUrl: 'app/triangular/components/toolbars/toolbar.tmpl.html',
            toolbarController: 'DefaultToolbarController',
            footerTemplateUrl: 'app/triangular/components/footer/footer.tmpl.html'
        };
        var resetableOptions = ['toolbarSize', 'toolbarShrink', 'toolbarClass', 'contentClass', 'innerContentClass', 'sideMenuSize', 'showToolbar', 'footer', 'contentTemplateUrl', 'sidebarLeftTemplateUrl', 'sidebarLeftController', 'sidebarRightTemplateUrl', 'sidebarRightController', 'toolbarTemplateUrl', 'toolbarController', 'footerTemplateUrl', 'loaderTemplateUrl', 'loaderController'];
        var layout = {};

        this.getDefaultOption = getDefaultOption;
        this.setDefaultOption = setDefaultOption;

        function getDefaultOption(name) {
            return layoutDefaults[name];
        }

        function setDefaultOption(name, value) {
            layoutDefaults[name] = value;
        }

        // init

        angular.extend(layout, layoutDefaults);

        // Service
        this.$get = function() {
            function setOption(name, value) {
                layout[name] = value;
            }

            function updateLayoutFromState(event, toState) {
                // reset classes
                angular.forEach(resetableOptions, function(option){
                    layout[option] = layoutDefaults[option];
                });
                var layoutOverrides = angular.isDefined(toState.data) && angular.isDefined(toState.data.layout) ? toState.data.layout : {};
                angular.extend(layout, layout, layoutOverrides);
            }

            return {
                layout: layout,
                setOption: setOption,
                updateLayoutFromState: updateLayoutFromState
            };
        };
    }

    /* @ngInject */
    function layoutRunner($rootScope, triLayout) {
        // check for $stateChangeStart and update the layouts if we have data.layout set
        // if nothing set reset to defaults for every state
        var destroyOn = $rootScope.$on('$stateChangeStart', triLayout.updateLayoutFromState);
        $rootScope.$on('$destroy', removeWatch);

        /////////////

        function removeWatch() {
            destroyOn();
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('triangular.directives', [
        ]);
})();
(function() {
    'use strict';

    themeBackground.$inject = ["$mdTheming", "triTheming"];
    angular
        .module('triangular.directives')
        .directive('themeBackground', themeBackground);

    /* @ngInject */
    function themeBackground($mdTheming, triTheming) {
        // Usage:
        // ```html
        // <div md-theme="cyan" theme-background="primary|accent|warn|background:default|hue-1|hue-2|hue-3">Coloured content</div>
        // ```
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link($scope, $element, attrs) {
            $mdTheming($element);

            // make sure we have access to the theme - causes an eslint but nothing we can do about AM naming
            var $mdTheme = $element.controller('mdTheme'); //eslint-disable-line
            if(angular.isDefined($mdTheme)) {
                var intent = attrs.themeBackground;
                var hue = 'default';

                // check if we have a hue provided
                if(intent.indexOf(':') !== -1) {
                    var splitIntent = attrs.themeBackground.split(':');
                    intent = splitIntent[0];
                    hue = splitIntent[1];
                }
                // get the color and apply it to the element
                var color = triTheming.getThemeHue($mdTheme.$mdTheme, intent, hue);
                if(angular.isDefined(color)) {
                    $element.css({
                        'background-color': triTheming.rgba(color.value),
                        'border-color': triTheming.rgba(color.value),
                        'color': triTheming.rgba(color.contrast)
                    });
                }
            }
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('triangular.directives')
        .directive('triSamePassword', samePassword);

    /* @ngInject */
    function samePassword() {
        // Usage:
        //
        // ```html
        // <form name="signup">
        //     <input name="password" type="password" ng-model="user.password" same-password="signup.confirm" />
        //     <input name="confirm" type="password" ng-model="user.confirm" same-password="signup.confirm" />
        // </form>
        // ```
        // Creates:
        //
        // `samePassword` is a directive with the purpose to validate a password input based on the value of another input.
        // When both input values are the same the inputs will be set to valid

        var directive = {
            restrict: 'A',
            require: 'ngModel',
            link: link,
            scope: {
                triSamePassword: '='
            }
        };
        return directive;

        function link(scope, element, attrs, ngModel) {
            ngModel.$viewChangeListeners.push(function() {
                ngModel.$setValidity('samePassword', scope.triSamePassword.$modelValue === ngModel.$modelValue);
                scope.triSamePassword.$setValidity('samePassword', scope.triSamePassword.$modelValue === ngModel.$modelValue);
            });
        }
    }
})();
(function() {
    'use strict';

    paletteBackground.$inject = ["triTheming"];
    angular
        .module('triangular.directives')
        .directive('paletteBackground', paletteBackground);

    /* @ngInject */
    function paletteBackground(triTheming) {
        // Usage:
        // ```html
        // <div palette-background="green:500">Coloured content</div>
        // ```
        //
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link($scope, $element, attrs) {
            var splitColor = attrs.paletteBackground.split(':');
            var color = triTheming.getPaletteColor(splitColor[0], splitColor[1]);

            if(angular.isDefined(color)) {
                $element.css({
                    'background-color': triTheming.rgba(color.value),
                    'border-color': triTheming.rgba(color.value),
                    'color': triTheming.rgba(color.contrast)
                });
            }
        }
    }
})();
(function() {
    'use strict';

    countupto.$inject = ["$timeout"];
    angular
        .module('triangular.directives')
        .directive('countupto', countupto);

    /* @ngInject */
    function countupto($timeout) {
        // Usage:
        //
        // ```html
        // <h1 countupto="100"></h1>
        // ```
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'A',
            scope: {
                'countupto': '=',
                'options': '='
            }
        };
        return directive;

        function link($scope, $element, attrs) {
            var options = {
                useEasing: true,
                useGrouping: true,
                separator: ',',
                decimal: '.',
                prefix: '',
                suffix: ''
            };

            var numAnim;

            // override default options?
            if ($scope.options) {
                for(var option in options) {
                    if(angular.isDefined($scope.options[option])) {
                        options[option] = $scope.options[option];
                    }
                }
            }

            attrs.from = angular.isUndefined(attrs.from) ? 0 : parseInt(attrs.from);
            attrs.decimals = angular.isUndefined(attrs.decimals) ? 2 : parseFloat(attrs.decimals);
            attrs.duration = angular.isUndefined(attrs.duration) ? 5 : parseFloat(attrs.duration);

            $timeout(function() {
                numAnim = new CountUp($element[0], attrs.from, $scope.countupto, attrs.decimals, attrs.duration, options);
                numAnim.start();

                $scope.$watch('countupto', function(value, oldValue) {
                    if (angular.isDefined(value) && value != oldValue) {
                        numAnim.update(value);
                    }
                });

            }, 500);            
        }
    }

})();
(function() {
    'use strict';

    angular
        .module('app.permission', [
            'permission', 'permission.ui'
        ]);
})();

(function() {
    'use strict';

    PermissionController.$inject = ["$state", "$window", "$cookies", "RoleStore", "PermissionStore", "UserService", "users"];
    angular
        .module('app.permission')
        .controller('PermissionController', PermissionController);

    /* @ngInject */
    function PermissionController($state, $window, $cookies, RoleStore, PermissionStore, UserService, users) {
        var vm = this;
        vm.userList = users.data;
        vm.roleList = [];
        vm.permissionList = [];
        vm.allRoles = RoleStore.getStore();
        vm.allPermissions = PermissionStore.getStore();

        vm.loginClick = loginClick;
        vm.selectUser = selectUser;

        ////////////////

        function init() {
            var currentUser = UserService.getCurrentUser();
            angular.forEach(users.data, function(user) {
                if(user.username === currentUser.username) {
                    selectUser(user);
                }
            });
        }

        function loginClick() {
            // store username in a cookie so we can load after reload
            $cookies.put('tri-user', vm.selectedUser.username);
            $window.location.reload();
        }

        function selectUser(user) {
            vm.selectedUser = user;
            vm.roleList = [];
            vm.permissionList = [];
            // find first role and select that
            angular.forEach(vm.allRoles, function(role) {
                if(-1 !== vm.selectedUser.roles.indexOf(role.roleName)) {
                    // add this users roles to the list
                    vm.roleList.push(role);
                    angular.forEach(role.validationFunction, function(permission) {
                        vm.permissionList.push(permission);
                    });
                }
            });
        }

        // init

        init();
    }
})();

(function() {
    'use strict';

    DefaultToolbarController.$inject = ["$scope", "$injector", "$rootScope", "$mdMedia", "$state", "$element", "$filter", "$mdUtil", "$mdSidenav", "$mdToast", "$timeout", "$document", "AuthenticationService", "triBreadcrumbsService", "triSettings", "triLayout", "AuthErrorService"];
    angular
        .module('triangular.components')
        .controller('ToolbarController', DefaultToolbarController);

    /* @ngInject */
    function DefaultToolbarController($scope, $injector, $rootScope, $mdMedia, $state, $element, $filter, $mdUtil, $mdSidenav, $mdToast, $timeout, $document, AuthenticationService , triBreadcrumbsService, triSettings, triLayout, AuthErrorService) {
        var vm = this;
        vm.breadcrumbs = triBreadcrumbsService.breadcrumbs;
        vm.emailNew = false;
        vm.languages = triSettings.languages;
        vm.openSideNav = openSideNav;
        vm.hideMenuButton = hideMenuButton;
        vm.switchLanguage = switchLanguage;
        vm.toggleNotificationsTab = toggleNotificationsTab;
        vm.logout = logout;
        vm.isFullScreen = true;
        vm.fullScreenIcon = 'zmdi zmdi-fullscreen';
        vm.toggleFullScreen = toggleFullScreen;
        vm.notificationsCount = 0;

        if($injector.has('UserService')) {
            var UserService = $injector.get('UserService');
            if(UserService.getCurrentUser().username != undefined)
            {
                vm.currentUser = UserService.getCurrentUser();
            }
            else
            {
                AuthenticationService.getUserByToken()
                                     .then(function(user)
                                                {
                                                    UserService.setCurrentUser(user);
                                                    vm.currentUser = UserService.getCurrentUser();
                                                })
                                     .catch(function(error){
                                            //UserService.setDefaultUser();
                                            vm.currentUser = UserService.getCurrentUser();
                                            //AuthErrorService.AuthError('ChangePermissionDenied');
                                     })         
            }
        }
        else {
            // permissions are turned off so no UserService available
            // just set default user
            vm.currentUser = {
                displayName: 'Christos',
                username: 'christos',
                avatar: 'assets/images/avatars/avatar-5.png',
                roles: []
            };
        }

        ////////////////

        function openSideNav(navID) {
            $mdUtil.debounce(function(){
                $mdSidenav(navID).toggle();
            }, 300)();
        }

        function switchLanguage(languageCode) {
            if($injector.has('$translate')) {
                var $translate = $injector.get('$translate');
                $translate.use(languageCode)
                .then(function() {
                    $mdToast.show(
                        $mdToast.simple()
                        .content($filter('triTranslate')('Language Changed'))
                        .position('bottom right')
                        .hideDelay(500)
                    );
                    $rootScope.$emit('changeTitle');
                });
            }
        }

        function hideMenuButton() {
            switch(triLayout.layout.sideMenuSize) {
                case 'hidden':
                    // always show button if menu is hidden
                    return false;
                case 'off':
                    // never show button if menu is turned off
                    return true;
                default:
                    // show the menu button when screen is mobile and menu is hidden
                    return $mdMedia('gt-sm');
            }
        }

        $scope.$on('ToolbarNotification', function() {
            vm.notificationsCount = vm.notificationsCount + 1;
        });

        $rootScope.$on('AppUserChanged', function() {
            if($injector.has('UserService')) {
                var UserService = $injector.get('UserService');
                vm.currentUser = UserService.getCurrentUser();
                //$scope.$apply();
            }
        });

        function toggleNotificationsTab(tab) {
            vm.notificationsCount = 0;
            $rootScope.$broadcast('triSwitchNotificationTab', tab);
            vm.openSideNav('notifications');
        }

        function logout(a) {
            if($injector.has('UserService')) {
                var UserService = $injector.get('UserService');
                UserService.reinitUser();
            } 
            AuthenticationService.logout(); 
        }

        function toggleFullScreen() {
            vm.isFullScreen = !vm.isFullScreen;
            vm.fullScreenIcon = vm.isFullScreen ? 'zmdi zmdi-fullscreen-exit':'zmdi zmdi-fullscreen';
            // more info here: https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
            var doc = $document[0];
            if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement ) {
                if (doc.documentElement.requestFullscreen) {
                    doc.documentElement.requestFullscreen();
                } else if (doc.documentElement.msRequestFullscreen) {
                    doc.documentElement.msRequestFullscreen();
                } else if (doc.documentElement.mozRequestFullScreen) {
                    doc.documentElement.mozRequestFullScreen();
                } else if (doc.documentElement.webkitRequestFullscreen) {
                    doc.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (doc.exitFullscreen) {
                    doc.exitFullscreen();
                } else if (doc.msExitFullscreen) {
                    doc.msExitFullscreen();
                } else if (doc.mozCancelFullScreen) {
                    doc.mozCancelFullScreen();
                } else if (doc.webkitExitFullscreen) {
                    doc.webkitExitFullscreen();
                }
            }
        }

        $scope.$on('newMailNotification', function(){
            vm.emailNew = true;
        });
    }
})();

(function() {
    'use strict';

RightSidenavController.$inject = ["$scope", "$rootScope", "$http", "$mdSidenav", "$state", "AuthenticationService", "API_CONFIG", "NotificationService"];
    angular
    .module('triangular.components')
    .filter('reverse', function() {
      return function(items) {
        return items.slice().reverse();
      };
    })    
    .controller('RightSidenavController', RightSidenavController);
    /* @ngInject */
    function RightSidenavController($scope,$rootScope, $http, $mdSidenav, $state, AuthenticationService , API_CONFIG, NotificationService) {
        var vm = this;
        // sets the current active tab
        vm.close = close;
        vm.currentTab = 0;
        vm.notificationGroups = [{
            name: 'Products',
            notifications: []
        },{
            name: 'PCA',
            notifications: []
        },{
            name: 'Standards',
            notifications: []
        }];

        vm.openMail = openMail;
        vm.settingsGroups = [{
            name: 'Account Settings',
            settings: [{
                title: 'Show my location',
                icon: 'zmdi zmdi-pin',
                enabled: true
            },{
                title: 'Show my avatar',
                icon: 'zmdi zmdi-face',
                enabled: false
            },{
                title: 'Send me notifications',
                icon: 'zmdi zmdi-notifications-active',
                enabled: true
            }]
        },{
            name: 'Chat Settings',
            settings: [{
                title: 'Show my username',
                icon: 'zmdi zmdi-account',
                enabled: true
            },{
                title: 'Make my profile public',
                icon: 'zmdi zmdi-account-box',
                enabled: false
            },{
                title: 'Allow cloud backups',
                icon: 'zmdi zmdi-cloud-upload',
                enabled: true
            }]
        }];

        vm.statisticsGroups = [{
            name: 'User Statistics',
            stats: [{
                title: 'Storage Space (120/160 Gb)',
                mdClass: 'md-primary',
                value: 60
            },{
                title: 'Bandwidth Usage (10/100 Gb)',
                mdClass: 'md-accent',
                value: 10
            },{
                title: 'Memory Usage (1/8 Gb)',
                mdClass: 'md-warn',
                value: 100
            }]
        },{
            name: 'Server Statistics',
            stats: [{
                title: 'Storage Space (120/160 Gb)',
                mdClass: 'md-primary',
                value: 60
            },{
                title: 'Bandwidth Usage (10/100 Gb)',
                mdClass: 'md-accent',
                value: 10
            },{
                title: 'Memory Usage (1/8 Gb)',
                mdClass: 'md-warn',
                value: 100
            }]
        }];

        init();

        ////////////////

        // add an event to switch tabs (used when user clicks a menu item before sidebar opens)
        $scope.$on('triSwitchNotificationTab', function($event, tab) {
            vm.currentTab = tab;
        });

        // fetch some dummy emails from the API
        $http({
            method: 'GET',
            url: API_CONFIG.url + 'email/inbox'
        }).then(function(response) {
            vm.emails = response.data.slice(1,20);
        });

        function openMail() {
            $state.go('triangular-no-scroll.email.inbox');
            vm.close();
        }

        function close() {
            $mdSidenav('notifications').close();
        }

        $rootScope.$on('StandardsNotification', function(event, notification){
            UpdateNotificationGroups( 'Standards',notification);
        });   

        $rootScope.$on('ProductsNotification', function(event, notification){
            UpdateNotificationGroups( 'Products',notification);
        });  

        $rootScope.$on('PCANotification', function(event, notification){
            UpdateNotificationGroups( 'PCA',notification);
        });      

        function UpdateNotificationGroups( NotifGroup,notification)
        {
             for(var i=0 ; i < vm.notificationGroups.length ; i++)
             {
                if(vm.notificationGroups[i].name == NotifGroup)
                {
                    vm.notificationGroups[i].notifications.push(notification);
                    break;
                }
                if( i == vm.notificationGroups.length - 1 && vm.notificationGroups[i].name != NotifGroup)
                {
                    var NewNotifGroup = {
                        name: NotifGroup,
                        notifications: notification
                    };
                    vm.notificationGroups.push(NewNotifGroup);
                    break;
                }
            }
            //$scope.$apply(); 
        }

        function init()
        {
            NotificationService.getNotifications()
                               .then(function(notifications) {
                                    for(var i = 0 ; i <  notifications.length ; i++)
                                    {
                                        UpdateNotificationGroups( notifications[i].GroupName , notifications[i]);
                                    }
                               });
        } 
}
})();

(function() {
    'use strict';

    angular
        .module('app', [
            'ui.router',
            'triangular',
            'ngAnimate', 'ngCookies', 'ngSanitize', 'ngMessages', 'ngMaterial',
            'googlechart', 'chart.js', 'linkify', 'angularMoment', 'datatables','textAngular', 'uiGmapgoogle-maps', 'hljs', 'md.data.table', angularDragula(angular), 'ngFileUpload',

            'app.translate',
            // only need one language?  if you want to turn off translations
            // comment out or remove the 'app.translate', line above
            'app.permission',
            // dont need permissions?  if you want to turn off permissions
            // comment out or remove the 'app.permission', line above
            // also remove 'permission' from the first line of dependencies
            // https://github.com/Narzerus/angular-permission see here for why
            // uncomment above to activate the example seed module
            // 'seed-module',
            'app.examples',
            'app.laboratory'
        ])

        // set a constant for the API we are connecting to
        .constant('API_CONFIG', {
            'url':  'http://triangular-api.oxygenna.com/'
        });

})();

(function() {
    'use strict';

    LoaderController.$inject = ["triSettings"];
    angular
        .module('app')
        .controller('LoaderController', LoaderController);

    /* @ngInject */
    function LoaderController(triSettings) {
        var vm = this;

        vm.triSettings = triSettings;
    }
})();

(function() {
    'use strict';

    LeftSidenavController.$inject = ["triSettings", "triLayout"];
    angular
        .module('triangular.components')
        .controller('LeftSidenavController', LeftSidenavController);

    /* @ngInject */
    function LeftSidenavController(triSettings, triLayout) {
        var vm = this;
        vm.layout = triLayout.layout;
        vm.sidebarInfo = {
            appName: triSettings.name,
            appLogo: triSettings.logo
        };
        vm.toggleIconMenu = toggleIconMenu;

        ////////////

        function toggleIconMenu() {
            var menu = vm.layout.sideMenuSize === 'icon' ? 'full' : 'icon';
            triLayout.setOption('sideMenuSize', menu);
        }
    }
})();

(function() {
    'use strict';

    FooterController.$inject = ["triLayout", "triSettings"];
    angular
        .module('app')
        .controller('AppFooterController', FooterController);

    /* @ngInject */
    function FooterController(triLayout, triSettings) {
        var vm = this;

        vm.layout = triLayout;
        vm.settings = triSettings;
    }
})();


(function() {
    'use strict';

    angular
        .module('app.standards', [ 'ds.objectDiff'
        ]);
})();
(function() {
    'use strict';

    StandardsController.$inject = ["StandardsAPIService", "NotificationService", "$state", "$scope", "UserService", "$timeout", "StandardsManagementService", "$mdDialog", "$document"];
    angular
        .module('app.standards')
        .controller('StandardsController', StandardsController);

    /* @ngInject */
    function StandardsController(StandardsAPIService ,NotificationService , $state , $scope , UserService ,$timeout , StandardsManagementService, $mdDialog , $document) {

        var vm = this;
        vm.standards = [];
        vm.selectStandard = selectStandard;
        vm.deleteStandard = deleteStandard;
        vm.deleteAllStandards = deleteAllStandards;
        vm.getStandardColor = getStandardColor ;
        ////////////////

        // Standard Update event: 

        //$scope.$on('StandardUpdated', $timeout( init(), 1000));

                // Public functions 
        function init() {  
            // Get Standards List:
            NotificationService.popAToast('Standards Management Service.', 1000);
            getStandards();
        }

        function getStandards () {
            StandardsAPIService.getStandardsList()
                               .then(function(standards) {
                                if(standards != undefined)
                                    {
                                        angular.copy(StandardsManagementService.FormatStandards(standards), vm.standards);
                                        $scope.$apply();                                       
                                    }
                               })
                               .catch(function(error)
                               {
                                  NotificationService.popAToast('Can not get standrds List. Verify authorisation.', 1000);
                               })
        }

        function selectStandard($event, standard) {
            $state.go('triangular.standard-dialog', {standard:standard});
        }

        function deleteStandard($event, standard) 
        { 
            new Promise(function(resolve){
                resolve(StandardsAPIService.deleteStandard(standard._id)); 
            }).then(function(deleted){
                NotificationService.RightSidebarNotif( 'Standards', 'Delete' , deleted.Infos.Name, UserService.getCurrentUser().username);
                getStandards();
            }); 
        }

        function deleteAllStandards()
        {
            for(var i= 0; i < vm.standards.length ; i++)
            {
                deleteStandard('',  vm.standards[i]);
            } 
        }

        function getStandardColor(standard)
        {
            if(standard.Infos.HasUpdate == 0)
            {
                return 'light-green:400';
            }
            else 
            {
                return "deep-orange:500";
            }
        }
        // init
        init();
    }
})();


(function() {
    'use strict';

    config.$inject = ["$stateProvider", "triMenuProvider"];
    angular
        .module('app.standards')
                // set a constant for the API we are connecting to
        .config(config);

    /* @ngInject */
    function config($stateProvider, triMenuProvider) {
        $stateProvider
        .state('triangular.standards-manage', {
            url: '/standards',
            templateUrl: 'app/laboratory/standards/standards.tmpl.html',
            controller: 'StandardsController',
            controllerAs: 'vm',
            data: {
                layout: {
                    toolbarSize: 'default',
                    toolbarShrink: true,
                    toolbarClass: 'full-image-background mb-bg-11',
                    contentClass: 'full-image-background mb-bg-11',
                    sideMenuSize: 'icon',
                    footer: false
                }
            },
            permissions: {
                    only: ['viewStandards']
            }
        })
        .state('triangular.standard-dialog', {
            url: '/standard-dialog',
            templateUrl: 'app/laboratory/standards/standard.dialog.template.html',
            params: {
                 standard: null
            },
            controller: 'StandardDialogController',
            controllerAs: 'vm',
            data: {
                layout: {
                    toolbarSize: 'default',
                    toolbarShrink: false,
                    toolbarClass: 'full-image-background mb-bg-28',
                    sideMenuSize: 'full',
                    footer: false
                },
                permissions: {
                    only: ['viewStandards']
                }
            }
        })
        .state('triangular.standards-add', {
            url: '/standards-add',
            templateUrl: 'app/laboratory/standards/add_standard/add_standard.tmpl.html',
            controller: 'StandardsController',
            controllerAs: 'vm',
            data: {
                layout: {
                    toolbarSize: 'default',
                    toolbarShrink: true,
                    toolbarClass: 'full-image-background mb-bg-11',
                    contentClass: 'full-image-background mb-bg-32',
                    sideMenuSize: 'icon',
                    footer: false
                },
                permissions: {
                    only: ['viewAddStandards']
                }
            }
        });

        triMenuProvider.addMenu({
            name: 'Standards',
            icon: 'zmdi zmdi-assignment',
            type: 'dropdown',
            priority: 2,
            permission: 'viewStandards',
            children: [{
                name: 'Manage Standards',
                icon: 'zmdi zmdi-widgets',
                state: 'triangular.standards-manage',
                type: 'link',
                permission: 'viewStandards'
            },
            {
                name: 'Add',
                icon: 'fa fa-plus-square',
                state: 'triangular.standards-add',
                type: 'link',
                permission: 'viewAddStandards'
            }]
        });
    }
})();
 
(function() {
    'use strict';

    StandardsAPIService.$inject = ["$http", "API_HGLABS", "AuthenticationService", "NotificationService", "AuthErrorService", "$log"];
    angular
        .module('app.standards')
        .factory('StandardsAPIService', StandardsAPIService);

    /* @ngInject */
    function StandardsAPIService($http, API_HGLABS, AuthenticationService , NotificationService, AuthErrorService,  $log) {
        var service = {
            getStandardsList: getStandardsList,
            storeStandardsList: storeStandardsList,
            deleteStandard: deleteStandard,
            getStandard:getStandard
        };

        return service;

        function getStandardsList() {
                return Promise.resolve( AuthenticationService.getAuthToken()
                .then(function (Authentication) {
                    if(Authentication.Authorization == true)
                    {
                    let promise = new Promise(function(resolve, reject){
                        $http({
                            method: 'GET',
                            url: API_HGLABS.url + 'standards' ,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': Authentication.AuthToken
                            }
                        })
                        .then(function(response) {
                            resolve(response.data);
                        })
                        .catch(function(error) {
                            AuthErrorService.httpError(error, "Standard list.");
                        });
                    });
                    return promise;
                    }
                })
              .catch(function(error)
              {
                AuthErrorService.AuthError(error);
                Promise.reject(error);
              })
          );
        }

        function getStandard(id) {

            let promise = new Promise(function(resolve, reject){
                $http({
                    method: 'GET',
                    url: API_HGLABS.url + 'standards/'+ id 
                })
                .then(function(response) {
                    resolve(response.data);
                })
                .catch(function(error) {
                    AuthErrorService.httpError(error, "Create Standard.");
                    reject('Standard List Error');
                });
            });
            return promise;
        }

        function storeStandardsList(StandardList) {            
            return Promise.resolve( AuthenticationService.getAuthToken()
                .then(function (Authentication) {
                    if(Authentication.Authorization == true)
                    {
                    let promise = new Promise(function(resolve, reject){
                        $http({
                            method: 'POST',
                            url: API_HGLABS.url + 'standards',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': Authentication.AuthToken
                            },
                            data: { StandardList : StandardList }
                        })
                        .then(function(response) {
                            resolve(response.data);
                        })
                        .catch(function(error) {
                            AuthErrorService.httpError(error, "Create Standard.");
                            reject('Update Standard ERROR');
                        });
                    });
                    return promise;
                    }
                })
              .catch(function(error)
              {
                AuthErrorService.AuthError(error);
                Promise.reject(error);
              })
          );
        }


        function deleteStandard(id) {
            return Promise.resolve( AuthenticationService.getAuthToken()
                .then(function (Authentication) {
                    if(Authentication.Authorization == true)
                    {
                    let promise = new Promise(function(resolve, reject){
                        $http({
                            method: 'DELETE',
                            url: API_HGLABS.url + 'standards/' + id,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': Authentication.AuthToken
                            }
                        })
                        .then(function(response) {
                            resolve(response.data);
                        })
                        .catch(function(error) {
                            AuthErrorService.httpError(error, "Update Standard.");
                            reject('Update Standard ERROR');
                        });
                    });
                    return promise;
                    }
                })
              .catch(function(error)
              {
                AuthErrorService.AuthError(error);
                Promise.reject(error);
              })
          );
        }

 
    }

})();

(function() {
    'use strict';

     StandardDialogController.$inject = ["$mdDialog", "$document", "$scope", "$state", "$stateParams", "$rootScope", "$log", "PCAManagementService", "StandardsManagementService", "ProductsManagementService", "UserService", "StandardsAPIService", "$timeout", "NotificationService"];
    angular
        .module('app.standards')
        .controller('StandardDialogController', StandardDialogController);

    /* @ngInject */
    function StandardDialogController($mdDialog, $document , $scope , $state , $stateParams ,$rootScope , $log, PCAManagementService, StandardsManagementService , ProductsManagementService , UserService , StandardsAPIService , $timeout, NotificationService ) {
        var vm = this;

        vm.standard = {};
        vm.standardHistory = [];
        vm.rel_products = [];
        vm.closeDialog = closeDialog;
        vm.selectProduct = selectProduct;
        vm.status = 'idle';  // idle | uploading | complete
        vm.getMargin = getMargin;
        vm.backtostandards = backtostandards;
        vm.events = [];
        vm.getBackground = getBackground; 
        vm.getStandardColor = getStandardColor;
        
        //////////////// Public Functions //////////////

        init();

        $scope.UpdateStandard = function (e) {

            new Promise(function(resolve){

                $timeout( StartTreatment(), 100);
                resolve(PCAManagementService.checkFile(e)); 

            }).then(function(result){

                if(result.status == true)
                {
                    $log.info('workbook: ' + result.workbook.Props.SheetNames); 
                    if(PCAManagementService.isValidePCAFile(result.workbook))
                    {
                        Promise.resolve(StandardsManagementService.UpdateStandard(result.workbook.Sheets.PCA, vm.standard._id, vm.standard.Infos.Version))
                               .then(function(savedStandard) {
                                   FinishTreatment('Standard Updated Successfully.') ;
                                   // must change this line to give to this property the Id of the new standard: response of the request
                                   // and Update the Standard in DB.
                                    NotificationService.RightSidebarNotif( 'Standards', 'Update' , vm.standard.Infos.Name + ' Updated to : ' + savedStandard[0].Infos.Name, UserService.getCurrentUser().username);

                                   vm.standard.Infos.HasUpdate = savedStandard[0]._id;
                                   //standard.Infos.HasUpdate = savedStandard._id;
                                   $scope.$apply();
                                   //closeDialog();
                               })
                               .catch(function(err) {
                                   FinishTreatment(err) ;
                               })
                    }
                    else
                    {
                        $timeout( NotificationService.popAToast('PCA sheet not found in the file.', 5000), 500); 
                        ResetTreatment();
                    }
                }
                else
                {
                    ResetTreatment();
                }

            });
        };

        // this function is getting reccursively the history of a standard and push it 
        // into vm.standardHistory, and it builds the event objects containing the difference
        // between each update of a standard.

        // Must change the behaviour of this process, to get standards by name, not by id
        
        function getStandardHistory(i)
        {
                var Local_standard = angular.copy($stateParams.standard);
                if(i == 0)
                {
                    var id_hist = vm.standard.Infos.Id_UpdateOf;
                    vm.standardHistory.push(Local_standard);
                    i++;
                }
                else
                {
                    var id_hist = vm.standardHistory[vm.standardHistory.length - 1].Infos.Id_UpdateOf;
                }

                // if id_hist != 0 => their is a history to search for.
                // when the history is built => build events. 
                if(id_hist != 0)
                {
                    // Recursive functions mechanisme, replacing while loop for asynchronous process
                    Promise.resolve(StandardsAPIService.getStandard(id_hist))
                           .then(function(standard) {
                                 vm.standardHistory.push(StandardsManagementService.FormatStandards(standard));
                                 i++;
                                 if(standard.Infos.Id_UpdateOf != 0)
                                   { 
                                    getStandardHistory(i);
                                   }
                                 else
                                  {
                                    vm.events = StandardsManagementService.buildHistoryEvents(StandardsManagementService.FormatStandards(vm.standardHistory));
                                  }
                            })
                            .catch(function(error) {
                                    vm.events = StandardsManagementService.buildBrokenEvents(StandardsManagementService.FormatStandards(vm.standardHistory), error);
                            })          
                }
                // if id_hist == 0. their is no more history : it's the first version
                else if( id_hist == 0)
                {
                    vm.events = StandardsManagementService.buildHistoryEvents(StandardsManagementService.FormatStandards(vm.standardHistory));
                }
        }
 
        // Treatment Status 

        function StartTreatment() {  
            
            vm.status = 'uploading';
        }

        function FinishTreatment(message) {  
                
            vm.status = 'idle';
             // pop a toast telling users about the how to:
            $timeout( NotificationService.popAToast(message , 5000), 500);
        }

        function ResetTreatment() {  

            $timeout( NotificationService.popAToast('Loading File ERROR.', 5000), 500);    
            vm.status = 'idle';
        }

        function closeDialog() {
               $rootScope.$broadcast('StandardUpdated', '');
        }
 
        function init() {

            if($stateParams.standard == null)
            {
                $state.go('triangular.standards-manage');
            }
            else
            {
                angular.copy($stateParams.standard , vm.standard);
                
                // start with 0 to tell the first function call 
                getStandardHistory(0);
                Promise.resolve(StandardsManagementService.GetrelatedProducts(vm.standard))
                       .then(function(products){
                                vm.rel_products = products;
                                $scope.$apply();
                });
             }
        }

        function selectProduct($event, product) { 
            ProductsManagementService.TagProduct(product)  
                    .then(function(TagedProduct) { 
                            $mdDialog.show({
                                title: 'Product',
                                controller: 'ProductDialogController',
                                controllerAs: 'vm',
                                templateUrl: 'app/laboratory/products/product.dialog.template.html',
                                targetEvent: $event,
                                parent: angular.element($document.body),
                                locals: {
                                    product: TagedProduct
                                },
                                clickOutsideToClose: true
                            });
                    });
        }

        function getMargin(Chapter)
        {
             return Chapter.split(".").length - 1 + '0';
        }

        function backtostandards()
        {
            $state.go('triangular.standards-manage');
        }

        function getStandardColor(standard)
        {
            if(!angular.equals({}, standard))
            {
                if(standard.Infos.HasUpdate == 0)
                {
                    return 'light-green:400';
                }
                else 
                {
                    return "deep-orange:500";
                }
            }
        }
        function getBackground()
        {
            return 'background: url(assets/images/backgrounds/material-backgrounds/mb-bg-08.jpg) no-repeat; background-size: cover;';
        }
     }
    
})();


(function() {
    'use strict';

    StandardsManagementService.$inject = ["$log", "StandardsAPIService", "ProductsAPIService", "PCAManagementService", "ObjectDiff", "NotificationService", "$timeout"];
    angular
        .module('app.standards')
        .factory('StandardsManagementService', StandardsManagementService);

    /* @ngInject */
    function StandardsManagementService($log, StandardsAPIService , ProductsAPIService , PCAManagementService , ObjectDiff , NotificationService, $timeout) {
        var service = {
            PCAtoStandards: PCAtoStandards,
            FormatStandards:FormatStandards,
            getStandardsList:getStandardsList,
            UpdateStandard: UpdateStandard,
            buildHistoryEvents:buildHistoryEvents,
            GetrelatedProducts:GetrelatedProducts,
            diffStandards:diffStandards,
            buildBrokenEvents:buildBrokenEvents
        };

        return service;

        function getStandardsList()
        {
            StandardsAPIService.getStandardsList()
                               .then(function(standards) {
                                   var Fstandards = FormatStandards(standards) ; 
                                   return Promise.resolve(Fstandards);
                               }); 
        }

        function FormatStandards(Standards)
        {
            for(var i = 0; i < Standards.length; i++)
            {
                Standards[i].Designations = angular.fromJson(Standards[i].Designations);
            }
            return TagStandards(Standards);
        }

        function TagStandards(FStandards)
        {
            for(var i = 0; i < FStandards.length; i++)
            {
                for(var j = 0; j < FStandards.length; j++)
                {
                    if(FStandards[i]._id ==  FStandards[j].Infos.Id_UpdateOf )
                    {
                        FStandards[i].Infos.HasUpdate = FStandards[j]._id + ' : ' + FStandards[j].Infos.Name;
                        break;
                    }  
                    else
                    {
                        FStandards[i].Infos.HasUpdate = 0;
                    }
                }  
            }
            return FStandards;
        }
        // This function is used internaly and externaly. 
        function PCAtoStandards(PCA, _id, Version) {

            var Stkeys  = PCAManagementService.getStandardKeys(PCA); 
            var keys = Object.keys(PCA);
            var savedStandards = [];

            for(var i = 0 ; i < Stkeys.length; i++)
            {
                var Standard = {
                    Infos: 
                    {
                        Name: PCA[Stkeys[i]].v,
                        Id_UpdateOf: _id,
                        Version: Version
                    },
                    Designations: []
                };
                
                var Designations = PCAManagementService.getDesignationsList(PCA, keys, Stkeys, Stkeys[i]);

                for(var j =0 ; j < Designations.Designations.length ; j++)
                {
                    var point = { Chapters: '', DesignationTitle: '' , Standard : '' , Directive: '' , Category: ''};
                    point.Chapters = Designations.Designations[j].Chapters;
                    point.DesignationTitle = Designations.Designations[j].DesignationTitle;
                    point.Standard = Designations.Designations[j].Standard;
                    point.Directive = Designations.Designations[j].Directive;
                    point.Category = Designations.Designations[j].Category;

                    Standard.Designations.push(point);
                } 

                savedStandards.push( Promise.resolve(storeStandard(Standard))
                       .then(function(savedStandard){
                                return savedStandard;
                        })
                       .catch(function(err) {
                                return Promise.reject(err);
                        }) 
                    );
           } 
           return Promise.all(savedStandards);
        }
 
        function storeStandard(Standard)
        {
            return Promise.resolve(StandardsAPIService.storeStandardsList(Standard))
                   .then(function(savedStandard){
                        return Promise.resolve(savedStandard); 
                    })
                   .catch(function(err) {
                                  return Promise.reject(err);
                               })             
        }

        function UpdateStandard(PCA,_id, Version) {
 
            var Stkeys  = PCAManagementService.getStandardKeys(PCA); 
            if( Stkeys.length ==  1)
            {
                return Promise.resolve(PCAtoStandards(PCA,_id, Version + 1))
                    .then(function(savedStandard){
                            return Promise.resolve(savedStandard); 
                         })
                    .catch(function(err) { 
                            return Promise.reject(err); 
                            $log.warn('UpdateStandard Error : ' + err);
                        }) 
            }
            else
            {
                return Promise.reject('Error: PCA Sheet schould contain a single Standard'); 
            }
        }

        function buildHistoryEvents(standardHistory)
        {
            var events = [];

            for(var i = 0 ; i < standardHistory.length ; i++)
            {
                var event = {
                            title: '',
                            subtitle: 'Diffs: ',
                            date: '',
                            image: 'assets/images/laboratory/standard2-avatar.png',
                            content: '<div layout="row" layout-align="start center"> <img src="assets/images/laboratory/standard-avatar.png" alt="product-avatar" width="40"/>'  + 'Version : ' + standardHistory[i].Infos.Version + '</div>', //<md-tooltip>' + standardHistory[i].createdAt + '</md-tooltip>',
                            palette: 'amber:400'
                        };                

                if(i != standardHistory.length - 1)
                {
                    var diffValueChangesp = diffStandards( angular.copy(standardHistory[i+1]) , angular.copy(standardHistory[i]) );   

                    var diffValueChangesm = diffStandards( angular.copy(standardHistory[i]) , angular.copy(standardHistory[i+1]) );

                    //var diffValueChanges = ObjectDiff.toJsonDiffView(diff); 
                }
                else
                {
                    var diffValueChangesp = [{Chapters: ' ' , DesignationTitle: 'Creation of standard.'}];
                    var diffValueChangesm = [{Chapters: ' ' , DesignationTitle: '*-*-*-*-*-*-*-*-*-*-*-*-*'}];
                }

                event.title = standardHistory[i].Infos.Name  ;
                event.date  = standardHistory[i].createdAt;
                
                event.subtitle = createSubtitle(diffValueChangesp, diffValueChangesm);
                events.push(event);
            }

            return events;
        }

        function buildBrokenEvents( standardHistory, error)
        {
           var events = buildHistoryEvents(standardHistory);
           var event = {
                            title: error.statusText,
                            subtitle: '',
                            date: '',
                            image: 'assets/images/laboratory/standard2-avatar.png',
                            content: '<h1>'+ error.status +'</h1>',
                            palette: 'deep-orange:500'
                        };
           events.push(event);
           return events;     
        }
        // Obj1 is the reference, Obj2 is the tested object for diffs
        function diffStandards(Obj1 , Obj2)
        {
            var diff = [];
            for(var i=0 ; i < Obj1.Designations.length ; i++)
            {
                for( var j=0 ; j < Obj2.Designations.length ; j++)
                {
                    
                    if(Obj2.Designations[j] != undefined)
                    {
                        //Comparaison between Chapters and Titles of Designations 
                        if( Obj1.Designations[i].DesignationTitle == Obj2.Designations[j].DesignationTitle && Obj1.Designations[i].Chapters == Obj2.Designations[j].Chapters)
                       {
                        delete Obj2.Designations[j];
                        break;
                       }
                   }
                }
            }
            diff = deleteNullProp(Obj2);
            return diff;
        }

        function deleteNullProp(Obj2)
        {
            var diff = [];
            for(var i=0 ; i < Obj2.Designations.length ; i++)
            {
                if( Obj2.Designations[i] != undefined)
                {
                   diff.push( Obj2.Designations[i] );
                }
            }
            return diff;    
        }

        function createSubtitle(diffValueChangesp, diffValueChangesm)
            {
                var subtitle = 'Differences: ';
                for( var i = 0 ; i < diffValueChangesp.length ; i++ )
                {
                   subtitle = subtitle + '<div class="md-list-item-text"> <h4 style=" color: green;"> (+)' + diffValueChangesp[i].Chapters + ' : ' + diffValueChangesp[i].DesignationTitle + '</h4> </div>';
                }
                for( var j = 0 ; j < diffValueChangesm.length ; j++ )
                {
                   subtitle = subtitle + '<div class="md-list-item-text"> <p style=" color: red;"> (-)' + diffValueChangesm[j].Chapters + ' : ' + diffValueChangesm[j].DesignationTitle + '</p> </div>';
                }
                return subtitle;
            }

        function GetrelatedProducts(Standard)
        {
            var rel_products = [];
            return new Promise(function(resolve){
                resolve(ProductsAPIService.getProducts()); 
            }).then(function(products){
                products =  FormatProducts(products);

                for(var i = 0 ; i < products.length ; i++ )
                {
                    if( Object.keys(products[i].ProductJSON.Standards).includes(Standard.Infos.Name))
                    {
                        //products[i].ProductInfo._id = products[i]._id;
                        //rel_products.push(products[i].ProductInfo);
                        rel_products.push(products[i]);
                    }
                }
                 return Promise.resolve(rel_products);
            }); 
        }
 
        function FormatProducts(Products)
        {
            for(var i = 0; i < Products.length; i++)
            {
                Products[i].ProductJSON = angular.fromJson(Products[i].ProductJSON);
            }
            return Products;
        }
 
    }

})();

(function() {
    'use strict';

    ProductsController.$inject = ["$http", "ProductsAPIService", "ProductsManagementService", "PCAManagementService", "$log", "$scope", "$mdToast", "$state", "$mdDialog", "$document", "UserService", "NotificationService", "triLoaderService", "triMenu"];
    angular
        .module('app.products')
        .controller('ProductsController', ProductsController);

    /* @ngInject */
    function ProductsController($http, ProductsAPIService, ProductsManagementService, PCAManagementService , $log, $scope ,$mdToast,$state, $mdDialog, $document,  UserService, NotificationService, triLoaderService, triMenu) {
        var vm = this;

        vm.products = [];
        vm.selectProduct = selectProduct;
        vm.deleteProduct = deleteProduct;
        vm.showProgress = false;
        vm.getProductColor = getProductColor;
        vm.GenerateDashboard = GenerateDashboard;
        vm.GenerateQualifSynthesis = GenerateQualifSynthesis;

        vm.status = 'idle';  // idle | uploading | complete

        var productsMenu = triMenu.getMenu('Products');

        function init() { 

            getProducts();
             // pop a toast telling users about the how to:
            NotificationService.popAToast('Products Management Service.', 5000);
        }
 
        function getProducts(){
            
            vm.products = [];
            vm.showProgress = true;

            new Promise(function(resolve){
                resolve(ProductsAPIService.getProducts()); 
            }).then(function(products){
                products = ProductsManagementService.FormatProducts(products);

                if(products.length == 0)
                {
                    vm.showProgress = false;
                }
                for(var i = 0 ; i < products.length ; i++)
                {
                    ProductsManagementService.TagProduct(products[i])  
                                             .then(function(TagedProduct) {

                                                     vm.products.push(TagedProduct);
                                                     $scope.$apply();
                                                     if(vm.products.length == products.length )
                                                     {
                                                        vm.showProgress = false;
                                                        updateMenuBadge();
                                                        $scope.$apply();
                                                     }
                                             });                     
                }

            })
            .catch(function (error){
                NotificationService.popAToast("Can't get product list.");
            })
        }

            vm.showProgress = true;

        function selectProduct($event, product) {
            $mdDialog.show({
                title: 'Product',
                controller: 'ProductDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/laboratory/products/product.dialog.template.html',
                targetEvent: $event,
                parent: angular.element($document.body),
                locals: {
                    product: product
                },
                clickOutsideToClose: true
            });
        }

        function deleteProduct($event, product) { 

            new Promise(function(resolve){
                resolve(ProductsAPIService.deleteProduct(product._id)); 
            }).then(function(deletedproduct){
                NotificationService.RightSidebarNotif( 'Products', 'Delete' , deletedproduct.ProductInfo.Reference, UserService.getCurrentUser().username);
                NotificationService.popAToast('Product '+ deletedproduct.ProductInfo.Reference+ ' deleted successfully: ', 5000);  
                getProducts();
            }).catch(function(err) {
                NotificationService.popAToast('Error: ' + err , 5000);  
            })
        }
 
        function ProductsCount() {
            var count = 0;
          
            count = vm.products.length;

            return count;
        }

        function getProductColor(product)
        {
            var UpdateCount = 0;
            var standards = Object.keys(product.ProductJSON.Standards);
            for(var i = 0 ; i < standards.length; i++)
            {
                UpdateCount = UpdateCount + product.ProductJSON.Standards[standards[i]].Updates.length ;
            }

            if(UpdateCount == 0)
            {
                return 'light-green:400';
            }
            else if(UpdateCount < 10)
            {
                return 'deep-orange:'+ UpdateCount + '00';
            }
            else 
            {
                return 'deep-orange:900';
            }
        }    
        
         function updateMenuBadge() {
            productsMenu.badge = ProductsCount();
        }
 
        function GenerateDashboard(product)
        {
            vm.status = 'loading';
            $state.go('triangular.products-dashboard', {product: product});
        }
        // init
        init();

        function GenerateQualifSynthesis(product)
        {
            PCAManagementService.JsontoPCA(product, 'ALL');
        }
        // broadcast update products 

        $scope.$on('GetProducts', function() {
            init();
        });
    }
})();
(function() {
    'use strict';

    config.$inject = ["$stateProvider", "triMenuProvider"];
    angular
        .module('app.products')
        .config(config);

    /* @ngInject */
    function config($stateProvider, triMenuProvider) {
        $stateProvider
        .state('triangular.products-manage', {
            url: '/products',
            templateUrl: 'app/laboratory/products/products.tmpl.html',
            controller: 'ProductsController',
            controllerAs: 'vm',
            data: {
                layout: {
                    toolbarSize: 'default',
                    toolbarShrink: true,
                    contentClass: 'full-image-background mb-bg-30',
                    sideMenuSize: 'icon',
                    footer: false
                },
                permissions: {
                    only: ['viewProducts']
                }
            }
        })
        .state('triangular.products-add', {
            url: '/products-manage',
            templateUrl: 'app/laboratory/products/add_product/add_product.tmpl.html',
            controller: 'AddProductController',
            controllerAs: 'vm',
            data: {
                layout: {
                    toolbarSize: 'default',
                    toolbarShrink: true,
                    
                    contentClass: 'full-image-background mb-bg-31',
                    toolbarClass: 'full-image-background mb-bg-31',
                    sideMenuSize: 'icon',
                    footer: false
                },
                permissions: {
                    only: ['viewAddProducts']
                }
            }
        })
        .state('triangular.products-dashboard', {
            url: '/products-dashboard',
            templateUrl: 'app/laboratory/products/dashboard/products.dashboard.template.html',
            params: {
                 product: null
            },
            controller: 'productsDashboardController',
            controllerAs: 'vm',
            data: {
                layout: {
                    toolbarSize: 'default',
                    toolbarShrink: false,
                    sideMenuSize: 'icon',
                    footer: false
                },
                permissions: {
                    only: ['viewDashboard']
                }
            }
        })

        triMenuProvider.addMenu({
            id: 'Products',
            badge: 5,
            name: 'Products',
            icon: 'zmdi zmdi-bookmark-outline',
            type: 'dropdown',
            priority: 1,
            permission: 'viewProducts',
            children: [{
                name: 'Manage Products',
                icon: 'zmdi zmdi-view-module',
                state: 'triangular.products-manage',
                type: 'link',
                permission: 'viewProducts'
            },
            {
                name: 'Add',
                icon: 'fa fa-plus-square',
                state: 'triangular.products-add',
                type: 'link',
                permission: 'viewAddProducts'
            }]
        });
    }
})();




(function() {
    'use strict';

    ProductsAPIService.$inject = ["$http", "API_HGLABS", "$log", "$mdToast", "AuthenticationService", "AuthErrorService", "$state", "$cookies"];
    angular
        .module('app.products')
        .factory('ProductsAPIService', ProductsAPIService);

    /* @ngInject */
    function ProductsAPIService($http,API_HGLABS, $log, $mdToast, AuthenticationService, AuthErrorService , $state, $cookies) {
        var service = {
            getProducts: getProducts,
            createProduct: createProduct,
            deleteProduct:deleteProduct,
            Updateproduct:Updateproduct
        };

        var AuthToken = '';

        return service;

        function getProducts() {
                return Promise.resolve( AuthenticationService.getAuthToken()
                .then(function (Authentication) {
                    if(Authentication.Authorization == true)
                    {
                    let promise = new Promise(function(resolve, reject){
                        $http({
                            method: 'GET',
                            url: API_HGLABS.url + 'products' ,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': Authentication.AuthToken
                            }
                        })
                        .then(function(response) {
                            resolve(response.data);
                        })
                        .catch(function(error) {
                            AuthErrorService.httpError(error, "Product list.");
                        });
                    });
                    return promise;
                    }
                })
              .catch(function(error)
              {
                AuthErrorService.AuthError(error);
                Promise.reject(error);
              })
          );
        }

        function deleteProduct(id) {
                return Promise.resolve( AuthenticationService.getAuthToken()
                .then(function (Authentication) {
                    if(Authentication.Authorization == true)
                    {
                    let promise = new Promise(function(resolve, reject){
                        $http({
                            method: 'DELETE',
                            url: API_HGLABS.url + 'products/' + id,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': Authentication.AuthToken
                            }
                        })
                        .then(function(response) {
                            resolve(response.data);
                        })
                        .catch(function(error) {
                            AuthErrorService.httpError(error, "Delete Product.");
                        });
                    });
                    return promise;
                    }
                })
              .catch(function(error)
              {
                AuthErrorService.AuthError(error);
                Promise.reject(error);
              })
          );
        }
 
        function createProduct(ProductJSON) {
            return Promise.resolve( AuthenticationService.getAuthToken()
                .then(function (Authentication) {
                    if(Authentication.Authorization == true)
                    {
                    let promise = new Promise(function(resolve, reject){
                        $http({
                            method: 'POST',
                            url: API_HGLABS.url + 'products' ,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': Authentication.AuthToken
                            },
                            data: ProductJSON
                        })
                        .then(function(response) {
                            resolve(response);
                        })
                        .catch(function(error) {
                            reject('Add product ERROR');
                            AuthErrorService.httpError(error, 'Add product.');
                        });
                    });
                    return promise;
                    }
                })
              .catch(function(error)
              {
                AuthErrorService.AuthError(error);
              })
          );
        }

        function Updateproduct(ProductJSON) {
            return Promise.resolve( AuthenticationService.getAuthToken()
                .then(function (Authentication) {
                    if(Authentication.Authorization == true)
                    {
                    let promise = new Promise(function(resolve, reject){
                        $http({
                            method: 'PUT',
                            url: API_HGLABS.url + 'products' ,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': Authentication.AuthToken
                            },
                            data: ProductJSON
                        })
                        .then(function(response) {
                            resolve(response);
                        })
                        .catch(function(error) {
                            reject('Update product ERROR');
                            AuthErrorService.httpError(error, 'Update product.');
                        });
                    });
                    return promise;
                    }
                })
              .catch(function(error)
              {
                AuthErrorService.AuthError(error, 'Update product.');
              })
          );
        }
 
    }

})();

(function() {
    'use strict';

    ProductDialogController.$inject = ["product", "UserService", "$scope", "$rootScope", "ProductsManagementService", "NotificationService", "$mdDialog"];
    angular
        .module('app.products')
        .controller('ProductDialogController', ProductDialogController);

    /* @ngInject */
    function ProductDialogController(product, UserService, $scope, $rootScope , ProductsManagementService , NotificationService , $mdDialog) {
        var vm = this;
 
        vm.closeDialog = closeDialog;
        vm.getStandardColor = getStandardColor;
        vm.product = '';
        vm.UpdatesCount = ''; 
        vm.UpdateProductStd = UpdateProductStd;
        vm.getProductColor = getProductColor;
        
        init();

        vm.columns = [{
            title: 'Title',
            field: 'DesignationTitle',
            sortable: true
        },{
            title: 'Standard',
            field: 'Standard',
            sortable: true
        },{
            title: 'Chapters',
            field: 'Chapters',
            sortable: true
        },{
            title: 'Reports',
            field: 'Reports',
            sortable: true
        },{
            title: 'Directive',
            field: 'Directive',
            sortable: true
        },{
            title: 'Comments',
            field: 'Comments',
            sortable: false
        },{
            title: 'Status',
            field: 'Status',
            sortable: true
        }];

        vm.statuses = [
            {value: 1, text: 'P'},
            {value: 2, text: 'F'},
            {value: 3, text: 'NA'},
            {value: 4, text: ' '}
          ]; 
 
        vm.query = {
            order: 'Standard',
            limit: 5,
            page: 1
        };

        vm.events = [ ];

        vm.status = 'idle';  // idle | uploading | complete
        vm.ProductInfos = {
            Reference: '',
            RiskAnalysis: '',
            CreatedBy:UserService.getCurrentUser().displayName
        };

        function closeDialog() {
                $mdDialog.hide();
        }

        function getStandardColor(standard)
        {
            if(standard.Updates.length == 0)
            {
                return 'green:300';
            }
            else if(standard.Updates.length < 10)
            {
                return 'deep-orange:'+ standard.Updates.length + '00';
            }
            else 
            {
                return 'deep-orange:900';
            }
        }

        function getProductColor(product)
        {
            var UpdateCount = 0;
            var standards = Object.keys(product.ProductJSON.Standards);
            for(var i = 0 ; i < standards.length; i++)
            {
                UpdateCount = UpdateCount + product.ProductJSON.Standards[standards[i]].Updates.length ;
            }

            if(UpdateCount == 0)
            {
                return 'light-green:400';
            }
            else if(UpdateCount < 10)
            {
                return 'deep-orange:'+ UpdateCount + '00';
            }
            else 
            {
                return 'deep-orange:900';
            }
        } 

        function init()
        {
             vm.product = product;
             vm.UpdatesCount = ProductsManagementService.isUptodate(product); 
        }

        function UpdateProductStd()
        {
             ProductsManagementService.UpdateProductStd(vm.product)
                                     .then(function(AddedProduct) {
                                        AddedProduct.ProductJSON = angular.fromJson(AddedProduct.ProductJSON);
                                        ProductsManagementService.TagProduct(AddedProduct)
                                                                 .then(function(TagedProduct) {
                                                                    vm.product = TagedProduct;
                                                                    $rootScope.$broadcast( 'GetProducts');
                                                                    $scope.$apply();
                                                                })
                               })
        }
    }
    

 
 })();
(function() {
    'use strict';

    ProductsManagementService.$inject = ["$log", "PCAManagementService", "ProductsAPIService", "StandardsManagementService", "StandardsAPIService", "NotificationService", "UserService"];
    angular
    .module('app.products')
    .factory('ProductsManagementService', ProductsManagementService);

    /* @ngInject */
    function ProductsManagementService($log,PCAManagementService , ProductsAPIService, StandardsManagementService , StandardsAPIService , NotificationService , UserService) {
        var service = {
            PCAtoProduct: PCAtoProduct,
            FormatProducts: FormatProducts,
            TagProduct:TagProduct,
            isUptodate:isUptodate,
            UpdateProductStd:UpdateProductStd,
            addNewProduct:addNewProduct,
            Updateproduct:Updateproduct
        };

        return service; 

        // Extract Standard Struct and store them to DB

        function PCAtoProduct(PCA, Infos) {

            var JsonPCA = PCAManagementService.PCAtoJson(PCA);
            var currentUser = UserService.getCurrentUser();
            var Product = {
                ProductInfo: Infos,
                ProductJSON: ExtractUsedStandards(JsonPCA)
            };
            return Product;
        }

        // Treat JSON to extract only the used standards
        function ExtractUsedStandards(JsonPCA)
        {
            var keys = Object.keys(JsonPCA.Standards);

            for( var i = 0 ; i < keys.length ; i++ )
            {
                for( var j = 0 ; j < JsonPCA.Standards[keys[i]].Designations.length ; j++ )
                {
                    if(JsonPCA.Standards[keys[i]].Designations[j].Status != '')
                    { 
                        break;
                    }
                    if(j == JsonPCA.Standards[keys[i]].Designations.length -1)
                    {
                        delete JsonPCA.Standards[keys[i]];
                        break;
                    }
                }
            }
            return JsonPCA;
        }

        function FormatProducts(Products)
        {
            for(var i = 0; i < Products.length; i++)
            {
                Products[i].ProductJSON = angular.fromJson(Products[i].ProductJSON);
            }
            return Products;
        }

        function TagProduct(product)
        {
            return new Promise( function(resolve){ 
                resolve(StandardsAPIService.getStandardsList()); 
            })
            .then(function(AllStandards) {
             var TagedProduct = TagRelatedStandards(AllStandards, product) ;
             return Promise.resolve(TagedProduct);
         }); 
        }  

        // Must Treat cases where the standard to search is not found ...
        function TagRelatedStandards(AllStandards, product)
        {
            AllStandards  = StandardsManagementService.FormatStandards(AllStandards);
            var Standards = Object.keys(product.ProductJSON.Standards);

            for(var i = 0 ; i < Standards.length ; i++ )
            {
                for(var j = 0 ; j < AllStandards.length ; j++)
                {
                    if( Standards[i] == AllStandards[j].Infos.Name )
                    {
                        var Updates = [];
                        var Updates = GetStandardUpdates(AllStandards , j, Updates);
                        product.ProductJSON.Standards[Standards[i]].Updates = Updates;
                    }
                }
            }
            product.Taged = 'Taged'; 
            return Promise.resolve(product); 
        }

        function GetStandardUpdates(AllStandards , St_idx , Updates)
        {
            for(var i = 0; i < AllStandards.length; i++)
            {
                if(AllStandards[St_idx]._id ==  AllStandards[i].Infos.Id_UpdateOf )
                {
                    var Infos = { 
                        Name: AllStandards[i].Infos.Name,
                        _id : AllStandards[i]._id
                    }
                    Updates.push(Infos);

                    // search if this update has also an update:
                    GetStandardUpdates(AllStandards , i , Updates);
                }
            }
            // if the loop is finished => great.
            // if not the reccursive function keeps searching for new updates. 
            return Updates;
        }

        function isUptodate(product)
        {
            var UpdateCount = 0;
            var standards = Object.keys(product.ProductJSON.Standards);
            for(var i = 0 ; i < standards.length; i++)
            {
                UpdateCount = UpdateCount + product.ProductJSON.Standards[standards[i]].Updates.length ;
            }

            return UpdateCount;
        }   

        function UpdateProductStd(Up_Tag_Product)
        {
           var P_Standards = Object.keys(Up_Tag_Product.ProductJSON.Standards);
           var NewProduct = angular.copy(Up_Tag_Product);

           return new Promise( function(resolve){ 
            resolve(StandardsAPIService.getStandardsList()); 
        })
           .then(function(AllStandards) { 
            AllStandards = StandardsManagementService.FormatStandards(AllStandards);

            for(var j = 0 ; j < AllStandards.length; j++)
            {
                for(var i = 0 ; i < P_Standards.length; i++)
                {
                                        // if a standard has to be updated => copy the remaining tests -> delete the std 
                                        //-> add the updated st

                                        if( Up_Tag_Product.ProductJSON.Standards[P_Standards[i]].Upgradeto == AllStandards[j]._id )
                                        { 
                                                // Rewrite this part to create :
                                                // - a copy of the existing tests 
                                                // - delete the allready existing tests
                                                // - add the new tests.
                                                // of each standard to be upgraded.

                                                // Standards Infos
                                                var NewStd = copyEqualPoints(AllStandards[j] , Up_Tag_Product.ProductJSON.Standards[P_Standards[i]]);
                                                delete NewProduct.ProductJSON.Standards[P_Standards[i]];
                                                NewProduct.ProductJSON.Standards[NewStd.Infos.Name] = NewStd;
                                            } 
                                        }
                                    }

                                // New Product properties update

                                NewProduct.ProductInfo.CreatedBy = UserService.getCurrentUser().displayName;
                                NewProduct.ProductInfo.Id_UpdateOf = Up_Tag_Product._id;
                                NewProduct.ProductInfo.Version = Up_Tag_Product.ProductInfo.Version + 1;
                                NewProduct.createdAt = Date.now();
                                delete NewProduct.createdAt;

                                // Add Product Update

                                return Promise.resolve( addNewProduct(NewProduct)
                                              .then(function(response) {
                                                    NotificationService.RightSidebarNotif( 'Products', 'Update' , NewProduct.ProductInfo.Reference , UserService.getCurrentUser().username);
                                                    NotificationService.popAToast('Product Updated successfully', 5000);
                                                    return response.data; 
                                                })) 
                            });         
       }

       function copyEqualPoints( StdN , StdP )
       {
        for(var i=0 ; i < StdN.Designations.length ; i++)
        {
            for( var j=0 ; j < StdP.Designations.length ; j++)
            {
                    // Comparaison between Chapters and Titles of Designations 
                    // If equal copy designation comments, reports and status 
                    // to the standard.
                    if( StdN.Designations[i].DesignationTitle == StdP.Designations[j].DesignationTitle && StdN.Designations[i].Chapters == StdP.Designations[j].Chapters)
                    {
                        StdN.Designations[i].Comments = StdP.Designations[j].Comments;
                        StdN.Designations[i].Reports  = StdP.Designations[j].Reports;
                        StdN.Designations[i].Status   = StdP.Designations[j].Status;
                        break;
                    }
                    // if it's not 
                    else
                    { 
                        // and it's the last designation -> this designation is a new one -> initialize it.
                        if(j == StdP.Designations.length -1)
                        {
                            StdN.Designations[i].Comments = '';
                            StdN.Designations[i].Reports  = '';
                            StdN.Designations[i].Status   = '';
                        }
                    }
                }
            }
            return StdN;
        }

        function addNewProduct(product)
        {
            return new Promise(function(resolve){
                resolve(ProductsAPIService.createProduct(product)); 
            }).then(function(response){
                return response;
            });           
        }

        function Updateproduct(product)
        {
            return new Promise(function(resolve, reject){
                resolve(ProductsAPIService.Updateproduct(product)); 
            }).then(function(response){
                return Promise.resolve(response.data);
            }).catch(function(err){
                return Promise.reject(err);
            });           
        }

    } 
})();

(function() {
    'use strict';

    angular
        .module('app.pca', ['ngWebworker', 'ngFileSaver'
        ]);
})();
(function() {
    'use strict';

    PcaController.$inject = ["ProductsAPIService", "PCAManagementService", "ProductsManagementService", "StandardsManagementService", "NotificationService", "UserService", "Upload", "Webworker", "$timeout", "$mdToast", "$scope", "$log", "$state"];
    angular
        .module('app.pca')
        .controller('PcaController', PcaController);

    /* @ngInject */
    function PcaController(ProductsAPIService, PCAManagementService,ProductsManagementService , StandardsManagementService , NotificationService , UserService , Upload ,Webworker, $timeout, $mdToast , $scope, $log , $state ) {

        var vm = this;

        vm.status = 'idle';  // idle | uploading | complete
        vm.ProductInfo = { 
            Reference: '',
            ImageBuffer: '',
            RiskAnalysis: '',
            Designation: '',
            Links: '',
            CreatedBy:UserService.getCurrentUser().displayName,
            Version: 0,
            Id_UpdateOf: 0
        };
 
        vm.formestatus = formestatus;
        vm.formcheck = formcheck;

         //////////////// Public Functions //////////////

        $scope.TreatFile = function (e) {

            new Promise(function(resolve){

                $timeout( StartTreatment(), 100);
                resolve(PCAManagementService.checkFile(e)); 

            }).then(function(result){

                if(result.status == true)
                {
                    $log.info('workbook: ' + result.workbook.Props.SheetNames); 
                    if(PCAManagementService.isValidePCAFile(result.workbook))
                    {
                        vm.ProductInfo.Version = 0;
                        vm.ProductInfo.Id_UpdateOf = 0;

                        Promise.resolve(ProductsAPIService.createProduct(ProductsManagementService.PCAtoProduct(result.workbook.Sheets.PCA, vm.ProductInfo)))
                                          .then(function(Product){
                                            if(Product != undefined)
                                            {
                                                Promise.resolve(StandardsManagementService.PCAtoStandards(result.workbook.Sheets.PCA, 0, 0))
                                                        .then(function(success) {
                                                            NotificationService.RightSidebarNotif( 'PCA', 'Add' , vm.ProductInfo.Reference , UserService.getCurrentUser().username );
                                                            $timeout( $state.go('triangular.products-manage'), 3000 );
                                                       })
                                                       .catch(function(err) {
                                                       })   
                                            }
                                          });
                    }
                    else
                    {
                        $timeout( NotificationService.popAToast('PCA sheet not found in the file.', 5000), 500);
                    }
                    // Parsing is done. Update UI.
                    FinishTreatment();
                }
                else
                {
                    ResetTreatment();
                }

            });
        };

        $scope.TreatImage = function (e) {
           
            var reader = new FileReader();
            var file = e.files[0];

            if(file.size < 500000)
            {
              reader.readAsDataURL(file);
            }
            else 
            {
              NotificationService.popAToast('Error: Image size must be under 100 kB.', 5000);
            }

            reader.onerror = function (){
                        reader.abort();
                        new DOMException('Problem parsing input file.');
                        result.status = false;
                        resolve( result );
            };

            reader.onload = function () {
                        vm.ProductInfo.ImageBuffer = reader.result; 
                        $scope.$apply();         
            };
        };
        // Treatment Status 

        function StartTreatment() {  
            
            vm.status = 'uploading';
        }

        function FinishTreatment() {  
                
            vm.status = 'idle';
             // pop a toast telling users about the how to:
            $timeout( NotificationService.popAToast('Loading File successfully done.', 5000), 500);
        }

        function ResetTreatment() {  

            $timeout( NotificationService.popAToast('Loading File ERROR.', 5000), 500);    
            vm.status = 'idle';
        }

        function init() {  

             // pop a toast telling users about the how to:
            $timeout( NotificationService.popAToast('Click on the Upload button to add a new Standard.', 5000), 500);
        }

        function formestatus()
        {
            var status = false;
            var ErrorStack = '';

            if(vm.ProductInfo.Reference =='' || vm.ProductInfo.ImageBuffer =='' || vm.ProductInfo.RiskAnalysis =='' || vm.ProductInfo.Designation =='' || vm.ProductInfo.Links =='' )
            {
                status = true;
            }
            return status;
        }

        function formcheck()
        {
            var ErrorStack = 'Error: ';

            if(vm.ProductInfo.Reference =='')
            {
                ErrorStack = ErrorStack + 'Product Reference is Empty \n';
            }
            if( vm.ProductInfo.ImageBuffer =='')
            {
                ErrorStack = ErrorStack + ' - ' + 'Product Image is Empty \n';
            }
            if( vm.ProductInfo.RiskAnalysis =='')
            {
                ErrorStack = ErrorStack + ' - ' + 'Product RiskAnalysis is Empty \n';
            }
            if(vm.ProductInfo.Designation =='')
            {
                ErrorStack = ErrorStack + ' - ' + 'Product Designation is Empty \n';
            }
            if( vm.ProductInfo.Links =='')
            {
                ErrorStack = ErrorStack + ' - ' + 'Product Links is Empty \n';
            }

            if(ErrorStack != 'Error: ')
            {
                NotificationService.popAToast(ErrorStack, 5000);
            }
        }
 
        // init
        init();

    }
})();


(function() {
    'use strict';

    config.$inject = ["$stateProvider", "triMenuProvider"];
    angular
        .module('app.pca')
        .config(config);

    /* @ngInject */
    function config($stateProvider, triMenuProvider) {
        $stateProvider
        .state('triangular.pca-manage', {
            url: '/PCA',
            templateUrl: 'app/laboratory/pca/pca.tmpl.html',
            controller: 'PcaController',
            controllerAs: 'vm',
            data: {
                layout: {
                    toolbarSize: 'default',
                    toolbarShrink: true,
                    toolbarClass: 'full-image-background mb-bg-11',
                    contentClass: 'full-image-background mb-bg-32',
                    sideMenuSize: 'icon',
                    footer: false
                },
                permissions: {
                    only: ['viewPCA']
                }
            }
        })
        .state('triangular.pca-add', {
            url: '/PCA-add',
            templateUrl: 'app/laboratory/pca/add_pca/add_pca.tmpl.html',
            controller: 'PcaController',
            controllerAs: 'vm',
            data: {
                layout: {
                    toolbarSize: 'default',
                    toolbarShrink: true,
                    toolbarClass: 'full-image-background mb-bg-25',
                    contentClass: 'full-image-background mb-bg-29',
                    sideMenuSize: 'icon',
                    footer: false
                },
                permissions: {
                    only: ['viewPCA']
                }
            }
        });

        triMenuProvider.addMenu({
            name: 'PCAs',
            icon: 'zmdi zmdi-assignment-o',
            type: 'dropdown',
            priority: 1,
            permission: 'viewPCA',
            children: [{
                name: 'Manage PCAs',
                icon: 'zmdi zmdi-file',
                state: 'triangular.pca-manage',
                type: 'link'
            },
            {
                name: 'Add',
                icon: 'fa fa-plus-square',
                state: 'triangular.pca-add',
                type: 'link'
            }]
        });
    }
})();




(function() {
    'use strict';

    PCAManagementService.$inject = ["$log", "$q", "$timeout", "NotificationService", "UserService", "DocsService"];
    angular
        .module('app.pca')
        .factory('PCAManagementService', PCAManagementService);

    /* @ngInject */
    function PCAManagementService($log, $q ,$timeout , NotificationService, UserService , DocsService) {
        var service = {
            PCAtoJson: PCAtoJson,
            isValidePCAFile:isValidePCAFile,
            getStandardKeys:getStandardKeys,
            checkFile:checkFile,
            getDesignationsList:getDesignationsList,
            JsontoPCA: JsontoPCA
        };

        var AcceptedFileTypes = ['application/vnd.ms-excel', 
                                'application/msexcel' ,
                                'application/x-msexcel', 
                                'application/x-ms-excel' , 
                                'application/x-excel' , 
                                'application/x-dos_ms_excel',
                                'application/xls' , 
                                'application/x-xls' , 
                                'application/x-xlsm' , 
                                'application/xlsm',
                                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                'application/vnd.ms-excel.sheet.macroEnabled.12'
                                ];

        return service;

        function JsontoPCA(PJSON, Type)
         {
            // Woorkbook
            var workbook = {};

            // row
            var row = 0;

            // options : 
            var wopts = { bookType:'xlsx', bookSST:false, type:'binary' };

            // Docs infos: 
            // var WbInfos = BuildWbInfos(PJSON);

            // Sheet Names
            var SheetNames =  [ "PCA" ];

             // ** Build PCA Sheet ** // 

            var Sheets = {PCA : {}};

            // Build PCA Sheet cols width 
            var wscols = [ {wch: 20}, {wch: 20}, {wch: 60}, {wch: 20}, {wch: 10}, {wch: 15}, {wch: 30} ];

            // Build Header Merges
            var merges = BuildHeaderMerges(); 

            // init Sheet:
            if(Type == 'ALL') { Sheets.PCA['!ref']    = "A1:AT1441"; }
            else if(Type == 'QS') { Sheets.PCA['!ref']    = "B1:AT1441"; }

            Sheets.PCA['!merges'] = merges;
            Sheets.PCA['!cols']   = wscols;

            //Build Sheet Content
            Sheets = BuildHeaderContent(Sheets , PJSON, 'MD_17_0440');

            //Build PCA content
            var res = BuildPCAContent(Sheets , PJSON);

            Sheets = res[0];
            row = res[1];

            // Build Sheet Footer
            Sheets = BuildPCAFooter(Sheets , PJSON, row);

            // *** BUILD Workbook **** //

            //workbook.Props = WbInfos;
            workbook.SheetNames = SheetNames;
            workbook.Sheets = Sheets;

            // Workbook to binary
            var wbout = XLSX.write(workbook,wopts);

            /* the saveAs call downloads a file on the local machine */
            //saveAs(new Blob([DocsService.s2ab(wbout)],{type:""}), PJSON.ProductInfo.Reference+".xlsx");
            //return new Blob([DocsService.s2ab(wbout)],{type:""});
            return wbout;
            
         }

        function PCAtoJson(PCA) {
 
            var JSON = {  Standards: {}};

            var Stkeys  = getStandardKeys(PCA); 

            var keys = Object.keys(PCA);

            for(var i = 0 ; i < Stkeys.length; i++)
            {
                var Designations = getDesignationsList(PCA, keys, Stkeys, Stkeys[i]);
                JSON.Standards[PCA[Stkeys[i]].v] = Designations;
            }
            return JSON;
        }

        function getDesignationsList(PCA, keys, Stkeys, Stkey) {

            var Designations = {
                    'Designations': []
                    //'DesignationKeys': []
                },
                Deskey = '',
                designation   = {
                    'Chapters': '',
                    'DesignationTitle':'',
                    'Directive': '',
                    'Status': '',
                    'Reports': '',
                    'Comments':'',
                    'Category':''
                },
                // This Flag is due to the disorder caused by the function Object.keys in the PCA properties.
                // This Flag is used to prevent duplicates when searching for designations in a standard 
                Flag = false;

            for(var i = 0 ; i < keys.length ; i++ ){

                // Check if we're in a higher level than the requested standard key
                if(Number(keys[i].slice(1)) >=  Number(Stkey.slice(1)))
                {
                    // Corresponding Designation points 
                    if(Number(keys[i].slice(1)) ==  Number(Stkey.slice(1)) && Flag == false)
                    {
                        Deskey ='C' +(Number(keys[i].slice(1)) +1).toString();
                        Flag = true;
                    }
                    else
                    {
                        Deskey ='C' +(Number(Deskey.slice(1)) +1).toString();
                    }

                    // Check if the Dkey is an existing designation point
                    if(angular.isUndefined(PCA[Deskey]))
                    {
                        // If the key is a standard : we stop 
                        if(Stkeys.indexOf('B' + Deskey.slice(1)) != -1)
                        {
                            break;
                        }
                        // else: it's a title in a standard, so we continue treating designations
                        else
                        {
                            continue;
                        }
                    }
                    // else if the Designation key exists : Treat the point
                    else
                    {
                        // Build designation object 
                        designation   = {
                            'Standard': '',
                            'Chapters': '',
                            'DesignationTitle':'',
                            'Directive': '',
                            'Status': '',
                            'Reports': '',
                            'Comments':'',
                            'Category':'',
                            'SubCategory': ''
                        };

                        if(!angular.isUndefined(PCA['A' + Deskey.slice(1)])) 
                            designation.Standard  = PCA['A' + Deskey.slice(1)].v.toString();
                        if(!angular.isUndefined(PCA['B' + Deskey.slice(1)])) 
                            designation.Chapters  = PCA['B' + Deskey.slice(1)].v.toString();
                        if(!angular.isUndefined(PCA['C' + Deskey.slice(1)]) ) 
                            designation.DesignationTitle  = PCA['C' + Deskey.slice(1)].v.toString();
                        if(!angular.isUndefined(PCA['D' + Deskey.slice(1)]) ) 
                            designation.Directive = PCA['D' + Deskey.slice(1)].v.toString();
                        if(!angular.isUndefined(PCA['E' + Deskey.slice(1)]) )
                            designation.Status    = PCA['E' + Deskey.slice(1)].v.toString();
                        if(!angular.isUndefined(PCA['F' + Deskey.slice(1)]) ) 
                            designation.Reports   = PCA['F' + Deskey.slice(1)].v.toString();
                        if(!angular.isUndefined(PCA['G' + Deskey.slice(1)]) ) 
                            designation.Comments  = PCA['G' + Deskey.slice(1)].v.toString();
                        if(!angular.isUndefined(PCA['N' + Deskey.slice(1)]) ) 
                            designation.Category  = PCA['N' + Deskey.slice(1)].v.toString();
                        if(!angular.isUndefined(PCA['O' + Deskey.slice(1)]) ) 
                            designation.SubCategory  = PCA['O' + Deskey.slice(1)].v.toString();

                        // Push the object to 
                        Designations.Designations.push(designation);
                        //Designations.DesignationKeys.push(Deskey);
                    }
                }
            }
            return Designations;
        }


        function checkFile(e) {

            var result = {
                status : false, 
                workbook: ''
            };

            return $q(function(resolve) {

                var file = e.files[0];

                if (!file) {
                    result.status = false;
                    resolve( result );
                }

                if( AcceptedFileTypes.indexOf(file.type) !== -1)
                {
                    var reader = new FileReader();
                    reader.readAsBinaryString(file);

                    reader.onerror = function (){
                        reader.abort();
                        new DOMException('Problem parsing input file.');
                        result.status = false;
                        resolve( result );
                    };

                    reader.onload = function () {
                        var data = reader.result;
                        var workbook = XLSX.read(data, {type: 'binary'});
 
                        if ( workbook.SheetNames && workbook.SheetNames.length > 0) 
                        {
                            result.status = true;
                            result.workbook = workbook;
                            resolve( result ) ;
                        }         
                    };
                }
                else 
                {
                    $timeout( NotificationService.popAToast('Error: not an excell File.', 5000), 500);
                    result.status = false;
                    resolve( result );
                }
            });
        }

        function getStandardKeys(PCA) {
 
            var Stkeys = [];

            var keys = Object.keys(PCA);

            for(var i = 0 ; i < keys.length ; i++ ){
                if(keys[i].indexOf('B') === 0 ){
                    if( ( PCA[keys[i]].v.toString().indexOf('Standard') === 0 || PCA[keys[i]].v.toString().indexOf('Internal') === 0 || PCA[keys[i]].v.toString().indexOf('Declaration & Certification') === 0) && PCA[keys[i]].v.toString() != 'Standard requirements')
                    {
                        Stkeys.push(keys[i]);
                    }
                }
            }
            return Stkeys;
        }
        // is valid PCA File

        function isValidePCAFile(workbook) {

            if(workbook.SheetNames.indexOf('PCA') !== -1)
                return true;
            else 
                return false;
        }

        // **  PCA Generation Private Functions 

         function BuildPCAFooter(Sheets , PJSON, row ){
            row = row + 4;
            Sheets.PCA['B' + row ] = StyleCell( 'Normal' , 'Established by:');
            Sheets.PCA['D' + row ] = StyleCell( 'Normal' , 'Verified by:');

            return Sheets;
         }
 
        function BuildPCAContent(Sheets , PJSON){
            var Stds = Object.keys(PJSON.ProductJSON.Standards);
            var row = 29;

            if(Stds.length != 0)
            {
                Sheets = BuildStdHeader(Sheets);
            }

            for(var i =0 ; i < Stds.length ; i++)
            {
                if( !Stds[i].includes('Internal requirements'))
                {
                    //Add St + merges
                    Sheets.PCA['A' + row ] = StyleCell( 'StdTitle' , ' ');
                    Sheets.PCA['B' + row ] = StyleCell( 'StdTitle' , Stds[i]);
                    Sheets.PCA['!merges'].push({ e: {c: 6, r: row -1}, s: {c: 1, r: row -1} });
                    //next row
                    row = row+1;
                    //Designations in Std
                    for(var j= 0 ; j < PJSON.ProductJSON.Standards[Stds[i]].Designations.length ; j++)
                    {
                        if(PJSON.ProductJSON.Standards[Stds[i]].Designations[j].Status != '')
                        {
                            Sheets.PCA['A' + row ] = StyleCell( 'Normal' , PJSON.ProductJSON.Standards[Stds[i]].Designations[j].Standard);
                            Sheets.PCA['B' + row ] = StyleCell( 'NormalCenter' , PJSON.ProductJSON.Standards[Stds[i]].Designations[j].Chapters);
                            Sheets.PCA['C' + row ] = StyleCell( 'Normal' , PJSON.ProductJSON.Standards[Stds[i]].Designations[j].DesignationTitle);
                            Sheets.PCA['D' + row ] = StyleCell( 'Normal' , PJSON.ProductJSON.Standards[Stds[i]].Designations[j].Directive);
                            Sheets.PCA['E' + row ] = StyleCell( 'Status'+  PJSON.ProductJSON.Standards[Stds[i]].Designations[j].Status, PJSON.ProductJSON.Standards[Stds[i]].Designations[j].Status);
                            Sheets.PCA['F' + row ] = StyleCell( 'Normal' , PJSON.ProductJSON.Standards[Stds[i]].Designations[j].Reports);
                            Sheets.PCA['G' + row ] = StyleCell( 'Normal' , PJSON.ProductJSON.Standards[Stds[i]].Designations[j].Comments);
                            row = row +1;                        
                        }
                    }                    
                }
            }
            return [ Sheets , row ];
        }

         function StyleCell(style, content)
         {
            var cell = {
                        v: content,
                        s: {
                            font: {
                                name: 'Arial',
                                sz: 12,
                                bold: false,
                                italic: false,
                                wrapText: false,
                                underline: false,
                                color:  { rgb: "000000" }
                            },
                            alignment: {
                                wrapText: true,
                                vertical: 'center',
                                horizontal: 'center'
                            },
                            fill: { fgColor: { rgb: "00477e"} },
                            border: {
                                top:    { style: "medium", color: { rgb: '000000'} },
                                right:  { style: "medium", color: { rgb: '000000'} },
                                bottom: { style: "medium", color: { rgb: '000000'} },
                                left:   { style: "medium", color: { rgb: '000000'} }
                            }
                        }
                    }

            switch (style) {
              case 'StdHeader':
                cell.s.fill.fgColor.rgb = 'e46529';
                cell.s.font.bold = true;
                cell.s.font.color.rgb = "ffffff" ;
                break;
              case 'StdTitle':
                cell.s.font.bold = true;
                cell.s.font.color.rgb = "ffffff" ;
                break;
              case 'Normal':
                cell.s.fill.fgColor.rgb = 'ffffff';
                cell.s.alignment.horizontal = '';
              case 'NormalCenter':
                cell.s.fill.fgColor.rgb = 'ffffff';
                break;
              case 'StatusF':
                cell.s.fill.fgColor.rgb = 'ed1c24'; 
                break;
              case 'StatusP':
                cell.s.fill.fgColor.rgb = '0fe51a'; 
                break;
              case 'StatusA':
                cell.s.fill.fgColor.rgb = 'f58220';
                break;
              case 'StatusNA':
                cell.s.fill.fgColor.rgb = 'ffffff';
                break;
              case 'DesTitle':
                cell.s.fill.fgColor.rgb = 'cccccc';
                break;
              case 'Header':
                cell.s.fill.fgColor.rgb = '646464';
                cell.s.font.bold  = true;
                cell.s.font.color.rgb =  "ffffff" ;
                break;
              case 'SubHeader':
                cell.s.fill.fgColor.rgb = '910049';
                cell.s.font.bold  = true;
                cell.s.font.color.rgb =  "ffffff" ;
                break;               
              default:
              break;
            }
 
            return cell;
        }
         function BuildWbInfos(PJSON)
         {
            var WbInfos = {
                "LastAuthor": UserService.getCurrentUser().username, 
                "RevNumber": PJSON.ProductInfo.Version, 
                "Author": PJSON.ProductInfo.CreatedBy, 
                "Comments": "Automatically Generated by Hager Laboratory©.",
                "Language": "English", 
                "Subject": "Qualification synthesis.", 
                "Title": "Qualification synthesis.", 
                "CreatedDate": PJSON.createdAt, 
                "ModifiedDate": moment(Date.now()), 
                "Application": "Hager Laboratory©", 
                "AppVersion": "V2.0", 
                "SharedDoc": false,
                "ScaleCrop": true,
                "LinksUpToDate": false,
                "Company": "Hager Group - Saverne.", 
                "Manager": "Soufiane CHERRADI", 
                "Worksheets": 1, 
                "SheetNames":["PCA"]
            };
            return WbInfos;
         }

        function BuildHeaderMerges()
         {
            return [{ e: {c: 3, r: 6}, s: {c: 2, r: 6} }, { e: {c: 3, r: 7} , s: {c: 2, r: 7 } }, { e: {c: 3, r: 8 }, s: {c: 2, r: 8} },
                    { e: {c: 3, r: 9}, s: {c: 2, r: 9} }, { e: {c: 3, r: 10}, s: {c: 2, r: 10} }, { e: {c: 3, r: 11}, s: {c: 2, r: 11} },
                    { e: {c: 3, r: 12}, s: {c: 2, r: 12} }, { e: {c: 5, r: 6}, s: {c: 4, r: 6} }, { e: {c: 8, r: 6}, s: {c: 7, r: 6} },
                    { e: {c: 5, r: 7}, s: {c: 4, r: 7} }, { e: {c: 8, r: 7}, s: {c: 7, r: 7} }, { e: {c: 5, r: 8}, s: {c: 4, r: 8} }, 
                    { e: {c: 8, r: 8}, s: {c: 7, r: 8} }, { e: {c: 5, r: 9}, s: {c: 4, r: 9} }, { e: {c: 8, r: 9}, s: {c: 7, r: 9} }, 
                    { e: {c: 5, r: 10}, s: {c: 4, r: 10} }, { e: {c: 8, r: 10}, s: {c: 7, r: 10} }, { e: {c: 5, r: 11}, s: {c: 4, r: 11} }, 
                    { e: {c: 8, r: 11}, s: {c: 7, r: 11} }, { e: {c: 5, r: 12}, s: {c: 4, r: 12} }, { e: {c: 8, r: 12}, s: {c: 7, r: 12} }, 
                    { e: {c: 5, r: 14}, s: {c: 2, r: 14} }, { e: {c: 11, r: 14}, s: {c: 8, r: 14} }, { e: {c: 5, r: 15}, s: {c: 2, r: 15} }, 
                    { e: {c: 5, r: 16}, s: {c: 2, r: 16} }, { e: {c: 5, r: 17}, s: {c: 2, r: 17} }, { e: {c: 5, r: 18}, s: {c: 2, r: 18} }, 
                    { e: {c: 5, r: 19}, s: {c: 2, r: 19} }, { e: {c: 5, r: 20}, s: {c: 2, r: 20} }, { e: {c: 5, r: 21}, s: {c: 2, r: 21} }, 
                    { e: {c: 5, r: 22}, s: {c: 2, r: 22} }, { e: {c: 5, r: 23}, s: {c: 2, r: 23} }, { e: {c: 5, r: 24}, s: {c: 2, r: 24} }, 
                    { e: {c: 11, r: 26}, s: {c: 7, r: 26} }, { e: {c: 11, r: 26} , s : {c: 7, r: 26} }];
         }

        function BuildStdHeader(Sheets)
        {
            // Header
            Sheets.PCA.A27 = StyleCell( 'SubHeader' , ' ');
            Sheets.PCA.B27 = StyleCell( 'SubHeader' , 'Chapters');
            Sheets.PCA.C27 = StyleCell( 'SubHeader' , 'Designations');
            Sheets.PCA.D27 = StyleCell( 'SubHeader' , 'Directives');
            Sheets.PCA.E27 = StyleCell( 'SubHeader' , 'Status');
            Sheets.PCA.F27 = StyleCell( 'SubHeader' , 'Reports');
            Sheets.PCA.G27 = StyleCell( 'SubHeader' , 'Comments');

            // St Header
            Sheets.PCA.A28 = StyleCell( 'StdHeader' , ' ');
            Sheets.PCA.B28 = StyleCell( 'StdHeader' , 'Standard requirements');
            Sheets.PCA['!merges'].push({ e: {c: 6, r: 27}, s: {c: 1, r: 27} });

            return Sheets;
        }

        function BuildHeaderContent(Sheets , PJSON, Name)
         {
            // Header 1
            Sheets.PCA.D1 = StyleCell( 'Header' , 'Glossary');
            Sheets.PCA.E1 = StyleCell( 'NormalCenter' , 'A');
            Sheets.PCA.F1 = StyleCell( 'NormalCenter' , 'Applicable');

            Sheets.PCA.B2 = StyleCell( 'Normal' , Name);
            Sheets.PCA.E2 = StyleCell( 'NormalCenter' , 'NA');
            Sheets.PCA.F2 = StyleCell( 'NormalCenter' , 'Not Applicable');

            Sheets.PCA.E3 = StyleCell( 'NormalCenter' , 'P');
            Sheets.PCA.F3 = StyleCell( 'NormalCenter' , 'Pass');            

            Sheets.PCA.A4 = StyleCell( 'Header' , '');
            Sheets.PCA.B4 = StyleCell( 'Header' , 'Reference');
            Sheets.PCA.C4 = StyleCell( 'Header' , PJSON.ProductInfo.Reference);
            Sheets.PCA.E4 = StyleCell( 'NormalCenter' , 'F');
            Sheets.PCA.F4 = StyleCell( 'NormalCenter' , 'Fail');

            Sheets.PCA.A5 = StyleCell( 'Header' , '');
            Sheets.PCA.B5 = StyleCell( 'Header' , 'Risk Analysis');
            Sheets.PCA.C5 = StyleCell( 'Header' , PJSON.ProductInfo.RiskAnalysis); 

            // Array 1 
            Sheets.PCA.A7 = StyleCell( 'SubHeader' , ' ');
            Sheets.PCA.B7 = StyleCell( 'SubHeader' , 'Reference');
            Sheets.PCA.C7 = StyleCell( 'SubHeader' , 'Title');
            Sheets.PCA.E7 = StyleCell( 'SubHeader' , 'Date');
            Sheets.PCA.G7 = StyleCell( 'SubHeader' , 'Used');

            Sheets.PCA.B8 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.C8 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.E8 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.G8 = StyleCell( 'Normal' , ' ');

            Sheets.PCA.B9 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.C9 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.E9 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.G9 = StyleCell( 'Normal' , ' ');      

            Sheets.PCA.B10 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.C10 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.E10 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.G10 = StyleCell( 'Normal' , ' ');  

            Sheets.PCA.B11 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.C11 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.E11 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.G11 = StyleCell( 'Normal' , ' ');  

            Sheets.PCA.B12 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.C12 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.E12 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.G12 = StyleCell( 'Normal' , ' ');  

            Sheets.PCA.B13 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.C13 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.E13 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.G13 = StyleCell( 'Normal' , ' ');  

            // Array 2 
            Sheets.PCA.A15 = StyleCell( 'SubHeader' , ' ');
            Sheets.PCA.B15 = StyleCell( 'SubHeader' , 'Version');
            Sheets.PCA.C15 = StyleCell( 'SubHeader' , 'History');
            Sheets.PCA.G15 = StyleCell( 'SubHeader' , 'Build Version');

            Sheets.PCA.B16 = StyleCell( 'Normal' , 'Creation');
            Sheets.PCA.C16 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.E16 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.G16 = StyleCell( 'Normal' , ' ');

            Sheets.PCA.B17 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.C17 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.E17 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.G17 = StyleCell( 'Normal' , ' ');

            Sheets.PCA.B18 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.C18 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.E18 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.G18 = StyleCell( 'Normal' , ' ');

            Sheets.PCA.B19 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.C19 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.E19 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.G19 = StyleCell( 'Normal' , ' ');

            Sheets.PCA.B20 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.C20 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.E20 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.G20 = StyleCell( 'Normal' , ' ');

            Sheets.PCA.B21 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.C21 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.E21 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.G21 = StyleCell( 'Normal' , ' ');

            Sheets.PCA.B22 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.C22 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.E22 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.G22 = StyleCell( 'Normal' , ' ');

            Sheets.PCA.B23 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.C23 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.E23 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.G23 = StyleCell( 'Normal' , ' ');

            Sheets.PCA.B24 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.C24 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.E24 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.G24 = StyleCell( 'Normal' , ' ');

            Sheets.PCA.B25 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.C25 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.E25 = StyleCell( 'Normal' , ' ');
            Sheets.PCA.G25 = StyleCell( 'Normal' , ' ');

            return Sheets;
         }
    }

})();

(function() {
    'use strict';

    angular
        .module('app.documents', [ ]);        
})();
(function() {
    'use strict';

    DocsService.$inject = ["$log", "$q", "$timeout", "documentsAPIService"];
    angular
        .module('app.documents')
        .factory('DocsService', DocsService);

    /* @ngInject */
    function DocsService($log, $q ,$timeout , documentsAPIService ) {
        var service = {
            storedocument: storedocument,
            GeneratedTF: GeneratedTF,
            s2ab: s2ab
        };

        return service;

        function s2ab(s) {
              var buf = new ArrayBuffer(s.length);
              var view = new Uint8Array(buf);
              for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
              return buf;
        }

        function storedocument(doc, name)
         {
            var doc = {
                document : doc,
                name : name
            };

            return Promise.resolve( documentsAPIService.storeDocument(doc)
                               .then(function(doc)
                               {
                                  return Promise.resolve(doc);
                               })
                               .catch(function(error){
                                  return Promise.reject(error);
                               })
                        );
         }

        function GeneratedTF(QS , productName , reports )
        {
            var zip = JSZip();

            zip.file(productName + ".xlsx", QS , {binary: true});

            var reportsF = zip.folder("reports");
            var j = 0;

            for(var i = 0 ; i < reports.length ; i++)
            {
                documentsAPIService.getDocumentbyId(reports[i].id)
                                   .then(function(report){
                                         reportsF.file(report.name, report.document , {binary: true});
                                         j++;
                                         if(j == reports.length)
                                         {
                                            var content = zip.generate({type:"blob"});
                                            saveAs(content, "MARKET-"+ productName + ".zip");                                   
                                         }
                                   }).catch(function(error){
                                         j++;
                                         if(j == reports.length)
                                         {
                                            var content = zip.generate({type:"blob"});
                                            saveAs(content, "MARKET-"+ productName + ".zip");                                   
                                         }
                                   })
            }

	  if(reports.length == 0)
	  {
		var content = zip.generate({type:"blob"});
		saveAs(content, "MARKET-"+ productName + ".zip");
	  }
        }

    }
})();

(function() {
    'use strict';

    documentsAPIService.$inject = ["$http", "API_HGLABS", "$log", "$mdToast", "AuthenticationService", "AuthErrorService", "$state", "$cookies"];
    angular
        .module('app.documents')
        .factory('documentsAPIService', documentsAPIService);

    /* @ngInject */
    function documentsAPIService($http,API_HGLABS, $log, $mdToast, AuthenticationService, AuthErrorService , $state, $cookies) {
        var service = {
            getDocumentbyId: getDocumentbyId,
            storeDocument:storeDocument
        };

        var BaseUrlAPI = API_HGLABS.url + 'documents';

        return service;

 
        function getDocumentbyId(id) {
                return Promise.resolve( AuthenticationService.getAuthToken()
                .then(function (Authentication) {
                    if(Authentication.Authorization == true)
                    {
                    let promise = new Promise(function(resolve, reject){
                        $http({
                            method: 'GET',
                            url:  BaseUrlAPI + '/' +id ,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': Authentication.AuthToken
                            }
                        })
                        .then(function(response) {
                            resolve(response.data);
                        })
                        .catch(function(error) {
                            
                            if(error.status != 404) { 
                                AuthErrorService.httpError(error, "document by id."); 
                                reject('Get File Error.');
                            }
                            else{
                               error.status = 4040;
                               AuthErrorService.httpError(error, "File Not Found.");
                               reject('File Not Found.');
                            }
                        });
                    });
                    return promise;
                    }
                })
              .catch(function(error)
              {
                //AuthErrorService.AuthError(error);
                return Promise.reject(error);
              })
          );
        }

        function storeDocument(document) {
            return Promise.resolve( AuthenticationService.getAuthToken()
                .then(function (Authentication) {
                    if(Authentication.Authorization == true)
                    {
                    let promise = new Promise(function(resolve, reject){
                        $http({
                            method: 'POST',
                            url: BaseUrlAPI,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': Authentication.AuthToken
                            },
                            data: document
                        })
                        .then(function(response) {
                            resolve(response.data);
                        })
                        .catch(function(error) {
                            reject('store document ERROR');
                            AuthErrorService.httpError(error, 'store document.');
                        });
                    });
                    return promise;
                    }
                })
              .catch(function(error)
              {
                AuthErrorService.AuthError(error);
              })
          );
        }

    }

})();

(function() {
    'use strict';

    webfontLoader.$inject = ["$rootScope", "$window"];
    angular
        .module('webfont-loader', [])
        .directive('webfontLoader', webfontLoader);

    /* @ngInject */
    function webfontLoader($rootScope, $window) {
        var directive = {
            link: link
        };
        return directive;

        function link(scope, element, attrs) {
            function onActive() {
                $rootScope.$broadcast('webfontLoader.loaded');
            }

            function onInactive() {
                $rootScope.$broadcast('webfontLoader.error');
            }

            $window.WebFont.load({
                google: {
                    families: [attrs.webfontLoader]
                },
                active: onActive,
                inactive: onInactive
            });
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('app.examples.ui', [
            'ngCookies', 'webfont-loader'
        ])
        .constant('UI_FONTS', [{
            name: 'Roboto Draft',
            family: 'RobotoDraft',
            google: 'RobotoDraft:300,400,500,700,400italic'
        },{
            name: 'Noto Sans',
            family: 'Noto Sans',
            google: 'Noto+Sans:400,700,400italic'
        },{
            name: 'Open Sans',
            family: 'Open Sans',
            google: 'Open+Sans:300,400,500,700,400italic'
        },{
            name: 'Lato',
            family: 'Lato',
            google: 'Lato:300,400,500,700,400italic'
        },{
            name: 'Ubuntu',
            family: 'Ubuntu',
            google: 'Ubuntu:300,400,500,700,400italic'
        },{
            name: 'Source Sans Pro',
            family: 'Source Sans Pro',
            google: 'Source+Sans+Pro:300,400,500,700,400italic'
        }]);
})();
(function() {
    'use strict';

    WeatherIconsController.$inject = ["$mdDialog", "$document"];
    angular
        .module('app.examples.ui')
        .controller('WeatherIconsController', WeatherIconsController);

    /* @ngInject */
    function WeatherIconsController($mdDialog, $document) {
        var vm = this;
        vm.icons = [{
            'className': 'wi wi-day-cloudy-gusts',
            'name': 'Day Cloudy Gusts'
        },{
            'className': 'wi wi-day-cloudy-windy',
            'name': 'Day Cloudy Windy'
        },{
            'className': 'wi wi-day-cloudy',
            'name': 'Day Cloudy'
        },{
            'className': 'wi wi-day-fog',
            'name': 'Day Fog'
        },{
            'className': 'wi wi-day-hail',
            'name': 'Day Hail'
        },{
            'className': 'wi wi-day-lightning',
            'name': 'Day Lightning'
        },{
            'className': 'wi wi-day-rain-mix',
            'name': 'Day Rain Mix'
        },{
            'className': 'wi wi-day-rain-wind',
            'name': 'Day Rain Wind'
        },{
            'className': 'wi wi-day-rain',
            'name': 'Day Rain'
        },{
            'className': 'wi wi-day-showers',
            'name': 'Day Showers'
        },{
            'className': 'wi wi-day-snow',
            'name': 'Day Snow'
        },{
            'className': 'wi wi-day-sprinkle',
            'name': 'Day Sprinkle'
        },{
            'className': 'wi wi-day-sunny-overcast',
            'name': 'Day Sunny Overcast'
        },{
            'className': 'wi wi-day-sunny',
            'name': 'Day Sunny'
        },{
            'className': 'wi wi-day-storm-showers',
            'name': 'Day Storm Showers'
        },{
            'className': 'wi wi-day-thunderstorm',
            'name': 'Day Thunderstorm'
        },{
            'className': 'wi wi-cloudy-gusts',
            'name': 'Cloudy Gusts'
        },{
            'className': 'wi wi-cloudy-windy',
            'name': 'Cloudy Windy'
        },{
            'className': 'wi wi-cloudy',
            'name': 'Cloudy'
        },{
            'className': 'wi wi-fog',
            'name': 'Fog'
        },{
            'className': 'wi wi-hail',
            'name': 'Hail'
        },{
            'className': 'wi wi-lightning',
            'name': 'Lightning'
        },{
            'className': 'wi wi-rain-mix',
            'name': 'Rain Mix'
        },{
            'className': 'wi wi-rain-wind',
            'name': 'Rain Wind'
        },{
            'className': 'wi wi-rain',
            'name': 'Rain'
        },{
            'className': 'wi wi-showers',
            'name': 'Showers'
        },{
            'className': 'wi wi-snow',
            'name': 'Snow'
        },{
            'className': 'wi wi-sprinkle',
            'name': 'Sprinkle'
        },{
            'className': 'wi wi-storm-showers',
            'name': 'Storm Showers'
        },{
            'className': 'wi wi-thunderstorm',
            'name': 'Thunderstorm'
        },{
            'className': 'wi wi-windy',
            'name': 'Windy'
        },{
            'className': 'wi wi-night-alt-cloudy-gusts',
            'name': 'Night Alt Cloudy Gusts'
        },{
            'className': 'wi wi-night-alt-cloudy-windy',
            'name': 'Night Alt Cloudy Windy'
        },{
            'className': 'wi wi-night-alt-hail',
            'name': 'Night Alt Hail'
        },{
            'className': 'wi wi-night-alt-lightning',
            'name': 'Night Alt Lightning'
        },{
            'className': 'wi wi-night-alt-rain-mix',
            'name': 'Night Alt Rain Mix'
        },{
            'className': 'wi wi-night-alt-rain-wind',
            'name': 'Night Alt Rain Wind'
        },{
            'className': 'wi wi-night-alt-rain',
            'name': 'Night Alt Rain'
        },{
            'className': 'wi wi-night-alt-showers',
            'name': 'Night Alt Showers'
        },{
            'className': 'wi wi-night-alt-snow',
            'name': 'Night Alt Snow'
        },{
            'className': 'wi wi-night-alt-sprinkle',
            'name': 'Night Alt Sprinkle'
        },{
            'className': 'wi wi-night-alt-storm-showers',
            'name': 'Night Alt Storm Showers'
        },{
            'className': 'wi wi-night-alt-thunderstorm',
            'name': 'Night Alt Thunderstorm'
        },{
            'className': 'wi wi-night-clear',
            'name': 'Night Clear'
        },{
            'className': 'wi wi-night-cloudy-gusts',
            'name': 'Night Cloudy Gusts'
        },{
            'className': 'wi wi-night-cloudy-windy',
            'name': 'Night Cloudy Windy'
        },{
            'className': 'wi wi-night-cloudy',
            'name': 'Night Cloudy'
        },{
            'className': 'wi wi-night-hail',
            'name': 'Night Hail'
        },{
            'className': 'wi wi-night-lightning',
            'name': 'Night Lightning'
        },{
            'className': 'wi wi-night-rain-mix',
            'name': 'Night Rain Mix'
        },{
            'className': 'wi wi-night-rain-wind',
            'name': 'Night Rain Wind'
        },{
            'className': 'wi wi-night-rain',
            'name': 'Night Rain'
        },{
            'className': 'wi wi-night-showers',
            'name': 'Night Showers'
        },{
            'className': 'wi wi-night-snow',
            'name': 'Night Snow'
        },{
            'className': 'wi wi-night-sprinkle',
            'name': 'Night Sprinkle'
        },{
            'className': 'wi wi-night-storm-showers',
            'name': 'Night Storm Showers'
        },{
            'className': 'wi wi-night-thunderstorm',
            'name': 'Night Thunderstorm'
        },{
            'className': 'wi wi-celsius',
            'name': 'Celsius'
        },{
            'className': 'wi wi-cloud-down',
            'name': 'Cloud Down'
        },{
            'className': 'wi wi-cloud-refresh',
            'name': 'Cloud Refresh'
        },{
            'className': 'wi wi-cloud-up',
            'name': 'Cloud Up'
        },{
            'className': 'wi wi-cloud',
            'name': 'Cloud'
        },{
            'className': 'wi wi-degrees',
            'name': 'Degrees'
        },{
            'className': 'wi wi-down-left',
            'name': 'Down Left'
        },{
            'className': 'wi wi-down',
            'name': 'Down'
        },{
            'className': 'wi wi-fahrenheit',
            'name': 'Fahrenheit'
        },{
            'className': 'wi wi-horizon-alt',
            'name': 'Horizon Alt'
        },{
            'className': 'wi wi-horizon',
            'name': 'Horizon'
        },{
            'className': 'wi wi-left',
            'name': 'Left'
        },{
            'className': 'wi wi-lightning',
            'name': 'Lightning'
        },{
            'className': 'wi wi-night-fog',
            'name': 'Night Fog'
        },{
            'className': 'wi wi-refresh-alt',
            'name': 'Refresh Alt'
        },{
            'className': 'wi wi-refresh',
            'name': 'Refresh'
        },{
            'className': 'wi wi-right',
            'name': 'Right'
        },{
            'className': 'wi wi-sprinkles',
            'name': 'Sprinkles'
        },{
            'className': 'wi wi-strong-wind',
            'name': 'Strong Wind'
        },{
            'className': 'wi wi-sunrise',
            'name': 'Sunrise'
        },{
            'className': 'wi wi-sunset',
            'name': 'Sunset'
        },{
            'className': 'wi wi-thermometer-exterior',
            'name': 'Thermometer Exterior'
        },{
            'className': 'wi wi-thermometer-internal',
            'name': 'Thermometer Internal'
        },{
            'className': 'wi wi-thermometer',
            'name': 'Thermometer'
        },{
            'className': 'wi wi-tornado',
            'name': 'Tornado'
        },{
            'className': 'wi wi-up-right',
            'name': 'Up Right'
        },{
            'className': 'wi wi-up',
            'name': 'Up'
        },{
            'className': 'wi wi-wind-west',
            'name': 'Wind West'
        },{
            'className': 'wi wi-wind-south-west',
            'name': 'Wind South West'
        },{
            'className': 'wi wi-wind-south-east',
            'name': 'Wind South East'
        },{
            'className': 'wi wi-wind-south',
            'name': 'Wind South'
        },{
            'className': 'wi wi-wind-north-west',
            'name': 'Wind North West'
        },{
            'className': 'wi wi-wind-north-east',
            'name': 'Wind North East'
        },{
            'className': 'wi wi-wind-north',
            'name': 'Wind North'
        },{
            'className': 'wi wi-wind-east',
            'name': 'Wind East'
        },{
            'className': 'wi wi-smoke',
            'name': 'Smoke'
        },{
            'className': 'wi wi-dust',
            'name': 'Dust'
        },{
            'className': 'wi wi-snow-wind',
            'name': 'Snow Wind'
        },{
            'className': 'wi wi-day-snow-wind',
            'name': 'Day Snow Wind'
        },{
            'className': 'wi wi-night-snow-wind',
            'name': 'Night Snow Wind'
        },{
            'className': 'wi wi-night-alt-snow-wind',
            'name': 'Night Alt Snow Wind'
        },{
            'className': 'wi wi-day-sleet-storm',
            'name': 'Day Sleet Storm'
        },{
            'className': 'wi wi-night-sleet-storm',
            'name': 'Night Sleet Storm'
        },{
            'className': 'wi wi-night-alt-sleet-storm',
            'name': 'Night Alt Sleet Storm'
        },{
            'className': 'wi wi-day-snow-thunderstorm',
            'name': 'Day Snow Thunderstorm'
        },{
            'className': 'wi wi-night-snow-thunderstorm',
            'name': 'Night Snow Thunderstorm'
        },{
            'className': 'wi wi-night-alt-snow-thunderstorm',
            'name': 'Night Alt Snow Thunderstorm'
        },{
            'className': 'wi wi-solar-eclipse',
            'name': 'Solar Eclipse'
        },{
            'className': 'wi wi-lunar-eclipse',
            'name': 'Lunar Eclipse'
        },{
            'className': 'wi wi-meteor',
            'name': 'Meteor'
        },{
            'className': 'wi wi-hot',
            'name': 'Hot'
        },{
            'className': 'wi wi-hurricane',
            'name': 'Hurricane'
        },{
            'className': 'wi wi-smog',
            'name': 'Smog'
        },{
            'className': 'wi wi-alien',
            'name': 'Alien'
        },{
            'className': 'wi wi-snowflake-cold',
            'name': 'Snowflake Cold'
        },{
            'className': 'wi wi-stars',
            'name': 'Stars'
        },{
            'className': 'wi wi-night-partly-cloudy',
            'name': 'Night Partly Cloudy'
        },{
            'className': 'wi wi-umbrella',
            'name': 'Umbrella'
        },{
            'className': 'wi wi-day-windy',
            'name': 'Day Windy'
        },{
            'className': 'wi wi-night-alt-cloudy',
            'name': 'Night Alt Cloudy'
        },{
            'className': 'wi wi-up-left',
            'name': 'Up Left'
        },{
            'className': 'wi wi-down-right',
            'name': 'Down Right'
        },{
            'className': 'wi wi-time-12',
            'name': 'Time 12'
        },{
            'className': 'wi wi-time-1',
            'name': 'Time 1'
        },{
            'className': 'wi wi-time-2',
            'name': 'Time 2'
        },{
            'className': 'wi wi-time-3',
            'name': 'Time 3'
        },{
            'className': 'wi wi-time-4',
            'name': 'Time 4'
        },{
            'className': 'wi wi-time-5',
            'name': 'Time 5'
        },{
            'className': 'wi wi-time-6',
            'name': 'Time 6'
        },{
            'className': 'wi wi-time-7',
            'name': 'Time 7'
        },{
            'className': 'wi wi-time-8',
            'name': 'Time 8'
        },{
            'className': 'wi wi-time-9',
            'name': 'Time 9'
        },{
            'className': 'wi wi-time-10',
            'name': 'Time 10'
        },{
            'className': 'wi wi-time-11',
            'name': 'Time 11'
        },{
            'className': 'wi wi-day-sleet',
            'name': 'Day Sleet'
        },{
            'className': 'wi wi-night-sleet',
            'name': 'Night Sleet'
        },{
            'className': 'wi wi-night-alt-sleet',
            'name': 'Night Alt Sleet'
        },{
            'className': 'wi wi-sleet',
            'name': 'Sleet'
        },{
            'className': 'wi wi-day-haze',
            'name': 'Day Haze'
        },{
            'className': 'wi wi-beafort-0',
            'name': 'Beafort 0'
        },{
            'className': 'wi wi-beafort-1',
            'name': 'Beafort 1'
        },{
            'className': 'wi wi-beafort-2',
            'name': 'Beafort 2'
        },{
            'className': 'wi wi-beafort-3',
            'name': 'Beafort 3'
        },{
            'className': 'wi wi-beafort-4',
            'name': 'Beafort 4'
        },{
            'className': 'wi wi-beafort-5',
            'name': 'Beafort 5'
        },{
            'className': 'wi wi-beafort-6',
            'name': 'Beafort 6'
        },{
            'className': 'wi wi-beafort-7',
            'name': 'Beafort 7'
        },{
            'className': 'wi wi-beafort-8',
            'name': 'Beafort 8'
        },{
            'className': 'wi wi-beafort-9',
            'name': 'Beafort 9'
        },{
            'className': 'wi wi-beafort-10',
            'name': 'Beafort 10'
        },{
            'className': 'wi wi-beafort-11',
            'name': 'Beafort 11'
        },{
            'className': 'wi wi-beafort-12',
            'name': 'Beafort 12'
        },{
            'className': 'wi wi-wind-default',
            'name': 'Wind Default'
        },{
            'className': 'wi wi-moon-new',
            'name': 'Moon New'
        },{
            'className': 'wi wi-moon-waxing-cresent-1',
            'name': 'Moon Waxing Cresent 1'
        },{
            'className': 'wi wi-moon-waxing-cresent-2',
            'name': 'Moon Waxing Cresent 2'
        },{
            'className': 'wi wi-moon-waxing-cresent-3',
            'name': 'Moon Waxing Cresent 3'
        },{
            'className': 'wi wi-moon-waxing-cresent-4',
            'name': 'Moon Waxing Cresent 4'
        },{
            'className': 'wi wi-moon-waxing-cresent-5',
            'name': 'Moon Waxing Cresent 5'
        },{
            'className': 'wi wi-moon-waxing-cresent-6',
            'name': 'Moon Waxing Cresent 6'
        },{
            'className': 'wi wi-moon-first-quarter',
            'name': 'Moon First Quarter'
        },{
            'className': 'wi wi-moon-waxing-gibbous-1',
            'name': 'Moon Waxing Gibbous 1'
        },{
            'className': 'wi wi-moon-waxing-gibbous-2',
            'name': 'Moon Waxing Gibbous 2'
        },{
            'className': 'wi wi-moon-waxing-gibbous-3',
            'name': 'Moon Waxing Gibbous 3'
        },{
            'className': 'wi wi-moon-waxing-gibbous-4',
            'name': 'Moon Waxing Gibbous 4'
        },{
            'className': 'wi wi-moon-waxing-gibbous-5',
            'name': 'Moon Waxing Gibbous 5'
        },{
            'className': 'wi wi-moon-waxing-gibbous-6',
            'name': 'Moon Waxing Gibbous 6'
        },{
            'className': 'wi wi-moon-full',
            'name': 'Moon Full'
        },{
            'className': 'wi wi-moon-waning-gibbous-1',
            'name': 'Moon Waning Gibbous 1'
        },{
            'className': 'wi wi-moon-waning-gibbous-2',
            'name': 'Moon Waning Gibbous 2'
        },{
            'className': 'wi wi-moon-waning-gibbous-3',
            'name': 'Moon Waning Gibbous 3'
        },{
            'className': 'wi wi-moon-waning-gibbous-4',
            'name': 'Moon Waning Gibbous 4'
        },{
            'className': 'wi wi-moon-waning-gibbous-5',
            'name': 'Moon Waning Gibbous 5'
        },{
            'className': 'wi wi-moon-waning-gibbous-6',
            'name': 'Moon Waning Gibbous 6'
        },{
            'className': 'wi wi-moon-3rd-quarter',
            'name': 'Moon 3rd Quarter'
        },{
            'className': 'wi wi-moon-waning-crescent-1',
            'name': 'Moon Waning Crescent 1'
        },{
            'className': 'wi wi-moon-waning-crescent-2',
            'name': 'Moon Waning Crescent 2'
        },{
            'className': 'wi wi-moon-waning-crescent-3',
            'name': 'Moon Waning Crescent 3'
        },{
            'className': 'wi wi-moon-waning-crescent-4',
            'name': 'Moon Waning Crescent 4'
        },{
            'className': 'wi wi-moon-waning-crescent-5',
            'name': 'Moon Waning Crescent 5'
        },{
            'className': 'wi wi-moon-waning-crescent-6',
            'name': 'Moon Waning Crescent 6'
        }];
        vm.iconSource = 'Select icon below to see HTML';
        vm.selectIcon = selectIcon;

        function selectIcon($event, icon) {
            $mdDialog.show({
                title: '',
                template:
                    '<md-dialog>' +
                    '  <md-toolbar>' +
                    '    <h2 class="md-toolbar-tools">Here\'s the code for that icon</h2>' +
                    '  </md-toolbar>' +
                    '  <md-dialog-content>' +
                    '    <div hljs hljs-language="html"><md-icon md-font-icon="' + icon.className + '"></md-icon></div>' +
                    '  </md-dialog-content>' +
                    '  <md-dialog-actions>' +
                    '    <md-button ng-click="vm.closeDialog()" class="md-primary">' +
                    '      Close' +
                    '    </md-button>' +
                    '  </md-dialog-actions>' +
                    '</md-dialog>',
                targetEvent: $event,
                parent: angular.element($document.body),
                controller: 'IconDialogController',
                controllerAs: 'vm'
            });
        }
    }
})();

(function(jQuery) {
    'use strict';

    moduleRun.$inject = ["TypographySwitcherService"];
    angular
        .module('app.examples.ui')
        .run(moduleRun);

    /* @ngInject */
    function moduleRun(TypographySwitcherService) {
        // load up the webfont loader to allow loading google fonts in the demo
        jQuery.ajax({
            url: '//ajax.googleapis.com/ajax/libs/webfont/1.5.10/webfont.js',
            dataType: 'script',
            async: true,
            success: function() {
                // initialise typography switcher (make sure correct font is loaded if one has been selected)
                TypographySwitcherService.init();
            }
        });
    }
})(jQuery);
(function() {
    'use strict';

    moduleConfig.$inject = ["$stateProvider", "triMenuProvider"];
    angular
        .module('app.examples.ui')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('triangular.ui-typography', {
            url: '/ui/typography',
            controller: 'TypographyController',
            controllerAs: 'vm',
            templateUrl: 'app/examples/ui/typography.tmpl.html'
        })
        .state('triangular.ui-colors', {
            url: '/ui/colors',
            controller: 'ColorsController',
            controllerAs: 'vm',
            templateUrl: 'app/examples/ui/colors.tmpl.html'
        })
        .state('triangular.ui-material-icons', {
            url: '/ui/material-icons',
            controller: 'MaterialIconsController',
            controllerAs: 'vm',
            templateUrl: 'app/examples/ui/material-icons.tmpl.html',
            resolve: {
                icons: ["$http", "API_CONFIG", function($http, API_CONFIG) {
                    return $http({
                        method: 'GET',
                        url: API_CONFIG.url + 'elements/icons'
                    });
                }]
            }
        })
        .state('triangular.ui-weather-icons', {
            url: '/ui/weather-icons',
            controller: 'WeatherIconsController',
            controllerAs: 'vm',
            templateUrl: 'app/examples/ui/weather-icons.tmpl.html'
        })
        .state('triangular.ui-fa-icons', {
            url: '/ui/fa-icons',
            controller: 'FaIconsController',
            controllerAs: 'vm',
            templateUrl: 'app/examples/ui/fa-icons.tmpl.html',
            resolve: {
                icons: ["$http", "API_CONFIG", function($http, API_CONFIG) {
                    return $http({
                        method: 'GET',
                        url: API_CONFIG.url + 'elements/icons-fa'
                    });
                }]
            }
        })

        .state('triangular.ui-toolbar', {
            url: '/ui/toolbars/:extraClass/:background/:shrink',
            controller: 'ToolbarsUIController',
            controllerAs: 'vm',
            templateUrl: 'app/examples/ui/toolbars.tmpl.html'
        })

        .state('triangular.ui-skins', {
            url: '/ui/skins',
            controller: 'SkinsUIController',
            controllerAs: 'vm',
            templateUrl: 'app/examples/ui/skins.tmpl.html'
        });

        triMenuProvider.addMenu({
            name: 'UI',
            icon: 'zmdi zmdi-ruler',
            type: 'dropdown',
            priority: 3.2,
            children: [{
                name: 'Colors',
                state: 'triangular.ui-colors',
                type: 'link'
            },{
                name: 'Font Awesome',
                state: 'triangular.ui-fa-icons',
                type: 'link'
            },{
                name: 'Material Icons',
                state: 'triangular.ui-material-icons',
                type: 'link'
            },{
                name: 'Skins',
                state: 'triangular.ui-skins',
                type: 'link'
            },{
                name: 'Typography',
                state: 'triangular.ui-typography',
                type: 'link'
            },{
                name: 'Weather Icons',
                state: 'triangular.ui-weather-icons',
                type: 'link'
            }]
        });
    }
})();

(function() {
    'use strict';

    TypographyController.$inject = ["TypographySwitcherService", "UI_FONTS"];
    angular
        .module('app.examples.ui')
        .controller('TypographyController', TypographyController);

    /* @ngInject */
    function TypographyController(TypographySwitcherService, UI_FONTS) {
        var vm = this;
        vm.fonts = UI_FONTS;
        vm.changeFont = changeFont;
        vm.currentFont = TypographySwitcherService.getCurrentFont();

        //////////////////

        function changeFont() {
            TypographySwitcherService.changeFont(vm.currentFont);
        }

        // init

        angular.forEach(vm.fonts, function(font) {
            if(vm.currentFont.name === font.name) {
                vm.currentFont = font;
            }
        });
    }
})();
(function() {
    'use strict';

    TypographySwitcher.$inject = ["$window", "$cookies", "$log", "UI_FONTS"];
    angular
        .module('app.examples.ui')
        .factory('TypographySwitcherService', TypographySwitcher);

    /* @ngInject */
    function TypographySwitcher($window, $cookies, $log, UI_FONTS) {
        return {
            changeFont: changeFont,
            getCurrentFont: getCurrentFont,
            init: init
        };

        //////////////////

        function init() {
            // if we arent using the default font then change it
            var currentFont = getCurrentFont();
            if(currentFont.name !== 'Roboto Draft') {
                changeFont(currentFont);
            }
        }

        function getCurrentFont() {
            // if we have no current font set, set it to first font (Roboto)
            var fontCookie = $cookies.get('tri-typography-font');
            if(angular.isUndefined(fontCookie)) {
                $cookies.put('tri-typography-font', angular.toJson(UI_FONTS[0]));
            }

            return angular.fromJson($cookies.get('tri-typography-font'));
        }

        function changeFont(font) {
            $window.WebFont.load({
                google: {
                    families: [font.google]
                },
                active: function() {
                    angular.element('button,select,html,textarea,input').css({'font-family': font.family});
                    $cookies.put('tri-typography-font', angular.toJson(font));
                },
                inactive: function() {
                    $log.error('Font ' + font.name + ' could not be loaded');
                }
            });
        }
    }
})();

(function() {
    'use strict';

    SkinsUIController.$inject = ["$cookies", "$window", "triSkins", "triTheming"];
    angular
        .module('app.examples.ui')
        .controller('SkinsUIController', SkinsUIController);

    /* @ngInject */
    function SkinsUIController($cookies, $window, triSkins, triTheming) {
        var vm = this;
        vm.elementColors = {
            logo: '',
            sidebar: '',
            content: '',
            toolbar: ''
        };
        vm.skins = triSkins.getSkins();
        vm.selectedSkin = triSkins.getCurrent();
        vm.trySkin = trySkin;
        vm.updatePreview = updatePreview;

        //////////////////////

        function trySkin() {
            if(vm.selectedSkin !== triSkins.getCurrent()) {
                $cookies.put('triangular-skin',angular.toJson({
                    skin: vm.selectedSkin.id
                }));
                $window.location.reload();
            }
        }


        function updatePreview() {
            for(var element in vm.elementColors) {
                var theme = triTheming.getTheme(vm.selectedSkin.elements[element]);
                var hue = angular.isUndefined(theme.colors.primary.hues.default) ? '500' : theme.colors.primary.hues.default;
                var color = triTheming.getPaletteColor(theme.colors.primary.name, hue);
                vm.elementColors[element] = triTheming.rgba(color.value);
            }
        }

        // init

        updatePreview();
    }
})();
(function() {
    'use strict';

    MaterialIconsController.$inject = ["$mdDialog", "$document", "$compile", "$scope", "icons"];
    angular
        .module('app.examples.ui')
        .controller('MaterialIconsController', MaterialIconsController);

    /* @ngInject */
    function MaterialIconsController($mdDialog, $document, $compile, $scope, icons) {
        var vm = this;
        vm.groups = [];
        vm.icons = [];
        vm.iconSource = 'Select icon below to see HTML';
        vm.selectIcon = selectIcon;
        vm.icons = icons.data;

        function selectIcon($event, className) {
            $mdDialog.show({
                title: '',
                template:
                    '<md-dialog>' +
                    '  <md-toolbar>' +
                    '    <h2 class="md-toolbar-tools">Here\'s the code for that icon</h2>' +
                    '  </md-toolbar>' +
                    '  <md-dialog-content>' +
                    '    <div hljs hljs-language="html"><md-icon md-font-icon="' + className + '"></md-icon></div>' +
                    '  </md-dialog-content>' +
                    '  <md-dialog-actions>' +
                    '    <md-button ng-click="vm.closeDialog()" class="md-primary">' +
                    '      Close' +
                    '    </md-button>' +
                    '  </md-dialog-actions>' +
                    '</md-dialog>',
                targetEvent: $event,
                parent: angular.element($document.body),
                controller: 'IconDialogController',
                controllerAs: 'vm'
            });
        }
    }
})();

(function() {
    'use strict';

    IconDialogController.$inject = ["$mdDialog"];
    angular
        .module('app.examples.ui')
        .controller('IconDialogController', IconDialogController);

    /* @ngInject */
    function IconDialogController($mdDialog) {
        var vm = this;
        vm.closeDialog = closeDialog;

        function closeDialog() {
            $mdDialog.hide();
        }
    }
})();

(function() {
    'use strict';

    FaIconsController.$inject = ["$mdDialog", "$document", "$scope", "$compile", "icons"];
    angular
        .module('app.examples.ui')
        .controller('FaIconsController', FaIconsController);

    /* @ngInject */
    function FaIconsController($mdDialog, $document, $scope, $compile, icons) {
        var vm = this;
        vm.icons = loadIcons();
        vm.iconSource = 'Select icon below to see HTML';
        vm.selectIcon = selectIcon;

        function loadIcons() {
            var allIcons = [];
            for(var className in icons.data) {
                allIcons.push({
                    className: className,
                    name: icons.data[className]
                });
            }
            return allIcons;
        }

        function selectIcon($event, icon) {
            $mdDialog.show({
                title: '',
                template:
                    '<md-dialog>' +
                    '  <md-toolbar>' +
                    '    <h2 class="md-toolbar-tools">Here\'s the code for that icon</h2>' +
                    '  </md-toolbar>' +
                    '  <md-dialog-content>' +
                    '    <div hljs hljs-language="html"><md-icon md-font-icon="' + icon.className + '"></md-icon></div>' +
                    '  </md-dialog-content>' +
                    '  <md-dialog-actions>' +
                    '    <md-button ng-click="vm.closeDialog()" class="md-primary">' +
                    '      Close' +
                    '    </md-button>' +
                    '  </md-dialog-actions>' +
                    '</md-dialog>',
                targetEvent: $event,
                parent: angular.element($document.body),
                controller: 'IconDialogController',
                controllerAs: 'vm'
            });
        }
    }
})();

(function() {
    'use strict';

    ColorsController.$inject = ["$mdDialog", "triTheming"];
    angular
        .module('app.examples.ui')
        .controller('ColorsController', ColorsController);

    /* @ngInject */
    function ColorsController($mdDialog, triTheming) {
        var vm = this;
        vm.colourRGBA = colourRGBA;
        vm.palettes = triTheming.palettes;
        vm.selectPalette = selectPalette;

        function colourRGBA(value) {
            var rgba = triTheming.rgba(value);
            return {
                'background-color': rgba
            };
        }

        function selectPalette($event, name, palette) {
            $mdDialog.show({
                controller: 'ColorDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/examples/ui/color-dialog.tmpl.html',
                targetEvent: $event,
                locals: {
                    name: name,
                    palette: palette
                },
                clickOutsideToClose: true
            })
            .then(function(answer) {
                vm.alert = 'You said the information was "' + answer + '".';
            }, cancelDialog);

            function cancelDialog() {
                vm.alert = 'You cancelled the dialog.';
            }
        }
    }
})();
(function() {
    'use strict';

    ColorDialogController.$inject = ["$scope", "name", "palette", "triTheming"];
    angular
        .module('app.examples.ui')
        .controller('ColorDialogController', ColorDialogController);

    /* @ngInject */
    function ColorDialogController($scope, name, palette, triTheming) {
        var vm = this;
        vm.itemStyle = itemStyle;
        vm.name = name;
        vm.palette = [];

        ///////////

        function itemStyle(palette) {
            return {
                'background-color': triTheming.rgba(palette.value),
                'color': triTheming.rgba(palette.contrast)
            };
        }

        // init

        for(var code in palette) {
            vm.palette.push({
                code: code,
                palette: palette[code]
            });
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('app.examples.todo', [

        ]);
})();
(function() {
    'use strict';

    runFunction.$inject = ["TodoService"];
    angular
        .module('app.examples.todo')
        .run(runFunction);

    /* @ngInject */
    function runFunction(TodoService) {
        // Update todo badge when app first runs.

        TodoService.updateMenuBadge();
    }
})();

(function() {
    'use strict';

    TodoService.$inject = ["triMenu"];
    angular
        .module('app.examples.todo')
        .factory('TodoService', TodoService);


    /* @ngInject */
    function TodoService(triMenu) {
        var todos = [
            {description: 'Material Design', priority: 'high', selected: true},
            {description: 'Install espresso machine', priority: 'high', selected: false},
            {description: 'Deploy to Server', priority: 'medium', selected: true},
            {description: 'Cloud Sync', priority: 'medium', selected: false},
            {description: 'Test Configurations', priority: 'low', selected: false},
            {description: 'Validate markup', priority: 'low', selected: false},
            {description: 'Debug javascript', priority: 'low', selected: true},
            {description: 'Arrange meeting', priority: 'low', selected: true}
        ];
        var todoMenu = triMenu.getMenu('todo');

        var service = {
            addTodo: addTodo,
            getTodos: getTodos,
            removeTodo: removeTodo,
            todoCount: todoCount,
            updateMenuBadge: updateMenuBadge
        };
        return service;

        ////////////////

        function addTodo(todo) {
            todos.push(todo);
            updateMenuBadge();
        }

        function getTodos() {
            return todos;
        }

        function removeTodo(todo) {
            for(var i = todos.length - 1; i >= 0; i--) {
                if(todos[i] === todo) {
                    todos.splice(i, 1);
                }
            }
            updateMenuBadge();
        }

        function todoCount() {
            var count = 0;
            for(var i = todos.length - 1; i >= 0; i--) {
                if(todos[i].selected === false) {
                    count++;
                }
            }
            return count;
        }

        function updateMenuBadge() {
            todoMenu.badge = todoCount();
        }
    }
})();
(function() {
    'use strict';

    TodoController.$inject = ["$scope", "$state", "$mdDialog", "TodoService"];
    angular
        .module('app.examples.todo')
        .controller('TodoController', TodoController);

    /* @ngInject */
    function TodoController($scope, $state, $mdDialog, TodoService) {
        var vm = this;

        vm.orderTodos = orderTodos;
        vm.removeTodo = removeTodo;
        vm.todoSelected = todoSelected;

        //////////////////////////

        function init() {
            vm.todos = TodoService.getTodos();
            TodoService.updateMenuBadge();
        }

        function orderTodos(task) {
            switch(task.priority){
                case 'high':
                    return 1;
                case 'medium':
                    return 2;
                case 'low':
                    return 3;
                default: // no priority set
                    return 4;
            }
        }

        function removeTodo(todo){
            TodoService.removeTodo(todo);
        }

        function todoSelected() {
            TodoService.updateMenuBadge();
        }

        // init

        init();

        // watches

        $scope.$on('addTodo', function( ev ){
            $mdDialog.show({
                templateUrl: 'app/examples/todo/add-todo-dialog.tmpl.html',
                targetEvent: ev,
                controller: 'DialogController',
                controllerAs: 'vm'
            })
            .then(function(newTodo) {
                TodoService.addTodo(newTodo);
            });
        });
    }
})();
(function() {
    'use strict';

    moduleConfig.$inject = ["$stateProvider", "triMenuProvider"];
    angular
        .module('app.examples.todo')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('triangular.todo', {
            url: '/todo',
            views: {
                '': {
                    templateUrl: 'app/examples/todo/todo.tmpl.html',
                    controller: 'TodoController',
                    controllerAs: 'vm'
                },
                'belowContent': {
                    templateUrl: 'app/examples/todo/fab-button.tmpl.html',
                    controller: 'TodoFabController',
                    controllerAs: 'vm'
                }
            },
            data: {
                layout: {
                    contentClass: 'layout-column full-image-background mb-bg-fb-08 background-overlay-static',
                    innerContentClass: 'overlay-gradient-20'
                },
                permissions: {
                    only: ['viewTodo']
                }
            }
        });

        triMenuProvider.addMenu({
            id: 'todo',
            name: 'To do',
            icon: 'zmdi zmdi-check',
            state: 'triangular.todo',
            type: 'link',
            permission: 'viewTodo',
            badge: '',
            priority: 2.4
        });
    }
})();

(function() {
    'use strict';

    TodoFabController.$inject = ["$rootScope"];
    angular
        .module('app.examples.todo')
        .controller('TodoFabController', TodoFabController);

    /* @ngInject */
    function TodoFabController($rootScope) {
        var vm = this;
        vm.addTodo = addTodo;

        ////////////////

        function addTodo($event) {
            $rootScope.$broadcast('addTodo', $event);
        }
    }
})();
(function() {
    'use strict';

    DialogController.$inject = ["$state", "$mdDialog"];
    angular
        .module('app.examples.todo')
        .controller('DialogController', DialogController);

    /* @ngInject */
    function DialogController($state, $mdDialog) {
        var vm = this;
        vm.cancel = cancel;
        vm.hide = hide;
        vm.item = {
            description: '',
            priority: '',
            selected: false
        };

        /////////////////////////

        function hide() {
            $mdDialog.hide(vm.item);
        }

        function cancel() {
            $mdDialog.cancel();
        }
    }
})();
(function() {
    'use strict';

    moduleConfig.$inject = ["$stateProvider", "triMenuProvider"];
    angular
        .module('app.examples.menu')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('triangular.menu-levels', {
            url: '/menu-levels/:level',
            controller: 'LevelController',
            controllerAs: 'vm',
            templateUrl: 'app/examples/menu/level.tmpl.html',
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.menu-dynamic', {
            url: '/menu/dynamic',
            controller: 'MenuDynamicController',
            controllerAs: 'vm',
            templateUrl: 'app/examples/menu/dynamic.tmpl.html',
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.menu-dynamic-dummy-page', {
            url: '/menu/dynamic-page',
            templateUrl: 'app/examples/menu/dynamic-page.tmpl.html',
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        });

        triMenuProvider.addMenu({
            name: 'Menu',
            icon: 'zmdi zmdi-receipt',
            type: 'dropdown',
            priority: 6.1,
            children: [{
                name: 'Dynamic Menu',
                type: 'link',
                state: 'triangular.menu-dynamic'
            },{
                name: 'On Click Menu',
                type: 'link',
                click: ['$mdDialog', function($mdDialog) {
                    $mdDialog.show(
                        $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('Menu Item Clicked')
                        .htmlContent('You can now set menu item click events when you configure your menu as well as routes!.  See <code>app/examples/menu/menu.config.js</code> to learn how.')
                        .ok('Got it Thanks.')
                    );
                }]
            },{
                name: 'Open in new tab',
                type: 'link',
                state: 'triangular.dashboard-general',
                openInNewTab: true
            },{
                name: 'Unlimited Levels',
                type: 'dropdown',
                children: [{
                    name: 'Level 2-1',
                    type: 'dropdown',
                    children: [{
                        name: 'Level 3-1',
                        type: 'dropdown',
                        children: [{
                            name: 'Level 4-1',
                            type: 'link',
                            state: 'triangular.menu-levels',
                            params: {
                                level: 'Item1-1-1-1'
                            }
                        },{
                            name: 'Level 4-2',
                            type: 'link',
                            state: 'triangular.menu-levels',
                            params: {
                                level: 'Item1-1-1-2'
                            }
                        },{
                            name: 'Level 4-3',
                            type: 'link',
                            state: 'triangular.menu-levels',
                            params: {
                                level: 'Item1-1-1-3'
                            }
                        }]
                    }]
                }]
            }]
        });
    }
})();

(function() {
    'use strict';

    LevelController.$inject = ["$stateParams"];
    angular
        .module('app.examples.menu')
        .controller('LevelController', LevelController);

    /* @ngInject */
    function LevelController($stateParams) {
        var vm = this;
        vm.level = $stateParams.level;
    }
})();

(function() {
    'use strict';

    angular
        .module('app.examples.menu')
        .factory('dynamicMenuService', dynamicMenuService);

    /* @ngInject */
    function dynamicMenuService() {
        return {
            dynamicMenu: {
                showDynamicMenu: false
            }
        };
    }
})();

(function() {
    'use strict';

    moduleConfig.$inject = ["$stateProvider", "uiGmapGoogleMapApiProvider", "triMenuProvider"];
    angular
        .module('app.examples.maps')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, uiGmapGoogleMapApiProvider, triMenuProvider) {

        $stateProvider
        .state('triangular.maps-fullwidth', {
            url: '/maps/fullwidth',
            templateUrl: 'app/examples/maps/maps-fullwidth.tmpl.html',
            controller: 'MapController',
            controllerAs: 'vm',
            data: {
                permissions: {
                    only: ['viewMaps']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.maps-demos', {
            url: '/maps/demos',
            templateUrl: 'app/examples/maps/maps-demo.tmpl.html',
            data: {
                permissions: {
                    only: ['viewMaps']
                }
            }
        });

        uiGmapGoogleMapApiProvider.configure({
            v: '3.17',
            libraries: 'weather,geometry,visualization'
        });

        triMenuProvider.addMenu({
            name: 'Maps',
            icon: 'zmdi zmdi-pin',
            type: 'dropdown',
            priority: 7.1,
            permission: 'viewMaps',
            children: [{
                name: 'Fullwidth',
                state: 'triangular.maps-fullwidth',
                type: 'link'
            },{
                name: 'Demos',
                state: 'triangular.maps-demos',
                type: 'link'
            }]
        });
    }
})();

(function() {
    'use strict';

    MapController.$inject = ["uiGmapGoogleMapApi"];
    angular
        .module('app.examples.maps')
        .controller('MapController', MapController);

    /* @ngInject */
    function MapController(uiGmapGoogleMapApi) {
        var vm = this;

        uiGmapGoogleMapApi.then(function(maps) {
            vm.map = {
                center: {
                    latitude: 35.027469,
                    longitude: -111.022753
                },
                zoom: 4,
                marker: {
                    id:0,
                    coords: {
                        latitude: 35.027469,
                        longitude: -111.022753
                    },
                    options: {
                        icon: {
                            anchor: new maps.Point(36,36),
                            origin: new maps.Point(0,0),
                            url: 'assets/images/maps/blue_marker.png'
                        }
                    }
                }
            };
        });
    }
})();
(function() {
    'use strict';

    angular
        .module('app.examples.layouts', [

        ]);
})();
(function() {
    'use strict';

    moduleConfig.$inject = ["$stateProvider", "triMenuProvider"];
    angular
        .module('app.examples.layouts')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('triangular.standard-page',  {
            url: '/layouts/standard-page',
            templateUrl: 'app/examples/layouts/standard-page.tmpl.html',
            data: {
                layout: {
                    contentClass: 'layout-column'
                },
                permissions: {
                    only: ['viewLayouts']
                }
            }
        })
        .state('triangular.no-scroll-page',  {
            url: '/layouts/no-scroll-page',
            templateUrl: 'app/examples/layouts/no-scroll-page.tmpl.html',
            data: {
                layout: {
                    contentClass: 'triangular-non-scrolling'
                },
                permissions: {
                    only: ['viewLayouts']
                }
            }
        })
        .state('triangular.layouts-composer', {
            url: '/layouts/composer',
            templateUrl: 'app/examples/layouts/composer.tmpl.html',
            controller: 'LayoutsComposerController',
            controllerAs: 'vm',
            data: {
                permissions: {
                    only: ['viewLayouts']
                }
            }
        })
        .state('triangular.layouts-example-full-width', {
            url: '/layouts/full-width',
            templateUrl: 'app/examples/dashboards/general/dashboard-general.tmpl.html',
            data: {
                layout: {
                    sideMenuSize: 'hidden'
                },
                permissions: {
                    only: ['viewLayouts']
                }
            }
        })
        .state('triangular.layouts-example-tall-toolbar', {
            url: '/layouts/tall-toolbar',
            templateUrl: 'app/examples/dashboards/server/dashboard-server.tmpl.html',
            controller: 'DashboardServerController',
            controllerAs: 'vm',
            data: {
                layout: {
                    toolbarSize: 'md-tall',
                    toolbarClass: 'md-warn'
                },
                permissions: {
                    only: ['viewLayouts']
                }
            }
        })
        .state('triangular.layouts-example-icon-menu', {
            url: '/layouts/icon-menu',
            templateUrl: 'app/examples/dashboards/general/dashboard-general.tmpl.html',
            data: {
                layout: {
                    sideMenuSize: 'icon'
                },
                permissions: {
                    only: ['viewLayouts']
                }
            }
        });

        triMenuProvider.addMenu({
            name: 'Layouts',
            icon: 'zmdi zmdi-view-module',
            type: 'dropdown',
            priority: 2.4,
            permission: 'viewLayouts',
            children: [{
                name: 'Standard Page',
                type: 'link',
                state: 'triangular.standard-page'
            },{
                name: 'Non Scrolling Page',
                type: 'link',
                state: 'triangular.no-scroll-page'
            },{
                name: 'Full Width Layout',
                type: 'link',
                state: 'triangular.layouts-example-full-width'
            },{
                name: 'Icon Menu',
                type: 'link',
                state: 'triangular.layouts-example-icon-menu'
            },{
                name: 'Tall Toolbar with background',
                type: 'link',
                state: 'triangular.layouts-example-tall-toolbar'
            },{
                name: 'Composer',
                type: 'link',
                state: 'triangular.layouts-composer'
            }]
        });
    }
})();

(function() {
    'use strict';

    LayoutsComposerController.$inject = ["$rootScope", "$filter", "$document", "triTheming", "triLayout"];
    angular
        .module('app.examples.layouts')
        .controller('LayoutsComposerController', LayoutsComposerController);

    /* @ngInject */
    function LayoutsComposerController($rootScope, $filter, $document, triTheming, triLayout) {
        var vm = this;
        vm.allPagesCode = '';
        vm.updateOption = updateOption;
        vm.layout = triLayout.layout;
        vm.onePageCode = '';
        vm.options = {
            toolbarSizes: {
                'default': 'Default',
                'md-medium-tall': 'Medium',
                'md-tall': 'Tall'
            },
            toolbarBackgrounds: {
            },
            sideMenuSizes: {
                'off': 'Off',
                'hidden': 'Hidden',
                'icon': 'Icons',
                'full': 'Full Size'
            }
        };

        ////////////////

        function createCodeSnippets() {
            vm.allPagesCode =
                'triLayoutProvider.setDefaultOption(\'toolbarSize\', \'' + vm.layout.toolbarSize + '\');\n' +
                'triLayoutProvider.setDefaultOption(\'toolbarShrink\', ' + vm.layout.toolbarShrink + ');\n' +
                'triLayoutProvider.setDefaultOption(\'toolbarClass\', \'' + vm.layout.toolbarClass + '\');\n' +
                'triLayoutProvider.setDefaultOption(\'contentClass\', \'' + vm.layout.contentClass + '\');\n' +
                'triLayoutProvider.setDefaultOption(\'sideMenuSize\', \'' + vm.layout.sideMenuSize + '\');\n' +
                'triLayoutProvider.setDefaultOption(\'footer\', ' + vm.layout.footer + ');\n';

            vm.onePageCode =
                '.state(\'triangular.my-state\', {' + '\n' +
                '    // set the url of this page' + '\n' +
                '    url: \'/my-route\',' + '\n' +
                '    // set the html template to show on this page' + '\n' +
                '    templateUrl: \'app/examples/my-module/my-page.tmpl.html\',' + '\n' +
                '    // set the controller to load for this page' + '\n' +
                '    controller: \'MyController\',' + '\n' +
                '    controllerAs: \'vm\'' + '\n' +
                '    data: {' + '\n' +
                '        layout: {' + '\n' +
                '            toolbarSize: \'' + vm.layout.toolbarSize + '\',' + '\n' +
                '            toolbarShrink: ' + vm.layout.toolbarShrink + ',' + '\n' +
                '            toolbarClass: \'' + vm.layout.toolbarClass + '\',' + '\n' +
                '            contentClass: \'' + vm.layout.contentClass + '\',' + '\n' +
                '            sideMenuSize: \'' + vm.layout.sideMenuSize + '\',' + '\n' +
                '            footer: ' + vm.layout.footer + '\n' +
                '        }' + '\n' +
                '    }' + '\n' +
                '});';
        }

        function updateOption(optionName) {
            switch(optionName) {
                case 'footer':
                    var style = vm.layout.footer ? 'block' : 'none';
                    $document[0].getElementById('footer').style.display = style;
                    break;
                case 'toolbarShrink':
                    // update toolbar shrink
                    // needs some work
                    var mdContent = angular.element('#admin-panel md-content');
                    $rootScope.$broadcast('$mdContentLoaded', angular.element(mdContent[0]));
                    break;
            }
            // update the snippets
            createCodeSnippets();
        }

        function createBackgroundOptions() {
            vm.options.toolbarBackgrounds['none'] = 'No Background ';
            var x, paddedNumber;
            for(x = 1; x < 40 ; x++) {
                paddedNumber = $filter('padding')(x, 2);
                vm.options.toolbarBackgrounds['full-image-background mb-bg-' + paddedNumber] = 'Background ' + x;
            }
            for(x = 1; x < 30 ; x++) {
                paddedNumber = $filter('padding')(x, 2);
                vm.options.toolbarBackgrounds['full-image-background mb-bg-fb-' + paddedNumber] = 'Extra Background ' + x;
            }
        }

        // init
        createBackgroundOptions();
        createCodeSnippets();
    }
})();
(function() {
    'use strict';

    angular
        .module('app.examples.github', [
        ]);
})();
(function() {
    'use strict';

    GithubController.$inject = ["$http", "$mdToast", "triLoaderService"];
    angular
        .module('app.examples.github')
        .controller('GithubController', GithubController);

    /* @ngInject */
    function GithubController($http, $mdToast, triLoaderService) {
        var oxygennaAPIUrl = 'http://api.oxygenna.com';
        var vm = this;
        vm.data = {
            id: '11711437',
            purchaseCode: '',
            githubUser: ''
        };
        vm.register = register;
        vm.userSearch = userSearch;

        clearForm();

        ////////////////

        function register() {
            triLoaderService.setLoaderActive(true);

            $http.put(oxygennaAPIUrl + '/register-github-access', vm.data).
            then(function() {
                // everything went ok
                triLoaderService.setLoaderActive(false);
                popAToast('Success!  Check your GitHub email for your invite.');
            }, registerError);

            function registerError(response) {
                // something went wrong
                triLoaderService.setLoaderActive(false);
                if(angular.isDefined(response.data.error)) {
                    popAToast(response.data.error);
                }
            }
        }

        function userSearch (query) {
            return $http.get('https://api.github.com/search/users?q=' + query + '+type:user+in:login').
            then(function(response) {
                // get the items
                return response.data.items;
            });
        }

        function clearForm() {
            vm.data.purchaseCode = '';
            vm.data.githubUser = '';
        }

        function popAToast(message) {
            var toast = $mdToast.simple({
                hideDelay: false
            })
            .content(message)
            .action('OK')
            .highlightAction(false)
            .position('bottom right');

            return $mdToast.show(toast);
        }

    }
})();
(function() {
    'use strict';

    config.$inject = ["$stateProvider", "triMenuProvider"];
    angular
        .module('app.examples.github')
        .config(config);

    /* @ngInject */
    function config($stateProvider, triMenuProvider) {
        $stateProvider
        .state('triangular.github', {
            url: '/github',
            templateUrl: 'app/examples/github/github.tmpl.html',
            controller: 'GithubController',
            controllerAs: 'vm',
            data: {
                layout: {
                    contentClass: 'layout-column full-image-background mb-bg-fb-16 background-overlay-static',
                    innerContentClass: 'overlay-gradient-20'
                },
                permissions: {
                    only: ['viewGitHub']
                }
            }
        });

        triMenuProvider.addMenu({
            name: 'GitHub',
            state: 'triangular.github',
            type: 'link',
            icon: 'fa fa-github',
            priority: 2.2,
            permission: 'viewGitHub'
        });
    }
})();

(function() {
    'use strict';

    moduleConfig.$inject = ["$stateProvider", "triMenuProvider"];
    angular
        .module('app.examples.forms')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('triangular.forms-inputs', {
            url: '/forms/inputs',
            templateUrl: 'app/examples/forms/inputs.tmpl.html',
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.forms-binding', {
            url: '/forms/binding',
            templateUrl: 'app/examples/forms/binding.tmpl.html',
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.forms-autocomplete', {
            url: '/forms/autocomplete',
            templateUrl: 'app/examples/forms/autocomplete.tmpl.html',
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.forms-wizard', {
            url: '/forms/wizard',
            templateUrl: 'app/examples/forms/wizard.tmpl.html',
            controller: 'FormWizardController',
            controllerAs: 'wizardController',
            data: {
                layout: {
                    contentClass: 'layout-column full-image-background mb-bg-fb-02 background-overlay-static',
                    innerContentClass: 'overlay-gradient-20'
                }
            }
        })
        .state('triangular.forms-validation', {
            url: '/forms/validation',
            templateUrl: 'app/examples/forms/validation.tmpl.html',
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        });

        triMenuProvider.addMenu({
            name: 'Forms',
            icon: 'zmdi zmdi-calendar-check',
            type: 'dropdown',
            priority: 3.3,
            children: [{
                name: 'Autocomplete',
                type: 'link',
                state: 'triangular.forms-autocomplete'
            },{
                name: 'Data Binding',
                type: 'link',
                state: 'triangular.forms-binding'
            },{
                name: 'Inputs',
                type: 'link',
                state: 'triangular.forms-inputs'
            },{
                name: 'Wizard',
                type: 'link',
                state: 'triangular.forms-wizard'
            },{
                name: 'Validation',
                type: 'link',
                state: 'triangular.forms-validation'
            }]
        });
        triMenuProvider.addMenu({
            type: 'divider',
            priority: 3.4
        });
    }
})();

(function() {
    'use strict';

    angular
        .module('app.examples.forms')
        .controller('FormWizardController', FormWizardController);

    /* @ngInject */
    function FormWizardController() {
        var vm = this;
        vm.data = {
            account: {
                username: 'Oxygenna'
            }
        };
    }
})();
(function() {
    'use strict';

    angular
        .module('app.examples.extras', [

        ]);
})();
(function() {
    'use strict';

    angular
        .module('app.examples.extras')
        .controller('TimelineController', TimelineController);

    /* @ngInject */
    function TimelineController() {
        var vm = this;
        vm.events = [{
            title: 'Material Design',
            subtitle: 'We challenged ourselves to create a visual language for our users that synthesizes the classic principles of good design with the innovation and possibility of technology and science.',
            date:'27/6/2015',
            image: 'assets/images/avatars/hair-black-eyes-blue-green-skin-tanned.png',
            content: '<img src="assets/images/backgrounds/material-backgrounds/mb-bg-01.jpg"/>',
            palette: ''
        },{
            title: 'Dorothy Lewis',
            subtitle: 'Design Magazine',
            date:'27/6/2015',
            image: 'assets/images/avatars/hair-black-eyes-brown-skin-tanned.png',
            content: '<p class="padding-10 font-size-3 font-weight-200 line-height-big">This spec is a living document that will be updated as we continue to develop the tenets and specifics of material design.</p>',
            palette: 'cyan:500'
        },{
            title: 'Goals',
            subtitle: 'Create a visual language that synthesizes classic principles of good design with the innovation and possibility of technology and science.',
            date:'26/6/2015',
            image: 'assets/images/avatars/hair-blonde-eyes-brown-skin-light.png',
            content: '<img src="assets/images/backgrounds/material-backgrounds/mb-bg-02.jpg"/>',
            palette: 'cyan:500',
            classes: 'widget-overlay-title'
        },{
            title: 'Principles',
            subtitle: 'A material metaphor is the unifying theory of a rationalized space and a system of motion. ',
            date:'24/6/2015',
            image: 'assets/images/avatars/hair-black-eyes-dark-skin-dark.png',
            content: '<img src="assets/images/backgrounds/material-backgrounds/mb-bg-03.jpg"/>'
        },{
            title: 'Joe Ross',
            subtitle: 'CEO Google',
            date:'23/6/2015',
            image: 'assets/images/avatars/hair-blonde-eyes-blue-green-skin-light.png',
            content: '<p class="padding-10 font-size-3 font-weight-200 line-height-big">Surfaces and edges of the material provide visual cues that are grounded in reality. The use of familiar tactile attributes helps users quickly understand affordances.</p> ',
            palette: 'purple:500'
        },{
            title: 'Sam Ross',
            subtitle: 'CEO Facebook',
            date:'23/6/2015',
            image: 'assets/images/avatars/hair-blonde-eyes-blue-green-skin-light.png',
            content: '<p class="padding-10 font-size-3 font-weight-200 line-height-big">The color palette starts with primary colors and fills in the spectrum to create a complete and usable palette for Android, Web, and iOS.</p> ',
            palette: 'deep-orange:700'
        },{
            title: 'John King',
            subtitle: 'Limit your selection of colors by choosing three hues from the primary palette and one accent color from the secondary palette.',
            date:'17/6/2015',
            image: 'assets/images/avatars/hair-black-eyes-brown-skin-dark.png',
            content: '<img src="assets/images/backgrounds/material-backgrounds/mb-bg-04.jpg"/>',
            palette: 'cyan:500',
            classes: 'widget-overlay-title'
        },{
            title: 'Christos Pantazis',
            subtitle: 'CEO Facebook',
            date:'23/6/2015',
            image: 'assets/images/avatars/hair-blonde-eyes-blue-green-skin-light.png',
            content: '<p class="padding-10 font-size-3 font-weight-200 line-height-big">For white or black text on colored backgrounds, see these tables of color palettes for the appropriate contrast ratios and hex values.</p> ',
            palette: 'red:50'
        },{
            title: 'Accent color',
            subtitle: 'Use the accent color for your primary action button and components like switches or sliders.',
            date:'12/6/2015',
            image: 'assets/images/avatars/hair-black-eyes-brown-skin-tanned-2.png',
            content: '<img src="assets/images/backgrounds/material-backgrounds/mb-bg-05.jpg"/>',
            palette: 'cyan:500',
            classes: 'widget-overlay-title'
        }];
    }
})();
(function() {
    'use strict';

    angular
        .module('app.examples.extras')
        .directive('replaceWith', replaceWith);

    /* @ngInject */
    function replaceWith() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$observe('replaceWith', function(value) {
                if (value) {
                    element.replaceWith(angular.isUndefined(value) ? '' : value);
                }
            });
        }
    }
})();
(function() {
    'use strict';

    GalleryController.$inject = ["$mdDialog"];
    angular
        .module('app.examples.extras')
        .controller('GalleryController', GalleryController);

    /* @ngInject */
    function GalleryController($mdDialog) {
        var vm = this;
        vm.feed = [];
        vm.openImage = openImage;

        ////////////////

        // number of days of dummy data to show
        var numberOfFeedDays = 5;
        var loremPixelCategories = ['abstract', 'city', 'people', 'nature', 'food', 'fashion', 'nightlife'];

        function randomImage(title) {
            var randImage = Math.floor((Math.random() * 10) + 1);
            var randomCategory = loremPixelCategories[Math.floor((Math.random() * (loremPixelCategories.length-1)) + 1)];

            var width = [300, 640];
            var height = [225, 480];

            var image = {
                url: 'http://lorempixel.com/',
                urlFull: 'http://lorempixel.com/',
                title: title
            };


            if(Math.random() < 0.7) {
                image.url += width[0] + '/' + height[0];
                image.urlFull += width[1] + '/' + height[1];
                image.rowspan = 2;
                image.colspan = 2;
            }
            else {
                image.url += height[0] + '/' + width[0];
                image.urlFull += height[1] + '/' + width[1];
                image.rowspan = 2;
                image.colspan = 1;
            }

            image.url += '/' + randomCategory + '/' + randImage;
            image.urlFull += '/' + randomCategory + '/' + randImage;

            return image;
        }

        function createDayOfImages(day) {
            var dayFeed = {
                date: moment().subtract(day, 'days'),
                images: []
            };

            var numberOfImages = Math.floor((Math.random() * 4) + 6);
            for(var i = 0; i < numberOfImages; i++) {
                dayFeed.images.push(randomImage('Photo ' + (i+1)));
            }

            return dayFeed;
        }

        function openImage(day, image, $event) {
            $mdDialog.show({
                controller: 'GalleryDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/examples/extras/gallery-dialog.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                targetEvent: $event,
                locals: {
                    day: day,
                    image: image
                }
            });
        }

        function createFeed() {
            for(var day = 0; day < numberOfFeedDays; day++) {
                vm.feed.push(createDayOfImages(day));
            }
        }

        // init

        createFeed();
    }
})();
(function() {
    'use strict';

    GalleryDialogController.$inject = ["$mdDialog", "day", "image"];
    angular
        .module('app.examples.extras')
        .controller('GalleryDialogController', GalleryDialogController);

    /* @ngInject */
    function GalleryDialogController($mdDialog, day, image) {
        var vm = this;
        vm.currentImage = image;
        vm.next = next;
        vm.prev = prev;

        function next() {
            var index = day.images.indexOf(vm.currentImage);
            index = index + 1 < day.images.length ? index + 1 : 0;
            vm.currentImage = day.images[index];
        }

        function prev() {
            var index = day.images.indexOf(vm.currentImage);
            index = index - 1 < 0 ? day.images.length -1 : index - 1;
            vm.currentImage = day.images[index];
        }
    }
})();

(function() {
    'use strict';

    moduleConfig.$inject = ["$stateProvider", "triMenuProvider"];
    angular
        .module('app.examples.extras')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('triangular.extra-gallery', {
            url: '/extras/gallery',
            templateUrl: 'app/examples/extras/gallery.tmpl.html',
            controller: 'GalleryController',
            controllerAs: 'vm'
        })
        .state('triangular.extra-avatars', {
            url: '/extras/avatars',
            templateUrl: 'app/examples/extras/avatars.tmpl.html',
            controller: 'AvatarsController',
            controllerAs: 'vm'
        })
        .state('triangular.extra-blank', {
            url: '/extras/blank',
            templateUrl: 'app/examples/extras/blank.tmpl.html',
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.extra-timeline', {
            url: '/extras/timeline',
            templateUrl: 'app/examples/extras/timeline.tmpl.html',
            controller: 'TimelineController',
            controllerAs: 'vm'
        });
 
    }
})();

(function() {
    'use strict';

    angular
        .module('app.examples.extras')
        .controller('AvatarsController', AvatarsController);

    /* @ngInject */
    function AvatarsController() {
        var vm = this;
        vm.avatars = [{
            title: 'Carl Barnes',
            subtitle:'Designer',
            image: 'assets/images/avatars/hair-black-eyes-blue-green-skin-tanned.png',
            color: 'blue',
            hue: '500',
            rowspan: 2,
            colspan: 2
        },{
            title: 'Dorothy Lewis',
            subtitle:'Designer',
            image: 'assets/images/avatars/hair-black-eyes-brown-skin-tanned.png',
            color: 'pink',
            hue: '500',
            rowspan: 1,
            colspan: 1
        },{
            title: 'Harris Kwnst',
            subtitle:'Developer',
            image: 'assets/images/avatars/hair-blonde-eyes-brown-skin-light.png',
            color: 'blue',
            hue: '200',
            rowspan: 1,
            colspan: 1
        },{
            title: 'Sue Ross',
            subtitle:'Marketing',
            image: 'assets/images/avatars/hair-black-eyes-dark-skin-dark.png',
            color: 'green',
            hue: '500',
            rowspan: 2,
            colspan: 2
        },{
            title: 'Joe Ross',
            subtitle:'Finance',
            image: 'assets/images/avatars/hair-blonde-eyes-blue-green-skin-light.png',
            color: 'red',
            hue: '500',
            rowspan: 2,
            colspan: 2
        },{
            title: 'Shirley King',
            subtitle:'Designer',
            image: 'assets/images/avatars/hair-blonde-eyes-brown-skin-tanned.png',
            color: 'blue',
            hue: '200',
            rowspan: 2,
            colspan: 2
        },{
            title: 'John King',
            subtitle:'Developer',
            image: 'assets/images/avatars/hair-black-eyes-brown-skin-dark.png',
            color: 'yellow',
            hue: '900',
            rowspan: 1,
            colspan: 1
        },{
            title: 'Mary Rose',
            subtitle:'Advertising',
            image: 'assets/images/avatars/hair-grey-eyes-dark-skin-tanned.png',
            color: 'pink',
            hue: '800',
            rowspan: 1,
            colspan: 1
        },{
            title: 'Morris Onions',
            subtitle:'Finance',
            image: 'assets/images/avatars/hair-black-eyes-brown-skin-tanned-2.png',
            color: 'orange',
            hue: '800',
            rowspan: 1,
            colspan: 1
        }];
    }
})();

(function() {
    'use strict';

    animateElements.$inject = ["$interval"];
    angular
        .module('app.examples.extras')
        .directive('animateElements', animateElements);

    /* @ngInject */
    function animateElements($interval) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link($scope, $element) {
            var $widgets  = [];
            var $dividers = [];


            function isLoaded(widget) {
                return widget.clientHeight > 1;
            }

            // using interval checking since window load event does not work on some machines
            var widgetsLoaded = $interval(function() {
                $widgets = $element.find('.timeline-widget');
                if($widgets.length > 0 && $widgets.toArray().every(isLoaded)) {
                    $dividers = $element.find('.timeline-x-axis');
                    onScrollCallback();
                    $interval.cancel(widgetsLoaded);
                }
            }, 1000);

            var onScrollCallback =  function() {
                for(var i = 0; i < $widgets.length; i++) {
                    if(angular.element($widgets[i]).offset().top <= angular.element(window).scrollTop() + angular.element(window).height() * 0.80 && angular.element($widgets[i]).height() > 1) {
                        var dir = ( i % 2 === 0 ) ? 'left':'right';
                        angular.element($dividers[i]).addClass('timeline-content-animated '+ dir);
                        angular.element($widgets[i]).addClass('timeline-content-animated '+ dir);
                    }
                }
            };

            angular.element('md-content').bind('scroll', onScrollCallback).scroll();
        }
    }
})();

(function() {
    'use strict';

    InboxController.$inject = ["$scope", "$filter", "$location", "$state", "$mdMedia", "$mdBottomSheet", "$stateParams", "$mdDialog", "$mdToast", "emails", "contacts"];
    angular
        .module('app.examples.email')
        .controller('InboxController', InboxController);

    /* @ngInject */
    function InboxController($scope, $filter, $location, $state, $mdMedia, $mdBottomSheet, $stateParams, $mdDialog, $mdToast, emails, contacts) {
        var vm = this;
        // store the base state of where we are /inbox or /trash or /sent
        // this can be then used if we close / delete email to return to
        vm.baseState = $state.current;
        vm.composeClick = composeClick;
        vm.inboxBasePath = $location.path();
        vm.openMail = openMail;
        // store selected email if we have one
        vm.selectedMail = null;
        // variable to store backup of emailGroups for search filtering
        var emailGroupsBackup = null;

        ////////////////////

        function createEmailGroups() {
            // create email groups using the emails from the resolve
            if(emails.status === 200) {
                vm.emails = emails.data;

                vm.emailGroups = [{
                    name: $filter('triTranslate')('Today'),
                    from: moment().startOf('day'),
                    to: moment().endOf('day')
                },{
                    name: $filter('triTranslate')('Yesterday'),
                    from: moment().subtract(1, 'days').startOf('day'),
                    to: moment().subtract(1, 'days').endOf('day')
                },{
                    name: $filter('triTranslate')('Older'),
                    from: moment().subtract(100, 'years').endOf('day'),
                    to: moment().subtract(2, 'days').startOf('day')
                }];

                angular.forEach(vm.emailGroups, function(group) {
                    group.emails = $filter('emailGroup')(vm.emails, group);
                });

                // create backup of emailGroups for search filtering
                emailGroupsBackup = angular.copy(vm.emailGroups);
            }
        }

        // opens an email
        function openMail(email) {
            $state.go(vm.baseState.name + '.email', {
                emailID: email.id
            });
            email.unread = false;
            vm.selectedMail = email.id;
        }

        // returns back to email list
        function openlist() {
            $state.go(vm.baseState.name);
        }

        // opens the compose dialog
        function composeClick($event) {
            $mdDialog.show({
                controller: 'EmailDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/examples/email/email-dialog.tmpl.html',
                targetEvent: $event,
                locals: {
                    title: $filter('triTranslate')('Compose'),
                    email: {
                        to: [],
                        cc: [],
                        bcc:[],
                        subject: '',
                        content: ''
                    },
                    contacts: contacts,
                    getFocus: false
                }
            })
            .then(function(email) {
                sendEmail(null, email);
            }, emailCancel);

            function emailCancel() {
                $mdToast.show(
                    $mdToast.simple()
                    .content($filter('triTranslate')('Email canceled'))
                    .position('bottom right')
                    .hideDelay(3000)
                );
            }
        }

        function sendEmail($event, email) {
            // make list of users that have been sent to
            var sentTo = [];
            angular.forEach(email.to, function(to) {
                sentTo.push(to.name);
            });
            $mdToast.show(
                $mdToast.simple()
                .content($filter('triTranslate')('Email to {{to}} sent.', {to: sentTo.join(', ')}))
                .position('bottom right')
                .hideDelay(3000)
            );
        }

        function checkEmailList() {
            vm.showEmailList = !($mdMedia('xs') && angular.isDefined($state.current.resolve.email));
        }

        // watches

        $scope.$on('emailSearch', function(event, emailSearch) {
            for(var g in emailGroupsBackup) {
                vm.emailGroups[g].emails = $filter('emailSearchFilter')(emailGroupsBackup[g].emails, emailSearch);
            }
        });

        // add a watch for when the url location changes
        $scope.$on('$locationChangeSuccess', checkEmailList);

        // handle delete email event sent from email menu in email view
        $scope.$on('deleteEmail', function($event, deleteEmail) {
            angular.forEach(vm.emailGroups, function(group) {
                var removeEmailIndex = null;
                angular.forEach(group.emails, function(email, index) {
                    if(deleteEmail.id === email.id) {
                        removeEmailIndex = index;
                    }
                });
                if(null !== removeEmailIndex) {
                    group.emails.splice(removeEmailIndex, 1);
                    $mdToast.show(
                        $mdToast.simple()
                        .content($filter('triTranslate')('DeleteD'))
                        .position('bottom right')
                        .hideDelay(3000)
                    );
                }
            });

            openlist();
        });

        // handle close email event sent from email menu in email view
        $scope.$on('closeEmail', openlist);

        // handle close email event sent from email controller
        $scope.$on('sendEmail', sendEmail);

        // init

        checkEmailList();

        createEmailGroups();
    }
})();

(function() {
    'use strict';

    angular
        .module('app.examples.email')
        .filter('emailGroup', emailGroup);

    function emailGroup() {
        return filterFilter;

        ////////////////

        function filterFilter(emails, emailGroup) {
            return emails.filter(function(email) {
                var emailDate = moment(email.date, moment.ISO_8601);

                if(emailDate.isAfter(emailGroup.from) && emailDate.isBefore(emailGroup.to)) {
                    return email;
                }
            });
        }
    }

})();
(function() {
    'use strict';

    EmailController.$inject = ["$scope", "$stateParams", "$mdDialog", "$mdToast", "$filter", "emails", "email", "contacts"];
    angular
        .module('app.examples.email')
        .controller('EmailController', EmailController);

    /* @ngInject */
    function EmailController($scope, $stateParams, $mdDialog, $mdToast, $filter, emails, email, contacts) {
        var vm = this;
        vm.closeEmail = closeEmail;
        vm.deleteEmail = deleteEmail;
        vm.email = email;
        vm.emailAction = emailAction;

        /////////////////

        function closeEmail() {
            $scope.$emit('closeEmail');
        }

        function deleteEmail(email) {
            $scope.$emit('deleteEmail', email);
        }

        function emailAction($event, title) {
            var replyEmail = {
                to: [],
                cc: [],
                bcc: [],
                // add r.e to subject if there is one
                subject: email.subject === '' ? '' : $filter('triTranslate')('R.e: ') + email.subject,
                // wrap previous content in blockquote and add new line
                content: '<br><br><blockquote>' + email.content + '</blockquote>'
            };

            // get contact and add it to to if replying
            angular.forEach(contacts.data, function(contact) {
                if(contact.email === email.from.email) {
                    replyEmail.to.push(contact);
                }
            });

            openEmail($event, replyEmail, $filter('triTranslate')(title));
        }

        function openEmail($event, email, title) {
            $mdDialog.show({
                controller: 'EmailDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/examples/email/email-dialog.tmpl.html',
                targetEvent: $event,
                locals: {
                    title: title,
                    email: email,
                    contacts: contacts,
                    getFocus: true
                },
                focusOnOpen: false
            })
            .then(function(email) {
                // send email sent event
                $scope.$emit('sendEmail', email);
            }, cancelEmail);

            function cancelEmail() {
                $mdToast.show(
                    $mdToast.simple()
                    .content($filter('triTranslate')('Email canceled'))
                    .position('bottom right')
                    .hideDelay(3000)
                );
            }
        }
    }
})();

(function() {
    'use strict';

    moduleConfig.$inject = ["$provide"];
    angular
        .module('app.examples.email')
        .config(moduleConfig);

    function moduleConfig($provide) {
        /***
        * Setup Editor Toolbar here
        ***/
        $provide.decorator('taOptions', ['taRegisterTool', 'taTranslations', '$delegate', function(taRegisterTool, taTranslations, taOptions){
            taOptions.toolbar = [['bold', 'italics', 'underline', 'insertLink']];

            taOptions.classes = {
                focussed: 'focussed',
                toolbar: 'editor-toolbar',
                toolbarGroup: 'editor-group',
                toolbarButton: 'md-button',
                toolbarButtonActive: '',
                disabled: '',
                textEditor: 'form-control',
                htmlEditor: 'form-control'
            };
            return taOptions;
        }]);

        $provide.decorator('taTools', ['$delegate', function(taTools){
            taTools.bold.iconclass = 'zmdi zmdi-format-bold';
            taTools.italics.iconclass = 'zmdi zmdi-format-italic';
            taTools.underline.iconclass = 'zmdi zmdi-format-underlined';
            taTools.insertLink.iconclass = 'zmdi zmdi-link';
            return taTools;
        }]);
    }
})();
(function() {
    'use strict';

    moduleConfig.$inject = ["$stateProvider", "triMenuProvider", "EMAIL_ROUTES"];
    angular
        .module('app.examples.email')
        .config(moduleConfig)
        .constant('EMAIL_ROUTES', [{
            state: 'triangular.email.inbox',
            name: 'Inbox',
            url: '/email/inbox'
        },{
            state: 'triangular.email.trash',
            name: 'Trash',
            url: '/email/trash'
        },{
            state: 'triangular.email.sent',
            name: 'Sent',
            url: '/email/sent'
        }]);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider, EMAIL_ROUTES) {

        $stateProvider
        .state('triangular.email',  {
            abstract: true,
            views: {
                'toolbar@triangular': {
                    templateUrl: 'app/examples/email/layout/toolbar/toolbar.tmpl.html',
                    controller: 'EmailToolbarController',
                    controllerAs: 'vm'
                }
            },
            data: {
                layout: {
                    footer: false,
                    contentClass: 'triangular-non-scrolling'
                },
                permissions: {
                    only: ['viewEmail']
                }
            }
        });

        angular.forEach(EMAIL_ROUTES, function(route) {
            $stateProvider
            .state(route.state, {
                url: route.url,
                views: {
                    '@triangular': {
                        templateUrl: 'app/examples/email/inbox.tmpl.html',
                        controller: 'InboxController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    emails: ["$http", "$q", "API_CONFIG", function($http, $q, API_CONFIG) {
                        return $http({
                            method: 'GET',
                            url: API_CONFIG.url + 'email/inbox'
                        });
                    }],
                    contacts: ["$http", "API_CONFIG", function($http, API_CONFIG) {
                        return $http({
                            method: 'GET',
                            url: API_CONFIG.url + 'email/contacts'
                        });
                    }]
                }
            });
        });

        angular.forEach(EMAIL_ROUTES, function(route) {
            $stateProvider
            .state(route.state + '.email', {
                url: '/mail/:emailID',
                templateUrl: 'app/examples/email/email.tmpl.html',
                controller: 'EmailController',
                controllerAs: 'vm',
                resolve: {
                    email: ["$stateParams", "emails", function($stateParams, emails) {
                        emails = emails.data;
                        var foundEmail = false;
                        for(var i = 0; i < emails.length; i++) {
                            if(emails[i].id === $stateParams.emailID) {
                                foundEmail = emails[i];
                                break;
                            }
                        }
                        return foundEmail;
                    }]
                },
                onEnter: ["$state", "email", function($state, email){
                    if (false === email) {
                        $state.go(route.state);
                    }
                }]
            });
        });

        var emailMenu = {
            name: 'Email',
            icon: 'zmdi zmdi-email',
            type: 'dropdown',
            priority: 2.1,
            permission: 'viewEmail',
            children: []
        };

        angular.forEach(EMAIL_ROUTES, function(route) {
            emailMenu.children.push({
                name: route.name,
                state: route.state,
                type: 'link',
                badge: Math.round(Math.random() * (20 - 1) + 1)
            });
        });

        triMenuProvider.addMenu(emailMenu);

        triMenuProvider.addMenu({
            type: 'divider',
            priority: 2.3
        });
    }
})();

(function() {
    'use strict';

    angular
        .module('app.examples.email')
        .filter('emailSearchFilter', emailSearchFilter);

    function emailSearchFilter() {
        return filterFilter;

        ////////////////

        function filterFilter(emails, emailSearch) {
            return emails.filter(function(email) {
                if(email.from.name.indexOf(emailSearch) > -1) {
                    return email;
                }
                if(email.subject.indexOf(emailSearch) > -1) {
                    return email;
                }
            });
        }
    }

})();
(function() {
    'use strict';

    EmailDialogController.$inject = ["$timeout", "$mdDialog", "$filter", "triSkins", "textAngularManager", "title", "email", "contacts", "getFocus"];
    angular
        .module('app.examples.email')
        .controller('EmailDialogController', EmailDialogController);

    /* @ngInject */
    function EmailDialogController($timeout, $mdDialog, $filter, triSkins, textAngularManager, title, email, contacts, getFocus) {
        var contactsData = contacts.data;

        var vm = this;
        vm.cancel = cancel;
        vm.email = email;
        vm.title = title;
        vm.send = send;
        vm.showCCSIcon = 'zmdi zmdi-account-add';
        vm.showCCS = false;
        vm.toggleCCS = toggleCCS;
        vm.triSkin = triSkins.getCurrent();
        vm.queryContacts = queryContacts;

        ///////////////

        function cancel() {
            $mdDialog.cancel();
        }

        function toggleCCS() {
            vm.showCCS = !vm.showCCS;
            vm.showCCSIcon = vm.showCCS ? 'zmdi zmdi-account' : 'zmdi zmdi-account-add';
        }

        function send() {
            $mdDialog.hide(vm.email);
        }

        function queryContacts($query) {
            var lowercaseQuery = angular.lowercase($query);
            return contactsData.filter(function(contact) {
                var lowercaseName = angular.lowercase(contact.name);
                if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                    return contact;
                }
            });
        }

        ////////////////
        if(getFocus) {
            $timeout(function() {
                // Retrieve the scope and trigger focus
                var editorScope = textAngularManager.retrieveEditor('emailBody').scope;
                editorScope.displayElements.text.trigger('focus');
            }, 500);
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('app.examples.email')
        .filter('cut', cut);

    function cut() {
        return filterFunction;

        ////////////////

        function filterFunction(value, wordwise, max, tail) {
            if (!value) {
                return '';
            }

            max = parseInt(max, 10);
            if (!max) {
                return value;
            }
            if (value.length <= max) {
                return value;
            }

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace !== -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        }
    }

})();
(function() {
    'use strict';

    ProgressController.$inject = ["$interval"];
    angular
        .module('app.examples.elements')
        .controller('ProgressController', ProgressController);

    /* @ngInject */
    function ProgressController($interval) {
        var vm = this;
        vm.determinateValue = 0;
        vm.bufferValue = 0;

        $interval(intervalCall, 100, 0, true);

        ////////////////

        function intervalCall() {
            vm.determinateValue += 1;
            vm.bufferValue += 1.5;
            if(vm.determinateValue > 100) {
                vm.determinateValue = 0;
                vm.bufferValue = 0;
            }
        }
    }
})();
(function() {
    'use strict';

    IconsController.$inject = ["icons", "fa"];
    angular
        .module('app.examples.elements')
        .controller('IconsController', IconsController);

    /* @ngInject */
    function IconsController(icons, fa) {
        var vm = this;
        vm.icons = [];
        vm.families = ['Material Icon Font', 'Font Awesome'];
        vm.selectedIcon = null;

        // create filterable data structure for icons
        angular.forEach(icons.data, function(icon) {
            vm.icons.push({
                name: icon.name,
                family: 'Material Icon Font',
                className: icon.class
            });
        });

        angular.forEach(fa.data, function(name, className) {
            vm.icons.push({
                name: name,
                family: 'Font Awesome',
                className: className
            });
        });

        vm.selectIcon = function(icon) {
            vm.selectedIcon = icon;
        };
    }
})();
(function() {
    'use strict';

    moduleConfig.$inject = ["$stateProvider", "triMenuProvider"];
    angular
        .module('app.examples.elements')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('triangular.elements-buttons', {
            url: '/elements/buttons',
            templateUrl: 'app/examples/elements/buttons.tmpl.html',
            controller: 'ButtonsController',
            controllerAs: 'vm',
            data: {
                permissions: {
                    only: ['viewElements']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.elements-icons', {
            url: '/elements/icons',
            templateUrl: 'app/examples/elements/icons.tmpl.html',
            controller: 'IconsController',
            controllerAs: 'vm',
            data: {
                permissions: {
                    only: ['viewElements']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            },
            resolve: {
                icons: ["$http", "API_CONFIG", function($http, API_CONFIG) {
                    return $http({
                        method: 'GET',
                        url: API_CONFIG.url + 'elements/icons'
                    });
                }],
                fa: ["$http", "API_CONFIG", function($http, API_CONFIG) {
                    return $http({
                        method: 'GET',
                        url: API_CONFIG.url + 'elements/icons-fa'
                    });
                }]
            }
        })
        .state('triangular.elements-checkboxes', {
            url: '/elements/checkboxes',
            templateUrl: 'app/examples/elements/checkboxes.tmpl.html',
            data: {
                permissions: {
                    only: ['viewElements']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.elements-radios', {
            url: '/elements/radios',
            templateUrl: 'app/examples/elements/radios.tmpl.html',
            data: {
                permissions: {
                    only: ['viewElements']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.elements-toolbars', {
            url: '/elements/toolbars',
            templateUrl: 'app/examples/elements/toolbars.tmpl.html',
            data: {
                permissions: {
                    only: ['viewElements']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.elements-tooltips', {
            url: '/elements/tooltips',
            templateUrl: 'app/examples/elements/tooltips.tmpl.html',
            data: {
                permissions: {
                    only: ['viewElements']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.elements-whiteframes', {
            url: '/elements/whiteframes',
            templateUrl: 'app/examples/elements/whiteframes.tmpl.html',
            data: {
                permissions: {
                    only: ['viewElements']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.elements-sliders', {
            url: '/elements/sliders',
            templateUrl: 'app/examples/elements/sliders.tmpl.html',
            data: {
                permissions: {
                    only: ['viewElements']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.elements-toasts', {
            url: '/elements/toasts',
            templateUrl: 'app/examples/elements/toasts.tmpl.html',
            data: {
                permissions: {
                    only: ['viewElements']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.elements-progress', {
            url: '/elements/progress',
            templateUrl: 'app/examples/elements/progress.tmpl.html',
            controller: 'ProgressController',
            controllerAs: 'vm',
            data: {
                permissions: {
                    only: ['viewElements']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.elements-switches', {
            url: '/elements/switches',
            templateUrl: 'app/examples/elements/switches.tmpl.html',
            controller: function() {
                this.toggleAll = function(data, value) {
                    for(var x in data) {
                        data[x] = value;
                    }
                };
            },
            controllerAs: 'vm',
            data: {
                permissions: {
                    only: ['viewElements']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.elements-dialogs', {
            url: '/elements/dialogs',
            templateUrl: 'app/examples/elements/dialogs.tmpl.html',
            controller: 'DialogsController',
            controllerAs: 'vm',
            data: {
                permissions: {
                    only: ['viewElements']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.menus', {
            url: '/elements/menus',
            templateUrl: 'app/examples/elements/menus.tmpl.html',
            data: {
                permissions: {
                    only: ['viewElements']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.elements-tabs', {
            url: '/elements/tabs',
            templateUrl: 'app/examples/elements/tabs.tmpl.html',
            data: {
                permissions: {
                    only: ['viewElements']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.elements-sidebars', {
            url: '/elements/sidebars',
            templateUrl: 'app/examples/elements/sidebars.tmpl.html',
            controller: ["$mdSidenav", function($mdSidenav) {
                this.openSidebar = function(id) {
                    $mdSidenav(id).toggle();
                };
            }],
            controllerAs: 'vm',
            data: {
                permissions: {
                    only: ['viewElements']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.elements-grids', {
            url: '/elements/grids',
            templateUrl: 'app/examples/elements/grids.tmpl.html',
            data: {
                permissions: {
                    only: ['viewElements']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.fab-speed', {
            url: '/elements/fab-speed',
            templateUrl: 'app/examples/elements/fab-speed.tmpl.html',
            data: {
                permissions: {
                    only: ['viewElements']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.fab-toolbar', {
            url: '/elements/fab-toolbar',
            templateUrl: 'app/examples/elements/fab-toolbar.tmpl.html',
            data: {
                permissions: {
                    only: ['viewElements']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.elements-selects', {
            url: '/elements/selects',
            templateUrl: 'app/examples/elements/selects.tmpl.html',
            data: {
                permissions: {
                    only: ['viewElements']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.elements-tables', {
            url: '/elements/tables',
            templateUrl: 'app/examples/elements/tables.tmpl.html',
            data: {
                permissions: {
                    only: ['viewElements']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.elements-textangular', {
            url: '/elements/textangular',
            templateUrl: 'app/examples/elements/textangular.tmpl.html',
            data: {
                permissions: {
                    only: ['viewElements']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.elements-lists', {
            url: '/elements/lists',
            templateUrl: 'app/examples/elements/lists.tmpl.html',
            controller: ["emails", function(emails) {
                this.emails = emails.data.splice(0, 5);
            }],
            controllerAs: 'vm',
            resolve: {
                emails: ["$http", "API_CONFIG", function($http, API_CONFIG) {
                    return $http({
                        method: 'GET',
                        url: API_CONFIG.url + 'email/inbox'
                    });
                }]
            },
            data: {
                permissions: {
                    only: ['viewElements']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.elements-chips', {
            url: '/elements/chips',
            templateUrl: 'app/examples/elements/chips.tmpl.html',
            controller: 'ChipsController',
            controllerAs: 'vm',
            resolve: {
                contacts: ["$http", "API_CONFIG", function($http, API_CONFIG) {
                    return $http({
                        method: 'GET',
                        url: API_CONFIG.url + 'email/contacts'
                    });
                }]
            },
            data: {
                permissions: {
                    only: ['viewElements']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.elements-cards', {
            url: '/elements/cards',
            templateUrl: 'app/examples/elements/cards.tmpl.html',
            data: {
                permissions: {
                    only: ['viewElements']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.elements-upload', {
            url: '/elements/upload',
            templateUrl: 'app/examples/elements/upload.tmpl.html',
            data: {
                permissions: {
                    only: ['viewElements']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.elements-loader', {
            url: '/elements/loader',
            templateUrl: 'app/examples/elements/loader.tmpl.html',
            data: {
                permissions: {
                    only: ['viewElements']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.elements-datepicker', {
            url: '/elements/datepicker',
            templateUrl: 'app/examples/elements/datepicker.tmpl.html',
            data: {
                permissions: {
                    only: ['viewElements']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        });

        triMenuProvider.addMenu({
            name: 'Elements',
            icon: 'zmdi zmdi-graduation-cap',
            type: 'dropdown',
            priority: 3.1,
            permission: 'viewElements',
            children: [{
                name: 'Buttons',
                type: 'link',
                state: 'triangular.elements-buttons'
            },{
                name: 'Cards',
                type: 'link',
                state: 'triangular.elements-cards'
            },{
                name: 'Checkboxes',
                type: 'link',
                state: 'triangular.elements-checkboxes'
            },{
                name: 'Chips',
                type: 'link',
                state: 'triangular.elements-chips'
            },{
                name: 'Datepicker',
                type: 'link',
                state: 'triangular.elements-datepicker'
            },{
                name: 'Dialogs',
                type: 'link',
                state: 'triangular.elements-dialogs'
            },{
                name: 'FAB Speed Dial',
                type: 'link',
                state: 'triangular.fab-speed'
            },{
                name: 'FAB Toolbar',
                type: 'link',
                state: 'triangular.fab-toolbar'
            },{
                name: 'Grids',
                type: 'link',
                state: 'triangular.elements-grids'
            },{
                name: 'Icons',
                type: 'link',
                state: 'triangular.elements-icons'
            },{
                name: 'Lists',
                type: 'link',
                state: 'triangular.elements-lists'
            },{
                name: 'Loader',
                type: 'link',
                state: 'triangular.elements-loader'
            },{
                name: 'Menus',
                type: 'link',
                state: 'triangular.menus'
            },{
                name: 'Progress',
                type: 'link',
                state: 'triangular.elements-progress'
            },{
                name: 'Radios',
                type: 'link',
                state: 'triangular.elements-radios'
            },{
                name: 'Selects',
                type: 'link',
                state: 'triangular.elements-selects'
            },{
                name: 'Sidebars',
                type: 'link',
                state: 'triangular.elements-sidebars'
            },{
                name: 'Sliders',
                type: 'link',
                state: 'triangular.elements-sliders'
            },{
                name: 'Switches',
                type: 'link',
                state: 'triangular.elements-switches'
            },{
                name: 'Tables',
                type: 'link',
                state: 'triangular.elements-tables'
            },{
                name: 'Tabs',
                type: 'link',
                state: 'triangular.elements-tabs'
            },{
                name: 'Textangular',
                type: 'link',
                state: 'triangular.elements-textangular'
            },{
                name: 'Toasts',
                type: 'link',
                state: 'triangular.elements-toasts'
            },{
                name: 'Toolbars',
                type: 'link',
                state: 'triangular.elements-toolbars'
            },{
                name: 'Tooltips',
                type: 'link',
                state: 'triangular.elements-tooltips'
            },{
                name: 'Whiteframes',
                type: 'link',
                state: 'triangular.elements-whiteframes'
            },{
                name: 'Upload',
                type: 'link',
                state: 'triangular.elements-upload'
            }]
        });
    }
})();

(function() {
    'use strict';

    ButtonsController.$inject = ["$interval"];
    angular
        .module('app.examples.elements')
        .controller('ButtonsController', ButtonsController);

    /* @ngInject */
    function ButtonsController($interval) {
        var vm = this;
        vm.buttonClass1 = 'md-primary';
        vm.buttonHue1 = 'md-default';

        vm.buttonClass2 = 'md-primary';
        vm.buttonHue2 = 'md-default';

        vm.buttonClass3 = 'md-primary';
        vm.buttonHue3 = 'md-default';

        vm.buttonDisabled = false;
        vm.determinateValue = 30;
        vm.determinateValue2 = 30;
        $interval(intervalTriggered, 100, 0, true);

        ////////////////

        function intervalTriggered() {
            vm.determinateValue += 1;
            vm.determinateValue2 += 1.5;
            if(vm.determinateValue > 100) {
                vm.determinateValue = 30;
                vm.determinateValue2 = 30;
            }
        }
    }
})();

(function() {
    'use strict';

    moduleConfig.$inject = ["$stateProvider", "triMenuProvider"];
    angular
        .module('app.examples.dashboards')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('triangular.sales-layout', {
            abstract: true,
            views: {
                sidebarLeft: {
                    templateUrl: 'app/layouts/leftsidenav/leftsidenav.tmpl.html',
                    controller: 'MenuController',
                    controllerAs: 'vm'
                },
                content: {
                    template: '<div id="admin-panel-content-view" flex ui-view></div>'
                },
                belowContent: {
                    template: '<div ui-view="belowContent"></div>'
                }
            }
        })
        .state('triangular.dashboard-general', {
            url: '/dashboards/general',
            templateUrl: 'app/examples/dashboards/general/dashboard-general.tmpl.html'
        })
        .state('triangular.dashboard-analytics', {
            url: '/dashboards/analytics',
            views: {
                '': {
                    templateUrl: 'app/examples/dashboards/analytics/analytics.tmpl.html',
                    controller: 'DashboardAnalyticsController',
                    controllerAs: 'vm'
                },
                'belowContent': {
                    templateUrl: 'app/examples/dashboards/analytics/fab-button.tmpl.html',
                    controller: 'DashboardAnalyticsFabButtonController',
                    controllerAs: 'vm'
                }
            },
            data: {
                layout: {
                    contentClass: 'analytics-dashboard'
                }
            }
        })
        .state('triangular.dashboard-classic', {
            url: '/dashboards/classic',
            templateUrl: 'app/examples/dashboards/classic/classic.tmpl.html',
            controller: 'DashboardClassicController',
            controllerAs: 'vm'
        })
        .state('triangular.dashboard-server', {
            url: '/dashboards/server',
            templateUrl: 'app/examples/dashboards/server/dashboard-server.tmpl.html',
            controller: 'DashboardServerController',
            controllerAs: 'vm'
        })
        .state('triangular.dashboard-widgets', {
            url: '/dashboards/widgets',
            templateUrl: 'app/examples/dashboards/widgets.tmpl.html'
        })
        .state('triangular.dashboard-social', {
            url: '/dashboards/social',
            templateUrl: 'app/examples/dashboards/social/dashboard-social.tmpl.html',
            controller: 'DashboardSocialController',
            controllerAs: 'vm'
        })
        .state('triangular.dashboard-sales', {
            url: '/dashboards/sales',
            data: {
                layout: {
                    showToolbar: false
                }
            },
            views: {
                '': {
                    templateUrl: 'app/examples/dashboards/sales/dashboard-sales.tmpl.html',
                    controller: 'DashboardSalesController',
                    controllerAs: 'vm'
                },
                'belowContent': {
                    templateUrl: 'app/examples/dashboards/sales/fab-button.tmpl.html',
                    controller: 'SalesFabController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('triangular.dashboard-draggable', {
            url: '/dashboards/draggable-widgets',
            templateUrl: 'app/examples/dashboards/dashboard-draggable.tmpl.html',
            controller: 'DashboardDraggableController',
            controllerAs: 'vm'
        });

        triMenuProvider.addMenu({
            name: 'Dashboards',
            icon: 'zmdi zmdi-home',
            type: 'dropdown',
            priority: 1.1,
            children: [{
                name: 'Analytics',
                state: 'triangular.dashboard-analytics',
                type: 'link'
            },{
                name: 'General',
                state: 'triangular.dashboard-general',
                type: 'link'
            },{
                name: 'Sales',
                state: 'triangular.dashboard-sales',
                type: 'link'
            },{
                name: 'Classic',
                state: 'triangular.dashboard-classic',
                type: 'link'
            },{
                name: 'Server',
                state: 'triangular.dashboard-server',
                type: 'link'
            },{
                name: 'Social',
                state: 'triangular.dashboard-social',
                type: 'link'
            },{
                name: 'Widgets',
                state: 'triangular.dashboard-widgets',
                type: 'link'
            },{
                name: 'Draggable',
                state: 'triangular.dashboard-draggable',
                type: 'link'
            }]
        });

    }
})();

(function() {
    'use strict';

    angular
        .module('app.examples.dashboards')
        .controller('DashboardDraggableController', DashboardDraggableController);

    /* @ngInject */
    function DashboardDraggableController() {
    }
})();

(function() {
    'use strict';

    moduleConfig.$inject = ["$stateProvider", "triMenuProvider"];
    angular
        .module('app.examples.charts')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('triangular.charts-google-bar', {
            url: '/charts/google/bar',
            templateUrl: 'app/examples/charts/google-bar.tmpl.html',
            data: {
                permissions: {
                    only: ['viewCharts']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.charts-google-scatter', {
            url: '/charts/google/scatter',
            templateUrl: 'app/examples/charts/google-scatter.tmpl.html',
            data: {
                permissions: {
                    only: ['viewCharts']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.charts-google-line', {
            url: '/charts/google/line',
            templateUrl: 'app/examples/charts/google-line.tmpl.html',
            data: {
                permissions: {
                    only: ['viewCharts']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.charts-chartjs-bar', {
            url: '/charts/chartjs/bar',
            templateUrl: 'app/examples/charts/chartjs-bar.tmpl.html',
            data: {
                permissions: {
                    only: ['viewCharts']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.charts-chartjs-pie', {
            url: '/charts/chartjs/pie',
            templateUrl: 'app/examples/charts/chartjs-pie.tmpl.html',
            data: {
                permissions: {
                    only: ['viewCharts']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.charts-chartjs-ticker', {
            url: '/charts/chartjs/ticker',
            templateUrl: 'app/examples/charts/chartjs-ticker.tmpl.html',
            data: {
                permissions: {
                    only: ['viewCharts']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.charts-chartjs-line', {
            url: '/charts/chartjs/line',
            templateUrl: 'app/examples/charts/chartjs-line.tmpl.html',
            data: {
                permissions: {
                    only: ['viewCharts']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.charts-d3-scatter', {
            url: '/charts/d3/scatter',
            templateUrl: 'app/examples/charts/d3-scatter.tmpl.html',
            data: {
                permissions: {
                    only: ['viewCharts']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.charts-d3-bar', {
            url: '/charts/d3/bar',
            templateUrl: 'app/examples/charts/d3-bar.tmpl.html',
            data: {
                permissions: {
                    only: ['viewCharts']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        })
        .state('triangular.charts-d3-multiline', {
            url: '/charts/d3/multiline',
            templateUrl: 'app/examples/charts/d3-multiline.tmpl.html',
            data: {
                permissions: {
                    only: ['viewCharts']
                },
                layout: {
                    contentClass: 'layout-column'
                }
            }
        });

        triMenuProvider.addMenu({
            name: 'Charts',
            icon: 'zmdi zmdi-chart',
            type: 'dropdown',
            priority: 5.1,
            permission: 'viewCharts',
            children: [{
                name: 'Google',
                type: 'dropdown',
                children: [{
                    name: 'Bar',
                    state: 'triangular.charts-google-bar',
                    type: 'link'
                },{
                    name: 'Scatter',
                    state: 'triangular.charts-google-scatter',
                    type: 'link'
                },{
                    name: 'Line',
                    state: 'triangular.charts-google-line',
                    type: 'link'
                }]
            },{
                name: 'Chart.js',
                type: 'dropdown',
                children: [{
                    name: 'Bar',
                    state: 'triangular.charts-chartjs-bar',
                    type: 'link'
                },{
                    name: 'Line',
                    state: 'triangular.charts-chartjs-line',
                    type: 'link'
                },{
                    name: 'Pie',
                    state: 'triangular.charts-chartjs-pie',
                    type: 'link'
                },{
                    name: 'Ticker',
                    state: 'triangular.charts-chartjs-ticker',
                    type: 'link'
                }]
            },{
                name: 'D3 Charts',
                type: 'dropdown',
                children: [{
                    name: 'Scatter',
                    state: 'triangular.charts-d3-scatter',
                    type: 'link'
                },{
                    name: 'OHCL Bar',
                    state: 'triangular.charts-d3-bar',
                    type: 'link'
                },{
                    name: 'Multiline',
                    state: 'triangular.charts-d3-multiline',
                    type: 'link'
                }]
            }]
        });
    }
})();

(function() {
    'use strict';

    angular
        .module('app.examples.calendar')
        .filter('padding', padding);

    function padding() {
        return paddingFilter;

        ////////////////

        function paddingFilter(n, len) {
            var num = parseInt(n, 10);
            len = parseInt(len, 10);
            if (isNaN(num) || isNaN(len)) {
                return n;
            }
            num = ''+num;
            while (num.length < len) {
                num = '0'+num;
            }
            return num;
        }
    }

})();
(function() {
    'use strict';

    EventDialogController.$inject = ["$scope", "$mdDialog", "$filter", "triTheming", "dialogData", "event", "edit"];
    angular
        .module('app.examples.calendar')
        .controller('EventDialogController', EventDialogController);

    /* @ngInject */
    function EventDialogController($scope, $mdDialog, $filter, triTheming, dialogData, event, edit) {

        var vm = this;
        vm.cancelClick = cancelClick;
        vm.colors = [];
        vm.colorChanged = colorChanged;
        vm.deleteClick = deleteClick;
        vm.allDayChanged = allDayChanged;
        vm.dialogData = dialogData;
        vm.edit = edit;
        vm.event = event;
        vm.okClick = okClick;
        vm.selectedColor = null;
        // create start and end date of event
        vm.start = event.start.toDate();
        vm.startTime = convertMomentToTime(event.start);

        if(event.end !== null) {
            vm.end = event.end.toDate();
            vm.endTime = convertMomentToTime(event.end);
        }

        ////////////////

        function colorChanged() {
            vm.event.backgroundColor = vm.selectedColor.backgroundColor;
            vm.event.borderColor = vm.selectedColor.backgroundColor;
            vm.event.textColor = vm.selectedColor.textColor;
            vm.event.palette = vm.selectedColor.palette;
        }

        function okClick() {
            vm.event.start = updateEventDateTime(vm.start, vm.startTime);
            if(vm.event.end !== null) {
                vm.event.end = updateEventDateTime(vm.end, vm.endTime);
            }
            $mdDialog.hide(vm.event);
        }

        function cancelClick() {
            $mdDialog.cancel();
        }

        function deleteClick() {
            vm.event.deleteMe = true;
            $mdDialog.hide(vm.event);
        }

        function allDayChanged() {
            // if all day turned on and event already saved we need to create a new date
            if(vm.event.allDay === false && vm.event.end === null) {
                vm.event.end = moment(vm.event.start);
                vm.event.end.endOf('day');
                vm.end = vm.event.end.toDate();
                vm.endTime = convertMomentToTime(vm.event.end);
            }
        }

        function convertMomentToTime(moment) {
            return {
                hour: moment.hour(),
                minute: moment.minute()
            };
        }

        function updateEventDateTime(date, time) {
            var newDate = moment(date);
            newDate.hour(time.hour);
            newDate.minute(time.minute);
            return newDate;
        }

        function createDateSelectOptions() {
            // create options for time select boxes (this will be removed in favor of mdDatetime picker when it becomes available)
            vm.dateSelectOptions = {
                hours: [],
                minutes: []
            };
            // hours
            for(var hour = 0; hour <= 23; hour++) {
                vm.dateSelectOptions.hours.push(hour);
            }
            // minutes
            for(var minute = 0; minute <= 59; minute++) {
                vm.dateSelectOptions.minutes.push(minute);
            }
        }

        // init
        createDateSelectOptions();

        // create colors
        angular.forEach(triTheming.palettes, function(palette, index) {
            var color = {
                name: index.replace(/-/g, ' '),
                palette: index,
                backgroundColor: triTheming.rgba(palette['500'].value),
                textColor: triTheming.rgba(palette['500'].contrast)
            };

            vm.colors.push(color);

            if(index === vm.event.palette) {
                vm.selectedColor = color;
                vm.colorChanged();
            }
        });
    }
})();

(function() {
    'use strict';

    CalendarController.$inject = ["$scope", "$rootScope", "$mdDialog", "$mdToast", "$filter", "$element", "triTheming", "triLayout", "uiCalendarConfig"];
    angular
        .module('app.examples.calendar')
        .controller('CalendarController', CalendarController);

    /* @ngInject */
    function CalendarController($scope, $rootScope, $mdDialog, $mdToast, $filter, $element, triTheming, triLayout, uiCalendarConfig) {
        var vm = this;
        vm.addEvent = addEvent;
        vm.calendarOptions = {
            contentHeight: 'auto',
            selectable: true,
            editable: true,
            header: false,
            viewRender: function(view) {
                // change day
                vm.currentDay = view.calendar.getDate();
                vm.currentView = view.name;
                // update toolbar with new day for month name
                $rootScope.$broadcast('calendar-changeday', vm.currentDay);
                // update background image for month
                triLayout.layout.contentClass = 'calendar-background-image background-overlay-static overlay-gradient-10 calendar-background-month-' + vm.currentDay.month();
            },
            dayClick: function(date, jsEvent, view) { //eslint-disable-line
                vm.currentDay = date;
            },
            eventClick: function(calEvent, jsEvent, view) { //eslint-disable-line
                $mdDialog.show({
                    controller: 'EventDialogController',
                    controllerAs: 'vm',
                    templateUrl: 'app/examples/calendar/event-dialog.tmpl.html',
                    targetEvent: jsEvent,
                    focusOnOpen: false,
                    locals: {
                        dialogData: {
                            title: 'Edit Event',
                            confirmButtonText: 'Save'
                        },
                        event: calEvent,
                        edit: true
                    }
                })
                .then(function(event) {
                    var toastMessage = 'Event Updated';
                    if(angular.isDefined(event.deleteMe) && event.deleteMe === true) {
                        // remove the event from the calendar
                        uiCalendarConfig.calendars['triangular-calendar'].fullCalendar('removeEvents', event._id);
                        // change toast message
                        toastMessage = 'Event Deleted';
                    }
                    else {
                        // update event
                        uiCalendarConfig.calendars['triangular-calendar'].fullCalendar('updateEvent', event);
                    }

                    // pop a toast
                    $mdToast.show(
                        $mdToast.simple()
                        .content($filter('triTranslate')(toastMessage))
                        .position('bottom right')
                        .hideDelay(2000)
                    );
                });
            }
        };

        vm.viewFormats = {
            'month': 'MMMM YYYY',
            'agendaWeek': 'w',
            'agendaDay': 'Do MMMM YYYY'
        };

        vm.eventSources = [{
            events: []
        }];

        function addEvent(event, $event) {
            var inAnHour = moment(vm.currentDay).add(1, 'h');
            $mdDialog.show({
                controller: 'EventDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/examples/calendar/event-dialog.tmpl.html',
                targetEvent: $event,
                focusOnOpen: false,
                locals: {
                    dialogData: {
                        title: 'Add Event',
                        confirmButtonText: 'Add'
                    },
                    event: {
                        title: $filter('triTranslate')('New Event'),
                        allDay: false,
                        start: vm.currentDay,
                        end: inAnHour,
                        palette: 'cyan',
                        stick: true
                    },
                    edit: false
                }
            })
            .then(function(event) {
                vm.eventSources[0].events.push(event);
                $mdToast.show(
                    $mdToast.simple()
                    .content($filter('triTranslate')('Event Created'))
                    .position('bottom right')
                    .hideDelay(2000)
                );
            });
        }

        function createRandomEvents(number, startDate, endDate) {
            var eventNames = ['Pick up the kids', 'Remember the milk', 'Meeting with Morris', 'Car service',  'Go Surfing', 'Party at Christos house', 'Beer Oclock', 'Festival tickets', 'Laundry!', 'Haircut appointment', 'Walk the dog', 'Dentist :(', 'Board meeting', 'Go fishing'];
            var locationNames = ['London', 'New York', 'Paris', 'Burnley'];
            for(var x = 0; x < number; x++) {
                var randomMonthDate = randomDate(startDate, endDate);
                var inAnHour = moment(randomMonthDate).add(1, 'h');
                var randomEvent = Math.floor(Math.random() * (eventNames.length - 0));
                var randomLocation = Math.floor(Math.random() * (locationNames.length - 0));
                var randomPalette = pickRandomProperty(triTheming.palettes);

                vm.eventSources[0].events.push({
                    title: eventNames[randomEvent],
                    allDay: false,
                    start: randomMonthDate,
                    end: inAnHour,
                    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis, fugiat! Libero ut in nam cum architecto error magnam, quidem beatae deleniti, facilis perspiciatis modi unde nostrum ea explicabo a adipisci!',
                    location: locationNames[randomLocation],
                    backgroundColor: triTheming.rgba(triTheming.palettes[randomPalette]['500'].value),
                    borderColor: triTheming.rgba(triTheming.palettes[randomPalette]['500'].value),
                    textColor: triTheming.rgba(triTheming.palettes[randomPalette]['500'].contrast),
                    palette: randomPalette
                });
            }
        }

        // listeners

        $scope.$on('addEvent', addEvent);

        // create 10 random events for the month
        createRandomEvents(100, moment().startOf('year'), moment().endOf('year'));

        function randomDate(start, end) {
            var startNumber = start.toDate().getTime();
            var endNumber = end.toDate().getTime();
            var randomTime = Math.random() * (endNumber - startNumber) + startNumber;
            return moment(randomTime);
        }

        function pickRandomProperty(obj) {
            var result;
            var count = 0;
            for (var prop in obj) {
                if (Math.random() < 1/++count) {
                    result = prop;
                }
            }
            return result;
        }
    }
})();

(function() {
    'use strict';

    moduleConfig.$inject = ["$stateProvider", "triMenuProvider"];
    angular
        .module('app.examples.calendar')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('triangular.calendar', {
            // set the url of this page
            url: '/calendar',
            views: {
                '@triangular': {
                    // set the html template to show on this page
                    templateUrl: 'app/examples/calendar/calendar.tmpl.html',
                    // set the controller to load for this page
                    controller: 'CalendarController',
                    controllerAs: 'vm'
                },
                'toolbar@triangular': {
                    templateUrl: 'app/examples/calendar/layouts/toolbar/toolbar.tmpl.html',
                    controller: 'CalendarToolbarController',
                    controllerAs: 'vm'
                },
                'belowContent@triangular': {
                    templateUrl: 'app/examples/calendar/calendar-fabs.tmpl.html',
                    controller: 'CalendarFabController',
                    controllerAs: 'vm'
                }
            },
            data: {
                layout: {
                    contentClass: 'triangular-non-scrolling layout-column',
                    footer: false
                },
                permissions: {
                    only: ['viewCalendar']
                }
            }
        });

        triMenuProvider.addMenu({
            // give the menu a name to show (should be translatable and in the il8n folder json)
            name: 'Calendar',
            // point this menu to the state we created in the $stateProvider above
            state: 'triangular.calendar',
            // set the menu type to a link
            type: 'link',
            // set an icon for this menu
            icon: 'zmdi zmdi-calendar-alt',
            // set a proirity for this menu item, menu is sorted by priority
            priority: 2.3,
            permission: 'viewCalendar'
        });
    }
})();

(function() {
    'use strict';

    CalendarFabController.$inject = ["$rootScope"];
    angular
        .module('app.examples.calendar')
        .controller('CalendarFabController', CalendarFabController);

    /* @ngInject */
    function CalendarFabController($rootScope) {
        var vm = this;
        vm.addEvent = addEvent;

        ////////////////

        function addEvent($event) {
            $rootScope.$broadcast('addEvent', $event);
        }
    }
})();
(function() {
    'use strict';

    moduleConfig.$inject = ["$stateProvider", "triMenuProvider"];
    angular
        .module('app.examples.authentication')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('authentication', {
            abstract: true,
            views: {
                'root': {
                    templateUrl: 'app/examples/authentication/layouts/authentication.tmpl.html'
                }
            },
            data: {
                permissions: {
                    only: ['viewAuthentication']
                }
            }
        })
        .state('authentication.login', {
            url: '/login',
            templateUrl: 'app/examples/authentication/login/login.tmpl.html',
            controller: 'LoginController',
            controllerAs: 'vm'
        })
        .state('authentication.signup', {
            url: '/signup',
            templateUrl: 'app/examples/authentication/signup/signup.tmpl.html',
            controller: 'SignupController',
            controllerAs: 'vm'
        })
        .state('authentication.lock', {
            url: '/lock',
            templateUrl: 'app/examples/authentication/lock/lock.tmpl.html',
            controller: 'LockController',
            controllerAs: 'vm'
        })
        .state('authentication.forgot', {
            url: '/forgot',
            templateUrl: 'app/examples/authentication/forgot/forgot.tmpl.html',
            controller: 'ForgotController',
            controllerAs: 'vm'
        })
        .state('triangular.profile', {
            url: '/profile',
            templateUrl: 'app/examples/authentication/profile/profile.tmpl.html',
            controller: 'ProfileController',
            controllerAs: 'vm'
        });

        triMenuProvider.addMenu({
            name: 'Authentication',
            icon: 'zmdi zmdi-account',
            type: 'dropdown',
            priority: 4.1,
            permission: 'viewAuthentication',
            children: [{
                name: 'Login',
                state: 'authentication.login',
                type: 'link'
            },{
                name: 'Sign Up',
                state: 'authentication.signup',
                type: 'link'
            },{
                name: 'Forgot Password',
                state: 'authentication.forgot',
                type: 'link'
            },{
                name: 'Lock Page',
                state: 'authentication.lock',
                type: 'link'
            },{
                name: 'Profile',
                state: 'triangular.profile',
                type: 'link'
            }]
        });
    }
})();

(function() {
    'use strict';

    angular
        .module('app.Authentication', [
        ]);

})();
(function() {
    'use strict';

    signupController.$inject = ["$scope", "$state", "$mdToast", "$http", "$filter", "NotificationService", "AuthenticationAPIService", "triSettings"];
    angular
        .module('app.Authentication')
        .controller('signupController', signupController);

    /* @ngInject */
    function signupController($scope, $state, $mdToast, $http, $filter, NotificationService, AuthenticationAPIService, triSettings) {
        var vm = this;
        vm.triSettings = triSettings;
        vm.signupClick = signupClick;
        vm.user = {
            username: '',
            email: '',
            password: '',
            confirm: ''
        };

        ////////////////

        function signupClick() {
            AuthenticationAPIService.signup(vm.user)
                                    .then(function(user)
                                    {
                                         NotificationService.popAToast('login as: ' + user.username + ' ?', 10000)
                                                            .then(function(response){
                                                                if(response == true)
                                                                { 
                                                                    $state.go('Authentication.login', {credentials: vm.user}) ;  
                                                                }
                                                            })      
                                    }).catch(function(error){
                                        NotificationService.popAToast(error.statusText+':'+error.status +' - '+ error.data.message );
                                    })
        }

    }
})();

(function() {
    'use strict';

    angular
        .module('app.examples.authentication')
        .controller('ProfileController', ProfileController);

    /* @ngInject */
    function ProfileController() {
        var vm = this;
        vm.settingsGroups = [{
            name: 'Account Settings',
            settings: [{
                title: 'Show my location',
                icon: 'zmdi zmdi-pin',
                enabled: true
            },{
                title: 'Show my avatar',
                icon: 'zmdi zmdi-face',
                enabled: false
            },{
                title: 'Send me notifications',
                icon: 'zmdi zmdi-notifications-active',
                enabled: true
            }]
        },{
            name: 'Chat Settings',
            settings: [{
                title: 'Show my username',
                icon: 'zmdi zmdi-account',
                enabled: true
            },{
                title: 'Make my profile public',
                icon: 'zmdi zmdi-account-box',
                enabled: false
            },{
                title: 'Allow cloud backups',
                icon: 'zmdi zmdi-cloud-upload',
                enabled: true
            }]
        }];
        vm.user = {
            name: 'Christos',
            email: 'info@oxygenna.com',
            location: 'Sitia, Crete, Greece',
            website: 'http://www.oxygenna.com',
            twitter: 'oxygenna',
            bio: 'We are a small creative web design agency \n who are passionate with our pixels.',
            current: '',
            password: '',
            confirm: ''
        };
    }
})();
(function() {
    'use strict';

    loginController.$inject = ["$state", "$stateParams", "AuthenticationService", "UserService", "AuthenticationAPIService", "NotificationService", "triSettings"];
    angular
        .module('app.Authentication')
        .controller('loginController', loginController);

    /* @ngInject */
    function loginController($state, $stateParams , AuthenticationService , UserService , AuthenticationAPIService, NotificationService, triSettings) {
        var vm = this;
        vm.loginClick = loginClick;
        vm.signup     = signup; 
        vm.socialLogins = [{
            icon: 'fa fa-twitter',
            color: '#5bc0de',
            url: '#'
        },{
            icon: 'fa fa-facebook',
            color: '#337ab7',
            url: '#'
        },{
            icon: 'fa fa-google-plus',
            color: '#e05d6f',
            url: '#'
        },{
            icon: 'fa fa-linkedin',
            color: '#337ab7',
            url: '#'
        }];
        vm.triSettings = triSettings;
        // create blank user variable for login form
        vm.credentials = {
            email: '',
            password: ''
        };

        // 
        init();

        function init()
        {
            if($stateParams.credentials)
                {
                    vm.credentials = angular.copy($stateParams.credentials);
                }

            AutoConnect();
        }
        ////////////////

        function AutoConnect()
        {
            AuthenticationService.getUserByToken()
                                 .then(function(user) {
                                    NotificationService.popAToast('Connect as: ' + user.username + ' ?', 10000)
                                    .then(function(response){
                                        if(response == true)
                                        {
                                            NotificationService.popAToast('Wellcome back ' + UserService.getCurrentUser().username, 3000);
                                            $state.go('triangular.products-manage') ;  
                                        }
                                    })                          
                        })
                        .catch(function(err) {
                            // it's okey, just conenct with crentials.
                        })
        }
        
        function loginClick() {
                Promise.resolve(AuthenticationService.login(vm.credentials))
                       .then(function(User) {
                               UserService.setCurrentUser(User);
                               NotificationService.popAToast('Wellcome back ' + UserService.getCurrentUser().username, 3000);
                               $state.go('triangular.products-manage') ;
                        })
                        .catch(function(err) {
                                NotificationService.popAToast('Error: '+ err.status + err.statusText + ' : ' + err.data, 5000);
                        }) 
        }

        function signup(){

            $state.go('Authentication.signup') ;
        }


    }
})();

(function() {
    'use strict';

    LockController.$inject = ["$state", "triSettings"];
    angular
        .module('app.examples.authentication')
        .controller('LockController', LockController);

    /* @ngInject */
    function LockController($state, triSettings) {
        var vm = this;
        vm.loginClick = loginClick;
        vm.user = {
            name: 'Morris Onions',
            email: 'info@oxygenna.com',
            password: ''
        };
        vm.triSettings = triSettings;

        ////////////////

        // controller to handle login check
        function loginClick() {
            // user logged in ok so goto the dashboard
            $state.go('triangular.dashboard-general');
        }
    }
})();
(function() {
    'use strict';

    ForgotController.$inject = ["$scope", "$state", "$mdToast", "$filter", "$http", "triSettings"];
    angular
        .module('app.examples.authentication')
        .controller('ForgotController', ForgotController);

    /* @ngInject */
    function ForgotController($scope, $state, $mdToast, $filter, $http, triSettings) {
        var vm = this;
        vm.triSettings = triSettings;
        vm.user = {
            email: ''
        };
        vm.resetClick = resetClick;

        ////////////////

        function resetClick() {
            $mdToast.show(
                $mdToast.simple()
                .content($filter('triTranslate')('Your new password has been mailed'))
                .position('bottom right')
                .action($filter('triTranslate')('Login'))
                .highlightAction(true)
                .hideDelay(0)
            ).then(function() {
                $state.go('authentication.login');
            });
        }
    }
})();

(function() {
    'use strict';

    runFunction.$inject = ["$rootScope", "$timeout", "$window"];
    angular
        .module('triangular')
        .run(runFunction);

    /* @ngInject */
    function runFunction($rootScope, $timeout, $window) {
        // add a class to the body if we are on windows
        if($window.navigator.platform.indexOf('Win') !== -1) {
            $rootScope.bodyClasses = ['os-windows'];
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('triangular')
        .provider('triSettings', settingsProvider);

    /* @ngInject */
    function settingsProvider() {
        // Provider
        var settings = {
            languages: [],
            name: '',
            logo: '',
            copyright: '',
            version: ''
        };

        this.addLanguage = addLanguage;
        this.setLogo = setLogo;
        this.setName = setName;
        this.setCopyright = setCopyright;
        this.setVersion = setVersion;

        function addLanguage(newLanguage) {
            settings.languages.push(newLanguage);
        }

        function setLogo(logo) {
            settings.logo = logo;
        }

        function setName(name) {
            settings.name = name;
        }

        function setCopyright(copy) {
            settings.copyright = copy;
        }

        function setVersion(version) {
            settings.version = version;
        }

        // Service
        this.$get = function() {
            return {
                languages: settings.languages,
                name: settings.name,
                copyright: settings.copyright,
                logo: settings.logo,
                version: settings.version,
                defaultSkin: settings.defaultSkin
            };
        };
    }
})();


(function() {
    'use strict';

    routeConfig.$inject = ["$stateProvider"];
    angular
        .module('triangular')
        .config(routeConfig);

    /* @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
        .state('triangular', {
            abstract: true,
            views: {
                'root': {
                    templateUrl: 'app/triangular/layouts/states/triangular/triangular.tmpl.html',
                    controller: 'TriangularStateController',
                    controllerAs: 'stateController'
                },
                'sidebarLeft@triangular': {
                    templateProvider: ["$templateRequest", "triLayout", function($templateRequest, triLayout) {
                        if(angular.isDefined(triLayout.layout.sidebarLeftTemplateUrl)) {
                            return $templateRequest(triLayout.layout.sidebarLeftTemplateUrl);
                        }
                    }],
                    controllerProvider: ["triLayout", function(triLayout) {
                        return triLayout.layout.sidebarLeftController;
                    }],
                    controllerAs: 'vm'
                },
                'sidebarRight@triangular': {
                    templateProvider: ["$templateRequest", "triLayout", function($templateRequest, triLayout) {
                        if(angular.isDefined(triLayout.layout.sidebarRightTemplateUrl)) {
                            return $templateRequest(triLayout.layout.sidebarRightTemplateUrl);
                        }
                    }],
                    controllerProvider: ["triLayout", function(triLayout) {
                        return triLayout.layout.sidebarRightController;
                    }],
                    controllerAs: 'vm'
                },
                'toolbar@triangular': {
                    templateProvider: ["$templateRequest", "triLayout", function($templateRequest, triLayout) {
                        if(angular.isDefined(triLayout.layout.toolbarTemplateUrl)) {
                            return $templateRequest(triLayout.layout.toolbarTemplateUrl);
                        }
                    }],
                    controllerProvider: ["triLayout", function(triLayout) {
                        return triLayout.layout.toolbarController;
                    }],
                    controllerAs: 'vm'
                },
                'loader@triangular': {
                    templateProvider: ["$templateRequest", "triLayout", function($templateRequest, triLayout) {
                        if(angular.isDefined(triLayout.layout.loaderTemplateUrl)) {
                            return $templateRequest(triLayout.layout.loaderTemplateUrl);
                        }
                    }],
                    controllerProvider: ["triLayout", function(triLayout) {
                        return triLayout.layout.loaderController;
                    }],
                    controllerAs: 'loader'
                }
            }
        });
    }
})();

(function() {
    'use strict';

    angular
        .module('app.translate', [
            'pascalprecht.translate',
            'LocalStorageModule'
        ]);
})();

(function() {
    'use strict';

    translateConfig.$inject = ["$translateProvider", "$translatePartialLoaderProvider", "triSettingsProvider"];
    angular
        .module('app.translate')
        .config(translateConfig);

    /* @ngInject */
    function translateConfig($translateProvider, $translatePartialLoaderProvider, triSettingsProvider) {
        /*var appLanguages = [{
            name: 'Chinese',
            key: 'zh'
        },{
            name: 'English',
            key: 'en'
        },{
            name: 'French',
            key: 'fr'
        },{
            name: 'Portuguese',
            key: 'pt'
        }]; */

        var appLanguages = [{
            name: 'English',
            key: 'en'
        },{
            name: 'French',
            key: 'fr'
        }];
        /**
         *  each module loads its own translation file - making it easier to create translations
         *  also translations are not loaded when they aren't needed
         *  each module will have a i18n folder that will contain its translations
         */
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: '{part}/i18n/{lang}.json'
        });

        $translatePartialLoaderProvider.addPart('app');

        // make sure all values used in translate are sanitized for security
        $translateProvider.useSanitizeValueStrategy('sanitize');

        // cache translation files to save load on server
        $translateProvider.useLoaderCache(true);

        // setup available languages in angular translate & triangular
        var angularTranslateLanguageKeys = [];
        for (var language in appLanguages) {
            // add language key to array for angular translate
            angularTranslateLanguageKeys.push(appLanguages[language].key);

            // tell triangular that we support this language
            triSettingsProvider.addLanguage({
                name: appLanguages[language].name,
                key: appLanguages[language].key
            });
        }

        /**
         *  try to detect the users language by checking the following
         *      navigator.language
         *      navigator.browserLanguage
         *      navigator.systemLanguage
         *      navigator.userLanguage
         */
        $translateProvider
        .registerAvailableLanguageKeys(angularTranslateLanguageKeys, {
            'en_US': 'en',
            'en_UK': 'en'
        })
        .use('en');

        // store the users language preference in a cookie
        $translateProvider.useLocalStorage();
    }
})();

(function() {
    'use strict';

    angular
        .module('seed-module', [
        ]);
})();
(function() {
    'use strict';

    moduleConfig.$inject = ["$stateProvider", "triMenuProvider"];
    angular
        .module('seed-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('triangular.seed-page', {
            url: '/seed-module/seed-page',
            templateUrl: 'app/seed-module/seed-page.tmpl.html',
            // set the controller to load for this page
            controller: 'SeedPageController',
            controllerAs: 'vm',
            // layout-column class added to make footer move to
            // bottom of the page on short pages
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        });

        triMenuProvider.addMenu({
            name: 'Seed Module',
            icon: 'fa fa-tree',
            type: 'dropdown',
            priority: 1.1,
            children: [{
                name: 'Start Page',
                state: 'triangular.seed-page',
                type: 'link'
            }]
        });
    }
})();

(function() {
    'use strict';

    angular
        .module('seed-module')
        .controller('SeedPageController', SeedPageController);

    /* @ngInject */
    function SeedPageController() {
        var vm = this;
        vm.testData = ['triangular', 'is', 'great'];
    }
})();
(function() {
    'use strict';

    UserService.$inject = ["$q", "$http", "$rootScope", "RoleStore", "$cookies", "AuthenticationService", "ErrorService", "AuthErrorService"];
    angular
        .module('app.permission')
        .factory('UserService', UserService);

    /* @ngInject */
    function UserService($q, $http, $rootScope,  RoleStore, $cookies , AuthenticationService, ErrorService, AuthErrorService) {
        var currentUser = {};
        var DefaultUser = {
                            username: 'UnknowsnUser',
                            displayName: 'UNKNOWNUSER',
                            avatar: 'assets/images/avatars/noavatar.png',
                            password: 'hagerhager',
                            roles: ['ANONYMOUS']
                         };

        var service = {
            getCurrentUser: getCurrentUser,
            getUsers: getUsers,
            hasPermission: hasPermission,
            setCurrentUser: setCurrentUser,
            setDefaultUser: setDefaultUser,
            reinitUser: reinitUser
        };

        return service;

        ///////////////

        function setDefaultUser(){
            if(currentUser.username == undefined)
            {
                setCurrentUser(DefaultUser);
            }
        }
        function getCurrentUser() {
            return currentUser;
        }

        function setCurrentUser(user){
            currentUser = user;
            $cookies.put('tri-user', user.username);
            $rootScope.$broadcast('AppUserChanged');
        }

        function getUsers() {
            return $http.get('app/permission/data/users.json');
        }

        function checkPermission(permission)
        {
            let promise = new Promise(function(resolve, reject){
            var hasPermission = false;
                // check if user has permission via its roles
                angular.forEach(currentUser.roles, function(role) {
                    // check role exists
                    if(RoleStore.hasRoleDefinition(role)) {
                        // get the role
                        var roles = RoleStore.getStore();

                        if(angular.isDefined(roles[role])) {
                            // check if the permission we are validating is in this role's permissions
                            if(-1 !== roles[role].validationFunction.indexOf(permission)) {
                                hasPermission = true;
                            }
                        }
                    }
                });

                // if we have permission resolve otherwise reject the promise
                if(hasPermission == true) {
                    resolve(ErrorService.AppError('NoError' , 'user has Permission.'));
                }
                else if(hasPermission == false) {
                    if( getCurrentUser().username)
                        reject(ErrorService.AppError('PermissionError' , 'user has not Permission.'));
                    else
                        reject(ErrorService.AppError('PermissionError' , 'user not Found.'));
                }
            })
            // return promise
            return promise;        
        }

        function hasPermission(permissionName) 
        {
            if(getCurrentUser().username != undefined)
            {
                return checkPermission(permissionName);
            } 
            else
            {
                return Promise.resolve( AuthenticationService.getUserByToken()
                                                             .then(function(user)
                                                                 {
                                                                    setCurrentUser(user);
                                                                    return checkPermission(permissionName);
                                                                 })
                                                             .catch(function(error)
                                                                {
                                                                    //setDefaultUser();
                                                                    if(permissionName == 'viewAuthentication')
                                                                        {
                                                                            return Promise.resolve('Login please.');
                                                                        }
                                                                    else
                                                                    {
                                                                        if(error.ErrorType == 'PermissionError')
                                                                        {
                                                                            if(error.Error == 'has not Permission.')
                                                                               {
                                                                                    $rootScope.$broadcast('$stateChangePermissionDenied');
                                                                               }
                                                                            else if(error.Error == 'No user Found.')
                                                                                {
                                                                                    AuthErrorService.AuthError('AuthorisationDenied');
                                                                                }
                                                                        }
                                                                        else if(error.ErrorType == 'AuthenticationError')
                                                                        {
                                                                            AuthErrorService.AuthError('AuthorisationDenied');
                                                                        }
                                                                        return Promise.reject(error);                                                                    
                                                                    }

                                                                })
                                      );                    
          }           
        }

        function reinitUser() {
                $cookies.remove('tri-user');
                setCurrentUser({});
        };

    }
})();

(function() {
    'use strict';

    permissionRun.$inject = ["$rootScope", "$cookies", "$state", "PermissionStore", "RoleStore", "UserService"];
    angular
        .module('app.permission')
        .run(permissionRun);

    /* @ngInject */
    function permissionRun($rootScope, $cookies, $state, PermissionStore, RoleStore, UserService) {

        initmodule();

        function initRoles(){
            // create roles for app
            RoleStore.defineManyRoles({
                'SUPERADMIN': ['viewStandards' , 'viewAddStandards', 'viewDeleteStandards' , 'viewProducts' ,'viewUpdateStd' ,'viewAddProducts', 'viewDeleteProducts' , 'viewPCA' , 'viewDashboard', 'viewAuthentication'],
                'ADMIN':      ['viewStandards' , 'viewAddStandards','viewProducts' , 'viewAddProducts', 'viewUpdateStd', 'viewPCA' ,'viewDashboard' , 'viewAuthentication'],
                'USER':       ['viewAuthentication' ,'viewProducts' , 'viewAddProducts'],
                'ANONYMOUS':  ['viewAuthentication' ,'viewStandards', 'viewProducts']
            });
        }

        function initPermissions(){
            // create permissions and add check function verify all permissions

            var permissions = ['viewStandards' , 'viewAddStandards', 'viewDeleteStandards' , 'viewProducts' , 'viewUpdateStd', 'viewAddProducts', 'viewDeleteProducts' , 'viewPCA' , 'viewDashboard', 'viewAuthentication'];
            PermissionStore.defineManyPermissions(permissions, function (permissionName) {
                return UserService.hasPermission(permissionName);
            });
        }

        function initmodule(){
            initRoles();
            initPermissions();
        }
        ///////////////////////

        // default redirect if access is denied
        function accessDenied() {
            $state.go('401');
        }

        // watches

        // redirect all denied permissions to 401
        var deniedHandle = $rootScope.$on('$stateChangePermissionDenied', accessDenied);

        // remove watch on destroy
        $rootScope.$on('$destroy', function() {
            deniedHandle();
        });
    }
})();

(function() {
    'use strict';

    permissionConfig.$inject = ["$stateProvider", "triMenuProvider"];
    angular
        .module('app.permission')
        .config(permissionConfig);

    /* @ngInject */
    function permissionConfig($stateProvider, triMenuProvider) {
        $stateProvider
        .state('triangular.permission', {
            url: '/permission',
            templateUrl: 'app/permission/pages/permission.tmpl.html',
            controller: 'PermissionController',
            controllerAs: 'vm',
            data: {
                layout: {
                    contentClass: 'layout-column'
                }
            }
        });

    }
})();

(function() {
    'use strict';

    angular
        .module('app.Notification', [
            ]);        
})();
(function() {
    'use strict';

    NotificationService.$inject = ["$http", "$log", "$filter", "$rootScope", "$cookies", "NotificationAPIService", "$timeout", "$mdToast", "triLoaderService"];
    angular
        .module('app.Notification')
        .factory('NotificationService', NotificationService);

    /* @ngInject */
    function NotificationService($http, $log, $filter, $rootScope, $cookies , NotificationAPIService , $timeout, $mdToast , triLoaderService) {
        var service = {
            popAToast: popAToast,
            showLoader: showLoader,
            RightSidebarNotif:RightSidebarNotif,
            getNotifications:getNotifications
        };

        return service;
 
        function popAToast(message, HideDelay) {

         var toast = $mdToast.simple()
                .textContent($filter('triTranslate')(message)) 
                .highlightAction(true)
                .hideDelay(HideDelay)
                .action('OK')
                .position('bottom right');
          return $mdToast.show(toast)
                         .then(function (response) {
                            return true;
                        }).catch(function(error){
                            // do nothing.
                        })
        }
 
        ////////////

        function showLoader(time) {
            // turn the loader on
            triLoaderService.setLoaderActive(true);

            // wait for a while
            $timeout(function() {
                // now turn it off
                triLoaderService.setLoaderActive(false);
            }, time * 1000);
        }

        function RightSidebarNotif(GroupName, Action ,NotificationMessage, User)
            {
                var NotificationObj = {
                    GroupName: GroupName,
                    title: NotificationMessage,
                    icon: '',
                    iconColor: '',
                    date: '',
                    User: User
                };
 
                if(Action == 'Add')
                {
                    NotificationObj.icon = 'fa fa-plus';
                    NotificationObj.iconColor = 'rgb(76, 175, 80)';
                }
                else if(Action == 'Delete')
                {
                    NotificationObj.icon = 'fa fa-minus';
                    NotificationObj.iconColor = 'rgb(244,81,30)';
                }
                else if(Action == 'Update')
                {
                    NotificationObj.icon = 'fa fa-cloud-upload';
                    NotificationObj.iconColor = 'rgb(255,171,0)';
                } 
                
                NotificationObj.date = moment(Date.now());

                NotificationAPIService.storeNotification(NotificationObj);

                $rootScope.$broadcast( GroupName + 'Notification' , NotificationObj);
                $rootScope.$broadcast( 'ToolbarNotification');
            
            }

        function getNotifications()
          {
            return Promise.resolve(NotificationAPIService.getNotifications());
          }
        
    }

})();

(function() {
    'use strict';

    NotificationAPIService.$inject = ["$http", "API_HGLABS", "$log", "$mdToast", "AuthenticationService", "$state", "$cookies"];
    angular
        .module('app.products')
        .factory('NotificationAPIService', NotificationAPIService);

    /* @ngInject */
    function NotificationAPIService($http,API_HGLABS, $log, $mdToast, AuthenticationService, $state, $cookies) {
        var service = {
            getNotifications: getNotifications,
            storeNotification:storeNotification
        };

        var BaseUrlAPI = API_HGLABS.url + 'functionalities/notifications';

        return service;

        function getNotifications() {
            let promise = new Promise(function(resolve, reject){
                $http({
                    method: 'GET',
                    url: BaseUrlAPI 
                })
                .then(function(response) {
                    resolve(response.data);
                })
                .catch(function(error) {
                    if(error.status == -1)
                    {
                        popAToast('API Server is not responding.', 10000)
                    }
                });
            });
            return promise;
        }
 
        function storeNotification(notification) {
            return Promise.resolve( AuthenticationService.getAuthToken()
                .then(function (Authentication) {
                    if(Authentication.Authorization == true)
                    {
                    let promise = new Promise(function(resolve, reject){
                        $http({
                            method: 'POST',
                            url: BaseUrlAPI,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': Authentication.AuthToken
                            },
                            data: { notification : notification }
                        })
                        .then(function(response) {
                            resolve(response);
                        })
                        .catch(function(error) {
                            $log.error('Create Notification ERROR:', error);
                            if(error.status == 401)
                                redirectError();
                        });
                    });
                    return promise;
                    }
                })
              .catch(function(error)
              {
                NotificationService.popAToast('API ERROR.', 10000);
              })
          );
        }

        // default redirect if access is denied
        function redirectError() {
            $state.go('401');
        }
 
    }

})();

(function() {
    'use strict';

    angular
        .module('app.laboratory', [            
        	'app.standards',
            'app.products',
            'app.pca',
            'app.Authentication',
            'app.Notification',
            'app.Error',
            'app.Idle',
            'app.documents'
        ])
        // set a constant for the API we are connecting to
        .constant('API_HGLABS', {
            'url':  'http://52.174.145.29:3030/api/lab/'
        })
        .constant('API_HGLABS_BASE', {
            'url':  'http://52.174.145.29:3030/api/'
        });     
})();
(function() {
    'use strict';

    angular
        .module('app.examples', [
            /*'app.examples.authentication',
            'app.examples.calendar',
            'app.examples.charts',
            'app.examples.dashboards',
            'app.examples.elements',
            'app.examples.email', 
            'app.examples.ui',*/
            'app.examples.extras',
            /*'app.examples.forms',
            'app.examples.github',
            'app.examples.layouts', 
            'app.examples.maps',
            'app.examples.menu',
            'app.examples.todo',*/
           
        ]);
})();
(function() {
    'use strict';

    angular
        .module('app.Error', [
            ]);        
})();
(function() {
    'use strict';

    ErrorService.$inject = ["$http", "$log", "$rootScope", "$cookies", "$timeout", "$state"];
    angular
        .module('app.Error')
        .factory('ErrorService', ErrorService);

    /* @ngInject */
    function ErrorService($http, $log, $rootScope, $cookies, $timeout, $state ) {
        var service = {
            AppError: AppError
        };

        return service;
 
        ////////////

        function AppError(ErrorType , Error)
        {
            var AppError = {
                            ErrorType : ErrorType,
                            Error: Error
                          };
            return AppError
        }
        
    }

})();


(function() {
    'use strict';

    AuthErrorService.$inject = ["$http", "$log", "$rootScope", "$cookies", "$timeout", "$state", "NotificationService", "AuthenticationService", "triLoaderService"];
    angular
        .module('app.Error')
        .factory('AuthErrorService', AuthErrorService);

    /* @ngInject */
    function AuthErrorService($http, $log, $rootScope, $cookies, $timeout, $state , NotificationService , AuthenticationService , triLoaderService) {
        var service = {
            httpError: httpError,
            AuthError: AuthError,
            UnauthorisedHundler:UnauthorisedHundler,
        };

        return service;
 
        ////////////

        function AuthError(error){
            NotificationService.popAToast('you are not Authorised to perform this action, please login with a Valid Account.', 10000);
            $state.go('Authentication.login');
        }

        function UnauthorisedHundler(appmessage)
        {
            AuthenticationService.getAuthToken()
                                 .then(function(resolve){
                                        // add control of token validity, to prevent access with false tokens even if the api will not respond
                                        // idea: give to server, couple of: (Token, username), associate that with a limiter to prevent force access.
                                        $log.error('Unauthorised: ' + appmessage);
                                        $state.go('401');
                                  })
                                .catch(function(err){
                                        $log.error('Unauthorised: ' + appmessage);
                                        $state.go('Authentication.login');
                                 })            
        }

        function httpError(error, appmessage)
          {
            if(error.status == 401)
                {
                    UnauthorisedHundler(appmessage);
                }
            else if(error.status == 404)
                {
                    $log.error('Not Found: ' + appmessage);
                    $state.go('404');
                }
            else if(error.status == -1)
                {
                    $log.error('Server not responding: ' + appmessage);
                    NotificationService.popAToast('API Server Not responding: ' + appmessage, 10000);
                }        
            else if(error.status == 500)
                {
                    $log.error('Internal server Error.' + appmessage);
                    NotificationService.popAToast('Internal server Error:' + appmessage, 10000);
                }
            else if(error.status == 4040)
            {
                $log.error('Not found.' + appmessage);
                NotificationService.popAToast(appmessage, 10000);
            }
          }
        
    }

})();

(function() {
    'use strict';

    runFunction.$inject = ["$rootScope", "$state", "$cookies", "AuthenticationService", "$log", "UserService", "ErrorService"];
    angular
        .module('app.Authentication')
        .run(runFunction);

    /* @ngInject */
    function runFunction($rootScope, $state, $cookies , AuthenticationService , $log, UserService, ErrorService) {
 
         $rootScope.$on('$stateChangePermissionStart',  function(event, toState, toParams, options) {
             /* if(toState.name != 'authentication.login')
              {
                AuthenticationService.isAuthenticated()
                                     .then(function(Authentication){
                                            UserService.setCurrentUser(user);
                                     })
                                     .catch(function(error)
                                     {
                                        ErrorService.httpError(error, 'Authentication Error.');
                                     })
              } */
         });   

    }
})();

(function() {
    'use strict';

    moduleConfig.$inject = ["$stateProvider", "triMenuProvider"];
    angular
        .module('app.Authentication')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
        .state('Authentication', {
            abstract: true,
            views: {
                'root': {
                    templateUrl: 'app/authentication/layouts/authentication.tmpl.html'
                }
            },
            data: {
                permissions: {
                    only: ['viewAuthentication']
                }
            }
        })
        .state('Authentication.login', {
            url: '/login',
            templateUrl: 'app/authentication/login/login.tmpl.html',
            params: {
                 credentials: null
            },
            controller: 'loginController',
            controllerAs: 'vm'
        }) 
        .state('Authentication.signup', {
            url: '/signup',
            templateUrl: 'app/authentication/signup/signup.tmpl.html',
            controller: 'signupController',
            controllerAs: 'vm'
        });
        
    }
})();

(function() {
    'use strict';

    AuthenticationService.$inject = ["$http", "API_HGLABS", "$log", "AuthenticationAPIService", "ErrorService", "$window", "$state", "$rootScope", "$cookies"];
    angular
        .module('app.Authentication')
        .factory('AuthenticationService', AuthenticationService);

    /* @ngInject */
    function AuthenticationService($http,API_HGLABS, $log, AuthenticationAPIService , ErrorService , $window , $state, $rootScope , $cookies) {
        var service = {
            getAuthToken: getAuthToken,
            getUserByToken:getUserByToken,
            isAuthenticated: isAuthenticated,
            login: login,
            logout: logout
        };

        var AuthToken = '';

        return service;
 
        function login(credentials)
        {
            return Promise.resolve(
            Promise.resolve(AuthenticationAPIService.login(credentials))
                   .then(function(response) {
                                storeAccessToken(response.Auth_token);
                                return Promise.resolve(response.user);
                        })
                        .catch(function(err) {
                                return Promise.reject(err);
                        }) 
            );
        }

        function logout()
        {
             $cookies.remove('Hager_Lab_Auth_Token');
             $state.go('Authentication.login');
             //$window.location.reload();
        }

        function getUserByToken()
        {
            return Promise.resolve( getAuthToken()
                          .then(function(Authentication) {
                                return Promise.resolve( AuthenticationAPIService.getUserbyToken(Authentication.AuthToken)
                                                        .then(function(User) {
                                                            return Promise.resolve(User);
                                                        })
                                                        .catch(function(err)
                                                        {
                                                            return Promise.reject(ErrorService.AppError('AuthenticationError' , 'Invalid Access Token.'));
                                                        })
                                                    )
                            })
                            .catch(function(TypeError) {
                                    return Promise.reject(TypeError);
                            })
                    );
        }

        function isAuthenticated(username)
        {
            return Promise.resolve( getAuthToken()
                          .then(function(Authentication) {
                                return Promise.resolve( AuthenticationAPIService.AuthenticationCheck(Authentication.AuthToken, username ) 
                                                        .then(function(response) {
                                                            return Promise.resolve(response);
                                                        })
                                                        .catch(function(err)
                                                        {
                                                            return Promise.reject( ErrorService.AppError('AuthenticationError' , 'Invalid Access Token.'));
                                                        })
                                                    )
                            })
                            .catch(function(TypeError) {
                                    return Promise.reject(TypeError);
                            })
                    );
        }

        function getAuthToken() {
            var Authentication = { Authorization: '', AuthToken: ''  };
            let promise = new Promise(function(resolve, reject){
                if($cookies.get('Hager_Lab_Auth_Token'))
                {
                    AuthToken = angular.fromJson($cookies.get('Hager_Lab_Auth_Token'))._Hager_Lab_Auth_Token;
                    Authentication.Authorization = true;
                    Authentication.AuthToken = AuthToken;
                    resolve(Authentication);
                }
                else 
                {
                  Authentication.Authorization = false;
                  reject( ErrorService.AppError('AuthenticationError' , 'Auth Token Not found.') );
                }
            });
            return promise;
        }

        function storeAccessToken(Token)
        {
            $cookies.put('Hager_Lab_Auth_Token',angular.toJson({
                    _Hager_Lab_Auth_Token: 'Bearer '+ Token
            }));
        }
    }

})();
(function() {
    'use strict';

    AuthenticationAPIService.$inject = ["$http", "API_HGLABS_BASE", "$log", "$mdToast", "$state", "$cookies"];
    angular
        .module('app.Authentication')
        .factory('AuthenticationAPIService', AuthenticationAPIService);

    /* @ngInject */
    function AuthenticationAPIService($http,API_HGLABS_BASE, $log, $mdToast,$state, $cookies) {
        var service = {
            login: login,
            signup:signup,
            getUserbyToken: getUserbyToken,
            AuthenticationCheck: AuthenticationCheck
        };

        var AuthToken = '';

        return service;

        init();

        function getUserbyToken(Token)
        {
            let promise = new Promise(function(resolve, reject){
                $http({
                        method: 'GET',
                        url: API_HGLABS_BASE.url + 'users' ,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': Token
                        }
                    })
                .then(function(response) {
                    resolve(response.data);
                })
                .catch(function(error) {
                    reject(error);
                });
            });
            return promise;
        }
 
        function AuthenticationCheck(Token, username)
        {
            let promise = new Promise(function(resolve, reject){
                $http({
                        method: 'POST',
                        url: API_HGLABS_BASE.url + 'users/AuthCheck' ,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': Token
                        },
                        data: {username: Promise.resolve(username) }
                    })
                .then(function(response) {
                    resolve(response.data);
                })
                .catch(function(error) {
                    reject(error);
                });
            });
            return promise;
        }

        function login(credentials) {
            let promise = new Promise(function(resolve, reject){
                $http({
                        method: 'POST',
                        url: API_HGLABS_BASE.url + 'auth/login' ,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        data: credentials
                    })
                .then(function(response) {
                    resolve(response.data);
                })
                .catch(function(error) {
                    reject(error);
                });
            });
            return promise;
        }

        function signup(infos) {
            let promise = new Promise(function(resolve, reject){
                $http({
                        method: 'POST',
                        url: API_HGLABS_BASE.url + 'users/signup' ,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        data: infos
                    })
                .then(function(response) {
                    resolve(response.data);
                })
                .catch(function(error) {
                    reject(error);
                });
            });
            return promise;
        }
 
    }

})();

(function() {
    'use strict';

    angular
        .module('app.Idle', ['ngIdle'
            ]);        
})();
(function() {
    'use strict';

    Idlerun.$inject = ["Idle", "$rootScope", "$log", "$mdDialog", "UserService", "AuthenticationService", "NotificationService"];
    angular
        .module('app.Idle')
        .run(Idlerun);

    /* @ngInject */
    function Idlerun(Idle, $rootScope, $log , $mdDialog ,UserService , AuthenticationService , NotificationService) {

        function isConnected() {
            var status = false;
            if(UserService.getCurrentUser().username)
            {
                status = true;
            }
            return status;
        }
        function createDialog(dialog) {
            $mdDialog.show({
                title: 'LOGOUT',
                template:
                   '<md-dialog aria-label="List dialog">' +
                   "  <md-dialog-content> " + 
                   ' <md-subheader class="md-whiteframe-z3 margin-20 text-center" palette-background="amber:500">' +
                   "  You will be logged out soon." +
                   " </md-subheader>"+
                   '  </md-dialog-content>' +
                   '</md-dialog>',
                clickOutsideToClose: true
            });
        }

        // start watching when the app runs. also starts the Keepalive service by default.
        Idle.watch();

        $rootScope.$on('IdleStart', function() {
            // the user appears to have gone idle
            //$log.info('coucou , tu bouges pas.');
            if(isConnected())
            {
                //NotificationService.popAToast("You're going to be loged out soon.", 10000);
                //newDialog.content = '';
                createDialog();
            }
        });

        $rootScope.$on('IdleWarn', function(e, countdown) {
            // follows after the IdleStart event, but includes a countdown until the user is considered timed out
            // the countdown arg is the number of seconds remaining until then.
            // you can change the title or display a warning dialog from here.
            // you can let them resume their session by calling Idle.watch()
            //$log.info('coucou , attention');
            if(isConnected())
            {

            }
        });

        $rootScope.$on('IdleTimeout', function() {
            // the user has timed out (meaning idleDuration + timeout has passed without any activity)
            // this is where you'd log them
            if(isConnected())
            {
                NotificationService.popAToast('See you soon ' + UserService.getCurrentUser().username, 3000);
                $mdDialog.hide();
                UserService.reinitUser();
                AuthenticationService.logout(); 
                Idle.watch();
            }
        });

        $rootScope.$on('IdleEnd', function() {
            // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog
            //$log.info('coucou , ouf, t es revenu');
            if(isConnected())
            {
                $mdDialog.hide();
                NotificationService.popAToast('Wellcome back ' + UserService.getCurrentUser().username, 3000);
            }
        });

        $rootScope.$on('Keepalive', function() {
            // do something to keep the user's session alive
            //$log.info('coucou , tu ça bouge artificiellement.');
            if(isConnected())
            {

            }
        });   
    }

})();

(function() {
    'use strict';

    IdleConfig.$inject = ["IdleProvider", "KeepaliveProvider"];
    angular
        .module('app.Idle')
        .config(IdleConfig);

    /* @ngInject */
    function IdleConfig(IdleProvider, KeepaliveProvider) {

        // configure Idle settings
        IdleProvider.idle(600); // in seconds
        IdleProvider.timeout(10); // in seconds
        KeepaliveProvider.interval(2); // in seconds
    }

})();


(function() {
    'use strict';

    angular
        .module('app')
        .value('googleChartApiConfig', {
            version: '1.1',
            optionalSettings: {
                packages: ['line', 'bar', 'geochart', 'scatter'],
                language: 'en'
            }
        });
})();
(function() {
    'use strict';

    triTranslateFilter.$inject = ["$injector", "$filter"];
    angular
        .module('triangular')
        .filter('triTranslate', triTranslateFilter);

    /* @ngInject */
    function triTranslateFilter($injector, $filter) {
        return function(input) {
            // if angular translate installed this will return true
            // so we can translate
            if($injector.has('translateFilter')) {
                return $filter('translate')(input);
            }
            else {
                // no translation active so just return the same input
                return input;
            }
        };
    }
})();

(function() {
    ErrorPageController.$inject = ["$state"];
    angular
        .module('app')
        .controller('ErrorPageController', ErrorPageController);

    /* @ngInject */
    function ErrorPageController($state) {
        var vm = this;

        vm.goHome = goHome;

        /////////

        function goHome() {
            $state.go('triangular.products-manage');
        }
    }
})();

(function() {
    'use strict';

    themesConfig.$inject = ["$mdThemingProvider", "triThemingProvider", "triSkinsProvider"];
    angular
        .module('app')
        .config(themesConfig);

    /* @ngInject */
    function themesConfig ($mdThemingProvider, triThemingProvider, triSkinsProvider) {
        /**
         *  PALETTES
         */
        $mdThemingProvider.definePalette('white', {
            '50': 'ffffff',
            '100': 'ffffff',
            '200': 'ffffff',
            '300': 'ffffff',
            '400': 'ffffff',
            '500': 'ffffff',
            '600': 'ffffff',
            '700': 'ffffff',
            '800': 'ffffff',
            '900': 'ffffff',
            'A100': 'ffffff',
            'A200': 'ffffff',
            'A400': 'ffffff',
            'A700': 'ffffff',
            'contrastDefaultColor': 'dark'
        });
 
        $mdThemingProvider.definePalette('blue', {
            '50': 'e1e1e1',
            '100': 'b6b6b6',
            '200': '8c8c8c',
            '300': '646464',
            '400': '3a3a3a',
            '500': 'e1e1e1',
            '600': 'e1e1e1',
            '700': '232323',
            '800': '1a1a1a',
            '900': '00477d',
            'A100': '3a3a3a',
            'A200': 'ffffff',
            'A400': 'ffffff',
            'A700': 'ffffff',
            'contrastDefaultColor': 'light'
        });

        $mdThemingProvider.definePalette('hagerblue', {
            '100': '204f6c',
            '50': '204f6c',
            '200': '204f6c',
            '300': '204f6c',
            '400': '204f6c',
            '500': '204f6c',
            '600': '204f6c',
            '700': '204f6c',
            '800': '204f6c',
            '900': '204f6c',
            'A100': '204f6c',
            'A200': '204f6c',
            'A400': '204f6c',
            'A700': '204f6c',
            'contrastDefaultColor': 'light'
        });
        $mdThemingProvider.definePalette('hageryellow', {
            '100': 'fac003',
            '50': 'fac003',
            '200': 'fac003',
            '300': 'fac003',
            '400': 'fac003',
            '500': 'fac003',
            '600': 'fac003',
            '700': 'fac003',
            '800': 'fac003',
            '900': 'fac003',
            'A100': 'fac003',
            'A200': 'fac003',
            'A400': 'fac003',
            'A700': 'fac003',
            'contrastDefaultColor': 'light'
        });
        $mdThemingProvider.definePalette('hagerorange', {
            '100': 'e25b30',
            '50': 'e25b30',
            '200': 'e25b30',
            '300': 'e25b30',
            '400': 'e25b30',
            '500': 'e25b30',
            '600': 'e25b30',
            '700': 'e25b30',
            '800': 'e25b30',
            '900': 'e25b30',
            'A100': 'e25b30',
            'A200': 'e25b30',
            'A400': 'e25b30',
            'A700': 'e25b30',
            'contrastDefaultColor': 'light'
        });

        $mdThemingProvider.definePalette('hagerpink', {
            '100': '8f004d',
            '50': '8f004d',
            '200': '8f004d',
            '300': '8f004d',
            '400': '8f004d',
            '500': '8f004d',
            '600': '8f004d',
            '700': '8f004d',
            '800': '8f004d',
            '900': '8f004d',
            'A100': '8f004d',
            'A200': '8f004d',
            'A400': '8f004d',
            'A700': '8f004d',
            'contrastDefaultColor': 'light'
        });   
        var triCyanMap = $mdThemingProvider.extendPalette('cyan', {
            'contrastDefaultColor': 'light',
            'contrastLightColors': '500 700 800 900',
            'contrastStrongLightColors': '500 700 800 900'
        });

        // Register the new color palette map with the name triCyan
        $mdThemingProvider.definePalette('triCyan', triCyanMap);

        /**
         *  SKINS
         */

        // CYAN CLOUD SKIN
        triThemingProvider.theme('cyan')
        .primaryPalette('triCyan')
        .accentPalette('amber')
        .warnPalette('deep-orange');

        triThemingProvider.theme('cyan-white')
        .primaryPalette('white')
        .accentPalette('triCyan', {
            'default': '500'
        })
        .warnPalette('deep-orange');

        triSkinsProvider.skin('cyan-cloud', 'Cyan Cloud')
        .sidebarTheme('cyan')
        .toolbarTheme('cyan-white')
        .logoTheme('cyan')
        .contentTheme('cyan');

        // RED DWARF SKIN
        triThemingProvider.theme('red')
        .primaryPalette('red')
        .accentPalette('amber')
        .warnPalette('purple');

        triThemingProvider.theme('white-red')
        .primaryPalette('white')
        .accentPalette('red', {
            'default': '500'
        })
        .warnPalette('purple');

        triSkinsProvider.skin('red-dwarf', 'Red Dwarf')
        .sidebarTheme('red')
        .toolbarTheme('white-red')
        .logoTheme('red')
        .contentTheme('red');

        // PLUMB PURPLE SKIN
        triThemingProvider.theme('purple')
        .primaryPalette('purple')
        .accentPalette('deep-orange')
        .warnPalette('amber');

        triThemingProvider.theme('white-purple')
        .primaryPalette('white')
        .accentPalette('purple', {
            'default': '400'
        })
        .warnPalette('deep-orange');

        triSkinsProvider.skin('plumb-purple', 'Plumb Purple')
        .sidebarTheme('purple')
        .toolbarTheme('white-purple')
        .logoTheme('purple')
        .contentTheme('purple');

        // DARK KNIGHT SKIN
        triThemingProvider.theme('dark')
        .primaryPalette('black', {
            'default': '300',
            'hue-1': '400'
        })
        .accentPalette('amber')
        .warnPalette('deep-orange')
        .backgroundPalette('black')
        .dark();

        triSkinsProvider.skin('dark-knight', 'Dark Knight')
        .sidebarTheme('dark')
        .toolbarTheme('dark')
        .logoTheme('dark')
        .contentTheme('dark');

        // BATTLESHIP GREY SKIN
        triThemingProvider.theme('blue-grey')
        .primaryPalette('blue-grey')
        .accentPalette('amber')
        .warnPalette('orange');

        triThemingProvider.theme('white-blue-grey')
        .primaryPalette('white')
        .accentPalette('blue-grey', {
            'default': '400'
        })
        .warnPalette('orange');

        triSkinsProvider.skin('battleship-grey', 'Battleship Grey')
        .sidebarTheme('blue-grey')
        .toolbarTheme('white-blue-grey')
        .logoTheme('blue-grey')
        .contentTheme('blue-grey');

        // ZESTY ORANGE SKIN
        triThemingProvider.theme('orange')
        .primaryPalette('orange' , {
            'default': '800'
        })
        .accentPalette('lime')
        .warnPalette('amber');

        triThemingProvider.theme('white-orange')
        .primaryPalette('white')
        .accentPalette('orange', {
            'default': '500'
        })
        .warnPalette('lime');

        triSkinsProvider.skin('zesty-orange', 'Zesty Orange')
        .sidebarTheme('orange')
        .toolbarTheme('white-orange')
        .logoTheme('orange')
        .contentTheme('orange');


        // INDIGO ISLAND SKIN
        triThemingProvider.theme('indigo')
        .primaryPalette('indigo' , {
            'default': '600'
        })
        .accentPalette('red')
        .warnPalette('lime');

        triSkinsProvider.skin('indigo-island', 'Indigo Island')
        .sidebarTheme('indigo')
        .toolbarTheme('indigo')
        .logoTheme('indigo')
        .contentTheme('indigo');

        // KERMIT GREEN SKIN
        triThemingProvider.theme('light-green')
        .primaryPalette('light-green' , {
            'default': '400'
        })
        .accentPalette('amber')
        .warnPalette('deep-orange');

        triThemingProvider.theme('white-light-green')
        .primaryPalette('white')
        .accentPalette('light-green', {
            'default': '400'
        })
        .warnPalette('deep-orange');

        triSkinsProvider.skin('kermit-green', 'Kermit Green')
        .sidebarTheme('light-green')
        .toolbarTheme('white-light-green')
        .logoTheme('light-green')
        .contentTheme('light-green');
 
        // Hager SKIN
        triThemingProvider.theme('hager-pink')
        .primaryPalette('hagerpink', {
            'default': '900'
        })
        .accentPalette('hageryellow', {
            'default': '700'
        })
        .warnPalette('hageryellow', {
            'default': '900'
        });

        triThemingProvider.theme('hager-yellow')
        .primaryPalette('hageryellow', {
            'default': '100'
        })
        .accentPalette('hagerorange', {
            'default': '100'
        })
        .warnPalette('hagerpink', {
            'default': '100'
        });

        triThemingProvider.theme('hager-blue')
        .primaryPalette('hagerblue', {
            'default': '100'
        })
        .accentPalette('hagerpink', {
            'default': '100'
        })
        .warnPalette('hageryellow', {
            'default': '100'
        });
 
        triSkinsProvider.skin('hager-pink', 'Hager pink')
        .sidebarTheme('hager-pink')
        .toolbarTheme('hager-yellow')
        .logoTheme('hager-yellow')
        .contentTheme('hager-pink');

        triSkinsProvider.skin('hager-yellow', 'Hager yellow')
        .sidebarTheme('cyan')
        .toolbarTheme('hager-yellow')
        .logoTheme('hager-yellow')
        .contentTheme('hager-pink');

        triSkinsProvider.skin('hager-blue', 'Hager blue')
        .sidebarTheme('hager-blue')
        .toolbarTheme('hager-pink')
        .logoTheme('hager-yellow')
        .contentTheme('hager-pink');

        $mdThemingProvider.theme('hager-yellow');

        /**
         *  FOR DEMO PURPOSES ALLOW SKIN TO BE SAVED IN A COOKIE
         *  This overrides any skin set in a call to triSkinsProvider.setSkin if there is a cookie
         *  REMOVE LINE BELOW FOR PRODUCTION SITE
         */
        triSkinsProvider.useSkinCookie(true);

        /**
         *  SET DEFAULT SKIN
         */
        triSkinsProvider.setSkin('hager-yellow');
    }
})();

(function() {
    'use strict';

    translateConfig.$inject = ["triSettingsProvider", "triRouteProvider"];
    angular
        .module('app')
        .config(translateConfig);

    /* @ngInject */
    function translateConfig(triSettingsProvider, triRouteProvider) {
        var now = new Date();
        // set app name & logo (used in loader, sidemenu, footer, login pages, etc)
        triSettingsProvider.setName('Hager Laboratory');
        triSettingsProvider.setCopyright('&copy;' + now.getFullYear() + ' www.hagergroup.com');
        triSettingsProvider.setLogo('assets/images/logo.png');
        // set current version of app (shown in footer)
        triSettingsProvider.setVersion('1.0.0');
        // set the document title that appears on the browser tab
        triRouteProvider.setTitle('Hager Laboratory');
        triRouteProvider.setSeparator('|');
    }
})();

(function() {
    'use strict';

    config.$inject = ["triLayoutProvider"];
    angular
        .module('app')
        .config(config);

    /* @ngInject */
    function config(triLayoutProvider) {
        // set app templates (all in app/layouts folder so you can tailor them to your needs)

        // loader screen HTML & controller
        triLayoutProvider.setDefaultOption('loaderTemplateUrl', 'app/layouts/loader/loader.tmpl.html');
        triLayoutProvider.setDefaultOption('loaderController', 'LoaderController');

        // left sidemenu HTML and controller
        triLayoutProvider.setDefaultOption('sidebarLeftTemplateUrl', 'app/layouts/leftsidenav/leftsidenav.tmpl.html');
        triLayoutProvider.setDefaultOption('sidebarLeftController', 'LeftSidenavController');

        // right sidemenu HTML and controller
        triLayoutProvider.setDefaultOption('sidebarRightTemplateUrl', 'app/layouts/rightsidenav/rightsidenav.tmpl.html');
        triLayoutProvider.setDefaultOption('sidebarRightController', 'RightSidenavController');

        // top toolbar HTML and controller
        triLayoutProvider.setDefaultOption('toolbarTemplateUrl', 'app/layouts/toolbar/toolbar.tmpl.html');
        triLayoutProvider.setDefaultOption('toolbarController', 'ToolbarController');

        // footer HTML
        triLayoutProvider.setDefaultOption('footerTemplateUrl', 'app/layouts/footer/footer.tmpl.html');

        triLayoutProvider.setDefaultOption('toolbarSize', 'default');

        triLayoutProvider.setDefaultOption('toolbarShrink', true);

        triLayoutProvider.setDefaultOption('toolbarClass', '');

        triLayoutProvider.setDefaultOption('contentClass', '');

        triLayoutProvider.setDefaultOption('sideMenuSize', 'full');

        triLayoutProvider.setDefaultOption('showToolbar', true);

        triLayoutProvider.setDefaultOption('footer', false);
    }
})();

(function() {
    'use strict';

    routeConfig.$inject = ["$stateProvider", "$urlRouterProvider"];
    angular
        .module('app')
        .config(routeConfig);

    /* @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        // Setup the apps routes

        // 404 & 500 pages
        $stateProvider
        .state('404', {
            url: '/404',
            views: {
                'root': {
                    templateUrl: '404.tmpl.html',
                    controller: 'ErrorPageController',
                    controllerAs: 'vm'
                }
            }
        })

        .state('401', {
            url: '/401',
            views: {
                'root': {
                    templateUrl: '401.tmpl.html',
                    controller: 'ErrorPageController',
                    controllerAs: 'vm'
                }
            }
        })

        .state('500', {
            url: '/500',
            views: {
                'root': {
                    templateUrl: '500.tmpl.html',
                    controller: 'ErrorPageController',
                    controllerAs: 'vm'
                }
            }
        });


        // set default routes when no path specified
        $urlRouterProvider.when('', '/products');
        $urlRouterProvider.when('/', '/products');

        // always goto 404 if route not found
        $urlRouterProvider.otherwise('/404');
    }
})();

(function() {
    'use strict';

    config.$inject = ["ChartJsProvider"];
    angular
        .module('app')
        .config(config);

    /* @ngInject */
    function config(ChartJsProvider) {
        // Configure all charts to use material design colors
        ChartJsProvider.setOptions({
            colours: [
                '#4285F4',    // blue
                '#DB4437',    // red
                '#F4B400',    // yellow
                '#0F9D58',    // green
                '#AB47BC',    // purple
                '#00ACC1',    // light blue
                '#FF7043',    // orange
                '#9E9D24',    // browny yellow
                '#5C6BC0'     // dark blue
            ],
            responsive: true
        });
    }
})();
(function() {
    'use strict';

    runFunction.$inject = ["$rootScope", "$state", "$cookies", "$log"];
    angular
        .module('app')
        .run(runFunction);

    /* @ngInject */
    function runFunction($rootScope, $state, $cookies, $log) {

        // default redirect if access is denied
        function redirectError() {
            $state.go('500');
        }
        
        // watches
        // redirect all errors to permissions to 500
        var errorHandle = $rootScope.$on('$stateChangeError', redirectError);

        // remove watch on destroy
        $rootScope.$on('$destroy', function() {
            errorHandle();
        });

        function setHagerSkin(skin){
            if(!$cookies.get('triangular-skin'))
            {
                $cookies.put('triangular-skin',angular.toJson({
                            skin: skin 
                 }));
            }
        }

        setHagerSkin("hager-yellow");
 
    }
})();

(function() {
    'use strict';

    appConfig.$inject = ["$compileProvider", "$mdAriaProvider"];
    angular
        .module('app')
        .config(appConfig);

    /* @ngInject */
    function appConfig($compileProvider, $mdAriaProvider) {
        // Make sure this still works in controllers (breaking change in angular 1.6)
        $compileProvider.preAssignBindingsEnabled(true);
        // Disable Aria warnings 
        $mdAriaProvider.disableWarnings();
    }

})();
 
angular.module("app").run(["$templateCache", function($templateCache) {$templateCache.put("app/seed-module/seed-page.tmpl.html","<md-content class=\"padded-content-page\">\n    <div layout=\"row\" layout-align=\"center center\">\n        <h2 class=\"md-display-3\" translate>Welcome to the triangular test page</h2>\n    </div>\n    <div class=\"margin-20\" layout=\"row\" layout-align=\"center center\">\n        <ul class=\"seed-list\">\n            <li class=\"md-headline\" ng-repeat=\"test in vm.testData\">\n                {{test}}\n            </li>\n        </ul>\n    </div>\n</md-content>");
$templateCache.put("app/authentication/forgot/forgot.tmpl.html","<md-card>\n    <md-toolbar class=\"padding-20 text-center\">\n        <img ng-src=\"{{::vm.triSettings.logo}}\" alt=\"{{vm.triSettings.name}}\">\n        <h1 class=\"md-headline\" translate>Forgot your password?</h1>\n    </md-toolbar>\n\n    <md-content class=\"md-padding\">\n        <p translate>Please enter your email below</p>\n        <form name=\"forgot\">\n            <md-input-container class=\"md-block\">\n                <label for=\"email\" translate>email</label>\n                <input id=\"email\" label=\"email\" name=\"email\" type=\"email\" ng-model=\"vm.user.email\" required/>\n                <div ng-messages=\"forgot.email.$error\" md-auto-hide=\"false\" ng-show=\"forgot.email.$touched\">\n                    <div ng-message when=\"required\"><span translate>Please enter your email address.</span></div>\n                    <div ng-message when=\"email\"><span translate>Please enter a valid email address.</span></div>\n                </div>\n            </md-input-container>\n\n            <md-button class=\"md-raised md-primary full-width margin-left-0 margin-right-0 margin-top-10 margin-bottom-10\" ng-click=\"vm.resetClick()\" ng-disabled=\"forgot.$invalid\" translate=\"Reset\" aria-label=\"{{\'Reset\' | triTranslate}}\"></md-button>\n\n            <md-button class=\"md-primary full-width margin-left-0 margin-right-0 margin-top-10 margin-bottom-10\" href=\"#/login\" translate=\"Remembered it? Login in here\" aria-label=\"{{\'Remembered it? Login in here\' | triTranslate}}\"></md-button>\n        </form>\n    </md-content>\n</md-card>\n");
$templateCache.put("app/authentication/layouts/authentication.tmpl.html","<div class=\"full-image-background mb-bg-fb-05\" layout=\"row\" layout-fill>\n    <div class=\"animate-wrapper\" flex layout=\"column\">\n        <div id=\"ui-login\" class=\"login-frame\" ui-view flex layout=\"column\" layout-align=\"center center\"></div>\n    </div>\n</div>\n");
$templateCache.put("app/authentication/lock/lock.tmpl.html","<md-card>\n    <md-toolbar class=\"padding-20 text-center\">\n        <img ng-src=\"{{::vm.triSettings.logo}}\" alt=\"{{vm.triSettings.name}}\">\n        <h1 class=\"md-headline\">\n            <span translate>Welcome back</span> {{vm.user.name}}\n        </h1>\n    </md-toolbar>\n\n    <md-content class=\"md-padding\">\n        <p class=\"margin-top-20 margin-bottom-20\" translate>You have been logged out due to idleness. Enter your password to log back in.</p>\n\n        <form name=\"lock\">\n            <md-input-container class=\"md-block\">\n                <label for=\"password\" translate>password</label>\n                <input label=\"password\" name=\"password\" type=\"password\" ng-model=\"vm.user.password\" required/>\n                <div ng-messages for=\"lock.password.$error\" md-auto-hide=\"false\" ng-show=\"lock.password.$touched\">\n                    <div ng-message when=\"required\"><span translate>Please enter your password.</span></div>\n                </div>\n            </md-input-container>\n\n            <div layout=\"row\">\n                <md-button flex href=\"#/login\" translate=\"Log out\"></md-button>\n                <md-button flex class=\"md-primary\" ng-click=\"vm.loginClick()\" ng-disabled=\"lock.$invalid\" translate=\"Log in\"></md-button>\n            </div>\n        </form>\n    </md-content>\n</md-card>\n");
$templateCache.put("app/authentication/login/login.tmpl.html","<md-card >\n    <md-toolbar class=\"padding-20 text-center\">\n        <img ng-src=\"{{::vm.triSettings.logo}}\" alt=\"{{vm.triSettings.name}}\">\n        <h1 class=\"md-headline\" translate>Hager© Laboratory</h1>\n    </md-toolbar>\n\n    <md-content class=\"md-padding\">\n        <form name=\"login\">\n            <md-input-container class=\"md-block\">\n                <label for=\"email\" translate>email</label>\n                <input id=\"email\" label=\"email\" name=\"email\" type=\"email\" ng-model=\"vm.credentials.email\" required/>\n                <div ng-messages=\"login.email.$error\" md-auto-hide=\"false\" ng-show=\"login.email.$touched\">\n                    <div ng-message when=\"required\">\n                        <span translate>Please enter your email address</span>\n                    </div>\n                    <div ng-message when=\"email\">\n                        <span translate>Please enter a valid email address</span>\n                    </div>\n                </div>\n            </md-input-container>\n\n            <md-input-container class=\"md-block\">\n                <label for=\"password\" translate>password</label>\n                <input  id=\"password\" label=\"password\" name=\"password\" type=\"password\" ng-model=\"vm.credentials.password\" required/>\n                <div ng-messages for=\"login.password.$error\" md-auto-hide=\"false\" ng-show=\"login.password.$touched\">\n                    <div ng-message when=\"required\"><span translate>Please enter your password.</span></div>\n                </div>\n            </md-input-container>\n\n            <div layout=\"row\" layout-align=\"space-between center\">\n                <md-input-container>\n                    <md-checkbox ng-model=\"vm.credentials.rememberMe\">\n                        <span translate>Remember Me</span>\n                    </md-checkbox>\n                </md-input-container>\n\n                <md-input-container>\n                    <md-button flex class=\"md-primary\" href=\"#/forgot\" translate=\"Forgot password?\" aria-label=\"{{\'Forgot password?\' | triTranslate}}\"></md-button>\n                </md-input-container>\n            </div>\n\n            <md-button class=\"md-raised md-primary full-width margin-left-0 margin-right-0 margin-top-10 margin-bottom-10\" ng-click=\"vm.loginClick()\" ng-disabled=\"login.$invalid\" translate=\"Log in\" aria-label=\"{{\'Log in\' | triTranslate}}\"></md-button>\n\n            <md-button class=\"md-primary full-width margin-left-0 margin-right-0 margin-top-10 margin-bottom-10\" ng-click=\"vm.signup()\" translate=\"Don\'t have an account? Create one now\" aria-label=\"{{\'Don\\\'t have an account? Create one now\' | triTranslate}}\"></md-button>\n\n            <div class=\"social-login\">\n                <md-divider></md-divider>\n\n                <div class=\"text-center margin-20\" translate>or login with</div>\n\n                <div layout=\"row\" layout-align=\"space-between center\"  layout-margin>\n                    <md-button href=\"#\" ng-repeat=\"social in ::vm.socialLogins\" class=\"md-icon-button\" ng-style=\"{ \'background-color\': social.color }\" aria-label=\"{{social.icon}}\">\n                        <md-icon md-font-icon=\"{{::social.icon}}\"></md-icon>\n                    </md-button>\n                </div>\n            </div>\n        </form>\n    </md-content>\n</md-card>\n");
$templateCache.put("app/authentication/profile/profile.tmpl.html","<div class=\"full-image-background mb-bg-01 padding-20 padding-top-200 overlay-gradient-30\" layout=\"row\" layout-align=\"center start\">\n    <div class=\"margin-right-20\">\n        <img src=\"assets/images/avatars/avatar-5.png\" alt=\"girl-avatar\" class=\"make-round\" width=\"100\"/>\n    </div>\n    <div class=\"text-light\">\n        <h3 class=\"font-weight-600 margin-bottom-0 text-light\">Christos / Profile</h3>\n        <p class=\"font-weight-300 margin-top-0\">Edit your name, avatar etc</p>\n     </div>\n</div>\n\n<div layout=\"row\" class=\"profile\" layout-wrap>\n    <div flex=\"100\" flex-gt-md=\"100\">\n        <md-tabs md-dynamic-height md-border-bottom>\n            <md-tab label=\"Profile\">\n                <md-content class=\"md-padding\">\n                    <form name=\"profile\">\n                        <md-input-container class=\"md-block\">\n                            <label for=\"name\" translate>name</label>\n                            <input id=\"name\" label=\"name\" name=\"name\" type=\"text\" ng-model=\"vm.user.name\" required/>\n                            <div ng-messages=\"profile.name.$error\" md-auto-hide=\"false\" ng-show=\"profile.name.$touched\">\n                                <div ng-message when=\"required\"><span translate>Please enter your name</span></div>\n                            </div>\n                        </md-input-container>\n                        <md-input-container class=\"md-block\">\n                            <label for=\"email\" translate>email</label>\n                            <input id=\"email\" label=\"email\" name=\"email\" type=\"email\" ng-model=\"vm.user.email\" required/>\n                            <div ng-messages=\"profile.email.$error\" md-auto-hide=\"false\" ng-show=\"profile.email.$touched\">\n                                <div ng-message when=\"required\">\n                                    <span translate>Please enter your email address</span>\n                                </div>\n                                <div ng-message when=\"email\">\n                                    <span translate>Please enter a valid email address</span>\n                                </div>\n                            </div>\n                        </md-input-container>\n\n                        <md-input-container class=\"md-block\">\n                            <label for=\"location\" translate>location</label>\n                            <input id=\"location\" label=\"location\" name=\"location\" type=\"text\" ng-model=\"vm.user.location\"/>\n                        </md-input-container>\n\n                        <md-input-container class=\"md-block\">\n                            <label for=\"website\" translate>website</label>\n                            <input id=\"website\" label=\"website\" name=\"website\" type=\"text\" ng-model=\"vm.user.website\"/>\n                        </md-input-container>\n\n                        <md-input-container class=\"md-block\">\n                            <label for=\"twitter\" translate>twitter</label>\n                            <input id=\"twitter\" label=\"twitter\" name=\"twitter\" type=\"text\" ng-model=\"vm.user.twitter\"/>\n                        </md-input-container>\n\n                        <md-input-container class=\"md-block\">\n                            <label for=\"bio\" translate>bio</label>\n                            <textarea id=\"bio\" label=\"bio\" name=\"bio\" ng-model=\"vm.user.bio\"/>\n                        </md-input-container>\n\n                        <md-button class=\"md-raised md-primary margin-left-0\" ng-disabled=\"profile.$invalid\" translate=\"Update Settings\"></md-button>\n                    </form>\n                </md-content>\n            </md-tab>\n            <md-tab label=\"Password\">\n                <md-content class=\"md-padding\">\n                    <form name=\"password\">\n                        <md-input-container class=\"md-block\">\n                            <label for=\"old-password\" translate>current</label>\n                            <input id=\"old-password\" label=\"old-password\" name=\"old-password\" type=\"text\" ng-model=\"vm.user.current\"/>\n                        </md-input-container>\n\n                        <md-input-container class=\"md-block\">\n                            <label for=\"password\" translate>new password</label>\n                            <input id=\"password\" label=\"password\" name=\"password\" type=\"password\" ng-model=\"vm.user.password\" tri-same-password=\"password.confirm\" ng-minlength=\"8\" required/>\n                            <div ng-messages=\"password.password.$error\" ng-include=\"\'app/examples/authentication/signup/password.messages.html\'\" md-auto-hide=\"false\" ng-show=\"password.password.$touched\"></div>\n                        </md-input-container>\n\n                        <md-input-container class=\"md-block\">\n                            <label for=\"confirm\" translate>confirm password</label>\n                            <input id=\"confirm\" label=\"confirm\" name=\"confirm\" type=\"password\" ng-model=\"vm.user.confirm\" tri-same-password=\"password.password\" ng-minlength=\"8\" required/>\n                            <div ng-messages=\"password.confirm.$error\" ng-include=\"\'app/examples/authentication/signup/password.messages.html\'\" md-auto-hide=\"false\" ng-show=\"password.confirm.$touched\"></div>\n                        </md-input-container>\n\n                        <md-button class=\"md-raised md-primary margin-left-0\" ng-disabled=\"profile.$invalid\" translate=\"Update Settings\"></md-button>\n\n                    </form>\n                </md-content>\n            </md-tab>\n            <md-tab label=\"Notifications\">\n                <md-content class=\"md-padding\">\n                    <md-list>\n                        <div ng-repeat=\"group in ::vm.settingsGroups\">\n                            <md-subheader class=\"md-accent\" translate=\"{{::group.name}}\"></md-subheader>\n                            <md-list-item ng-repeat=\"setting in ::group.settings\" layout=\"row\" layout-align=\"space-around center\">\n                                <md-icon md-font-icon=\"{{::setting.icon}}\"></md-icon>\n                                <p translate>{{::setting.title}}</p>\n                                <md-switch class=\"md-secondary\" ng-model=\"setting.enabled\"></md-switch>\n                            </md-list-item>\n                        </div>\n                    </md-list>\n                    <md-button class=\"md-raised md-primary margin-left-0\" ng-disabled=\"profile.$invalid\" translate=\"Update Settings\"></md-button>\n                </md-content>\n            </md-tab>\n        </md-tabs>\n    </div>\n\n</div>\n");
$templateCache.put("app/authentication/signup/signup.tmpl.html","<md-card>\n    <md-toolbar class=\"padding-20 text-center\">\n        <img ng-src=\"{{::vm.triSettings.logo}}\" alt=\"{{vm.triSettings.name}}\">\n        <h1 class=\"md-headline\" translate>Sign up</h1>\n    </md-toolbar>\n\n    <md-content class=\"md-padding\">\n        <form name=\"signup\">\n            <md-input-container class=\"md-block\">\n                <label for=\"name\" translate>username</label>\n                <input id=\"name\" label=\"name\" name=\"name\" type=\"text\" ng-model=\"vm.user.username\" required/>\n                <div ng-messages=\"signup.name.$error\" md-auto-hide=\"false\" ng-show=\"signup.name.$touched\">\n                    <div ng-message when=\"required\">\n                        <span translate>Please enter your username</span>\n                    </div>\n                </div>\n            </md-input-container>\n            <md-input-container class=\"md-block\">\n                <label for=\"email\" translate>email</label>\n                <input id=\"email\" label=\"email\" name=\"email\" type=\"email\" ng-model=\"vm.user.email\" required/>\n                <div ng-messages=\"signup.email.$error\" md-auto-hide=\"false\" ng-show=\"signup.email.$touched\">\n                    <div ng-message when=\"required\">\n                        <span translate>Please enter your email address</span>\n                    </div>\n                    <div ng-message when=\"email\">\n                        <span translate>Please enter a valid email address</span>\n                    </div>\n                </div>\n            </md-input-container>\n\n            <md-input-container class=\"md-block\">\n                <label for=\"password\" translate>password</label>\n                <input id=\"password\" label=\"password\" name=\"password\" type=\"password\" ng-model=\"vm.user.password\" tri-same-password=\"signup.confirm\" ng-minlength=\"8\" required/>\n                <ng-messages for=\"signup.password.$error\" md-auto-hide=\"false\" ng-show=\"signup.password.$touched\">\n                    <div ng-message when=\"required\">\n                        <span translate>Please enter a password</span>\n                    </div>\n                    <div ng-message when=\"minlength\">\n                        <span translate>Your password must be greater than 8 characters long</span>\n                    </div>\n                    <div ng-message when=\"samePassword\">\n                        <span translate>You need to enter the same password</span>\n                    </div>\n                </ng-messages>\n            </md-input-container>\n\n            <md-input-container class=\"md-block\">\n                <label for=\"password\" translate>confirm password</label>\n                <input id=\"confirm\" label=\"confirm\" name=\"confirm\" type=\"password\" ng-model=\"vm.user.confirm\" tri-same-password=\"signup.password\" ng-minlength=\"8\" required/>\n                <ng-messages for=\"signup.confirm.$error\" md-auto-hide=\"false\" ng-show=\"signup.confirm.$touched\">\n                    <div ng-message when=\"required\">\n                        <span translate>Please enter a password</span>\n                    </div>\n                    <div ng-message when=\"minlength\">\n                        <span translate>Your password must be greater than 8 characters long</span>\n                    </div>\n                    <div ng-message when=\"samePassword\">\n                        <span translate>You need to enter the same password</span>\n                    </div>\n                </ng-messages>\n            </md-input-container>\n\n            <md-button class=\"md-raised md-primary full-width margin-left-0 margin-right-0 margin-top-10 margin-bottom-10\" ng-click=\"vm.signupClick()\" ng-disabled=\"signup.$invalid\" translate=\"Sign Up\" aria-label=\"{{\'Sign Up\' | triTranslate}}\"></md-button>\n\n            <md-button  class=\"md-primary full-width margin-left-0 margin-right-0 margin-top-10 margin-bottom-10\" href=\"#/login\" translate=\"Already have an account? Login here.\" aria-label=\"{{\'Already have an account? Login here.\' | triTranslate}}\"></md-button>\n\n        </form>\n    </md-content>\n\n</md-card>\n");
$templateCache.put("app/examples/calendar/calendar-fabs.tmpl.html","<md-button ng-click=\"vm.addEvent($event)\" class=\"md-fab md-accent md-fab-bottom-right\" aria-label=\"{{\'Add_EVENT\' | triTranslate}}\">\n    <md-icon md-font-icon=\"zmdi zmdi-plus\"></md-icon>\n</md-button>\n");
$templateCache.put("app/examples/calendar/calendar.tmpl.html","<div class=\"calendar-page\" flex=\"noshrink\">\n    <h2 class=\"font-weight-300 font-size-5 text-light margin-top-60 margin-bottom-30\" flex ng-hide=\"vm.currentView == \'agendaWeek\'\">{{vm.currentDay | amDateFormat:vm.viewFormats[vm.currentView]}}</h2>\n    <h2 class=\"font-weight-300 font-size-5 text-light margin-top-60 margin-bottom-30\" flex ng-show=\"vm.currentView == \'agendaWeek\'\">Week {{vm.currentDay | amDateFormat:vm.viewFormats[vm.currentView]}} - {{vm.currentDay | amDateFormat:\'YYYY\'}}</h2>\n\n    <div class=\"margin-bottom-60\" flex ui-calendar=\"vm.calendarOptions\" ng-model=\"vm.eventSources\" calendar=\"triangular-calendar\" class=\"triangular-calendar\"></div>\n</div>\n");
$templateCache.put("app/examples/calendar/event-dialog.tmpl.html","<md-dialog class=\"mobile-fullwidth-dialog\" flex=\"60\" flex-xs=\"100\">\n    <md-toolbar class=\"toolbar-default\" ng-style=\"{ \'background-color\': vm.selectedColor.backgroundColor, color: vm.selectedColor.textColor }\">\n        <div class=\"md-toolbar-tools\">\n            <h2>\n                <span translate>{{::vm.dialogData.title}}</span>\n                <span ng-show=\"vm.event.title\"> - {{vm.event.title}}</span>\n            </h2>\n            <span flex></span>\n            <md-button class=\"md-icon-button\" ng-click=\"vm.cancelClick()\" aria-label=\"cancel\">\n                <md-icon md-font-icon=\"zmdi zmdi-close\"></md-icon>\n            </md-button>\n        </div>\n    </md-toolbar>\n\n    <md-divider></md-divider>\n\n    <md-dialog-content class=\"md-dialog-content\">\n        <form class=\"event-dialog-form\" name=\"eventForm\">\n            <md-input-container class=\"md-block\">\n                <label translate>Title</label>\n                <input ng-model=\"vm.event.title\" required>\n            </md-input-container>\n            <md-list>\n                <md-list-item layout=\"row\" layout-align=\"space-between center\">\n                    <p translate>All day</p>\n                    <md-switch class=\"md-secondary\" ng-model=\"vm.event.allDay\" ng-change=\"vm.allDayChanged()\"></md-switch>\n                </md-list-item>\n            </md-list>\n            <div class=\"event-dialog-input-row\" layout=\"row\" layout-align=\"start center\">\n                <p flex hide-xs translate>Start</p>\n                <md-datepicker ng-model=\"vm.start\" md-placeholder=\"Start | triTranslate\"></md-datepicker>\n            </div>\n            <div class=\"event-dialog-input-row\" layout=\"row\" layout-align=\"start center\">\n                <p flex translate>Start-TIME</p>\n                <div layout=\"row\" layout-align=\"end center\">\n                    <md-icon class=\"padding-right-10\" md-font-icon=\"zmdi zmdi-access-time\"></md-icon>\n                    <md-select class=\"padding-right-10\" placeholder=\"{{\'Hour\' | triTranslate}}\" ng-model=\"vm.startTime.hour\">\n                        <md-option ng-repeat=\"hour in vm.dateSelectOptions.hours\" ng-value=\"hour\">{{::hour | padding:2}}</md-option>\n                    </md-select>\n                    <md-select class=\"padding-right-10\" placeholder=\"{{\'Minute\' | triTranslate}}\" ng-model=\"vm.startTime.minute\">\n                        <md-option ng-repeat=\"minute in vm.dateSelectOptions.minutes\" ng-value=\"minute\">{{::minute | padding:2}}</md-option>\n                    </md-select>\n                </div>\n            </div>\n            <div class=\"event-dialog-input-row\" layout=\"row\" layout-align=\"start center\" ng-hide=\"vm.event.allDay\">\n                <p translate flex hide-xs>End</p>\n                <md-datepicker ng-model=\"vm.end\" md-placeholder=\"End | triTranslate\"></md-datepicker>\n            </div>\n            <div class=\"event-dialog-input-row\" layout=\"row\" layout-align=\"start center\" ng-hide=\"vm.event.allDay\">\n                <p flex translate>End-TIME</p>\n                <div layout=\"row\" layout-align=\"end center\">\n                    <md-icon class=\"padding-right-10\" md-font-icon=\"zmdi zmdi-access-time\"></md-icon>\n                    <md-select class=\"padding-right-10\" placeholder=\"{{\'Hour\' | triTranslate}}\" ng-model=\"vm.endTime.hour\">\n                        <md-option ng-repeat=\"hour in vm.dateSelectOptions.hours\" ng-value=\"hour\">{{::hour | padding:2}}</md-option>\n                    </md-select>\n                    <md-select class=\"padding-right-10\" placeholder=\"{{\'Minute\' | triTranslate}}\" ng-model=\"vm.endTime.minute\">\n                        <md-option ng-repeat=\"minute in vm.dateSelectOptions.minutes\" ng-value=\"minute\">{{::minute | padding:2}}</md-option>\n                    </md-select>\n                </div>\n            </div>\n            <md-input-container class=\"md-block\">\n                <label translate>Location</label>\n                <input type=\"text\" ng-model=\"vm.event.location\">\n            </md-input-container>\n            <md-input-container class=\"md-block\">\n                <label translate>Description</label>\n                <textarea ng-model=\"vm.event.description\"></textarea>\n            </md-input-container>\n            <md-input-container class=\"md-block\">\n                <div layout=\"row\" layout-align=\"space-between center\">\n                    <p flex translate>Color</p>\n                    <md-select md-container-class=\"calendar-color-select\" placeholder=\"{{\'Color-PICK\' | triTranslate}}\" ng-model=\"vm.selectedColor\" ng-change=\"vm.colorChanged()\">\n                        <md-option ng-value=\"color\" ng-repeat=\"color in vm.colors\">{{color.name}}</md-option>\n                    </md-select>\n                </div>\n            </md-input-container>\n        </form>\n    </md-dialog-content>\n\n    <md-dialog-actions layout=\"row\">\n        <md-button class=\"md-warn\" ng-click=\"vm.deleteClick()\" aria-label=\"{{\'Delete\' | triTranslate}}\" ng-show=\"vm.edit\" translate=\"Delete\"></md-button>\n        <span flex></span>\n        <md-button ng-click=\"vm.cancelClick()\" aria-label=\"{{\'Cancel\' | triTranslate}}\" translate=\"Cancel\"></md-button>\n        <md-button ng-click=\"vm.okClick()\" class=\"md-primary\" ng-disabled=\"eventForm.$invalid\" aria-label=\"{{vm.dialogData.confirmButtonText | triTranslate}}\" translate=\"{{::vm.dialogData.confirmButtonText}}\"></md-button>\n    </md-dialog-actions>\n</md-dialog>");
$templateCache.put("app/examples/charts/chartjs-bar.tmpl.html","<div class=\"padded-content-page\">\n    <p class=\"md-subhead\">Chart.js uses the HTML5 canvas element. Triangular modifies Chart.js to use the material design palette .</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>ChartJS Bar Chart Example</h2>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content ng-controller=\"ChartJsBarController as vm\" ng-include=\"\'app/examples/charts/examples/chartjs-bar.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/charts/examples/chartjs-bar.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/charts/examples/chartjs-bar.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>");
$templateCache.put("app/examples/charts/chartjs-line.tmpl.html","<div class=\"padded-content-page\">\n    <p class=\"md-subhead\">Chart.js uses the HTML5 canvas element. Triangular modifies Chart.js to use the material design palette .</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>ChartJS Line Chart Example</h2>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content ng-controller=\"ChartJsLineController as vm\" ng-include=\"\'app/examples/charts/examples/chartjs-line.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/charts/examples/chartjs-line.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/charts/examples/chartjs-line.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>");
$templateCache.put("app/examples/charts/chartjs-pie.tmpl.html","<div class=\"padded-content-page\">\n    <p class=\"md-subhead\">Chart.js uses the HTML5 canvas element. Triangular modifies Chart.js to use the material design palette .</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>ChartJS Pie Chart Example</h2>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content ng-controller=\"ChartJsPieController as vm\" ng-include=\"\'app/examples/charts/examples/chartjs-pie.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/charts/examples/chartjs-pie.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/charts/examples/chartjs-pie.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>");
$templateCache.put("app/examples/charts/chartjs-ticker.tmpl.html","<div class=\"padded-content-page\">\n    <p class=\"md-subhead\">Chart.js uses the HTML5 canvas element. Triangular modifies Chart.js to use the material design palette .</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>ChartJS Animated Ticker Chart Example</h2>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content ng-controller=\"ChartJsTickerController as vm\" ng-include=\"\'app/examples/charts/examples/chartjs-ticker.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/charts/examples/chartjs-ticker.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/charts/examples/chartjs-ticker.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>");
$templateCache.put("app/examples/charts/d3-bar.tmpl.html","<div class=\"padded-content-page\">\n    <p class=\"md-subhead\">Triangular uses the NVD3 charting library that allows you to customize your charts via JSON API.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>D3 Bar Chart Example</h2>\n            </div>\n        </md-toolbar>\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content ng-controller=\"D3BarChartController as vm\" ng-include=\"\'app/examples/charts/examples/d3-bar.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/charts/examples/d3-bar.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/charts/examples/d3-bar.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>");
$templateCache.put("app/examples/charts/d3-multiline.tmpl.html","<div class=\"padded-content-page\">\n    <p class=\"md-subhead\">Triangular uses the NVD3 charting library that allows you to customize your charts via JSON API.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>D3 Multiline Chart Example</h2>\n            </div>\n        </md-toolbar>\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content ng-controller=\"D3MultiLineChartController as vm\" ng-include=\"\'app/examples/charts/examples/d3-multiline.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/charts/examples/d3-multiline.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/charts/examples/d3-multiline.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>");
$templateCache.put("app/examples/charts/d3-scatter.tmpl.html","<div class=\"padded-content-page\">\n    <p class=\"md-subhead\">Triangular uses the NVD3 charting library that allows you to customize your charts via JSON API.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>D3 Scatter Chart Example</h2>\n            </div>\n        </md-toolbar>\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content ng-controller=\"D3ScatterChartController as vm\" ng-include=\"\'app/examples/charts/examples/d3-scatter.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/charts/examples/d3-scatter.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/charts/examples/d3-scatter.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>");
$templateCache.put("app/examples/charts/google-bar.tmpl.html","<div class=\"padded-content-page\">\n    <p class=\"md-subhead\">Triangular uses the Google Chart Tools Directive Module to bring you all the chart types available from Google Charts.</p>\n\n    <p class=\"md-subhead\">Material Bar Charts have many small improvements over Classic Bar Charts, including an improved color palette, rounded corners, clearer label formatting, tighter default spacing between series, softer gridlines and titles (and the addition of subtitles).</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Google Material Bar Chart Example</h2>\n            </div>\n        </md-toolbar>\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content ng-controller=\"GoogleChartsBarController as vm\" ng-include=\"\'app/examples/charts/examples/google-bar.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/charts/examples/google-bar.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/charts/examples/google-bar.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>");
$templateCache.put("app/examples/charts/google-line.tmpl.html","<div class=\"padded-content-page\">\n    <p class=\"md-subhead\">Triangular uses the Google Chart Tools Directive Module to bring you all the chart types available from Google Charts.</p>\n\n    <p class=\"md-subhead\">Material Line Charts have many small improvements over Classic Line Charts, including an improved color palette, rounded corners, clearer label formatting, tighter default spacing between series, softer gridlines and titles (and the addition of subtitles).</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Google Material Line Chart Example</h2>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content ng-controller=\"GoogleChartsLineController as vm\" ng-include=\"\'app/examples/charts/examples/google-line.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/charts/examples/google-line.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/charts/examples/google-line.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>");
$templateCache.put("app/examples/charts/google-scatter.tmpl.html","<div class=\"padded-content-page\">\n    <p class=\"md-subhead\">Triangular uses the Google Chart Tools Directive Module to bring you all the chart types available from Google Charts.</p>\n\n    <p class=\"md-subhead\">Material Scatter Charts have many small improvements over Classic Scatter Charts, including variable opacity for legibility of overlapping points, an improved color palette, clearer label formatting, tighter default spacing, softer gridlines and titles (and the addition of subtitles).</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Google Material Scatter Chart Example</h2>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content ng-controller=\"GoogleChartsScatterController as vm\" ng-include=\"\'app/examples/charts/examples/google-scatter.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/charts/examples/google-scatter.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/charts/examples/google-scatter.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>");
$templateCache.put("app/examples/dashboards/dashboard-draggable.tmpl.html","<div layout=\"column\" class=\"padded-content-page\">\n    <h2>Creating containers with draggable elements</h2>\n    <p>Triangular allows you to easily build amazing containers with draggable elements. The examples below display such a functionality by creating simple containers with draggable widgets. Drag them around in order to re-order them. More examples can be found in analytics and server pages under the dashboard menu.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Horizontal dragging</h2>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content\" ng-include=\"\'app/examples/dashboards/examples/widget-draggable.tmpl.html\'\"></div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/dashboards/examples/widget-draggable.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n\n    <p>Example Column container. More complex layouts are also allowed, offering two degrees of freedom in movement.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Vertical dragging</h2>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content\" ng-include=\"\'app/examples/dashboards/examples/widget-draggable-vertical.tmpl.html\'\"></div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/dashboards/examples/widget-draggable-vertical.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>");
$templateCache.put("app/examples/dashboards/widgets.tmpl.html","<div layout=\"column\" class=\"padded-content-page\">\n    <p class=\"md-subhead\">Triangular allows you to build stunning dashbords easily using widgets.  Each widget has many different options you can find out how to use some of them below.</p>\n\n\n    <p>Titles & subtitles can be placed above and below the widget content.</p>\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Title above and below the content</h2>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content\" ng-include=\"\'app/examples/dashboards/examples/widget-title-above.tmpl.html\'\"></div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/dashboards/examples/widget-title-above.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n\n\n    <p>Titles & subtitles can also be be placed to the side of the widget content.</p>\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Title on the side of the content</h2>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content\" ng-include=\"\'app/examples/dashboards/examples/widget-title-side.tmpl.html\'\"></div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/dashboards/examples/widget-title-side.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n\n    <p>You can also use any of <a ui-sref=\"admin-panel.default.ui-colors\">triangulars palette colors</a> for your widgets.</p>\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Using palette colours</h2>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content\" ng-include=\"\'app/examples/dashboards/examples/widget-colors.tmpl.html\'\"></div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/dashboards/examples/widget-colors.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n\n\n    <p>You can also use an image for your widget backgrounds.</p>\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Using palette colours</h2>\n            </div>\n        </md-toolbar>\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content\" ng-include=\"\'app/examples/dashboards/examples/widget-backgrounds.tmpl.html\'\"></div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/dashboards/examples/widget-backgrounds.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>");
$templateCache.put("app/examples/elements/buttons.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">Material Button Examples</h2>\n    <p class=\"md-subhead\">A button consists of text and/or an image that clearly communicates what action will occur when the user touches it.  Triangular provides all the button types recommended in the <a href=\"http://www.google.com/design/spec/components/buttons.html\">material design specification</a></p>\n\n    <h3>Button Types</h3>\n    <p>There are three types of main buttons: </p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Raised Button</h2>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"padding-40 md-tabs-content\">\n                    <md-card>\n                        <md-card-content layout=\"row\" ng-include=\"\'app/examples/elements/examples/button-raised.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/button-raised.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Flat Button</h2>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"padding-40 md-tabs-content\">\n                    <md-card>\n                        <md-card-content layout=\"row\" ng-include=\"\'app/examples/elements/examples/button-flat.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/button-flat.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Floating action button (FAB)</h2>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"padding-40 md-tabs-content\">\n                    <md-card>\n                        <md-card-content layout=\"row\" layout-xs=\"column\" layout-padding layout-align=\"space-around center\" ng-include=\"\'app/examples/elements/examples/button-fab.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/button-fab.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n\n    <h3>Example Usage</h2>\n\n    <p>Choosing a button style depends on the primacy of the button, the number of containers on screen, and the overall layout of the screen.</p>\n    <p>First, look at the button’s function: is it important and ubiquitous enough to be a floating action button?</p>\n    <p>Next, choose raised or flat dimensionality depending on the container it will be in and how many z-space layers you have on screen. There should not be layers upon layers upon layers of objects on the screen.</p>\n    <p>Finally, look at your specific layout. You should primarily use one type of button per container. Only mix button types when you have a good reason to, such as emphasizing an important function.</p>\n\n    <md-divider class=\"margin-top-20 margin-bottom-20\"></md-divider>\n\n    <div layout=\"row\" layout-xs=\"column\" layout-align=\"space-around start\">\n        <div flex=\"40\" flex-xs=\"100\" layout=\"column\">\n            <h3 class=\"md-title\">Raised Button Example</h3>\n            <p>Raised buttons emphasize functions that would otherwise get lost on a busy or wide space. They add dimension to mostly flat layouts.</p>\n            <p><strong>Thats not an image, try it out <md-icon hide-xs md-font-icon=\"zmdi zmdi-chevron-right\"></md-icon></strong></p>\n        </div>\n\n        <div flex flex-xs=\"100\" class=\"elements-buttons-raised-usage md-whiteframe-z1\" layout=\"column\">\n            <md-toolbar>\n                <h2 class=\"md-toolbar-tools\">\n                    <span>Raised Button</span>\n                </h2>\n            </md-toolbar>\n            <div class=\"elements-raised-content\">\n                <h3>Uploading</h3>\n                <h1>{{vm.determinateValue}}%</h1>\n                <md-progress-linear class=\"md-warn\" md-mode=\"buffer\" value=\"{{vm.determinateValue}}\" md-buffer-value=\"{{vm.determinateValue2}}\"></md-progress-linear>\n            </div>\n            <div class=\"elements-raised-buttons\" layout=\"row\" layout-align=\"end center\">\n                <md-button class=\"md-raised md-primary\" aria-label=\"pause\">Pause</md-button>\n                <md-button class=\"md-raised md-warn\" aria-label=\"cancel\">Cancel</md-button>\n            </div>\n        </div>\n    </div>\n\n    <md-divider class=\"margin-top-20 margin-bottom-20\"></md-divider>\n\n    <div layout=\"row\" layout-xs=\"column\" layout-align=\"space-around start\">\n        <div flex=\"40\" flex-xs=\"100\" layout=\"column\">\n            <h3 class=\"md-title\">Floating Action Button (FAB)</h3>\n            <p>Floating action buttons are used for a special type of promoted action. They are distinguished by a circled icon floating above the UI and have special motion behaviors related to morphing, launching, and the transferring anchor point.</p>\n            <p><strong>Thats not an image, try it out <md-icon hide-xs md-font-icon=\"zmdi zmdi-chevron-right\"></md-icon></strong></p>\n        </div>\n        <div flex flex-xs=\"100\" class=\"elements-buttons-fab-usage md-whiteframe-z3\" layout=\"column\">\n            <img src=\"assets/images/dashboards/tweet.jpg\" alt=\"\">\n            <md-toolbar>\n                <h2 class=\"md-toolbar-tools\">\n                    <span>Fab Button</span>\n                </h2>\n            </md-toolbar>\n            <md-button class=\"md-fab md-accent\" aria-label=\"fab button\">\n                <md-icon md-font-icon=\"zmdi zmdi-plus\"></md-icon>\n            </md-button>\n        </div>\n    </div>\n\n    <md-divider class=\"margin-top-20 margin-bottom-20\"></md-divider>\n\n    <div layout=\"row\" layout-xs=\"column\" layout-align=\"space-around start\">\n        <div flex=\"40\" flex-xs=\"100\" layout=\"column\">\n            <h3 class=\"md-title\">Flat button</h3>\n            <p>Use flat buttons for contexts such as toolbars and dialogs to avoid gratuitous layering.</p>\n            <p><strong>Thats not an image, try it out <md-icon hide-xs md-font-icon=\"zmdi zmdi-chevron-right\"></md-icon></strong></p>\n        </div>\n        <div flex flex-xs=\"100\" class=\"elements-buttons-flat-usage md-whiteframe-z3\" layout=\"column\">\n            <div class=\"md-padding\">\n                <h2>Would you like to use our location service?</h2>\n                <p>Let us monitor your location to keep you up to date with everything that is happening in your current area.</p>\n            </div>\n            <md-divider></md-divider>\n            <div class=\"md-padding\" layout=\"row\" layout-align=\"end center\">\n                <md-button class=\"md-primary\">Disagree</md-button>\n                <md-button class=\"md-primary\">Agree</md-button>\n            </div>\n        </div>\n    </div>\n\n    <md-divider class=\"margin-top-20 margin-bottom-20\"></md-divider>\n\n    <h3>Button Ripple Options</h2>\n    <p>You can also change the style of ripple effects using the <code>md-ripple-size</code> and <code>md-no-ink</code> attribute</p>\n    <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom >\n        <md-tab label=\"example\">\n            <div class=\"padding-40 md-tabs-content\">\n                <md-card>\n                    <md-card-content ng-include=\"\'app/examples/elements/examples/button-ripple.tmpl.html\'\"></md-card-content>\n                </md-card>\n            </div>\n        </md-tab>\n        <md-tab label=\"HTML\">\n            <div class=\"md-tabs-content\">\n                <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/button-ripple.tmpl.html\'\"></div>\n            </div>\n        </md-tab>\n    </md-tabs>\n\n    <h3>Button States</h3>\n    <p>You can also change the style of ripple effects using the <code>md-ripple-size</code> attribute</p>\n    <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom >\n        <md-tab label=\"example\">\n            <div class=\"padding-40 md-tabs-content\">\n                <md-card>\n                    <md-card-content ng-include=\"\'app/examples/elements/examples/button-disabled.tmpl.html\'\"></md-card-content>\n                </md-card>\n            </div>\n        </md-tab>\n        <md-tab label=\"HTML\">\n            <div class=\"md-tabs-content\">\n                <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/button-disabled.tmpl.html\'\"></div>\n            </div>\n        </md-tab>\n    </md-tabs>\n</div>\n");
$templateCache.put("app/examples/elements/cards.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">Material Card Examples</h2>\n    <p class=\"md-subhead\">A card is a piece of paper that contains unique related data; for example, a photo, text, and link all about a single subject. Cards are typically an entry point to more complex and detailed information.</p>\n\n    <p>Cards have a constant width and variable height. The maximum height is limited to what can fit within a single view on a platform, but it can temporarily expand as needed (for example, to display a comment field).  Cards do not flip to reveal information on their back.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Simple Card - with top image</h2>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs elements-cards-example1 margin-bottom-40\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\" ng-include=\"\'app/examples/elements/examples/cards-1.tmpl.html\'\"></div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/cards-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Card - with media</h2>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs elements-cards-example1 margin-bottom-40\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\" ng-include=\"\'app/examples/elements/examples/cards-2.tmpl.html\'\"></div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/cards-2.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Card - action buttons and titles</h2>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs elements-cards-example1 margin-bottom-40\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\" ng-include=\"\'app/examples/elements/examples/cards-3.tmpl.html\'\"></div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/cards-3.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>\n");
$templateCache.put("app/examples/elements/checkboxes.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">Material Checkbox Examples</h2>\n    <p class=\"md-subhead\">Checkboxes allow the user to select multiple options from a set.  If you have multiple on/off options appearing in a list, checkboxes are a good way to preserve space.</p>\n\n    <p>Checkboxes use animation to communicate focused and pressed states.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Simple Checkbox</h2>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card ng-init=\"checkboxes = { primary: true, default: true, warn: true }\">\n                        <md-card-content class=\"padding-40\" layout-padding layout-align=\"space-around start\" ng-include=\"\'app/examples/elements/examples/checkboxes-1.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/checkboxes-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>\n");
$templateCache.put("app/examples/elements/chips.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">Contact Chips Example</h2>\n    <p class=\"md-subhead\">Chips represent complex entities in small blocks, such as a contact.  They can contain a photo, short title string, and brief information.</p>\n\n    <p>Contact chips represent contact information that users have for people in a compact way. They are invoked and inserted into a text field (usually the To field) when the user starts typing a contact’s name, sees the contact’s addresses, and selects the correct one. Contact chips can be added directly to a text field from a menu of contacts.</p>\n\n    <p class=\"md-caption\">Type in the TO, CC or BCC fields to see how the chips work.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Email Example</h2>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content ng-include=\"\'app/examples/elements/examples/chips-1.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/chips-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/elements/examples/chips.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </md-content>\n</div>\n");
$templateCache.put("app/examples/elements/datepicker.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">Datepicker Example</h2>\n    <p>The selected day is indicated by a filled circle. The current day is indicated by a different color and type weight.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Datepicker Example</h2>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content ng-include=\"\'app/examples/elements/examples/datepicker-1.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/datepicker-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </md-content>\n</div>\n");
$templateCache.put("app/examples/elements/dialogs.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">Popup Dialog Example</h2>\n    <p class=\"md-subhead\">Dialogs inform users about critical information, require users to make decisions, or encapsulate multiple tasks within a discrete process. Use dialogs sparingly because they are interruptive in nature—their sudden appearance forces users to stop their current task and refocus on the dialog content. Not every choice, setting, or detail warrants such interruption and prominence.</p>\n\n    <p>Alternatives to dialogs include simple menus or inline expansion within the current content area. Both approaches present information or options while maintaining the current context and are less disruptive.</p>\n\n    <p class=\"md-caption\">Try creating a dialog with the example below</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Create a dialog</h2>\n            </div>\n        </md-toolbar>\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\" ng-include=\"\'app/examples/elements/examples/dialog-1.tmpl.html\'\"></div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/dialog-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"js\" hljs-include=\"\'app/examples/elements/examples/dialog-1.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </md-content>\n</div>\n");
$templateCache.put("app/examples/elements/fab-speed.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">Speed Dial Button Example</h2>\n    <p class=\"md-subhead\">The floating action button can fling out related actions upon press.</p>\n\n    <p>The button should remain on screen after the menu is invoked. Tapping in the same spot should either activate the most commonly used action or close the open menu.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>FAB Speed Dial</h2>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content layout=\"row\" layout-padding layout-align=\"space-around start\" ng-include=\"\'app/examples/elements/examples/fab-speed-1.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/fab-speed-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"js\" hljs-include=\"\'app/examples/elements/examples/fab-speed-1.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>\n");
$templateCache.put("app/examples/elements/fab-toolbar.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">FAB Toolbar Examples</h2>\n    <p class=\"md-subhead\">The floating action button can fling out related actions upon press.</p>\n\n    <p>The button should remain on screen after the menu is invoked. Tapping in the same spot should either activate the most commonly used action or close the open menu.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>FAB Toolbar</h2>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content layout=\"column\" ng-include=\"\'app/examples/elements/examples/fab-toolbar-1.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/fab-toolbar-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>\n");
$templateCache.put("app/examples/elements/grids.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">Grid List Example</h2>\n    <p class=\"md-subhead\">Grid lists are an alternative to standard list views. Grid lists are distinct from grids used for layouts and other visual presentations.</p>\n\n    <p>A grid list is best suited to presenting a homogenous data type, typically images, and is optimized for visual comprehension and differentiating between like data types.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Coloured Grid List</h2>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content ng-include=\"\'app/examples/elements/examples/grids-1.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/grids-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/elements/examples/grids-1.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>\n");
$templateCache.put("app/examples/elements/icons.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">Font Icon Examples</h2>\n    <p class=\"md-subhead\">Triangular comes with Material and Font Awesome Icons which can be used in your admin pages and buttons.</p>\n\n    <div class=\"elements-icons md-whiteframe-z3\" layout=\"column\">\n        <md-toolbar class=\"md-primary\">\n            <div class=\"md-toolbar-tools\">\n                <h2>\n                  <span>{{::vm.icons.length}} Font Icons</span>\n                </h2>\n            </div>\n        </md-toolbar>\n\n        <div layout=\"row\" layout-align=\"space-around center\">\n            <md-input-container>\n                <label>Search icons</label>\n                <input type=\"text\" ng-model=\"searchIcon\">\n            </md-input-container>\n            <md-select placeholder=\"Pick a font family\" ng-model=\"family\">\n                <md-option ng-value=\"family\" ng-repeat=\"family in ::vm.families\">{{::family}}</md-option>\n            </md-select>\n        </div>\n\n        <div layout=\"row\" class=\"md-whiteframe-z1\">\n            <md-content>\n                <md-list>\n                    <md-list-item class=\"md-2-line\" ng-repeat=\"icon in vm.icons | filter:{ name: searchIcon, family: family }\" ng-click=\"vm.selectIcon(icon)\">\n                        <div class=\"md-list-item-text\">\n                            <h3>{{::icon.name}}</h3>\n                            <h4>{{::icon.family}}</h4>\n                        </div>\n                        <md-icon class=\"md-avatar\" md-font-icon=\"{{::icon.className}}\"></md-icon>\n                    </md-list-item>\n                </md-list>\n            </md-content>\n            <div class=\"elements-icons-preview\" layout=\"row\" layout-align=\"center center\" flex>\n                <div layout=\"column\" layout-fill>\n                    <p ng-show=\"vm.selectedIcon == null\">Select an icon from the list on the left</p>\n                    <div flex layout=\"row\" layout-align=\"space-around center\" ng-hide=\"vm.selectedIcon == null\">\n                        <div layout=\"column\" layout-align=\"center center\">\n                            <md-button class=\"md-fab md-primary\" aria-label=\"primary button\">\n                                <md-icon ng-class=\"vm.selectedIcon.className\"></md-icon>\n                            </md-button>\n                            <p class=\"md-caption\">Primary</p>\n                        </div>\n                        <div layout=\"column\" layout-align=\"center center\">\n                            <md-button class=\"md-fab md-accent\" aria-label=\"accent button\">\n                                <md-icon ng-class=\"vm.selectedIcon.className\"></md-icon>\n                            </md-button>\n                            <p class=\"md-caption\">Accent</p>\n                        </div>\n                        <div layout=\"column\" layout-align=\"center center\">\n                            <md-button class=\"md-fab md-warn\" aria-label=\"warn button\">\n                                <md-icon ng-class=\"vm.selectedIcon.className\"></md-icon>\n                            </md-button>\n                            <p class=\"md-caption\">Warn</p>\n                        </div>\n                    </div>\n                    <div flex layout=\"row\" layout-align=\"space-around center\" ng-hide=\"vm.selectedIcon == null\">\n                        <div layout=\"column\" ng-repeat=\"size in [\'16px\',\'24px\', \'36px\', \'48px\']\" layout-align=\"center center\">\n                            <md-icon ng-style=\"{ \'font-size\': size, \'height\': size, \'width\': size }\" ng-class=\"vm.selectedIcon.className\"></md-icon>\n                            <p class=\"md-caption\">{{size}}</p>\n                        </div>\n                    </div>\n\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n");
$templateCache.put("app/examples/elements/lists.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">Material List Examples</h2>\n    <p class=\"md-subhead\">Lists present multiple line items in a vertical arrangement as a single continuous element.</p>\n\n    <p>A list consists of a single continuous column of tessellated sub-divisions of equal width called rows that function as containers for tiles.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>List with avatar and text examples</h2>\n            </div>\n        </md-toolbar>\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content layout=\"row\" layout-padding layout-align=\"space-around start\" ng-include=\"\'app/examples/elements/examples/lists-1.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/lists-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n\n\n    <div class=\"example-code md-whiteframe-z1\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>List with controls examples</h2>\n            </div>\n        </md-toolbar>\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content layout=\"row\" layout-padding layout-align=\"space-around center\" ng-include=\"\'app/examples/elements/examples/lists-2.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/lists-2.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>\n");
$templateCache.put("app/examples/elements/loader.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">Page Loader Example</h2>\n    <p class=\"md-subhead\">Use the triangular loader service to turn the page loader on and off when you are making API requests.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Loader Example</h2>\n            </div>\n        </md-toolbar>\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content layout=\"row\" layout-align=\"space-around center\" ng-include=\"\'app/examples/elements/examples/loader-1.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/loader-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/elements/examples/loader-1.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>\n");
$templateCache.put("app/examples/elements/menus.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">Material Icon Button Examples</h2>\n    <p class=\"md-subhead\">A menu is a temporary piece of material emitted from a button, an action, a pointer, or another control that contains at least two menu items.</p>\n\n    <p>Each menu item is a discrete option or action that can affect the app, the view, or selected elements within a view.</p>\n\n    <p>Here is an example of how menus could be used in a toolbar</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Menu inside a toolbar</h2>\n            </div>\n        </md-toolbar>\n        <md-tabs class=\"example-tabs\" md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content layout=\"column\" ng-include=\"\'app/examples/elements/examples/menu-1.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/menu-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>\n");
$templateCache.put("app/examples/elements/progress.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">Material Progress Examples</h2>\n    <p class=\"md-subhead\">Make loading content in your app as delightful and painless as possible by minimizing the amount of visual change a user sees before they can view and interact with content. Each operation should only be represented by one activity indicator—for example, one refresh operation should not display both a refresh bar and an activity circle.</p>\n\n    <p>There are two types of indicators: linear and circular. You can use either one for determinate and indeterminate operations.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Linear Progress Bar</h2>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content layout=\"column\" layout-padding layout-margin layout-align=\"space-between start\" ng-include=\"\'app/examples/elements/examples/progress-linear.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/progress-linear.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Circular Progress Bar</h2>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content layout=\"column\" layout-padding layout-margin layout-align=\"space-between start\" ng-include=\"\'app/examples/elements/examples/progress-circular.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/progress-circular.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>\n");
$templateCache.put("app/examples/elements/radios.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">Radio Button Examples</h2>\n    <p class=\"md-subhead\">Radio buttons allow the user to select one option from a set. Use radio buttons for exclusive selection if you think that the user needs to see all available options side-by-side.</p>\n\n    <p>Radio buttons use animation to communicate focused and pressed states.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Radio Colors</h2>\n            </div>\n        </md-toolbar>\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content layout=\"row\" layout-align=\"space-around center\" ng-include=\"\'app/examples/elements/examples/radios-1.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/radios-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Image Radios</h2>\n            </div>\n        </md-toolbar>\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content layout=\"column\" layout-align=\"center center\" ng-include=\"\'app/examples/elements/examples/radios-2.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/radios-2.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>\n");
$templateCache.put("app/examples/elements/selects.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">Material Select Examples</h2>\n    <p class=\"md-subhead\">Selects allow users to take an action by selecting from a list of choices revealed upon opening a temporary, new sheet of material.</p>\n\n    <p>A grid list is best suited to presenting a homogenous data type, typically images, and is optimized for visual comprehension and differentiating between like data types.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Simple Select</h2>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content layout=\"row\" layout-padding layout-align=\"space-around center\" ng-include=\"\'app/examples/elements/examples/select-1.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/select-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Option Groups</h2>\n            </div>\n        </md-toolbar>\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content layout=\"row\" layout-padding layout-align=\"space-around center\" ng-include=\"\'app/examples/elements/examples/select-2.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/select-2.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>\n");
$templateCache.put("app/examples/elements/sidebars.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">Sidebar Examples</h2>\n    <p class=\"md-subhead\">If present, the left and right nav bars can be pinned for permanent display or they can float temporarily as overlays.</p>\n\n    <p>The content in the left nav is ideally navigation- or identity-based. The content in the right nav should be secondary to the main content on a page.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Open a sidebar</h2>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"example-tabs-500-height elements-sidebar-example\" ng-include=\"\'app/examples/elements/examples/sidebars-1.tmpl.html\'\">\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/sidebars-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </md-content>\n</div>\n");
$templateCache.put("app/examples/elements/sliders.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">Material Slider Examples</h2>\n    <p class=\"md-subhead\">Sliders let users select a value from a continuous or discrete range of values by moving the slider thumb. The smallest value is to the left, the largest to the right. Sliders can have icons to the left and right of the bar that reflect the value intensity. The interactive nature of the slider makes it a great choice for settings that reflect intensity levels, such as volume, brightness, or color saturation.</p>\n\n    <p>Use continuous sliders for subjective settings that do not require a specific value for the user to make meaningful adjustments.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Continuous Slider</h2>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content ng-include=\"\'app/examples/elements/examples/slider-continuous.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/slider-continuous.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Discrete Slider</h2>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content ng-include=\"\'app/examples/elements/examples/slider-discrete.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/slider-discrete.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>\n");
$templateCache.put("app/examples/elements/switches.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">Material Switch Examples</h2>\n    <p class=\"md-subhead\">On/off switches toggle the state of a single settings option. The option that the switch controls, as well as the state it’s in, should be made clear from the corresponding inline label. Switches take on the same visual properties of the radio button.</p>\n\n    <p>Switches use animation to communicate focused and pressed states.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Control Switches</h2>\n            </div>\n        </md-toolbar>\n        <md-tabs class=\"example-tabs example-tabs-nopadding margin-bottom-40\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content class=\"padding-40\" layout-align=\"center start\" ng-include=\"\'app/examples/elements/examples/switches-1.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/switches-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n </div>\n");
$templateCache.put("app/examples/elements/tables.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">Material Table Examples</h2>\n    <p class=\"md-subhead\">Data tables are used to present raw data sets, and usually appear in desktop enterprise products. Data sets may include three or more columns of data, a corresponding visualization and the ability for users to query and manipulate data at scale.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Simple Example</h2>\n            </div>\n        </md-toolbar>\n        <md-tabs class=\"example-tabs example-tabs-nopadding margin-bottom-40\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content ng-include=\"\'app/examples/elements/examples/table-1.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/table-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/elements/examples/table-1.controller.js\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"SCSS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"css\" hljs-include=\"\'app/examples/elements/examples/table-1.tmpl.scss\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n\n    <p class=\"md-subhead\">Advanced Table with filters, connecting to github api using the <a href=\"https://github.com/daniel-nagy/md-data-table\">md-data-table directive</a>.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>md-data-table Example</h2>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs example-tabs-nopadding margin-bottom-40\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content ng-include=\"\'app/examples/elements/examples/table-advanced.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/table-advanced.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/elements/examples/table-advanced.controller.js\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"SCSS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"css\" hljs-include=\"\'app/examples/elements/examples/table-advanced.tmpl.scss\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>\n");
$templateCache.put("app/examples/elements/tabs.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">Tabs Examples</h2>\n    <p class=\"md-subhead\">Tabs make it easy to explore and switch between different views or functional aspects of an app or to browse categorized data sets.</p>\n\n    <p>A tab provides the affordance for displaying grouped content. A tab label succinctly describes the tab’s associated grouping of content.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Tabs example</h2>\n            </div>\n        </md-toolbar>\n        <md-tabs class=\"example-tabs-nopadding margin-bottom-40\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\" style=\"background: rgba(100, 100, 100, 0.2);\">\n                    <md-card>\n                        <md-card-content class=\"example-tabs-content\" ng-include=\"\'app/examples/elements/examples/tabs-1.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/tabs-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>\n");
$templateCache.put("app/examples/elements/textangular.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">Text Editor Example</h2>\n    <p class=\"md-subhead\">Triangular includes the <a href=\"http://textangular.com/\">Textangular</a> text editor.</p>\n\n    <p>We have materialised some of the toolbar options so that your text editor will look great.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Email example</h2>\n            </div>\n        </md-toolbar>\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-toolbar>\n                            <div class=\"md-toolbar-tools\">\n                                <h2>\n                                    <span>Compose Email</span>\n                                </h2>\n                            </div>\n                        </md-toolbar>\n                        <md-card-content ng-include=\"\'app/examples/elements/examples/textangular-1.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/textangular-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>\n");
$templateCache.put("app/examples/elements/toasts.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">Toast Popup Examples</h2>\n    <p class=\"md-subhead\">Toasts provide lightweight feedback about an operation. They show a brief message at the bottom of the screen on mobile and lower left on desktop. Toasts appear above all other elements on screen. Toasts can contain an action.</p>\n\n    <p>They automatically disappear after a timeout or after user interaction elsewhere on the screen, particularly after interactions that summon a new surface or activity. Toasts can be swiped off screen. They do not block input on the screens on which they appear. Show only one snackbar on screen at a time.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Pop a toast</h2>\n            </div>\n        </md-toolbar>\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content example-tabs-500-height\" ng-controller=\"Toast1Controller as vm\" ng-include=\"\'app/examples/elements/examples/toast-1.tmpl.html\'\">\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/toast-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/elements/examples/toast-1.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>\n");
$templateCache.put("app/examples/elements/toolbars.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">Toolbar Examples</h2>\n    <p class=\"md-subhead\">Toolbars are usually used above a content area to display the title of the current page, and show relevant action buttons for that page.</p>\n\n    <p>You can change the height of the toolbar by adding either the md-medium-tall or md-tall class to the toolbar.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Example toolbars</h2>\n            </div>\n        </md-toolbar>\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content ng-include=\"\'app/examples/elements/examples/toolbar-1.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/toolbar-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>\n");
$templateCache.put("app/examples/elements/tooltips.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">Tooltip Examples</h2>\n    <p class=\"md-subhead\">Tooltips are labels that appear on hover and focus when the user hovers over an element with the cursor, focuses on an element using a keyboard (usually through the tab key), or, in a touch UI, upon touch (without releasing). They contain textual identification for the element in question. They may also contain brief helper text regarding the function of the element. Nothing within the label can take focus.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Example tooltips</h2>\n            </div>\n        </md-toolbar>\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content layout=\"row\" layout-align=\"center center\" ng-include=\"\'app/examples/elements/examples/tooltip-1.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/tooltip-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>\n");
$templateCache.put("app/examples/elements/upload.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">File Upload Examples</h2>\n    <p class=\"md-subhead\">Triangular includes the <a href=\"https://github.com/danialfarid/ng-file-upload\">ng-file-upload directive</a> to allow easy upload form creation.</p>\n\n    <p>Here are some examples</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h3>Simple upload button (allow multiple)</h3>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"padding-40 md-tabs-content\">\n                    <md-card>\n                        <md-card-content ng-controller=\"ElementsUpload1Controller as vm\" ng-include=\"\'app/examples/elements/examples/upload-1.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/upload-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/elements/examples/upload-1.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h3>Upload button with animation</h3>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"padding-40 md-tabs-content\">\n                    <md-card>\n                        <md-card-content ng-controller=\"ElementsUploadAnimateController as vm\" ng-include=\"\'app/examples/elements/examples/upload-animate.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/upload-animate.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/elements/examples/upload-animate.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>\n");
$templateCache.put("app/examples/elements/whiteframes.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">Whiteframe Examples</h2>\n    <p class=\"md-subhead\">Whiteframes provide a variety of layout structures using a consistent approach to surfaces, layering, and shadows.</p>\n\n    <div class=\"example-code md-whiteframe-z1\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h3>Whiteframe examples</h3>\n            </div>\n        </md-toolbar>\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content elements-whiteframe-example padding-40\">\n                    <div layout=\"column\" layout-align=\"center center\" layout-padding ng-include=\"\'app/examples/elements/examples/whiteframe-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/whiteframe-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>\n");
$templateCache.put("app/examples/email/email-dialog.tmpl.html","<md-dialog class=\"mobile-fullwidth-dialog\">\n    <md-toolbar class=\"toolbar-default\" md-theme=\"{{vm.triSkin.elements.toolbar}}\">\n        <div class=\"md-toolbar-tools\">\n            <h2>\n              <span>{{vm.title}}</span>\n            </h2>\n            <span flex></span>\n            <md-button class=\"md-icon-button\" ng-click=\"vm.cancel()\" aria-label=\"cancel\">\n                <md-icon md-font-icon=\"zmdi zmdi-close\"></md-icon>\n            </md-button>\n        </div>\n    </md-toolbar>\n\n    <md-divider></md-divider>\n\n    <md-dialog-content class=\"email-dialog md-padding\">\n        <form name=\"emailForm\" novalidate>\n            <div layout=\"row\">\n                <div layout=\"column\" flex>\n                    <md-contact-chips\n                        flex\n                        ng-model=\"vm.email.to\"\n                        md-contacts=\"vm.queryContacts($query)\"\n                        md-contact-name=\"name\"\n                        md-contact-image=\"image\"\n                        md-contact-email=\"email\"\n                        md-require-match\n                        filter-selected=\"true\"\n                        placeholder=\"{{\'To\' | triTranslate}}\"\n                        secondary-placeholder=\"{{\'To\' | triTranslate}}\">\n                    </md-contact-chips>\n                    <div class=\"email-dialog-ccs ng-hide\" layout=\"column\" ng-show=\"vm.showCCS\" >\n                        <md-contact-chips\n                            ng-model=\"vm.email.cc\"\n                            md-contacts=\"vm.queryContacts($query)\"\n                            md-contact-name=\"name\"\n                            md-contact-image=\"image\"\n                            md-contact-email=\"email\"\n                            md-require-match\n                            filter-selected=\"true\"\n                            placeholder=\"{{\'CC\' | triTranslate}}\"\n                            secondary-placeholder=\"{{\'CC\' | triTranslate}}\">\n                        </md-contact-chips>\n                        <md-contact-chips\n                            ng-model=\"vm.email.bcc\"\n                            md-contacts=\"vm.queryContacts($query)\"\n                            md-contact-name=\"name\"\n                            md-contact-image=\"image\"\n                            md-contact-email=\"email\"\n                            md-require-match\n                            filter-selected=\"true\"\n                            placeholder=\"{{\'BCC\' | triTranslate}}\"\n                            secondary-placeholder=\"{{\'BCC\' | triTranslate}}\">\n                        </md-contact-chips>\n                    </div>\n                </div>\n                <md-button class=\"md-icon-button\" ng-click=\"vm.toggleCCS($event)\" aria-label=\"toggle ccs\">\n                    <md-icon md-font-icon ng-class=\"vm.showCCSIcon\"></md-icon>\n                </md-button>\n            </div>\n\n            <md-input-container class=\"email-subject md-block\">\n                <label for=\"subject\" translate>Subject</label>\n                <input ng-model=\"vm.email.subject\" name=\"subject\" required>\n                <div ng-messages=\"emailForm.subject.$error\">\n                    <div ng-message when=\"required\">\n                        <span translate>Please enter a subject for the email.</span>\n                    </div>\n                </div>\n            </md-input-container>\n\n            <text-angular class=\"email-content\" name=\"emailBody\" ng-model=\"vm.email.content\" ta-target-toolbars=\"editor-toolbar\"></text-angular>\n        </form>\n    </md-dialog-content>\n\n    <md-dialog-actions layout=\"row\">\n        <text-angular-toolbar name=\"editor-toolbar\" class=\"email-dialog-editor-toolbar\" ta-toolbar-active-button-class=\"active\"></text-angular-toolbar>\n        <span flex></span>\n        <md-button ng-click=\"vm.send()\" class=\"md-primary\" ng-disabled=\"emailForm.$invalid\" aria-label=\"send\" translate=\"Send\"></md-button>\n    </md-dialog-actions>\n</md-dialog>");
$templateCache.put("app/examples/email/email.tmpl.html","<md-content class=\"md-padding full-width\">\n    <md-card>\n        <md-card-header>\n            <md-card-avatar>\n                <img class=\"md-user-avatar\" ng-src=\"{{::vm.email.from.image}}\"/>\n            </md-card-avatar>\n            <md-card-header-text>\n                <span class=\"md-title\">{{::vm.email.from.name}}</span>\n                <span class=\"md-subhead\">{{::vm.email.subject}}</span>\n            </md-card-header-text>\n            <md-card-icon-actions>\n                <md-button class=\"md-icon-button\" aria-label=\"close\" ng-click=\"vm.closeEmail()\">\n                    <md-icon md-font-icon=\"zmdi zmdi-close\"></md-icon>\n                </md-button>\n            </md-card-icon-actions>\n        </md-card-header>\n        <md-divider></md-divider>\n        <md-card-content>\n            <p ng-repeat=\"paragraph in vm.email.content\">{{paragraph}}</p>\n        </md-card-content>\n        <md-divider></md-divider>\n        <md-card-actions layout=\"row\" layout-align=\"end center\">\n            <md-button class=\"md-icon-button\" ng-click=\"vm.emailAction($event, \'Reply\')\" aria-label=\"Reply\">\n                <md-icon md-font-icon=\"zmdi zmdi-mail-reply\"></md-icon>\n            </md-button>\n            <md-button class=\"md-icon-button\" ng-click=\"vm.emailAction($event, \'Reply_ALL\')\" aria-label=\"Reply All\">\n                <md-icon md-font-icon=\"zmdi zmdi-mail-reply-all\"></md-icon>\n            </md-button>\n            <md-button class=\"md-icon-button\" ng-click=\"vm.emailAction($event, \'Forward\')\" aria-label=\"Forward\">\n                <md-icon md-font-icon=\"zmdi zmdi-forward\"></md-icon>\n            </md-button>\n            <md-button class=\"md-icon-button\" ng-click=\"vm.deleteEmail(vm.email)\" aria-label=\"Delete\">\n                <md-icon md-font-icon=\"zmdi zmdi-delete\"></md-icon>\n            </md-button>\n        </md-card-actions>\n    </md-card>\n</md-content>\n");
$templateCache.put("app/examples/email/inbox.tmpl.html","<div flex layout=\"row\">\n    <md-content flex=\"100\" flex-gt-xs=\"50\" flex-gt-lg=\"40\" ng-show=\"vm.showEmailList\">\n        <md-list class=\"inbox-list\">\n            <div ng-repeat=\"group in vm.emailGroups\">\n                <md-subheader class=\"md-primary\" ng-show=\"group.emails.length > 0\">{{::group.name}}</md-subheader>\n                <md-list-item class=\"inbox-list__email inbox-list__email--animated md-3-line md-long-text\" ng-repeat=\"email in group.emails | orderBy:\'-date\'\" ng-click=\"vm.openMail(email)\" ng-class=\"{ \'inbox-list__email--active\': vm.selectedMail === email.id, \'inbox-list__email--unread\': email.unread }\">\n                    <img class=\"md-avatar\" ng-src=\"{{::email.from.image}}\" alt=\"{{::email.from.name}}\">\n                    <div class=\"md-list-item-text\" layout=\"column\">\n                        <h3><span class=\"md-caption\" am-time-ago=\"email.date\"></span>{{::email.from.name}}</h3>\n                        <h4>{{::email.subject}}</h4>\n                        <p>{{::email.content[0] | cut:true:80:\' ...\'}}</p>\n                    </div>\n                    <md-divider ng-if=\"!$last\"></md-divider>\n                </md-list-item>\n            </div>\n        </md-list>\n    </md-content>\n    <div class=\"inbox-email md-whiteframe-z1 animate-wrapper\" layout=\"column\" layout-align=\"start center\" flex>\n        <div flex id=\"ui-admin-email\" ui-view layout=\"column\" layout-align=\"start center\" class=\"overflow-auto full-width\">\n            <div flex class=\"inbox-no-email-selected\" layout=\"column\" layout-align=\"center\">\n                <h2 hide-xs translate>No email selected</h2>\n            </div>\n        </div>\n    </div>\n</div>\n<md-button ng-click=\"vm.composeClick($event)\" class=\"md-fab md-accent md-fab-bottom-right\" aria-label=\"{{\'EMAIL.COMPOSE_EMAIL\' | triTranslate}}\">\n    <md-icon md-font-icon=\"zmdi zmdi-edit\"></md-icon>\n</md-button>\n");
$templateCache.put("app/examples/extras/avatars.tmpl.html","<md-content class=\"padded-content-page\">\n    <p class=\"md-subhead\">Triangular includes an enormous set of Material Design Avatars. Amazing details and 1000s of combinations. Includes original Adobe Illustrator file as well as 1440 exported images</p>\n\n    <md-grid-list md-cols=\"6\" md-cols-xs=\"4\" md-row-height=\"1:1\" md-gutter=\"4px\">\n        <md-grid-tile md-rowspan=\"{{::avatar.rowspan}}\" md-colspan=\"{{::avatar.colspan}}\" ng-repeat=\"avatar in ::vm.avatars\" ng-style=\"::{ \'background-image\': \'url(\' + avatar.image + \')\', \'background-size\' : \'cover\' }\" palette-background=\"{{::avatar.color}}:{{::avatar.hue}}\">\n            <md-grid-tile-footer>\n                <h3>{{::avatar.title}}</h3>\n            </md-grid-tile-footer>\n        </md-grid-tile>\n    </md-grid-list>\n</md-content>");
$templateCache.put("app/examples/extras/blank.tmpl.html","<div class=\"padded-content-page\">\n    <div layout=\"row\" layout-align=\"center center\">\n        <p>Your content here</p>\n    </div>\n</div>");
$templateCache.put("app/examples/extras/gallery-dialog.tmpl.html","<md-dialog aria-label=\"{{vm.currentImage.title}}\">\n    <md-dialog-content class=\"md-dialog-content extras-image-dialog\">\n        <img ng-src=\"{{vm.currentImage.urlFull}}\" alt=\"{{vm.currentImage.title}}\">\n    </md-dialog-content>\n    <md-dialog-actions layout=\"row\">\n        {{vm.currentImage.title}}\n        <span flex></span>\n        <md-button ng-click=\"vm.prev()\" class=\"md-icon-button\" aria-label=\"Close\">\n            <md-icon md-font-icon=\"zmdi zmdi-chevron-left\"></md-icon>\n        </md-button>\n        <md-button ng-click=\"vm.next()\" class=\"md-icon-button\" aria-label=\"Close\">\n            <md-icon md-font-icon=\"zmdi zmdi-chevron-right\"></md-icon>\n        </md-button>\n    </md-dialog-actions>\n</md-dialog>");
$templateCache.put("app/examples/extras/gallery.tmpl.html","<md-content class=\"extras-gallery-container\">\n    <md-list>\n        <div ng-repeat=\"day in ::vm.feed\">\n            <md-subheader>{{day.date | amCalendar}}</md-subheader>\n            <md-list-item>\n                <md-grid-list flex md-cols=\"6\" md-cols-xs=\"4\" md-row-height=\"4:3\" md-gutter=\"4px\">\n                    <md-grid-tile ng-click=\"vm.openImage(day, image, $event)\" md-rowspan=\"{{::image.rowspan}}\" md-colspan=\"{{::image.colspan}}\" ng-repeat=\"image in ::day.images\" ng-style=\"::{ \'background-image\': \'url(\' + image.url + \')\', \'background-size\' : \'cover\' }\">\n                        <md-grid-tile-footer>\n                            <h3>{{::image.title}}</h3>\n                        </md-grid-tile-footer>\n                    </md-grid-tile>\n                </md-grid-list>\n            </md-list-item>\n        </div>\n    </md-list>\n</md-content>\n");
$templateCache.put("app/examples/extras/timeline.tmpl.html","<div class=\"overlay-5 padded-content-page\" animate-elements>\n    <div class=\"timeline\" layout=\"row\" ng-repeat=\"event in ::vm.events\" ng-attr-layout-align=\"{{$odd? \'end end\':\'start start\'}}\">\n        <div layout=\"row\" flex=\"50\" flex-xs=\"100\" ng-attr-layout-align=\"{{$odd? \'end\':\'start\'}} center\">\n            <div class=\"timeline-point md-whiteframe-z1\" theme-background=\"primary\" md-theme=\"{{triSkin.elements.content}}\">\n                <img ng-src=\"{{::event.image}}\" class=\"timeline-point-avatar\"/>\n                <span class=\"timeline-point-date\">{{::event.date}}</span>\n            </div>\n            <md-divider class=\"timeline-x-axis\" class=\"margin-0\" flex flex-order=\"2\"></md-divider>\n            <tri-widget class=\"timeline-widget margin-0 flex-70 flex-xs-100 {{::event.classes}}\" title=\"{{::event.title}}\" subtitle=\"{{::event.subtitle}}\" title-position=\"bottom\" ng-attr-flex-order=\"{{$odd? 2:1}}\" palette-background=\"{{::event.palette}}\" >\n                <div replace-with=\'{{event.content}}\'></div>\n            </tri-widget>\n            <md-divider class=\"timeline-y-axis\"></md-divider>\n        </div>\n    </div>\n</div>\n");
$templateCache.put("app/examples/forms/autocomplete.tmpl.html","<md-content class=\"padded-content-page\">\n    <p class=\"md-subhead\">You can use autocomplete to search for matches from local or remote data sources.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Autocomplete example</h2>\n            </div>\n        </md-toolbar>\n        <md-tabs class=\"example-tabs margin-bottom-40\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content ng-controller=\"Autocomplete1Controller as vm\" ng-include=\"\'app/examples/forms/examples/autocomplete-1.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/forms/examples/autocomplete-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/forms/examples/autocomplete-1.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</md-content>");
$templateCache.put("app/examples/forms/binding.tmpl.html","<md-content class=\"padded-content-page\">\n    <p class=\"md-subhead\">Data-binding in Angular apps is the automatic synchronization of data between the model and view components. The way that Angular implements data-binding lets you treat the model as the single-source-of-truth in your application. The view is a projection of the model at all times. When the model changes, the view reflects the change, and vice versa.</p>\n\n    <p class=\"md-caption\">Try filling in the form below to see what happens to the user data structure in the second panel.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Binding a form to data</h2>\n            </div>\n        </md-toolbar>\n        <md-tabs class=\"example-tabs margin-bottom-40\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <div ng-controller=\"Binding1Controller\" ng-include=\"\'app/examples/forms/examples/binding-1.tmpl.html\'\" layout=\"row\" layout-xs=\"column\" layout-align=\"center center\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/forms/examples/binding-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/forms/examples/binding-1.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</md-content>");
$templateCache.put("app/examples/forms/inputs.tmpl.html","<md-content class=\"padded-content-page\">\n    <p class=\"md-subhead\">Text fields allow the user to input text. They can be single line, with or without scrolling, or multi-line, and can have an icon.</p>\n\n    <p>Touching a text field places the cursor and automatically displays the keyboard. In addition to typing, text fields allow for a variety of other tasks, such as text selection (cut, copy, paste) and data lookup via auto-completion. See Patterns > Selection for text selection design.</p>\n\n    <p>With floating inline labels, when the user engages with the text input field, the labels move to float above the field.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Floating labels</h2>\n            </div>\n        </md-toolbar>\n        <md-tabs class=\"example-tabs margin-bottom-40\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content ng-include=\"\'app/examples/forms/examples/inputs-float.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/forms/examples/inputs-float.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n\n    <p>You can also add informative icons to your input fields.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Forms with icons</h2>\n            </div>\n        </md-toolbar>\n        <md-tabs class=\"example-tabs margin-bottom-40\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content ng-include=\"\'app/examples/forms/examples/inputs-icons.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/forms/examples/inputs-icons.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n\n    <p>You can use a character counter in fields where a character restriction is in place.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Inputs with counter</h2>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs margin-bottom-40\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content ng-include=\"\'app/examples/forms/examples/inputs-counter.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/forms/examples/inputs-counter.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n\n    </div>\n\n    <p>You can also toggle the state of inputs by setting <code>ng-disabled</code></p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Input state</h2>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs margin-bottom-40\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content layout=\"row\" layout-align=\"space-around center\" ng-include=\"\'app/examples/forms/examples/inputs-states.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/forms/examples/inputs-states.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</md-tab>");
$templateCache.put("app/examples/forms/validation.tmpl.html","<div class=\"padded-content-page\">\n    <p class=\"md-subhead\">Inform users about the state of the form as they fill it in. Disable form buttons until form reaches a valid state.</p>\n    <p>Note the example below.  The input field is required and also needs a valid email address or a warning message will appear.  Also the Create button will only be enabled when the form is valid.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Form Validation</h2>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs margin-bottom-40\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"padding-40 md-tabs-content\">\n                    <md-card>\n                        <md-card-content ng-include=\"\'app/examples/forms/examples/validation-1.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/forms/examples/validation-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>");
$templateCache.put("app/examples/forms/wizard.tmpl.html","<div>\n\n    <div layout=\"row\" layout-align=\"center center\">\n        <p flex=\"70\"  flex-xs=\"90\" class=\"md-headline font-weight-300 text-center text-light\" translate>We have combined material tabs and form inputs to create an interactive form wizardController.  We have also added validation messages to all fields and prevented the user from completing a step in the wizard until it is valid.</p>\n    </div>\n\n    <div flex layout=\"row\" layout-align=\"center center\" layout-fill>\n        <md-card flex=\"90\" class=\"tri-wizard-card md-whiteframe-z1 margin-bottom-100\" tri-wizard>\n            <md-toolbar class=\"md-primary\">\n                <div class=\"md-toolbar-tools\" layout=\"row\" layout-align=\"space-between center\">\n                    <h2>Form Wizard</h2><h2> {{triWizard.progress}}% <span translate>Complete</span></h2>\n                </div>\n                <md-progress-linear class=\"md-accent padding-bottom-10\" md-mode=\"determinate\" ng-value=\"triWizard.progress\"></md-progress-linear>\n            </md-toolbar>\n            <md-card-content>\n                <md-tabs class=\"md-primary\" layout-fill md-selected=\"triWizard.currentStep\" md-dynamic-height>\n                    <md-tab id=\"account\">\n                        <md-tab-label>\n                            <span class=\"oxy-step-label\">1</span>\n                            <span translate>Account details</span>\n                        </md-tab-label>\n                        <md-tab-body>\n                            <md-content class=\"md-padding\">\n                                <form name=\"accountForm\" tri-wizard-form novalidate>\n                                    <div>\n                                        <md-input-container class=\"md-block\">\n                                            <label translate>Username</label>\n                                            <input name=\"username\" ng-model=\"wizardController.data.account.username\" required>\n                                            <div ng-messages=\"accountForm.username.$error\" md-auto-hide=\"false\" ng-show=\"accountForm.username.$touched\">\n                                                <div ng-message when=\"required\">\n                                                    <span translate>This field is required</span>\n                                                </div>\n                                            </div>\n                                        </md-input-container>\n                                        <md-input-container class=\"md-block\">\n                                            <label>Email</label>\n                                            <input type=\"email\" name=\"email\" ng-model=\"wizardController.data.account.email\" required>\n                                            <div ng-messages=\"accountForm.email.$error\" md-auto-hide=\"false\" ng-show=\"accountForm.email.$touched\">\n                                                <div ng-message when=\"required\">\n                                                    <span translate>This field is required</span>\n                                                </div>\n                                                <div ng-message when=\"email\">\n                                                    <span translate>Please enter a valid email</span>\n                                                </div>\n                                            </div>\n                                        </md-input-container>\n                                        <div layout layout-xs=\"column\" flex>\n                                            <md-input-container flex>\n                                                <label translate>Password</label>\n                                                <input type=\"password\" name=\"password\" ng-model=\"wizardController.data.account.password\" required>\n                                                <div ng-messages=\"accountForm.password.$error\" md-auto-hide=\"false\" ng-show=\"accountForm.password.$touched\">\n                                                    <div ng-message when=\"required\">\n                                                        <span translate>This field is required</span>\n                                                    </div>\n                                                </div>\n                                            </md-input-container>\n                                            <md-input-container flex>\n                                                <label translate>Password-CONFIRM</label>\n                                                <input type=\"password\" name=\"passwordConfirm\" ng-model=\"wizardController.data.account.passwordConfirm\" required>\n                                                <div ng-messages=\"accountForm.passwordConfirm.$error\" md-auto-hide=\"false\" ng-show=\"accountForm.passwordConfirm.$touched\">\n                                                    <div ng-message when=\"required\">\n                                                        <span translate>This field is required</span>\n                                                    </div>\n                                                </div>\n                                            </md-input-container>\n                                        </div>\n                                    </div>\n                                </form>\n                            </md-content>\n                        </md-tab-body>\n                    </md-tab>\n                    <md-tab id=\"address\" ng-disabled=\"accountForm.$invalid\">\n                        <md-tab-label>\n                            <span class=\"oxy-step-label\">2</span>\n                            <span translate>Your address</span>\n                        </md-tab-label>\n                        <md-tab-body>\n                            <md-content class=\"md-padding\">\n                                <form name=\"addressForm\" tri-wizard-form>\n                                    <div>\n                                        <div layout layout-xs=\"column\" flex>\n                                            <md-input-container flex>\n                                                <label translate>First name</label>\n                                                <input name=\"firstName\" ng-model=\"wizardController.data.address.firstName\" required>\n                                                <div ng-messages=\"addressForm.firstName.$error\" md-auto-hide=\"false\" ng-show=\"addressForm.firstName.$touched\">\n                                                    <div ng-message when=\"required\">\n                                                        <span translate>This field is required</span>\n                                                    </div>\n                                                </div>\n                                            </md-input-container>\n                                            <md-input-container flex>\n                                                <label translate>Last name</label>\n                                                <input name=\"lastName\" ng-model=\"wizardController.data.address.lastName\" required>\n                                                <div ng-messages=\"addressForm.lastName.$error\" md-auto-hide=\"false\" ng-show=\"addressForm.lastName.$touched\">\n                                                    <div ng-message when=\"required\">\n                                                        <span translate>This field is required</span>\n                                                    </div>\n                                                </div>\n                                            </md-input-container>\n                                        </div>\n                                        <md-input-container class=\"md-block\">\n                                            <label translate>Address Line 1</label>\n                                            <input name=\"address1\" ng-model=\"wizardController.data.address.line1\" required>\n                                            <div ng-messages=\"addressForm.address1.$error\" md-auto-hide=\"false\" ng-show=\"addressForm.address1.$touched\">\n                                                <div ng-message when=\"required\">\n                                                    <span translate>This field is required</span>\n                                                </div>\n                                            </div>\n                                        </md-input-container>\n                                        <md-input-container class=\"md-block\">\n                                            <label translate>Address Line 1-2</label>\n                                            <input ng-model=\"wizardController.data.address.line2\">\n                                        </md-input-container>\n                                        <div layout layout-xs=\"column\" flex>\n                                            <md-input-container flex>\n                                                <label translate>Town</label>\n                                                <input ng-model=\"wizardController.data.address.town\">\n                                            </md-input-container>\n                                            <md-input-container flex>\n                                                <label translate>State</label>\n                                                <input ng-model=\"wizardController.data.address.state\">\n                                            </md-input-container>\n                                        </div>\n                                        <div layout layout-xs=\"column\" flex>\n                                            <md-input-container flex>\n                                                <label translate>Zip</label>\n                                                <input name=\"zip\" ng-model=\"wizardController.data.address.zip\" required>\n                                                <div ng-messages=\"addressForm.zip.$error\" md-auto-hide=\"false\" ng-show=\"addressForm.zip.$touched\">\n                                                    <div ng-message when=\"required\">\n                                                        <span translate>This field is required</span>\n                                                    </div>\n                                                </div>\n                                            </md-input-container>\n                                            <md-input-container flex>\n                                                <label translate>Country</label>\n                                                <md-select ng-change=\"triWizard.updateProgress()\" name=\"country\" ng-model=\"wizardController.data.address.country\" required>\n                                                    <md-option value=\"US\" translate>United States</md-option>\n                                                </md-select>\n                                                <div ng-messages=\"addressForm.country.$error\" md-auto-hide=\"false\" ng-show=\"addressForm.country.$touched\">\n                                                    <div ng-message when=\"required\">\n                                                        <span translate>This field is required</span>\n                                                    </div>\n                                                </div>\n                                            </md-input-container>\n                                        </div>\n                                    </div>\n                                </form>\n                            </md-content>\n                        </md-tab-body>\n                    </md-tab>\n                    <md-tab id=\"billing\" ng-disabled=\"addressForm.$invalid\">\n                        <md-tab-label>\n                            <span class=\"oxy-step-label\">3</span>\n                            <span translate>Billing details</span>\n                        </md-tab-label>\n                        <md-tab-body>\n                            <md-content class=\"md-padding\">\n                                <form name=\"billingForm\" tri-wizard-form>\n                                    <div>\n                                        <md-input-container class=\"md-block\">\n                                            <label translate>Credit card number</label>\n                                            <input name=\"cardNumber\" ng-model=\"wizardController.data.billing.number\" required>\n                                            <div ng-messages=\"billingForm.cardNumber.$error\" md-auto-hide=\"false\" ng-show=\"billingForm.cardNumber.$touched\">\n                                                <div ng-message when=\"required\">\n                                                    <span translate>This field is required</span>\n                                                </div>\n                                            </div>\n                                        </md-input-container>\n                                        <md-input-container class=\"md-block\">\n                                            <label translate>Name on card</label>\n                                            <input name=\"cardName\" ng-model=\"wizardController.data.billing.name\" required>\n                                            <div ng-messages=\"billingForm.cardName.$error\" md-auto-hide=\"false\" ng-show=\"billingForm.cardName.$touched\">\n                                                <div ng-message when=\"required\">\n                                                    <span translate>This field is required</span>\n                                                </div>\n                                            </div>\n                                        </md-input-container>\n                                    </div>\n                                    <div layout layout-xs=\"column\" flex>\n                                        <md-input-container flex>\n                                            <label translate>Expiry date (MM)</label>\n                                            <input name=\"cardMonth\" ng-model=\"wizardController.data.billing.cardMonth\" ng-minlength=\"2\" ng-maxlength=\"2\" ng-pattern=\"/^(0?[1-9]|1[012])$/\" required>\n                                            <div ng-messages=\"billingForm.cardMonth.$error\" md-auto-hide=\"false\" ng-show=\"billingForm.cardMonth.$touched\">\n                                                <div ng-message when=\"required\">\n                                                    <span translate>This field is required</span>\n                                                </div>\n                                                <div ng-message when=\"maxlength\">\n                                                    <span translate>Month must be in the format MM</span>\n                                                </div>\n                                                <div ng-message when=\"minlength\">\n                                                    <span translate>Month must be in the format MM</span>\n                                                </div>\n                                                <div ng-message when=\"pattern\">\n                                                    <span translate>Month must be in the format MM</span>\n                                                </div>\n                                            </div>\n                                        </md-input-container>\n                                        <md-input-container flex>\n                                            <label translate>Expiry date (YYYY)</label>\n                                            <input name=\"cardYear\" ng-model=\"wizardController.data.billing.cardYear\" ng-minlength=\"4\" ng-maxlength=\"4\" ng-pattern=\"/^[0-9]+$/\" required>\n                                            <div ng-messages=\"billingForm.cardYear.$error\" md-auto-hide=\"false\" ng-show=\"billingForm.cardYear.$touched\">\n                                                <div ng-message when=\"required\">\n                                                    <span translate>This field is required</span>\n                                                </div>\n                                                <div ng-message when=\"maxlength\">\n                                                    <span translate>Year must be in the format YYYY</span>\n                                                </div>\n                                                <div ng-message when=\"minlength\">\n                                                    <span translate>Year must be in the format YYYY</span>\n                                                </div>\n                                                <div ng-message when=\"pattern\">\n                                                    <span translate>Year must be in the format YYYY</span>\n                                                </div>\n                                            </div>\n                                        </md-input-container>\n                                    </div>\n                                </form>\n                            </md-content>\n                        </md-tab-body>\n                    </md-tab>\n                    <md-tab id=\"confirm\" ng-disabled=\"billingForm.$invalid\">\n                        <md-tab-label>\n                            <span class=\"oxy-step-label\">4</span>\n                            <span translate>Confirmation</span>\n                        </md-tab-label>\n                        <md-tab-body>\n                            <md-content class=\"md-padding\">\n                                <div class=\"padding-40\" flex layout=\"column\" layout-align=\"center center\">\n                                    <md-icon class=\"big-icon\" md-font-icon=\"zmdi zmdi-cake\"></md-icon>\n                                    <h2 class=\"md-display-2\" translate>Congratulations - we will be in touch</h2>\n                                </div>\n                            </md-content>\n                        </md-tab-body>\n                    </md-tab>\n                </md-tabs>\n            </md-card-content>\n            <md-card-actions layout=\"row\" layout-align=\"end center\">\n                <md-button class=\"md-primary md-raised\" ng-click=\"triWizard.prevStep()\" ng-hide=\"triWizard.currentStep > 2\" ng-disabled=\"triWizard.prevStepDisabled()\" translate=\"Previous\"></md-button>\n                <md-button class=\"md-primary md-raised\" ng-click=\"triWizard.nextStep()\" ng-hide=\"triWizard.progress == 100 && triWizard.currentStep > 1\" ng-disabled=\"triWizard.nextStepDisabled()\" translate=\"Next\"></md-button>\n                <md-button class=\"md-accent md-raised\" ng-click=\"triWizard.currentStep = 3\" ng-show=\"triWizard.progress == 100 && triWizard.currentStep < 3\" translate=\"Send\"></md-button>\n            </md-card-actions>\n        </div>\n    </md-card>\n</div>\n");
$templateCache.put("app/examples/github/github.tmpl.html","<div layout=\"column\" layout-align=\"center center\">\n    <h1 class=\"font-weight-100 font-size-8 margin-top-40 text-light\" translate>Join the team</h1>\n    <div layout=\"row\" layout-align=\"center center\">\n        <p flex=\"70\"  flex-xs=\"90\" class=\"md-headline font-weight-300 text-center text-light\" translate>Anyone who buys triangular can now join the team and see changes as they happen, submit pull requests, create issues and get involved!</p>\n    </div>\n\n    <div flex layout=\"row\" layout-align=\"center center\" layout-fill>\n\n        <md-card class=\"margin-top-40 margin-bottom-200\" flex=\"70\" flex-xs=\"90\">\n            <md-toolbar>\n                <div class=\"md-toolbar-tools\">\n                    <h2 translate>Fill in the form below to join</h2>\n                </div>\n            </md-toolbar>\n            <md-card-content>\n                <form name=\"githubForm\">\n                    <md-input-container class=\"md-block\">\n                        <label translate>Triangular Purchase Code</label>\n                        <input name=\"purchaseCode\" ng-model=\"vm.data.purchaseCode\" required>\n                        <div ng-messages=\"githubForm.purchaseCode.$error\">\n                            <div ng-message when=\"required\"><span translate>Enter a triangular Purchase Code</span></div>\n                        </div>\n                    </md-input-container>\n                    <md-autocomplete\n                        md-input-name=\"githubUser\"\n                        md-floating-label=\"{{\'GitHub Username\' | triTranslate}}\"\n                        md-selected-item=\"vm.data.githubUser\"\n                        md-search-text=\"vm.searchText\"\n                        md-items=\"user in vm.userSearch(vm.searchText)\"\n                        md-item-text=\"user.login\"\n                        md-min-length=\"0\"\n                        md-delay=\"400\"\n                        md-autoselect\n                        md-select-on-match\n                        placeholder=\"Please enter your GitHub username\"\n                        md-menu-class=\"autocomplete-custom-template\"\n                        required>\n                        <md-item-template>\n                            <div class=\"github-user-dropdown\" layout=\"row\" layout-align=\"start center\">\n                                <img class=\"github-user-avatar\" ng-src=\"{{user.avatar_url}}\" alt=\"{{user.login}}\">\n                                <span flex>{{user.login}}</span>\n                            </div>\n                        </md-item-template>\n                        <div ng-messages=\"githubForm.githubUser.$error\">\n                            <div ng-message when=\"required\"><span translate>Enter a GitHub Username</span></div>\n                        </div>\n                    </md-autocomplete>\n                </form>\n\n                <div class=\"margin-top-40\" layout=\"row\" layout-align=\"end center\">\n                    <md-button class=\"md-primary\" ng-disabled=\"githubForm.$invalid\" ng-click=\"vm.register()\" translate=\"Give me access to the repository\" aria-label=\"{{\'Give me access to the repository\' | triTranslate}}\"></md-button>\n                </div>\n\n            </md-card-content>\n        </md-card>\n    </div>\n</div>\n");
$templateCache.put("app/examples/layouts/composer.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-heading\">Layout Composer</h2>\n    <p class=\"md-subhead\">Use this page to try out the many different page layouts at your disposal when using triangular!</p>\n    <div layout=\"row\" layout-align=\"center center\">\n        <md-card flex>\n            <div layout=\"column\" layout-fill>\n                <md-toolbar>\n                    <div class=\"md-toolbar-tools\">\n                        <h2>Create a page layout</h2>\n                    </div>\n                </md-toolbar>\n            </div>\n            <md-card-content>\n                <div layout=\"row\" layout-align=\"space-around center\">\n                    <label>Toolbar Size</label>\n                    <md-select ng-model=\"vm.layout.toolbarSize\" ng-change=\"vm.updateOption(\'toolbarSize\')\" placeholder=\"Select a size\">\n                        <md-option ng-value=\"value\" ng-repeat=\"(value, label) in vm.options.toolbarSizes\" translate>{{label}}</md-option>\n                    </md-select>\n                </div>\n                <div layout=\"row\" layout-align=\"space-around center\">\n                    <label>Toolbar Background</label>\n                    <md-select ng-model=\"vm.layout.toolbarClass\" ng-change=\"vm.updateOption(\'toolbarClass\')\" placeholder=\"Select a background\">\n                        <md-option ng-value=\"value\" ng-repeat=\"(value, label) in vm.options.toolbarBackgrounds\" translate>{{label}}</md-option>\n                    </md-select>\n                </div>\n                <div layout=\"row\" layout-align=\"space-around center\">\n                    <label>Toolbar Shrink</label>\n                    <md-switch ng-model=\"vm.layout.toolbarShrink\" ng-change=\"vm.updateOption(\'toolbarShrink\')\"></md-switch>\n                </div>\n                <div layout=\"row\" layout-align=\"space-around center\">\n                    <label>Content Background</label>\n                    <md-select ng-model=\"vm.layout.contentClass\" ng-change=\"vm.updateOption(\'contentClass\')\" placeholder=\"Select a background\">\n                        <md-option ng-value=\"value\" ng-repeat=\"(value, label) in vm.options.toolbarBackgrounds\" translate>{{label}}</md-option>\n                    </md-select>\n                </div>\n                <div layout=\"row\" layout-align=\"space-around center\">\n                    <label>Side Menu Size</label>\n                    <md-select ng-model=\"vm.layout.sideMenuSize\" ng-change=\"vm.updateOption(\'sideMenuSize\')\" placeholder=\"Select a size\">\n                        <md-option ng-value=\"value\" ng-repeat=\"(value, label) in vm.options.sideMenuSizes\" translate>{{label}}</md-option>\n                    </md-select>\n                </div>\n                <div layout=\"row\" layout-align=\"space-around center\">\n                    <label>Show Footer</label>\n                    <md-switch ng-model=\"vm.layout.footer\" ng-change=\"vm.updateOption(\'footer\')\"></md-switch>\n                </div>\n            </md-card-content>\n        </md-card>\n    </div>\n    <div layout=\"row\" layout-align=\"center start\">\n        <md-card flex>\n            <md-toolbar>\n                <div class=\"md-toolbar-tools\">\n                    <h2>Apply to all pages</h2>\n                </div>\n            </md-toolbar>\n            <md-card-content>\n                <p>Change your <code>config.triangular.layout.js</code> file to contain the following to set your whole site to use this layout.</p>\n                <div hljs source=\"vm.allPagesCode\" hljs-language=\"javascript\"></div>\n            </md-card-content>\n        </md-card>\n    </div>\n    <div layout=\"row\" layout-align=\"center start\">\n        <md-card flex>\n            <md-toolbar>\n                <div class=\"md-toolbar-tools\">\n                    <h2>Apply to one page</h2>\n                </div>\n            </md-toolbar>\n            <md-card-content>\n                <p>Use a state like this to use this layout on a single page.</p>\n                <div hljs source=\"vm.onePageCode\" hljs-language=\"javascript\"></div>\n            </md-card-content>\n        </md-card>\n    </div>\n</div>");
$templateCache.put("app/examples/layouts/no-scroll-page.tmpl.html","<div flex layout=\"column\">\n    <div flex layout=\"row\" layout-xs=\"column\">\n        <div class=\"md-padding\" flex palette-background=\"green:500\">\n            <p>Here is an example of a non scrolling page.</p>\n        </div>\n        <div class=\"md-padding\" flex palette-background=\"red:500\">\n            <p>This allows you to use the flex box model to create full height layouts.</p>\n        </div>\n    </div>\n    <div flex layout=\"row\" layout-xs=\"column\">\n        <div class=\"md-padding\" flex palette-background=\"blue:500\">\n            <p>Like this one.</p>\n        </div>\n        <div class=\"md-padding\" flex palette-background=\"cyan:500\">\n            <p>Where the page is split into 4 panels.</p>\n        </div>\n    </div>\n</div>\n");
$templateCache.put("app/examples/layouts/standard-page.tmpl.html","<div class=\"md-padding\">\n    <h2 class=\"md-display-1\">Standard Page Example</h2>\n\n    <p>Here is how to make a simple page in triangular.</p>\n\n    <h3 class=\"md-subheading\">Create a ui state</h3>\n\n    <p>First of all in your module config create a state and url for the page to load on.</p>\n\n    <p>Make sure you add the <code>triangular.</code> to the beginning of your state.  This will make ui router add the triangular toolbar, sidebar, etc.</p>\n\n    <div class=\"md-whiteframe-4dp\" layout=\"column\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                my-module.config.js\n            </div>\n        </md-toolbar>\n        <div hljs hljs-language=\"js\">\n    (function() {\n        \'use strict\';\n\n        angular\n            .module(\'app.my-module\')\n            .config(moduleConfig);\n\n        /* @ngInject */\n        function moduleConfig($stateProvider) {\n            $stateProvider\n            .state(\'triangular.my-page\',  {\n                url: \'/my-page\',\n                templateUrl: \'app/my-module/my-page.tmpl.html\'\n            })\n        });\n    })();\n        </div>\n    </div>\n\n    <p>Now when you goto <code>/my-page</code> in your browser you will see the contents of <code>my-page.tmpl.html</code> inside the triangular app layout.</p>\n</div>\n");
$templateCache.put("app/examples/maps/maps-demo.tmpl.html","<md-content class=\"padded-content-page\">\n    <p class=\"md-subhead\">Triangular uses the Angular Google Maps Directive Module to bring you all the map types available from Google Maps.</p>\n\n    <p class=\"md-subhead\">Angular Google Maps Directive Module is a set of directives written in CoffeeScript and javascript. It is based on the Google Maps javascript API version 3. There are directives for most of the widely-used Google Maps objects, including markers, windows, lines and shapes.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Map with marker</h2>\n            </div>\n        </md-toolbar>\n        <md-tabs class=\"example-tabs example-tabs-nopadding\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <md-content>\n                    <md-card>\n                        <md-card-content class=\"maps-example\" ng-controller=\"MapLabelDemoController as vm\" ng-include=\"\'app/examples/maps/examples/map-label-demo.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </md-content>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <md-content>\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/maps/examples/map-label-demo.tmpl.html\'\"></div>\n                </md-content>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <md-content>\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/maps/examples/map-label-demo.controller.js\'\"></div>\n                </md-content>\n            </md-tab>\n        </md-tabs>\n    </div>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Terrain style map</h2>\n            </div>\n        </md-toolbar>\n        <md-tabs class=\"example-tabs example-tabs-nopadding\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <md-content>\n                    <md-card>\n                        <md-card-content class=\"maps-example\" ng-controller=\"MapTerrainDemoController as vm\" ng-include=\"\'app/examples/maps/examples/map-terrain-demo.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </md-content>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <md-content>\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/maps/examples/map-terrain-demo.tmpl.html\'\"></div>\n                </md-content>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <md-content>\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/maps/examples/map-terrain-demo.controller.js\'\"></div>\n                </md-content>\n            </md-tab>\n        </md-tabs>\n    </div>\n</md-content>");
$templateCache.put("app/examples/maps/maps-fullwidth.tmpl.html","<div id=\"map_canvas\">\n    <ui-gmap-google-map center=\"::vm.map.center\" zoom=\"::vm.map.zoom\">\n        <ui-gmap-marker coords=\"::vm.map.marker.coords\" idkey=\"::vm.map.marker.id\" options=\"::vm.map.marker.options\"></ui-gmap-marker>\n    </ui-gmap-google-map>\n</div>");
$templateCache.put("app/examples/menu/dynamic-page.tmpl.html","<div class=\"padded-content-page\">\n    <h3>Dynamic Menu Test Page</h3>\n\n    <p class=\"md-subhead\">This is a dummy page created using the <code>triMenu</code> service.</p>\n\n    <p>Don\'t like this page?  Well go back to the dynamic menu page and remove it!</p>\n\n    <md-button class=\"md-primary md-raised\" href=\"#/menu/dynamic\">Go back to the menu page</md-button>\n</div>");
$templateCache.put("app/examples/menu/dynamic.tmpl.html","<div class=\"padded-content-page\">\n    <p class=\"md-subhead\">You can use the <code>triMenu</code> service in any controller to add and remove menu items from the side menu</p>\n\n    <p>Here is how you can modify the side menu dynamically</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Add and remove a menu item using triMenu service</h2>\n            </div>\n        </md-toolbar>\n        <md-tabs class=\"example-tabs margin-bottom-40\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"md-tabs-content padding-40\">\n                    <md-card>\n                        <md-card-content layout=\"row\" layout-padding layout-align=\"space-around center\" ng-include=\"\'app/examples/menu/examples/dynamic-menu.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/menu/examples/dynamic-menu.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"js\" hljs-include=\"\'app/examples/menu/examples/dynamic-menu.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n</div>");
$templateCache.put("app/examples/menu/level.tmpl.html","<md-content class=\"padded-content-page\">\n    <h1>{{vm.level}}</h1>\n\n    <p>You are now at level {{vm.level}}</p>\n\n    <p>With triangular you can nest menus forever!</p>\n</md-content>");
$templateCache.put("app/examples/todo/add-todo-dialog.tmpl.html","<md-dialog aria-label=\"Mango (Fruit)\" flex=\"30\" flex-xs=\"100\">\n    <md-toolbar md-theme=\"{{triSkin.elements.content}}\">\n        <div class=\"md-toolbar-tools\">\n            <h2>\n                <span translate>Add Task</span>\n            </h2>\n        </div>\n    </md-toolbar>\n\n    <md-divider></md-divider>\n\n    <md-dialog-content class=\"md-dialog-content\">\n        <form name=\"taskForm\" novalidate layout=\"column\">\n            <md-input-container>\n                <label translate>Task Name</label>\n                <input ng-model=\"vm.item.description\" class=\"dialog-close\" name=\"task\" required/>\n                <div ng-messages=\"taskForm.task.$error\">\n                    <div ng-message when=\"required\">\n                        <span translate>Please enter a task name</span>\n                    </div>\n                </div>\n            </md-input-container>\n            <md-input-container>\n                <label translate>Priority</label>\n                <md-select placeholder=\"{{\'Priority\' | triTranslate}}\" ng-model=\"vm.item.priority\">\n                    <md-option value=\"high\" translate>High</md-option>\n                    <md-option value=\"medium\" translate>Medium</md-option>\n                    <md-option value=\"low\" translate>Low</md-option>\n                </md-select>\n            </md-input-container>\n        </form>\n    </md-dialog-content>\n    <md-dialog-actions layout=\"row\">\n        <span flex></span>\n        <md-button ng-click=\"vm.cancel()\">Cancel</md-button>\n        <md-button ng-click=\"vm.hide()\" class=\"md-primary\" ng-disabled=\"taskForm.$invalid\">Ok</md-button>\n    </md-dialog-actions>\n</md-dialog>");
$templateCache.put("app/examples/todo/fab-button.tmpl.html","<md-button ng-click=\"vm.addTodo($event)\" class=\"md-fab md-accent md-fab-bottom-right\" aria-label=\"{{\'TODO.ADD-TODO\' | triTranslate}}\">\n    <md-icon md-font-icon=\"zmdi zmdi-plus\"></md-icon>\n</md-button>\n");
$templateCache.put("app/examples/todo/todo.tmpl.html","<div class=\"todo-container\">\n    <div layout-fill layout=\"row\" layout-align=\"center center\">\n        <md-card flex=\"70\" flex-xs=\"90\" class=\"margin-top-50 margin-bottom-50 md-whiteframe-z4\">\n            <md-toolbar md-theme=\"{{triSkin.elements.content}}\">\n                <h2 class=\"md-toolbar-tools\" translate>To do list</h2>\n            </md-toolbar>\n            <md-card-content class=\"overflow-auto\">\n                <md-list class=\"margin-bottom-10\">\n                    <md-list-item ng-repeat=\"todo in vm.todos | orderBy:vm.orderTodos\" ng-class=\"{\'md-primary\': todo.priority === \'high\', \'md-accent\': todo.priority === \'medium\', \'md-warn\': todo.priority === \'low\'}\" class=\"slide\" md-swipe-right=\"vm.removeTodo(todo)\" md-no-ink>\n                        <md-checkbox ng-model=\"todo.selected\" ng-change=\"vm.todoSelected()\"></md-checkbox>\n                        <p class=\"no-select\">\n                            {{::todo.description}}\n                        </p>\n                        <p flex class=\"md-secondary\">\n                            {{::todo.priority}}\n                        </p>\n                    </md-list-item>\n                </md-list>\n            </md-card-content>\n        </md-card>\n    </div>\n    <div layout-fill layout=\"row\" layout-align=\"center center\">\n        <md-card flex=\"70\" flex-xs=\"90\" class=\"margin-top-20 margin-bottom-20\">\n            <md-toolbar md-theme=\"{{triSkin.elements.content}}\">\n                <h2 class=\"md-toolbar-tools\" translate>Note</h2>\n            </md-toolbar>\n            <md-card-content>\n                <p translate>Remove items from the list by swiping right</p>\n            </md-card-content>\n        </md-card>\n    </div>\n</div>\n");
$templateCache.put("app/examples/ui/color-dialog.tmpl.html","<md-dialog>\n    <md-toolbar md-theme=\"{{triSkin.elements.toolbar}}\">\n        <h2 class=\"md-toolbar-tools\">\n            {{vm.name}}\n        </h2>\n    </md-toolbar>\n    <md-dialog-content class=\"ui-color-dialog-content\">\n        <md-list>\n            <md-list-item ng-repeat=\"color in vm.palette\" ng-style=\"vm.itemStyle(color.palette)\">\n                <div class=\"md-list-item-text\">\n                    <h3>{{color.code}}</h3>\n                </div>\n            </md-list-item>\n        </md-list>\n    </md-dialog-content>\n</md-dialog>");
$templateCache.put("app/examples/ui/colors.tmpl.html","<div class=\"padded-content-page\">\n    <p class=\"md-subhead\">Color is inspired by bold color statements juxtaposed with muted environments, taking cues from contemporary architecture, road signs, pavement marking tape, and sports courts. Emphasize bold shadows and highlights. Introduce unexpected and vibrant colors</p>\n\n    <p>Triangular comes with the default <a href=\"http://www.google.com/design/spec/style/color.html#color-color-palette\">material design color palettes</a>.  These can be used in multiple combinations to create stunning eye catching themes to color your admin panels.</p>\n\n    <h2>Palette Colors</h2>\n\n    <p>These color palettes comprise of primary and accent colors that can be used for illustration or to develop your brand colors. They’ve been designed to work harmoniously with each other.</p>\n\n    <p>The color palette starts with primary colors and fills in the spectrum to create a complete and usable palette for Android, Web, and iOS. Google suggests using the 500 colors as the primary colors in your app and the other colors as accents colors.</p>\n\n    <p>As well as the pre-defined palettes you can also create your own color palettes.</p>\n\n    <p class=\"md-caption\">Click on a palette below to see it\'s available colors and contrast text colors.</p>\n    <div class=\"example-code md-whiteframe-z1\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Available Color Palettes</h2>\n            </div>\n        </md-toolbar>\n        <md-content class=\"md-padding\">\n            <md-grid-list class=\"ui-color-grid\" md-cols-xs=\"2\" md-cols-md=\"3\" md-cols-gt-md=\"6\" md-row-height-gt-md=\"1:1\" md-row-height=\"2:2\" md-gutter=\"12px\" md-gutter-gt-xs=\"8px\">\n                <md-grid-tile md-rowspan=\"1\" md-colspan=\"1\" ng-repeat=\"(name,palette) in ::vm.palettes\" ng-style=\"::vm.colourRGBA(palette[\'500\'].value)\" ng-click=\"vm.selectPalette($event, name, palette)\">\n                    <md-grid-tile-footer>\n                        <h3>{{::name}}</h3>\n                    </md-grid-tile-footer>\n                </md-grid-tile>\n            </md-grid-list>\n        </md-content>\n    </div>\n</div>");
$templateCache.put("app/examples/ui/fa-icons.tmpl.html","<div class=\"padded-content-page\">\n    <p class=\"md-subhead\">Triangular comes with the <a href=\"http://fortawesome.github.io/Font-Awesome/\">Font Awesome Icon Fontset</a> built in.</p>\n\n    <p>Font Awesome gives you scalable vector icons that can instantly be customized — size, color, drop shadow, and anything that can be done with the power of CSS.</p>\n\n    <p>Click one of the icons below to find out how to add it to triangular!</p>\n\n    <div class=\"example-code md-whiteframe-z1\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Font Awesome Icons</h2>\n            </div>\n        </md-toolbar>\n        <md-content class=\"md-padding\">\n            <div layout=\"column\">\n                <md-input-container>\n                    <label>Search icons</label>\n                    <input type=\"text\" ng-model=\"searchIcon\">\n                </md-input-container>\n\n                <div layout=\"row\" layout-wrap>\n                    <div class=\"ui-icons-box-icon padding-10\" flex=\"10\" layout=\"column\" layout-align=\"space-around center\" ng-repeat=\"icon in vm.icons | filter:{ name: searchIcon }\" ng-click=\"vm.selectIcon($event, icon)\">\n                        <md-icon class=\"font-size-4\" md-font-icon=\"{{::icon.className}}\"></md-icon>\n                        <span class=\"md-caption margin-top-10\">{{::icon.name}}</span>\n                    </div>\n                </div>\n            </div>\n        </md-content>\n    </div>\n</div>");
$templateCache.put("app/examples/ui/material-icons.tmpl.html","<div class=\"padded-content-page\">\n    <p class=\"md-subhead\">Triangular comes with the <a href=\"http://zavoloklom.github.io/material-design-iconic-font/index.html\">Material Design Iconic Font</a> built in.  This font has over 740 material design icons to choose from.</p>\n\n    <p>Click one of the icons below to find out how to add it to triangular!</p>\n\n    <div class=\"example-code md-whiteframe-z1\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Material Icons</h2>\n            </div>\n        </md-toolbar>\n        <md-content class=\"md-padding\">\n            <div layout=\"column\">\n                <div layout=\"row\">\n                    <md-input-container flex>\n                        <label>Search icons</label>\n                        <input type=\"text\" ng-model=\"searchIcon\">\n                    </md-input-container>\n                </div>\n\n                <div layout=\"row\" layout-wrap>\n                    <div class=\"ui-icons-box-icon padding-10\" flex=\"20\" layout=\"column\" layout-align=\"start center\" ng-repeat=\"icon in vm.icons | filter:{ name: searchIcon }\" ng-click=\"vm.selectIcon($event, icon.class)\">\n                        <md-icon class=\"font-size-4\" md-font-icon=\"{{::icon.class}}\"></md-icon>\n                        <span class=\"md-caption margin-top-10\">{{::icon.name}}</span>\n                    </div>\n                </div>\n            </div>\n        </md-content>\n    </div>\n</div>");
$templateCache.put("app/examples/ui/skins.tmpl.html","<div class=\"padded-content-page\">\n    <p>Triangular allows you to change the look of various parts of the template themes.</p>\n\n    <p>We have created several cool looking skins for you to use.  But of course you can always <strong>roll your own!</strong></p>\n\n    <p>Select a theme below and click the try it button to test drive one of the skins!</p>\n\n    <div class=\"example-code md-whiteframe-z1\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Try a skin out!</h2>\n            </div>\n        </md-toolbar>\n        <md-content class=\"md-padding\">\n\n            <div layout=\"row\" layout-align=\"space-around center\">\n                <md-select placeholder=\"{{\'Choose a skin\' | triTranslate}}\" ng-model=\"vm.selectedSkin\" ng-change=\"vm.updatePreview()\">\n                    <md-option ng-repeat=\"skin in ::vm.skins\" ng-value=\"skin\">{{::skin.name}}</md-option>\n                </md-select>\n                <md-button class=\"md-primary md-raised\" ng-click=\"vm.trySkin()\" translate=\"Try It\"></md-button>\n            </div>\n\n            <div class=\"full-image-background mb-bg-08 padding-40\" layout layout-align=\"center center\">\n                <div class=\"ui-skin-preview-window md-whiteframe-z5\" flex=\"70\" layout=\"column\">\n                    <div layout=\"row\">\n                        <div flex=\"30\" ng-style=\"{ \'background-color\' : vm.elementColors.logo }\" class=\"padding-20 ui-skin-preview-window-logo\">\n                            <span translate>Logo</span>\n                        </div>\n                        <div flex=\"70\" ng-style=\"{ \'background-color\' : vm.elementColors.toolbar }\" class=\"padding-20 ui-skin-preview-window-toolbar\">\n                            <span translate>Toolbar</span>\n                        </div>\n                    </div>\n                    <div flex layout=\"row\">\n                        <div flex=\"30\" ng-style=\"{ \'background-color\' : vm.elementColors.sidebar }\" class=\"padding-20 ui-skin-preview-window-sidebar\">\n                            <span translate>Sidebar</span>\n                        </div>\n                        <md-content flex=\"70\" layout=\"column\"  layout-align=\"space-between start\" class=\"padding-20 ui-skin-preview-window-content\" md-content>\n\n                            <div class=\"ui-skin-preview-window-content-line padding-20\"></div>\n                            <div class=\"ui-skin-preview-window-content-line padding-20\"></div>\n                            <div class=\"ui-skin-preview-window-content-line padding-20\"></div>\n                            <div class=\"ui-skin-preview-window-content-line padding-20\"></div>\n                            <div class=\"ui-skin-preview-window-content-line padding-20\"></div>\n                            <div class=\"ui-skin-preview-window-content-fab md-whiteframe-z4\" ng-style=\"{ \'background-color\' : vm.elementColors.content }\"></div>\n\n                        </md-content>\n                    </div>\n                </div>\n            </div>\n        </md-content>\n    </div>\n</div>");
$templateCache.put("app/examples/ui/typography.tmpl.html","<div class=\"padded-content-page\">\n    <p class=\"md-subhead\">The <a href=\"http://www.google.com/design/spec/style/typography.html\">Material Design specification</a> recommends using Roboto for all languages that use Latin, Greek and Cyrillic scripts and Noto for all other languages.</p>\n    <p>Triangular uses Google Fonts so you have the choice of using <a href=\"http://www.google.com/fonts\">any of it\'s 600+ fonts</a> for your admin template.  We have provided a few of the more popular ones for you to try in this demo below.</p>\n\n    <p class=\"caption\">We have provided a font switcher for you to try out some of the fonts available with this template.  Select a font from the select box to check out how the triangular looks.</p>\n\n    <md-whiteframe flex class=\"md-whiteframe-z1 margin-bottom-20\" layout=\"column\" layout-align=\"space-between center\">\n        <md-toolbar>\n            <h2 class=\"md-toolbar-tools\">\n                <span>Why not try a different font?</span>\n            </h2>\n        </md-toolbar>\n        <md-select placeholder=\"Choose a font\" ng-model=\"vm.currentFont\" ng-change=\"vm.changeFont()\">\n            <md-option ng-repeat=\"font in vm.fonts\" ng-value=\"font\">{{font.name}}</md-option>\n        </md-select>\n        <p class=\"ui-typography-try-font\">Try selecting a font above, it will be saved and used from now on as you browse the site.</p>\n    </md-whiteframe>\n\n    <p class=\"caption\">Triangular uses the <a href=\"http://www.google.com/design/spec/style/typography.htm\">Material Design Typography Guidelines</a> for it\'s typography rules.  Too many type sizes and styles at once can wreck any layout. A typographic scale has a limited set of type sizes that work well together along with the layout grid. The basic set of styles are based on a typographic scale of 12, 14, 16, 20 and 34.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Typographic Scale</h2>\n            </div>\n        </md-toolbar>\n        <md-content class=\"md-padding\">\n            <div layout=\"row\" layout-xs=\"column\" layout-align=\"start center\">\n                <p flex=\"30\" flex-xs=\"100\">Display 4</p>\n                <div layout=\"column\">\n                    <span class=\"ui-typography-heading-example md-display-4\">Light 112sp</span>\n                </div>\n            </div>\n            <div layout=\"row\" layout-xs=\"column\" layout-align=\"start center\">\n                <p flex=\"30\" flex-xs=\"100\">Display 3</p>\n                <div layout=\"column\">\n                    <span class=\"ui-typography-heading-example md-display-3\">Regular 56sp</span>\n                </div>\n            </div>\n            <div layout=\"row\" layout-xs=\"column\" layout-align=\"start center\">\n                <p flex=\"30\" flex-xs=\"100\">Display 2</p>\n                <div layout=\"column\">\n                    <span class=\"ui-typography-heading-example md-display-2\">Regular 45sp</span>\n                </div>\n            </div>\n            <div layout=\"row\" layout-xs=\"column\" layout-align=\"start center\">\n                <p flex=\"30\" flex-xs=\"100\">Display 1</p>\n                <div layout=\"column\">\n                    <span class=\"ui-typography-heading-example md-display-1\">Regular 34sp</span>\n                </div>\n            </div>\n            <div layout=\"row\" layout-xs=\"column\" layout-align=\"start center\">\n                <p flex=\"30\" flex-xs=\"100\">Headline</p>\n                <div layout=\"column\">\n                    <span class=\"ui-typography-heading-example md-headline\">Regular 24sp</span>\n                </div>\n            </div>\n            <div layout=\"row\" layout-xs=\"column\" layout-align=\"start center\">\n                <p flex=\"30\" flex-xs=\"100\">Title</p>\n                <div layout=\"column\">\n                    <span class=\"ui-typography-heading-example md-title\">Medium 20sp</span>\n                </div>\n            </div>\n            <div layout=\"row\" layout-xs=\"column\" layout-align=\"start center\">\n                <p flex=\"30\" flex-xs=\"100\">Subhead</p>\n                <div layout=\"column\">\n                    <span class=\"ui-typography-heading-example md-subhead\">Regular 16sp</span>\n                </div>\n            </div>\n            <div layout=\"row\" layout-xs=\"column\" layout-align=\"start center\">\n                <p flex=\"30\" flex-xs=\"100\">Body 2</p>\n                <div layout=\"column\">\n                    <span class=\"ui-typography-heading-example md-body-2\">Medium 14sp</span>\n                </div>\n            </div>\n            <div layout=\"row\" layout-xs=\"column\" layout-align=\"start center\">\n                <p flex=\"30\" flex-xs=\"100\">Body 1</p>\n                <div layout=\"column\">\n                    <span class=\"ui-typography-heading-example md-body-1\">Regular 14sp</span>\n                </div>\n            </div>\n            <div layout=\"row\" layout-xs=\"column\" layout-align=\"start center\">\n                <p flex=\"30\" flex-xs=\"100\">Caption</p>\n                <div layout=\"column\">\n                    <span class=\"ui-typography-heading-example md-caption\">Regular 12sp</span>\n                </div>\n            </div>\n            <div layout=\"row\" layout-xs=\"column\" layout-align=\"start center\">\n                <p flex=\"30\" flex-xs=\"100\">Button</p>\n                <div layout=\"column\">\n                    <span class=\"ui-typography-heading-example md-button\">MEDIUM (ALL CAPS) 14sp</span>\n                </div>\n            </div>\n        </md-content>\n    </div>\n\n    <p class=\"caption\">Triangular uses classes to set the scale of typography inside HTML elements, here is an example of how the code above looks.</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Typographic Scale Usage</h2>\n            </div>\n        </md-toolbar>\n        <md-content class=\"md-padding\">\n            <div hljs>\n            <span class=\"md-display-4\">Light 112sp</span>\n            <span class=\"md-display-3\">Regular 56sp</span>\n            <span class=\"md-display-2\">Regular 45sp</span>\n            <span class=\"md-display-1\">Regular 34sp</span>\n            <span class=\"md-headline\">Regular 24sp</span>\n            <span class=\"md-title\">Medium 20sp</span>\n            <span class=\"md-subhead\">Regular 16sp</span>\n            <span class=\"md-body-2\">Medium 14sp</span>\n            <span class=\"md-body-1\">Regular 14sp</span>\n            <span class=\"md-caption\">Regular 12sp</span>\n            <span class=\"md-button\">MEDIUM (ALL CAPS) 14sp</span></div>\n        </md-content>\n    </div>\n</div>\n\n");
$templateCache.put("app/examples/ui/weather-icons.tmpl.html","<div class=\"padded-content-page\">\n    <p class=\"md-subhead\">Triangular comes with the <a href=\"https://github.com/erikflowers/weather-icons\">Weather Icon Fontset</a> built in.</p>\n\n    <p>189 weather themed icons inspired by Font Awesome.</p>\n\n    <p>Click one of the icons below to find out how to add it to triangular!</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>Weather Icons</h2>\n            </div>\n        </md-toolbar>\n        <md-content class=\"md-padding\">\n            <div layout=\"column\">\n                <md-input-container>\n                    <label>Search icons</label>\n                    <input type=\"text\" ng-model=\"searchIcon\">\n                </md-input-container>\n\n                <div layout=\"row\" layout-wrap>\n                    <div class=\"ui-icons-box-icon padding-10\" flex=\"10\" layout=\"column\" layout-align=\"space-around center\" ng-repeat=\"icon in vm.icons | filter:{ name: searchIcon }\" ng-click=\"vm.selectIcon($event, icon)\">\n                        <md-icon class=\"font-size-4\" md-font-icon=\"{{::icon.className}}\"></md-icon>\n                        <span class=\"md-caption margin-top-10\">{{::icon.name}}</span>\n                    </div>\n                </div>\n            </div>\n        </md-content>\n    </div>\n</div>");
$templateCache.put("app/laboratory/pca/pca.tmpl.html"," <div class=\"padded-content-page\">\n\n	<h2 class=\"md-display-1\">PCA & Documents Management.</h2>\n \n\n</div>\n ");
$templateCache.put("app/laboratory/products/product.dialog.template.html","<md-dialog class=\"laboratory-dashboard\">\n<div class=\"dashboard-social-header padding-70 padding-top-100 overlay-gradient-30\" layout=\"row\" layout-align=\"start center\" style=\"background: url(assets/images/backgrounds/material-backgrounds/mb-bg-11.jpg) no-repeat; background-size: cover;\">\n    <div class=\"margin-right-20\">\n        <img ng-src=\"{{vm.product.ProductInfo.ImageBuffer}}\" id=\"productImage\" class=\"make-round\" width=\"100\"/> \n        <md-icon ng-show= \"vm.product.ProductInfo.ImageBuffer == \'\'\" md-font-icon=\"fa fa-camera-retro font-size-4 opacity-50\"></md-icon> \n    </div>\n    <div class=\"text-light\">\n        <h3 class=\"font-weight-600 margin-bottom-0 text-light\">{{ vm.product.ProductInfo.Reference }}</h3>\n        <p class=\"font-weight-400 margin-top-0 margin-bottom-0\">id: {{ vm.product._id }} </p>\n        <p class=\"font-weight-400 margin-top-0 margin-bottom-0\">Product version:  {{ vm.product.__v }}</p>\n        <p class=\"font-weight-400 margin-top-0 margin-bottom-0\">Created by :  {{ vm.product.ProductInfo.CreatedBy }}</p>\n        <p class=\"font-weight-300 margin-top-0 margin-bottom-0\">Created at :  {{ vm.product.createdAt }}</p>\n    </div>\n</div>\n\n<md-subheader palette-background=\"{{ vm.getProductColor(vm.product) }}\" style=\'zoom: 0.2\'></md-subheader>\n<md-tabs md-dynamic-height md-border-bottom class=\"tabs-tall\">\n    <md-tab>\n        <md-tab-label layout=\"column\">\n            <span>Details</span>\n        </md-tab-label>\n        <md-tab-body>\n                            <md-subheader class=\"md-no-sticky\" translate>Applied Standards</md-subheader>\n                            <md-list-item class=\"md-3-line\" ng-repeat=\"(key, value) in vm.product.ProductJSON.Standards\">\n                                <div class=\"md-list-item-text\">\n\n                                    <md-subheader layout=\"row\" layout-align=\"start end\" palette-background=\"{{ vm.getStandardColor(value) }}\" >   \n                                        <h3 palette-background=\"{{ vm.getStandardColor(value) }}\" >    \n                                            <input type=\"checkbox\" ng-model=\"value.selected\" ng-true-value=\"true\" ng-false-value=\"false\"> \n                                            <md-tooltip ng-show=\"value.Updates.length != 0\"> show/hide updates </md-tooltip> {{key}}\n                                            <p class=\"font-weight-300 margin-top-0 margin-bottom-0\" ng-show=\"value.Updates.length == 0\"> Last Version</p>\n                                        </h3>\n                                        <div ng-show=\"value.selected == true\" layout=\"column\" layout-align=\"start start\"> \n\n                                            <p class=\"font-weight-300 margin-top-0 margin-bottom-0\" ng-repeat=\"update in value.Updates\"> \n                                                <img src=\"assets/images/laboratory/standard-avatar.png\" alt=\"product-avatar\" width=\"15\"/>  {{update._id}} : {{update.Name}}\n                                            </p>\n                                        </div>\n                                    </md-subheader>\n                                           <md-list>\n\n                                              <tri-table ng-show=\"value.selected == true\" class=\"elements-image-table-example\" columns=\"::vm.columns\" contents=\"::value.Designations\" page-size=\"200\"></tri-table>\n\n                                              <md-divider ></md-divider>\n                                          </md-list>\n                                </div>\n                            </md-list-item>\n                            <md-divider ></md-divider>\n                        </md-list>\n\n        </md-tab-body>\n    </md-tab>\n    <md-tab>\n        <md-tab-label layout=\"column\">\n            <span>History</span>\n            <span class=\"display-block\">1</span>\n        </md-tab-label>\n        <md-tab-body>\n            \n        <div class=\"overlay-5 padded-content-page\">\n            <div class=\"timeline\" layout=\"row\" ng-repeat=\"event in ::vm.events\" ng-attr-layout-align=\"{{$odd? \'end end\':\'start start\'}}\">\n                <div layout=\"row\" flex=\"50\" flex-xs=\"100\" ng-attr-layout-align=\"{{$odd? \'end\':\'start\'}} center\">\n                    <div class=\"timeline-point md-whiteframe-z1\" theme-background=\"primary\" md-theme=\"{{triSkin.elements.content}}\">\n                        <img ng-src=\"{{::event.image}}\" class=\"timeline-point-avatar\"/>\n                        <span class=\"timeline-point-date\">{{::event.date}}</span>\n                    </div>\n                    <md-divider class=\"timeline-x-axis\" class=\"margin-0\" flex flex-order=\"2\"></md-divider>\n                    <tri-widget class=\"timeline-widget margin-0 flex-70 flex-xs-100 {{::event.classes}}\" title=\"{{::event.title}}\" subtitle=\"{{::event.subtitle}}\" title-position=\"bottom\" ng-attr-flex-order=\"{{$odd? 2:1}}\" palette-background=\"{{::event.palette}}\" >\n                        <div replace-with=\'{{event.content}}\'></div>\n                    </tri-widget>\n                    <md-divider class=\"timeline-y-axis\"></md-divider>\n                </div>\n            </div>\n        </div>\n        \n        </md-tab-body>\n    </md-tab>\n\n    <md-tab>\n        <md-tab-label layout=\"column\">\n            <span>Standards Update</span>\n            <span class=\"display-block\"> {{vm.UpdatesCount}} updates</span>\n        </md-tab-label>\n        <md-tab-body>\n \n         <div class=\"padded-content-page\" ng-show= \"vm.UpdatesCount != 0\">\n            <h2 class=\"md-display-1\">Upgrade Product:</h2>\n                    <md-whiteframe layout=\"column\" layout-align=\"start start\" palette-background=\"{{ vm.getStandardColor(value) }}\" \n                     ng-repeat=\"(key , value) in vm.product.ProductJSON.Standards\" ng-show= \"value.Updates.length != 0\" class=\"md-whiteframe-z1 margin-20\">\n                                             \n                                                                {{key}} \n\n                    <p  class=\"font-weight-300 margin-top-0 margin-bottom-0\"> upgrade to: {{value.Upgradeto}}</p>\n                    <md-select placeholder=\"Upgrade Standard to: \" ng-model=\"value.Upgradeto\">\n                            <md-option ng-repeat=\"update in value.Updates\" value=\"{{update._id}}\">{{update._id}} - {{update.Name}}</md-option> \n                    </md-select>\n\n                     </md-whiteframe>\n\n                    <div layout=\"column\" layout-align=\"center center\">\n                        <md-button class=\"md-primary md-raised\" md-ripple-size=\"full\" aria-label=\"ripple full\" ng-click= \'vm.UpdateProductStd(vm.product)\'> Update </md-button>\n                    </div>\n        </div>\n\n         <div class=\"padded-content-page\" ng-show= \"vm.UpdatesCount == 0\">\n\n            <md-subheader class=\"md-whiteframe-z3 margin-20 text-center\" palette-background=\"light-green:400\" >   \n\n                 <center> <h1 class=\"md-display-1\"> <md-icon md-font-icon=\"fa fa-check-circle\"> {{ vm.product.ProductInfo.Reference }} is up to date.</md-icon> </h1> </center>\n\n           </md-subheader>\n        </div>\n\n         </md-tab-body>\n    </md-tab>\n    <md-tab> \n    </md-tab>\n</md-tabs>\n</md-dialog>\n");
$templateCache.put("app/laboratory/products/products.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\" translate>Products List</h2>\n    <md-input-container>\n        <label translate>Search Product</label>\n              <input type=\"text\" ng-model=\"searchProduct\">\n    </md-input-container>\n        <md-progress-linear ng-show=\"vm.showProgress\" class=\"md-warn margin-bottom-20\" md-mode=\"indeterminate\"></md-progress-linear>\n                    <md-card class=\"animate-wrapper\" layout-align=\"start start\" layout=\"column\" ng-repeat=\"product in vm.products | filter : searchProduct : Reference \" palette-background=\"{{ vm.getProductColor(product) }}\" layout-wrap>\n                        <md-card-title  ng-click=\"vm.GenerateDashboard(product)\">\n                             <md-card-title-media >\n                                <div class=\"md-media-md card-media\">\n                                   <img ng-src=\"{{product.ProductInfo.ImageBuffer}}\" id=\"productImage\" class=\"make-round\" width=\"100\"/> \n                                    <md-icon ng-show= \"product.ProductInfo.ImageBuffer == \'\'\" md-font-icon=\"fa fa-camera-retro font-size-4 opacity-50\"></md-icon>  \n                                </div>\n                            </md-card-title-media>\n                            <md-card-title-text  class=\"padded-content-page\" layout=\"row\" layout-wrap> \n                                <md-button class=\"md-headline\">{{product.ProductInfo.Reference}}</md-button> \n                                <md-button class=\"md-subhead\" >Version : {{product.ProductInfo.Version}}</md-button> \n                                <md-button class=\"md-subhead\" >Id: {{product._id}}</md-button> \n                                <md-button class=\"md-subhead\" translate>Update of : {{product.ProductInfo.Id_UpdateOf}}</md-button> \n                                <md-button class=\"md-subhead\" translate>Created By: {{product.ProductInfo.CreatedBy}}</md-button> \n                                <md-button class=\"md-subhead\" translate>Last Modif By : {{product.ProductInfo.LastModifBy}}</md-button>           \n                            </md-card-title-text>\n                        </md-card-title>\n                        <md-grid-tile-footer  layout=\"row\" layout-align=\"end center\">\n                            <md-button  ng-click=\"vm.GenerateDashboard(product)\"><h4 translate> Dashboard </h4></md-button>\n                            <md-button  ng-click=\"vm.selectProduct($event, product)\">    <h4 translate> Details   </h4></md-button>\n                            <md-button  ng-click=\"vm.GenerateQualifSynthesis(product)\">    <h4 translate> Synthesis   </h4></md-button>\n                            <md-button  permission=\"\" permission-only=\"\'viewDeleteProducts\'\" ng-click=\"vm.deleteProduct($event, product)\">    <h4 translate> Delete    </h4></md-button>\n                        </md-grid-tile-footer>\n                    </md-card>\n</div>\n\n\n");
$templateCache.put("app/laboratory/standards/standard.dialog.template.html","<div class=\"laboratory-dashboard\">\n    <div class=\"dashboard-social-header padding-50 padding-top-20 overlay-gradient-30\" layout=\"row\" layout-align=\"start center\" style=\"background: url(assets/images/backgrounds/material-backgrounds/mb-bg-08.jpg) no-repeat; background-size: cover;\">\n        <md-icon md-font-icon=\"fa fa-arrow-circle-left font-size-10 opacity-50\" ng-click=\"vm.backtostandards()\"></md-icon> \n\n        <div class=\"margin-right-20\">\n        <img src=\"assets/images/laboratory/standard-avatar.png\" alt=\"product-avatar\" width=\"100\"/>\n        </div>\n        <div class=\"text-light\">\n            <span ng-if=\"standard.Infos.HasUpdate == 0\" class=\"md-subhead\">Latest version.</span>\n            <h3 class=\"font-weight-600 margin-bottom-0 text-light\">{{ vm.standard.Infos.Name }}</h3>\n            <p class=\"font-weight-400 margin-top-0 margin-bottom-0\">id: {{ vm.standard._id }} </p>\n            <p class=\"font-weight-400 margin-top-0 margin-bottom-0\">Product version:  {{ vm.standard.Infos.Version }}</p>\n            <p class=\"font-weight-300 margin-top-0 margin-bottom-0\">Created at :  {{ vm.standard.createdAt }}</p>\n            <div layout=\"row\" layout-align=\"start center\">\n                Related Products:  \n                 <h4 ng-if=\"vm.rel_products.length == 0\"> # No related Products.</h4>\n                <h4 ng-repeat=\"product in vm.rel_products\" ng-click=\"vm.selectProduct($event, product)\"> \n                    \" #{{product.ProductInfo.Reference}} \" <md-tooltip>id: {{product._id}} </md-tooltip></h4> \n            </div>\n        </div>\n    </div>\n\n<md-subheader palette-background=\"{{ vm.getStandardColor(vm.standard) }}\"  style=\'zoom: 0.2\'></md-subheader>\n\n    <md-tabs md-dynamic-height md-border-bottom class=\"tabs-tall\">\n        <md-tab>\n            <md-tab-label layout=\"column\">\n                <span>History</span>\n                <span class=\"display-block\">{{ vm.standard.Infos.Version }}</span>\n                <span class=\"display-block\"></span>\n            </md-tab-label>\n            <md-tab-body>\n                \n                <div class=\"overlay-5 padded-content-page\" animate-elements>\n                    <div class=\"timeline\" layout=\"row\" ng-repeat=\"event in vm.events\" ng-attr-layout-align=\"{{$odd? \'end end\':\'start start\'}}\">\n                        <div layout=\"row\" flex=\"50\" flex-xs=\"100\" ng-attr-layout-align=\"{{$odd? \'end\':\'start\'}} center\">\n                            <div class=\"timeline-point md-whiteframe-z1\" theme-background=\"primary\" md-theme=\"{{triSkin.elements.content}}\">\n                                <img ng-src=\"{{::event.image}}\" class=\"timeline-point-avatar\"/>\n                                <span class=\"timeline-point-date\">{{::event.date}}</span>\n                            </div>\n                            <md-divider class=\"timeline-x-axis\" class=\"margin-0\" flex flex-order=\"2\"></md-divider>\n                            <tri-widget class=\"timeline-widget margin-0 flex-70 flex-xs-100 {{::event.classes}}\" title=\"{{::event.title}}\" subtitle=\"{{::event.subtitle}}\" title-position=\"bottom\" ng-attr-flex-order=\"{{$odd? 2:1}}\" palette-background=\"{{::event.palette}}\" >\n                                <div replace-with=\'{{event.content}}\'></div>\n                            </tri-widget>\n                            <md-divider class=\"timeline-y-axis\"></md-divider>\n                        </div>\n                    </div>\n                </div>\n\n            </md-tab-body>\n        </md-tab>\n\n        <md-tab>\n            <md-tab-label layout=\"column\">\n                <span>Details</span>\n                <span class=\"display-block\"> {{ vm.standard.Designations.length }} Points</span>\n            </md-tab-label>\n            <md-tab-body>\n\n    		  <md-subheader class=\"md-no-sticky\">Chapters </md-subheader>\n                 <p ng-repeat=\"item in ::vm.standard.Designations\" class=\"font-weight-{{vm.getMargin(item.Chapters)}}0 margin-left-{{vm.getMargin(item.Chapters)}} margin-top-0 margin-bottom-10\">\n                         {{::item.Chapters}} : {{::item.DesignationTitle}}\n                 </p>                \n\n    			<md-divider ></md-divider>\n\n            </md-tab-body>\n        </md-tab>\n        <md-tab>\n            <md-tab-label layout=\"column\">\n                <span>Update</span>\n            </md-tab-label>\n            <md-tab-body >\n\n                <md-subheader class=\"md-whiteframe-z3 margin-20 text-center\" palette-background=\"triCyan:500\" ng-show = \"vm.standard.Infos.HasUpdate == 0\" >   \n\n                 <h2 class=\"center center\">Update the <b> Sdandard: {{ vm.standard.Infos.Name }} </b></h2>\n\n                 <div  permission=\"\" permission-only=\"\'viewUpdateStd\'\" layout=\"row\" layout-align=\"space-around center\">\n                     <input class=\"ng-hide\" id=\"input-file-id\" multiple type=\"file\" onchange=\"angular.element(this).scope().UpdateStandard(this)\" />  \n                     <label for=\"input-file-id\" class=\"md-button md-raised md-primary\">Upload File</label>\n                </div>\n         \n                <div layout=\"row\" layout-align=\"space-around center\">\n                    <md-progress-circular class=\"md-accent\" ng-show =\"vm.status != \'idle\'\" md-mode=\"indeterminate\"></md-progress-circular>\n                </div>\n\n                <h1 class=\"ui-typography-heading-example md-body-2\"> <md-icon md-font-icon=\"zmdi zmdi-alert-circle-o\"></md-icon> Add only <b>Microsoft® Exel </b> Files.</h1>\n\n                </md-subheader>\n\n                <md-subheader class=\"md-whiteframe-z3 margin-20 text-center\" palette-background=\"deep-orange:400\" ng-show= \" vm.standard.Infos.HasUpdate != 0 \">   \n                 <h2 class=\"center center\"> <md-icon md-font-icon=\"fa fa-warning\"> {{ vm.standard.Infos.Name }} is allready updated.</b></md-icon></h2>\n                        <p class=\"font-weight-300 margin-top-0 margin-bottom-0\"> Update :  {{ vm.standard.Infos.HasUpdate }}</p>\n                </md-subheader>\n\n            </md-tab-body>\n         \n        </md-tab>\n\n        <md-tab>\n        </md-tab>\n\n    </md-tabs>\n</div>\n \n");
$templateCache.put("app/laboratory/standards/standards.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">Standards List</h2>\n\n    <div layout=\"column\" layout-align=\"center center\">\n        <md-button permission=\"\" permission-only=\"\'viewDeleteStandards\'\" class=\"md-primary md-raised\" md-ripple-size=\"full\" aria-label=\"ripple full\" ng-click= \'vm.deleteAllStandards()\' >delete all</md-button>\n    </div>\n    <md-input-container>\n        <label>Search Standard</label>\n              <input type=\"text\" ng-model=\"searchStandards\">\n    </md-input-container>\n            <div layout=\"column\">\n                <div layout=\"column\" layout-wrap>\n                    <md-card layout-align=\"start start\" layout=\"column\" layout-align=\"space-around center\" ng-repeat=\"standard in vm.standards | filter : searchStandards : Name \" palette-background=\"{{ vm.getStandardColor(standard) }}\" >\n                        <md-card-title  ng-click=\"vm.selectStandard($event, standard)\">\n                            <md-card-title-media >\n                                <div class=\"md-media-md card-media\">\n                                    <img src=\"assets/images/laboratory/standard-avatar.png\" alt=\"Standard Image\" layout-align=\"right\">\n                                </div>\n                            </md-card-title-media>\n                            <md-card-title-text >\n                                <span class=\"md-headline\">{{standard.Infos.Name}}</span>\n                                <span class=\"md-subhead\">Version: {{standard.Infos.Version}}</span>\n                                <span ng-if=\"standard.Infos.HasUpdate != 0\" class=\"md-subhead\">Has an Update: {{standard.Infos.HasUpdate}}</span>\n                                <span ng-if=\"standard.Infos.HasUpdate == 0\" class=\"md-subhead\">Latest version.</span>\n                            </md-card-title-text> \n                        </md-card-title>\n                        <md-card-actions layout=\"row\" layout-align=\"end center\">\n                            <md-button  ng-click=\"vm.selectStandard($event, standard)\">Details</md-button>\n                            <md-button  permission=\"\" permission-only=\"\'viewDeleteStandards\'\" ng-click=\"vm.deleteStandard($event, standard)\">Delete</md-button>\n                        </md-card-actions>\n                    </md-card>\n                </div>\n            </div>\n</div>\n\n");
$templateCache.put("app/layouts/footer/footer.tmpl.html","<div flex=\"noshrink\" layout=\"column\" layout-align=\"end none\">\n    <md-toolbar ng-controller=\"AppFooterController as footer\" md-theme=\"{{triSkin.elements.toolbar}}\">\n        <div class=\"md-toolbar-tools md-body-1\" layout=\"row\" layout-align=\"space-between center\">\n            <h2>{{footer.settings.name}}</h2>\n            <h2 hide-xs ng-bind-html=\"footer.settings.copyright\"></h2>\n            <h2>v{{footer.settings.version}}</h2>\n        </div>\n    </md-toolbar>\n</div>\n");
$templateCache.put("app/layouts/leftsidenav/leftsidenav.tmpl.html","<md-toolbar class=\"sidebar-left-toolbar\" md-theme=\"{{::triSkin.elements.logo}}\">\n    <div class=\"md-toolbar-tools\" layout=\"row\" layout-align=\"start center\">\n\n        <div class=\"sidebar-left-logo\">\n            <img ng-src=\"{{::vm.sidebarInfo.appLogo}}\" alt=\"{{::vm.sidebarInfo.appName}}\">\n        </div>\n\n        <h2 flex class=\"sidebar-left-title\">{{::vm.sidebarInfo.appName}}</h2>\n\n        <md-button class=\"md-icon-button sidebar-left-icon\" ng-click=\"vm.toggleIconMenu()\" aria-label=\"Open side menu\">\n            <md-icon md-font-icon ng-class=\"{ \'zmdi zmdi-chevron-right\' : vm.layout.sideMenuSize == \'icon\', \'zmdi zmdi-chevron-left\' : vm.layout.sideMenuSize == \'full\' }\"></md-icon>\n        </md-button>\n\n    </div>\n</md-toolbar>\n\n<tri-menu md-theme=\"{{triSkin.elements.sidebar}}\" flex layout=\"column\"></tri-menu>\n");
$templateCache.put("app/layouts/loader/loader.tmpl.html","<div class=\"app-loader\" flex layout=\"column\" layout-align=\"center center\">\n    <img src=\"{{loader.triSettings.logo}}\" alt=\"\">\n    <md-progress-linear class=\"padding-bottom-10\" md-mode=\"indeterminate\"></md-progress-linear>\n    <h2 class=\"padding-bottom-100\">{{loader.triSettings.name}}</h2>\n</div>\n");
$templateCache.put("app/layouts/rightsidenav/rightsidenav.tmpl.html","<md-content flex layout class=\"admin-notifications\">\n    <md-tabs flex md-stretch-tabs=\"always\" md-selected=\"vm.currentTab\">\n        <md-tab>\n            <md-tab-label>\n                <md-icon md-font-icon=\"fa fa-bell-o\">Notifications</md-icon>\n            </md-tab-label>\n            <md-tab-body>\n                <md-content>\n\n                     <md-list>\n                        <div ng-repeat=\"group in vm.notificationGroups\">\n                            <md-subheader class=\"md-primary\" palette-background=\"amber:400\">{{group.name}}</md-subheader>\n                            <md-list-item ng-repeat=\"notification in group.notifications | reverse\" layout=\"row\" layout-align=\"space-between center\">\n                                <md-icon md-font-icon=\"{{notification.icon}}\" ng-style=\"{ color: notification.iconColor }\"></md-icon>\n                                <p>{{notification.title}}</p> <md-tooltip>{{notification.title}} - by: {{notification.User}} </md-tooltip>\n                                <span class=\"md-caption\" am-time-ago=\"notification.date\"></span>\n                            </md-list-item>\n                        </div>\n                    </md-list>\n                </md-content>\n            </md-tab-body>\n        </md-tab>\n \n    </md-tabs>\n</md-content>\n");
$templateCache.put("app/layouts/toolbar/toolbar.tmpl.html","<div class=\"md-toolbar-tools\">\n    <md-button class=\"md-icon-button\" ng-if=\"!vm.hideMenuButton()\" ng-click=\"vm.openSideNav(\'left\')\" aria-label=\"side navigation\">\n        <md-icon md-font-icon=\"zmdi zmdi-menu\"></md-icon>\n    </md-button>\n\n    <h2 hide-xs flex>\n        <span ng-repeat=\"crumb in vm.breadcrumbs.crumbs\">\n            <span translate>{{crumb.name}}</span>\n            <md-icon md-font-icon=\"zmdi zmdi-chevron-right\" ng-if=\"!$last\"></md-icon>\n        </span>\n    </h2>\n\n    <md-button class=\"md-icon-button toolbar-button\" ng-click=\"vm.toggleFullScreen()\" aria-label=\"toggle fullscreen\">\n        <md-icon md-font-icon ng-class=\"vm.fullScreenIcon\"></md-icon>\n    </md-button>\n\n    <md-menu ng-show=\"vm.languages.length > 0\">\n        <md-button class=\"md-icon-button\" aria-label=\"language\" ng-click=\"$mdOpenMenu()\" aria-label=\"change language\">\n            <md-icon md-font-icon=\"zmdi zmdi-globe-alt\"></md-icon>\n        </md-button>\n        <md-menu-content width=\"3\">\n            <md-menu-item ng-repeat=\"language in ::vm.languages\">\n                <md-button ng-click=\"vm.switchLanguage(language.key)\" translate=\"{{::language.name}}\" aria-label=\"{{::language.name}}\"></md-button>\n            </md-menu-item>\n        </md-menu-content>\n    </md-menu>\n \n    <md-button class=\"md-icon-button toolbar-button\" ng-click=\"vm.toggleNotificationsTab(1)\">\n        <md-icon md-font-icon=\"fa fa-bell-o\"></md-icon>\n        <span ng-show = \'vm.notificationsCount != 0\' class=\"toolbar-button-badge\" theme-background=\"accent\">{{vm.notificationsCount}}</span>\n    </md-button>\n\n    <md-menu>\n        <md-button aria-label=\"Open user menu\" ng-click=\"$mdOpenMenu()\" aria-label=\"side navigation\">\n            <img class=\"toolbar-user-avatar\" ng-src=\"{{vm.currentUser.avatar}}\">\n            {{vm.currentUser.displayName}}\n        </md-button>\n        <md-menu-content width=\"4\">\n            <md-menu-item>\n                <md-button ng-click=\"vm.toggleNotificationsTab(2)\" aria-label=\"side navigation\">\n                    <md-icon md-font-icon=\"zmdi zmdi-settings\"></md-icon>\n                    <span translate=\"Settings\"></span>\n                </md-button>\n            </md-menu-item>\n            <md-menu-item>\n                <md-button href=\"#/profile\" aria-label=\"side navigation\">\n                    <md-icon md-font-icon=\"zmdi zmdi-account\"></md-icon>\n                    <span translate=\"Profile\"></span>\n                </md-button>\n            </md-menu-item>\n            <md-menu-divider></md-menu-divider>\n            <md-menu-item>\n                <md-button ng-click=\"vm.logout(2)\" aria-label=\"side navigation\">\n                    <md-icon md-font-icon=\"zmdi zmdi-settings\"></md-icon>\n                    <span translate=\"logout\"></span>\n                </md-button>\n            </md-menu-item>\n        </md-menu-content>\n    </md-menu>\n</div>\n");
$templateCache.put("app/permission/pages/permission-define.tmpl.html","<div class=\"md-padding\">\n    <h2 class=\"md-display-1\">Defining Roles & Permissions</h2>\n\n    <p>To get started we recommend looking at the example app and how the roles and permissions are defined there.</p>\n\n    <p>Take a look at the file <code>permission/permission.run.js</code> to see how the apps roles & permissions.</p>\n    <p>For example</p>\n\n    <div class=\"md-whiteframe-1dp\" layout=\"column\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>permission/permission.run.js</h2>\n            </div>\n        </md-toolbar>\n        <div flex hljs hljs-language=\"js\">\n    // create permissions and add check function verify all permissions\n    var permissions = [\'viewEmail\', \'viewGitHub\', \'viewCalendar\', \'viewLayouts\', \'viewTodo\', \'viewElements\', \'viewAuthentication\', \'viewCharts\', \'viewMaps\'];\n    PermissionStore.defineManyPermissions(permissions, function (permissionName) {\n        return UserService.hasPermission(permissionName);\n    });\n\n    // create roles for app\n    RoleStore.defineManyRoles({\n        \'SUPERADMIN\': [\'viewEmail\', \'viewGitHub\', \'viewCalendar\', \'viewLayouts\', \'viewTodo\', \'viewElements\', \'viewAuthentication\', \'viewCharts\', \'viewMaps\'],\n        \'ADMIN\': [\'viewLayouts\', \'viewTodo\', \'viewElements\', \'viewAuthentication\', \'viewCharts\', \'viewMaps\'],\n        \'USER\': [\'viewAuthentication\', \'viewCharts\', \'viewMaps\'],\n        \'ANONYMOUS\': []\n    });\n        </div>\n    </div>\n\n    <p>First of all we create a list of permissions then tell permission store about them and assign a function to verify them.  We use a service called UserService to check if the current user has a permission.</p>\n\n    <p>Next we define the roles SUPERADMIN, ADMIN, USER, and ANONYMOUS.  These roles each have their own permissions except for ANONYMOUS which doesn\'t have any permissions set.</p>\n\n    <p>Thats all you need to do to create Roles and Permissions which you can now use to hide / show menu items and page elements.</p>\n\n    <p>For more in depth information see the <a href=\"https://github.com/Narzerus/angular-permission\">Angular Permissions Module</a></p>\n</div>\n");
$templateCache.put("app/permission/pages/permission-routes.tmpl.html","<div class=\"md-padding\">\n    <h2 class=\"md-display-1\">Route Permissions</h2>\n\n    <h3 class=\"md-subheading\">Blocking Routes</h3>\n    <p>In order to block routes from being accessed when a usre doesn\'t have permission just add the following code to your <code>$stateProvider</code> declaration inside your config file.</p>\n\n    <p>For example</p>\n\n    <div class=\"md-whiteframe-1dp\" layout=\"column\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>my-module.config.js</h2>\n            </div>\n        </md-toolbar>\n        <div flex hljs hljs-language=\"js\">\n    $stateProvider\n    .state(\'triangular.my-page\', {\n        url: \'/mypage\',\n        templateUrl: \'app/my-module/my-page.tmpl.html\',\n        data: {\n            permissions: {\n                only: [\'viewMyPage\']\n            }\n        }\n    });\n        </div>\n    </div>\n\n    <p>So now if any user that doesn\'t have the permission <code>viewMyPage</code> tries to access <code>/mypage</code> in the browser they will be redirected to the <a href=\"#/401\">401 Page</a></p>\n\n    <h3 class=\"md-subheading\">Hiding menus</h3>\n    <p>As well as blocking the route you will also want to hide the menu item.  This is also easy, just add a permission to the menu item when you add it in your config file.</p>\n\n    <div class=\"md-whiteframe-1dp\" layout=\"column\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>my-module.config.js</h2>\n            </div>\n        </md-toolbar>\n        <div flex hljs hljs-language=\"js\">\n    triMenuProvider.addMenu({\n        name: \'My Page\',\n        type: \'link\',\n        permission: \'viewMyPage\',\n    });\n        </div>\n    </div>\n\n    <p>Now unless the user has the <code>viewMyPage</code> permission they will not see the menu item in the left sidebar.</p>\n</div>\n");
$templateCache.put("app/permission/pages/permission-views.tmpl.html","<div class=\"md-padding\">\n    <h2 class=\"md-display-1\">View Permissions</h2>\n\n    <h3 class=\"md-subheading\">Hiding view elements</h3>\n\n    <p>You can also use angular permission to hide elements on the page.</p>\n\n    <p>For example to a button on your app unless the user has a <code>canDelete</code> permission you would do the following.</p>\n\n    <div class=\"md-whiteframe-1dp\" layout=\"column\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h2>my-page.tmpl.html</h2>\n            </div>\n        </md-toolbar>\n        <div flex hljs hljs-language=\"html\">\n            <md-button permission permission-only=\"\'canDelete\'\">Delete</md-button>\n        </div>\n    </div>\n\n    <p>So now if any user that doesn\'t have the permission <code>canDelete</code> they wont see this button.</p>\n</div>\n");
$templateCache.put("app/permission/pages/permission.tmpl.html","<div class=\"md-padding\">\n    <h2 class=\"md-display-1\">Permissions</h2>\n\n    <p>Many people have requested a way to restrict access to pages inside triangular.</p>\n\n    <p>So for that reason we have added an optional module that works with the <a href=\"https://github.com/Narzerus/angular-permission\">Angular Permission Module</a></p>\n\n    <p>To show how this works we have created some mock users, roles and permissions for triangular.</p>\n\n    <p>This will show you how they can be used to restrict user access to routes / pages and HTML elements in your app.</p>\n\n    <p>In the demo app we have 4 users with different roles assigned to each.  Each role has a set of permissions that we will use to show and hide menu items on the left as well as disable the routes to those pages.</p>\n\n    <div layout=\"row\" layout-xs=\"column\" layout-margin layout-align=\"space-between stretch\">\n        <div class=\"md-whiteframe-1dp\" flex layout=\"column\">\n            <md-toolbar>\n                <div class=\"md-toolbar-tools\">\n                    <span translate>Users</span>\n                </div>\n            </md-toolbar>\n            <md-content>\n                <md-list flex>\n                    <md-list-item class=\"md-primary\" ng-repeat=\"user in vm.userList\" ng-click=\"vm.selectUser(user)\">\n                        <img ng-src=\"{{user.avatar}}\" class=\"md-avatar\" alt=\"{{user.displayName}}\" />\n                        <p>{{user.displayName}}</p>\n                        <md-icon md-font-icon=\"zmdi zmdi-circle\" ng-show=\"vm.selectedUser == user\"></md-icon>\n                    </md-list-item>\n                </md-list>\n            </md-content>\n        </div>\n        <div class=\"md-whiteframe-1dp\" flex layout=\"column\">\n            <md-toolbar>\n                <div class=\"md-toolbar-tools\">\n                    <span translate>Roles</span>\n                </div>\n            </md-toolbar>\n            <md-content>\n                <md-list flex>\n                    <md-list-item ng-repeat=\"role in vm.roleList\">\n                        <p>{{role.roleName}}</p>\n                    </md-list-item>\n                </md-list>\n            </md-content>\n        </div>\n        <div class=\"md-whiteframe-1dp\" flex layout=\"column\">\n            <md-toolbar>\n                <div class=\"md-toolbar-tools\">\n                    <span translate>Permissions</span>\n                </div>\n            </md-toolbar>\n            <md-content>\n                <md-list flex>\n                    <md-list-item ng-repeat=\"permission in vm.permissionList\">\n                        <p>{{permission}}</p>\n                    </md-list-item>\n                </md-list>\n            </md-content>\n        </div>\n    </div>\n\n    <md-button class=\"md-primary md-raised\" ng-click=\"vm.loginClick()\">Login as {{vm.selectedUser.displayName}}</md-button>\n\n    <p>Go ahead and log in as one of the users to see it\'s effect on the side menu items and routes</p>\n\n    <p>For more details on how to set this up read about permissions for routes and permissions for views.</p>\n</div>\n");
$templateCache.put("app/examples/charts/examples/chartjs-bar.tmpl.html","<canvas class=\"chart-bar\" chart-data=\"vm.data\" chart-labels=\"vm.labels\" chart-legend=\"true\" chart-series=\"vm.series\"></canvas>");
$templateCache.put("app/examples/charts/examples/chartjs-line.tmpl.html","<canvas class=\"chart-line\" chart-data=\"vm.data\" chart-labels=\"vm.labels\" chart-legend=\"true\" chart-series=\"vm.series\" chart-options=\"options\"></canvas>");
$templateCache.put("app/examples/charts/examples/chartjs-pie.tmpl.html","<canvas class=\"chart-pie\" chart-data=\"vm.data\" chart-labels=\"vm.labels\" chart-legend=\"true\" chart-options=\"vm.options\"></canvas>");
$templateCache.put("app/examples/charts/examples/chartjs-ticker.tmpl.html","<canvas class=\"chart-line\" chart-data=\"vm.data\" chart-labels=\"vm.labels\" chart-legend=\"false\" chart-options=\"vm.options\"></canvas>");
$templateCache.put("app/examples/charts/examples/d3-bar.tmpl.html","<nvd3 options=\"vm.ohclBarOptions\" data=\"vm.ohclBarData\" class=\"with-3d-shadow with-transitions\"></nvd3>");
$templateCache.put("app/examples/charts/examples/d3-multiline.tmpl.html","<nvd3 options=\"vm.multiLineChartOptions\" data=\"vm.multiLineChartData\" class=\"with-3d-shadow with-transitions\"></nvd3>");
$templateCache.put("app/examples/charts/examples/d3-scatter.tmpl.html","<nvd3 options=\"vm.scatterChartOptions\" data=\"vm.scatterChartData\" class=\"with-3d-shadow with-transitions\"></nvd3>");
$templateCache.put("app/examples/charts/examples/google-bar.tmpl.html","<div google-chart chart=\"vm.barChart\"></div>\n<div layout=\"row\" layout-align=\"center center\">\n    <p>Show Horizontal / Vertical</p>\n    <md-switch ng-model=\"::vm.barChart.options.bars\" aria-label=\"Horizontal / Vertical Bars\" ng-true-value=\"\'vertical\'\" ng-false-value=\"\'horizontal\'\" class=\"md-warn\">\n</div>");
$templateCache.put("app/examples/charts/examples/google-line.tmpl.html","<div google-chart chart=\"::vm.chartData\"></div>\n");
$templateCache.put("app/examples/charts/examples/google-scatter.tmpl.html","<div google-chart chart=\"vm.chartData\"></div>\n");
$templateCache.put("app/examples/dashboards/examples/widget-backgrounds.tmpl.html","<div layout=\"row\" layout-xs=\"column\" layout-align=\"space-around center\" layout-margin>\n    <tri-widget flex title=\"Background Image\" subtitle=\"Use any image as a background\" background-image=\"assets/images/backgrounds/material-backgrounds/mb-bg-03.jpg\" title-position=\"top\"  content-layout=\"center center\" overlay-title palette-background=\"triCyan:600\">\n        <p class=\"padding-100\">\n            <!-- Your Content -->\n        </p>\n    </tri-widget>\n    <tri-widget flex title=\"Background Image\" subtitle=\"Use any image as a background\" background-image=\"assets/images/backgrounds/material-backgrounds/mb-bg-03.jpg\" title-position=\"bottom\"  content-layout=\"center center\" overlay-title palette-background=\"triCyan:600\">\n        <p class=\"padding-100\">\n            <!-- Your Content -->\n        </p>\n    </tri-widget>\n</div>");
$templateCache.put("app/examples/dashboards/examples/widget-colors.tmpl.html","<div layout=\"row\" layout-xs=\"column\" layout-align=\"space-around center\" layout-margin>\n    <tri-widget flex title=\"Amber Widget\" subtitle=\"using the 300 hue\" title-position=\"top\" palette-background=\"amber:300\">\n        <img src=\"assets/images/backgrounds/material-backgrounds/mb-bg-02.jpg\" />\n    </tri-widget>\n    <tri-widget flex title=\"Amber Widget\" subtitle=\"using the 400 hue\" title-position=\"top\" palette-background=\"amber:400\">\n        <img src=\"assets/images/backgrounds/material-backgrounds/mb-bg-02.jpg\" />\n    </tri-widget>\n    <tri-widget flex title=\"Amber Widget\" subtitle=\"using the 500 hue\" title-position=\"top\" palette-background=\"amber:500\">\n        <img src=\"assets/images/backgrounds/material-backgrounds/mb-bg-02.jpg\" />\n    </tri-widget>\n    <tri-widget flex title=\"Amber Widget\" subtitle=\"using the 600 hue\" title-position=\"top\" palette-background=\"amber:600\">\n        <img src=\"assets/images/backgrounds/material-backgrounds/mb-bg-02.jpg\" />\n    </tri-widget>\n</div>\n<div layout=\"row\" layout-xs=\"column\" layout-align=\"space-around center\" layout-margin>\n    <tri-widget flex title=\"Lime Widget\" subtitle=\"using the 300 hue\" title-position=\"top\" palette-background=\"lime:300\">\n        <img src=\"assets/images/backgrounds/material-backgrounds/mb-bg-01.jpg\" />\n    </tri-widget>\n    <tri-widget flex title=\"Lime Widget\" subtitle=\"using the 400 hue\" title-position=\"top\" palette-background=\"lime:400\">\n        <img src=\"assets/images/backgrounds/material-backgrounds/mb-bg-01.jpg\" />\n    </tri-widget>\n    <tri-widget flex title=\"Lime Widget\" subtitle=\"using the 500 hue\" title-position=\"top\" palette-background=\"lime:500\">\n        <img src=\"assets/images/backgrounds/material-backgrounds/mb-bg-01.jpg\" />\n    </tri-widget>\n    <tri-widget flex title=\"Lime Widget\" subtitle=\"using the 600 hue\" title-position=\"top\" palette-background=\"lime:600\">\n        <img src=\"assets/images/backgrounds/material-backgrounds/mb-bg-01.jpg\" />\n    </tri-widget>\n</div>");
$templateCache.put("app/examples/dashboards/examples/widget-draggable-vertical.tmpl.html","<div class=\"drag-container\" dragula=\'\"drag-container\"\' layout=\"column\" layout-xs=\"column\" layout-align=\"space-between\" layout-margin>\n    <tri-widget flex title=\"{{\'Drag Me!\' | triTranslate}}\" subtitle=\"{{\'You only need to specify the container you want to use.\' | triTranslate}}\" title-position=\"top\" palette-background=\"blue-grey:500\" background=\"primary\"></tri-widget>\n    <tri-widget flex title=\"{{\'Drag Me!\' | triTranslate}}\" subtitle=\"{{\'You can re-order these widgets inside the container.\' | triTranslate}}\" title-position=\"top\" palette-background=\"blue-grey:600\" background=\"primary\"></tri-widget>\n    <tri-widget flex title=\"{{\'Drag Me!\' | triTranslate}}\" subtitle=\"{{\'It works for all elements, not only widgets!\' | triTranslate}}\" title-position=\"top\" palette-background=\"blue-grey:700\" background=\"primary\"></tri-widget>\n    <tri-widget flex title=\"{{\'Drag Me!\' | triTranslate}}\" subtitle=\"{{\'Moving them outside their container is not quite possible.\' | triTranslate}}\" title-position=\"top\" palette-background=\"blue-grey:800\" background=\"primary\"></tri-widget>\n</div>\n");
$templateCache.put("app/examples/dashboards/examples/widget-draggable.tmpl.html","<div class=\"drag-container\" dragula=\'\"drag-container\"\' layout=\"row\" layout-xs=\"row\" layout-align=\"start center\" layout-margin>\n    <tri-widget flex title=\"{{\'Drag Me!\' | triTranslate}}\" subtitle=\"{{\'You only need to specify the container you want to use.\' | triTranslate}}\" title-position=\"top\" palette-background=\"blue-grey:500\" background=\"primary\"></tri-widget>\n    <tri-widget flex title=\"{{\'Drag Me!\' | triTranslate}}\" subtitle=\"{{\'You can re-order these widgets inside the container.\' | triTranslate}}\" title-position=\"top\" palette-background=\"blue-grey:600\" background=\"primary\"></tri-widget>\n    <tri-widget flex title=\"{{\'Drag Me!\' | triTranslate}}\" subtitle=\"{{\'It works for all elements, not only widgets!\' | triTranslate}}\" title-position=\"top\" palette-background=\"blue-grey:700\" background=\"primary\"></tri-widget>\n    <tri-widget flex title=\"{{\'Drag Me!\' | triTranslate}}\" subtitle=\"{{\'Moving them outside their container is not quite possible.\' | triTranslate}}\" title-position=\"top\" palette-background=\"blue-grey:800\" background=\"primary\"></tri-widget>\n</div>\n");
$templateCache.put("app/examples/dashboards/examples/widget-title-above.tmpl.html","<div layout=\"row\" layout-xs=\"column\" layout-align=\"space-around center\" layout-margin>\n    <tri-widget flex title=\"Some Title\" subtitle=\"Positioned above the image\" title-position=\"top\">\n        <img src=\"assets/images/backgrounds/material-backgrounds/mb-bg-01.jpg\" />\n    </tri-widget>\n    <tri-widget flex title=\"Some Title\" subtitle=\"Positioned above the image\" title-position=\"bottom\" >\n        <img src=\"assets/images/backgrounds/material-backgrounds/mb-bg-01.jpg\" />\n    </tri-widget>\n</div>");
$templateCache.put("app/examples/dashboards/examples/widget-title-side.tmpl.html","<div layout=\"row\" layout-xs=\"column\" layout-align=\"space-around center\" layout-margin>\n    <tri-widget title=\"Some Title\" subtitle=\"Positioned to the right of the image\" title-position=\"right\">\n        <img src=\"assets/images/backgrounds/material-backgrounds/mb-bg-04.jpg\" />\n    </tri-widget>\n    <tri-widget title=\"Some Title\" subtitle=\"Positioned to the left of the image\" title-position=\"left\">\n        <img src=\"assets/images/backgrounds/material-backgrounds/mb-bg-04.jpg\" />\n    </tri-widget>\n</div>");
$templateCache.put("app/examples/elements/examples/button-disabled.tmpl.html","<div class=\"elements-button-colors\" layout=\"row\" layout-xs=\"column\" layout-align=\"space-around center\">\n    <div layout=\"column\" layout-align=\"center center\">\n        <md-switch ng-model=\"vm.buttonDisabled\" aria-label=\"Switch 2\" class=\"md-primary\">\n            Toggle Button Disabled\n        </md-switch>\n    </div>\n    <div layout=\"column\" layout-align=\"center center\">\n        <md-button class=\"md-primary md-raised\" ng-disabled=\"vm.buttonDisabled\" aria-label=\"disabled button\">Disabled</md-button>\n        <h3>Disabled: {{vm.buttonDisabled}}</h3>\n    </div>\n</div>\n");
$templateCache.put("app/examples/elements/examples/button-fab.tmpl.html","<div layout=\"column\" layout-align=\"center center\" flex>\n    <md-button class=\"md-fab\" ng-class=\"[vm.buttonClass3, vm.buttonHue3]\" aria-label=\"fab button\">\n        <md-icon md-font-icon=\"zmdi zmdi-plus\"></md-icon>\n    </md-button>\n</div>\n<div layout=\"column\" layout-align=\"center space-around\" flex>\n    <md-input-container>\n        <label>Button Style</label>\n        <md-select placeholder=\"Choose a style\" ng-model=\"vm.buttonClass3\">\n            <md-option value=\"md-primary\">Primary</md-option>\n            <md-option value=\"md-accent\">Accent</md-option>\n            <md-option value=\"md-warn\">Warn</md-option>\n        </md-select>\n    </md-input-container>\n    <md-input-container>\n        <label>Button Hue</label>\n        <md-select placeholder=\"Choose a hue\" ng-model=\"vm.buttonHue3\">\n            <md-option value=\"md-default\">Default Hue</md-option>\n            <md-option value=\"md-hue-1\">Hue 1</md-option>\n            <md-option value=\"md-hue-2\">Hue 2</md-option>\n            <md-option value=\"md-hue-3\">Hue 3</md-option>\n        </md-select>\n    </md-input-container>\n</div>\n");
$templateCache.put("app/examples/elements/examples/button-flat.tmpl.html","<div layout=\"column\" layout-align=\"center center\" flex>\n    <md-button ng-class=\"[vm.buttonClass1, vm.buttonHue1]\" aria-label=\"flat button\">Button</md-button>\n</div>\n<div layout=\"column\" layout-align=\"center space-around\" flex>\n    <md-input-container>\n        <label>Button Style</label>\n        <md-select placeholder=\"Choose a style\" ng-model=\"vm.buttonClass1\">\n            <md-option value=\"md-primary\">Primary</md-option>\n            <md-option value=\"md-accent\">Accent</md-option>\n            <md-option value=\"md-warn\">Warn</md-option>\n        </md-select>\n    </md-input-container>\n    <md-input-container>\n        <label>Button Hue</label>\n        <md-select placeholder=\"Choose a hue\" ng-model=\"vm.buttonHue1\">\n            <md-option value=\"md-default\">Default Hue</md-option>\n            <md-option value=\"md-hue-1\">Hue 1</md-option>\n            <md-option value=\"md-hue-2\">Hue 2</md-option>\n            <md-option value=\"md-hue-3\">Hue 3</md-option>\n        </md-select>\n    </md-input-container>\n</div>\n");
$templateCache.put("app/examples/elements/examples/button-raised.tmpl.html","<div layout=\"column\" layout-align=\"center center\" flex>\n    <md-button class=\"md-raised\" ng-class=\"[vm.buttonClass2, vm.buttonHue2]\" aria-label=\"flat button\">Button</md-button>\n</div>\n<div layout=\"column\" layout-align=\"center space-around\" flex>\n    <md-input-container>\n        <label>Button Style</label>\n        <md-select placeholder=\"Choose a style\" ng-model=\"vm.buttonClass2\">\n            <md-option value=\"md-primary\">Primary</md-option>\n            <md-option value=\"md-accent\">Accent</md-option>\n            <md-option value=\"md-warn\">Warn</md-option>\n        </md-select>\n    </md-input-container>\n    <md-input-container>\n        <label>Button Hue</label>\n        <md-select placeholder=\"Choose a hue\" ng-model=\"vm.buttonHue2\">\n            <md-option value=\"md-default\">Default Hue</md-option>\n            <md-option value=\"md-hue-1\">Hue 1</md-option>\n            <md-option value=\"md-hue-2\">Hue 2</md-option>\n            <md-option value=\"md-hue-3\">Hue 3</md-option>\n        </md-select>\n    </md-input-container>\n</div>\n");
$templateCache.put("app/examples/elements/examples/button-ripple.tmpl.html","<div class=\"elements-button-colors\" layout=\"row\" layout-xs=\"column\" layout-align=\"space-around center\">\n    <div layout=\"column\" layout-align=\"center center\">\n        <md-button class=\"md-primary md-raised\" md-ripple-size=\"full\" aria-label=\"ripple full\">Full</md-button>\n        <h3>Ripple Full</h3>\n    </div>\n    <div layout=\"column\" layout-align=\"center center\">\n        <md-button class=\"md-primary md-raised\" md-ripple-size=\"partial\" aria-label=\"ripple partial\">Partial</md-button>\n        <h3>Ripple Partial</h3>\n    </div>\n    <div layout=\"column\" layout-align=\"center center\">\n        <md-button class=\"md-primary md-raised\" md-ripple-size=\"auto\" aria-label=\"ripple auto\">Auto</md-button>\n        <h3>Ripple Auto</h3>\n    </div>\n    <div layout=\"column\" layout-align=\"center center\">\n        <md-button class=\"md-primary md-raised\" md-no-ink aria-label=\"no ink\">No Ink</md-button>\n        <h3>No Ink</h3>\n    </div>\n</div>\n");
$templateCache.put("app/examples/elements/examples/cards-1.tmpl.html","<div layout=\"row\" layout-xs=\"column\">\n    <div flex=\"50\" flex-xs=\"100\">\n        <md-card>\n            <div><img src=\"assets/images/backgrounds/material-backgrounds/mb-bg-03.jpg\" alt=\"Card Image\"></div>\n            <md-card-title>\n                <md-card-title-text>\n                    <span class=\"md-headline\">Simple Card</span>\n                </md-card-title-text>\n            </md-card-title>\n\n            <md-card-content>\n                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis, distinctio minus nostrum aut magni ipsam, eius ipsa eos voluptate natus excepturi qui numquam velit non explicabo molestias quasi sunt veniam.</p>\n            </md-card-content>\n\n            <md-divider></md-divider>\n\n            <md-card-actions layout=\"row\" layout-align=\"end center\">\n                <md-button>Share</md-button>\n                <md-button class=\"md-primary\">Explore</md-button>\n            </md-card-actions>\n        </md-card>\n    </div>\n    <div flex=\"50\" flex-xs=\"100\">\n        <md-card>\n            <div><img src=\"assets/images/backgrounds/material-backgrounds/mb-bg-03.jpg\" alt=\"Card Image\"></div>\n            <md-card-title>\n                <md-card-title-text>\n                    <span class=\"md-headline\">Simple Card</span>\n                    <span class=\"md-subtitle\">With subtitle</span>\n                </md-card-title-text>\n            </md-card-title>\n\n            <md-card-content>\n                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis, distinctio minus nostrum aut magni ipsam, eius ipsa eos voluptate natus excepturi qui numquam velit non explicabo molestias quasi sunt veniam.</p>\n            </md-card-content>\n\n            <md-divider></md-divider>\n\n            <md-card-actions layout=\"row\" layout-align=\"end center\">\n                <md-button>Share</md-button>\n                <md-button class=\"md-primary\">Explore</md-button>\n            </md-card-actions>\n        </md-card>\n    </div>\n</div>\n");
$templateCache.put("app/examples/elements/examples/cards-2.tmpl.html","<div layout=\"row\" layout-xs=\"column\">\n    <div flex=\"50\" flex-xs=\"100\">\n        <md-card>\n            <md-card-title>\n                <md-card-title-text>\n                    <span class=\"md-headline\">Card with image</span>\n                    <span class=\"md-subhead\">Large</span>\n                </md-card-title-text>\n                <md-card-title-media>\n                    <div class=\"md-media-lg card-media\">\n                        <img src=\"assets/images/dashboards/weather.jpg\" alt=\"Card Image\">\n                    </div>\n                </md-card-title-media>\n            </md-card-title>\n            <md-card-actions layout=\"row\" layout-align=\"end center\">\n                <md-button>Action 1</md-button>\n                <md-button>Action 2</md-button>\n            </md-card-actions>\n        </md-card>\n    </div>\n    <div flex=\"50\" flex-xs=\"100\">\n        <md-card>\n            <md-card-title>\n                <md-card-title-text>\n                    <span class=\"md-headline\">Card with image</span>\n                    <span class=\"md-subhead\">Small</span>\n                </md-card-title-text>\n                <md-card-title-media>\n                    <div class=\"md-media-sm card-media\">\n                        <img src=\"assets/images/dashboards/weather.jpg\" alt=\"Card Image\">\n                    </div>\n                </md-card-title-media>\n            </md-card-title>\n            <md-card-actions layout=\"row\" layout-align=\"end center\">\n                <md-button>Action 1</md-button>\n                <md-button>Action 2</md-button>\n            </md-card-actions>\n        </md-card>\n    </div>\n</div>\n<div layout=\"row\" layout-xs=\"column\">\n    <div flex=\"50\" flex-xs=\"100\">\n        <md-card>\n            <md-card-title>\n                <md-card-title-text>\n                    <span class=\"md-headline\">Card with image</span>\n                    <span class=\"md-subhead\">Extra Large</span>\n                </md-card-title-text>\n            </md-card-title>\n            <md-card-content layout=\"row\" layout-align=\"space-between\">\n                <div class=\"md-media-xl card-media\">\n                    <img src=\"assets/images/dashboards/weather.jpg\" alt=\"Card Image\">\n                </div>\n\n                <md-card-actions layout=\"column\">\n                    <md-button>Action 1</md-button>\n                    <md-button>Action 2</md-button>\n                </md-card-actions>\n            </md-card-content>\n        </md-card>\n    </div>\n    <div flex=\"50\" flex-xs=\"100\">\n        <md-card>\n            <md-card-title>\n                <md-card-title-text>\n                    <span class=\"md-headline\">Card with image</span>\n                    <span class=\"md-subhead\">Medium</span>\n                </md-card-title-text>\n                <md-card-title-media>\n                    <div class=\"md-media-md card-media\">\n                        <img src=\"assets/images/dashboards/weather.jpg\" alt=\"Card Image\">\n                    </div>\n                </md-card-title-media>\n            </md-card-title>\n            <md-card-actions layout=\"row\" layout-align=\"end center\">\n                <md-button>Action 1</md-button>\n                <md-button>Action 2</md-button>\n            </md-card-actions>\n        </md-card>\n    </div>\n</div>\n");
$templateCache.put("app/examples/elements/examples/cards-3.tmpl.html","<div layout=\"row\" layout-xs=\"column\">\n    <div flex=\"50\" flex-xs=\"100\">\n        <md-card>\n            <img src=\"assets/images/backgrounds/material-backgrounds/mb-bg-03.jpg\" alt=\"Card Image\">\n            <md-card-title>\n                <md-card-title-text>\n                    <span class=\"md-headline\">Icon Actions</span>\n                </md-card-title-text>\n            </md-card-title>\n\n            <md-card-content>\n                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis, distinctio minus nostrum aut magni ipsam, eius ipsa eos voluptate natus excepturi qui numquam velit non explicabo molestias quasi sunt veniam.</p>\n            </md-card-content>\n\n            <md-card-actions layout=\"row\" layout-align=\"end center\">\n                <md-button class=\"md-icon-button\" aria-label=\"Facebook\">\n                    <md-icon md-font-icon=\"fa fa-facebook\"></md-icon>\n                </md-button>\n                <md-button class=\"md-icon-button\" aria-label=\"Twitter\">\n                    <md-icon md-font-icon=\"fa fa-twitter\"></md-icon>\n                </md-button>\n                <md-button class=\"md-icon-button\" aria-label=\"GooglePlus\">\n                    <md-icon md-font-icon=\"fa fa-google-plus\"></md-icon>\n                </md-button>\n            </md-card-actions>\n        </md-card>\n        <md-card>\n            <img src=\"assets/images/backgrounds/material-backgrounds/mb-bg-03.jpg\" alt=\"Card Image\">\n            <md-card-title>\n                <md-card-title-text>\n                    <span class=\"md-headline\">Icon Actions above content</span>\n                </md-card-title-text>\n            </md-card-title>\n\n            <md-card-actions layout=\"row\" layout-align=\"end center\">\n                <md-button class=\"md-icon-button\" aria-label=\"Facebook\">\n                    <md-icon md-font-icon=\"fa fa-facebook\"></md-icon>\n                </md-button>\n                <md-button class=\"md-icon-button\" aria-label=\"Twitter\">\n                    <md-icon md-font-icon=\"fa fa-twitter\"></md-icon>\n                </md-button>\n                <md-button class=\"md-icon-button\" aria-label=\"GooglePlus\">\n                    <md-icon md-font-icon=\"fa fa-google-plus\"></md-icon>\n                </md-button>\n            </md-card-actions>\n\n            <md-card-content>\n                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis, distinctio minus nostrum aut magni ipsam, eius ipsa eos voluptate natus excepturi qui numquam velit non explicabo molestias quasi sunt veniam.</p>\n            </md-card-content>\n        </md-card>\n    </div>\n    <div flex=\"50\" flex-xs=\"100\">\n        <md-card>\n            <md-card-header>\n                <md-card-avatar>\n                    <img class=\"md-user-avatar\" src=\"assets/images/avatars/avatar-4.png\"/>\n                </md-card-avatar>\n                <md-card-header-text>\n                    <span class=\"md-title\">Card</span>\n                    <span class=\"md-subhead\">With avatar image</span>\n                </md-card-header-text>\n            </md-card-header>\n\n            <img class=\"md-card-image\" src=\"assets/images/backgrounds/material-backgrounds/mb-bg-03.jpg\" alt=\"Card Image\">\n\n            <md-card-content>\n                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis, distinctio minus nostrum aut magni ipsam, eius ipsa eos voluptate natus excepturi qui numquam velit non explicabo molestias quasi sunt veniam.</p>\n            </md-card-content>\n\n            <md-card-actions layout=\"row\" layout-align=\"end center\">\n                <md-button>Share</md-button>\n                <md-button class=\"md-primary\">Explore</md-button>\n            </md-card-actions>\n        </md-card>\n        <md-card>\n            <img class=\"md-card-image\" src=\"assets/images/backgrounds/material-backgrounds/mb-bg-03.jpg\" alt=\"Card Image\">\n            <md-card-actions layout=\"row\" layout-align=\"end center\">\n                <md-button class=\"md-icon-button\" aria-label=\"Facebook\">\n                    <md-icon md-font-icon=\"fa fa-facebook\"></md-icon>\n                </md-button>\n                <md-button class=\"md-icon-button\" aria-label=\"Twitter\">\n                    <md-icon md-font-icon=\"fa fa-twitter\"></md-icon>\n                </md-button>\n                <md-button class=\"md-icon-button\" aria-label=\"GooglePlus\">\n                    <md-icon md-font-icon=\"fa fa-google-plus\"></md-icon>\n                </md-button>\n            </md-card-actions>\n        </md-card>\n    </div>\n</div>\n");
$templateCache.put("app/examples/elements/examples/checkboxes-1.tmpl.html","<md-input-container class=\"md-block\">\n    <md-checkbox ng-model=\"checkboxes.default\" aria-label=\"Default Checkbox\">\n        Default Checkbox\n    </md-checkbox>\n</md-input-container>\n<md-input-container class=\"md-block\">\n    <md-checkbox class=\"md-primary\" ng-model=\"checkboxes.primary\" aria-label=\"Primary Checkbox\">\n        Primary Checkbox\n    </md-checkbox>\n</md-input-container>\n<md-input-container class=\"md-block\">\n    <md-checkbox class=\"md-warn\" ng-model=\"checkboxes.warn\" aria-label=\"Warn Checkbox\">\n        Warn Checkbox\n    </md-checkbox>\n</md-input-container>\n<md-input-container class=\"md-block\">\n    <md-checkbox ng-model=\"checkboxes.disabled\" aria-label=\"Disabled Checkbox\" ng-disabled=\"true\">\n        Disabled Checkbox\n    </md-checkbox>\n</md-input-container>\n<md-input-container class=\"md-block\">\n    <md-checkbox ng-model=\"checkboxes.disabledChecked\" aria-label=\"Disabled Checkbox\" ng-disabled=\"true\" ng-init=\"checkboxes.disabledChecked = true\">\n        Disabled Checkbox Checked\n    </md-checkbox>\n</md-input-container>\n");
$templateCache.put("app/examples/elements/examples/chips-1.tmpl.html","<form name=\"emailForm\" class=\"md-padding\">\n    <md-contact-chips\n        ng-model=\"vm.email.to\"\n        md-contacts=\"vm.queryContacts($query)\"\n        md-contact-name=\"name\"\n        md-contact-image=\"image\"\n        md-contact-email=\"email\"\n        md-require-match\n        filter-selected=\"true\"\n        placeholder=\"To\"\n        secondary-placeholder=\"To\">\n    </md-contact-chips>\n    <md-contact-chips\n        ng-model=\"vm.email.cc\"\n        md-contacts=\"vm.queryContacts($query)\"\n        md-contact-name=\"name\"\n        md-contact-image=\"image\"\n        md-contact-email=\"email\"\n        md-require-match\n        filter-selected=\"true\"\n        placeholder=\"CC\"\n        secondary-placeholder=\"CC\">\n    </md-contact-chips>\n    <md-contact-chips\n        ng-model=\"vm.email.bcc\"\n        md-contacts=\"vm.queryContacts($query)\"\n        md-contact-name=\"name\"\n        md-contact-image=\"image\"\n        md-contact-email=\"email\"\n        md-require-match\n        filter-selected=\"true\"\n        placeholder=\"BCC\"\n        secondary-placeholder=\"BCC\">\n    </md-contact-chips>\n    <md-input-container class=\"md-block\">\n        <label for=\"subject\">Subject</label>\n        <input ng-model=\"vm.email.subject\" name=\"subject\" required>\n    </md-input-container>\n</form>\n");
$templateCache.put("app/examples/elements/examples/datepicker-1.tmpl.html","<div class=\"margin-bottom-20\" layout=\"row\" layout-align=\"space-around center\">\n    <p>Please select a date</p>\n    <md-datepicker ng-model=\"myDate\" md-placeholder=\"Enter date\"></md-datepicker>\n</div>\n<md-divider></md-divider>\n<md-table-container class=\"margin-top-20\">\n    <table md-table class=\"md-primary md-data-table\">\n        <thead md-head md-order=\"vm.query.order\" md-on-reorder=\"vm.getUsers\">\n            <tr md-row>\n                <th md-column>Date Format</th>\n                <th md-column>Example</th>\n            </tr>\n        </thead>\n        <tbody md-body>\n            <tr md-row>\n                <td md-cell>\n                    mediumDate\n                </td>\n                <td md-cell>\n                    {{myDate | date}}\n                </td>\n            </tr>\n            <tr md-row>\n                <td md-cell>\n                    fullDate\n                </td>\n                <td md-cell>\n                    {{myDate | date:\'fullDate\'}}\n                </td>\n            </tr>\n            <tr md-row>\n                <td md-cell>\n                    longDate\n                </td>\n                <td md-cell>\n                    {{myDate | date:\'longDate\'}}\n                </td>\n            </tr>\n            <tr md-row>\n                <td md-cell>\n                    using moment directive\n                </td>\n                <td md-cell>\n                    <span am-time-ago=\"myDate\"></span>\n                </td>\n            </tr>\n        </tbody>\n    </table>\n</md-table-container>\n");
$templateCache.put("app/examples/elements/examples/dialog-1.tmpl.html","<md-card>\n    <md-card-content>\n        <form name=\"dialogForm\">\n            <md-input-container class=\"md-block\">\n                <label>Title</label>\n                <input type=\"text\" ng-model=\"vm.newDialog.title\"/>\n            </md-input-container>\n            <md-input-container class=\"md-block\">\n                <label>Content</label>\n                <textarea ng-model=\"vm.newDialog.content\"></textarea>\n            </md-input-container>\n            <md-input-container class=\"md-block\">\n                <label>OK Button</label>\n                <input type=\"text\" ng-model=\"vm.newDialog.ok\"/>\n            </md-input-container>\n            <md-input-container class=\"md-block\">\n                <label>Cancel Button</label>\n                <input type=\"text\" ng-model=\"vm.newDialog.cancel\"/>\n            </md-input-container>\n            <md-button class=\"md-primary md-raised\" ng-disabled=\"dialogForm.$invalid\" ng-click=\"vm.createDialog($event, vm.newDialog)\">Create Dialog</md-button>\n        </form>\n    </md-card-content>\n</md-card>\n");
$templateCache.put("app/examples/elements/examples/fab-speed-1.tmpl.html","<div ng-controller=\"Fab1Controller as vm\" flex>\n    <div layout=\"row\" layout-align=\"center center\" style=\"min-height: 300px\" flex ng-cloak>\n        <md-fab-speed-dial md-direction=\"{{vm.fabDirection}}\" md-open=\"vm.fabStatus\" ng-class=\"vm.fabAnimation\">\n            <md-fab-trigger>\n                <md-button aria-label=\"share this post\" class=\"md-fab md-warn\">\n                    <md-icon md-font-icon=\"zmdi zmdi-share\"></md-icon>\n                </md-button>\n            </md-fab-trigger>\n            <md-fab-actions>\n                <md-button aria-label=\"twitter\" class=\"md-fab md-raised md-mini\" ng-click=\"vm.share(\'Shared on Twitter\', $event)\">\n                    <md-icon md-font-icon=\"fa fa-twitter\"></md-icon>\n                </md-button>\n                <md-button aria-label=\"facebook\" class=\"md-fab md-raised md-mini\" ng-click=\"vm.share(\'Shared on Facebook\', $event)\">\n                    <md-icon md-font-icon=\"fa fa-facebook\"></md-icon>\n                </md-button>\n                <md-button aria-label=\"google-plus\" class=\"md-fab md-raised md-mini\" ng-click=\"vm.share(\'Shared on Google+\', $event)\">\n                    <md-icon md-font-icon=\"fa fa-google-plus\"></md-icon>\n                </md-button>\n            </md-fab-actions>\n        </md-fab-speed-dial>\n    </div>\n\n    <div layout=\"row\" flex>\n        <div layout=\"column\" layout-align=\"start center\" flex>\n            <h3>Direction</h3>\n            <md-radio-group class=\"text-capitalize\" ng-model=\"vm.fabDirection\">\n                <md-radio-button ng-repeat=\"direction in vm.fabDirections\" ng-value=\"direction\" class=\"md-primary\">{{direction}}</md-radio-button>\n            </md-radio-group>\n        </div>\n        <div layout=\"column\" layout-align=\"start center\" flex>\n            <h3>Animation</h3>\n            <md-radio-group ng-model=\"vm.fabAnimation\">\n                <md-radio-button ng-repeat=\"animation in vm.fabAnimations\" ng-value=\"animation\" class=\"md-primary\">{{animation}}</md-radio-button>\n            </md-radio-group>\n        </div>\n        <div layout=\"column\" layout-align=\"start center\" flex>\n            <h3>Status</h3>\n            <md-radio-group class=\"text-capitalize\" ng-model=\"vm.fabStatus\">\n                <md-radio-button ng-repeat=\"status in vm.fabStatuses\" ng-value=\"status\" class=\"md-primary\">{{status}}</md-radio-button>\n            </md-radio-group>\n        </div>\n    </div>\n</div>");
$templateCache.put("app/examples/elements/examples/fab-toolbar-1.tmpl.html","<md-fab-toolbar class=\"md-left\">\n    <md-fab-trigger class=\"align-with-text\">\n        <md-button aria-label=\"menu\" class=\"md-fab md-primary\">\n            <md-icon md-font-icon=\"zmdi zmdi-attachment-alt\"></md-icon>\n        </md-button>\n    </md-fab-trigger>\n    <md-toolbar>\n        <md-fab-actions class=\"md-toolbar-tools\">\n            <md-button aria-label=\"insert file\" class=\"md-icon-button\">\n                <md-icon md-font-icon=\"zmdi zmdi-file\"></md-icon>\n            </md-button>\n            <md-button aria-label=\"insert photo\" class=\"md-icon-button\">\n                <md-icon md-font-icon=\"zmdi zmdi-image\"></md-icon>\n            </md-button>\n            <md-button aria-label=\"insert chart\" class=\"md-icon-button\">\n                <md-icon md-font-icon=\"zmdi zmdi-chart\"></md-icon>\n            </md-button>\n            <md-button aria-label=\"insert event\" class=\"md-icon-button\">\n                <md-icon md-font-icon=\"zmdi zmdi-calendar\"></md-icon>\n            </md-button>\n        </md-fab-actions>\n    </md-toolbar>\n</md-fab-toolbar>");
$templateCache.put("app/examples/elements/examples/grids-1.tmpl.html","<div ng-controller=\"Grids1Controller as vm\">\n    <md-grid-list md-cols-gt-md=\"12\" md-cols-xs=\"3\" md-cols-md=\"8\" md-row-height-gt-md=\"1:1\" md-row-height=\"4:3\" md-gutter-gt-md=\"16px\" md-gutter-gt-xs=\"8px\" md-gutter=\"4px\">\n        <md-grid-tile ng-repeat=\"tile in ::vm.colorTiles\" md-colspan-gt-xs=\"{{::tile.colspan}}\" md-rowspan-gt-xs=\"{{::tile.rowspan}}\" ng-style=\"::{ \'background\': tile.color }\">\n        </md-grid-tile>\n    </md-grid-list>\n</div>");
$templateCache.put("app/examples/elements/examples/lists-1.tmpl.html","<md-list>\n    <md-subheader class=\"md-no-sticky\">3 line items</md-subheader>\n    <md-list-item class=\"md-3-line\" ng-repeat=\"item in ::vm.emails\">\n        <img ng-src=\"{{::item.from.image}}\" class=\"md-avatar\" alt=\"{{::item.from.name}}\" />\n        <div class=\"md-list-item-text\">\n            <h3>{{::item.from.name}}</h3>\n            <h4>{{::item.subject}}</h4>\n            <p>{{::item.content[0]}}</p>\n        </div>\n    </md-list-item>\n    <md-divider ></md-divider>\n    <md-subheader class=\"md-no-sticky\">2 line items</md-subheader>\n    <md-list-item class=\"md-2-line\" ng-repeat=\"item in ::vm.emails\">\n        <img ng-src=\"{{::item.from.image}}\" class=\"md-avatar\" alt=\"{{::item.from.name}}\" />\n        <div class=\"md-list-item-text\">\n            <h3>{{::item.from.name}}</h3>\n            <p>{{::item.content[0]}}</p>\n        </div>\n    </md-list-item>\n    <md-divider ></md-divider>\n</md-list>\n");
$templateCache.put("app/examples/elements/examples/lists-2.tmpl.html","<md-list>\n    <md-subheader class=\"md-no-sticky\">Primary Action</md-subheader>\n    <md-list-item class=\"md-3-line\" ng-repeat=\"item in ::vm.emails\">\n        <md-checkbox ng-model=\"item.selected\"></md-checkbox>\n        <div class=\"md-list-item-text\">\n            <h3>{{::item.from.name}}</h3>\n            <h4>{{::item.subject}}</h4>\n            <p>{{::item.content[0]}}</p>\n        </div>\n    </md-list-item>\n    <md-divider ></md-divider>\n    <md-subheader class=\"md-no-sticky\">Primary & Secondary Action</md-subheader>\n    <md-list-item ng-repeat=\"item in ::vm.emails\">\n        <img ng-src=\"{{::item.from.image}}\" class=\"md-avatar\" alt=\"{{::item.from.name}}\" />\n        <p>{{::item.from.name}}</p>\n        <md-switch class=\"md-secondary\" ng-model=\"item.selected\"></md-switch>\n    </md-list-item>\n</md-list>\n");
$templateCache.put("app/examples/elements/examples/loader-1.tmpl.html","<div layout=\"column\" layout-fill ng-controller=\"Loader1Controller as vm\">\n\n    <div layout=\"row\" layout-align=\"center space-around\">\n        <p flex>Show the loader for {{vm.time}} seconds.</p>\n        <md-slider flex class=\"md-accent\" min=\"1\" max=\"30\" md-discrete ng-model=\"vm.time\" aria-label=\"loader time\"></md-slider>\n    </div>\n    <md-button class=\"md-primary md-raised\" ng-click=\"vm.showLoader()\">Show the loader</md-button>\n</div>\n");
$templateCache.put("app/examples/elements/examples/menu-1.tmpl.html","<md-toolbar>\n    <div class=\"md-toolbar-tools\">\n        <h2>\n            My App\n        </h2>\n        <span flex></span>\n        <md-menu>\n            <md-button class=\"md-icon-button\" aria-label=\"open menu\" ng-click=\"$mdOpenMenu()\">\n                <md-icon md-font-icon=\"zmdi zmdi-more-vert\"></md-icon>\n            </md-button>\n            <md-menu-content width=\"3\">\n                <md-menu-item>\n                    <md-button ng-click=\"$mdCloseMenu\">\n                        <md-icon md-font-icon=\"zmdi zmdi-settings\"></md-icon>\n                        Settings\n                    </md-button>\n                </md-menu-item>\n                <md-menu-item>\n                    <md-button ng-click=\"$mdCloseMenu\">\n                        <md-icon md-font-icon=\"zmdi zmdi-account\"></md-icon>\n                        Profile\n                    </md-button>\n                </md-menu-item>\n                <md-menu-divider></md-menu-divider>\n                <md-menu-item>\n                    <md-button ng-click=\"$mdCloseMenu\">\n                        <md-icon md-font-icon=\"zmdi zmdi-sign-in\"></md-icon>\n                        Log out\n                    </md-button>\n                </md-menu-item>\n            </md-menu-content>\n        </md-menu>\n    </div>\n</md-toolbar>");
$templateCache.put("app/examples/elements/examples/progress-circular.tmpl.html","<h3>Determinate</h3>\n<div class=\"margin-bottom-20\" layout=\"row\" layout-xs=\"column\" layout-align=\"space-around\" layout-fill>\n    <md-progress-circular class=\"md-hue-2\" md-mode=\"determinate\" ng-value=\"vm.determinateValue\"></md-progress-circular>\n    <md-progress-circular class=\"md-accent\" md-mode=\"determinate\" ng-value=\"vm.determinateValue\"></md-progress-circular>\n    <md-progress-circular class=\"md-accent md-hue-1\" md-mode=\"determinate\" ng-value=\"vm.determinateValue\"></md-progress-circular>\n    <md-progress-circular class=\"md-warn md-hue-3\" md-mode=\"determinate\" ng-value=\"vm.determinateValue\"></md-progress-circular>\n    <md-progress-circular class=\"md-warn\" md-mode=\"determinate\" ng-value=\"vm.determinateValue\"></md-progress-circular>\n</div>\n<h3>Indeterminate</h3>\n<div class=\"margin-bottom-20\" layout=\"row\" layout-xs=\"column\" layout-align=\"space-around\" layout-fill>\n    <md-progress-circular class=\"md-hue-2\" md-mode=\"indeterminate\"></md-progress-circular>\n    <md-progress-circular class=\"md-accent\" md-mode=\"indeterminate\"></md-progress-circular>\n    <md-progress-circular class=\"md-accent md-hue-1\" md-mode=\"indeterminate\"></md-progress-circular>\n    <md-progress-circular class=\"md-warn md-hue-3\" md-mode=\"indeterminate\"></md-progress-circular>\n    <md-progress-circular class=\"md-warn\" md-mode=\"indeterminate\"></md-progress-circular>\n</div>");
$templateCache.put("app/examples/elements/examples/progress-linear.tmpl.html","<h3>Indeterminate (Default)</h3>\n<md-progress-linear class=\"margin-bottom-20\" md-mode=\"indeterminate\"></md-progress-linear>\n<h3>Determinate (Warn)</h3>\n<md-progress-linear class=\"md-accent margin-bottom-20\" md-mode=\"determinate\" value=\"{{vm.determinateValue}}\"></md-progress-linear>\n<h3>Buffered (Warn)</h3>\n<md-progress-linear class=\"md-warn margin-bottom-20\" md-mode=\"buffer\" value=\"{{vm.determinateValue}}\" md-buffer-value=\"{{bufferValue}}\"></md-progress-linear>\n");
$templateCache.put("app/examples/elements/examples/radios-1.tmpl.html","<div layout=\"column\">\n    <p>Default Radio : <strong>{{data.default}}</strong></p>\n    <md-radio-group ng-model=\"data.default\" ng-init=\"data.default = \'Red\'\">\n        <md-radio-button value=\"Red\">Red</md-radio-button>\n        <md-radio-button value=\"Green\">Green</md-radio-button>\n        <md-radio-button value=\"Blue\">Blue</md-radio-button>\n    </md-radio-group>\n</div>\n\n<div layout=\"column\">\n    <p>Primary Radio : <strong>{{data.primary}}</strong></p>\n    <md-radio-group class=\"md-primary\" ng-model=\"data.primary\" ng-init=\"data.primary = \'Red\'\">\n        <md-radio-button value=\"Red\">Red</md-radio-button>\n        <md-radio-button value=\"Green\">Green</md-radio-button>\n        <md-radio-button value=\"Blue\">Blue</md-radio-button>\n    </md-radio-group>\n</div>\n");
$templateCache.put("app/examples/elements/examples/radios-2.tmpl.html","<p>Please choose an avatar : <strong>{{data.avatar}}</strong></p>\n<div layout=\"row\" layout-align=\"center center\">\n    <md-radio-group class=\"elements-radio-avatar\" ng-model=\"::data.avatar\" ng-init=\"data.avatar = \'avatar-1\'; avatars = [\'avatar-1\',\'avatar-2\',\'avatar-3\',\'avatar-4\',\'avatar-5\', \'avatar-6\']\">\n        <md-radio-button ng-repeat=\"avatar in ::avatars\" value=\"{{::avatar}}\" style=\"float:left;\" aria-label=\"avatar\">\n            <img ng-src=\"assets/images/avatars/{{::avatar}}.png\" alt=\"{{::avatar}}\">\n        </md-radio-button>\n    </md-radio-group>\n</div>\n");
$templateCache.put("app/examples/elements/examples/select-1.tmpl.html","<label>How many slices of cake would you like?</label>\n<md-select placeholder=\"Pick\" ng-model=\"numCakes\">\n    <md-option value=\"1\">One</md-option>\n    <md-option value=\"2\">Two</md-option>\n    <md-option value=\"3\">Three</md-option>\n    <md-option value=\"4\">Four</md-option>\n</md-select>\n<p class=\"margin-0\">Order {{numCakes}} cakes</p>");
$templateCache.put("app/examples/elements/examples/select-2.tmpl.html","<label>What car do you drive?</label>\n<md-select placeholder=\"Pick\" ng-model=\"carType\">\n    <md-optgroup label=\"Swedish Cars\">\n        <md-option value=\"Volvo\">Volvo</md-option>\n        <md-option value=\"Saab\">Saab</md-option>\n    </md-optgroup>\n    <md-optgroup label=\"German Cars\">\n        <md-option value=\"Mercedes\">Mercedes</md-option>\n        <md-option value=\"Audi\">Audi</md-option>\n    </md-optgroup>\n</md-select>");
$templateCache.put("app/examples/elements/examples/sidebars-1.tmpl.html","<!-- right sidebar -->\n<md-sidenav class=\"md-sidenav-right md-whiteframe-z2\" md-component-id=\"example-right\">\n    <md-toolbar class=\"md-theme-light\">\n        <h1 class=\"md-toolbar-tools\">Sidenav Right</h1>\n    </md-toolbar>\n    <md-content class=\"md-padding\">\n        <p>This is the right sidebar</p>\n    </md-content>\n</md-sidenav>\n\n\n<!-- left sidebar -->\n<md-sidenav class=\"md-sidenav-left md-whiteframe-z2\" md-component-id=\"example-left\">\n    <md-toolbar class=\"md-theme-light\">\n        <h1 class=\"md-toolbar-tools\">Sidenav Left</h1>\n    </md-toolbar>\n    <md-content class=\"md-padding\">\n        <p>This is the left sidebar</p>\n    </md-content>\n</md-sidenav>\n\n<!-- open sidebar buttons -->\n<div layout=\"column\" layout-fill layout-align=\"center center\">\n    <h2>Click a button to see a sidebar in action</h2>\n    <div layout=\"row\">\n        <md-button class=\"md-primary md-raised\" ng-click=\"vm.openSidebar(\'example-left\')\">Show Left</md-button>\n        <md-button class=\"md-primary md-raised\" ng-click=\"vm.openSidebar(\'example-right\')\">Show Right</md-button>\n    </div>\n</div>");
$templateCache.put("app/examples/elements/examples/slider-continuous.tmpl.html","<span>Default - Value: {{sliders.default}}</span>\n<md-slider min=\"0\" max=\"100\" ng-model=\"sliders.default\" ng-init=\"sliders.default = 50\" aria-label=\"default value\"></md-slider>\n\n<span>Primary - Value: {{sliders.primary}}</span>\n<md-slider class=\"md-primary\" min=\"0\" max=\"100\" ng-model=\"sliders.primary\" ng-init=\"sliders.primary = 50\" aria-label=\"primary value\"></md-slider>\n\n<span>Accent - Value: {{sliders.accent}}</span>\n<md-slider class=\"md-accent\" min=\"0\" max=\"100\" ng-model=\"sliders.accent\" ng-init=\"sliders.accent = 50\" aria-label=\"accent value\"></md-slider>\n");
$templateCache.put("app/examples/elements/examples/slider-discrete.tmpl.html","<span>Default - Value: {{sliders.default}}</span>\n<md-slider min=\"0\" max=\"10\" md-discrete ng-model=\"sliders.default\" ng-init=\"sliders.default = 5\" aria-label=\"default value\"></md-slider>\n\n<span>Primary - Value: {{sliders.primary}}</span>\n<md-slider class=\"md-primary\" min=\"0\" max=\"10\" md-discrete ng-model=\"sliders.primary\" ng-init=\"sliders.primary = 5\" aria-label=\"primary value\"></md-slider>\n\n<span>Accent - Value: {{sliders.accent}}</span>\n<md-slider class=\"md-accent\" min=\"0\" max=\"10\" md-discrete ng-model=\"sliders.accent\" ng-init=\"sliders.accent = 5\" aria-label=\"accent value\"></md-slider>");
$templateCache.put("app/examples/elements/examples/switches-1.tmpl.html","<md-switch ng-model=\"switches.default\" aria-label=\"Default Switch\" ng-init=\"switches.default = true\">\n    Default Switch\n</md-switch>\n<md-switch class=\"md-primary\" ng-model=\"switches.primary\" aria-label=\"Primary Switch\" ng-init=\"switches.primary = true\">\n    Primary Switch\n</md-switch>\n<md-switch class=\"md-warn\" ng-model=\"switches.warn\" aria-label=\"Warn Switch\" ng-init=\"switches.warn = true\">\n    Warn Switch\n</md-switch>\n<md-switch ng-model=\"switches.disabled\" aria-label=\"Disabled Switch\" disabled ng-init=\"switches.disabled = true\">\n    Disabled Switch\n</md-switch>\n<md-switch ng-model=\"switches.master\" aria-label=\"Master Switch\" ng-change=\"vm.toggleAll(switches, switches.master)\" ng-init=\"switches.master = true\">\n    Master Switch\n</md-switch>\n");
$templateCache.put("app/examples/elements/examples/table-1.tmpl.html","<div ng-controller=\"Tables1Controller as vm\">\n    <tri-table class=\"elements-image-table-example\" columns=\"::vm.columns\" contents=\"::vm.contents\" page-size=\"5\"></tri-table>\n</div>");
$templateCache.put("app/examples/elements/examples/table-advanced.tmpl.html","<div ng-controller=\"TablesAdvancedController as vm\">\n    <md-toolbar ng-hide=\"vm.selected.length || vm.filter.show\" class=\"md-table-toolbar md-default\">\n        <div class=\"md-toolbar-tools\">\n            <h2 class=\"md-title\">Popular Github Users</h2>\n            <div flex></div>\n            <md-button class=\"md-icon-button\" ng-click=\"vm.filter.show = true\">\n                <md-icon md-font-icon=\"zmdi zmdi-filter-list\"></md-icon>\n            </md-button>\n        </div>\n    </md-toolbar>\n\n    <md-toolbar ng-show=\"vm.filter.show && !vm.selected.length\" class=\"md-table-toolbar md-default\">\n        <div class=\"md-toolbar-tools\">\n            <md-icon md-font-icon=\"zmdi zmdi-search\"></md-icon>\n            <form flex=\"\" name=\"vm.filter.form\">\n                <input type=\"text\" ng-model=\"vm.query.filter\" ng-model-options=\"vm.filter.options\" placeholder=\"search\">\n            </form>\n            <md-button class=\"md-icon-button\" ng-click=\"vm.removeFilter()\">\n                <md-icon md-font-icon=\"zmdi zmdi-close\"></md-icon>\n            </md-button>\n        </div>\n    </md-toolbar>\n\n    <md-toolbar class=\"md-table-toolbar alternate\" ng-show=\"vm.selected.length\">\n        <div class=\"md-toolbar-tools\" layout-align=\"start center\">\n            <div>{{vm.selected.length}} {{vm.selected.length > 1 ? \'users\' : \'user\'}} selected</div>\n        </div>\n    </md-toolbar>\n\n    <md-table-container>\n        <table md-table class=\"md-primary md-data-table\" md-row-select ng-model=\"vm.selected\" md-progress=\"vm.promise\">\n            <thead md-head md-order=\"vm.query.order\" md-on-reorder=\"vm.getUsers\">\n                <tr md-row>\n                    <th md-column><span translate>{{vm.columns.avatar}}</span></th>\n                    <th md-column><span translate>{{vm.columns.login}}</span></th>\n                    <th md-column md-numberic md-order-by=\"id\"><span translate>{{vm.columns.id}}</span></th>\n                </tr>\n            </thead>\n            <tbody md-body>\n                <tr md-row md-auto-select md-select=\"user\" ng-repeat=\"user in vm.users.items\">\n                    <td md-cell><a href=\"{{::user.html_url}}\"><img ng-src=\"{{::user.avatar_url}}\"/></a></td>\n                    <td md-cell>{{::user.login}}</td>\n                    <td md-cell>{{::user.id}}</td>\n                </tr>\n            </tbody>\n        </table>\n    </md-table-container>\n\n    <md-table-pagination md-limit=\"vm.query.limit\" md-page-select md-page=\"vm.query.page\" md-total=\"{{vm.users.total_count}}\" md-on-paginate=\"vm.getUsers\"></md-table-pagination>\n</div>");
$templateCache.put("app/examples/elements/examples/tabs-1.tmpl.html","<md-tabs class=\"md-primary\" md-selected=\"selectedTabIndex\" md-stretch-tabs=\"always\">\n    <md-tab label=\"General\">\n        <md-content class=\"md-padding\">\n            <h3>User Details</h3>\n            <form>\n                <md-input-container class=\"md-block\">\n                    <label>Username</label>\n                    <input type=\"text\">\n                </md-input-container>\n                <md-input-container class=\"md-block\">\n                    <label>Password</label>\n                    <input type=\"text\">\n                </md-input-container>\n                <md-input-container class=\"md-block\">\n                    <label>Email</label>\n                    <input type=\"text\">\n                </md-input-container>\n                <md-input-container class=\"md-block\">\n                    <label>Twitter</label>\n                    <input type=\"text\">\n                </md-input-container>\n                <div layout=\"row\" layout-align=\"end center\">\n                    <md-button>Update</md-button>\n                </div>\n            </form>\n            <md-grid-list md-cols-gt-md=\"3\" md-cols-xs=\"3\" md-cols-md=\"4\" md-row-height=\"1:1\" md-gutter=\"2px\">\n                <md-grid-tile md-colspan=\"1\" md-rowspan=\"1\" ng-repeat=\"album in music.albums\" ng-style=\"{ \'background-image\': \'url(\' + album.cover + \')\' }\">\n                    <md-grid-tile-footer>\n                        <h3>{{album.title}}</h3>\n                    </md-grid-tile-footer>\n                </md-grid-tile>\n            </md-grid-list>\n        </md-content>\n    </md-tab>\n    <md-tab label=\"Settings\">\n        <md-content class=\"md-padding\">\n            <h3>Settings</h3>\n            <md-list>\n                <md-list-item layout=\"row\" layout-align=\"space-around center\">\n                    <md-icon md-font-icon=\"zmdi zmdi-account\"></md-icon>\n                    <p>Show Username</p>\n                    <md-switch class=\"md-secondary\"></md-switch>\n                </md-list-item>\n                <md-list-item layout=\"row\" layout-align=\"space-around center\">\n                    <md-icon md-font-icon=\"zmdi zmdi-account-box\"></md-icon>\n                    <p>Show Avatar</p>\n                    <md-switch class=\"md-secondary\"></md-switch>\n                </md-list-item>\n                <md-list-item layout=\"row\" layout-align=\"space-around center\">\n                    <md-icon md-font-icon=\"zmdi zmdi-cloud-upload\"></md-icon>\n                    <p>Allow Backups</p>\n                    <md-switch class=\"md-secondary\"></md-switch>\n                </md-list-item>\n            </md-list>\n        </md-content>\n    </md-tab>\n</md-tabs>");
$templateCache.put("app/examples/elements/examples/textangular-1.tmpl.html","<md-input-container class=\"md-block\">\n    <label for=\"subject\" translate>Subject</label>\n    <input ng-model=\"email.subject\" name=\"subject\" required>\n    <div ng-messages=\"emailForm.subject.$error\">\n        <div ng-message when=\"required\"><span translate>Please enter a subject for the email.</span></div>\n    </div>\n</md-input-container>\n\n<md-input-container flex class=\"md-block\">\n    <text-angular name=\"emailBody\" ng-model=\"email.content\" ta-target-toolbars=\"editor-toolbar\"></text-angular>\n</md-input-container>\n\n<text-angular-toolbar name=\"editor-toolbar\" class=\"email-dialog-editor-toolbar\" ta-toolbar-active-button-class=\"active\"></text-angular-toolbar>\n\n<div layout=\"row\" layout-align=\"end center\">\n    <md-button class=\"md-primary\">Send</md-button>\n</div>");
$templateCache.put("app/examples/elements/examples/toast-1.tmpl.html","<md-button class=\"md-fab md-primary md-fab-top-right\" ng-click=\"vm.showToast($event, \'top right\')\" aria-label=\"top right toast\">\n    <md-icon md-font-icon=\"zmdi zmdi-comment-dots\"></md-icon>\n</md-button>\n<md-button class=\"md-fab md-primary md-fab-bottom-right\" ng-click=\"vm.showToast($event, \'bottom right\')\" aria-label=\"bottom right toast\">\n    <md-icon md-font-icon=\"zmdi zmdi-comment-dots\"></md-icon>\n</md-button>\n<md-button class=\"md-fab md-primary md-fab-top-left\" ng-click=\"vm.showToast($event, \'top left\')\" aria-label=\"top left toast\">\n    <md-icon md-font-icon=\"zmdi zmdi-comment-dots\"></md-icon>\n</md-button>\n<md-button class=\"md-fab md-primary md-fab-bottom-left\" ng-click=\"vm.showToast($event, \'bottom left\')\" aria-label=\"bottom left toast\">\n    <md-icon md-font-icon=\"zmdi zmdi-comment-dots\"></md-icon>\n</md-button>\n<div layout=\"row\" layout-fill layout-align=\"center center\">\n    <h2>Click a button to see a toast in action</h2>\n</div>\n");
$templateCache.put("app/examples/elements/examples/toolbar-1.tmpl.html","<md-toolbar class=\"toolbar-default margin-bottom-30\">\n    <div class=\"md-toolbar-tools\">\n        <md-button class=\"md-icon-button\" aria-label=\"Settings\">\n            <md-icon md-font-icon=\"zmdi zmdi-menu\"></md-icon>\n        </md-button>\n        <h2>\n          <span>Toolbar with Icon Buttons</span>\n        </h2>\n        <span flex></span>\n        <md-button class=\"md-icon-button\" aria-label=\"More\">\n            <md-icon md-font-icon=\"zmdi zmdi-more-vert\"></md-icon>\n        </md-button>\n    </div>\n</md-toolbar>\n<md-toolbar class=\"md-accent margin-bottom-30\">\n    <div class=\"md-toolbar-tools\">\n        <h2>\n          <span>Accent Toolbar</span>\n        </h2>\n    </div>\n</md-toolbar>\n<md-toolbar class=\"md-warn toolbar-default margin-bottom-30\">\n    <div class=\"md-toolbar-tools\">\n        <h2>\n            <span class=\"breadcrumb\">\n                <span hide-xs>Warn Toolbar<md-icon md-font-icon=\"zmdi zmdi-chevron-right\"></md-icon></span>\n            </span>\n            <span class=\"breadcrumb\">\n                <span hide-xs>With<md-icon md-font-icon=\"zmdi zmdi-chevron-right\"></md-icon></span>\n            </span>\n            <span class=\"breadcrumb\">\n                <span hide-xs>Breadcrumbs</span>\n            </span>\n        </h2>\n    </div>\n</md-toolbar>\n<md-toolbar class=\"md-tall margin-bottom-30\">\n    <div class=\"md-toolbar-tools\">\n        <h2>\n          <span>Tall Toolbar</span>\n        </h2>\n    </div>\n</md-toolbar>\n<md-toolbar class=\"md-tall md-accent\">\n    <span flex></span>\n    <h2 class=\"md-toolbar-tools md-toolbar-tools-bottom\">\n        <span class=\"md-flex\">Tall Accent Toolbar - with actions pin to the bottom</span>\n    </h2>\n</md-toolbar>");
$templateCache.put("app/examples/elements/examples/tooltip-1.tmpl.html","<md-button class=\"md-fab md-primary\" aria-label=\"add\">\n    <md-icon md-font-icon=\"zmdi zmdi-plus\"></md-icon>\n    <md-tooltip>Add</md-tooltip>\n</md-button>\n<md-button class=\"md-fab md-primary\" aria-label=\"print\">\n    <md-icon md-font-icon=\"zmdi zmdi-print\"></md-icon>\n    <md-tooltip>Print</md-tooltip>\n</md-button>\n<md-button class=\"md-fab md-primary\" aria-label=\"refresh\">\n    <md-icon md-font-icon=\"zmdi zmdi-refresh\"></md-icon>\n    <md-tooltip>Refresh</md-tooltip>\n</md-button>\n");
$templateCache.put("app/examples/elements/examples/upload-1.tmpl.html","<div layout=\"row\" layout-align=\"space-around center\">\n    <md-button class=\"md-primary md-raised\" ngf-select=\"vm.upload($files)\" ngf-multiple=\"true\" aria-label=\"upload\">Upload</md-button>\n    <md-button class=\"md-primary md-raised md-fab\" ngf-select=\"vm.upload($files)\" ngf-multiple=\"true\" aria-label=\"upload\">\n        <md-icon md-font-icon=\"zmdi zmdi-cloud-upload\"></md-icon>\n    </md-button>\n</div>\n");
$templateCache.put("app/examples/elements/examples/upload-animate.tmpl.html","<div layout=\"row\" layout-align=\"space-around center\">\n    <md-button class=\"md-primary md-raised md-fab\" ngf-select=\"vm.upload($files)\" ng-disabled=\"vm.status != \'idle\'\" ngf-multiple=\"true\" aria-label=\"upload\">\n        <md-icon md-font-icon ng-class=\"{ \'zmdi zmdi-cloud-upload\': vm.status == \'idle\', \'fa fa-spinner fa-pulse\': vm.status == \'uploading\', \'zmdi zmdi-check\': vm.status == \'complete\'}\"></md-icon>\n    </md-button>\n</div>\n");
$templateCache.put("app/examples/elements/examples/whiteframe-1.tmpl.html","<md-whiteframe class=\"md-whiteframe-z1 margin-20 text-center\">\n    <h3>.md-whiteframe-z1</h3>\n</md-whiteframe>\n<md-whiteframe class=\"md-whiteframe-z2 margin-20 text-center\">\n    <h3>.md-whiteframe-z2</h3>\n</md-whiteframe>\n<md-whiteframe class=\"md-whiteframe-z3 margin-20 text-center\">\n    <h3>.md-whiteframe-z3</h3>\n</md-whiteframe>\n<md-whiteframe class=\"md-whiteframe-z4 margin-20 text-center\">\n    <h3>.md-whiteframe-z4</h3>\n</md-whiteframe>\n<md-whiteframe class=\"md-whiteframe-z5 margin-20 text-center\">\n    <h3>.md-whiteframe-z5</h3>\n</md-whiteframe>");
$templateCache.put("app/examples/forms/examples/autocomplete-1.tmpl.html","<md-autocomplete\n    class=\"margin-bottom-20\"\n    ng-disabled=\"vm.isDisabled\"\n    md-no-cache=\"vm.noCache\"\n    md-selected-item=\"selectedItem\"\n    md-search-text-change=\"vm.searchTextChange(vm.searchText)\"\n    md-search-text=\"vm.searchText\"\n    md-selected-item-change=\"vm.selectedItemChange(item)\"\n    md-items=\"item in vm.querySearch(vm.searchText)\"\n    md-item-text=\"item.display\"\n    md-min-length=\"0\"\n    placeholder=\"What is your favorite US state?\">\n    <span md-highlight-text=\"vm.searchText\" md-highlight-flags=\"^i\">{{item.display}}</span>\n</md-autocomplete>\n\n<md-checkbox ng-model=\"vm.simulateQuery\">Simulate query for results?</md-checkbox>\n<md-checkbox ng-model=\"vm.noCache\">Disable caching of queries?</md-checkbox>\n<md-checkbox ng-model=\"vm.isDisabled\">Disable the input?</md-checkbox>\n\n<p style=\"padding-left: 15px;\">By default, <code>&lt;md-autocomplete&gt;</code> will cache results when performing a query.  After the initial call is performed, it will use the cached results to eliminate unnecessary server requests or lookup logic. This can be disabled above.</p>\n");
$templateCache.put("app/examples/forms/examples/binding-1.tmpl.html","<md-card flex>\n    <md-card-content>\n        <h2>Create User</h2>\n        <md-input-container class=\"md-block\">\n            <label>Username</label>\n            <input type=\"text\" ng-model=\"vm.user.username\">\n        </md-input-container>\n        <md-input-container class=\"md-block\">\n            <label>Password</label>\n            <input type=\"password\" ng-model=\"vm.user.password\">\n        </md-input-container>\n        <md-input-container class=\"md-block\">\n            <label>Favoutite Color</label>\n            <md-select ng-model=\"vm.user.favouriteColor\" placeholder=\"Favorite Color\">\n                <md-option ng-value=\"color\" ng-repeat=\"color in [\'red\', \'green\', \'blue\']\">{{color}}</md-option>\n            </md-select>\n        </md-input-container>\n        <md-input-container class=\"md-block\">\n            <label>Description</label>\n            <textarea ng-model=\"vm.user.description\"></textarea>\n        </md-input-container>\n        <div layout=\"row\" layout-align=\"end center\">\n            <md-button class=\"md-primary\">Create</md-button>\n            <md-button>Cancel</md-button>\n        </div>\n    </md-card-content>\n</md-card>\n<md-card flex>\n    <md-card-content>\n        <h2>JSON</h2>\n        <pre>{{vm.user | json}}</pre>\n    </md-card-content>\n</md-card>\n");
$templateCache.put("app/examples/forms/examples/inputs-counter.tmpl.html","<md-input-container class=\"md-block\">\n    <label>Username (max 10 characters)</label>\n    <input type=\"text\" ng-model=\"username\" md-maxlength=\"10\">\n</md-input-container>\n<md-input-container class=\"md-block\">\n    <label>Tweet (max 140 characters)</label>\n    <textarea ng-model=\"tweet\" md-maxlength=\"140\"></textarea>\n</md-input-container>\n");
$templateCache.put("app/examples/forms/examples/inputs-float.tmpl.html","<h2>Create User</h2>\n<md-input-container class=\"md-block\">\n    <label>Username</label>\n    <input type=\"text\">\n</md-input-container>\n<md-input-container class=\"md-block\">\n    <label>Password</label>\n    <input type=\"password\">\n</md-input-container>\n<md-input-container class=\"md-block\">\n    <label>Description</label>\n    <textarea></textarea>\n</md-input-container>\n<div layout=\"row\" layout-align=\"end center\">\n    <md-button class=\"md-primary\">Create</md-button>\n    <md-button>Cancel</md-button>\n</div>\n");
$templateCache.put("app/examples/forms/examples/inputs-icons.tmpl.html","<h2>Create User</h2>\n<md-input-container md-no-float class=\"md-block\">\n    <md-icon md-font-icon=\"zmdi zmdi-account\"></md-icon>\n    <input type=\"text\" placeholder=\"Name\">\n</md-input-container>\n<md-input-container md-no-float class=\"md-block\">\n    <md-icon md-font-icon=\"zmdi zmdi-phone\"></md-icon>\n    <input type=\"text\" placeholder=\"Phone Number\">\n</md-input-container>\n<md-input-container md-no-float class=\"md-block\">\n    <md-icon md-font-icon=\"zmdi zmdi-email\"></md-icon>\n    <input type=\"email\" placeholder=\"Email (required)\" ng-required=\"true\">\n</md-input-container>\n<md-input-container md-no-float class=\"md-block\">\n    <md-icon md-font-icon=\"zmdi zmdi-pin\"></md-icon>\n    <input type=\"text\" placeholder=\"Address\">\n</md-input-container>\n");
$templateCache.put("app/examples/forms/examples/inputs-states.tmpl.html","<md-input-container>\n    <label>Enable or Disable me</label>\n    <input type=\"text\" ng-model=\"username\" ng-disabled=\"inputDisabled\">\n</md-input-container>\n<md-switch ng-model=\"inputDisabled\">\n    Disable Input\n</md-switch>\n");
$templateCache.put("app/examples/forms/examples/validation-1.tmpl.html","<h2>Enter your email</h2>\n<form name=\"login\" novalidate>\n    <md-input-container class=\"md-block\">\n        <label for=\"email\">email</label>\n        <input id=\"email\" label=\"email\" name=\"email\" type=\"email\" ng-model=\"user.email\" required/>\n        <div ng-messages=\"login.email.$error\" md-auto-hide=\"false\" ng-show=\"login.email.$touched\">\n            <div ng-message=\"required\">\n                Please enter your email address.\n            </div>\n            <div ng-message=\"email\">\n                Please enter a valid email address.\n            </div>\n        </div>\n    </md-input-container>\n\n    <div class=\"button-toolbar\" layout=\"row\" layout-align=\"end center\">\n        <md-button class=\"md-primary\" ng-disabled=\"login.$invalid\">Create</md-button>\n        <md-button>Cancel</md-button>\n    </div>\n</form>\n");
$templateCache.put("app/examples/maps/examples/map-label-demo.tmpl.html","<ui-gmap-google-map center=\"vm.labeledMap.center\" zoom=\"vm.labeledMap.zoom\" options=\"vm.labeledMap.options\">\n    <ui-gmap-marker coords=\"vm.labeledMap.marker.coords\" idkey=\"vm.labeledMap.marker.id\" options=\"vm.labeledMap.marker.options\">\n    	<ui-gmap-window show=\"\'true\'\">\n            <div>{{vm.labelTitle}}</div>\n        </ui-gmap-window>\n    </ui-gmap-marker>\n</ui-gmap-google-map>\n");
$templateCache.put("app/examples/maps/examples/map-terrain-demo.tmpl.html","<div id=\"map_terrain_canvas\">\n    <ui-gmap-google-map center=\"vm.terrainMap.center\" zoom=\"vm.terrainMap.zoom\" options=\"vm.terrainMap.options\">\n    	<ui-gmap-marker ng-repeat=\"marker in vm.mapMarkers\" coords=\"marker.coords\" idkey=\"marker.id\" options=\"marker.options\">\n            <ui-gmap-window show=\"\'true\'\">\n                <div>{{marker.labelTitle}}</div>\n            </ui-gmap-window>\n        </ui-gmap-marker>\n    </ui-gmap-google-map>\n</div>\n");
$templateCache.put("app/examples/menu/examples/dynamic-menu.tmpl.html","<div ng-controller=\"MenuDynamicController as vm\" layout=\"column\">\n    <div layout=\"row\">\n         <md-switch ng-model=\"vm.dynamicMenu.showDynamicMenu\" aria-label=\"Show extra menu\" ng-change=\"vm.toggleExtraMenu(vm.dynamicMenu.showDynamicMenu)\">\n            Show extra menu\n        </md-switch>\n    </div>\n</div>");
$templateCache.put("app/examples/authentication/forgot/forgot.tmpl.html","<md-card>\n    <md-toolbar class=\"padding-20 text-center\">\n        <img ng-src=\"{{::vm.triSettings.logo}}\" alt=\"{{vm.triSettings.name}}\">\n        <h1 class=\"md-headline\" translate>Forgot your password?</h1>\n    </md-toolbar>\n\n    <md-content class=\"md-padding\">\n        <p translate>Please enter your email below</p>\n        <form name=\"forgot\">\n            <md-input-container class=\"md-block\">\n                <label for=\"email\" translate>email</label>\n                <input id=\"email\" label=\"email\" name=\"email\" type=\"email\" ng-model=\"vm.user.email\" required/>\n                <div ng-messages=\"forgot.email.$error\" md-auto-hide=\"false\" ng-show=\"forgot.email.$touched\">\n                    <div ng-message when=\"required\"><span translate>Please enter your email address.</span></div>\n                    <div ng-message when=\"email\"><span translate>Please enter a valid email address.</span></div>\n                </div>\n            </md-input-container>\n\n            <md-button class=\"md-raised md-primary full-width margin-left-0 margin-right-0 margin-top-10 margin-bottom-10\" ng-click=\"vm.resetClick()\" ng-disabled=\"forgot.$invalid\" translate=\"Reset\" aria-label=\"{{\'Reset\' | triTranslate}}\"></md-button>\n\n            <md-button class=\"md-primary full-width margin-left-0 margin-right-0 margin-top-10 margin-bottom-10\" href=\"#/login\" translate=\"Remembered it? Login in here\" aria-label=\"{{\'Remembered it? Login in here\' | triTranslate}}\"></md-button>\n        </form>\n    </md-content>\n</md-card>\n");
$templateCache.put("app/examples/authentication/layouts/authentication.tmpl.html","<div class=\"full-image-background mb-bg-fb-05\" layout=\"row\" layout-fill>\n    <div class=\"animate-wrapper\" flex layout=\"column\">\n        <div id=\"ui-login\" class=\"login-frame\" ui-view flex layout=\"column\" layout-align=\"center center\"></div>\n    </div>\n</div>\n");
$templateCache.put("app/examples/authentication/lock/lock.tmpl.html","<md-card>\n    <md-toolbar class=\"padding-20 text-center\">\n        <img ng-src=\"{{::vm.triSettings.logo}}\" alt=\"{{vm.triSettings.name}}\">\n        <h1 class=\"md-headline\">\n            <span translate>Welcome back</span> {{vm.user.name}}\n        </h1>\n    </md-toolbar>\n\n    <md-content class=\"md-padding\">\n        <p class=\"margin-top-20 margin-bottom-20\" translate>You have been logged out due to idleness. Enter your password to log back in.</p>\n\n        <form name=\"lock\">\n            <md-input-container class=\"md-block\">\n                <label for=\"password\" translate>password</label>\n                <input label=\"password\" name=\"password\" type=\"password\" ng-model=\"vm.user.password\" required/>\n                <div ng-messages for=\"lock.password.$error\" md-auto-hide=\"false\" ng-show=\"lock.password.$touched\">\n                    <div ng-message when=\"required\"><span translate>Please enter your password.</span></div>\n                </div>\n            </md-input-container>\n\n            <div layout=\"row\">\n                <md-button flex href=\"#/login\" translate=\"Log out\"></md-button>\n                <md-button flex class=\"md-primary\" ng-click=\"vm.loginClick()\" ng-disabled=\"lock.$invalid\" translate=\"Log in\"></md-button>\n            </div>\n        </form>\n    </md-content>\n</md-card>\n");
$templateCache.put("app/examples/authentication/login/login.tmpl.html","<md-card >\n    <md-toolbar class=\"padding-20 text-center\">\n        <img ng-src=\"{{::vm.triSettings.logo}}\" alt=\"{{vm.triSettings.name}}\">\n        <h1 class=\"md-headline\" translate>Login</h1>\n    </md-toolbar>\n\n    <md-content class=\"md-padding\">\n        <form name=\"login\">\n            <md-input-container class=\"md-block\">\n                <label for=\"username\" translate>username</label>\n                <input id=\"username\" label=\"username\" name=\"username\" type=\"username\" ng-model=\"vm.credentials.username\" required/>\n            </md-input-container>\n            <md-input-container class=\"md-block\">\n                <label for=\"password\" translate>password</label>\n                <input  id=\"password\" label=\"password\" name=\"password\" type=\"password\" ng-model=\"vm.credentials.password\" required/>\n                <div ng-messages for=\"login.password.$error\" md-auto-hide=\"false\" ng-show=\"login.password.$touched\">\n                    <div ng-message when=\"required\"><span translate>Please enter your password.</span></div>\n                </div>\n            </md-input-container>\n\n            <div layout=\"row\" layout-align=\"space-between center\">\n                <md-input-container>\n                    <md-checkbox ng-model=\"vm.credentials.rememberMe\">\n                        <span translate>Remember Me</span>\n                    </md-checkbox>\n                </md-input-container>\n\n                <md-input-container>\n                    <md-button flex class=\"md-primary\" href=\"#/forgot\" translate=\"Forgot password?\" aria-label=\"{{\'Forgot password?\' | triTranslate}}\"></md-button>\n                </md-input-container>\n            </div>\n\n            <md-button class=\"md-raised md-primary full-width margin-left-0 margin-right-0 margin-top-10 margin-bottom-10\"  ng-click=\"vm.loginClick()\" ng-disabled=\"login.$invalid\" translate=\"Log in\" aria-label=\"{{\'Log in\' | triTranslate}}\"></md-button>\n\n            <md-button class=\"md-primary full-width margin-left-0 margin-right-0 margin-top-10 margin-bottom-10\" href=\"#/signup\" translate=\"Don\'t have an account? Create one now\" aria-label=\"{{\'Don\\\'t have an account? Create one now\' | triTranslate}}\"></md-button>\n\n            <div class=\"social-login\">\n                <md-divider></md-divider>\n\n                <div class=\"text-center margin-20\" translate>or login with</div>\n\n                <div layout=\"row\" layout-align=\"space-between center\"  layout-margin>\n                    <md-button href=\"#\" ng-repeat=\"social in ::vm.socialLogins\" class=\"md-icon-button\" ng-style=\"{ \'background-color\': social.color }\" aria-label=\"{{social.icon}}\">\n                        <md-icon md-font-icon=\"{{::social.icon}}\"></md-icon>\n                    </md-button>\n                </div>\n            </div>\n        </form>\n    </md-content>\n</md-card>\n");
$templateCache.put("app/examples/authentication/profile/profile.tmpl.html","<div class=\"full-image-background mb-bg-01 padding-20 padding-top-200 overlay-gradient-30\" layout=\"row\" layout-align=\"center start\">\n    <div class=\"margin-right-20\">\n        <img src=\"assets/images/avatars/avatar-5.png\" alt=\"girl-avatar\" class=\"make-round\" width=\"100\"/>\n    </div>\n    <div class=\"text-light\">\n        <h3 class=\"font-weight-600 margin-bottom-0 text-light\">Christos / Profile</h3>\n        <p class=\"font-weight-300 margin-top-0\">Edit your name, avatar etc</p>\n     </div>\n</div>\n\n<div layout=\"row\" class=\"profile\" layout-wrap>\n    <div flex=\"100\" flex-gt-md=\"100\">\n        <md-tabs md-dynamic-height md-border-bottom>\n            <md-tab label=\"Profile\">\n                <md-content class=\"md-padding\">\n                    <form name=\"profile\">\n                        <md-input-container class=\"md-block\">\n                            <label for=\"name\" translate>name</label>\n                            <input id=\"name\" label=\"name\" name=\"name\" type=\"text\" ng-model=\"vm.user.name\" required/>\n                            <div ng-messages=\"profile.name.$error\" md-auto-hide=\"false\" ng-show=\"profile.name.$touched\">\n                                <div ng-message when=\"required\"><span translate>Please enter your name</span></div>\n                            </div>\n                        </md-input-container>\n                        <md-input-container class=\"md-block\">\n                            <label for=\"email\" translate>email</label>\n                            <input id=\"email\" label=\"email\" name=\"email\" type=\"email\" ng-model=\"vm.user.email\" required/>\n                            <div ng-messages=\"profile.email.$error\" md-auto-hide=\"false\" ng-show=\"profile.email.$touched\">\n                                <div ng-message when=\"required\">\n                                    <span translate>Please enter your email address</span>\n                                </div>\n                                <div ng-message when=\"email\">\n                                    <span translate>Please enter a valid email address</span>\n                                </div>\n                            </div>\n                        </md-input-container>\n\n                        <md-input-container class=\"md-block\">\n                            <label for=\"location\" translate>location</label>\n                            <input id=\"location\" label=\"location\" name=\"location\" type=\"text\" ng-model=\"vm.user.location\"/>\n                        </md-input-container>\n\n                        <md-input-container class=\"md-block\">\n                            <label for=\"website\" translate>website</label>\n                            <input id=\"website\" label=\"website\" name=\"website\" type=\"text\" ng-model=\"vm.user.website\"/>\n                        </md-input-container>\n\n                        <md-input-container class=\"md-block\">\n                            <label for=\"twitter\" translate>twitter</label>\n                            <input id=\"twitter\" label=\"twitter\" name=\"twitter\" type=\"text\" ng-model=\"vm.user.twitter\"/>\n                        </md-input-container>\n\n                        <md-input-container class=\"md-block\">\n                            <label for=\"bio\" translate>bio</label>\n                            <textarea id=\"bio\" label=\"bio\" name=\"bio\" ng-model=\"vm.user.bio\"/>\n                        </md-input-container>\n\n                        <md-button class=\"md-raised md-primary margin-left-0\" ng-disabled=\"profile.$invalid\" translate=\"Update Settings\"></md-button>\n                    </form>\n                </md-content>\n            </md-tab>\n            <md-tab label=\"Password\">\n                <md-content class=\"md-padding\">\n                    <form name=\"password\">\n                        <md-input-container class=\"md-block\">\n                            <label for=\"old-password\" translate>current</label>\n                            <input id=\"old-password\" label=\"old-password\" name=\"old-password\" type=\"text\" ng-model=\"vm.user.current\"/>\n                        </md-input-container>\n\n                        <md-input-container class=\"md-block\">\n                            <label for=\"password\" translate>new password</label>\n                            <input id=\"password\" label=\"password\" name=\"password\" type=\"password\" ng-model=\"vm.user.password\" tri-same-password=\"password.confirm\" ng-minlength=\"8\" required/>\n                            <div ng-messages=\"password.password.$error\" ng-include=\"\'app/examples/authentication/signup/password.messages.html\'\" md-auto-hide=\"false\" ng-show=\"password.password.$touched\"></div>\n                        </md-input-container>\n\n                        <md-input-container class=\"md-block\">\n                            <label for=\"confirm\" translate>confirm password</label>\n                            <input id=\"confirm\" label=\"confirm\" name=\"confirm\" type=\"password\" ng-model=\"vm.user.confirm\" tri-same-password=\"password.password\" ng-minlength=\"8\" required/>\n                            <div ng-messages=\"password.confirm.$error\" ng-include=\"\'app/examples/authentication/signup/password.messages.html\'\" md-auto-hide=\"false\" ng-show=\"password.confirm.$touched\"></div>\n                        </md-input-container>\n\n                        <md-button class=\"md-raised md-primary margin-left-0\" ng-disabled=\"profile.$invalid\" translate=\"Update Settings\"></md-button>\n\n                    </form>\n                </md-content>\n            </md-tab>\n            <md-tab label=\"Notifications\">\n                <md-content class=\"md-padding\">\n                    <md-list>\n                        <div ng-repeat=\"group in ::vm.settingsGroups\">\n                            <md-subheader class=\"md-accent\" translate=\"{{::group.name}}\"></md-subheader>\n                            <md-list-item ng-repeat=\"setting in ::group.settings\" layout=\"row\" layout-align=\"space-around center\">\n                                <md-icon md-font-icon=\"{{::setting.icon}}\"></md-icon>\n                                <p translate>{{::setting.title}}</p>\n                                <md-switch class=\"md-secondary\" ng-model=\"setting.enabled\"></md-switch>\n                            </md-list-item>\n                        </div>\n                    </md-list>\n                    <md-button class=\"md-raised md-primary margin-left-0\" ng-disabled=\"profile.$invalid\" translate=\"Update Settings\"></md-button>\n                </md-content>\n            </md-tab>\n        </md-tabs>\n    </div>\n\n</div>\n");
$templateCache.put("app/examples/authentication/signup/password.messages.html","\n");
$templateCache.put("app/examples/authentication/signup/signup.tmpl.html","<md-card>\n    <md-toolbar class=\"padding-20 text-center\">\n        <img ng-src=\"{{::vm.triSettings.logo}}\" alt=\"{{vm.triSettings.name}}\">\n        <h1 class=\"md-headline\" translate>Sign up</h1>\n    </md-toolbar>\n\n    <md-content class=\"md-padding\">\n        <form name=\"signup\">\n            <md-input-container class=\"md-block\">\n                <label for=\"name\" translate>name</label>\n                <input id=\"name\" label=\"name\" name=\"name\" type=\"text\" ng-model=\"vm.user.name\" required/>\n                <div ng-messages=\"signup.name.$error\" md-auto-hide=\"false\" ng-show=\"signup.name.$touched\">\n                    <div ng-message when=\"required\">\n                        <span translate>Please enter your name</span>\n                    </div>\n                </div>\n            </md-input-container>\n            <md-input-container class=\"md-block\">\n                <label for=\"email\" translate>email</label>\n                <input id=\"email\" label=\"email\" name=\"email\" type=\"email\" ng-model=\"vm.user.email\" required/>\n                <div ng-messages=\"signup.email.$error\" md-auto-hide=\"false\" ng-show=\"signup.email.$touched\">\n                    <div ng-message when=\"required\">\n                        <span translate>Please enter your email address</span>\n                    </div>\n                    <div ng-message when=\"email\">\n                        <span translate>Please enter a valid email address</span>\n                    </div>\n                </div>\n            </md-input-container>\n\n            <md-input-container class=\"md-block\">\n                <label for=\"password\" translate>password</label>\n                <input id=\"password\" label=\"password\" name=\"password\" type=\"password\" ng-model=\"vm.user.password\" tri-same-password=\"signup.confirm\" ng-minlength=\"8\" required/>\n                <ng-messages for=\"signup.password.$error\" md-auto-hide=\"false\" ng-show=\"signup.password.$touched\">\n                    <div ng-message when=\"required\">\n                        <span translate>Please enter a password</span>\n                    </div>\n                    <div ng-message when=\"minlength\">\n                        <span translate>Your password must be greater than 8 characters long</span>\n                    </div>\n                    <div ng-message when=\"samePassword\">\n                        <span translate>You need to enter the same password</span>\n                    </div>\n                </ng-messages>\n            </md-input-container>\n\n            <md-input-container class=\"md-block\">\n                <label for=\"password\" translate>confirm password</label>\n                <input id=\"confirm\" label=\"confirm\" name=\"confirm\" type=\"password\" ng-model=\"vm.user.confirm\" tri-same-password=\"signup.password\" ng-minlength=\"8\" required/>\n                <ng-messages for=\"signup.confirm.$error\" md-auto-hide=\"false\" ng-show=\"signup.confirm.$touched\">\n                    <div ng-message when=\"required\">\n                        <span translate>Please enter a password</span>\n                    </div>\n                    <div ng-message when=\"minlength\">\n                        <span translate>Your password must be greater than 8 characters long</span>\n                    </div>\n                    <div ng-message when=\"samePassword\">\n                        <span translate>You need to enter the same password</span>\n                    </div>\n                </ng-messages>\n            </md-input-container>\n\n            <md-button class=\"md-raised md-primary full-width margin-left-0 margin-right-0 margin-top-10 margin-bottom-10\" ng-click=\"vm.signupClick()\" ng-disabled=\"signup.$invalid\" translate=\"Sign Up\" aria-label=\"{{\'Sign Up\' | triTranslate}}\"></md-button>\n\n            <md-button  class=\"md-primary full-width margin-left-0 margin-right-0 margin-top-10 margin-bottom-10\" href=\"#/login\" translate=\"Already have an account? Login here.\" aria-label=\"{{\'Already have an account? Login here.\' | triTranslate}}\"></md-button>\n\n        </form>\n    </md-content>\n\n</md-card>\n");
$templateCache.put("app/examples/dashboards/analytics/analytics.tmpl.html","<div class=\"md-content md-padding\">\n    <div layout=\"row\" layout-xs=\"column\" layout-wrap>\n        <counter-widget flex flex-sm=\"50\" title=\"Comments\" count=\"vm.data.social.comments\" icon=\"fa fa-comments\" background=\"red-400\" color=\"white\"></counter-widget>\n        <counter-widget flex flex-sm=\"50\" title=\"Tweets\" count=\"vm.data.social.tweets\" icon=\"fa fa-twitter\"  background=\"blue-A100\" color=\"white\"></counter-widget>\n        <counter-widget flex flex-sm=\"50\" title=\"Likes\" count=\"vm.data.social.likes\" icon=\"fa fa-facebook\"  background=\"blue-900\" color=\"white\"></counter-widget>\n        <counter-widget flex flex-sm=\"50\" title=\"Pageviews\" count=\"vm.data.social.pageviews\" icon=\"fa fa-eye\"  background=\"green-500\" color=\"white\"></counter-widget>\n    </div>\n    <div layout=\"row\">\n        <line-chart-widget flex start=\"vm.start\" end=\"vm.end\" time-spans=\"vm.timeSpans\" on-time-change=\"vm.timeSpanChanged(span)\" data=\"vm.data.sessionsLineChartData\" options=\"vm.overviewLineChartOptions\"></line-chart-widget>\n    </div>\n    <div layout=\"row\" layout-xs=\"column\">\n        <div flex flex-xs=\"100\" layout=\"column\">\n            <div flex layout=\"row\">\n                <stat-chart-widget flex name=\"Sessions\" statistic=\"{{vm.data.totals.sessions | number}}\" data=\"vm.data.sessionsLineChartData\" options=\"vm.statLineChartOptions\"></stat-chart-widget>\n                <stat-chart-widget flex name=\"Users\" statistic=\"{{vm.data.totals.users | number}}\" data=\"vm.data.usersLineChartData\" options=\"vm.statLineChartOptions\"></stat-chart-widget>\n                <stat-chart-widget flex name=\"Pageviews\" statistic=\"{{vm.data.totals.pageviews | number}}\" data=\"vm.data.pageviewsLineChartData\" options=\"vm.statLineChartOptions\"></stat-chart-widget>\n            </div>\n            <div layout=\"row\">\n                <stat-chart-widget flex name=\"Pages / Sessions\" statistic=\"{{vm.data.totals.pagesessions | number}}\" data=\"vm.data.pagesSessionsLineChartData\" options=\"vm.statLineChartOptions\"></stat-chart-widget>\n                <stat-chart-widget flex name=\"Avg. Session\" statistic=\"{{vm.data.totals.avgsessions | secondsToDate | date:\'HH:mm:ss\'}}\" data=\"vm.data.avgSessionLineChartData\" options=\"vm.statTimeLineChartOptions\"></stat-chart-widget>\n                <stat-chart-widget flex name=\"Bounce Rate\" statistic=\"{{vm.data.totals.bounces.toFixed(2)}}%\" data=\"vm.data.bounceLineChartData\" options=\"vm.statPercentLineChartOptions\"></stat-chart-widget>\n            </div>\n        </div>\n        <div flex=\"40\" flex-xs=\"100\" layout=\"column\">\n            <pie-chart-widget data=\"vm.data.visitorPieChartData\" options=\"vm.visitorPieChartOptions\"></pie-chart-widget>\n        </div>\n    </div>\n    <div layout=\"row\" layout-xs=\"column\">\n        <div flex flex-xs=\"100\" layout=\"column\">\n            <tabs-widget languages=\"vm.data.languages\" countries=\"vm.data.countries\"></tabs-widget>\n        </div>\n        <div flex flex-xs=\"100\" layout=\"column\">\n            <map-widget></map-widget>\n        </div>\n    </div>\n</div>\n");
$templateCache.put("app/examples/dashboards/analytics/date-change-dialog.tmpl.html","<md-dialog flex=\"60\" flex-xs=\"100\">\n    <md-toolbar class=\"toolbar-default\">\n        <div class=\"md-toolbar-tools\">\n            <h2 flex translate>Select a date range</h2>\n            <md-button class=\"md-icon-button\" ng-click=\"vm.cancelClick()\" aria-label=\"cancel\">\n                <md-icon md-font-icon=\"zmdi zmdi-close\"></md-icon>\n            </md-button>\n        </div>\n    </md-toolbar>\n\n    <md-dialog-content class=\"md-dialog-content\">\n        <div layout=\"row\" layout-padding>\n            <div flex layout=\"column\" layout-align=\"center center\">\n                <h2 translate>Start Date</h2>\n                <md-datepicker ng-model=\"vm.start\" md-placeholder=\"\'Start Date\' | triTranslate\"></md-datepicker>\n            </div>\n            <div layout=\"column\" layout-align=\"center center\">\n                <md-icon style=\"font-size:2.4em\" md-font-icon=\"zmdi zmdi-long-arrow-right\"></md-icon>\n            </div>\n            <div flex layout=\"column\" layout-align=\"center center\">\n                <h2 translate>End Date</h2>\n                <md-datepicker ng-model=\"vm.end\" md-placeholder=\"\'End Date\' | triTranslate\"></md-datepicker>\n            </div>\n        </div>\n    </md-dialog-content>\n\n    <md-dialog-actions layout=\"row\">\n        <span flex></span>\n        <md-button ng-click=\"vm.cancelClick()\" aria-label=\"{{\'Cancel\' | triTranslate}}\" translate=\"Cancel\"></md-button>\n        <md-button ng-click=\"vm.okClick()\" class=\"md-primary\" aria-label=\"{{Ok | triTranslate}}\" translate=\"Ok\"></md-button>\n    </md-dialog-actions>\n</md-dialog>");
$templateCache.put("app/examples/dashboards/analytics/fab-button.tmpl.html","<md-button ng-click=\"vm.changeDate($event)\" class=\"md-fab md-accent md-fab-bottom-right\" aria-label=\"change date\">\n    <md-icon md-font-icon=\"zmdi zmdi-calendar-alt\"></md-icon>\n</md-button>\n");
$templateCache.put("app/examples/dashboards/classic/classic.tmpl.html","<div class=\"dashboard-container overlay-10 padded-content-page\" layout=\"column\">\n    <div layout=\"row\" layout-xs=\"column\" layout-wrap class=\"drag-container\" dragula=\'\"drag-analytics-container\"\'>\n        <counter-widget flex flex-sm=\"50\" title=\"Comments\" count=\"vm.data.social.comments\" icon=\"fa fa-comments\" background=\"deep-orange-500\" color=\"white\"></counter-widget>\n        <counter-widget flex flex-sm=\"50\" title=\"Tweets\" count=\"vm.data.social.tweets\" icon=\"fa fa-twitter\"  background=\"light-blue-400\" color=\"white\"></counter-widget>\n        <counter-widget flex flex-sm=\"50\" title=\"Likes\" count=\"vm.data.social.likes\" icon=\"fa fa-facebook\"  background=\"blue-900\" color=\"white\"></counter-widget>\n        <counter-widget flex flex-sm=\"50\" title=\"Pageviews\" count=\"vm.data.social.pageviews\" icon=\"fa fa-eye\"  background=\"green-700\" color=\"white\"></counter-widget>\n    </div>\n    <div layout=\"row\" layout-xs=\"column\" layout-margin>\n        <tri-widget chartjs-line-widget title=\"Pageviews & Visits\" subtitle=\"11/03/15 - 11/4/15\" content-layout=\"row\" content-padding>\n            <canvas flex class=\"chart-line\" chart-data=\"lineChart.data\" chart-labels=\"lineChart.labels\" chart-legend=\"true\" chart-series=\"lineChart.series\" chart-options=\"lineChart.options\"></canvas>\n        </tri-widget>\n        <tri-widget chartjs-pie-widget title=\"Network Referrals\" subtitle=\"11/03/15 - 11/4/15\" content-padding>\n            <canvas flex class=\"chart-pie\" chart-data=\"pieChart.data\" chart-legend=\"true\" chart-labels=\"pieChart.labels\"></canvas>\n        </tri-widget>\n    </div>\n    <div layout=\"row\" layout-xs=\"column\" layout-margin>\n        <tri-widget flex load-data-widget=\"{ referrals: \'app/examples/dashboards/data/referrals.json\' }\" title=\"Referral Traffic\" subtitle=\"11/03/15 - 11/4/15\" content-padding>\n            <table class=\"table\">\n                <thead>\n                    <tr>\n                        <th ng-repeat=\"header in ::referrals.header | limitTo:3\">{{::header}}</th>\n                    </tr>\n                </thead>\n                <tbody class=\"md-caption\">\n                    <tr ng-repeat=\"referral in ::referrals.data | limitTo:5\">\n                        <td ng-repeat=\"data in ::referral | limitTo:3\">{{::data}}</td>\n                    </tr>\n                </tbody>\n            </table>\n        </tri-widget>\n        <tri-widget flex load-data-widget=\"{ social: \'app/examples/dashboards/data/social.json\' }\" title=\"Network Referrals\" subtitle=\"11/03/15 - 11/4/15\" content-padding>\n            <table class=\"table\">\n                <thead>\n                    <tr>\n                        <th ng-repeat=\"header in ::social.header | limitTo:3\">{{::header}}</th>\n                    </tr>\n                </thead>\n                <tbody class=\"md-caption\">\n                    <tr ng-repeat=\"socialData in ::social.data | limitTo:5\">\n                        <td ng-repeat=\"data in ::socialData | limitTo:3\">{{::data}}</td>\n                    </tr>\n                </tbody>\n            </table>\n        </tri-widget>\n    </div>\n    <div layout=\"row\" layout-xs=\"column\" layout-margin>\n        <tri-widget google-geochart-widget flex title=\"Location\" subtitle=\"11/03/15 - 11/4/15\" title-position=\"top\" content-padding>\n            <div class=\"google-chart\" google-chart chart=\"geoChartData\"></div>\n        </tri-widget>\n        <tri-widget flex load-data-widget=\"{ social: \'app/examples/dashboards/data/location.json\' }\" title=\"Network Referrals\" subtitle=\"11/03/15 - 11/4/15\" content-padding>\n            <table class=\"table\">\n                <thead>\n                    <tr>\n                        <th ng-repeat=\"header in ::social.header | limitTo:3\">{{::header}}</th>\n                    </tr>\n                </thead>\n                <tbody class=\"md-caption\">\n                    <tr ng-repeat=\"socialData in ::social.data | limitTo:5\">\n                        <td ng-repeat=\"data in ::socialData | limitTo:3\">{{::data}}</td>\n                    </tr>\n                </tbody>\n            </table>\n        </tri-widget>\n    </div>\n</div>\n");
$templateCache.put("app/examples/dashboards/general/dashboard-general.tmpl.html","<div class=\"dashboard-container overlay-5 padded-content-page\">\n    <div layout=\"row\" layout-xs=\"column\" layout-margin>\n        <tri-widget calendar-widget flex class=\"widget-calendar\" palette-background=\"triCyan:500\" content-layout=\"column\" content-layout-align=\"space-between\">\n            <div flex layout=\"row\" layout-align=\"start center\" layout-padding>\n                <div flex layout=\"column\">\n                    <h3 class=\"md-subhead text-ellipsis margin-0\">\n                        {{calendarController.currentDay | amDateFormat:\'MMMM\'}}\n                    </h3>\n                    <h3 class=\"md-subhead text-ellipsis margin-0\">\n                        {{calendarController.currentDay | amDateFormat:\'YYYY\'}}\n                    </h3>\n                </div>\n                <div class=\"widget-buttons\">\n                    <md-button class=\"widget-button md-icon-button\" ng-click=\"calendarController.changeMonth(\'prev\')\" aria-label=\"previous month\">\n                        <md-icon md-font-icon=\"zmdi zmdi-chevron-left\"></md-icon>\n                    </md-button>\n                    <md-button show-gt-md class=\"widget-button md-icon-button\" ng-click=\"calendarController.changeMonth(\'today\')\" aria-label=\"today\">\n                        <md-icon md-font-icon=\"zmdi zmdi-calendar-alt\"></md-icon>\n                    </md-button>\n                    <md-button class=\"widget-button md-icon-button\" ng-click=\"calendarController.changeMonth(\'next\')\" aria-label=\"next month\">\n                        <md-icon md-font-icon=\"zmdi zmdi-chevron-right\"></md-icon>\n                    </md-button>\n                </div>\n            </div>\n            <md-divider></md-divider>\n            <div layout-padding>\n                <div ui-calendar=\"calendarController.calendarOptions\" ng-model=\"calendarController.calendarEvents\" calendar=\"calendarWidget\"></div>\n            </div>\n        </tri-widget>\n\n\n        <div layout=\"column\" flex layout-margin>\n            <tri-widget palette-background=\"deep-orange:500\" content-layout=\"column\" content-layout-align=\"space-between\">\n                <h2 class=\"md-display-2 font-weight-100 margin-0\" flex layout-padding>Call Sue</h2>\n                <md-divider></md-divider>\n                <div flex=\"20\" layout=\"row\" layout-align=\"space-between center\" layout-padding>\n                    <span>Monday 1st March</span>\n                    <md-button class=\"md-icon-button\" aria-label=\"call\">\n                        <md-icon md-font-icon=\"zmdi zmdi-phone\"></md-icon>\n                    </md-button>\n                </div>\n            </tri-widget>\n            <tri-widget palette-background=\"purple:300\" content-layout=\"column\" content-layout-align=\"space-between\">\n                <h2 class=\"md-display-2 font-weight-100 margin-0\" flex layout-padding>Clean Desk</h2>\n                <md-divider></md-divider>\n                <div flex=\"20\" layout=\"row\" layout-align=\"space-between center\" layout-padding>\n                    <span>Tuesday 2st March</span>\n                    <md-button class=\"md-icon-button\" aria-label=\"clean\">\n                        <md-icon md-font-icon=\"zmdi zmdi-calendar\"></md-icon>\n                    </md-button>\n                </div>\n            </tri-widget>\n        </div>\n        <tri-widget todo-widget class=\"dashboard-todo-widget\" palette-background=\"light-blue:600\" title=\"Todo List\" subtitle=\"Your current todo list\" title-position=\"top\" content-layout-align=\"space-between\">\n            <md-list flex class=\"padding-left-0\">\n                <md-list-item ng-repeat=\"todo in todos\">\n                    <md-checkbox ng-model=\"todo.done\"></md-checkbox>\n                    <p>{{todo.name}}</p>\n                </md-list-item>\n            </md-list>\n        </tri-widget>\n    </div>\n\n    <div layout=\"row\" layout-xs=\"column\" layout-margin>\n       <tri-widget flex weather-widget=\"Sitia\" background-image=\"assets/images/dashboards/weather.jpg\" palette-background=\"deep-orange:800\" content-layout=\"column\" content-layout-align=\"space-between\">\n            <div layout=\"column\" flex layout-align=\"start center\">\n                <p class=\"md-caption\">{{weather.date | amDateFormat:\'dddd, MMMM Do YYYY\'}}</p>\n                <h1 class=\"font-size-14 margin-top-80 margin-bottom-80 font-weight-100\">\n                    {{::weather.temp}}&deg;\n                </h1>\n            </div>\n            <div layout=\"column\" class=\"full-width overlay-gradient-40\">\n                <md-divider></md-divider>\n                <div flex layout=\"row\" layout-margin layout-align=\"space-between center\" class=\"padding-30\">\n                    <i class=\"wi font-size-2\" ng-class=\"weather.iconClass\"></i>\n                    <p class=\"margin-0\">{{::weather.text}}</p>\n                    <p class=\"margin-0\">{{::weather.location}}</p>\n                </div>\n            </div>\n        </tri-widget>\n\n        <tri-widget chat-widget flex class=\"widget-chat\" title=\"Chat\" content-layout=\"column\" content-layout-align=\"space-between\">\n            <md-divider></md-divider>\n            <md-list class=\"padding-top-20 padding-bottom-0\" flex>\n                <md-list-item ng-repeat=\"chat in ::conversation\" class=\"md-3-line\" ng-class=\"userClass($even)\" ng-init=\"userColor = $even ? \'cyan\' : \'light-green\'\">\n                    <img class=\"md-avatar\" ng-src=\"{{::chat.image}}\" alt=\"{{::chat.name}}\">\n                    <div class=\"md-list-item-text\">\n                        <p palette-background=\"{{::userColor}}:200\" ng-repeat=\"message in ::chat.messages\">\n                           {{::message}}\n                        </p>\n                    </div>\n                </md-list-item>\n            </md-list>\n            <div layout=\"row\" layout-align=\"space-between center\">\n                <md-input-container flex class=\"margin-left-20 margin-right-20\">\n                    <label>Message</label>\n                    <input type=\"text\">\n                </md-input-container>\n            </div>\n        </tri-widget>\n    </div>\n    <div layout=\"row\" layout-xs=\"column\" layout-margin ng-cloak layout-fill>\n        <div layout-fill flex=\"40\" flex-xs=\"100\">\n            <div layout-margin flex>\n                <tri-widget class=\"widget-blog\">\n                    <img src=\"assets/images/backgrounds/material-backgrounds/mb-bg-01.jpg\" alt=\"some bg\">\n                    <div class=\"widget-blog-text padding-10\" ng-cloak>\n                        <h2>It\'s all about Material</h2>\n                        <p>We challenged ourselves to create a visual language for our users that synthesizes the classic principles of good design with the innovation and possibility of technology and science. This is material design.</p>\n                        <md-fab-speed-dial md-direction=\"up\" class=\"md-fling\">\n                            <md-fab-trigger>\n                                <md-button aria-label=\"share this post\" class=\"md-fab md-warn\">\n                                    <md-icon md-font-icon=\"zmdi zmdi-share\"></md-icon>\n                                </md-button>\n                            </md-fab-trigger>\n                            <md-fab-actions>\n                                <md-button aria-label=\"twitter\" class=\"md-fab md-raised md-mini\" ng-click=\"share(\'Shared on Twitter\', $event)\">\n                                    <md-icon md-font-icon=\"fa fa-twitter\"></md-icon>\n                                </md-button>\n                                <md-button aria-label=\"facebook\" class=\"md-fab md-raised md-mini\" ng-click=\"share(\'Shared on Facebook\', $event)\">\n                                    <md-icon md-font-icon=\"fa fa-facebook\"></md-icon>\n                                </md-button>\n                                <md-button aria-label=\"google-plus\" class=\"md-fab md-raised md-mini\" ng-click=\"share(\'Shared on Google+\', $event)\">\n                                    <md-icon md-font-icon=\"fa fa-google-plus\"></md-icon>\n                                </md-button>\n                            </md-fab-actions>\n                        </md-fab-speed-dial>\n                    </div>\n                </tri-widget>\n            </div>\n            <div class=\"clear\"></div>\n            <div layout-margin flex>\n                <tri-widget title=\"Color palette\" subtitle=\"Color in material design is inspired by bold hues and bright highlights. \"  palette-background=\"deep-orange:800\" background-image=\"assets/images/backgrounds/material-backgrounds/mb-bg-05.jpg\" overlay-title title-position=\"bottom\" >\n                </tri-widget>\n            </div>\n        </div>\n\n        <div flex layout=\"column\" layout-margin>\n            <div layout-margin>\n            <tri-widget palette-background=\"triCyan:500\" twitter-widget>\n                <div layout=\"row\" layout-align=\"space-between center\" class=\"padding-normal\">\n                    <i class=\"fa fa-twitter font-size-4 opacity-50\"></i>\n                    <h3 flex hide-xs class=\"md-subhead\">Oxygenna\'s feed</h3>\n                    <div class=\"widget-buttons\">\n                        <md-button class=\"md-icon-button\" ng-click=\"prevTweet()\" aria-label=\"previous tweet\">\n                            <md-icon md-font-icon=\"zmdi zmdi-chevron-left\"></md-icon>\n                        </md-button>\n                        <md-button class=\"md-icon-button\" ng-click=\"nextTweet()\" aria-label=\"next tweet\">\n                            <md-icon md-font-icon=\"zmdi zmdi-chevron-right\"></md-icon>\n                        </md-button>\n                    </div>\n                </div>\n                <div layout=\"column\" class=\"padding-top-0 padding-left-40 padding-right-40 padding-bottom-40\">\n                    <md-tabs md-selected=\"selectedTab\" class=\"dashboard-no-bar-tabs text-center\" md-no-pagination md-no-bar md-dynamic-height>\n                        <md-tab ng-repeat=\"tweet in ::tweets\" label=\"tweet.id\">\n                            <div ng-bind=\"tweet.body\" linkify=\"twitter\" class=\"font-weight-300 font-size-2 font-style-italic line-height-big\"></div>\n                        </md-tab>\n                    </md-tabs>\n                </div>\n            </tri-widget>\n            </div>\n            <div layout=\"row\" layout-margin>\n                 <tri-widget flex=\"50\" title=\"Contacts\" contacts-widget content-layout=\"row\">\n                    <md-list flex>\n                        <md-list-item ng-repeat=\"contact in ::contacts\">\n                            <img class=\"md-avatar\" ng-src=\"{{::contact.image}}\" alt=\"{{::contact.name}}\">\n                            <p>{{::contact.name}}</p>\n                            <md-icon md-font-icon=\"zmdi zmdi-chat\" class=\"md-primary\"></md-icon>\n                            <md-divider ng-hide=\"$last\"></md-divider>\n                        </md-list-item>\n                    </md-list>\n                </tri-widget>\n                <tri-widget palette-background=\"deep-orange:600\">\n                    <img class=\"full-width\" src=\"assets/images/avatars/avatar-big.png\" alt=\"my face\">\n\n                    <div>\n                        <md-divider></md-divider>\n                        <h2 class=\"opacity-90 margin-10 text-center\">\n                            About me\n                        </h2>\n                        <p class=\"md-body-2 opacity-80 padding-normal padding-top-0 text-center\">\n                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi voluptatibus.\n                        </p>\n                    </div>\n                </tri-widget>\n            </div>\n        </div>\n    </div>\n</div>\n");
$templateCache.put("app/examples/dashboards/sales/dashboard-sales.tmpl.html","<div class=\"sales-dashboard\">\n    <tri-widget title=\"Sales\" subtitle=\"{{vm.dateRange.start | amDateFormat:\'MMMM Do YYYY\'}} - {{vm.dateRange.end | amDateFormat:\'MMMM Do YYYY\'}}\" palette-background=\"triCyan:800\" class=\"padding-left-40 padding-right-40 padding-top-20 padding-bottom-20 no-shadow\">\n        <canvas height=\"300\" class=\"chart-line\" chart-data=\"vm.chartLineData.data\" chart-labels=\"vm.chartLineData.labels\" chart-series=\"vm.chartLineData.series\" chart-options=\"vm.chartLineData.options\" chart-colours=\"vm.chartLineData.colors\"></canvas>\n    </tri-widget>\n\n    <div layout=\"row\" layout-xs=\"column\" layout-margin dragula=\'\"drag-analytics-container\"\'>\n        <tri-widget palette-background=\"triCyan:600\" content-layout=\"column\" content-layout-align=\"space-between center\" content-padding>\n            <p class=\"md-display-2 font-weight-100 margin-top-10 margin-bottom-0\" countupto=\"vm.salesData.totalSales\" duration=\"1.5\" decimals=\"0\"></p>\n            <p class=\"md-body-2 opacity-60 margin-top-0 margin-bottom-10\" translate>Total Sales</p>\n        </tri-widget>\n        <tri-widget palette-background=\"triCyan:600\" content-layout=\"column\" content-layout-align=\"space-between center\" content-padding>\n            <p class=\"md-display-2 font-weight-100 margin-top-10 margin-bottom-0\" countupto=\"vm.salesData.totalEarnings\" duration=\"1.5\" options=\"{ prefix: \'$\' }\" decimals=\"2\"></p>\n            <p class=\"md-body-2 opacity-60 margin-top-0 margin-bottom-10\" translate>Total Earnings</p>\n        </tri-widget>\n        <tri-widget palette-background=\"triCyan:600\" content-layout=\"column\" content-layout-align=\"space-between center\" content-padding>\n            <p class=\"md-display-2 font-weight-100 margin-top-10 margin-bottom-0\" countupto=\"971315.53\" duration=\"1.5\" options=\"{ prefix: \'$\' }\" decimals=\"2\"></p>\n            <p class=\"md-body-2 opacity-60 margin-top-0 margin-bottom-10\" translate>All Time Earnings</p>\n        </tri-widget>\n    </div>\n\n    <div layout=\"row\" layout-xs=\"column\" layout-margin>\n        <tri-widget flex title=\"Orders\" content-layout=\"column\" content-layout-align=\"center\">\n            <md-table-container>\n                <table md-table class=\"md-data-table\">\n                    <thead md-head md-order=\"vm.query.order\" md-on-reorder=\"vm.getUsers\">\n                        <tr md-row>\n                            <th md-column md-order-by=\"date\" decend-first>Date</th>\n                            <th md-column md-order-by=\"buyer\">Buyer</th>\n                            <th md-column md-numeric md-order-by=\"items.length\">Items</th>\n                            <th md-column md-order-by=\"status\">Status</th>\n                            <th md-column md-numeric md-order-by=\"total\">Total</th>\n                            <th md-column>Details</th>\n                        </tr>\n                    </thead>\n                    <tbody md-body>\n                        <tr md-row ng-repeat=\"order in vm.salesData.orders | orderBy: vm.query.order | limitTo: vm.query.limit : (vm.query.page -1) * vm.query.limit\">\n                            <td md-cell>{{::order.date | amDateFormat:\'MMMM Do YYYY, h:mm:ss a\'}}</td>\n                            <td md-cell>{{::order.buyer}}</td>\n                            <td md-cell>{{::order.items.length}}</td>\n                            <td md-cell>\n                                <span class=\"status\" ng-class=\"\'status-\' + order.status\">\n                                    {{::order.status}}\n                                </span>\n                            </td>\n                            <td md-cell>{{::order.total | currency}}</td>\n                            <td md-cell>\n                                <md-button ng-click=\"vm.openOrder(order, $event)\" class=\"md-icon-button\" aria-label=\"Open Order\">\n                                    <md-icon md-font-icon=\"zmdi zmdi-search\"></md-icon>\n                                </md-button>\n                            </td>\n                        </tr>\n                    </tbody>\n                </table>\n            </md-table-container>\n            <md-table-pagination md-limit=\"vm.query.limit\" md-page=\"vm.query.page\" md-total=\"{{vm.salesData.orders.length}}\" md-page-select></md-table-pagination>\n        </tri-widget>\n    </div>\n\n    <div layout=\"row\" layout-xs=\"column\" layout-margin>\n        <tri-widget flex flex-xs=\"100\" title=\"Order Status\" content-padding>\n            <canvas class=\"chart-doughnut\" chart-data=\"vm.chartPieData.data\" chart-legend=\"true\" chart-labels=\"vm.chartPieData.labels\"></canvas>\n        </tri-widget>\n        <tri-widget flex flex-xs=\"100\" title=\"Top Product Categories\" content-padding>\n            <canvas class=\"chart-bar\" chart-data=\"vm.chartBarData.data\" chart-labels=\"vm.chartBarData.labels\" chart-legend=\"true\" chart-options=\"vm.chartBarData.options\" chart-colours=\"vm.chartBarData.colours\" chart-series=\"vm.chartBarData.series\"></canvas>\n        </tri-widget>\n    </div>\n</div>\n");
$templateCache.put("app/examples/dashboards/sales/date-change-dialog.tmpl.html","<md-dialog flex=\"60\" flex-xs=\"100\">\n    <md-toolbar class=\"toolbar-default\">\n        <div class=\"md-toolbar-tools\">\n            <h2 flex translate>Select a date range</h2>\n            <md-button class=\"md-icon-button\" ng-click=\"vm.cancelClick()\" aria-label=\"cancel\">\n                <md-icon md-font-icon=\"zmdi zmdi-close\"></md-icon>\n            </md-button>\n        </div>\n    </md-toolbar>\n\n    <md-dialog-content class=\"md-dialog-content\">\n        <div layout=\"row\" layout-padding>\n            <div flex layout=\"column\" layout-align=\"center center\">\n                <h2 translate>Start Date</h2>\n                <md-datepicker ng-model=\"vm.start\" md-placeholder=\"\'Start Date\' | triTranslate\"></md-datepicker>\n            </div>\n            <div layout=\"column\" layout-align=\"center center\">\n                <md-icon style=\"font-size:2.4em\" md-font-icon=\"zmdi zmdi-long-arrow-right\"></md-icon>\n            </div>\n            <div flex layout=\"column\" layout-align=\"center center\">\n                <h2 translate>End Date</h2>\n                <md-datepicker ng-model=\"vm.end\" md-placeholder=\"\'End Date\' | triTranslate\"></md-datepicker>\n            </div>\n        </div>\n    </md-dialog-content>\n\n    <md-dialog-actions layout=\"row\">\n        <span flex></span>\n        <md-button ng-click=\"vm.cancelClick()\" aria-label=\"{{\'Cancel\' | triTranslate}}\" translate=\"Cancel\"></md-button>\n        <md-button ng-click=\"vm.okClick()\" class=\"md-primary\" aria-label=\"{{Ok | triTranslate}}\" translate=\"Ok\"></md-button>\n    </md-dialog-actions>\n</md-dialog>");
$templateCache.put("app/examples/dashboards/sales/fab-button.tmpl.html","<md-button ng-click=\"vm.changeDate($event)\" class=\"md-fab md-accent md-fab-bottom-right\" aria-label=\"change date\">\n    <md-icon md-font-icon=\"zmdi zmdi-calendar-alt\"></md-icon>\n</md-button>\n");
$templateCache.put("app/examples/dashboards/sales/order-dialog.tmpl.html","<md-dialog class=\"order-dialog mobile-fullwidth-dialog\" flex=\"60\" flex-xs=\"100\">\n    <md-toolbar>\n        <div class=\"md-toolbar-tools\">\n            <h2 flex >\n                <span translate>Order #</span><span>{{vm.order.id}}</span>\n            </h2>\n            <md-button class=\"md-icon-button\" ng-click=\"vm.printClick()\" aria-label=\"print\">\n                <md-icon md-font-icon=\"zmdi zmdi-print\"></md-icon>\n            </md-button>\n            <md-button class=\"md-icon-button\" ng-click=\"vm.cancelClick()\" aria-label=\"cancel\">\n                <md-icon md-font-icon=\"zmdi zmdi-close\"></md-icon>\n            </md-button>\n        </div>\n    </md-toolbar>\n\n    <md-dialog-content class=\"md-dialog-content\">\n        <div flex layout=\"row\" class=\"margin-bottom-10\">\n            <div flex>\n                <strong translate>Order Date</strong>\n            </div>\n            <div flex>\n                <span>{{vm.order.date | amDateFormat:\'MMMM Do YYYY, h:mm:ss a\'}}</span>\n            </div>\n        </div>\n        <div flex layout=\"row\" class=\"margin-bottom-10\">\n            <div flex>\n                <strong translate>Customer Name</strong>\n            </div>\n            <div flex>\n                <span>{{vm.order.name}}</span>\n            </div>\n        </div>\n        <div flex layout=\"row\" class=\"margin-bottom-10\">\n            <div flex>\n                <strong translate>Customer Email</strong>\n            </div>\n            <div flex>\n                <span>{{vm.order.buyer}}</span>\n            </div>\n        </div>\n        <div flex layout=\"row\" class=\"margin-bottom-10\">\n            <div flex>\n                <strong translate>Number of Items</strong>\n            </div>\n            <div flex>\n                <span>{{vm.order.items.length}}</span>\n            </div>\n        </div>\n\n        <md-divider class=\"margin-bottom-40 margin-top-40\"></md-divider>\n\n        <table class=\"order-dialog-product-table md-table\">\n            <thead>\n                <tr>\n                    <th translate>Product Description</th>\n                    <th translate>Category</th>\n                    <th class=\"text-right\" translate>Price</th>\n                </tr>\n            </thead>\n            <tbody>\n                <tr ng-repeat=\"item in vm.order.items\">\n                    <td>{{item.name}}</td>\n                    <td>{{item.category}}</td>\n                    <td class=\"text-right padding-right-10\">{{item.price | currency}}</td>\n                </tr>\n                <tr>\n                    <td colspan=\"2\" class=\"font-weight-600\" translate>Sub Total</td>\n                    <td class=\"text-right font-weight-600 padding-right-10\">{{vm.order.subTotal | currency}}</td>\n                </tr>\n                <tr>\n                    <td colspan=\"2\" class=\"font-weight-600\" translate>Tax</td>\n                    <td class=\"text-right font-weight-600 padding-right-10\">{{vm.order.tax | currency}}</td>\n                </tr>\n                <tr>\n                    <td colspan=\"2\" class=\"font-weight-600\" translate>Total</td>\n                    <td class=\"text-right font-weight-600 padding-right-10\">{{vm.order.total | currency}}</td>\n                </tr>\n            </tbody>\n        </table>\n    </md-dialog-content>\n\n    <md-dialog-actions layout=\"row\">\n        <span flex></span>\n        <md-button ng-click=\"vm.okClick()\" class=\"md-primary\" aria-label=\"{{Ok | triTranslate}}\" translate=\"Ok\"></md-button>\n    </md-dialog-actions>\n</md-dialog>");
$templateCache.put("app/examples/dashboards/server/dashboard-server.tmpl.html","<div class=\"dashboard-container overlay-10 padded-content-page\" layout=\"column\">\n    <div layout=\"row\" layout-sm=\"column\" layout-margin>\n        <tri-widget flex=\"70\" flex-sm=\"100\" server-widget>\n            <md-tabs layout-fill flex md-dynamic-height md-no-disconnect md-stretch-tabs=\"always\" md-no-pagination>\n                <md-tab label=\"{{\'Real Time\' | triTranslate}}\">\n                    <md-content class=\"md-padding\">\n                        <h1 class=\"md-headline\"><span translate>Bandwidth</span> <span class=\"md-caption\">(Mbps)</span></h1>\n                        <canvas flex class=\"chart-line\" chart-data=\"serverCharts.bandwidth.data\" chart-labels=\"serverCharts.bandwidth.labels\" chart-legend=\"false\" chart-options=\"serverCharts.bandwidth.options\" chart-colours=\"serverCharts.bandwidth.colours\"></canvas>\n                        <h1 class=\"md-headline\"><span translate>CPU</span> <span class=\"md-caption\">(%)</span></h1>\n                        <canvas flex class=\"chart-line\" chart-data=\"serverCharts.cpu.data\" chart-labels=\"serverCharts.cpu.labels\" chart-legend=\"false\" chart-options=\"serverCharts.cpu.options\" chart-colours=\"serverCharts.cpu.colours\"></canvas>\n                    </md-content>\n                </md-tab>\n                <md-tab label=\"{{\'24 Hours\' | triTranslate}}\">\n                    <md-content class=\"md-padding\">\n                        <canvas flex class=\"chart-bar\" chart-data=\"serverCharts.data24hrs.data\" chart-labels=\"serverCharts.data24hrs.labels\" chart-legend=\"true\" chart-options=\"serverCharts.data24hrs.options\" chart-series=\"serverCharts.data24hrs.series\"></canvas>\n                    </md-content>\n                </md-tab>\n                <md-tab label=\"{{\'7 Days\' | triTranslate}}\">\n                    <md-content class=\"md-padding\">\n                        <canvas flex class=\"chart-bar\" chart-data=\"serverCharts.data7days.data\" chart-labels=\"serverCharts.data7days.labels\" chart-legend=\"true\" chart-options=\"serverCharts.data7days.options\" chart-series=\"serverCharts.data7days.series\"></canvas>\n                    </md-content>\n                </md-tab>\n                <md-tab label=\"{{\'365 Days\' | triTranslate}}\">\n                    <md-content class=\"md-padding\">\n                        <canvas flex class=\"chart-bar\" chart-data=\"serverCharts.data365days.data\" chart-labels=\"serverCharts.data365days.labels\" chart-legend=\"true\" chart-options=\"serverCharts.data365days.options\" chart-series=\"serverCharts.data365days.series\"></canvas>\n                    </md-content>\n                </md-tab>\n            </md-tabs>\n        </tri-widget>\n        <div flex=\"30\" flex-sm=\"100\" class=\"drag-container\" layout=\"column\" layout-margin dragula=\'\"drag-server-container\"\'>\n            <tri-widget palette-background=\"triCyan:500\" background=\"primary\" content-layout=\"row\" content-layout-align=\"space-between center\" content-padding>\n                <div class=\"show-gt-md\">\n                    <md-icon class=\"font-size-5 opacity-50\" md-font-icon=\"zmdi zmdi-gps-dot\"></md-icon>\n                </div>\n                <div layout=\"column\" layout-align=\"center end\">\n                    <p class=\"md-display-1 font-weight-100 margin-top-0 margin-bottom-0 text-ellipsis\">192.168.1.1</p>\n                    <p class=\"md-body-2 opacity-60 margin-top-0 margin-bottom-0\" translate>IP Address</p>\n                </div>\n            </tri-widget>\n            <tri-widget palette-background=\"triCyan:600\" background=\"primary\" content-layout=\"row\" content-layout-align=\"space-between center\" content-padding>\n                <div>\n                    <md-icon class=\"font-size-5 opacity-50\" md-font-icon=\"zmdi zmdi-memory\"></md-icon>\n                </div>\n                <div layout=\"column\" layout-align=\"center end\">\n                    <p class=\"md-display-1 font-weight-100 margin-top-0 margin-bottom-0 text-ellipsis\" countupto=\"2\" decimals=\"0\" options=\"{suffix: \'Gb\'}\"></p>\n                    <p class=\"md-body-2 opacity-60 margin-top-0 margin-bottom-0\" translate>Memory</p>\n                </div>\n            </tri-widget>\n            <tri-widget palette-background=\"triCyan:700\" background=\"primary\" content-layout=\"row\" content-layout-align=\"space-between center\" content-padding>\n                <div>\n                    <md-icon class=\"font-size-5 opacity-50\" md-font-icon=\"zmdi zmdi-storage\"></md-icon>\n                </div>\n                <div layout=\"column\" layout-align=\"center end\">\n                    <p class=\"md-display-1 font-weight-100 margin-top-0 margin-bottom-0\" countupto=\"30\" decimals=\"0\" options=\"{suffix: \'Gb\'}\"></p>\n                    <p class=\"md-body-2 opacity-60 margin-top-0 margin-bottom-0\" translate>Disk</p>\n                </div>\n            </tri-widget>\n            <tri-widget palette-background=\"triCyan:800\" background=\"primary\" content-layout=\"row\" content-layout-align=\"space-between center\" content-padding>\n                <div>\n                    <md-icon class=\"font-size-5 opacity-50\" md-font-icon=\"zmdi zmdi-pin\"></md-icon>\n                </div>\n                <div layout=\"column\" layout-align=\"center end\">\n                    <p class=\"md-display-1 font-weight-100 margin-top-0 margin-bottom-0\">London</p>\n                    <p class=\"md-body-2 opacity-60 margin-top-0 margin-bottom-0\" translate>Location</p>\n                </div>\n            </tri-widget>\n        </div>\n    </div>\n    <div layout=\"row\" layout-xs=\"column\" layout-margin>\n        <tri-widget flex flex=\"50\" flex-xs=\"100\" title=\"DiskS\">\n            <md-divider></md-divider>\n            <md-list>\n                <md-list-item ng-repeat=\"disk in ::vm.disks\">\n                    <md-icon md-font-icon=\"{{::disk.icon}}\" class=\"md-primary\"></md-icon>\n                    <p>{{::disk.name}}</p>\n                    <md-switch class=\"md-secondary\" ng-model=\"disk.enabled\"></md-switch>\n                    <md-divider ng-hide=\"::$last\"></md-divider>\n                </md-list-item>\n            </md-list>\n        </tri-widget>\n        <tri-widget flex flex=\"50\" flex-xs=\"100\" title=\"Host Job Queue\">\n            <md-divider></md-divider>\n            <md-list>\n                <md-list-item class=\"md-2-line\" ng-repeat=\"job in ::vm.jobs\">\n                    <div class=\"md-list-item-text\">\n                        <h3>{{::job.job}}</h3>\n                        <p>{{::job.time}}</p>\n                    </div>\n                    <md-icon class=\"md-secondary\" md-font-icon=\"zmdi zmdi-check alert-success\" ng-show=\"::job.complete\"></md-icon>\n                    <md-icon class=\"md-secondary\" md-font-icon=\"zmdi zmdi-close alert-error\" ng-hide=\"::job.complete\"></md-icon>\n                    <md-divider ng-hide=\"$last\"></md-divider>\n                </md-list-item>\n            </md-list>\n        </tri-widget>\n\n    </div>\n\n    <div layout=\"row\" layout-xs=\"column\" layout-margin>\n        <tri-widget chartjs-pie-widget flex flex=\"40\" flex-md=\"40\" flex-xs=\"100\" title=\"Disk Usage\" subtitle=\"11/03/15 - 11/4/15\" content-padding>\n            <div flex>\n                <canvas class=\"chart-doughnut full-width\" chart-data=\"vm.serverChart.data\" chart-legend=\"true\" chart-labels=\"vm.serverChart.labels\"></canvas>\n            </div>\n        </tri-widget>\n        <tri-widget flex-xs=\"100\" title=\"Monthly Usage\" palette-background=\"triCyan:600\">\n            <md-divider></md-divider>\n            <div class=\"full-width\" layout=\"row\" layout-padding>\n                <h4 flex=\"20\" class=\"opacity-80 margin-0 margin-right-20\" translate>Disk</h4>\n                <div flex>\n                    <md-progress-linear class=\"md-warn margin-bottom-10\" md-mode=\"determinate\" value=\"60\"></md-progress-linear>\n                    <span class=\"md-caption\">(60% <span translate>of monthly limit</span>)</span>\n                </div>\n            </div>\n            <md-divider flex></md-divider>\n            <div class=\"full-width\" layout=\"row\" layout-padding>\n                <h4 flex=\"20\" class=\"opacity-80 margin-0 margin-right-20\" translate>Bandwidth</h4>\n                <div flex>\n                    <md-progress-linear class=\"md-accent margin-bottom-10\" md-mode=\"determinate\" value=\"30\"></md-progress-linear>\n                    <span class=\"md-caption\">(30% <span translate>of monthly limit</span>)</span>\n                </div>\n            </div>\n            <md-divider flex></md-divider>\n            <div class=\"full-width\" layout=\"row\" layout-padding>\n                <h4 flex=\"20\" class=\"opacity-80 margin-0 margin-right-20\" translate>Monthly Usage</h4>\n                <div flex>\n                    <md-progress-linear class=\"md-warn margin-bottom-10\" md-mode=\"determinate\" value=\"83\"></md-progress-linear>\n                    <span class=\"md-caption\">(83% <span translate>of monthly limit</span>)</span>\n                </div>\n            </div>\n            <md-divider flex></md-divider>\n            <div class=\"full-width\" layout=\"row\" layout-padding>\n                <h4 flex=\"20\" class=\"opacity-80 margin-0 margin-right-20\" translate>Memory</h4>\n                <div flex>\n                    <md-progress-linear class=\"md-accent margin-bottom-10\" md-mode=\"determinate\" value=\"65\"></md-progress-linear>\n                    <span class=\"md-caption\">(65% <span translate>of monthly limit</span>)</span>\n                </div>\n            </div>\n        </tri-widget>\n    </div>\n</div>\n");
$templateCache.put("app/examples/dashboards/social/dashboard-social.tmpl.html","<div class=\"dashboard-social-header padding-20 padding-top-100 overlay-gradient-30\" layout=\"row\" layout-align=\"start center\" style=\"background: url(assets/images/backgrounds/material-backgrounds/mb-bg-02.jpg) no-repeat; background-size: cover;\">\n    <div class=\"margin-right-20\">\n        <img src=\"assets/images/avatars/avatar-5.png\" alt=\"girl-avatar\" class=\"make-round\" width=\"100\"/>\n    </div>\n    <div class=\"text-light\">\n        <h3 class=\"font-weight-600 margin-bottom-0 text-light\">Christos Varoufakis</h3>\n        <p class=\"font-weight-300 margin-top-0 margin-bottom-0\">Web Designer, Eroticist and Spy</p>\n        <p class=\"margin-top-0\"><md-icon md-font-icon=\"zmdi zmdi-pin color-inherit\"></md-icon> Athens, Greece</p>\n     </div>\n</div>\n<md-tabs md-dynamic-height md-border-bottom class=\"tabs-tall\">\n    <md-tab>\n        <md-tab-label layout=\"column\">\n            <span>Tweets</span>\n            <span class=\"display-block\">11.4K</span>\n        </md-tab-label>\n        <md-tab-body>\n            <div layout=\"row\" layout-xs=\"column\">\n                <tri-widget layout-margin flex=\"50\" flex-xs=\"100\" avatar=\"assets/images/avatars/avatar-5.png\" palette-background=\"blue:800\" title=\"Christos Varoufakis\" subtitle=\"@christos - 11h\" title-position=\"top\" content-layout-align=\"start center\" content-layout=\"column\">\n                    <div linkify=\"twitter\" class=\"font-weight-300 md-headline font-style-italic line-height-big margin-bottom-20 padding-normal\" >\n                        Don\'t miss it! A Material Design Avatar set with 1440 avatars! http://sellfy.com/p/EUcC/ #avatars #materialdesign\n                    </div>\n                    <img src=\"assets/images/dashboards/tweet.jpg\" alt=\"some image\">\n                </tri-widget>\n                <div flex layout=\"column\">\n                    <tri-widget layout-margin flex palette-background=\"blue:500\" avatar=\"assets/images/avatars/avatar-2.png\" title=\"Kate Smith\" subtitle=\"@christos - 12h\" title-position=\"top\">\n                        <div linkify=\"twitter\" class=\"font-weight-300 md-title font-style-italic line-height-big padding-normal\">\n                            Got some awesome news! Triangular 1.1.2 our new #AngularJS admin template is out now!  FAB Speed Dial & FAB Toolbar added. Enjoy!\n                        </div>\n                    </tri-widget>\n                    <tri-widget layout-margin flex palette-background=\"light-blue:500\" avatar=\"assets/images/avatars/avatar-6.png\" title=\"Jane Smith\" subtitle=\"@christos - 14h\" title-position=\"top\">\n                        <div linkify=\"twitter\" class=\"font-weight-300 md-title font-style-italic line-height-big padding-normal\">\n                            Don\'t miss our latest Angular Material Design Admin Template: http://goo.gl/0Yxm1U  #angularJS #material #webdesign\n                        </div>\n                    </tri-widget>\n                    <tri-widget layout-margin flex palette-background=\"triCyan:500\" avatar=\"assets/images/avatars/avatar-5.png\" title=\"Christos Varoufakis\" subtitle=\"@christos - 16h\" title-position=\"top\">\n                        <div linkify=\"twitter\" class=\"font-weight-300 md-title font-style-italic line-height-big padding-normal\">\n                            New Freebie! Material Design Image fonts! In high res png\'s http://goo.gl/j1fWZz  #MaterialDesign #webdesign\n                        </div>\n                    </tri-widget>\n                </div>\n            </div>\n            <div layout=\"row\" layout-xs=\"column\">\n                <tri-widget layout-margin flex palette-background=\"indigo:500\" avatar=\"assets/images/avatars/avatar-1.png\" title=\"Manos Proistakis\" subtitle=\"@christos - 16h\" title-position=\"top\">\n                    <div linkify=\"twitter\" class=\"font-weight-300 md-title font-style-italic line-height-big padding-normal\">\n                        Don\'t miss our latest Angular Material Design Admin Template: http://goo.gl/0Yxm1U  #angularJS #material #webdesign\n                    </div>\n                </tri-widget>\n                <tri-widget layout-margin flex palette-background=\"deep-purple:500\" avatar=\"assets/images/avatars/avatar-4.png\" title=\"Despoina\" subtitle=\"@christos - 16h\" title-position=\"top\">\n                    <div linkify=\"twitter\" class=\"font-weight-300 md-title font-style-italic line-height-big padding-normal\">\n                        New Freebie! Material Design Image fonts! In high res png\'s http://goo.gl/j1fWZz  #MaterialDesign #webdesign\n                    </div>\n                </tri-widget>\n                <tri-widget layout-margin flex palette-background=\"purple:500\" avatar=\"assets/images/avatars/avatar-1.png\" title=\"Manos Proistakis\" subtitle=\"@christos - 16h\" title-position=\"top\">\n                    <div linkify=\"twitter\" class=\"font-weight-300 md-title font-style-italic line-height-big padding-normal\">\n                        Triangular 1.1.2 our new #AngularJS admin template is out now!  FAB Speed Dial & FAB Toolbar added. Enjoy!\n                    </div>\n                </tri-widget>\n            </div>\n        </md-tab-body>\n    </md-tab>\n    <md-tab>\n        <md-tab-label layout=\"column\">\n            <span>Following</span>\n            <span class=\"display-block\">3,220</span>\n        </md-tab-label>\n        <md-tab-body>\n            <div layout=\"row\" layout-xs=\"column\" layout-margin>\n                <tri-widget class=\"widget-follower\" flex content-layout=\"column\" content-layout-align=\"center start\">\n                    <div class=\"widget-follower-header\">\n                        <img src=\"assets/images/backgrounds/material-backgrounds/mb-bg-26.jpg\" alt=\"some bg\" class=\"display-block\">\n                        <img src=\"assets/images/avatars/avatar-2.png\" class=\"widget-follower-header-avatar\"/>\n                    </div>\n                    <div class=\"widget-follower-text padding-10\">\n                        <h4 class=\"md-title margin-0\">Morris Onions</h4>\n                        <p class=\"md-caption margin-0\">@morris</p>\n                        <p class=\"md-body-1\">Senior Software Test Engineer at Progressive, Indie Game Developer, Cleveland Game Devs member, a cyberpunk before it was cool & a geek Dad.</p>\n                    </div>\n                </tri-widget>\n                <tri-widget class=\"widget-follower\" flex content-layout=\"column\" content-layout-align=\"center start\">\n                    <div class=\"widget-follower-header\">\n                        <img src=\"assets/images/backgrounds/material-backgrounds/mb-bg-12.jpg\" alt=\"some bg\" class=\"display-block\">\n                        <img src=\"assets/images/avatars/avatar-6.png\" class=\"widget-follower-header-avatar\"/>\n                    </div>\n                    <div class=\"widget-follower-text padding-10\">\n                        <h4 class=\"md-title margin-0\">Sam Cook</h4>\n                        <p class=\"md-caption margin-0\">@scook</p>\n                        <p class=\"md-body-1\">Intermediary acquisition customer-facing return on investment customer-facing conscientious outsourcing incrementally increasing sales experienced and confident.</p>\n                    </div>\n                </tri-widget>\n                <tri-widget class=\"widget-follower\" flex content-layout=\"column\" content-layout-align=\"center start\">\n                    <div class=\"widget-follower-header\">\n                        <img src=\"assets/images/backgrounds/material-backgrounds/mb-bg-30.jpg\" alt=\"some bg\" class=\"display-block\">\n                        <img src=\"assets/images/avatars/avatar-5.png\" class=\"widget-follower-header-avatar\"/>\n                    </div>\n                    <div class=\"widget-follower-text padding-10\">\n                        <h4 class=\"md-title margin-0\">Manos proistakis</h4>\n                        <p class=\"md-caption margin-0\">@proistak</p>\n                        <p class=\"md-body-1\">Recruiting key personnel effective management and mentoring of the team acquiring new clients maximised returns in short time frame. </p>\n                    </div>\n                </tri-widget>\n            </div>\n            <div layout=\"row\" layout-xs=\"column\" layout-margin>\n                <tri-widget class=\"widget-follower\" flex content-layout=\"column\" content-layout-align=\"center start\">\n                    <div class=\"widget-follower-header\">\n                        <img src=\"assets/images/backgrounds/material-backgrounds/mb-bg-40.jpg\" alt=\"some bg\" class=\"display-block\">\n                        <img src=\"assets/images/avatars/avatar-6.png\" class=\"widget-follower-header-avatar\"/>\n                    </div>\n                    <div class=\"widget-follower-text padding-10\">\n                        <h4 class=\"md-title margin-0\">Jane Onions</h4>\n                        <p class=\"md-caption margin-0\">@morris</p>\n                        <p class=\"md-body-1\">Entrepreneurial, brand strategy key relationship management cross-functional; handling customer complaints. Preparing financial data going to the cinema dynamic self starter easy to work with. </p>\n                    </div>\n                </tri-widget>\n                <tri-widget class=\"widget-follower\" flex content-layout=\"column\" content-layout-align=\"center start\">\n                    <div class=\"widget-follower-header\">\n                        <img src=\"assets/images/backgrounds/material-backgrounds/mb-bg-07.jpg\" alt=\"some bg\" class=\"display-block\">\n                        <img src=\"assets/images/avatars/avatar-4.png\" class=\"widget-follower-header-avatar\"/>\n                    </div>\n                    <div class=\"widget-follower-text padding-10\">\n                        <h4 class=\"md-title margin-0\">Christine Jackson</h4>\n                        <p class=\"md-caption margin-0\">@scook</p>\n                        <p class=\"md-body-1\">Presenting to senior management streamlined operations outside the box. Incrementally increasing sales customer-centric, commercially minded increased revenue customer-facing.</p>\n                    </div>\n                </tri-widget>\n                <tri-widget class=\"widget-follower\" flex content-layout=\"column\" content-layout-align=\"center start\">\n                    <div class=\"widget-follower-header\">\n                        <img src=\"assets/images/backgrounds/material-backgrounds/mb-bg-18.jpg\" alt=\"some bg\" class=\"display-block\">\n                        <img src=\"assets/images/avatars/avatar-1.png\" class=\"widget-follower-header-avatar\"/>\n                    </div>\n                    <div class=\"widget-follower-text padding-10\">\n                        <h4 class=\"md-title margin-0\">John Langan</h4>\n                        <p class=\"md-caption margin-0\">@proistak</p>\n                        <p class=\"md-body-1\">Recruiting key personnel effective management and mentoring of the team acquiring new clients maximised returns in short time frame. </p>\n                    </div>\n                </tri-widget>\n            </div>\n        </md-tab-body>\n    </md-tab>\n    <md-tab>\n        <md-tab-label layout=\"column\">\n            <span>Favorites</span>\n            <span class=\"display-block\">578</span>\n        </md-tab-label>\n        <md-tab-body>\n            <div layout=\"row\" layout-xs=\"column\" layout-margin>\n                <tri-widget class=\"flex\" flex=\"70\" flex-xs=\"100\" title=\"Favorites\" content-layout=\"column\" content-layout-align=\"start center\">\n                    <md-divider></md-divider>\n                    <md-list>\n                        <md-list-item class=\"md-2-line\" ng-repeat=\"fave in ::vm.favorites\">\n                            <img ng-src=\"{{::fave.avatar}}\" class=\"md-avatar\"/>\n                            <div class=\"md-list-item-text\">\n                                <div layout=\"row\">\n                                    <span flex class=\"md-subhead text-dark\">\n                                        {{::fave.name}}\n                                        <span class=\"text-gray\">@{{::fave.user}}</span>\n                                    </span>\n                                    <span class=\"md-caption\" am-time-ago=\"fave.date\"></span>\n                                </div>\n                                <p linkify=\"twitter\">{{::fave.tweet}}</p>\n                            </div>\n                            <md-divider></md-divider>\n                        </md-list-item>\n                    </md-list>\n                </tri-widget>\n                <div flex layout=\"column\">\n                    <tri-widget flex class=\"margin-bottom-10\" title=\"Who to follow\" content-layout=\"column\" content-layout-align=\"space-around\" palette-background=\"triCyan:500\">\n                        <md-divider></md-divider>\n                        <md-list >\n                            <md-list-item class=\"md-2-line\" ng-repeat=\"follow in ::vm.whotofollow\">\n                                <img ng-src=\"{{::follow.avatar}}\" class=\"md-avatar\"/>\n                                <div class=\"md-list-item-text\">\n                                    <h3>{{::follow.name}}</h3>\n                                    <h4>@{{::follow.user}}</h4>\n                                    <md-icon md-font-icon=\"zmdi zmdi-account-add\" ng-click=\"doSecondaryAction($event)\" class=\"md-secondary md-hue-3\"></md-icon>\n                                </div>\n                                <md-divider ng-hide=\"::$last\"></md-divider>\n                            </md-list-item>\n                        </md-list>\n                    </tri-widget>\n                    <tri-widget flex title=\"Trends\" content-layout=\"column\" content-layout-align=\"center start\" palette-background=\"triCyan:500\">\n                        <md-divider></md-divider>\n                        <md-list>\n                            <md-list-item ng-repeat=\"trend in ::vm.trends\">\n                                <p linkify=\"twitter\">{{::trend}}</p>\n                                <md-divider ng-hide=\"::$last\"></md-divider>\n                            </md-list-item>\n                        </div>\n                    </tri-widget>\n                </div>\n            </div>\n        </md-tab-body>\n    </md-tab>\n</md-tabs>\n\n");
$templateCache.put("app/examples/dashboards/widgets/widget-load-data-dialog.tmpl.html","<md-dialog>\n    <md-toolbar md-theme=\"{{triSkin.elements.toolbar}}\">\n        <div class=\"md-toolbar-tools\">\n            <h2 flex>\n                <span translate>Full Data</span>\n            </h2>\n            <md-button class=\"md-icon-button\" aria-label=\"Settings\">\n                <md-icon md-font-icon=\"zmdi zmdi-close\" ng-click=\"closeDialog()\"></md-icon>\n            </md-button>\n        </div>\n    </md-toolbar>\n    <md-dialog-content class=\"md-dialog-content\">\n        <table class=\"table\">\n            <thead>\n                <tr>\n                    <th ng-repeat=\"header in data.header\">{{header}}</th>\n                </tr>\n            </thead>\n            <tbody>\n                <tr ng-repeat=\"referral in data.data\">\n                    <td ng-repeat=\"data in referral\">{{data}}</td>\n                </tr>\n            </tbody>\n        </table>\n    </md-dialog-content>\n</md-dialog>");
$templateCache.put("app/laboratory/pca/add_pca/add_pca.tmpl.html"," <div class=\"padded-content-page\">\n\n	<h2 class=\"md-display-1\">Add new <b> PCA </b></h2>\n\n        <tri-widget calendar-widget flex class=\"widget-calendar\" palette-background=\"amber:500\" content-layout=\"column\" content-layout-align=\"space-between\">\n           <div layout=\"row\" layout-align=\"space-between center\" class=\"padding-normal\" alt=\"product-avatar\">\n           	   <img ng-src=\"{{vm.ProductInfo.ImageBuffer}}\" id=\"productImage\" class=\"make-round\" width=\"100\"/> \n           	    <md-icon ng-show= \"vm.ProductInfo.ImageBuffer == \'\'\" md-font-icon=\"fa fa-camera-retro font-size-4 opacity-50\"></md-icon>      	  \n	         	<h1>{{vm.ProductInfo.Reference}}</h1>\n           </div>\n        </tri-widget>\n		<h2>Products Infos</h2>\n		<md-input-container class=\"md-block\">\n		    <label>Reference:</label>\n		    <input type=\"text\" ng-model=\"vm.ProductInfo.Reference\" >\n		</md-input-container>\n		<md-input-container class=\"md-block\">\n		    <label>Risk Analysis: MD xx xx xx</label>\n		    <input type=\"text\" ng-model=\"vm.ProductInfo.RiskAnalysis\" >\n		</md-input-container>\n		<md-input-container class=\"md-block\">\n		    <label>Product Designation</label>\n		    <input type=\"text\" ng-model=\"vm.ProductInfo.Designation\" >\n		</md-input-container>\n		<md-input-container class=\"md-block\">\n		    <label>Links Project</label>\n		    <input type=\"text\" ng-model=\"vm.ProductInfo.Links\" >\n		</md-input-container>\n	   <div layout=\"row\" layout-align=\"space-around center\">\n			 <input class=\"ng-hide\" id=\"input-image-id\" multiple type=\"file\" \n			     accept=\"image/jpeg,image/png\"\n			     onchange=\"angular.element(this).scope().TreatImage(this)\"/>  \n			 <label for=\"input-image-id\" class=\"md-button md-raised md-primary\">Upload Image</label>\n	   </div>\n		<md-input-container>\n		    <label> Created by:  </label>\n		    <input type=\"text\" ng-model=\"vm.ProductInfo.CreatedBy\" ng-disabled=\"true\">\n		</md-input-container>\n\n		<div layout=\"row\" layout-align=\"space-around center\">\n			 <input class=\"ng-hide\" id=\"input-file-id\" multiple type=\"file\" ng-disabled=\"vm.formestatus()\" onchange=\"angular.element(this).scope().TreatFile(this)\" />  \n			 <label for=\"input-file-id\" class=\"md-button md-raised md-primary\" ng-click=\"vm.formcheck()\">Upload File</label>\n		</div>\n\n	<div layout=\"row\" layout-align=\"space-around center\">\n		<md-progress-circular class=\"md-accent\" ng-show =\"vm.status != \'idle\'\" md-mode=\"indeterminate\"></md-progress-circular>\n	</div>\n\n	<h1 class=\"ui-typography-heading-example md-body-2\"> <md-icon md-font-icon=\"zmdi zmdi-alert-circle-o\"></md-icon> Add only <b>Microsoft® Exel </b> Files.</h1>\n\n</div>\n ");
$templateCache.put("app/laboratory/products/add_product/add_product.tmpl.html"," <div class=\"padded-content-page\">\n\n	<h2 class=\"md-display-1\">Add new <b> Product <md-icon md-font-icon=\"zmdi zmdi-bookmark-outline\"></md-icon></b></h2>\n		<md-subheader class=\"md-whiteframe-z3 margin-20 text-center\" palette-background=\"amber:500\" content-layout=\"column\" content-layout-align=\"space-between\">\n           <div layout=\"row\" layout-align=\"space-between center\" class=\"padding-normal\" alt=\"product-avatar\">\n           	   <img ng-src=\"{{vm.Product.ProductInfo.ImageBuffer}}\" id=\"productImage\" class=\"make-round\" width=\"100\"/> \n           	    <md-icon ng-show= \"vm.Product.ProductInfo.ImageBuffer == \'\'\" md-font-icon=\"fa fa-camera-retro font-size-4 opacity-50\"></md-icon>      	  \n	         	<h1>{{vm.Product.ProductInfo.Reference}}</h1>\n           </div>\n        </md-subheader>\n		<h2>Product Infos</h2>\n		<md-input-container class=\"md-block\">\n		    <label>Reference:</label>\n		    <input type=\"text\" ng-model=\"vm.Product.ProductInfo.Reference\" >\n		</md-input-container>\n		<md-input-container class=\"md-block\">\n		    <label>Risk Analysis: MD xx xx xx</label>\n		    <input type=\"text\" ng-model=\"vm.Product.ProductInfo.RiskAnalysis\" >\n		</md-input-container>\n		<md-input-container class=\"md-block\">\n		    <label>Product Designation</label>\n		    <input type=\"text\" ng-model=\"vm.Product.ProductInfo.Designation\" >\n		</md-input-container>\n		<md-input-container class=\"md-block\">\n		    <label>Links Project</label>\n		    <input type=\"text\" ng-model=\"vm.Product.ProductInfo.Links\" >\n		</md-input-container>\n	   <div layout=\"row\" layout-align=\"space-around center\">\n			 <input class=\"ng-hide\" id=\"input-image-id\" multiple type=\"file\" \n			     accept=\"image/jpeg,image/png\"\n			     onchange=\"angular.element(this).scope().TreatImage(this)\"/>  \n			 <label for=\"input-image-id\" class=\"md-button md-raised md-primary\">Upload Image</label>\n	   </div>\n		<md-input-container>\n		    <label> Created by:  </label>\n		    <input type=\"text\" ng-model=\"vm.Product.ProductInfo.CreatedBy\" ng-disabled=\"true\">\n		</md-input-container> \n\n		<md-list>\n		    <md-divider ></md-divider>\n		   \n		    <md-subheader class=\"md-whiteframe-z3 margin-20 text-center\" palette-background=\"amber:500\" >	\n\n		    	<h1 class=\"ui-typography-heading-example md-body-2\"> <md-icon md-font-icon=\"zmdi zmdi-alert-circle-o\"></md-icon> Select the Standards to use in this product.</h1>\n			    <md-input-container>\n			        <label>Search Standard</label>\n			              <input type=\"text\" ng-model=\"searchStandards\">\n			    </md-input-container>\n\n 			</md-subheader>\n\n		    <md-list-item ng-repeat=\"standard in vm.standards  | filter : searchStandards : Name \">\n		        <img ng-src=\"assets/images/laboratory/standard-avatar.png\" class=\"md-avatar\" alt=\"{{::standard.Infos.Name}}\"/>\n		        <p ng-if=\"standard.Infos.HasUpdate != 0\" style=\'color: rgb(255, 151, 119);\'> v{{standard.Infos.Version}}: {{::standard.Infos.Name}}</p>\n		        <p ng-if=\"standard.Infos.HasUpdate == 0\" style=\'color: white;\'> v{{standard.Infos.Version}}: {{::standard.Infos.Name}}</p>\n		       	<md-switch class=\"md-secondary\" ng-model=\"standard.selected\" ng-change=\"vm.selectStandard(standard, standard.selected)\"></md-switch>\n		    </md-list-item>\n		</md-list>\n\n		\n    <div layout=\"column\" layout-align=\"center center\">\n        <md-button ng-hide=\"vm.formestatus()\" class=\"md-primary md-raised\" md-ripple-size=\"full\" aria-label=\"ripple full\" ng-click= \'vm.addNewProduct()\' >Submit</md-button>\n   		<label ng-show=\"vm.formestatus()\" for=\"input-file-id\" class=\"md-button md-raised md-primary\" ng-click=\"vm.formcheck()\">Submit</label>\n    </div>\n</div>\n ");
$templateCache.put("app/laboratory/products/dashboard/products.dashboard.template.html","<div class=\"dashboard-container overlay-5 padded-content-page\">\n    <div layout=\"row\" layout-xs=\"column\" layout-margin>\n        <tri-widget calendar-widget flex class=\"widget-calendar\" palette-background=\"deep-orange:500\" content-layout=\"column\" content-layout-align=\"space-between\">\n           <div layout=\"row\" layout-align=\"space-between center\" class=\"padding-normal\">\n               <i class=\"fa fa-arrow-circle-left font-size-4 opacity-50\" ng-click=\"vm.backtoproducts()\"><md-tooltip>Back</md-tooltip></i>\n               <md-icon md-font-icon=\"fa fa-save font-size-4 opacity-50\" ng-click=\"vm.saveproduct()\"><md-tooltip>Save</md-tooltip></md-icon>\n               <md-icon md-font-icon=\"fa fa-download font-size-4 opacity-50\" ng-click=\"vm.GeneratedTF()\"><md-tooltip>Generate Qualif Synthesis</md-tooltip></md-icon>\n               <div class=\"widget-buttons\">\n                    <h1>{{vm.product.ProductInfo.Reference}}</h1> \n                        <img ng-src=\"{{vm.product.ProductInfo.ImageBuffer}}\" id=\"productImage\" class=\"make-round\" width=\"100\"/> \n                        <md-icon ng-show= \"vm.product.ProductInfo.ImageBuffer == \'\'\" md-font-icon=\"fa fa-camera-retro font-size-4 opacity-50\"></md-icon> \n               </div>\n           </div>\n        </tri-widget>\n        <div layout=\"column\" flex layout-margin>\n            <tri-widget palette-background=\"teal:400\" content-layout=\"column\" content-layout-align=\"space-between\">\n                <h2 class=\"md-display-2 font-weight-100 margin-0\" flex layout-padding translate>Statistics</h2>\n                <md-divider></md-divider>\n                <div flex=\"20\" layout=\"row\" layout-align=\"space-between center\" ng-click=\"ViewGraph = !ViewGraph\" layout-padding>\n                    <md-tooltip>Click to see Graphs</md-tooltip>\n                    <md-icon md-font-icon=\"zmdi zmdi-chart-donut font-size-7 opacity-50\"></md-icon>\n                </div>\n                <div ng-repeat=\"(key, value) in vm.data\" ng-show = \"ViewGraph == true\" layout=\"row\" layout-xs=\"column\" layout-margin>\n                    <tri-widget calendar-widget flex class=\"widget-calendar\" palette-background=\"teal:700\" content-layout=\"column\" content-layout-align=\"space-between\">\n                         <i>Category: {{key}} </i>\n                         <canvas  height=\"20%\" width=\"100%\"class=\"chart-pie\" chart-data=\"value\" chart-labels=\"vm.labels\" chart-legend=\"true\" chart-options=\"vm.options\"></canvas>\n                    </tri-widget>\n                </div>\n            </tri-widget>\n        </div> \n    </div>\n    <div layout=\"row\" layout-xs=\"column\" layout-margin ng-cloak layout-fill>\n            <tri-widget palette-background=\"blue-grey:100\" content-layout=\"column\" content-layout-align=\"space-between\">\n                    <div layout=\"row\" layout-align=\"space-between center\" class=\"padding-normal\">\n                    <i class=\"fa fa-edit font-size-3 opacity-50\"></i> \n                    <h3 flex hide-xs class=\"md-subhead\" translate>Edit Product</h3>\n                    <div class=\"widget-buttons\">\n                        <i ng-if = \'value.viewCategory == true\'>Category View</i>\n                        <i ng-if = \'value.viewCategory != true\'>Standards View</i>\n                        <md-button class=\"md-icon-button\" ng-click=\"vm.saveproduct()\" aria-label=\"save product\">\n                                <md-icon md-font-icon=\"fa fa-save font-size-2 opacity-50\"></md-icon>\n                                <md-tooltip>Save</md-tooltip>\n                        </md-button>\n                        <md-button class=\"md-icon-button\" ng-click=\"value.viewCategory = !value.viewCategory\" aria-label=\"previous view\">  \n                            <md-icon md-font-icon=\"zmdi zmdi-chevron-left\"><md-tooltip>Switch view</md-tooltip></md-icon>\n                        </md-button>\n                        <md-button class=\"md-icon-button\" ng-click=\"value.viewCategory = !value.viewCategory\" aria-label=\"next view\">\n                            <md-icon md-font-icon=\"zmdi zmdi-chevron-right\"><md-tooltip>Switch view</md-tooltip></md-icon>\n                        </md-button>\n                    </div>\n                  </div>\n                <md-divider></md-divider>\n                <div layout=\"row\" layout-align=\"space-around center\">\n                  <md-progress-circular class=\"md-accent\" ng-show =\"vm.status != \'idle\'\" md-mode=\"indeterminate\"></md-progress-circular>\n                </div>\n                <div ng-show = \'value.viewCategory != true\'>\n                    <md-list-item class=\"md-3-line margin-20\" ng-repeat=\"(key, value) in vm.product.ProductJSON.Standards\">\n                        <div class=\"md-list-item-text\">\n                            <md-subheader layout=\"row\" layout-align=\"space-between center\" palette-background=\"{{ vm.getStandardColor(value) }}\" ng-click=\'value.selected = !value.selected\' class=\"md-whiteframe-z3 margin-5 text-center\">   \n                                <h3 layout=\"row\" layout-align=\"center center\" palette-background=\"{{ vm.getStandardColor(value) }}\" >    \n                                             <i>{{key}} </i>  \n                                         <md-button class=\"md-icon-button\" >\n                                            {{vm.getStdProgress(key).perP | number:0}} %\n                                        </md-button>\n                                </h3> \n                                <p class=\"font-weight-300 margin-top-0 margin-bottom-0\" ng-show=\"value.Updates.length == 0\"> Last Version</p>\n\n                                <!-- buttons -->\n              \n                                <div ng-show=\"value.selected == true\" layout=\"column\" layout-align=\"start start\"> \n                                    <p class=\"font-weight-300 margin-top-0 margin-bottom-0\" ng-repeat=\"update in value.Updates\"> \n                                         Updates: <img src=\"assets/images/laboratory/standard-avatar.png\" alt=\"product-avatar\" width=\"15\"/>{{update._id}} : {{update.Name}}\n                                    </p>\n                                </div>\n                           </md-subheader>\n                               <md-list>\n                                        <table ng-show=\"value.selected == true\" class=\"table table-bordered table-hover table-condensed\" palette-background=\"blue-grey:500\">\n                                              <tr style=\"font-weight: bold\">\n                                                  <td style=\"width:5%\">Chapters</td>\n                                                  <td style=\"width:10%\">Category</td>\n                                                  <td style=\"width:20%\">Title</td>\n                                                  <td style=\"width:60%\">Comments</td>\n                                                  <td style=\"width:5%\">Status</td>\n                                                  <td style=\"width:10%\">Reports</td>\n                                              </tr>\n                                              <tr ng-repeat=\"designation in value.Designations\">\n                                                    <td> <span>  {{ designation.Chapters || \'empty\' }} </span> </td>\n                                                    <td> <span>  {{ designation.Category || \'empty\' }} </span> </td>\n                                                    <td> <span>  {{ designation.DesignationTitle || \'empty\' }} </span> </td>\n                                                    <td>\n                                                      <md-input-container class=\"md-block\" >\n                                                            <label>Comments</label>\n                                                            <input type=\"text\" value = \'designation.Comments\' ng-model = \"designation.Comments\" >\n                                                      </md-input-container>\n                                                    </td>\n                                                    <td>\n                                                          <md-select placeholder=\"Status\" ng-model=\"designation.Status\" e-form=\"tableform\">\n                                                            <md-option value=\"P\"> <i style=\"color: #14f114;\"> Passed</i></md-option>\n                                                            <md-option value=\"F\"> <i style=\"color: #f12214;\"> Failed</md-option>\n                                                            <md-option value=\"A\"> <i style=\"color: rgb(255,171,0);\"> Applicable</md-option>\n                                                            <md-option value=\"NA\"><i style=\"color: #14b0f1;\"> Not Applicable</md-option>\n                                                            <md-option value=\"\">  <i style=\"color: #14f114;\"> </md-option>\n                                                        </md-select>\n                                                    </td>\n                                                    <td> \n                                                        <div layout=\"column\" layout-align=\"space-around center\">\n\n                                                            <p ng-repeat= \'report in designation.Reports\'> <a ng-click=\"vm.getreport(report.id, designation)\" class=\"pointille\">{{ report.name }}</a>  </p>\n                                                             <input class=\"ng-hide\" id=\"input-file-{{designation}}\" type=\"file\" onchange=\"angular.element(this).scope().AddReports(this, angular.element(this).scope().designation)\" multiple>  \n                                                             <label for=\"input-file-{{designation}}\" class=\"md-button md-raised md-primary\"> <md-icon md-font-icon=\"fa fa-file-o\"></md-icon> Add Report  </label>\n                                                            \n                                                        </div>\n                                                    </td>\n                                            </tr>\n                                        </table>\n                             </md-list>\n                        </div>\n                    </md-list-item>\n                </div>\n\n                <div ng-show = \'value.viewCategory == true\'>\n                    <div class=\"md-3-line margin-20\" ng-repeat=\"(key, value) in vm.CategoryView\">\n                        <div class=\"md-list-item-text\">\n                            <md-subheader layout=\"row\" layout-align=\"space-between center\" palette-background=\"amber:400\"  ng-click=\'value.selected = !value.selected\' class=\"md-whiteframe-z3 margin-20 text-center\">   \n                                <h3 layout=\"row\" layout-align=\"center center\">    \n                                    <i>{{key}}</i>\n                                         <md-button class=\"md-icon-button\" >\n                                            {{vm.getCategoryProgress(key).perP | number:0}} %\n                                        </md-button>\n                                </h3>\n\n                            </md-subheader>\n                        </div>\n                \n                    <div>\n                        <table ng-show=\"value.selected == true\" class=\"table table-bordered table-hover table-condensed\" palette-background=\"blue-grey:500\">\n                            <tr style=\"font-weight: bold\">\n                                <td style=\"width:10%\">Points</td>\n                                <td style=\"width:90%\">Test</td>\n                            </tr>\n                            <tr ng-repeat=\"(key2, value2) in value\" ng-if = \"key2 != \'selected\'\">\n                                <td> <span>  {{ key2 }} </span> </td>\n                                <td>\n                                    <table class=\"table table-bordered table-hover table-condensed\" palette-background=\"blue-grey:700\" >\n                                        <tr style=\"font-weight: bold\">\n                                            <td style=\"width:20%\">Title</td>\n                                            <td style=\"width:10%\">Standards</td>\n                                            <td style=\"width:65%\">Comments</td>\n                                            <td style=\"width:5%\"> Status</td>\n                                        </tr>\n                                        <tr ng-repeat=\"point in value2\">\n                                            <td> <span>  {{ point.DesignationTitle || \'empty\' }} </span> </td>\n                                            <td> <span>  {{ point.Standard || \'empty\' }} </span> </td>\n                                            <td> \n                                                <md-input-container class=\"md-block\" >\n                                                    <label>Comments</label>\n                                                    <input type=\"text\" value = \'point.Comments\' ng-model = \"point.Comments\">\n                                                </md-input-container>\n                                            </td>\n                                            <td>\n                                                <md-select placeholder=\"Status\" ng-model=\"point.Status\" e-form=\"tableform\">\n                                                    <md-option value=\"P\"> <i style=\"color: #14f114;\"> Passed</i></md-option>\n                                                    <md-option value=\"F\"> <i style=\"color: #f12214;\"> Failed</md-option>\n                                                    <md-option value=\"A\"> <i style=\"color: rgb(255,171,0);\"> Applicable</md-option>\n                                                    <md-option value=\"NA\"><i style=\"color: #14b0f1;\"> Not Applicable</md-option>\n                                                    <md-option value=\"\">  <i style=\"color: #14f114;\"> </md-option>\n                                                </md-select>\n                                            </td>\n                                        </tr>\n                                    </table>\n\n                                </td>\n                            </tr>\n                        </table>\n                    </div>\n                </div>\n                \n                </div>\n            \n            </tri-widget>\n    </div>\n</div> \n");
$templateCache.put("app/laboratory/products/delete_product/delete_standard.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">File Upload Examples</h2>\n    <p class=\"md-subhead\">Triangular includes the <a href=\"https://github.com/danialfarid/ng-file-upload\">ng-file-upload directive</a> to allow easy upload form creation.</p>\n\n    <p>Here are some examples</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h3>Simple upload button (allow multiple)</h3>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"padding-40 md-tabs-content\">\n                    <md-card>\n                        <md-card-content ng-controller=\"ElementsUpload1Controller as vm\" ng-include=\"\'app/examples/elements/examples/upload-1.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/upload-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/elements/examples/upload-1.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h3>Upload button with animation</h3>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"padding-40 md-tabs-content\">\n                    <md-card>\n                        <md-card-content ng-controller=\"ElementsUploadAnimateController as vm\" ng-include=\"\'app/examples/elements/examples/upload-animate.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/upload-animate.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/elements/examples/upload-animate.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>\n");
$templateCache.put("app/laboratory/products/modify_product/modify_standard.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">File Upload Examples</h2>\n    <p class=\"md-subhead\">Triangular includes the <a href=\"https://github.com/danialfarid/ng-file-upload\">ng-file-upload directive</a> to allow easy upload form creation.</p>\n\n    <p>Here are some examples</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h3>Simple upload button (allow multiple)</h3>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"padding-40 md-tabs-content\">\n                    <md-card>\n                        <md-card-content ng-controller=\"ElementsUpload1Controller as vm\" ng-include=\"\'app/examples/elements/examples/upload-1.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/upload-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/elements/examples/upload-1.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h3>Upload button with animation</h3>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"padding-40 md-tabs-content\">\n                    <md-card>\n                        <md-card-content ng-controller=\"ElementsUploadAnimateController as vm\" ng-include=\"\'app/examples/elements/examples/upload-animate.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/upload-animate.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/elements/examples/upload-animate.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>\n");
$templateCache.put("app/laboratory/standards/add_standard/add_standard.tmpl.html","<div class=\"padded-content-page\">\n\n	<h2 class=\"md-display-1\">Add new <b> standard </b></h2>\n\n	<div layout=\"row\" layout-align=\"space-around center\">\n	 \n		 <input class=\"ng-hide\" id=\"input-file-id\" multiple type=\"file\" onchange=\"angular.element(this).scope().checkFile(this)\" />\n		 <label for=\"input-file-id\" class=\"md-button md-raised md-primary\">Upload File</label>\n\n	</div>\n\n	<div layout=\"row\" layout-align=\"space-around center\">\n	 \n		<md-progress-circular class=\"md-accent\" ng-show =\"vm.status != \'idle\'\" md-mode=\"indeterminate\"></md-progress-circular>\n\n	</div>\n\n	<h1 class=\"ui-typography-heading-example md-body-2\"> <md-icon md-font-icon=\"zmdi zmdi-alert-circle-o\"></md-icon> Add only <b>Microsoft® Exel </b> Files.</h1>\n\n\n{{vm.Names}}\n</div>\n\n");
$templateCache.put("app/laboratory/standards/delete_standard/delete_standard.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">File Upload Examples</h2>\n    <p class=\"md-subhead\">Triangular includes the <a href=\"https://github.com/danialfarid/ng-file-upload\">ng-file-upload directive</a> to allow easy upload form creation.</p>\n\n    <p>Here are some examples</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h3>Simple upload button (allow multiple)</h3>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"padding-40 md-tabs-content\">\n                    <md-card>\n                        <md-card-content ng-controller=\"ElementsUpload1Controller as vm\" ng-include=\"\'app/examples/elements/examples/upload-1.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/upload-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/elements/examples/upload-1.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h3>Upload button with animation</h3>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"padding-40 md-tabs-content\">\n                    <md-card>\n                        <md-card-content ng-controller=\"ElementsUploadAnimateController as vm\" ng-include=\"\'app/examples/elements/examples/upload-animate.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/upload-animate.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/elements/examples/upload-animate.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>\n");
$templateCache.put("app/laboratory/standards/modify_standard/modify_standard.tmpl.html","<div class=\"padded-content-page\">\n    <h2 class=\"md-display-1\">File Upload Examples</h2>\n    <p class=\"md-subhead\">Triangular includes the <a href=\"https://github.com/danialfarid/ng-file-upload\">ng-file-upload directive</a> to allow easy upload form creation.</p>\n\n    <p>Here are some examples</p>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h3>Simple upload button (allow multiple)</h3>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"padding-40 md-tabs-content\">\n                    <md-card>\n                        <md-card-content ng-controller=\"ElementsUpload1Controller as vm\" ng-include=\"\'app/examples/elements/examples/upload-1.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/upload-1.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/elements/examples/upload-1.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n\n    <div class=\"example-code md-whiteframe-z1 margin-bottom-20\">\n        <md-toolbar>\n            <div class=\"md-toolbar-tools\">\n                <h3>Upload button with animation</h3>\n            </div>\n        </md-toolbar>\n\n        <md-tabs class=\"example-tabs\" md-dynamic-height md-border-bottom>\n            <md-tab label=\"example\">\n                <div class=\"padding-40 md-tabs-content\">\n                    <md-card>\n                        <md-card-content ng-controller=\"ElementsUploadAnimateController as vm\" ng-include=\"\'app/examples/elements/examples/upload-animate.tmpl.html\'\"></md-card-content>\n                    </md-card>\n                </div>\n            </md-tab>\n            <md-tab label=\"HTML\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"html\" hljs-include=\"\'app/examples/elements/examples/upload-animate.tmpl.html\'\"></div>\n                </div>\n            </md-tab>\n            <md-tab label=\"JS\">\n                <div class=\"md-tabs-content\">\n                    <div flex hljs hljs-language=\"javascript\" hljs-include=\"\'app/examples/elements/examples/upload-animate.controller.js\'\"></div>\n                </div>\n            </md-tab>\n        </md-tabs>\n    </div>\n</div>\n");
$templateCache.put("app/triangular/components/footer/footer.tmpl.html","<md-toolbar id=\"footer\" md-theme=\"{{triSkin.elements.toolbar}}\" ng-controller=\"FooterController as vm\" ng-show=\"vm.layout.footer\">\n    <div class=\"md-toolbar-tools md-body-1\" layout=\"row\" layout-align=\"space-between center\">\n        <h2>{{vm.name}}</h2>\n        <h2 hide-xs ng-bind-html=\"vm.copyright\"></h2>\n        <h2>v{{vm.version}}</h2>\n    </div>\n</md-toolbar>\n");
$templateCache.put("app/triangular/components/menu/menu-item-divider.tmpl.html","<md-divider></md-divider>");
$templateCache.put("app/triangular/components/menu/menu-item-dropdown.tmpl.html","<md-button ng-click=\"triMenuItem.toggleDropdownMenu()\" class=\"md-raised md-primary side-menu-link\">\n    <md-icon ng-if=\"::(triMenuItem.item.icon !== undefined)\" class=\"side-menu-icon\" md-font-icon=\"{{::triMenuItem.item.icon}}\"></md-icon>\n    <span translate>{{::triMenuItem.item.name}}</span>\n    <md-icon class=\"menu-toggle-icon\" md-font-icon=\"zmdi zmdi-chevron-right\" ng-class=\"{ open: triMenuItem.item.open }\"></md-icon>\n</md-button>\n<ul class=\"drop-down-list\" ng-show=\"triMenuItem.item.open\">\n    <li ng-repeat=\"child in triMenuItem.item.children\">\n        <tri-menu-item item=\"::child\"></tri-menu-item>\n    </li>\n</ul>");
$templateCache.put("app/triangular/components/menu/menu-item-link.tmpl.html","<md-button permission permission-only=\"triMenuItem.item.permission\" ng-click=\"triMenuItem.openLink(triMenuItem.item)\" class=\"md-primary md-raised side-menu-link\" ng-class=\"{ \'md-hue-1\': triMenuItem.item.active }\">\n    <md-icon ng-if=\"::(triMenuItem.item.icon !== undefined)\" class=\"side-menu-icon\" md-font-icon=\"{{::triMenuItem.item.icon}}\"></md-icon>\n    <span translate>{{::triMenuItem.item.name}}</span>\n    <small ng-if=\"triMenuItem.item.badge\" theme-background=\"accent\" class=\"side-menu-badge\">{{triMenuItem.item.badge}}</small>\n</md-button>");
$templateCache.put("app/triangular/components/notifications-panel/notifications-panel.tmpl.html","<md-content flex layout class=\"admin-notifications\">\n    <md-tabs flex md-stretch-tabs=\"always\" md-selected=\"vm.currentTab\">\n        <md-tab>\n            <md-tab-label>\n                <md-icon md-font-icon=\"zmdi zmdi-email\"></md-icon>\n            </md-tab-label>\n            <md-tab-body>\n                <md-content>\n                    <md-list class=\"md-dense\">\n                        <md-list-item class=\"md-2-line\" ng-repeat=\"email in ::vm.emails\" ng-click=\"vm.openMail(email)\">\n                            <img class=\"md-avatar\" ng-src=\"{{::email.from.image}}\" alt=\"{{::email.from.name}}\">\n                            <div class=\"md-list-item-text\">\n                                <h3>{{::email.from.name}}</h3>\n                                <h4>{{::email.subject}}</h4>\n                                <p class=\"md-caption\" am-time-ago=\"::email.date\"></p>\n                            </div>\n                            <md-divider ng-hide=\"$last\"></md-divider>\n                        </md-list-item>\n                    </md-list>\n                </md-content>\n            </md-tab-body>\n        </md-tab>\n        <md-tab>\n            <md-tab-label>\n                <md-icon md-font-icon=\"fa fa-bell-o\"></md-icon>\n            </md-tab-label>\n            <md-tab-body>\n                <md-content>\n                    <md-list>\n                        <div ng-repeat=\"group in ::vm.notificationGroups\">\n                            <md-subheader class=\"md-primary\">{{::group.name}}</md-subheader>\n                            <md-list-item ng-repeat=\"notification in ::group.notifications\" layout=\"row\" layout-align=\"space-between center\">\n                                <md-icon md-font-icon=\"{{::notification.icon}}\" ng-style=\"{ color: notification.iconColor }\"></md-icon>\n                                <p>{{::notification.title}}</p>\n                                <span class=\"md-caption\" am-time-ago=\"::notification.date\"></span>\n                            </md-list-item>\n                        </div>\n                    </md-list>\n                </md-content>\n            </md-tab-body>\n        </md-tab>\n        <md-tab>\n            <md-tab-label>\n                <md-icon md-font-icon=\"zmdi zmdi-account\"></md-icon>\n            </md-tab-label>\n            <md-tab-body>\n                <md-content>\n                    <md-list>\n                        <div ng-repeat=\"group in ::vm.settingsGroups\">\n                            <md-subheader class=\"md-primary\"><span translate>{{::group.name}}</span></md-subheader>\n                            <md-list-item ng-repeat=\"setting in ::group.settings\" layout=\"row\" layout-align=\"space-around center\">\n                                <md-icon md-font-icon=\"{{::setting.icon}}\"></md-icon>\n                                <p translate>{{::setting.title}}</p>\n                                <md-switch class=\"md-secondary\" ng-model=\"setting.enabled\"></md-switch>\n                            </md-list-item>\n                        </div>\n                        <div ng-repeat=\"group in ::vm.statisticsGroups\">\n                            <md-subheader class=\"md-primary\"><span translate>{{::group.name}}</span></md-subheader>\n                            <md-list-item ng-repeat=\"stat in ::group.stats\" layout=\"column\" layout-align=\"space-around start\">\n                                <md-progress-linear class=\"margin-top-20\" ng-class=\"::stat.mdClass\" md-mode=\"determinate\" ng-value=\"::stat.value\"></md-progress-linear>\n                                <p translate>{{::stat.title}}</p>\n                            </md-list-item>\n                        </div>\n                    </md-list>\n                </md-content>\n            </md-tab-body>\n        </md-tab>\n    </md-tabs>\n</md-content>\n");
$templateCache.put("app/triangular/components/table/table-directive.tmpl.html","<table class=\"md-table\">\n    <thead>\n        <tr>\n            <th ng-repeat=\"column in columns\" ng-click=\"sortClick(column.field)\" ng-class=\"headerClass(column.field)\">\n                <md-icon ng-show=\"showSortOrder(column.field, true)\" class=\"zmdi-hc-rotate-90\" md-font-icon=\"zmdi zmdi-arrow-back\"></md-icon>\n                <md-icon ng-show=\"showSortOrder(column.field, false)\" class=\"zmdi-hc-rotate-270\" md-font-icon=\"zmdi zmdi-arrow-back\"></md-icon>\n                <span>\n                    {{column.title | triTranslate}}\n                </span>\n            </th>\n        </tr>\n    </thead>\n    <tbody>\n        <tr ng-repeat=\"content in contents | filter:filters | startFrom:page * pageSize | limitTo: pageSize\">\n            <td ng-repeat=\"column in columns\" ng-bind-html=\"cellContents(column, content)\" ng-class=\"column.field + \'-cell\'\"></td>\n        </tr>\n    </tbody>\n    <tfoot>\n        <tr>\n            <td colspan=\"{{columns.length}}\">\n                <div class=\"md-table-footer\" layout=\"row\" layout-align=\"end center\">\n                    <div class=\"md-table-page-select\" layout=\"row\" layout-align=\"center center\">\n                        <span translate>Rows per page:</span>\n                        <md-select ng-model=\"pageSize\" ng-change=\"refresh(true)\">\n                            <md-option value=\"5\">5</md-option>\n                            <md-option value=\"10\">10</md-option>\n                            <md-option value=\"25\">25</md-option>\n                            <md-option value=\"50\">50</md-option>\n                            <md-option value=\"100\">100</md-option>\n                        </md-select>\n                    </div>\n                    <span class=\"md-table-info\">\n                        {{pageStart()}}\n                        -\n                        {{pageEnd()}}\n                        <span translate>of</span>\n                        {{totalItems()}}\n                    </span>\n                    <div class=\"md-table-page-nav\">\n                        <md-button ng-disabled=\"page == 0\" ng-click=\"page = page - 1\" aria-label=\"{{\'Previous Page\' | triTranslate}}\" class=\"md-primary md-icon-button\">\n                            <md-icon md-font-icon=\"zmdi zmdi-chevron-left\"></md-icon>\n                        </md-button>\n                        <md-button ng-disabled=\"page == numberOfPages() - 1\" ng-click=\"page = page + 1\" aria-label=\"{{\'Next Page\' | triTranslate}}\" class=\"md-primary md-icon-button\">\n                            <md-icon md-font-icon=\"zmdi zmdi-chevron-right\"></md-icon>\n                        </md-button>\n                    </div>\n                </div>\n            </td>\n        </tr>\n    </tfoot>\n</table>\n");
$templateCache.put("app/triangular/components/toolbars/toolbar.tmpl.html","<div class=\"md-toolbar-tools\">\n    <md-button class=\"md-icon-button\" ng-if=\"!vm.hideMenuButton()\" ng-click=\"vm.openSideNav(\'left\')\" aria-label=\"side navigation\">\n        <md-icon md-font-icon=\"zmdi zmdi-menu\"></md-icon>\n    </md-button>\n\n    <h2 hide-xs flex>\n        <span ng-repeat=\"crumb in vm.breadcrumbs.crumbs\">\n            <span translate>{{crumb.name}}</span>\n            <md-icon md-font-icon=\"zmdi zmdi-chevron-right\" ng-if=\"!$last\"></md-icon>\n        </span>\n    </h2>\n\n    <md-button class=\"md-icon-button toolbar-button\" ng-click=\"vm.toggleFullScreen()\" aria-label=\"toggle fullscreen\">\n        <md-icon md-font-icon ng-class=\"vm.fullScreenIcon\"></md-icon>\n    </md-button>\n\n    <md-menu ng-show=\"vm.languages.length > 0\">\n        <md-button class=\"md-icon-button\" aria-label=\"language\" ng-click=\"$mdOpenMenu()\" aria-label=\"change language\">\n            <md-icon md-font-icon=\"zmdi zmdi-globe-alt\"></md-icon>\n        </md-button>\n        <md-menu-content width=\"3\">\n            <md-menu-item ng-repeat=\"language in ::vm.languages\">\n                <md-button ng-click=\"vm.switchLanguage(language.key)\" translate=\"{{::language.name}}\" aria-label=\"{{::language.name}}\"></md-button>\n            </md-menu-item>\n        </md-menu-content>\n    </md-menu>\n\n    <md-button class=\"md-icon-button toolbar-button animated\" ng-click=\"vm.toggleNotificationsTab(0)\" aria-label=\"side navigation\">\n        <md-icon md-font-icon=\"zmdi zmdi-email\"></md-icon>\n        <span class=\"toolbar-button-badge animated\" theme-background=\"accent\" ng-class=\"{ \'toolbar-button-badge-new\' : vm.emailNew }\">5</span>\n    </md-button>\n\n    <md-button class=\"md-icon-button toolbar-button\" ng-click=\"vm.toggleNotificationsTab(1)\">\n        <md-icon md-font-icon=\"fa fa-bell-o\"></md-icon>\n        <span class=\"toolbar-button-badge\" theme-background=\"accent\">2</span>\n    </md-button>\n\n    <md-menu>\n        <md-button aria-label=\"Open user menu\" ng-click=\"$mdOpenMenu()\" aria-label=\"side navigation\">\n            <img class=\"toolbar-user-avatar\" src=\"assets/images/avatars/avatar-5.png\">\n            Christos\n        </md-button>\n        <md-menu-content width=\"4\">\n            <md-menu-item>\n                <md-button ng-click=\"vm.toggleNotificationsTab(2)\" aria-label=\"side navigation\">\n                    <md-icon md-font-icon=\"zmdi zmdi-settings\"></md-icon>\n                    <span translate=\"Settings\"></span>\n                </md-button>\n            </md-menu-item>\n            <md-menu-item>\n                <md-button href=\"#/profile\" aria-label=\"side navigation\">\n                    <md-icon md-font-icon=\"zmdi zmdi-account\"></md-icon>\n                    <span translate=\"Profile\"></span>\n                </md-button>\n            </md-menu-item>\n            <md-menu-divider></md-menu-divider>\n            <md-menu-item>\n                <md-button href=\"#/login\" aria-label=\"side navigation\">\n                    <md-icon md-font-icon=\"zmdi zmdi-sign-in\"></md-icon>\n                    <span translate=\"Logout\"></span>\n                </md-button>\n            </md-menu-item>\n        </md-menu-content>\n    </md-menu>\n</div>\n");
$templateCache.put("app/triangular/components/widget/widget.tmpl.html","<div class=\"widget md-whiteframe-z2\" ng-class=\"::{\'widget-overlay-title\': vm.overlayTitle}\" flex layout=\"{{vm.widgetLayout}}\">\n\n    <div class=\"widget-title\" ng-if=\"::(vm.title || vm.subtitle)\" layout=\"row\" layout-padding layout-align=\"start center\" flex-order=\"{{vm.titleOrder}}\">\n        <div ng-if=\"::vm.avatar\">\n            <img ng-src=\"{{::vm.avatar}}\" class=\"widget-avatar\"/>\n        </div>\n        <div flex layout=\"column\">\n            <h3 class=\"md-subhead\" ng-if=\"::vm.title\" translate>{{::vm.title}}</h3>\n            <p class=\"md-body-1\" ng-if=\"::vm.subtitle\" translate>{{::vm.subtitle}}</p>\n        </div>\n        <md-menu ng-if=\"::vm.menu\">\n            <md-button class=\"widget-button md-icon-button\" ng-click=\"$mdOpenMenu()\" aria-label=\"open menu\">\n                <md-icon md-font-icon=\"{{::vm.menu.icon}}\"></md-icon>\n            </md-button>\n            <md-menu-content>\n                <md-menu-item ng-repeat=\"item in ::vm.menu.items\">\n                    <md-button ng-click=\"item.click($event)\">\n                        <md-icon ng-if=\"::item.icon\" md-font-icon=\"{{::item.icon}}\"></md-icon>\n                        <span translate>{{::item.title}}</span>\n                    </md-button>\n                </md-menu-item>\n            </md-menu-content>\n        </md-menu>\n    </div>\n\n    <div class=\"widget-content\" layout=\"{{vm.contentLayout}}\" layout-align=\"{{vm.contentLayoutAlign}}\" ng-class=\"{\'layout-padding\': vm.contentPadding}\" ng-transclude flex-order=\"{{vm.contentOrder}}\"></div>\n\n    <div class=\"widget-loading ng-hide\" ng-show=\"vm.loading\" layout layout-fill layout-align=\"center center\">\n        <div class=\"widget-loading-inner\" ng-show=\"vm.loading\">\n            <md-progress-circular md-mode=\"indeterminate\"></md-progress-circular>\n        </div>\n    </div>\n\n</div>");
$templateCache.put("app/triangular/layouts/default/default-content.tmpl.html","<div id=\"admin-panel-content-view\" class=\"{{layout.innerContentClass}}\" flex ui-view></div>");
$templateCache.put("app/triangular/layouts/default/default-no-scroll.tmpl.html","<div layout=\"row\" class=\"full-height\">\n    <!-- left sidebar -->\n\n    <md-sidenav class=\"admin-sidebar-left md-sidenav-left hide-scrollbars md-whiteframe-z2\" md-component-id=\"left\" md-is-locked-open=\"layout.sideMenuSize !== \'hidden\' && $mdMedia(\'gt-sm\')\" ui-view=\"sidebarLeft\" ng-class=\"{ \'admin-sidebar-collapsed\': layout.sideMenuSize == \'icon\' }\" ng-mouseover=\"layoutController.activateHover()\" ng-mouseleave=\"layoutController.removeHover()\"></md-sidenav>\n\n    <!-- main content -->\n    <div id=\"admin-panel\" layout=\"column\" flex>\n        <!-- loading animation -->\n        <tri-loader></tri-loader>\n\n        <!-- top toolbar -->\n        <md-toolbar class=\"admin-toolbar\" md-theme=\"{{triSkin.elements.toolbar}}\" ui-view=\"toolbar\" ng-class=\"[layout.toolbarSize,layout.toolbarClass]\"></md-toolbar>\n\n        <!-- scrollable content -->\n        <div ui-view=\"content\" layout=\"column\" flex class=\"overflow-hidden\"></div>\n\n        <div ui-view=\"belowContent\"></div>\n    </div>\n\n    <!-- right sidebar -->\n    <md-sidenav layout layout-fill class=\"md-sidenav-right md-whiteframe-z2\" md-component-id=\"notifications\" ui-view=\"sidebarRight\"></md-sidenav>\n</div>\n");
$templateCache.put("app/triangular/layouts/default/default.tmpl.html","<div layout=\"row\" class=\"full-height\">\n    <!-- left sidebar -->\n\n    <md-sidenav class=\"admin-sidebar-left md-sidenav-left hide-scrollbars md-whiteframe-z2\" md-component-id=\"left\" md-is-locked-open=\"layout.sideMenuSize !== \'hidden\' && $mdMedia(\'gt-sm\')\" ui-view=\"sidebarLeft\" ng-class=\"{ \'admin-sidebar-collapsed\': layout.sideMenuSize == \'icon\' }\" ng-mouseover=\"layoutController.activateHover()\" ng-mouseleave=\"layoutController.removeHover()\"></md-sidenav>\n\n    <!-- main content -->\n    <div id=\"admin-panel\" layout=\"column\" flex>\n        <!-- loading animation -->\n        <tri-loader></tri-loader>\n\n        <!-- top toolbar -->\n        <md-toolbar class=\"admin-toolbar\" ng-if=\"layout.showToolbar\" md-theme=\"{{triSkin.elements.toolbar}}\" ui-view=\"toolbar\" ng-class=\"[layout.toolbarSize,layout.toolbarClass]\"></md-toolbar>\n\n        <!-- scrollable content -->\n        <md-content ng-class=\"layout.contentClass\" flex tri-default-content ui-view=\"content\"></md-content>\n\n        <div ui-view=\"belowContent\"></div>\n    </div>\n\n    <!-- right sidebar -->\n    <md-sidenav layout layout-fill class=\"md-sidenav-right md-whiteframe-z2\" md-component-id=\"notifications\" ui-view=\"sidebarRight\"></md-sidenav>\n</div>\n");
$templateCache.put("app/examples/calendar/layouts/toolbar/toolbar.tmpl.html","<div class=\"md-toolbar-tools\">\n    <md-button class=\"md-icon-button\" hide-gt-md ng-click=\"vm.openSideNav(\'left\')\" aria-label=\"side navigation\">\n        <md-icon md-font-icon=\"zmdi zmdi-menu\"></md-icon>\n    </md-button>\n    <h2 flex>\n        <span ng-repeat=\"crumb in vm.breadcrumbs.crumbs\">\n            <span translate>{{crumb.name}}</span>\n            <md-icon md-font-icon=\"zmdi zmdi-chevron-right\" ng-if=\"!$last\">\n        </span>\n    </h2>\n\n    <div class=\"widget-buttons\">\n        <md-button class=\"widget-button md-icon-button\" ng-click=\"vm.changeMonth(\'prev\')\" aria-label=\"previous month\">\n            <md-icon md-font-icon=\"zmdi zmdi-chevron-left\"></md-icon>\n        </md-button>\n        <md-button hide show-gt-lg class=\"widget-button md-icon-button\" ng-click=\"vm.changeMonth(\'today\')\" aria-label=\"today\">\n            <md-icon md-font-icon=\"zmdi zmdi-calendar-alt\"></md-icon>\n        </md-button>\n        <md-button class=\"widget-button md-icon-button\" ng-click=\"vm.changeMonth(\'next\')\" aria-label=\"next month\">\n            <md-icon md-font-icon=\"zmdi zmdi-chevron-right\"></md-icon>\n        </md-button>\n    </div>\n\n    <md-menu>\n        <md-button class=\"md-icon-button\" aria-label=\"{{\'Change View\' | triTranslate}}\" ng-click=\"$mdOpenMenu()\">\n            <md-icon md-font-icon=\"{{vm.currentView.icon}}\" ng-class=\"vm.currentView.icon\"></md-icon>\n        </md-button>\n        <md-menu-content width=\"2\">\n            <md-menu-item ng-repeat=\"view in vm.views\">\n                <md-button ng-click=\"vm.changeView(view)\" translate=\"{{::view.name}}\" aria-label=\"{{::view.name}}\"></md-button>\n            </md-menu-item>\n        </md-menu-content>\n    </md-menu>\n</div>\n\n");
$templateCache.put("app/examples/email/layout/toolbar/toolbar.tmpl.html","<div class=\"md-toolbar-tools\">\n    <md-button class=\"md-icon-button\" ng-if=\"!vm.hideMenuButton()\" ng-click=\"vm.openSideNav(\'left\')\" aria-label=\"side navigation\">\n        <md-icon md-font-icon=\"zmdi zmdi-menu\"></md-icon>\n    </md-button>\n\n    <h2 hide-xs flex>\n        <span ng-repeat=\"crumb in vm.breadcrumbs.crumbs\">\n            <span translate>{{crumb.name}}</span>\n            <md-icon md-font-icon=\"zmdi zmdi-chevron-right\" ng-if=\"!$last\">\n        </span>\n    </h2>\n\n    <md-button class=\"md-icon-button\" ng-click=\"vm.toggleSearch()\" aria-label=\"{{\'Toggle Menu\' | triTranslate}}\">\n        <md-icon md-font-icon=\"zmdi zmdi-search\"></md-icon>\n    </md-button>\n\n    <input class=\"toolbar-search\" ng-show=\"vm.showSearch\" ng-model=\"emailSearch\" ng-change=\"vm.filterEmailList(emailSearch)\" type=\"text\" placeholder=\"{{\'Search\' | triTranslate}}\">\n\n    <md-button class=\"md-icon-button\" ng-repeat=\"menu in ::vm.toolbarMenu\" ui-sref=\"{{::menu.state}}\" aria-label=\"{{::menu.name}}\">\n        <md-icon md-font-icon=\"{{::menu.icon}}\"></md-icon>\n        <md-tooltip>{{::menu.name}}</md-tooltip>\n    </md-button>\n</div>\n\n");
$templateCache.put("app/triangular/layouts/states/triangular/triangular.tmpl.html","<!-- left sidebar -->\n<md-sidenav md-colors=\"{ background: \'primary\' }\" class=\"triangular-sidenav-left md-sidenav-left hide-scrollbars md-whiteframe-z2\" ng-if=\"layout.sideMenuSize !== \'off\'\" md-component-id=\"left\" md-is-locked-open=\"layout.sideMenuSize !== \'hidden\' && $mdMedia(\'gt-sm\')\" ui-view=\"sidebarLeft\" ng-class=\"{ \'admin-sidebar-collapsed\': layout.sideMenuSize == \'icon\' }\" ng-mouseover=\"stateController.activateHover()\" ng-mouseleave=\"stateController.removeHover()\"></md-sidenav>\n\n<!-- main content -->\n<div class=\"triangular-toolbar-and-content\" layout=\"column\" flex>\n\n    <!-- top toolbar -->\n    <md-toolbar class=\"triangular-toolbar md-whiteframe-z1\" ng-if=\"layout.showToolbar\" ng-class=\"[layout.toolbarSize,layout.toolbarClass]\" md-theme=\"{{triSkin.elements.toolbar}}\" ui-view=\"toolbar\"></md-toolbar>\n\n    <!-- scrollable content -->\n    <md-content class=\"triangular-content\" ng-class=\"layout.contentClass\" flex ui-view></md-content>\n\n    <div ui-view=\"belowContent\"></div>\n\n    <div class=\"triangular-loader\" ng-show=\"stateController.showLoader\" layout=\"column\" ui-view=\"loader\"></div>\n</div>\n\n<!-- right sidebar -->\n<md-sidenav layout layout-fill class=\"triangular-sidenav-right md-sidenav-right md-whiteframe-z2\" md-component-id=\"notifications\" ui-view=\"sidebarRight\"></md-sidenav>\n");
$templateCache.put("app/examples/dashboards/analytics/widgets/counter-widget/counter-widget.tmpl.html","<md-card class=\"tri-counter-widget\" flex md-colors=\"::{ background: vm.background, color: vm.color }\">\n    <md-card-content layout=\"row\" layout-align=\"space-between center\">\n        <md-icon class=\"font-size-5 margin-left-10 inherit-color\" md-font-icon=\"{{vm.icon}}\"></md-icon>\n        <div layout=\"column\">\n            <p class=\"md-display-3 font-weight-100 margin-top-0 margin-bottom-0 text-ellipsis\" countupto=\"vm.count\" decimals=\"0\"></p>\n            <p class=\"md-body-2 margin-top-0 margin-bottom-0\" translate>{{vm.title}}</p>\n        </div>\n    </md-card-content>\n</md-card>\n");
$templateCache.put("app/examples/dashboards/analytics/widgets/line-chart-widget/line-chart-widget.tmpl.html","<md-card>\n    <md-card-header>\n        <md-card-header-text>\n            <span class=\"md-title\">Overview</span>\n            <span class=\"md-subhead\">{{vm.start.toDate() | date:\'fullDate\'}} - {{vm.end.toDate() | date:\'fullDate\'}}</span>\n        </md-card-header-text>\n        <md-menu>\n            <md-button aria-label=\"Change timespan\" class=\"md-icon-button\" ng-click=\"$mdOpenMenu($event)\">\n                <md-icon md-menu-origin md-font-icon=\"zmdi zmdi-more-vert\"></md-icon>\n            </md-button>\n            <md-menu-content>\n                <md-menu-item ng-repeat=\"span in vm.timeSpans\">\n                    <md-button ng-click=\"vm.onTimeChange({ span: span })\">\n                        {{span.name}}\n                    </md-button>\n                </md-menu-item>\n            </md-menu-content>\n        </md-menu>\n    </md-card-header>\n    <md-card-content>\n        <nvd3 options=\"vm.options\" data=\"vm.data\" api=\"vm.api\"></nvd3>\n    </md-card-content>\n</md-card>\n");
$templateCache.put("app/examples/dashboards/analytics/widgets/map-widget/map-widget.tmpl.html","<md-card class=\"no-padding-card\">\n    <md-card-content>\n        <ui-gmap-google-map class=\"map-widget\" center=\"vm.map.center\" zoom=\"vm.map.zoom\" options=\"vm.map.options\">\n            <ui-gmap-markers models=\"vm.randomMarkers\" coords=\"\'self\'\" icon=\"\'icon\'\"></ui-gmap-markers>\n        </ui-gmap-google-map>\n    </md-card-content>\n</md-card>\n");
$templateCache.put("app/examples/dashboards/analytics/widgets/pie-chart-widget/pie-chart-widget.tmpl.html","<md-card>\n    <md-card-content>\n        <nvd3 options=\"vm.options\" data=\"vm.data\" api=\"vm.api\"></nvd3>\n    </md-card-content>\n</md-card>\n");
$templateCache.put("app/examples/dashboards/analytics/widgets/stat-chart-widget/stat-chart-widget.tmpl.html","<md-card>\n    <md-card-content>\n        <h3 class=\"md-subhead margin-bottom-0\">{{vm.name}}</h3>\n        <h3 class=\"md-headline margin-top-0\">{{vm.statistic}}</h4>\n        <nvd3 options=\"vm.options\" data=\"vm.data\" api=\"vm.api\"></nvd3>\n    </md-card-content>\n</md-card>\n");
$templateCache.put("app/examples/dashboards/analytics/widgets/tabs-widget/tabs-widget.tmpl.html","<md-card class=\"no-padding-card\">\n    <md-card-content>\n        <md-tabs md-dynamic-height md-border-bottom>\n            <md-tab label=\"language\">\n                <md-content>\n                    <md-table-container>\n                        <table md-table class=\"md-data-table\">\n                            <thead md-head md-order=\"vm.tableQueries.languages.order\">\n                                <tr md-row>\n                                    <th md-column md-order-by=\"language\">Language</th>\n                                    <th md-column md-numeric md-order-by=\"sessions\">Sessions</th>\n                                    <th md-column md-numeric md-desc md-order-by=\"percent\">% Sessions</th>\n                                </tr>\n                            </thead>\n                            <tbody md-body>\n                                <tr md-row ng-repeat=\"language in vm.languages | orderBy: vm.tableQueries.languages.order | limitTo: vm.tableQueries.languages.limit : (vm.tableQueries.languages.page -1) * vm.tableQueries.languages.limit\">\n                                    <td md-cell>{{::language.language}}</td>\n                                    <td md-cell>{{::language.sessions | number}}</td>\n                                    <td md-cell>{{::language.percent}}%</td>\n                                </tr>\n                            </tbody>\n                        </table>\n                    </md-table-container>\n                    <md-table-pagination md-limit=\"vm.tableQueries.languages.limit\" md-page=\"vm.tableQueries.languages.page\" md-total=\"{{vm.languages.length}}\" md-page-select></md-table-pagination>\n                </md-content>\n            </md-tab>\n            <md-tab label=\"country\">\n                <md-content>\n                    <md-table-container>\n                        <table md-table class=\"md-data-table\">\n                            <thead md-head md-order=\"vm.tableQueries.countries.order\">\n                                <tr md-row>\n                                    <th md-column md-order-by=\"language\">Language</th>\n                                    <th md-column md-numeric md-order-by=\"sessions\">Sessions</th>\n                                    <th md-column md-numeric md-desc md-order-by=\"percent\">% Sessions</th>\n                                </tr>\n                            </thead>\n                            <tbody md-body>\n                                <tr md-row ng-repeat=\"country in vm.countries | orderBy: vm.tableQueries.countries.order | limitTo: vm.tableQueries.countries.limit : (vm.tableQueries.countries.page -1) * vm.tableQueries.countries.limit\">\n                                    <td md-cell>{{::country.country}}</td>\n                                    <td md-cell>{{::country.sessions}}</td>\n                                    <td md-cell>{{::country.percent}}%</td>\n                                </tr>\n                            </tbody>\n                        </table>\n                    </md-table-container>\n                    <md-table-pagination md-limit=\"vm.tableQueries.countries.limit\" md-page=\"vm.tableQueries.countries.page\" md-total=\"{{vm.countries.length}}\" md-page-select></md-table-pagination>\n                </md-content>\n            </md-tab>\n        </md-tabs>\n    </md-card-content>\n</md-card>\n");}]);
