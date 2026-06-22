let chart;

function calculateNutrition(){

    const weight = Number(document.getElementById("weight").value);
    const height = Number(document.getElementById("height").value);
    const age = Number(document.getElementById("age").value);
    const gender = document.getElementById("gender").value;
    const activity = Number(document.getElementById("activity").value);
    const goal = document.getElementById("goal").value;

    if(!weight || !height || !age){
        alert("Vui lòng nhập đầy đủ thông tin");
        return;
    }

    const bmi = weight / ((height/100)**2);

    let bmr;

    if(gender === "male"){
        bmr = 10*weight + 6.25*height - 5*age + 5;
    }else{
        bmr = 10*weight + 6.25*height - 5*age - 161;
    }

    const tdee = bmr * activity;

    let calories;

    switch(goal){

        case "lose":
            calories = tdee - 500;
            break;

        case "gain":
            calories = tdee + 500;
            break;

        case "muscle":
            calories = tdee + 300;
            break;

        default:
            calories = tdee;
    }

    let protein;

    if(goal === "lose"){
        protein = weight * 2;
    }else if(goal === "muscle"){
        protein = weight * 2.2;
    }else{
        protein = weight * 1.8;
    }

    const fat = (calories * 0.25) / 9;

    const carbs =
    (calories - protein*4 - fat*9) / 4;

    const sugar =
    (calories * 0.05) / 4;

    document.getElementById("bmiResult").innerText =
        bmi.toFixed(1);

    document.getElementById("tdeeResult").innerText =
        Math.round(tdee);

    document.getElementById("calorieResult").innerText =
        Math.round(calories);

    document.getElementById("proteinResult").innerText =
        Math.round(protein) + " g";

    document.getElementById("carbResult").innerText =
        Math.round(carbs) + " g";

    document.getElementById("fatResult").innerText =
        Math.round(fat) + " g";

    document.getElementById("sugarResult").innerText =
        Math.round(sugar) + " g";

    if(chart){
        chart.destroy();
    }

    chart = new Chart(
        document.getElementById("macroChart"),
        {
            type:"doughnut",
            data:{
                labels:[
                    "Protein",
                    "Carbs",
                    "Fat"
                ],
                datasets:[{
                    data:[
                        protein,
                        carbs,
                        fat
                    ]
                }]
            }
        }
    );
}