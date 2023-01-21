const dummy = () => {
  return 1
}
const totalLikes = (blogs) => {
  return blogs.reduce((acc,cur) => {
    acc += cur['likes']
    return acc
  },0)
}

const favoriteBlog = (blogs) => {
  let fav = blogs[0]
  for (let i = 0; i < blogs.length; i++) {
    if(blogs[i].likes > fav.likes){
      fav = blogs[i]
    }
  }
  let res = {
    title: fav.title,
    author: fav.author,
    likes: fav.likes
  }
  return res
}

const mostBlogs = (blogs) => {
  const reduced = blogs.reduce((acc,cur) => {
    acc[cur.author] ? acc[cur.author]++ : acc[cur.author]=1
    return acc
  }, {})
  let top = null
  for (const author in reduced) {
    if(!top){
      top  = { author: author, blogs: reduced[author] }
    }
    if(top && reduced[author] > top.blogs){
      top.author = author
      top.blogs = reduced[author]
    }
  }
  return top
}

const mostLikes = (blogs) => {
  const reduced = blogs.reduce((acc,cur) => {
    acc[cur.author] ? acc[cur.author]+=cur.likes : acc[cur.author]=cur.likes
    return acc
  }, {})
  let top = null
  for (const author in reduced) {
    if(!top){
      top  = { author: author, likes: reduced[author] }
    }
    if(top && reduced[author] > top.likes){
      top.author = author
      top.likes = reduced[author]
    }
  }
  return top
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
