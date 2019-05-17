function index_population(filename2, year,filename1)
{
	console.log("filename2 : ",filename2);
	console.log("filename1 : ",filename1);
	var format = d3.format(","); //number formatting
	filename1_read = "data/" + filename1 ;
	filename2_read = "data/"+filename2 ;
	
// Set tooltips
var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return "<strong style = 'color:darkOrange'>Country: </strong><span class='details' style = 'color:darkOrange'>" + d.properties.name 
						+ "<br></span>" 
						+ "<strong style = 'color:darkOrange'>Value: </strong><span class='details' style = 'color:darkOrange'>" + format(d.population) +"</span>";
            })

//var margin = {top: -400, right: 0, bottom: 0, left: -1200},
            width = (window.screen.width/2) -70,
            height = 400 ;

console.log("filename2 : ", filename2);

let l_domain = [];
var legend_labels = [];

if( filename2 == "child_mortality_0_5_year_olds_dying_per_1000_born.csv" )
{
	l_domain = [0,5,10,15,20,25,30,35,40,45] ;
	legend_labels =["0+","5+","10+","15+","20+","25+","30+","35+","40+",">45"] ;
}
else if( filename2 == "children_per_woman_total_fertility.csv" )
{
	l_domain = [0,1,2,3,4,5,6,7,8,9] ;
	legend_labels =["0+","1+","2+","3+","4+","5+","6+","7+","8+",">9"] ;
}
else if( filename2 == "co2_emissions_tonnes_per_person.csv" )
{//00000000000000000000000
	l_domain = [0,5,10,15,20,25,30,35,40,45] ;
	legend_labels =["0+","5+","10+","15+","20+","25+","30+","35+","40+",">45"] ;
}
else if( filename2 == "income_per_person_gdppercapita_ppp_inflation_adjusted.csv" )
{
	l_domain = [0,1000,2000,3000,4000,5000,6000,7000,8000,9000] ;
	legend_labels =["0+","1000+","2000+","3000+","4000+","5000+","6000+","7000+","8000+",">9000"] ;
}
else if( filename2 == "population_density_per_square_km.csv" )
{
	l_domain = [10000,100000,500000,1000000,5000000,10000000,50000000,100000000,500000000,1500000000] ;
	legend_labels =["10000+","100000+","500000+","1000000+","5000000+","10000000+","50000000+","100000000+","500000000+","1500000000+"] ;
}
else
{
	l_domain = [0,5,10,15,20,25,30,35,40,45] ;
	legend_labels =["0+","5+","10+","15+","20+","25+","30+","35+","40+","45+"] ;
}


var color = d3.scaleThreshold()
    .domain(l_domain)
    //.range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)","rgb(33,113,181)","rgb(8,81,156)","rgb(8,48,107)","rgb(3,19,43)"]);
	.range(["00FF00","33FF00","66FF00","99FF00","CCFF00","FFFF00","FFCC00","FF9900","FF6600","FF3300","FF0000"]);
	
var path = d3.geoPath();

var l_svg = d3.select("#svg2")
			.attr('width',width)
			.attr('height',height)
            //.append('g')
            .attr('class', 'map');
l_svg.append('rect')
	.attr('width',width)
	.attr('height',height);
	//.attr('fill','white');
var g = l_svg.append("g");         

var projection = d3.geoMercator()
                   .scale(130)
                  .translate( [width / 2, height / 1.5]);

var path = d3.geoPath().projection(projection);

l_svg.call(tip);

queue()
    .defer(d3.json, "world-countries.json")
    .defer(d3.csv, filename2_read)
    .await(ready);

function ready(error, data, population) {
  var populationById = {};
  
  population.forEach(function(d) { populationById[d.id] = +d[year]; }); //Store country_id, population in populationById array
  data.features.forEach(function(d) { d.population = populationById[d.id] ; }); //to world countries it adds population feature
  
  var features = [];
  features = data.features ;
  var centroids = features.map(function (feature){
    return path.centroid(feature);});
	
  //adds paths to the map
  l_svg.append("g")
      .attr("class", "countries")
    .selectAll("path")
      .data(data.features)
    .enter().append("path")
      .attr("d", path)
      .style("fill", function(d) { return color(populationById[d.id]); })
      .style('stroke', 'white')
      .style('stroke-width', 3)
      .style("opacity",0.8)
      // tooltips
        .style("stroke","white")
        .style('stroke-width', 0.3)
        .on('mouseover',function(d){
          tip.show(d);

          d3.select(this)
            .style("opacity", 1)
            .style("stroke","white")
            .style("stroke-width",3);
        })
        .on('mouseout', function(d){
          tip.hide(d);

          d3.select(this)
            .style("opacity", 0.8)
            .style("stroke","white")
            .style("stroke-width",0.3);
        })
		.on('click',function(d){
			//console.log("d.properties.name  : "+ d.properties.name );
			//let url = "file:///D:/populationandco2/Side-side/linechart_1country.html?country=" +d.properties.name +"/filename="+filename1 +"/"+filename2;
			//window.open(url);
			d3.select(".l_axis").remove();
			graph_svg = d3.select("#svg3") ;
			var l_g = graph_svg.append("g").attr('class',"l_axis");
			l_g.append("class",dualAxis(filename1, filename2, d.properties.name))
											.enter()
												.data(centroids)
												.attr("transform", function(d) { //varcentroid = cost_data[state].centroid;
																				//centroid[0] = centroid[0] - 10;
																				
																				//return "translate(" + centroid + ")";
																				console.log("cx, cy : "+d);
																				 return "translate("+d[0]+","+d[1]+")";
					
					});
		});
	
	d3.selectAll(".l_legend").remove();
	let legend = l_svg.selectAll(".l_legend")
  .data(l_domain)
  .enter().append("g")
  .attr("class", "l_legend");

  var ls_w = 20, ls_h = 20;

  legend.append("rect")
  .attr("x", 20)
  .attr("y", function(d, i){ return height - (i*ls_h) - 2*ls_h;})
  .attr("width", ls_w)
  .attr("height", ls_h)
  .style("fill", function(d, i) { return color(d); })
  .style("opacity", 0.8);

  legend.append("text")
  .attr("x", 50)
  .attr("y", function(d, i){ return height - (i*ls_h) - ls_h - 4;})
  .text(function(d, i){ return legend_labels[i]; })
  .attr("fill", "white");
  
  var zoom = d3.zoom()
				//.scaleExtent([1, 15])
					.on('zoom',function(){
					//g.attr("transform","translate("+d3.eventScale+")");
					//g.attr('transform', 'translate(' + d3.event.transform.x + ',' + d3.event.transform.y + ') scale(' + d3.event.transform.k + ')');
					l_svg.attr("transform",d3.event.transform);
					
					//g.selectAll("path")
						//.attr("d",path.projection(projection));
				});
				l_svg.call(zoom);

  l_svg.append("path")
      .datum(topojson.mesh(data.features, function(a, b) { return a.id !== b.id; }))
       // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
      .attr("class", "names")
      .attr("d", path);
}
}