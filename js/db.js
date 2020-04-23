// Offline data
db.enablePersistence().catch((err) => {
  if (err.code === "failed-precondition") {
    // Probably multiple tabs open at once
    console.log("Persistance failed");
  } else if (err.code === "unimplemented") {
    // Lack of browser support
    console.log("presistance is not available");
  }
});

// Real time listener
db.collection("recipes").onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    console.log(change.doc.data());
    if (change.type === "added") {
      // Add the document to the web page
      renderRecipe(change.doc.data(), change.doc.id);
    }

    if (change.type === "removed") {
      // Remove the document data from the web page
      removeRecipe(change.doc.id);
    }
  });
});

// add new recipe
const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const recipe = {
    title: form.title.value,
    ingredients: form.ingredients.value,
  };

  db.collection("recipes")
    .add(recipe)
    .catch((err) => console.log(err));

  form.title.value = "";
  form.ingredients.value = "";
});

// delete a recipe
const recpieContainer = document.querySelector(".recipes");
recpieContainer.addEventListener("click", (e) => {
  if (e.target.tagName === "I") {
    const id = e.target.getAttribute("data-id");
    db.collection("recipes").doc(id).delete();
  }
});
