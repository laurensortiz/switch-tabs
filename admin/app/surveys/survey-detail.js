'use strict';

angular.module('switchTabsAppAdmin')
  .controller('surveyDetailCtrl', ['$scope', '$location', '$window', '$timeout', '$routeParams', 'NgTableParams', 'surveys', 'customers', function ( $scope, $location, $window, $timeout, $routeParams, NgTableParams, surveys, customers ) {

    var self = this,
        surveyData = [],
        surveyAnswers = {},
        SURVEY_ID = $routeParams.id;
    //Charts
    var ctxPolar  = document.getElementById('surveyChart').getContext('2d'),
        ctxLine   = document.getElementById('surveyChartPerDay').getContext('2d');

    $scope.surveyInfo = {};
    $scope.customerInfo = {};
    $scope.surveyLocation = [];
    $scope.hasQuestions = false;

    //Fetch surveyInfo
    surveys.getSurvey( SURVEY_ID ).then( function(survey) {

      $scope.surveyInfo = survey.data;

    });

    //Fetch All locations from survey
    surveys.getSurveyByLocation( SURVEY_ID ).then( function(locations){

      $scope.locationsActiveInSurvey = locations.data;

      //Get the customer info from one locationID locations.data[firstLocation = 0]
      customers.getCustomerByLocation( locations.data[0].locationID).then( function(customer){

        customers.getCustomerInfo( customer.data.idCustomer ).then(function(customerInfo){
          
          $scope.customerInfo = {
            name  : customerInfo.name,
            id    : customerInfo.id
          };

        });
        
      });
    });

    //Fetch All locations from survey
    surveys.getSurveyByLocation( SURVEY_ID ).then( function(locations){

      $scope.customerLocation = locations.data;

      //Get the customer info from one locationID locations.data[firstLocation = 0]
      customers.getCustomerByLocation( locations.data[0].locationID).then( function(customer){
        customers.getCustomerInfo( customer.data.idCustomer ).then(function(customerInfo){
          $scope.customerName =  customerInfo.name;
          $scope.surveyCustomerID = customerInfo.id;

          angular.forEach( $scope.customerLocation, function (val, key){
            _.filter(customerInfo.locations, function(value, key){

              if (value.id === val.locationID ) {

                $scope.surveyLocation.push(customerInfo.locations[key]);

              }

            });

          });
          _.map(customerInfo.locations, function(location) {
            location.id = _.parseInt(location.id);
          });
        });
      });
    });


    surveys.getSurveyQuestions(SURVEY_ID).then( function (questions){

      if( questions.data.length > 0 ){

        $scope.questions = questions.data;

      }

    });

    surveys.getSurveyAnswers( SURVEY_ID ).then( function (answers){

      var result = _.chain(answers.data)
        .groupBy("Date")
        .pairs()
        .map(function (currentItem) {
          return _.object(_.zip(["date", "answers"], currentItem));
        })
        .value();


      $scope.answers = result;


      $scope.surveyInfo.numberAnswers = $scope.answers.length;

      if ( result.length ){
        $scope.hasQuestions = true;
      }
      else {
        $scope.hasQuestions = false;
      }

      listAnswers($scope.answers);

      var group = _.groupBy(_.flatten(_.pluck(_.map($scope.answers),'answers')), 'answer');

      _.forEach($scope.answers, function(answer){

	      var dateTime = new Date(answer['date']).addHours(1);
	      var formatDate = ($scope.formatDate(dateTime)).split(' ');
	      
        answer.dateTime = answer['date'];
        answer.locationID = _.parseInt(answer.answers[0]['locationID']);
        answer['date'] = formatDate[0];
        answer.time = formatDate[2] +' '+ formatDate[3];

      });


      $scope.chartDataPolar = _.transform(group, function (result, val, key) {

        val.value = _.size(val);
        val.label = key.toLowerCase();
        val.color = Answer[key];

        result[key.toLowerCase()] = val;
      });


      var optionschartPolar = {
        scaleBeginAtZero : true,
        animationEasing : 'easeInOutQuint',
        animateScale : true
      };

      new Chart(ctxPolar).PolarArea(_.values($scope.chartDataPolar), optionschartPolar);

      var groupByDate = _.groupBy($scope.answers, 'date');

      var chartDataLine = {
        labels : [],
        datasets : []
      };

      var answersPerDay = [];

      var optionschartLine = {
        ///Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines : true,

        //String - Colour of the grid lines
        scaleGridLineColor : "rgba(0,0,0,.05)",

        //Number - Width of the grid lines
        scaleGridLineWidth : 1,

        //Boolean - Whether to show horizontal lines (except X axis)
        scaleShowHorizontalLines: true,

        //Boolean - Whether to show vertical lines (except Y axis)
        scaleShowVerticalLines: true,

        //Boolean - Whether the line is curved between points
        bezierCurve : true,

        //Number - Tension of the bezier curve between points
        bezierCurveTension : 0.4,

        //Boolean - Whether to show a dot for each point
        pointDot : true,

        //Number - Radius of each point dot in pixels
        pointDotRadius : 4,

        //Number - Pixel width of point dot stroke
        pointDotStrokeWidth : 1,

        //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
        pointHitDetectionRadius : 20,

        //Boolean - Whether to show a stroke for datasets
        datasetStroke : true,

        //Number - Pixel width of dataset stroke
        datasetStrokeWidth : 2,

        //Boolean - Whether to fill the dataset with a colour
        datasetFill : true,

        //String - A legend template
        legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

      };


      _.forEach(groupByDate, function(n, key){

        chartDataLine.labels.push(key.toString());

        answersPerDay.push(n.length);


      });

      chartDataLine.datasets.push({
        label: "Respuestas",
        fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
        data : answersPerDay
      });

      new Chart(ctxLine).Line(chartDataLine, optionschartLine);

    });

    var listAnswers = function(data) {

      self.tableParams = new NgTableParams({
        page : 1,
        count : 20,
        sorting : {
	        dateTime : 'desc'
        },
        filter : {
          name : ''
        }
      }, {
        defaultSort : 'desc',
        data : data,
	      counts : [10, 50, 100, 1000, 5000]
      });
    };


    
    //Filters
    $scope.filterLocationSelected = function(locationID){
      //console.log(locationID);

      var filterLocationSelected = _.pluck(_.filter($scope.surveyLocation, {'Selected' : true}), 'id'),
          locationFiltered;


      if (filterLocationSelected.length) {

        locationFiltered = _.findByValues($scope.answers, "locationID", filterLocationSelected);
        listAnswers (locationFiltered);
        $scope.answerByLocatonSize = locationFiltered.length;

      } else {

        $scope.answerByLocatonSize = false;
        listAnswers ($scope.answers);
      }
    };

		$scope.formatDate = function (date) {
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var ampm = hours >= 12 ? 'pm' : 'am';
			hours = hours % 12;
			hours = hours ? hours : 12; // the hour '0' should be '12'
			minutes = minutes < 10 ? '0'+minutes : minutes;
			var strTime = hours + ':' + minutes + ' ' + ampm;
			return  date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear() + "  " + strTime;
		};

    $scope.printReport = function(){
      $timeout(function() {
        $window.print();
      })
    };

    $scope.exportExcel = function() {
      var dateReport = new Date();
      $("#printArea").table2excel({
        'name': "Resultados de la encuesta " + $scope.surveyInfo.name + '-' + dateReport.yyyymmdd()
    });

  }


  }]);
