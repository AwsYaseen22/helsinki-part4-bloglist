const listHelper = require('../utils/list_helper')
describe('favorite blog', ()=>{
    test('fist blog has the most likes', ()=>{
        const blogs = [{
            "_id": "63c8576daa8cf7c2e3306f5b",
            "title": "first blog",
            "author": "unknown",
            "url": "www.unkown.com",
            "likes": 12,
            "__v": 0
        },
        {
            "_id": "63c85d9df3ffa283093be51d",
            "title": "second blog",
            "author": "unknown",
            "url": "www.unkown.com",
            "likes": 10,
            "__v": 0
        },
        {
            "_id": "63c85e6770510141c45a58fc",
            "title": "third blog",
            "author": "unknown",
            "url": "www.unkown.com",
            "likes": 8,
            "__v": 0
        },]
        const result = listHelper.favoriteBlog(blogs)
        const fav = {
            title: "first blog",
            author: "unknown",
            likes: 12,
        }
        expect(result).toEqual(fav)
    })
    test('with blogs with the same likes return the first one', ()=>{
        const blogs = [{
            "_id": "63c8576daa8cf7c2e3306f5b",
            "title": "first blog",
            "author": "unknown",
            "url": "www.unkown.com",
            "likes": 12,
            "__v": 0
        },
        {
            "_id": "63c85d9df3ffa283093be51d",
            "title": "second blog",
            "author": "unknown",
            "url": "www.unkown.com",
            "likes": 12,
            "__v": 0
        },
        {
            "_id": "63c85e6770510141c45a58fc",
            "title": "third blog",
            "author": "unknown",
            "url": "www.unkown.com",
            "likes": 8,
            "__v": 0
        },]
        const result = listHelper.favoriteBlog(blogs)
        const fav = {
            title: "first blog",
            author: "unknown",
            likes: 12,
        }
        expect(result).toEqual(fav)
    })
})