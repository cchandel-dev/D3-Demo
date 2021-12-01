var activedata;//used to hold the data for the actively displayed ticker.
var svg;// used to hold the svg.

//the code below is from https://github.com/jimmorey/httpcode/blob/main/public/client.js
//I copied about 30% of the code (tons of modifications)
//add an event listener to grab stock data from server
//remove the old display and throw on the new display
document.querySelector("#AAPL").addEventListener('click', ()=>{
    fetch('/updateClient1').then(response=>response.json()).then(x=>{
        x.stockPrice.forEach(d=>{
            d.Date = d.Date * 1;
            d.Close = d.Close * 1;
            d.Hover = d.Hover * 1;
        }
        )
        activedata = x.stockPrice;
        box = document.getElementById("scatter_area")
        removeChildren(box)
        OnNewDataLoad()
        //updates all of the dots
        let input = document.querySelector("#recent")
        update(data.filter(x=>x.Date < input.value))
    }
    )

}
)
//add an event listener to grab stock data from server
//remove the old display and throw on the new display
document.querySelector("#FB").addEventListener('click', ()=>{
    //0 = TSLA, 1 = AAPL, 2 = META, 3 = GME
    fetch('/updateClient2').then(response=>response.json()).then(x=>{
        x.stockPrice.forEach(d=>{
            d.Date = d.Date * 1;
            d.Close = d.Close * 1;
            d.Hover = d.Hover * 1;
        }
        )
        activedata = x.stockPrice;
        box = document.getElementById("scatter_area")
        removeChildren(box)
        OnNewDataLoad()
        //updates all of the dots
        let input = document.querySelector("#recent")
        update(data.filter(x=>x.Date < input.value))
    }
    )

}
)
/* 
https://publish.uwo.ca/~jmorey2/ece/d3Moore.html
the code below has been modified from the link above
20% modified
*/
function setup(w, h) {
    // set the dimensions and margins of the graph
    console.log(w)
    console.log(h)
    margin = {
        top: 10,
        right: 30,
        bottom: 45,
        left: 60
    }
    width = w - margin.left - margin.right
    height = h - margin.top - margin.bottom;

    // append the svg object to the body of the page
    svg = d3.select("#scatter_area").append("svg").attr("viewbox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`).attr('preserveAspectRatio', 'xMidYMid meet').attr("width", w).attr("height", h).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Read the data
    data = activedata;
    data.forEach(x=>{
        x.Date = x.Date * 1
        x.Close = x.Close * 1
    }
    )

    extentx = d3.extent(data.map(x=>x.Date))
    extenty = d3.extent(data.map(x=>x.Close))

    // Add X axis
    x = d3.scaleLinear().domain(extentx).range([0, width]);
    // text label for the x axis
    svg.append("text").attr("transform", `translate(${width / 2} , ${(height + margin.top + 30)})`).style("text-anchor", "middle").text("Date");
    svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x).tickFormat(d3.format("d")));
    svg.append("text").attr("transform", "rotate(-90)").attr("y", 0 - margin.left).attr("x", 0 - (height / 2)).attr("dy", "1em").style("text-anchor", "middle").text("Share Price (USD)");

    // Add Y axis
    y = d3.scaleLinear().domain(extenty).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

}
function update(data) {
    // Add dots
    svg.selectAll(".dot").data(data, d=>d.stockPrice).join(enter=>{
        let group = enter.append('g').attr('class', "dot")
        group.append('text').attr("class", "label").attr("font-size", "12").attr("text-anchor", "middle")//.attr("vertical-align","central")  //doesn't work
        .attr('transform', d=>`translate(${x(d.Date)},${y(d.Close)} )`).text(d=>d.Hover).attr('stroke', "grey").attr("opacity", 0.75).on("mouseover", handleMouseOver).on("mouseout", handleMouseOut).transition().duration('1500').attr("opacity", 0.05).attr('index', (d,i)=>i)
        group.append("circle").attr("cx", d=>x(d.Date)).attr("cy", d=>y(d.Close)).attr("r", 3).style("fill", "#69b3a2")
    }
    , update=>{
        let group = update.select("text").attr("opacity", 0)
    }
    , remove=>remove.attr("opacity", 0.75).transition().duration(1000).attr("opacity", 0).remove())
}
// Create Event Handlers for mouse
function handleMouseOver(d) {
    d3.select(this).transition().duration('50').attr('stroke', "red").attr("font-size", "18").attr("opacity", 0.75)
    let index = this.getAttribute("index");
    activedata[index].Hover++;
}
function handleMouseOut(d) {
    d3.select(this).transition().duration('50').attr('stroke', "grey").attr("opacity", 0.75).transition().duration('1000').attr("opacity", 0.05)
}

let removeChildren = (element)=>{
    while (element.hasChildNodes()) {
        element.removeChild(element.firstChild);
    }
}

var svg, y, x, width, height, extentx, extenty;
/* start up ------------------------------------*/

function OnNewDataLoad() {
    const box = document.getElementById("scatter_area")
    setup(box.offsetWidth, box.offsetHeight)
    update(data.filter(x=>x.Date < [0]))

    window.onresize = ()=>{
        removeChildren(box)
        setup(box.offsetWidth, box.offsetHeight)
        update(data.filter(x=>x.Date < input.value))
    }
    let input = document.querySelector("#recent")
    input.setAttribute("max", extentx[1])
    input.setAttribute("min", extentx[0])
    input.addEventListener('change', event=>{
        document.getElementById("maxyear").innerHTML = input.value
        update(data.filter(x=>x.Date < input.value))
    }
    )
    input.addEventListener('mousemove', event=>{
        //console.log("event", input,event)
        document.getElementById("maxyear").innerHTML = input.value
        update(data.filter(x=>x.Date < input.value))
    }
    )
}
