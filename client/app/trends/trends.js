angular.module('newsgate.trends', [])
.controller('TrendsController', function($scope, $rootScope, Data) {
  // $scope.data = Data.process(Data.google[1],'init');
  $scope.data = Data.process(Data.google[0]);
  $scope.title = Data.google[0].query;

  $rootScope.$on('updateData', () => {
    console.log('Queried Trend Term:', Data.google[0].query);
    $scope.data = Data.process(Data.google[0]);
    $scope.title = Data.google[0].query;
  });
})
.directive('trendGraph', function() {
  console.log('isD3 Loaded?', d3);
  // return the custom directive
  return {
    restrict: 'E', // only matches element name
    scope: { data: '=' }, // isolate scope. essentially removes the two way data binding
    link: function(scope, element) {
      /////////////////////////////////////////////////////////////////////////
      // START HERE
      /////////////////////////////////////////////////////////////////////////

      // known issues: graph updates correctly on the first attempt.
        // but if the graph is reloaded without submiting new data it will not correctly render

      // Import from scope
        // trend-graph data="data" -> scope.data = "data"
      data = scope.data;

      // define the margins and dimensions for the svg element
        // it is a D3 convention to define the margins in an object
      var margin = {top: 20, right: 20, bottom: 30, left: 50},
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

      /////////////////////////////////////////////////////////////////////////
      // Define the scale for the axis
      /////////////////////////////////////////////////////////////////////////

      // define ranges and scale for axis
        // When you define a scale in D3, it allows you to translate your data
        // in terms of pixels on the svg element.
          // EXAMPLE: var x defines a scale where a date object can be translated
          // to a point that is between 0 and the defined width
      var x = d3.scaleTime().range([0, width]); // range means you are describing the range of pixels on the svg graph
      var y = d3.scaleLinear().range([height, 0]);

      /////////////////////////////////////////////////////////////////////////
      // Creating an SVG element
      /////////////////////////////////////////////////////////////////////////

      // D3 is designed to used with method chaining. Almost all methods in D3 return the object after they are modified

      // 1) Create svg element. element[0] represents the custom directive.
      // in this case, it is the tag <trend-graph data="data"></trend-graph> (located in trends.html)

      var svg = d3.select(element[0]).append("svg") // 2) After selecting our trend-graph tag, we append an svg element to it
      .attr('width', width + margin.left + margin.right) // 3) give the svg element attribute width and set it (if you call .attr('width') it will return what the attribute is set to)
      .attr('height', height + margin.top + margin.bottom) // 4) give the svg element attribute width and set it
      .append('g') // 5) append 'g' to the svg element. G represents a group that should be rendered to the svg element
      .attr('class', 'graphSVG') // 6) give the g element attribute class and set it
      .attr('transform', // 7) give the g element attribute class and set it.
      'translate(' + margin.left + ',' + margin.top + ')'); // this will set the g element within the margin of svg element

      /////////////////////////////////////////////////////////////////////////
      // Creating an Trend Graph elements
      /////////////////////////////////////////////////////////////////////////

      // currently, var svg is looking something like this:

      // <svg>
      //  <g></g> <--- currently selected element
      // </svg>


      // Anything appending to svg, will append it to 'currently selected element'

      // add line path [REFERENCE 1]
      // A path is an element that needs the attr 'd' so a line can be rendered on svg
      svg.append("path") // when you append to svg, it will append to G.
        .data([data])
        .attr("class", "line");

      // draw the x Axis
      svg.append('g')
        .attr('class', 'xAxis')
        .attr('transform', 'translate(0,' + height + ')') // draw this starting at the bottom of the svg element
        .call(d3.axisBottom(x).ticks(d3.timeDay, 1).tickFormat(d3.timeFormat('%b %d')));
        // build an axisBottom with the scale x
        // set the notches on the axis to respond to (days, and increment by 1)
          // if your data set contains 12 days of information. it will create 12 notches
          // because each day incrementing by 1 over 12 days = 12 notches
        // tickformat lets you format the text that appears below a notch
        // check the D3 api for list of available formats


      // draw the y Axis
      // no need to translate because the g element is already in the place it needs to be
      svg.append('g')
        .attr('class', 'yAxis')
        .call(d3.axisLeft(y).ticks(5)); // always set 5 ticks that are evenly spread over your data
        // our data set for google trends has a max value of 100 and a min value of 0
        // naturally, our ticks will display 20,40,60,80,100


      /////////////////////////////////////////////////////////////////////////
      // Rendering the Graph
      /////////////////////////////////////////////////////////////////////////

      // Our render function is placed within scope.$watch to emulate one-way data binding
      // I believe D3 does not work with two way data binding. (needs annotation)
      // most sources show the rendering stage of a D3 graphic to be within this $watch event

      // this is an artifact of attempting to fix rendering issues
      var nextOldLine, nextOldArea;

      // When data is changed, run this function
      scope.$watch('data', function(currentData, previousData) {
        console.log('data was updated! Data:', data);
        data = scope.data;

        // scale the range of the data
          // extent returns a tuple [min value, max value] of your data set
        x.domain(d3.extent(data, function(d) { return d.date; })); // domain means the range of your data
        y.domain([0, d3.max(data, function(d) { return d.value; })]);

        // area function
        // requires understanding of var valueLine. see [REFERENCE 2]
        var area = d3.area()
          .x(function(d) { return x(d.date); })
          .y0(height)
          .y1(function(d) { return y(d.value); });

        // line function -> generates a 'd' string
        // The path element @ [REFERENCE 1 -> line 81 at time of writing]
        // requires an attribute 'd' to render. This d attribute is a string that is a set
        // of instructions to draw a line on the svg element
          // See: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d
        var valueLine = d3.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y(d.value); });

        // Explanation for area function [REFERENCE 2]
        // the area function looks similar to the line function.
        // x sets both the top and bottom line accessors
        // y0 sets the bottom line accessors (where the valueLine, y is set to both top and bottom line accessors)
        // y1 sets the top line accessors
        // the way this area 'd' string is generated is the following:
          // for each point x in our data set (will be called pointx for each iteration, and similarly -> pointy for y)
            // point A is a point at the bottom of the graph with y = hieght and x = pointx (y0 = height, meaning that it is at the bottom of the graph)
            // point B is a point at y = pointy and x = pointx
            // draw a line between points A and B
          // when finished drawing a line between points A and B with each iteration
          // we will have produced an area! -> D3 abstracts this for us and simply returns the rendered 'd' string that our path

        // find before and after line/area
        // this is an artifact of attempting to fix rendering issues
        var oldLine = nextOldLine;
        var oldArea = nextOldArea;

        // create area path under curve
        // NOTE: YOU MUST RENDER YOUR AREA BEFORE YOU RENDER THE line
        var drawnArea = svg.append('path').datum(data) // for how datum works: https://github.com/d3/d3-selection/blob/master/README.md#selection_datum
        .attr('class', 'area')
        .attr('fill-opacity', 0)
        .attr('d', area); // use the area function to generate 'd' using the data passed to datum.

        // this is an artifact of attempting to fix rendering issues
        nextOldArea = drawnArea;


        var path = svg.selectAll('.line').data([data]); // select our line path then add our data from the scope
        var pathLine = path.attr('d', valueLine).attr('d').slice(); // obtain the pathLine 'd' and make a copy
        nextOldLine = svg.selectAll('.line').attr('d'); // artifact of attempting to fix rendering issues

        // artifact of attempting to fix rendering issues
        if (oldLine === pathLine) {
          console.log('same line was rendered!');
          oldLine === null;
        }

        // On first load or if oldLine is invalid, create a straight line on xaxis
        if (!oldLine) {
          console.log('create init oldLine');
          var dataCopy = data.slice();
          dataCopy.forEach((point) => {
            point.value = 0;
          });

          var oldLine = svg.selectAll('.line').data([dataCopy]).attr('d', valueLine).attr("d").slice();
        }

        // remove previous area then chain animate path to new render
        // Transition should be added AFTER the data is binded to the element and BEFORE the change of any attributes
        if (oldArea) {
          oldArea.transition().duration(500).attr('fill-opacity', 0).remove(); // removes the area after the transition ends
        }

        // console.log('oldLine:', oldLine);
        // console.log('pathLine:', pathLine);

        // animate the path change from previous line to new line
        path
        .transition()
          .duration(2000)
          .attrTween('d', function(d) {
            // d3.interpolatePath is a CUSTOM interpolation function made by https://github.com/pbeshai/d3-interpolate-path
            // it works better than the stock interpolation
            return d3.interpolatePath(oldLine, pathLine);
          })
          .on('end', function() {
            // after the line is drawn, we animate the area fill-opacity to 1
            drawnArea.transition().duration(500).attr('fill-opacity', 1);
          });


        // animate xaxis change to new render
        svg.select('.xAxis').transition().duration(2000)
          .call(d3.axisBottom(x).ticks(d3.timeDay, 1).tickFormat(d3.timeFormat("%b %d")));

        // animate yaxis change to new render
        svg.select('.yAxis').transition().duration(2000)
          .call(d3.axisLeft(y).ticks(5));

      });

    }
  };
});
