
//GET ************************************************************/
fetch('http://localhost:8000/feed/posts')
  .then(r => r.json())
  .then(data => console.log(data))
  .catch(e => console.log("Booo"));

//POST ************************************************************/
fetch('http://localhost:8000/feed/post', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'aaaa',
    content: 'ddd'
  })
}).then(r => {
  return r.json();
})
  .then(data => console.log(data))
  .catch(e => console.log(e));
//******************************************************************/