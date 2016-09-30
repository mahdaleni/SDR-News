import firebase from 'firebase'
import url from 'url'

var config = {
  databaseURL: "https://hacker-news.firebaseio.com/"
};

firebase.initializeApp(config);
var database = firebase.database();

export function fetchHackerNewsPosts() {
  var posts = [];
  var topStories = database.ref('v0/topstories').limitToFirst(50);
  topStories.on('value', function(snapshot) {
    snapshot.val().forEach(function(itemId) {
      var postItem = database.ref('v0/item/'+itemId);
      postItem.on('value', function(snapshot) {
        var post = snapshot.val();
        post.domain = url.parse(post.url).hostname;
        post.num_comments = post.descendants;
        post.category = post.type;
        posts.push(post);
        console.log(post.title);
        console.log("Descendencts: " + post.descendants);
      });
    });
  });
  return posts;
}
