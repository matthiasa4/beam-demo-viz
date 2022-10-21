var ctx = document.getElementById("myChart").getContext('2d');
ctx.canvas.width  = window.innerWidth*0.9;
ctx.canvas.height = window.innerHeight*0.9;

// http://google.github.io/palette.js/
colourpalette = palette('cb-Set3', 10).map(function(hex) {
    return '#' + hex;
})

var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: []
    },
    options: {
        scales: {
            xAxes : [{
                type: 'time'
            }],
            yAxes: [{
                ticks: {
                    beginAtZero:true
                },
                gridLines: {
                    display:false
                }
            }]
        },        
        responsive: false
    }
});

function renderChart(doc) {
    let data = doc.data().count;
    let label = doc.data().language;
    let window_start = doc.data().window_start;
    let window_end = doc.data().window_end;
    
    let dataset = null;
    
    // Check if language already there
    myChart.data.datasets.forEach( function(ds) {
        if(ds.label == label) {
            dataset = ds;
        } 
    });

    // If language there: push data
    if(dataset) {
        dataset.data.push(
        {
            x: window_start,  y: data 
        }, 
        {                    
            x: window_end-1,  y: data 
        });
    }
    // If data not there: create new dataset
    else if (myChart.data.datasets.length < 10) {
        dataset = 
        {
            steppedLine: true,
            label: label,
            data: [
                {
                    x: window_start,  y: data 
                }, 
                {                    
                    x: window_end-1,  y: data 
                }
            ],
            borderWidth: 5,
            borderColor: colourpalette[myChart.data.datasets.length],
            backgroundColor: 'rgb(255,255,255,0)'
        }
        myChart.data.datasets.push(dataset);
    }

    // Sort by timestamp to have continuous graph
    dataset.data = dataset.data.sort(function(a,b){
        if(a.x == b.x) {
            if(a.y < b.y)
                return -1;
            if(a.y > b.y)
                return 1;
            else
                return 0;
        }
        if(a.x < b.x)
            return -1;
        if(a.x > b.x)
            return 1;
    });    

    myChart.update();
}

firebase.initializeApp({
    projectId: 'gde-front-end',
});
var db = firebase.firestore();
// real-time listener
db.collection('languages').orderBy('language').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        console.log(change.doc.data());
        renderChart(change.doc);
    });
});

