fetch("./inc/header.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.querySelector("#header").innerHTML = data;
  })
  .catch(error => console.log(console.log(error)));

fetch("./inc/footer.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.querySelector("#footer").innerHTML = data;
  })
  .catch(error => console.log(console.log(error)));