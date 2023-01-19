const listHelper = require('../utils/list_helper')

let blogs = [{
            "_id": "63c8576daa8cf7c2e3306f5b",
            "title": "first blog",
            "author": "auth1",
            "url": "www.unkown.com",
            "likes": 12,
            "__v": 0
        },
        {
            "_id": "63c85d9df3ffa283093be51d",
            "title": "second blog",
            "author": "auth1",
            "url": "www.unkown.com",
            "likes": 10,
            "__v": 0
        },
        {
            "_id": "63c85d9df3ffa283093be51d",
            "title": "second blog",
            "author": "auth1",
            "url": "www.unkown.com",
            "likes": 10,
            "__v": 0
        },
        {
            "_id": "63c85e6770510141c45a58fc",
            "title": "third blog",
            "author": "auth2",
            "url": "www.unkown.com",
            "likes": 8,
            "__v": 0
        },
        {
            "_id": "63c85e6770510141c45a58fc",
            "title": "third blog",
            "author": "auth2",
            "url": "www.unkown.com",
            "likes": 20,
            "__v": 0
        },
        {
            "_id": "63c85e6770510141c45a58fc",
            "title": "third blog",
            "author": "auth2",
            "url": "www.unkown.com",
            "likes": 20,
            "__v": 0
        },{
            "_id": "63c85e6770510141c45a58fc",
            "title": "third blog",
            "author": "auth2",
            "url": "www.unkown.com",
            "likes": 20,
            "__v": 0
        }
    ]


describe('Most Blogs', ()=>{
    test('return the author with the most blogs', ()=>{
        const most = listHelper.mostBlogs(blogs)
        const result = { author: 'auth2', blogs: 4 }
        expect(most).toEqual(result)
    })
    test('if authors have same amount of blogs return the first one', ()=>{
        const b = blogs.slice()
        b.pop()
        const most = listHelper.mostBlogs(b)
        const result = { author: 'auth1', blogs: 3 }
        expect(most).toEqual(result)
    })
})