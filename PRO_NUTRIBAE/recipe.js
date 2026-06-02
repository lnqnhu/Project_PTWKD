function openRecipe(
name,
image,
time,
cal,
serving,
ingredients,
steps
){

document.getElementById("recipeName").innerText=name;

document.getElementById("recipeImg").src=image;

document.getElementById("recipeTime").innerText=time;

document.getElementById("recipeCal").innerText=cal;

document.getElementById("recipeServing").innerText=serving;

document.getElementById("recipeIngredients").innerText=ingredients;

document.getElementById("recipeSteps").innerText=steps;

document.getElementById("recipeModal").style.display="block";

}

function closeRecipe(){

document.getElementById("recipeModal").style.display="none";

}