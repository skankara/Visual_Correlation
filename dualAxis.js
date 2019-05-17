function dualAxis(file1name, file2name, country)
{
//var country = "Russia";

//var file1name = 'transpose/co2_emissions_tonnes_per_person.csv';
//var file2name = 'transpose/population_density_per_square_km.csv';

let yleft ="";
let yright = "";

if( file1name == "child_mortality_0_5_year_olds_dying_per_1000_born.csv" )
{	yleft = "Child Mortality";
}else if( file1name == "children_per_woman_total_fertility.csv" )
{	yleft = "Children/Woman";	
}else if( file1name == "co2_emissions_tonnes_per_person.csv" )
{yleft = "CO2 emissions tonnes/person";
}else if( file1name == "income_per_person_gdppercapita_ppp_inflation_adjusted.csv" )
{ yleft ="Income/person";
}else if( file1name == "population_density_per_square_km.csv" )
{ yleft = "Population Density/sqkm";
}else
{	yleft = "Energy Use/person";
}

if( file2name == "child_mortality_0_5_year_olds_dying_per_1000_born.csv" )
{	yright = "Child Mortality";
} else if( file2name == "children_per_woman_total_fertility.csv" )
{	yright = "Children/Woman";	
} else if( file2name == "co2_emissions_tonnes_per_person.csv" )
{ yright = "CO2 emissions tonnes/person";
} else if( file2name == "income_per_person_gdppercapita_ppp_inflation_adjusted.csv" )
{ yright ="Income/person";
} else if( file2name == "population_density_per_square_km.csv" )
{yright = "Population Density/sqkm";
}else
{	yright = "Energy use/person";
}

file1name = "transpose/"+ file1name ;
file2name = "transpose/"+ file2name ;
console.log("file1name : ",file1name);
console.log("file2name : ", file2name);
var margin = {top: 30, right: 0, bottom: 30, left: 50},
     width = 400 - margin.left - margin.right,
     height = 270- margin.top - margin.bottom;

//var parseDate = d3.utcParse("%Y-%m-%dT%H:%M:%S%Z")
//var formatDate = d3.timeFormat("%Y").parse;
//var formatDate = d3.timeFormat("%Y")
//var parseTime = d3.utcParse("%Y");
var parseDate = d3.timeFormat("%Y");

var x = d3.scaleLinear().range([0, width]);
//var x = d3.scaleTime().range([0, width]);
var y0 = d3.scaleLinear().range([height, 0]);
var y1 = d3.scaleLinear().range([height, 0]);

var xAxis = d3.axisBottom().scale(x).ticks(5);

var yAxisLeft = d3.axisLeft().scale(y0).ticks(5);

var yAxisRight = d3.axisRight().scale(y1).ticks(5); 

var valueline = d3.line()
    .x(function(d) {  //return x(new Date(d.year));
		return x(d.year);
	})
    .y(function(d) { return y0(+d.file1d); });
    
var valueline2 = d3.line()
    .x(function(d) { //return x(new Date(d.year));
		return x(d.year);
	})
    .y(function(d) {//console.log(d.year, d.file2d); 
	return y1(+d.file2d); });
  
let svg = d3.selectAll(".l_axis")
        .attr("width", width )
        .attr("height", height )
		
		//.append("g")
		
		.attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")")
		
		
let rect  = svg.append("rect")
				  //.attr("align","center")
				.attr("width",width + margin.left + margin.right)
				.attr("height",  height + margin.top + margin.bottom)
				//.style("background","white");
				//.style("float",right)
				.attr("opacity",1)
				.attr("fill", "white");
				
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

d3.queue()
.defer(d3.csv, file1name)
.defer(d3.csv, file2name)
.await(function(error,file1,file2){
	if(error){ console.error("File open error : "+error);}
	else{
		file1.forEach(function(d1){
			/*if(d1.country == country){ 
				var year =1950;
				while(year<=2018){
					//d1.year = formatDate(parseDate(year))
					//d1.year = parseTime(year);
					d1.year12 = +year;
					d1.file1d = + d1[year];
					//console.log(d1.year);
					year=year+1;
				}}	*/
				
			//d1.year = d1.year;
			d1.year = parseDate(new Date(d1.year));
			d1.file1d = +d1[country];
			//console.log(d1.year, d1.file1d);
		});
		file2.forEach(function(d2){
			//d2.year = +d2['year'];
			d2.year = parseDate(new Date(d2.year));
			d2.file2d = +d2[country];
			console.log(d2.year, d2.file2d);
			/*if(d2.country == country){ 
				var year =1950;
				while(year<=2018){
					//d2.year = formatDate(parseDate(year))
					//d2.year = parseTime(year);
					d2.year2 =+year;
					d2.file2d = + d2[year];
					//console.log(d2[year]);
					year=year+1;
				}			
			}*/
		});
		//x.domain([new Date(1950),new Date(2018)]);
		x.domain(d3.extent(file1, function(d) { return d.year; }));
		y0.domain([0, d3.max(file1, function(d) {return Math.max(d.file1d); })]); 
		y1.domain([0, d3.max(file2, function(d) { return Math.max(d.file2d); })]);
		
		svg.append("path")        // Add the valueline path.
			.style("stroke", "green")
			.attr("d", valueline(file1));
		
		svg.append("path")        // Add the valueline2 path.
			.style("stroke", "red")
			.attr("d", valueline2(file2));
			
		svg.append("text")
			.attr("x", width/2 )
			.attr("y", 0-(margin.top/2))
			.attr("text-anchor", "middle")
			.text(country);
		
		svg.append("g")            // Add the X Axis
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);
		svg.append("text")
			.attr("transform","translate(" + (width/2) + " ," + (height + margin.bottom- 2) + ")")
			.style("text-anchor", "middle")
			.text("Year");	
		

		svg.append("g")			
		.attr("class", "y axis")			
		.style("fill", "steelblue")
			.call(yAxisLeft);
		svg.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 0 - margin.left)
			.attr("x",0 - (height / 2))
			.attr("dy", "1em")
			.style("text-anchor", "middle")
			.text(yleft)
			.attr("fill","green");
		
		
		svg.append("g")				
			.attr("class", "y axis")	
			.attr("transform", "translate(" + width + " ,0)")	
			.style("fill", "red")		
			.call(yAxisRight);
		svg.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", width - margin.right+50)
			.attr("x",0 - (height / 2))
			.attr("dy", "1em")
			.style("text-anchor", "middle")
			.text(yright)
			.attr("fill","red");
			//.style("fill", "white");
		svg.moveToFront();
		
	}});
}