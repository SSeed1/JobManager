

let posts=[
{
	id: 1,
	title: 'Aocker for Rails',
	create_date:' 12 2012 10:00:00 AM'
},
{
	id: 2,
	title:'Zoctor for Gabb',
	create_date:' 02 2012 10:00:00 AM'
},
{
	id: 3,
	title:'HTML for rosrr',
	create_date:' 12 2020 10:00:00 AM'
},
{
	id: 4,
	title:'Aelp me',
	create_date:' 13 1999 10:00:00 AM'
},
]

function createPostsRows(posts) {
 $('#posts').html('')
 let rowsHtml = ''
 posts.forEach(function(post){
 rowsHtml +=
`<tr><td>${post.id}</td><td>${post.title}</td><td>${post.create_date}</td></tr
>`
 })
 $('#posts').html(rowsHtml)
 }

$('#sort-button1').click(function(event){
 posts = posts.sort(function(a, b) {
 if (a['title'] > b['title']) {
 	return 1
} else {
 return -1
 }
})
createPostsRows(posts)
 })

$('#sort-button2').click(function(event){
 posts = posts.sort(function(a, b) {
 if (a['title'] > b['title']) {
 	return -1
} else {
 return 1
 }
})
createPostsRows(posts)
 })

 $('#sort-button3').click(function(event){
 posts = posts.sort(function(a, b) {
 if (a['create_date'] > b['create_date']) {
 	return 1
} else {
 return -1
 }
})
createPostsRows(posts)
 })

  $('#sort-button4').click(function(event){
 posts = posts.sort(function(a, b) {
 if (a['create_date'] > b['create_date']) {
 	return -1
} else {
 return 1
 }
})
createPostsRows(posts)
 })

 $('#sort-button5').click(function(event){
 posts = posts.sort(function(a, b) {
 if (a['id'] > b['id']) {
 	return -1
} else {
 return 1
 }
})
createPostsRows(posts)
 })

 $('#sort-button6').click(function(event){
 posts = posts.sort(function(a, b) {
 if (a['id'] > b['id']) {
 	return 1
} else {
 return -1
 }
})
createPostsRows(posts)
 })

createPostsRows(posts)
