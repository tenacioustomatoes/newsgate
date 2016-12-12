angular.module('newsgate.trends', [])
.controller('TrendsController', function($scope, $rootScope, Data) {
  $scope.data = Data.process(Data.test2, 'init');

  $rootScope.$on('updateData', () => {
    console.log('Queried Trend Term:', Data.google[1].query);
    $scope.data = Data.process(Data.google[1]);
  });
})
.directive('trendGraph', function() {
  console.log('isD3 Loaded?', d3);
  return {
    restrict: 'E',
    scope: { data: '=' },
    link: function(scope, element) {
      // HardCoded data input
      // Import from scope
      data = scope.data;

      // define the space that holds the graph
      var margin = {top: 20, right: 20, bottom: 30, left: 50},
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

      // define ranges for axis
      var x = d3.scaleTime().range([0, width]);
      var y = d3.scaleLinear().range([height, 0]);

      // create svg
      var svg = d3.select(element[0]).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

      // Turn off area shade - it is broken
      // create area path under curve
      // svg.append("path")
      //   .datum(data)
      //   .attr("class", "area");

      // add line path
      svg.append("path")
        .data([data])
        .attr("class", "line");

      // draw the x Axis
      svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(d3.timeDay, 1).tickFormat(d3.timeFormat("%b %d")));

      // draw the y Axis
      svg.append("g")
        .attr("class", "yAxis")
        .call(d3.axisLeft(y).ticks(5));

      // render data whenever it changes
      scope.$watch('data', function(currentData, previousData) {
        console.log('data was updated!');
        data = scope.data;

        // line function
        var valueLine = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.value); });

        // Turn off area shade - it is broken
        // var area = d3.area()
        //   .x(function(d) { return x(d.date); })
        //   .y0(height)
        //   .y1(function(d) { return y(d.value); });

        // scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.value; })]);

        var oldLine = svg.selectAll(".line").attr("d");
        var path = svg.selectAll(".line").data([data]);
        var pathLine = path.attr("d", valueLine).attr("d").slice();

        // On first load, create a straight line on xaxis
        if (!oldLine) {
          var dataCopy = data.slice();
          dataCopy.forEach((point) => {
            point.value = 0;
          });

          var oldLine = svg.selectAll(".line").data([dataCopy]).attr("d", valueLine).attr("d").slice();
        }

        // animate path change to new render
        path
        .transition()
          .duration(2000)
          .attrTween("d", function(d) {
            return d3.interpolatePath(oldLine, pathLine);
          });

        // animate xaxis change to new render
        svg.select(".xAxis").transition().duration(2000)
          .call(d3.axisBottom(x).ticks(d3.timeDay, 1).tickFormat(d3.timeFormat("%b %d")));

        // animate yaxis change to new render
        svg.select(".yAxis").transition().duration(2000)
          .call(d3.axisLeft(y).ticks(5));


      });

    }
  };
});
